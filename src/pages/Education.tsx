import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Video, Award, Clock, TrendingUp, Users } from "lucide-react";

const Education = () => {
  const courses = [
    {
      id: 1,
      title: "Futures Trading Fundamentals",
      description: "Learn the basics of futures trading, market mechanics, and risk management",
      duration: "4 hours",
      difficulty: "Beginner",
      progress: 75,
      modules: 12,
      type: "video"
    },
    {
      id: 2,
      title: "Advanced Order Flow Analysis",
      description: "Master order flow patterns, market depth, and institutional trading strategies",
      duration: "6 hours",
      difficulty: "Advanced",
      progress: 30,
      modules: 18,
      type: "video"
    },
    {
      id: 3,
      title: "Risk Management Masterclass",
      description: "Comprehensive guide to position sizing, portfolio management, and capital preservation",
      duration: "3 hours",
      difficulty: "Intermediate",
      progress: 100,
      modules: 10,
      type: "interactive"
    },
    {
      id: 4,
      title: "Technical Analysis Deep Dive",
      description: "Advanced charting techniques, indicators, and pattern recognition",
      duration: "5 hours",
      difficulty: "Intermediate",
      progress: 0,
      modules: 15,
      type: "video"
    }
  ];

  const achievements = [
    { title: "First Trade", description: "Complete your first profitable trade", earned: true },
    { title: "Risk Manager", description: "Complete the Risk Management course", earned: true },
    { title: "Technical Expert", description: "Master 10 technical indicators", earned: false },
    { title: "Consistent Trader", description: "Maintain profitability for 30 days", earned: false },
  ];

  const webinars = [
    {
      title: "Market Outlook 2024",
      speaker: "John Martinez",
      date: "Feb 15, 2024",
      time: "2:00 PM EST",
      attendees: 234,
      status: "upcoming"
    },
    {
      title: "Options Trading Strategies",
      speaker: "Sarah Chen",
      date: "Feb 10, 2024",
      time: "1:00 PM EST",
      attendees: 189,
      status: "recorded"
    },
    {
      title: "Psychology of Trading",
      speaker: "Mike Thompson",
      date: "Feb 8, 2024",
      time: "3:00 PM EST",
      attendees: 312,
      status: "recorded"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("pages.education.title")}</h1>
          <p className="text-muted-foreground">
            {t("pages.education.subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link to="/education/courses">
            <Video className="mr-2 h-4 w-4" />
            Browse All Courses
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Out of 12 available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27.5</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Badges earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Level</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Intermediate</div>
            <p className="text-xs text-muted-foreground">
              Keep learning!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Continue your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                    </div>
                    <Badge variant={course.difficulty === "Beginner" ? "secondary" : course.difficulty === "Intermediate" ? "default" : "destructive"}>
                      {course.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {course.type === "video" ? <Video className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                      {course.duration}
                    </span>
                    <span>{course.modules} modules</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <Button 
                    className="w-full" 
                    variant={course.progress === 0 ? "default" : course.progress === 100 ? "secondary" : "outline"}
                  >
                    {course.progress === 0 ? "Start Course" : course.progress === 100 ? "Review" : "Continue"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your learning milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.earned ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    </div>
                    {achievement.earned && (
                      <Badge variant="default">Earned</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Webinars</CardTitle>
              <CardDescription>Live trading sessions and educational events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {webinars.map((webinar, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{webinar.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {webinar.speaker} • {webinar.date} at {webinar.time}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {webinar.attendees} attendees
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={webinar.status === "upcoming" ? "default" : "secondary"}>
                        {webinar.status === "upcoming" ? "Register" : "Watch"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Education;