import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function fetchQuote(symbol: string, apiKey: string) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  const resp = await fetch(url);
  const data = await resp.json();
  const quote = data['Global Quote'];
  if (!quote) return null;
  return { price: parseFloat(quote['05. price']) };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    const userId = claimsData.claims.sub;

    const body = await req.json();
    const { action, strategy_id, starting_capital } = body;

    if (action === 'start') {
      // Create or reactivate paper account
      const { data: existing } = await supabase
        .from('quant_paper_account').select('*').eq('strategy_id', strategy_id).eq('user_id', userId).single();

      if (existing) {
        await supabase.from('quant_paper_account').update({ is_active: true, kill_switch_triggered: false, last_updated: new Date().toISOString() }).eq('id', existing.id);
        return new Response(JSON.stringify({ account: { ...existing, is_active: true } }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const capital = starting_capital || 100000;
      const { data: account, error } = await supabase.from('quant_paper_account').insert({
        strategy_id, user_id: userId, starting_capital: capital, current_equity: capital, cash_balance: capital, is_active: true,
      }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ account }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'stop' || action === 'kill') {
      const updateData: any = { is_active: false, last_updated: new Date().toISOString() };
      if (action === 'kill') updateData.kill_switch_triggered = true;
      
      await supabase.from('quant_paper_account').update(updateData).eq('strategy_id', strategy_id).eq('user_id', userId);
      return new Response(JSON.stringify({ status: action === 'kill' ? 'killed' : 'stopped' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'update_prices') {
      // Fetch account and open positions
      const { data: account } = await supabase
        .from('quant_paper_account').select('*').eq('strategy_id', strategy_id).eq('user_id', userId).single();
      if (!account || !account.is_active) {
        return new Response(JSON.stringify({ error: 'No active paper account' }), { status: 400, headers: corsHeaders });
      }

      const { data: positions } = await supabase
        .from('quant_paper_positions').select('*').eq('strategy_id', strategy_id).eq('user_id', userId).eq('status', 'open');

      const alphaKey = Deno.env.get('ALPHA_VANTAGE_API_KEY') || 'demo';
      let totalUnrealized = 0;

      for (const pos of (positions || [])) {
        const quote = await fetchQuote(pos.symbol, alphaKey);
        if (quote) {
          const unrealized = (quote.price - pos.avg_entry_price) * pos.quantity;
          await supabase.from('quant_paper_positions').update({
            current_price: quote.price,
            unrealized_pnl: Math.round(unrealized * 100) / 100,
          }).eq('id', pos.id);
          totalUnrealized += unrealized;
        }
        await new Promise(r => setTimeout(r, 1200));
      }

      const equity = account.cash_balance + totalUnrealized;
      const drawdown = ((account.starting_capital - equity) / account.starting_capital) * 100;
      const riskControls = (await supabase.from('quant_strategies').select('risk_controls').eq('id', strategy_id).single()).data?.risk_controls as any;
      
      const killSwitchTriggered = riskControls?.max_drawdown_pct && drawdown >= riskControls.max_drawdown_pct;

      await supabase.from('quant_paper_account').update({
        current_equity: Math.round(equity * 100) / 100,
        total_pnl: Math.round((equity - account.starting_capital) * 100) / 100,
        max_drawdown_pct: Math.max(account.max_drawdown_pct, Math.round(drawdown * 100) / 100),
        is_active: !killSwitchTriggered,
        kill_switch_triggered: killSwitchTriggered,
        last_updated: new Date().toISOString(),
      }).eq('id', account.id);

      return new Response(JSON.stringify({ 
        equity: Math.round(equity * 100) / 100,
        positions_updated: positions?.length || 0,
        kill_switch_triggered: killSwitchTriggered,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: corsHeaders });
  } catch (error) {
    console.error('Paper trade error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
