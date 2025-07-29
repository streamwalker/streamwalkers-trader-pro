import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  PlayCircle, 
  Download, 
  Target,
  Search,
  Clock,
  Users,
  Star
} from "lucide-react";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const allResources = [
    {
      title: "Order Flow Masterclass",
      description: "Complete 8-hour course on reading institutional order flow and market microstructure",
      type: "Course",
      category: "Order Flow",
      duration: "8 hours",
      downloads: 1247,
      rating: 4.9,
      level: "Advanced"
    },
    {
      title: "Market Profile Deep Dive",
      description: "Advanced auction market theory and TPO chart analysis techniques",
      type: "Course",
      category: "Market Structure", 
      duration: "6 hours",
      downloads: 892,
      rating: 4.8,
      level: "Intermediate"
    },
    {
      title: "Smart Money Concepts Guide",
      description: "Comprehensive guide to institutional trading concepts and liquidity analysis",
      type: "PDF Guide",
      category: "Market Structure",
      duration: "45 pages",
      downloads: 2156,
      rating: 4.7,
      level: "Intermediate"
    },
    {
      title: "NinjaTrader Platform Setup",
      description: "Complete platform configuration and optimization for professional trading",
      type: "Video Tutorial",
      category: "Platform Setup",
      duration: "45 min",
      downloads: 3421,
      rating: 4.9,
      level: "Beginner"
    },
    {
      title: "Risk Management Certification",
      description: "Professional-grade risk management strategies and position sizing methodologies",
      type: "Course",
      category: "Risk Management",
      duration: "4 hours",
      downloads: 1567,
      rating: 4.9,
      level: "Intermediate"
    },
    {
      title: "Live Trading Sessions",
      description: "Daily market analysis and real-time trade execution with our professional traders",
      type: "Video Tutorial",
      category: "Trading Education",
      duration: "Daily",
      downloads: 987,
      rating: 4.8,
      level: "All Levels"
    },
    {
      title: "Volume Spread Analysis Manual",
      description: "Complete guide to VSA methodology and Wyckoff market analysis techniques",
      type: "PDF Guide",
      category: "Market Analysis",
      duration: "38 pages",
      downloads: 1834,
      rating: 4.6,
      level: "Advanced"
    },
    {
      title: "Platform Integration Guides",
      description: "Setup instructions for NinjaTrader, Tradovate, TradingView, and Sierra Chart",
      type: "PDF Guide",
      category: "Platform Setup",
      duration: "28 pages",
      downloads: 2743,
      rating: 4.8,
      level: "Beginner"
    },
    {
      title: "Performance Analytics Workshop",
      description: "Advanced trade journaling and performance optimization techniques",
      type: "Video Tutorial",
      category: "Analytics",
      duration: "90 min",
      downloads: 1298,
      rating: 4.7,
      level: "Intermediate"
    },
    {
      title: "Futures Scalping Strategies",
      description: "High-frequency trading techniques and ultra-fast execution methods",
      type: "Course",
      category: "Trading Strategies",
      duration: "5 hours",
      downloads: 1876,
      rating: 4.8,
      level: "Advanced"
    },
    {
      title: "TradingView Pine Script Guide",
      description: "Custom indicator development and automated strategy creation",
      type: "PDF Guide",
      category: "Platform Setup",
      duration: "52 pages",
      downloads: 2198,
      rating: 4.5,
      level: "Advanced"
    },
    {
      title: "Market Internals Masterclass",
      description: "Understanding TICK, A/D Line, VIX, and breadth indicators for market timing",
      type: "Video Tutorial",
      category: "Market Analysis",
      duration: "2 hours",
      downloads: 1432,
      rating: 4.9,
      level: "Intermediate"
    }
  ];

  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || resource.type === selectedType;
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video Tutorial":
        return <PlayCircle className="w-5 h-5 text-primary" />;
      case "PDF Guide":
        return <Download className="w-5 h-5 text-profit" />;
      case "Course":
        return <Target className="w-5 h-5 text-warning" />;
      default:
        return <Target className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "text-profit bg-profit/10";
      case "Intermediate":
        return "text-warning bg-warning/10";
      case "Advanced":
        return "text-danger bg-danger/10";
      default:
        return "text-primary bg-primary/10";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Trading <span className="bg-gradient-primary bg-clip-text text-transparent">Resources</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive library of training materials, guides, and tools to elevate your trading skills.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Resource Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Course">Courses</SelectItem>
              <SelectItem value="Video Tutorial">Video Tutorials</SelectItem>
              <SelectItem value="PDF Guide">PDF Guides</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Order Flow">Order Flow</SelectItem>
              <SelectItem value="Market Structure">Market Structure</SelectItem>
              <SelectItem value="Risk Management">Risk Management</SelectItem>
              <SelectItem value="Platform Setup">Platform Setup</SelectItem>
              <SelectItem value="Trading Education">Trading Education</SelectItem>
              <SelectItem value="Market Analysis">Market Analysis</SelectItem>
              <SelectItem value="Analytics">Analytics</SelectItem>
              <SelectItem value="Trading Strategies">Trading Strategies</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No resources found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
                setSelectedCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(resource.type)}
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getLevelColor(resource.level)}`}>
                        {resource.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-current" />
                      <span className="text-sm font-medium">{resource.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {resource.title}
                  </CardTitle>
                  <p className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full w-fit">
                    {resource.category}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{resource.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {resource.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {resource.downloads.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      {resource.type === "Course" ? "Start Course" : "Access Resource"}
                    </Button>
                    {resource.type === "PDF Guide" && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 bg-card rounded-2xl p-8 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{allResources.length}</div>
              <div className="text-muted-foreground">Total Resources</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-profit mb-2">
                {allResources.filter(r => r.type === "Course").length}
              </div>
              <div className="text-muted-foreground">Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warning mb-2">
                {allResources.filter(r => r.type === "Video Tutorial").length}
              </div>
              <div className="text-muted-foreground">Video Tutorials</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">
                {allResources.filter(r => r.type === "PDF Guide").length}
              </div>
              <div className="text-muted-foreground">PDF Guides</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;