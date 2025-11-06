import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

interface ReportData {
  totalScrapes: number;
  successRate: number;
  totalArticles: number;
  anomaliesDetected: number;
  topSources: { name: string; articles: number; successRate: number }[];
  recentAnomalies: any[];
  period: string;
}

async function fetchReportData(supabase: any, frequency: 'daily' | 'weekly'): Promise<ReportData> {
  const now = new Date();
  const startDate = frequency === 'daily' 
    ? new Date(now.getTime() - 24 * 60 * 60 * 1000)
    : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Fetch scraping logs
  const { data: logs } = await supabase
    .from('scraping_logs')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false });

  const totalScrapes = logs?.length || 0;
  const successfulScrapes = logs?.filter((log: any) => log.status === 'success').length || 0;
  const successRate = totalScrapes > 0 ? (successfulScrapes / totalScrapes) * 100 : 0;
  const totalArticles = logs?.reduce((sum: number, log: any) => sum + (log.new_articles || 0), 0) || 0;

  // Fetch recent anomalies
  const { data: anomalies } = await supabase
    .from('scraping_alerts')
    .select('*')
    .gte('detected_at', startDate.toISOString())
    .order('detected_at', { ascending: false })
    .limit(10);

  // Calculate source performance
  const sourceMap = new Map();
  logs?.forEach((log: any) => {
    if (!sourceMap.has(log.source_name)) {
      sourceMap.set(log.source_name, { total: 0, success: 0, articles: 0 });
    }
    const stats = sourceMap.get(log.source_name);
    stats.total++;
    if (log.status === 'success') stats.success++;
    stats.articles += log.new_articles || 0;
  });

  const topSources = Array.from(sourceMap.entries())
    .map(([name, stats]: [string, any]) => ({
      name,
      articles: stats.articles,
      successRate: stats.total > 0 ? (stats.success / stats.total) * 100 : 0
    }))
    .sort((a, b) => b.articles - a.articles)
    .slice(0, 5);

  return {
    totalScrapes,
    successRate: Math.round(successRate * 10) / 10,
    totalArticles,
    anomaliesDetected: anomalies?.length || 0,
    topSources,
    recentAnomalies: anomalies || [],
    period: frequency === 'daily' ? 'Last 24 Hours' : 'Last 7 Days'
  };
}

function generateHtmlEmail(data: ReportData): string {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'error': return '#f97316';
      default: return '#eab308';
    }
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Scraping Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .stat-card { background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
          .stat-title { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
          .stat-value { font-size: 32px; font-weight: bold; color: #1f2937; }
          .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
          .source-list { list-style: none; padding: 0; margin: 0; }
          .source-item { padding: 12px; background: #f9fafb; margin-bottom: 8px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
          .anomaly-item { padding: 15px; border-left: 4px solid; margin-bottom: 10px; border-radius: 4px; background: #f9fafb; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          h2 { color: #1f2937; margin-top: 30px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">📊 Scraping Report</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${data.period}</p>
          </div>
          
          <div class="content">
            <div class="stat-grid">
              <div class="stat-card">
                <div class="stat-title">Total Scrapes</div>
                <div class="stat-value">${data.totalScrapes}</div>
              </div>
              <div class="stat-card">
                <div class="stat-title">Success Rate</div>
                <div class="stat-value" style="color: ${data.successRate >= 80 ? '#10b981' : data.successRate >= 60 ? '#f59e0b' : '#ef4444'};">${data.successRate}%</div>
              </div>
              <div class="stat-card">
                <div class="stat-title">Articles Scraped</div>
                <div class="stat-value">${data.totalArticles}</div>
              </div>
              <div class="stat-card">
                <div class="stat-title">Anomalies</div>
                <div class="stat-value" style="color: ${data.anomaliesDetected > 0 ? '#ef4444' : '#10b981'};">${data.anomaliesDetected}</div>
              </div>
            </div>

            <h2>🏆 Top Performing Sources</h2>
            <ul class="source-list">
              ${data.topSources.map(source => `
                <li class="source-item">
                  <span><strong>${source.name}</strong></span>
                  <span>${source.articles} articles · ${Math.round(source.successRate)}% success</span>
                </li>
              `).join('')}
            </ul>

            ${data.recentAnomalies.length > 0 ? `
              <h2>⚠️ Recent Anomalies</h2>
              ${data.recentAnomalies.slice(0, 5).map((anomaly: any) => `
                <div class="anomaly-item" style="border-color: ${getSeverityColor(anomaly.severity)};">
                  <div style="font-weight: 600; margin-bottom: 5px;">${anomaly.message}</div>
                  <div style="font-size: 12px; color: #6b7280;">
                    ${anomaly.alert_type} · ${anomaly.severity} · ${new Date(anomaly.detected_at).toLocaleString()}
                  </div>
                </div>
              `).join('')}
            ` : '<p style="color: #10b981; font-weight: 600;">✅ No anomalies detected in this period!</p>'}
          </div>

          <div class="footer">
            <p style="margin: 0;">This is an automated report from your scraping monitoring system.</p>
            <p style="margin: 5px 0 0 0;">Report generated at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, frequency, isTest, automated } = await req.json();

    // If automated, fetch all active configs for this frequency
    if (automated) {
      const { data: configs } = await supabase
        .from('email_report_configs')
        .select('*')
        .eq('frequency', frequency)
        .eq('is_active', true);

      if (!configs || configs.length === 0) {
        return new Response(JSON.stringify({ success: true, message: 'No active configs found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const reportData = await fetchReportData(supabase, frequency);
      const htmlContent = generateHtmlEmail(reportData);
      
      let successCount = 0;
      let failureCount = 0;

      for (const config of configs) {
        try {
          await resend.emails.send({
            from: 'Scraping Monitor <onboarding@resend.dev>',
            to: [config.email],
            subject: `Scraping Report - ${reportData.period}`,
            html: htmlContent,
          });
          
          await supabase.from('email_report_configs').update({ last_sent_at: new Date().toISOString() }).eq('id', config.id);
          successCount++;
        } catch (error) {
          console.error(`Failed to send to ${config.email}:`, error);
          failureCount++;
        }
      }

      return new Response(JSON.stringify({ success: true, successCount, failureCount }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    console.log(`Generating ${frequency} scraping report for ${email}${isTest ? ' (test)' : ''}`);

    // Fetch report data
    const reportData = await fetchReportData(supabase, frequency || 'daily');

    // Generate HTML email
    const htmlContent = generateHtmlEmail(reportData);

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Scraping Monitor <onboarding@resend.dev>',
      to: [email],
      subject: `${isTest ? '[TEST] ' : ''}Scraping Report - ${reportData.period}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);

    // Update last_sent_at if not a test
    if (!isTest) {
      const { data: { user } } = await supabase.auth.admin.getUserById(
        req.headers.get('Authorization')?.replace('Bearer ', '') || ''
      );

      if (user) {
        await supabase
          .from('email_report_configs')
          .update({ last_sent_at: new Date().toISOString() })
          .eq('email', email)
          .eq('user_id', user.id);
      }
    }

    return new Response(
      JSON.stringify({ success: true, emailId: data?.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in send-scraping-report function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
