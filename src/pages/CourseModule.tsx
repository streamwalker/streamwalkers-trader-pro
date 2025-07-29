import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  CheckCircle, 
  BookOpen,
  Download,
  MessageCircle,
  Star
} from "lucide-react";

const CourseModule = () => {
  const { courseId, moduleId } = useParams();
  
  // Mock data - in real app this would come from API
  const course = {
    id: parseInt(courseId || "1"),
    title: "Advanced Order Flow Analysis",
    totalModules: 18
  };

  const currentModule = {
    id: parseInt(moduleId || "1"),
    title: "Advanced Order Flow Patterns",
    description: "Learn to recognize complex order flow scenarios and market patterns",
    duration: "45 min",
    type: "video",
    videoUrl: "/api/placeholder/800/450",
    completed: false,
    transcript: `In this module, we'll explore advanced order flow patterns that professional traders use to identify high-probability trading opportunities.

Key concepts covered:
- Absorption patterns at key levels
- Iceberg orders and their detection  
- Volume imbalance signals
- Delta divergence patterns
- Market structure shifts

These patterns require practice to master, but once you understand them, you'll have a significant edge in reading market intentions.`,
    resources: [
      { name: "Module 6 Slides", type: "PDF", size: "2.3 MB" },
      { name: "Practice Charts", type: "PDF", size: "1.8 MB" },
      { name: "Order Flow Checklist", type: "PDF", size: "0.5 MB" }
    ],
    quiz: {
      questions: 8,
      passingScore: 80,
      attempts: 3
    }
  };

  const allModules = [
    { id: 1, title: "Introduction to Order Flow", completed: true },
    { id: 2, title: "Reading the Tape", completed: true },
    { id: 3, title: "Market Depth Analysis", completed: true },
    { id: 4, title: "Volume Profile Fundamentals", completed: true },
    { id: 5, title: "Identifying Institutional Activity", completed: true },
    { id: 6, title: "Advanced Order Flow Patterns", completed: false }, // Current
    { id: 7, title: "Practical Trading Applications", completed: false },
    { id: 8, title: "Risk Management with Order Flow", completed: false }
  ];

  const currentIndex = allModules.findIndex(m => m.id === currentModule.id);
  const previousModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
  const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;
  
  const completedModules = allModules.filter(m => m.completed).length;
  const progressPercentage = Math.round((completedModules / allModules.length) * 100);

  const handleMarkComplete = () => {
    // In real app, this would update the completion status
    console.log("Module marked as complete");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link to="/education" className="hover:text-foreground">Education</Link>
        <span>/</span>
        <Link to="/education/courses" className="hover:text-foreground">Courses</Link>
        <span>/</span>
        <Link to={`/education/course/${courseId}`} className="hover:text-foreground">{course.title}</Link>
        <span>/</span>
        <span className="text-foreground">{currentModule.title}</span>
      </div>

      {/* Course Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">{course.title}</h2>
              <p className="text-sm text-muted-foreground">
                Module {currentModule.id} of {course.totalModules}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{progressPercentage}% Complete</div>
              <Progress value={progressPercentage} className="w-32 h-2 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Module Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline">Module {currentModule.id}</Badge>
              <Badge variant="secondary">{currentModule.duration}</Badge>
              {currentModule.completed && (
                <Badge variant="default">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{currentModule.title}</h1>
            <p className="text-lg text-muted-foreground">{currentModule.description}</p>
          </div>

          {/* Video Player */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Button size="lg" className="rounded-full">
                    <PlayCircle className="w-8 h-8 mr-2" />
                    Play Video
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge variant="secondary">{currentModule.duration}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Module Content Tabs */}
          <div className="space-y-6">
            {/* Transcript */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Transcript & Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {currentModule.transcript.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Downloadable Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentModule.resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <Download className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{resource.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {resource.type} • {resource.size}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quiz */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Module Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Test your understanding of this module with a short quiz.
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <span><strong>{currentModule.quiz.questions}</strong> questions</span>
                    <span><strong>{currentModule.quiz.passingScore}%</strong> to pass</span>
                    <span><strong>{currentModule.quiz.attempts}</strong> attempts allowed</span>
                  </div>
                  <Button>Start Quiz</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {previousModule ? (
              <Button asChild variant="outline">
                <Link to={`/education/course/${courseId}/module/${previousModule.id}`}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous: {previousModule.title}
                </Link>
              </Button>
            ) : (
              <div />
            )}

            <Button onClick={handleMarkComplete}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>

            {nextModule ? (
              <Button asChild>
                <Link to={`/education/course/${courseId}/module/${nextModule.id}`}>
                  Next: {nextModule.title}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Module List */}
          <Card>
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {allModules.map((module, index) => (
                  <Link
                    key={module.id}
                    to={`/education/course/${courseId}/module/${module.id}`}
                    className={`block p-3 rounded-lg transition-colors ${
                      module.id === currentModule.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {module.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-muted-foreground rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {index + 1}. {module.title}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Discussion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Discussion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Ask questions and discuss this module with other students.
              </p>
              <Button variant="outline" className="w-full">
                Join Discussion
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseModule;