import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { dataType } = await req.json()
    
    const fredKey = Deno.env.get('FRED_API_KEY')
    const newsDataKey = Deno.env.get('NEWSDATA_API_KEY')
    
    console.log('Fetching economic data, type:', dataType)
    
    let result: any = {}
    
    switch (dataType) {
      case 'macro_indicators':
        result = await fetchMacroIndicators(fredKey!)
        break
      case 'news':
        result = await fetchEconomicNews(newsDataKey!)
        break
      case 'global_indicators':
        result = await fetchGlobalIndicators()
        break
      default:
        throw new Error('Invalid data type')
    }
    
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error fetching economic data:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function fetchMacroIndicators(fredKey: string) {
  console.log('Fetching FRED macro indicators')
  
  // Key FRED series IDs
  const series = {
    gdp: 'GDP',
    unemployment: 'UNRATE',
    inflation: 'CPIAUCSL',
    interest_rate: 'FEDFUNDS',
    consumer_confidence: 'UMCSENT',
    manufacturing_pmi: 'MANEMP',
    housing_starts: 'HOUST',
    retail_sales: 'RSXFS'
  }
  
  const data: any = {}
  
  for (const [key, seriesId] of Object.entries(series)) {
    try {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${fredKey}&file_type=json&limit=12&sort_order=desc`
      const response = await fetch(url)
      const json = await response.json()
      
      if (json.observations && json.observations.length > 0) {
        const latest = json.observations[0]
        data[key] = {
          value: parseFloat(latest.value),
          date: latest.date,
          series_id: seriesId
        }
      }
    } catch (error) {
      console.error(`Error fetching ${key}:`, error)
      data[key] = null
    }
  }
  
  return {
    timestamp: new Date().toISOString(),
    indicators: data
  }
}

async function fetchEconomicNews(newsDataKey: string) {
  console.log('Fetching economic news')
  
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${newsDataKey}&category=business,politics&language=en&country=us`
    const response = await fetch(url)
    const json = await response.json()
    
    if (json.results) {
      return {
        timestamp: new Date().toISOString(),
        articles: json.results.slice(0, 20).map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.link,
          published_at: article.pubDate,
          source: article.source_id,
          category: article.category,
          keywords: article.keywords
        }))
      }
    }
    
    return { articles: [] }
  } catch (error) {
    console.error('Error fetching news:', error)
    return { articles: [], error: error.message }
  }
}

async function fetchGlobalIndicators() {
  console.log('Fetching global indicators from World Bank')
  
  try {
    // World Bank API - Global GDP growth
    const url = 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.KD.ZG?format=json&date=2020:2024&per_page=100'
    const response = await fetch(url)
    const json = await response.json()
    
    if (json && json[1]) {
      const majorEconomies = ['USA', 'CHN', 'JPN', 'DEU', 'GBR', 'FRA', 'IND']
      const data = json[1]
        .filter((item: any) => majorEconomies.includes(item.countryiso3code))
        .map((item: any) => ({
          country: item.country.value,
          country_code: item.countryiso3code,
          year: item.date,
          gdp_growth: item.value
        }))
      
      return {
        timestamp: new Date().toISOString(),
        global_gdp: data
      }
    }
    
    return { global_gdp: [] }
  } catch (error) {
    console.error('Error fetching global indicators:', error)
    return { global_gdp: [], error: error.message }
  }
}
