import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertPayload {
  type: 'low_success_rate' | 'execution_spike' | 'consecutive_failures';
  message: string;
  details: {
    successRate?: number;
    threshold?: number;
    executionTime?: number;
    averageTime?: number;
    source?: string;
    consecutiveFailures?: number;
  };
  timestamp: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const alertPayload: AlertPayload = await req.json();
    console.log('Received alert:', alertPayload);

    // Fetch active webhook configurations
    const { data: webhooks, error: webhookError } = await supabaseClient
      .from('webhook_configs')
      .select('*')
      .eq('is_active', true);

    if (webhookError) {
      console.error('Error fetching webhooks:', webhookError);
      throw webhookError;
    }

    if (!webhooks || webhooks.length === 0) {
      console.log('No active webhooks configured');
      return new Response(
        JSON.stringify({ message: 'No active webhooks configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter webhooks based on alert type
    const relevantWebhooks = webhooks.filter(webhook => {
      switch (alertPayload.type) {
        case 'low_success_rate':
          return webhook.alert_on_low_success_rate;
        case 'execution_spike':
          return webhook.alert_on_execution_spike;
        case 'consecutive_failures':
          return webhook.alert_on_consecutive_failures;
        default:
          return false;
      }
    });

    console.log(`Sending alert to ${relevantWebhooks.length} webhooks`);

    // Send to each webhook
    const results = await Promise.allSettled(
      relevantWebhooks.map(async (webhook) => {
        const payload = formatWebhookPayload(webhook.service_type, alertPayload);
        
        const response = await fetch(webhook.webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Webhook ${webhook.name} failed: ${response.status} - ${errorText}`);
        }

        console.log(`Successfully sent to ${webhook.name}`);
        return { webhook: webhook.name, status: 'success' };
      })
    );

    const summary = {
      totalWebhooks: relevantWebhooks.length,
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      results: results.map((r, i) => ({
        webhook: relevantWebhooks[i].name,
        status: r.status,
        error: r.status === 'rejected' ? r.reason?.message : undefined,
      })),
    };

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-webhook-alert:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function formatWebhookPayload(serviceType: string, alert: AlertPayload): any {
  const severityColor = alert.type === 'consecutive_failures' ? '#dc2626' : '#f59e0b';
  const severityEmoji = alert.type === 'consecutive_failures' ? '🚨' : '⚠️';
  
  switch (serviceType) {
    case 'slack':
      return {
        text: `${severityEmoji} Scraping Anomaly Detected`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${severityEmoji} Scraping Anomaly Detected`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${alert.message}*`,
            },
          },
          {
            type: 'section',
            fields: Object.entries(alert.details).map(([key, value]) => ({
              type: 'mrkdwn',
              text: `*${formatKey(key)}:*\n${value}`,
            })),
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Detected at: ${new Date(alert.timestamp).toLocaleString()}`,
              },
            ],
          },
        ],
      };

    case 'discord':
      return {
        content: `${severityEmoji} **Scraping Anomaly Detected**`,
        embeds: [
          {
            title: alert.message,
            color: parseInt(severityColor.replace('#', ''), 16),
            fields: Object.entries(alert.details).map(([key, value]) => ({
              name: formatKey(key),
              value: String(value),
              inline: true,
            })),
            timestamp: alert.timestamp,
            footer: {
              text: 'Market Oracle Monitoring',
            },
          },
        ],
      };

    case 'custom':
    default:
      return {
        alert_type: alert.type,
        severity: alert.type === 'consecutive_failures' ? 'critical' : 'warning',
        message: alert.message,
        details: alert.details,
        timestamp: alert.timestamp,
        source: 'Market Oracle - Scraping Monitor',
      };
  }
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
