import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  alertId?: string;
  assignedToUserId: string;
  assignedByUserId: string;
  isBulk?: boolean;
  bulkAlertIds?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const isServiceRole = token === serviceRoleKey;

    if (!isServiceRole) {
      const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
        global: { headers: { Authorization: authHeader } }
      });
      const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
      if (claimsError || !claimsData?.claims) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { 
      alertId, 
      assignedToUserId, 
      assignedByUserId, 
      isBulk = false, 
      bulkAlertIds = [] 
    }: EmailRequest = await req.json();

    // Fetch assignee profile
    const { data: assigneeProfile } = await supabase
      .from('profiles')
      .select('email, display_name')
      .eq('id', assignedToUserId)
      .single();

    if (!assigneeProfile?.email) {
      throw new Error('Assignee email not found');
    }

    // Fetch assigner profile
    const { data: assignerProfile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', assignedByUserId)
      .single();

    const assignerName = assignerProfile?.display_name || 'Team member';

    let subject = '';
    let html = '';

    if (isBulk && bulkAlertIds.length > 0) {
      // Bulk assignment email
      const { data: alerts } = await supabase
        .from('scraping_alerts')
        .select('id, severity, alert_type, message, detected_at')
        .in('id', bulkAlertIds)
        .order('severity', { ascending: false });

      const criticalCount = alerts?.filter(a => a.severity === 'critical').length || 0;
      const errorCount = alerts?.filter(a => a.severity === 'error').length || 0;
      const warningCount = alerts?.filter(a => a.severity === 'warning').length || 0;

      subject = `🚨 ${bulkAlertIds.length} Alerts Assigned to You`;

      const alertRows = alerts?.map(alert => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; background: ${
              alert.severity === 'critical' ? '#fee2e2' : alert.severity === 'error' ? '#fed7aa' : '#fef3c7'
            }; color: ${
              alert.severity === 'critical' ? '#991b1b' : alert.severity === 'error' ? '#9a3412' : '#854d0e'
            };">
              ${alert.severity.toUpperCase()}
            </span>
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${alert.alert_type}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${alert.message}</td>
        </tr>
      `).join('') || '';

      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🚨 Multiple Alerts Assigned</h1>
            </div>
            
            <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${assigneeProfile.display_name || 'there'},</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                <strong>${assignerName}</strong> has assigned <strong>${bulkAlertIds.length}</strong> alerts to you that require your attention.
              </p>

              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; font-size: 18px;">Alert Summary</h3>
                <ul style="list-style: none; padding: 0; margin: 10px 0;">
                  ${criticalCount > 0 ? `<li style="padding: 5px 0;">🔴 <strong>${criticalCount}</strong> Critical alert${criticalCount > 1 ? 's' : ''}</li>` : ''}
                  ${errorCount > 0 ? `<li style="padding: 5px 0;">🟠 <strong>${errorCount}</strong> Error alert${errorCount > 1 ? 's' : ''}</li>` : ''}
                  ${warningCount > 0 ? `<li style="padding: 5px 0;">🟡 <strong>${warningCount}</strong> Warning alert${warningCount > 1 ? 's' : ''}</li>` : ''}
                </ul>
              </div>

              <h3 style="font-size: 16px; margin-top: 30px;">Assigned Alerts:</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Severity</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Type</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Message</th>
                  </tr>
                </thead>
                <tbody>
                  ${alertRows}
                </tbody>
              </table>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app') || ''}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  View All Alerts
                </a>
              </div>

              <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                This is an automated notification. Please do not reply to this email.
              </p>
            </div>
          </body>
        </html>
      `;
    } else if (alertId) {
      // Single alert assignment email
      const { data: alert } = await supabase
        .from('scraping_alerts')
        .select('*')
        .eq('id', alertId)
        .single();

      if (!alert) {
        throw new Error('Alert not found');
      }

      const severityEmoji = alert.severity === 'critical' ? '🔴' : alert.severity === 'error' ? '🟠' : '🟡';
      subject = `${severityEmoji} Alert Assigned: ${alert.alert_type}`;

      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">${severityEmoji} Alert Assigned to You</h1>
            </div>
            
            <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${assigneeProfile.display_name || 'there'},</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                <strong>${assignerName}</strong> has assigned a new alert to you that requires your attention.
              </p>

              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 120px;">Alert Type:</td>
                    <td style="padding: 8px 0;">${alert.alert_type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Severity:</td>
                    <td style="padding: 8px 0;">
                      <span style="display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; background: ${
                        alert.severity === 'critical' ? '#fee2e2' : alert.severity === 'error' ? '#fed7aa' : '#fef3c7'
                      }; color: ${
                        alert.severity === 'critical' ? '#991b1b' : alert.severity === 'error' ? '#9a3412' : '#854d0e'
                      };">
                        ${alert.severity.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Detected:</td>
                    <td style="padding: 8px 0;">${new Date(alert.detected_at).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message:</td>
                    <td style="padding: 8px 0;">${alert.message}</td>
                  </tr>
                </table>
              </div>

              ${alert.details && Object.keys(alert.details).length > 0 ? `
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; font-size: 16px;">Additional Details:</h3>
                  <pre style="background: #fff; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(alert.details, null, 2)}</pre>
                </div>
              ` : ''}

              <div style="text-align: center; margin-top: 30px;">
                <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app') || ''}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
                  View Alert
                </a>
                <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app') || ''}" 
                   style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Acknowledge
                </a>
              </div>

              <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                This is an automated notification. Please do not reply to this email.
              </p>
            </div>
          </body>
        </html>
      `;
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Alerts <onboarding@resend.dev>",
      to: [assigneeProfile.email],
      subject,
      html,
    });

    // Log notification
    const notificationLog = {
      alert_id: alertId || null,
      notification_type: isBulk ? 'bulk_assignment' : 'assignment',
      recipient_user_id: assignedToUserId,
      recipient_email: assigneeProfile.email,
      delivery_status: 'sent',
      resend_message_id: emailResponse.id,
    };

    await supabase
      .from('alert_notifications_log')
      .insert(notificationLog);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error sending alert assignment email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
