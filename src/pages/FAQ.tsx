import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronDown, MessageCircle, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const faqData = [
    {
      id: "account-trading",
      category: "Account & Trading",
      icon: "💼",
      questions: [
        {
          id: "fund-account",
          question: "How do I fund my trading account?",
          answer: "You can fund your account through multiple methods: bank wire transfers, ACH deposits, or our instant funding program. Visit your account dashboard and click 'Add Funds' to get started. Wire transfers typically take 1-2 business days, while ACH transfers take 3-5 days. Our instant funding program provides immediate access up to $25,000 for qualified traders.",
          relatedLinks: [
            { text: "Funding Page", url: "/funding" },
            { text: "Account Dashboard", url: "/account" }
          ]
        },
        {
          id: "margin-requirements",
          question: "What are the margin requirements?",
          answer: "Margin requirements vary by instrument and account type. For stocks, the standard requirement is 25% of the position value. Futures typically require $500-$1,500 per contract depending on the instrument. Day trading requires a minimum $25,000 account balance. Check our risk management tools for real-time margin calculations.",
          relatedLinks: [
            { text: "Risk Management", url: "/tools/risk" },
            { text: "Account Requirements", url: "/resources" }
          ]
        },
        {
          id: "first-trade",
          question: "How do I place my first trade?",
          answer: "Start by completing our trading education modules, then practice with our simulator. Once ready, log into your trading platform, select your instrument, choose your position size, set your stop loss and take profit levels, and execute your trade. We recommend starting with small positions while you learn.",
          relatedLinks: [
            { text: "Trading Education", url: "/education" },
            { text: "Trading Tools", url: "/tools" }
          ]
        },
        {
          id: "supported-platforms",
          question: "What trading platforms do you support?",
          answer: "We support NinjaTrader 8, TradingView, Sierra Chart, and our proprietary web platform. Each platform offers different features - NinjaTrader is excellent for futures, TradingView for charting, and Sierra Chart for advanced order flow analysis. Platform setup guides are available in our resources section.",
          relatedLinks: [
            { text: "Platform Setup", url: "/resources" },
            { text: "Trading Tools", url: "/tools" }
          ]
        }
      ]
    },
    {
      id: "technical-issues",
      category: "Technical Issues",
      icon: "🔧",
      questions: [
        {
          id: "platform-loading",
          question: "Platform not loading properly",
          answer: "First, check your internet connection and clear your browser cache. Ensure you're using a supported browser (Chrome, Firefox, Safari, Edge). Disable browser extensions that might interfere. If using a desktop platform, restart the application and check for updates. For persistent issues, try accessing from a different network or device.",
          relatedLinks: [
            { text: "System Requirements", url: "/resources" },
            { text: "Contact Support", url: "/support" }
          ]
        },
        {
          id: "order-execution",
          question: "Order execution problems",
          answer: "Order execution issues can stem from market conditions, insufficient buying power, or platform connectivity. Check that markets are open, verify your account balance, and ensure your order parameters are correct. For futures, confirm you have sufficient margin. If problems persist, check our platform status page or contact support immediately.",
          relatedLinks: [
            { text: "Trading Rules", url: "/resources" },
            { text: "Live Support", url: "/support" }
          ]
        },
        {
          id: "data-feed",
          question: "Data feed connectivity issues",
          answer: "Data feed issues typically resolve within minutes. Check your internet connection first, then restart your trading platform. Verify your data subscriptions are active in your account settings. Some data feeds require separate subscriptions for real-time quotes. If issues persist beyond 10 minutes, contact our technical support team.",
          relatedLinks: [
            { text: "Data Subscriptions", url: "/account/settings" },
            { text: "Platform Status", url: "/resources" }
          ]
        },
        {
          id: "mobile-app",
          question: "Mobile app troubleshooting",
          answer: "Ensure you have the latest app version installed. Close and restart the app if experiencing issues. Check your mobile data or WiFi connection. Clear the app cache in your device settings. For login issues, verify your credentials in the web version first. Uninstall and reinstall the app if problems persist.",
          relatedLinks: [
            { text: "Mobile Setup Guide", url: "/resources" },
            { text: "App Store", url: "#" }
          ]
        }
      ]
    },
    {
      id: "risk-management",
      category: "Risk Management",
      icon: "🛡️",
      questions: [
        {
          id: "stop-loss",
          question: "How to set stop-loss orders?",
          answer: "Stop-loss orders limit your losses by automatically closing positions at predetermined levels. Set them at 1-2% below your entry for stocks, or at technical support levels. For futures, consider volatility and use dollar amounts rather than percentages. Always set stop-losses before entering trades, not after you're already losing money.",
          relatedLinks: [
            { text: "Risk Management Tools", url: "/tools/risk" },
            { text: "Trading Education", url: "/education" }
          ]
        },
        {
          id: "position-sizing",
          question: "Position sizing guidelines",
          answer: "Never risk more than 1-2% of your account on a single trade. Calculate position size based on your stop-loss distance and risk amount. For a $10,000 account risking 1% ($100), with a $2 stop-loss, you can buy 50 shares. Use our position sizing calculator for automatic calculations.",
          relatedLinks: [
            { text: "Position Calculator", url: "/tools/calculator" },
            { text: "Risk Guidelines", url: "/education" }
          ]
        },
        {
          id: "margin-calls",
          question: "Understanding margin calls",
          answer: "A margin call occurs when your account equity falls below the required maintenance margin. You'll receive immediate notification and must either deposit funds or close positions to meet the requirement. Failure to meet a margin call may result in automatic position closure. Monitor your margin usage regularly to avoid calls.",
          relatedLinks: [
            { text: "Margin Requirements", url: "/account/margin" },
            { text: "Account Monitoring", url: "/account" }
          ]
        },
        {
          id: "risk-best-practices",
          question: "Risk management best practices",
          answer: "Follow the 1% rule, diversify across multiple trades, use stop-losses consistently, avoid revenge trading, keep detailed trading journals, and never risk money you can't afford to lose. Set daily loss limits and stick to them. Review and adjust your risk parameters regularly based on performance and market conditions.",
          relatedLinks: [
            { text: "Trading Journal", url: "/tools/journal" },
            { text: "Performance Analytics", url: "/analytics" }
          ]
        }
      ]
    },
    {
      id: "platform-setup",
      category: "Platform Setup",
      icon: "⚙️",
      questions: [
        {
          id: "ninjatrader-setup",
          question: "NinjaTrader integration setup",
          answer: "Download NinjaTrader 8 from their website, install the software, then connect to our data feed using your provided credentials. Configure your trading account connection in the Control Center. Download our custom indicators and strategies from the resources section. Complete the platform walkthrough tutorial before live trading.",
          relatedLinks: [
            { text: "NinjaTrader Download", url: "/resources" },
            { text: "Platform Tutorials", url: "/education" }
          ]
        },
        {
          id: "tradingview-connection",
          question: "Connecting TradingView charts",
          answer: "Link your TradingView account through our platform integration page. Ensure you have a TradingView Pro subscription for real-time data. Our custom indicators will appear in your TradingView library after connection. Use TradingView for analysis and our execution platform for orders until full integration is available.",
          relatedLinks: [
            { text: "TradingView Integration", url: "/resources" },
            { text: "Chart Setup", url: "/education" }
          ]
        },
        {
          id: "sierra-chart",
          question: "Sierra Chart configuration",
          answer: "Sierra Chart offers advanced order flow analysis. Download the software, configure your data feed, and import our custom studies. Set up Time & Sales windows, volume profile studies, and market depth displays. This platform is recommended for advanced traders familiar with order flow concepts.",
          relatedLinks: [
            { text: "Sierra Chart Setup", url: "/resources" },
            { text: "Order Flow Education", url: "/education" }
          ]
        }
      ]
    },
    {
      id: "education-resources",
      category: "Education & Resources",
      icon: "📚",
      questions: [
        {
          id: "course-access",
          question: "How to access trading courses",
          answer: "All courses are available in your education dashboard. Complete the beginner track first, then progress to intermediate and advanced modules. Each course includes video lessons, quizzes, and practical exercises. Track your progress and earn certificates for completed modules.",
          relatedLinks: [
            { text: "Course Catalog", url: "/education" },
            { text: "Learning Paths", url: "/education/categories" }
          ]
        },
        {
          id: "certification",
          question: "Trading certification programs",
          answer: "We offer three certification levels: Foundation Trader, Professional Trader, and Expert Trader. Each requires completion of specific courses and passing a comprehensive exam. Certifications demonstrate your trading knowledge and may qualify you for increased funding limits.",
          relatedLinks: [
            { text: "Certification Requirements", url: "/education" },
            { text: "Exam Schedule", url: "/education" }
          ]
        }
      ]
    },
    {
      id: "billing-subscription",
      category: "Billing & Subscription",
      icon: "💳",
      questions: [
        {
          id: "payment-methods",
          question: "Accepted payment methods",
          answer: "We accept major credit cards (Visa, MasterCard, American Express), bank transfers, and ACH payments. Subscription fees are charged monthly or annually depending on your plan. International payments may incur additional processing fees.",
          relatedLinks: [
            { text: "Billing Settings", url: "/account/billing" },
            { text: "Pricing Plans", url: "/#pricing" }
          ]
        },
        {
          id: "plan-changes",
          question: "Changing subscription plans",
          answer: "You can upgrade or downgrade your plan anytime from your account settings. Upgrades take effect immediately, while downgrades occur at your next billing cycle. Pro-rated charges apply for mid-cycle upgrades. Contact support for assistance with plan changes.",
          relatedLinks: [
            { text: "Account Settings", url: "/account/settings" },
            { text: "Plan Comparison", url: "/#pricing" }
          ]
        }
      ]
    }
  ];

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link to="/support">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Support
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t("pages.faq.title")}</h1>
          <p className="text-muted-foreground">
            {t("pages.faq.subtitle")}
          </p>
        </div>
        <Button>
          <MessageCircle className="mr-2 h-4 w-4" />
          Contact Support
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search FAQs</CardTitle>
          <CardDescription>Find specific questions and answers quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions and answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredFAQs.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                {category.category}
                <Badge variant="secondary">{category.questions.length}</Badge>
              </CardTitle>
              <CardDescription>
                {category.category === "Account & Trading" && "Questions about funding, trading, and account management"}
                {category.category === "Technical Issues" && "Platform troubleshooting and technical support"}
                {category.category === "Risk Management" && "Best practices for managing trading risk"}
                {category.category === "Platform Setup" && "Configuration guides for trading platforms"}
                {category.category === "Education & Resources" && "Learning materials and certification information"}
                {category.category === "Billing & Subscription" && "Payment methods and subscription management"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.questions.map((faq) => (
                <Collapsible
                  key={faq.id}
                  open={openSections.includes(faq.id)}
                  onOpenChange={() => toggleSection(faq.id)}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 rounded-lg border">
                    <span className="font-medium">{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes(faq.id) ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4">
                    <div className="space-y-4 pt-2">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Related Resources:</h5>
                          <div className="flex flex-wrap gap-2">
                            {faq.relatedLinks.map((link, index) => (
                              <Link
                                key={index}
                                to={link.url}
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                              >
                                {link.text}
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-4 pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Was this helpful?</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">👍 Yes</Button>
                          <Button variant="outline" size="sm">👎 No</Button>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFAQs.length === 0 && searchTerm && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No FAQs found matching "{searchTerm}"</p>
            <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
          <CardDescription>Can't find what you're looking for? Our support team is here to help.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link to="/support">
            <Button>
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </Link>
          <Button variant="outline">
            Submit Ticket
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;