import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Phone, Mail, HelpCircle, FileText, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Support = () => {
  const { t } = useTranslation();
  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7",
      responseTime: "< 2 minutes",
      status: "online"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with a trading specialist",
      availability: "Mon-Fri 8AM-8PM EST",
      responseTime: "Immediate",
      status: "available"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send detailed questions and get comprehensive answers",
      availability: "24/7",
      responseTime: "< 4 hours",
      status: "online"
    }
  ];

  const faqCategories = [
    {
      category: "Account & Trading",
      questions: [
        "How do I fund my trading account?",
        "What are the margin requirements?",
        "How do I place my first trade?",
        "What trading platforms do you support?"
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        "Platform not loading properly",
        "Order execution problems",
        "Data feed connectivity issues",
        "Mobile app troubleshooting"
      ]
    },
    {
      category: "Risk Management",
      questions: [
        "How to set stop-loss orders?",
        "Position sizing guidelines",
        "Understanding margin calls",
        "Risk management best practices"
      ]
    }
  ];

  const recentTickets = [
    {
      id: "T-2024-001",
      subject: "Platform login issue",
      status: "Resolved",
      created: "2024-01-30",
      updated: "2024-01-30",
      priority: "High"
    },
    {
      id: "T-2024-002",
      subject: "Question about margin requirements",
      status: "In Progress",
      created: "2024-01-29",
      updated: "2024-01-30",
      priority: "Medium"
    },
    {
      id: "T-2024-003",
      subject: "API integration help",
      status: "Open",
      created: "2024-01-28",
      updated: "2024-01-29",
      priority: "Low"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("pages.support.title")}</h1>
          <p className="text-muted-foreground">
            {t("pages.support.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            View All Tickets
          </Button>
          <Button>
            <MessageCircle className="mr-2 h-4 w-4" />
            Start Live Chat
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {supportChannels.map((channel, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <channel.icon className="h-8 w-8 text-primary" />
                <Badge variant={channel.status === "online" ? "default" : "secondary"}>
                  {channel.status}
                </Badge>
              </div>
              <CardTitle>{channel.title}</CardTitle>
              <CardDescription>{channel.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability:</span>
                  <span>{channel.availability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time:</span>
                  <span>{channel.responseTime}</span>
                </div>
              </div>
              <Button className="w-full mt-4">Contact Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submit a Support Ticket</CardTitle>
            <CardDescription>Describe your issue and we'll get back to you quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="account">Account Question</SelectItem>
                  <SelectItem value="trading">Trading Support</SelectItem>
                  <SelectItem value="billing">Billing Inquiry</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Brief description of your issue" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Please provide detailed information about your issue..."
                rows={4}
              />
            </div>

            <Button className="w-full">Submit Ticket</Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      {category.category}
                    </h4>
                    <div className="ml-6 space-y-1">
                      {category.questions.map((question, qIndex) => (
                        <Link 
                          key={qIndex} 
                          to={`/faq#${category.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                          className="block text-sm text-muted-foreground hover:text-foreground cursor-pointer hover:underline"
                        >
                          • {question}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/faq">
                <Button variant="outline" className="w-full mt-4">
                  View All FAQs
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Support Tickets</CardTitle>
              <CardDescription>Track your recent support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ticket.id}</span>
                        <Badge 
                          variant={
                            ticket.status === "Resolved" ? "default" : 
                            ticket.status === "In Progress" ? "secondary" : "outline"
                          }
                        >
                          {ticket.status === "Resolved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {ticket.status === "In Progress" && <Clock className="w-3 h-3 mr-1" />}
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{ticket.subject}</div>
                      <div className="text-xs text-muted-foreground">
                        Created: {ticket.created} | Updated: {ticket.updated}
                      </div>
                    </div>
                    <Badge variant={
                      ticket.priority === "High" ? "destructive" : 
                      ticket.priority === "Medium" ? "default" : "secondary"
                    }>
                      {ticket.priority}
                    </Badge>
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

export default Support;