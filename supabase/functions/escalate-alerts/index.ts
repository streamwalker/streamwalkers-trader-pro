import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Starting alert escalation check...");

    // Fetch escalation rules
    const { data: rules, error: rulesError } = await supabase
      .from('alert_escalation_rules')
      .select('*')
      .eq('is_active', true);

    if (rulesError) throw rulesError;
    if (!rules || rules.length === 0) {
      console.log("No active escalation rules found");
      return new Response(
        JSON.stringify({ message: "No active escalation rules", escalated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${rules.length} active escalation rules`);

    // Get all team members for round-robin assignment
    const { data: teamMembers } = await supabase
      .from('profiles')
      .select('id')
      .not('id', 'is', null);

    if (!teamMembers || teamMembers.length === 0) {
      console.log("No team members found for reassignment");
      return new Response(
        JSON.stringify({ message: "No team members available", escalated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const escalatedAlerts: string[] = [];

    // Process each rule
    for (const rule of rules) {
      console.log(`Processing rule for severity: ${rule.severity}, time: ${rule.escalation_time_minutes} minutes`);

      // Calculate the cutoff time
      const cutoffTime = new Date();
      cutoffTime.setMinutes(cutoffTime.getMinutes() - rule.escalation_time_minutes);

      // Find alerts that need escalation
      const { data: alertsToEscalate, error: alertsError } = await supabase
        .from('scraping_alerts')
        .select('id, assigned_to, detected_at, assigned_at, acknowledged_at, last_escalated_at')
        .eq('severity', rule.severity)
        .not('status', 'in', '("resolved","false_positive")')
        .or(`detected_at.lt.${cutoffTime.toISOString()},last_escalated_at.lt.${cutoffTime.toISOString()}`);

      if (alertsError) {
        console.error(`Error fetching alerts for ${rule.severity}:`, alertsError);
        continue;
      }

      if (!alertsToEscalate || alertsToEscalate.length === 0) {
        console.log(`No alerts to escalate for severity: ${rule.severity}`);
        continue;
      }

      console.log(`Found ${alertsToEscalate.length} alerts to escalate for severity: ${rule.severity}`);

      // Escalate each alert
      for (const alert of alertsToEscalate) {
        // Find a different user to reassign to (round-robin)
        const availableMembers = teamMembers.filter(m => m.id !== alert.assigned_to);
        if (availableMembers.length === 0) {
          console.log(`No available members for reassignment for alert ${alert.id}`);
          continue;
        }

        // Simple round-robin: pick first available
        const newAssignee = availableMembers[0].id;

        // Update alert with escalation info
        const { error: updateError } = await supabase
          .from('scraping_alerts')
          .update({
            assigned_to: newAssignee,
            assigned_at: new Date().toISOString(),
            escalated: true,
            escalation_count: (alert.escalation_count || 0) + 1,
            last_escalated_at: new Date().toISOString(),
            escalated_to: newAssignee
          })
          .eq('id', alert.id);

        if (updateError) {
          console.error(`Error updating alert ${alert.id}:`, updateError);
          continue;
        }

        // Record in history
        await supabase
          .from('alert_status_history')
          .insert({
            alert_id: alert.id,
            old_status: 'pending',
            new_status: 'pending',
            notes: `Alert escalated due to exceeding ${rule.escalation_time_minutes} minutes threshold. Reassigned to new user.`
          });

        // Send email notification
        try {
          await supabase.functions.invoke('send-alert-assignment-email', {
            body: {
              alertId: alert.id,
              assignedToUserId: newAssignee,
              assignedByUserId: 'system',
              isBulk: false
            }
          });
        } catch (emailError) {
          console.error(`Error sending escalation email for alert ${alert.id}:`, emailError);
        }

        escalatedAlerts.push(alert.id);
        console.log(`Escalated alert ${alert.id} to user ${newAssignee}`);
      }
    }

    console.log(`Escalation complete. Total alerts escalated: ${escalatedAlerts.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        escalated_count: escalatedAlerts.length,
        escalated_alerts: escalatedAlerts
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in escalate-alerts function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
