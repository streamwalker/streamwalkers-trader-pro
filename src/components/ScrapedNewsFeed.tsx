import { useState } from 'react';
import { useNewsFeed } from '@/hooks/useNewsFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, ExternalLink, Brain, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function ScrapedNewsFeed() {
  const { news, sources, isLoading, triggerScrape, scrapeArticleContent } = useNewsFeed();
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('all');

  const filteredNews = news?.filter(article => {
    const matchesSource = selectedSource === 'all' || article.source === selectedSource;
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSymbol = selectedSymbol === 'all' || 
      article.symbols?.includes(selectedSymbol);
    
    return matchesSource && matchesSearch && matchesSymbol;
  });

  const uniqueSymbols = [...new Set(news?.flatMap(a => a.symbols || []) || [])].sort();

  const getSentimentVariant = (sentiment: string | null) => {
    switch (sentiment) {
      case 'positive': return 'default';
      case 'negative': return 'destructive';
      case 'neutral': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Financial News Feed</h2>
          <p className="text-muted-foreground">
            {filteredNews?.length || 0} articles from {sources?.length || 0} sources
          </p>
        </div>
        <Button
          onClick={() => triggerScrape.mutate(undefined)}
          disabled={triggerScrape.isPending}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${triggerScrape.isPending ? 'animate-spin' : ''}`} />
          Refresh News
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources?.map(source => (
                  <SelectItem key={source.id} value={source.name}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Symbols</SelectItem>
                {uniqueSymbols.map(symbol => (
                  <SelectItem key={symbol} value={symbol}>
                    ${symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNews?.map(article => (
          <Card 
            key={article.id} 
            className="hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => window.open(article.url, '_blank')}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
                <Badge variant="outline" className="shrink-0">
                  {article.source}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {article.summary && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {article.summary}
                </p>
              )}
              
              <div className="flex items-center gap-2 flex-wrap">
                {article.sentiment && (
                  <Badge variant={getSentimentVariant(article.sentiment)}>
                    {article.sentiment}
                  </Badge>
                )}
                {article.symbols?.slice(0, 3).map(symbol => (
                  <Badge key={symbol} variant="secondary">
                    ${symbol}
                  </Badge>
                ))}
                {article.symbols && article.symbols.length > 3 && (
                  <Badge variant="secondary">
                    +{article.symbols.length - 3} more
                  </Badge>
                )}
              </div>

              {article.keywords && article.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.keywords.slice(0, 4).map(keyword => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>
                  {article.published_at 
                    ? `${formatDistanceToNow(new Date(article.published_at))} ago`
                    : `${formatDistanceToNow(new Date(article.scraped_at))} ago`}
                </span>
                <div className="flex items-center gap-2">
                  {article.ai_processed && (
                    <Badge variant="outline" className="text-xs">
                      <Brain className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  )}
                  {!article.content && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        scrapeArticleContent.mutate({ articleId: article.id });
                      }}
                      disabled={scrapeArticleContent.isPending}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNews?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No articles found. Try refreshing or adjusting filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
