import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Video, 
  Clock, 
  Users, 
  Star, 
  Play, 
  Lock,
  CheckCircle,
  Award,
  Calendar,
  Download
} from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams();
  
  // Mock course data - in real app this would come from API
  const course = {
    id: parseInt(courseId || "1"),
    title: "Advanced Order Flow Analysis",
    description: "Master order flow patterns, market depth, and institutional trading strategies for professional trading. This comprehensive course covers everything from basic order flow concepts to advanced market microstructure analysis.",
    longDescription: "In this advanced course, you'll learn to read the market like a professional trader. We cover institutional order flow, market depth analysis, volume profiling, and how to identify key support and resistance levels using order flow data. By the end of this course, you'll be able to anticipate market moves before they happen and trade with institutional-level precision.",
    duration: "6 hours",
    difficulty: "Advanced",
    progress: 30,
    modules: 18,
    type: "video",
    instructor: {
      name: "Sarah Chen",
      title: "Senior Trading Analyst",
      experience: "12 years",
      bio: "Sarah has over 12 years of experience in institutional trading and has trained hundreds of professional traders.",
      avatar: "/api/placeholder/80/80"
    },
    rating: 4.9,
    students: 856,
    price: "$99",
    enrolled: true,
    skills: ["Order Flow Analysis", "Market Depth", "Volume Profiling", "Institutional Trading"],
    prerequisites: ["Basic Trading Knowledge", "Chart Reading"],
    whatYouLearn: [
      "Read institutional order flow patterns",
      "Analyze market depth and liquidity",
      "Identify support and resistance using volume",
      "Execute trades with precision timing",
      "Understand market microstructure",
      "Develop advanced entry and exit strategies"
    ]
  };

  const modules = [
    {
      id: 1,
      title: "Introduction to Order Flow",
      duration: "20 min",
      type: "video",
      completed: true,
      locked: false,
      description: "Understanding the basics of order flow and market structure"
    },
    {
      id: 2,
      title: "Reading the Tape",
      duration: "25 min", 
      type: "video",
      completed: true,
      locked: false,
      description: "Learn to interpret time and sales data effectively"
    },
    {
      id: 3,
      title: "Market Depth Analysis",
      duration: "30 min",
      type: "video",
      completed: true,
      locked: false,
      description: "Analyzing DOM (Depth of Market) for trading insights"
    },
    {
      id: 4,
      title: "Volume Profile Fundamentals",
      duration: "35 min",
      type: "video", 
      completed: true,
      locked: false,
      description: "Understanding volume distribution and key levels"
    },
    {
      id: 5,
      title: "Identifying Institutional Activity",
      duration: "40 min",
      type: "video",
      completed: true,
      locked: false,
      description: "Spotting large player movements in the market"
    },
    {
      id: 6,
      title: "Advanced Order Flow Patterns",
      duration: "45 min",
      type: "video",
      completed: false,
      locked: false,
      description: "Recognizing complex order flow scenarios"
    },
    {
      id: 7,
      title: "Practical Trading Applications",
      duration: "50 min",
      type: "interactive",
      completed: false,
      locked: false,
      description: "Applying order flow analysis to real trades"
    },
    {
      id: 8,
      title: "Risk Management with Order Flow",
      duration: "30 min",
      type: "video",
      completed: false,
      locked: false,
      description: "Managing risk using order flow insights"
    },
    {
      id: 9,
      title: "Advanced Market Microstructure",
      duration: "35 min",
      type: "video",
      completed: false,
      locked: true,
      description: "Deep dive into market mechanics and execution"
    },
    {
      id: 10,
      title: "Case Studies & Examples",
      duration: "40 min",
      type: "video",
      completed: false,
      locked: true,
      description: "Real-world examples of successful order flow trading"
    }
  ];

  const completedModules = modules.filter(m => m.completed).length;
  const totalModules = modules.length;
  const progressPercentage = Math.round((completedModules / totalModules) * 100);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link to="/education" className="hover:text-foreground">Education</Link>
        <span>/</span>
        <Link to="/education/courses" className="hover:text-foreground">Courses</Link>
        <span>/</span>
        <span className="text-foreground">{course.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant={course.difficulty === "Beginner" ? "secondary" : course.difficulty === "Intermediate" ? "default" : "destructive"}>
                {course.difficulty}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {course.duration}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {course.students} students
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                {course.rating} rating
              </div>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
          </div>

          {/* Progress */}
          {course.enrolled && (
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{completedModules} of {totalModules} modules completed</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Modules */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>{totalModules} modules • {course.duration} total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <div key={module.id} className="space-y-3">
                    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0">
                        {module.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : module.locked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Play className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${module.locked ? "text-muted-foreground" : ""}`}>
                            {index + 1}. {module.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {module.type === "video" ? <Video className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                            {module.duration}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                      </div>
                      
                      {!module.locked && course.enrolled && (
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/education/course/${courseId}/module/${module.id}`}>
                            {module.completed ? "Review" : "Start"}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* About Course */}
          <Card>
            <CardHeader>
              <CardTitle>About This Course</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>{course.longDescription}</p>
              
              <div>
                <h3 className="font-medium mb-3">What you'll learn:</h3>
                <div className="grid gap-2">
                  {course.whatYouLearn.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Skills you'll gain:</h3>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Prerequisites:</h3>
                <div className="space-y-1">
                  {course.prerequisites.map((prereq, index) => (
                    <div key={index} className="text-sm text-muted-foreground">• {prereq}</div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructor */}
          <Card>
            <CardHeader>
              <CardTitle>Your Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">{course.instructor.name}</div>
                    <div className="text-sm text-muted-foreground">{course.instructor.title}</div>
                  </div>
                </div>
                <p className="text-sm">{course.instructor.bio}</p>
                <div className="text-sm text-muted-foreground">
                  {course.instructor.experience} experience
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrollment */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{course.price}</div>
                  <div className="text-sm text-muted-foreground">One-time payment</div>
                </div>
                
                {course.enrolled ? (
                  <div className="space-y-3">
                    <Button className="w-full" asChild>
                      <Link to={`/education/course/${courseId}/module/6`}>
                        Continue Learning
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Resources
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full">
                    Enroll Now
                  </Button>
                )}

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Lifetime access
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Certificate of completion
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    30-day money back guarantee
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;