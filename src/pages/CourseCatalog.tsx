import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Video, Search, Filter, Clock, Users, Star } from "lucide-react";

const CourseCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const allCourses = [
    {
      id: 1,
      title: "Futures Trading Fundamentals",
      description: "Learn the basics of futures trading, market mechanics, and risk management strategies for beginners.",
      duration: "4 hours",
      difficulty: "Beginner",
      progress: 75,
      modules: 12,
      type: "video",
      instructor: "John Martinez",
      rating: 4.8,
      students: 1234,
      price: "Free",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Advanced Order Flow Analysis",
      description: "Master order flow patterns, market depth, and institutional trading strategies for professional trading.",
      duration: "6 hours",
      difficulty: "Advanced",
      progress: 30,
      modules: 18,
      type: "video",
      instructor: "Sarah Chen",
      rating: 4.9,
      students: 856,
      price: "$99",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Risk Management Masterclass",
      description: "Comprehensive guide to position sizing, portfolio management, and capital preservation techniques.",
      duration: "3 hours",
      difficulty: "Intermediate",
      progress: 100,
      modules: 10,
      type: "interactive",
      instructor: "Mike Thompson",
      rating: 4.7,
      students: 967,
      price: "$49",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 4,
      title: "Technical Analysis Deep Dive",
      description: "Advanced charting techniques, indicators, and pattern recognition for market analysis.",
      duration: "5 hours",
      difficulty: "Intermediate",
      progress: 0,
      modules: 15,
      type: "video",
      instructor: "Lisa Rodriguez",
      rating: 4.6,
      students: 2134,
      price: "$79",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 5,
      title: "Options Trading Mastery",
      description: "Complete guide to options strategies, Greeks, and advanced options trading techniques.",
      duration: "8 hours",
      difficulty: "Advanced",
      progress: 0,
      modules: 24,
      type: "video",
      instructor: "David Kim",
      rating: 4.9,
      students: 743,
      price: "$149",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 6,
      title: "Cryptocurrency Trading Basics",
      description: "Introduction to crypto markets, blockchain technology, and digital asset trading strategies.",
      duration: "3.5 hours",
      difficulty: "Beginner",
      progress: 0,
      modules: 14,
      type: "video",
      instructor: "Alex Johnson",
      rating: 4.5,
      students: 1876,
      price: "Free",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 7,
      title: "Algorithmic Trading Fundamentals",
      description: "Learn to build and deploy automated trading systems using Python and market APIs.",
      duration: "10 hours",
      difficulty: "Advanced",
      progress: 0,
      modules: 30,
      type: "interactive",
      instructor: "Emma Watson",
      rating: 4.8,
      students: 512,
      price: "$199",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 8,
      title: "Market Psychology & Trading Mindset",
      description: "Develop the mental discipline and psychological skills needed for successful trading.",
      duration: "2.5 hours",
      difficulty: "Beginner",
      progress: 0,
      modules: 8,
      type: "video",
      instructor: "Dr. Robert Chen",
      rating: 4.7,
      students: 1543,
      price: "$39",
      thumbnail: "/api/placeholder/300/200"
    }
  ];

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "all" || course.difficulty === selectedDifficulty;
    const matchesType = selectedType === "all" || course.type === selectedType;
    
    return matchesSearch && matchesDifficulty && matchesType;
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Catalog</h1>
          <p className="text-muted-foreground">
            Discover comprehensive trading courses designed to enhance your skills.
          </p>
        </div>
        <Button asChild>
          <Link to="/education/categories">
            <Filter className="mr-2 h-4 w-4" />
            Browse Categories
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Course Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="video">Video Course</SelectItem>
            <SelectItem value="interactive">Interactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge variant={course.difficulty === "Beginner" ? "secondary" : course.difficulty === "Intermediate" ? "default" : "destructive"}>
                  {course.difficulty}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-background/80">
                  {course.price}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {course.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.students}
                  </div>
                </div>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {course.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  {course.type === "video" ? <Video className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                  {course.duration}
                </div>
                <span>{course.modules} modules</span>
              </div>

              <div className="text-sm">
                <div className="font-medium">{course.instructor}</div>
                <div className="text-muted-foreground">Instructor</div>
              </div>

              {course.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}

              <Button asChild className="w-full">
                <Link to={`/education/course/${course.id}`}>
                  {course.progress === 0 ? "Start Course" : course.progress === 100 ? "Review" : "Continue"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button onClick={() => {
            setSearchTerm("");
            setSelectedDifficulty("all");
            setSelectedType("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;