import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

interface DipAnalysisResult {
  symbol: string;
  dip_quality_score: number;
  dip_type: string;
  recommendation: string;
  confidence_level: number;
  trend_score: number;
  volume_score: number;
  catalyst_score: number;
  rsi_score: number;
  support_score: number;
  insider_score: number;
  options_flow_score: number;
  current_price: number;
  price_change_percent: number;
  analysis_summary: string;
  key_risks: string[];
  key_opportunities: string[];
}

interface ReportData {
  strongBuys: DipAnalysisResult[];
  buys: DipAnalysisResult[];
  waits: DipAnalysisResult[];
  avoids: DipAnalysisResult[];
  analysisDate: string;
}

async function fetchReportData(supabase: any): Promise<ReportData> {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: results, error } = await supabase
    .from('dip_analysis_results')
    .select('*')
    .eq('analysis_date', today)
    .order('dip_quality_score', { ascending: false });
  
  if (error) {
    console.error('Error fetching dip analysis results:', error);
    throw error;
  }

  const strongBuys = results?.filter((r: DipAnalysisResult) => r.dip_quality_score >= 8.0) || [];
  const buys = results?.filter((r: DipAnalysisResult) => r.dip_quality_score >= 6.0 && r.dip_quality_score < 8.0) || [];
  const waits = results?.filter((r: DipAnalysisResult) => r.dip_quality_score >= 4.0 && r.dip_quality_score < 6.0) || [];
  const avoids = results?.filter((r: DipAnalysisResult) => r.dip_quality_score < 4.0) || [];

  return {
    strongBuys,
    buys,
    waits,
    avoids,
    analysisDate: today
  };
}

