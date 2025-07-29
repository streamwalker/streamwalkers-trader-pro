import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Brain, 
  BarChart3, 
  Zap,
  Users,
  Clock,
  Star
} from "lucide-react";

const CourseCategories = () => {
  const categories = [
    {
      id: "beginner",
      title: "Beginner Trading",
      description: "Start your trading journey with fundamental concepts and basic strategies",
      icon: BookOpen,
      color: "bg-blue-500",
      courseCount: 8,
      totalDuration: "24 hours",
      averageRating: 4.6,
      courses: [
        "Trading Fundamentals",
        "Market Basics", 
        "First Steps in Futures",
        "Introduction to Charts"
      ]
    },
    {
      id: "technical-analysis",
      title: "Technical Analysis",
      description: "Master chart patterns, indicators, and advanced analysis techniques",
      icon: BarChart3,
      color: "bg-green-500",
      courseCount: 12,
      totalDuration: "36 hours",
      averageRating: 4.8,
      courses: [
        "Chart Pattern Recognition",
        "Technical Indicators Deep Dive", 
        "Support & Resistance",
        "Advanced Charting"
      ]
    },
    {
      id: "risk-management",
      title: "Risk Management",
      description: "Learn to protect your capital with proven risk management strategies",
      icon: Shield,
      color: "bg-red-500",
      courseCount: 6,
      totalDuration: "18 hours",
      averageRating: 4.9,
      courses: [
        "Position Sizing Mastery",
        "Risk Management Psychology",
        "Portfolio Protection",
        "Capital Preservation"
      ]
    },
    {
      id: "psychology",
      title: "Trading Psychology",
      description: "Develop the mental discipline and emotional control needed for success",
      icon: Brain,
      color: "bg-purple-500",
      courseCount: 5,
      totalDuration: "15 hours",
      averageRating: 4.7,
      courses: [
        "Trading Mindset",
        "Emotional Control",
        "Discipline & Patience",
        "Performance Psychology"
      ]
    },
    {
      id: "advanced",
      title: "Advanced Strategies",
      description: "Professional-level trading techniques and institutional strategies",
      icon: TrendingUp,
      color: "bg-orange-500",
      courseCount: 10,
      totalDuration: "45 hours",
      averageRating: 4.8,
      courses: [
        "Order Flow Analysis",
        "Market Microstructure",
        "Algorithmic Trading",
        "Institutional Strategies"
      ]
    },
    {
      id: "automation",
      title: "Trading Automation",
      description: "Build and deploy automated trading systems and algorithms",
      icon: Zap,
      color: "bg-yellow-500",
      courseCount: 7,
      totalDuration: "32 hours",
      averageRating: 4.5,
      courses: [
        "Algorithm Development",
        "Backtesting Strategies",
        "API Integration",
        "System Deployment"
      ]
    }
  ];

  const featuredCourses = [
    {
      id: 1,
      title: "Complete Trading Bootcamp",
      category: "Beginner Trading",
      rating: 4.9,
      students: 2341,
      duration: "12 hours",
      price: "Free",
      instructor: "John Martinez"
    },
    {
      id: 2,
      title: "Advanced Order Flow Analysis",
      category: "Advanced Strategies", 
      rating: 4.8,
      students: 856,
      duration: "6 hours",
      price: "$99",
      instructor: "Sarah Chen"
    },
    {
      id: 3,
      title: "Risk Management Masterclass",
      category: "Risk Management",
      rating: 4.9,
      students: 1204,
      duration: "4 hours", 
      price: "$49",
      instructor: "Mike Thompson"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Categories</h1>
          <p className="text-muted-foreground">
            Explore our comprehensive trading education organized by skill level and topic.
          </p>
        </div>
        <Button asChild>
          <Link to="/education/courses">
            <BookOpen className="mr-2 h-4 w-4" />
            View All Courses
          </Link>
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-white`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{category.courseCount} courses</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current text-yellow-500" />
                        {category.averageRating}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription>{category.description}</CardDescription>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {category.totalDuration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {category.courseCount} courses
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Popular courses:</div>
                  <div className="space-y-1">
                    {category.courses.slice(0, 3).map((course, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {course}
                      </div>
                    ))}
                    {category.courses.length > 3 && (
                      <div className="text-sm text-muted-foreground">
                        • And {category.courses.length - 3} more...
                      </div>
                    )}
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link to={`/education/courses?category=${category.id}`}>
                    Explore Category
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Featured Courses */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Featured Courses</h2>
          <p className="text-muted-foreground">
            Hand-picked courses recommended by our expert instructors.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{course.category}</Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-background/80">
                    {course.price}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-foreground">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      {course.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.students}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </div>
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription>{course.instructor}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={`/education/course/${course.id}`}>
                    View Course
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Paths */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Learning Paths</CardTitle>
          <CardDescription>
            Structured learning sequences to guide your trading education journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg space-y-3">
              <div className="font-medium">Complete Beginner to Trader</div>
              <div className="text-sm text-muted-foreground">
                Start with fundamentals → Chart analysis → Risk management → Live trading
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>8-12 weeks</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Start Path
              </Button>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <div className="font-medium">Technical Analysis Expert</div>
              <div className="text-sm text-muted-foreground">
                Chart patterns → Indicators → Advanced analysis → Market structure
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>6-8 weeks</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Start Path
              </Button>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <div className="font-medium">Professional Trader</div>
              <div className="text-sm text-muted-foreground">
                Advanced strategies → Order flow → Psychology → Risk mastery
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>10-16 weeks</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Start Path
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseCategories;