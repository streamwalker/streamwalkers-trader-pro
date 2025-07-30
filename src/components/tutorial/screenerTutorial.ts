import { PageTutorial } from './TutorialProvider';

export const screenerTutorial: PageTutorial = {
  id: 'stock-screener',
  name: 'Stock Screener Tutorial',
  trigger: 'onFirstVisit',
  steps: [
    {
      id: 'welcome',
      target: '[data-tutorial="screener-container"]',
      title: 'Welcome to Stock Screener',
      content: 'This powerful tool helps you discover stocks that match your trading criteria. Let\'s explore the key features that will help you find profitable opportunities.',
      placement: 'bottom'
    },
    {
      id: 'prebuilt-screens',
      target: '[data-tutorial="prebuilt-screens"]',
      title: 'Pre-built Screens',
      content: 'These are pre-configured filters for common trading strategies like momentum plays and breakouts. Each screen applies specific criteria to help you find stocks with similar characteristics.',
      placement: 'bottom'
    },
    {
      id: 'low-float-screen',
      target: '[data-tutorial="low-float-screen"]',
      title: 'Low Float Stocks',
      content: 'Float refers to shares available for trading. Low float stocks (< 50M shares) can be more volatile and offer greater profit potential, but also carry higher risk.',
      placement: 'bottom'
    },
    {
      id: 'custom-criteria',
      target: '[data-tutorial="custom-criteria"]',
      title: 'Custom Criteria',
      content: 'Set your own parameters to find stocks matching your specific requirements. You can filter by price, volume, market cap, change percentage, and float characteristics.',
      placement: 'top'
    },
    {
      id: 'price-range',
      target: '[data-tutorial="price-range"]',
      title: 'Price Range Filtering',
      content: 'Filter stocks by price range. Lower-priced stocks often have more percentage movement potential, while higher-priced stocks may be more stable institutional plays.',
      placement: 'top'
    },
    {
      id: 'volume-filter',
      target: '[data-tutorial="volume-filter"]',
      title: 'Volume Analysis',
      content: 'Higher volume indicates more institutional interest and liquidity. Volume is crucial for entry and exit execution - avoid low volume stocks for larger positions.',
      placement: 'top'
    },
    {
      id: 'float-filters',
      target: '[data-tutorial="float-filters"]',
      title: 'Float Filtering',
      content: 'Control float size and percentage. Low float stocks can "squeeze" higher on positive news, while high float stocks typically move more gradually.',
      placement: 'top'
    },
    {
      id: 'results-table',
      target: '[data-tutorial="results-table"]',
      title: 'Results Analysis',
      content: 'Review filtered stocks with key metrics. Pay attention to float size, volume, and change percentage to identify the best opportunities.',
      placement: 'top'
    },
    {
      id: 'live-data-badge',
      target: '[data-tutorial="live-data"]',
      title: 'Live Data Indicator',
      content: 'This badge confirms you\'re seeing real-time market data. Live data is essential for accurate screening and timing your entries.',
      placement: 'left'
    },
    {
      id: 'low-float-badge',
      target: '[data-tutorial="low-float-badge"]',
      title: 'Low Float Badge',
      content: 'Stocks with this badge have particularly low float (< 20M shares) and may offer higher volatility and profit potential. Trade with appropriate position sizing.',
      placement: 'left'
    },
    {
      id: 'watchlist-add',
      target: '[data-tutorial="add-watchlist"]',
      title: 'Add to Watchlist',
      content: 'Save interesting stocks to track their performance over time. Building a curated watchlist helps you monitor opportunities and develop your trading edge.',
      placement: 'left'
    },
    {
      id: 'float-column',
      target: '[data-tutorial="float-column"]',
      title: 'Float Information',
      content: 'The Float column shows available shares in millions, while Float % shows the percentage of total shares available for trading. Lower numbers indicate higher squeeze potential.',
      placement: 'left'
    }
  ]
};