function generateHtmlEmail(data: ReportData, includeDetailed: boolean = true): string {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatPercent = (pct: number) => `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
  const formatScore = (score: number) => score.toFixed(1);

  const renderStockCard = (result: DipAnalysisResult, showDetails: boolean = true) => {
    const getBadgeColor = () => {
      if (result.dip_quality_score >= 8.0) return '#10b981';
      if (result.dip_quality_score >= 6.0) return '#3b82f6';
      if (result.dip_quality_score >= 4.0) return '#f59e0b';
      return '#ef4444';
    };

    const changeColor = result.price_change_percent >= 0 ? '#10b981' : '#ef4444';

    return `
      <div style="background: #f9fafb; border-left: 4px solid ${getBadgeColor()}; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
          <div>
            <h3 style="margin: 0 0 5px 0; font-size: 20px; color: #1f2937;">${result.symbol}</h3>
            <div style="font-size: 14px; color: #6b7280;">
              ${formatPrice(result.current_price)} 
              <span style="color: ${changeColor}; font-weight: 600; margin-left: 8px;">${formatPercent(result.price_change_percent)}</span>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 32px; font-weight: bold; color: ${getBadgeColor()};">${formatScore(result.dip_quality_score)}</div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Dip Score</div>
          </div>
        </div>

        <div style="background: white; border-radius: 6px; padding: 12px; margin-bottom: 15px;">
          <div style="font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">
            ${result.recommendation === 'buy_dip' ? '🚀 BUY THE DIP' : result.recommendation === 'wait' ? '⏸️ WAIT' : '⚠️ AVOID'}
          </div>
          <div style="font-size: 13px; color: #4b5563; line-height: 1.6;">
            ${result.analysis_summary || 'Analysis in progress...'}
          </div>
        </div>

        ${showDetails ? `
          <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; font-weight: 600;">7-Point Breakdown</div>
            <div style="background: white; border-radius: 6px; padding: 12px;">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px;">
                <div>📈 Trend: <span style="float: right; font-weight: 600;">${formatScore(result.trend_score)}/2.0</span></div>
                <div>📊 Volume: <span style="float: right; font-weight: 600;">${formatScore(result.volume_score)}/2.0</span></div>
                <div>📰 Catalyst: <span style="float: right; font-weight: 600;">${formatScore(result.catalyst_score)}/2.0</span></div>
                <div>📉 RSI: <span style="float: right; font-weight: 600;">${formatScore(result.rsi_score)}/1.0</span></div>
                <div>🎯 Support: <span style="float: right; font-weight: 600;">${formatScore(result.support_score)}/1.0</span></div>
                <div>👔 Insider: <span style="float: right; font-weight: 600;">${formatScore(result.insider_score)}/1.0</span></div>
                <div style="grid-column: span 2;">📞 Options: <span style="float: right; font-weight: 600;">${formatScore(result.options_flow_score)}/1.0</span></div>
              </div>
            </div>
          </div>

          ${result.key_opportunities && result.key_opportunities.length > 0 ? `
            <div style="margin-bottom: 10px;">
              <div style="font-size: 11px; color: #10b981; font-weight: 600; margin-bottom: 5px;">✅ KEY OPPORTUNITIES</div>
              <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #4b5563;">
                ${result.key_opportunities.map(opp => `<li style="margin-bottom: 3px;">${opp}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${result.key_risks && result.key_risks.length > 0 ? `
            <div>
              <div style="font-size: 11px; color: #ef4444; font-weight: 600; margin-bottom: 5px;">⚠️ KEY RISKS</div>
              <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #4b5563;">
                ${result.key_risks.map(risk => `<li style="margin-bottom: 3px;">${risk}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        ` : ''}
      </div>
    `;
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Daily Dip Analysis Report</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0 0 10px 0; font-size: 28px;">🎯 Daily Dip Analysis Report</h1>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">${new Date(data.analysisDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            
            <!-- Summary -->
            <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">📊 Portfolio Overview</h2>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; font-size: 14px;">
                <div>
                  <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 4px;">Strong Buy (8.0+)</div>
                  <div style="font-size: 24px; font-weight: bold; color: #10b981;">${data.strongBuys.length}</div>
                </div>
                <div>
                  <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 4px;">Buy (6.0-7.9)</div>
                  <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${data.buys.length}</div>
                </div>
                <div>
                  <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 4px;">Wait (4.0-5.9)</div>
                  <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${data.waits.length}</div>
                </div>
                <div>
                  <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 4px;">Avoid (<4.0)</div>
                  <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${data.avoids.length}</div>
                </div>
              </div>
            </div>

            <!-- Strong Buys -->
            ${data.strongBuys.length > 0 ? `
              <div style="margin-bottom: 30px;">
                <h2 style="font-size: 20px; color: #1f2937; margin-bottom: 15px; border-bottom: 2px solid #10b981; padding-bottom: 8px;">
                  🚀 TYPE A - STRONG BUY OPPORTUNITIES
                </h2>
                ${data.strongBuys.map(result => renderStockCard(result, includeDetailed)).join('')}
              </div>
            ` : ''}

            <!-- Buys -->
            ${data.buys.length > 0 ? `
              <div style="margin-bottom: 30px;">
                <h2 style="font-size: 20px; color: #1f2937; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
                  📈 TYPE A - BUY OPPORTUNITIES
                </h2>
                ${data.buys.map(result => renderStockCard(result, includeDetailed)).join('')}
              </div>
            ` : ''}

            <!-- Waits -->
            ${data.waits.length > 0 ? `
              <div style="margin-bottom: 30px;">
                <h2 style="font-size: 20px; color: #1f2937; margin-bottom: 15px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">
                  ⏸️ WAIT FOR CLARITY
                </h2>
                ${data.waits.map(result => renderStockCard(result, false)).join('')}
              </div>
            ` : ''}

            <!-- Avoids -->
            ${data.avoids.length > 0 ? `
              <div style="margin-bottom: 30px;">
                <h2 style="font-size: 20px; color: #1f2937; margin-bottom: 15px; border-bottom: 2px solid #ef4444; padding-bottom: 8px;">
                  ⚠️ TYPE B - AVOID / SELL
                </h2>
                ${data.avoids.map(result => renderStockCard(result, includeDetailed)).join('')}
              </div>
            ` : ''}

            <!-- Footer -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
              <p style="margin: 0 0 10px 0;">V.K.T.R. Market Intelligence</p>
              <p style="margin: 0;">This report is for informational purposes only. Not financial advice.</p>
            </div>
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

    const { email, isTest = false, automated = false, includeDetailed = true } = await req.json();

    console.log('Processing dip analysis report request:', { email, isTest, automated });

    // If automated, fetch all active configurations
    if (automated) {
      const { data: configs } = await supabase
        .from('email_report_configs')
        .select('*')
        .eq('is_active', true)
        .contains('report_types', ['dip_analysis']);

      console.log(`Found ${configs?.length || 0} active dip analysis report configs`);

      const reportData = await fetchReportData(supabase);
      const htmlContent = generateHtmlEmail(reportData, includeDetailed);

      const results = [];
      for (const config of configs || []) {
        try {
          const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'V.K.T.R. Intelligence <reports@updates.lovable.app>',
            to: [config.email],
            subject: `🎯 Daily Dip Analysis - ${reportData.strongBuys.length + reportData.buys.length} BUY Opportunities`,
            html: htmlContent,
          });

          if (emailError) {
            console.error(`Failed to send to ${config.email}:`, emailError);
            results.push({ email: config.email, success: false, error: emailError });
          } else {
            console.log(`Successfully sent to ${config.email}`);
            results.push({ email: config.email, success: true, messageId: emailData?.id });

            // Update last_sent_at
            if (!isTest) {
              await supabase
                .from('email_report_configs')
                .update({ last_sent_at: new Date().toISOString() })
                .eq('id', config.id);
            }
          }
        } catch (error) {
          console.error(`Error sending to ${config.email}:`, error);
          results.push({ email: config.email, success: false, error });
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          automated: true,
          sent_count: results.filter(r => r.success).length,
          total_configs: configs?.length || 0,
          results 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Manual send to specific email
    const reportData = await fetchReportData(supabase);
    const htmlContent = generateHtmlEmail(reportData, includeDetailed);

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'V.K.T.R. Intelligence <reports@updates.lovable.app>',
      to: [email],
      subject: `🎯 Daily Dip Analysis - ${reportData.strongBuys.length + reportData.buys.length} BUY Opportunities`,
      html: htmlContent,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      throw emailError;
    }

    console.log('Email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Dip analysis report sent successfully',
        emailId: emailData?.id,
        summary: {
          strongBuys: reportData.strongBuys.length,
          buys: reportData.buys.length,
          waits: reportData.waits.length,
          avoids: reportData.avoids.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-dip-analysis-report function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
