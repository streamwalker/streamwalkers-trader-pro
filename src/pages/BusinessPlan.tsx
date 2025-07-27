import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BusinessPlan = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-accent/5">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-profit/10 text-profit border-profit/20">
            Strategic Business Plan
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-profit bg-clip-text text-transparent">
            StreamWalkers Trader Pro
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
            Build a proprietary funded trader platform generating <span className="text-profit font-semibold">$13M/month in net profit</span> within 18-24 months
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Objective Section */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              🎯 Objective
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">
              Build a proprietary funded trader platform using StreamWalkers Trader Pro that generates at least 
              <span className="text-profit font-semibold"> $10–13M/month in net profit</span> within 
              <span className="text-primary font-semibold"> 18–24 months</span> by onboarding, evaluating, and scaling profitable traders.
            </p>
          </CardContent>
        </Card>

        {/* Business Model Section */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              🧩 Business Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Element</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">💻 Platform Type</TableCell>
                  <TableCell>Funded trader evaluation and capital allocation</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">💸 Revenue Sources</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Evaluation fees ($147–$297/user/month)</li>
                      <li>Subscription tools (Trader Pro Add-ons, AI tools, etc.)</li>
                      <li>Performance-based revenue share from top traders</li>
                      <li>Education & mentorship upsells</li>
                      <li>White-labeled API licensing</li>
                    </ul>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">🤝 Cost Structure</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Profit splits (e.g., 80/20)</li>
                      <li>Payment processing + risk coverage</li>
                      <li>Tech infrastructure (AWS, Stripe, brokerage API)</li>
                      <li>Trader support/ops</li>
                      <li>Compliance, legal, KYC/AML</li>
                    </ul>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Financial Projections */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              💰 Financial Projection (Pro Forma – Y2 Target)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">🔥 Evaluation Signups/Month</TableCell>
                  <TableCell>50,000 users @ $147 avg</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">💵 Monthly Revenue</TableCell>
                  <TableCell className="text-profit font-semibold">$7,350,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">📈 Add-on Upsells</TableCell>
                  <TableCell>15% x $49 = $367,500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">📊 Performance Share from Traders</TableCell>
                  <TableCell className="text-profit font-semibold">$5.5M (net)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-lg">Total Monthly Net Profit</TableCell>
                  <TableCell className="text-profit font-bold text-lg">$13.1M</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Partner Payout (33%)</TableCell>
                  <TableCell>$4.33M</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">CAC (Blended)</TableCell>
                  <TableCell>$14–$22/user</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Execution Roadmap */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              📅 18-Month Execution Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* Phase 1 */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-primary">🔹 PHASE 1: MVP & Validation (Month 1–3)</h3>
              <p className="text-muted-foreground mb-4">
                <strong>Objectives:</strong> Build core platform, test evaluation engine, define payout logic + compliance
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Task</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1–10</TableCell>
                    <TableCell>Finalize branding, legal, .com domain, banking</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>11–25</TableCell>
                    <TableCell>Build MVP using Lovable.dev + Trading API (Rithmic, Tradovate)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>26–30</TableCell>
                    <TableCell>Connect payment stack (Stripe) + onboarding</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>31–45</TableCell>
                    <TableCell>Create evaluation ruleset (daily loss, max drawdown, targets)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>46–60</TableCell>
                    <TableCell>Build trader dashboard + Trader Pro AI Add-ons</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>61–75</TableCell>
                    <TableCell>Run first test group (100 paid users) + collect data</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>76–90</TableCell>
                    <TableCell>Optimize funnel, testimonials, landing page split test</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Phase 2 */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-primary">🔹 PHASE 2: Product Scale (Month 4–9)</h3>
              <p className="text-muted-foreground mb-4">
                <strong>Objectives:</strong> Reach $1M/mo, expand paid traffic + affiliates, launch "Instant Funding" feature
              </p>
              
              <div className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Launch 3 account types: $25K / $50K / $100K</li>
                  <li>Affiliate launch: 20% recurring commission</li>
                  <li>Launch Discord-based community + coaching upsell</li>
                  <li>Automate account resets, promotions, and leaderboards</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-4">KPI Milestones:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Paid Users</TableHead>
                      <TableHead>MRR</TableHead>
                      <TableHead>Net Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>4</TableCell>
                      <TableCell>5,000</TableCell>
                      <TableCell>$735K</TableCell>
                      <TableCell>$300K</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>6</TableCell>
                      <TableCell>15,000</TableCell>
                      <TableCell>$2.2M</TableCell>
                      <TableCell>$1.1M</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>9</TableCell>
                      <TableCell>30,000</TableCell>
                      <TableCell>$4.4M</TableCell>
                      <TableCell>$2.5M</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Phase 3 */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-primary">🔹 PHASE 3: Blitz to $13M/mo (Month 10–18)</h3>
              <p className="text-muted-foreground mb-4">
                <strong>Objectives:</strong> Hit 50,000 monthly users, offer copy trading + performance vault, create white-label B2B licensing
              </p>
              
              <div className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Scale with AI-generated trader feedback loops</li>
                  <li>Integrate funded trader "Vault" + leaderboard staking</li>
                  <li>Launch international versions: Spanish, Korean, French, Arabic</li>
                  <li>Expand into mobile app + YouTube creator referrals</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-4">KPI Milestones:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Paid Users</TableHead>
                      <TableHead>MRR</TableHead>
                      <TableHead>Add-ons</TableHead>
                      <TableHead>Funded Payout Share</TableHead>
                      <TableHead>Total Net Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>12</TableCell>
                      <TableCell>40,000</TableCell>
                      <TableCell>$5.88M</TableCell>
                      <TableCell>$500K</TableCell>
                      <TableCell>$4.5M</TableCell>
                      <TableCell>$10.88M</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>15</TableCell>
                      <TableCell>48,000</TableCell>
                      <TableCell>$7.05M</TableCell>
                      <TableCell>$720K</TableCell>
                      <TableCell>$5.1M</TableCell>
                      <TableCell>$12.87M</TableCell>
                    </TableRow>
                    <TableRow className="bg-profit/5">
                      <TableCell className="font-bold">18</TableCell>
                      <TableCell className="font-bold">52,000</TableCell>
                      <TableCell className="font-bold">$7.64M</TableCell>
                      <TableCell className="font-bold">$780K</TableCell>
                      <TableCell className="font-bold">$5.3M</TableCell>
                      <TableCell className="font-bold text-profit">$13.1M ✅</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Advantages */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              🧠 Key Advantages for StreamWalkers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">AI-Powered Performance Tracker</h4>
                  <p className="text-muted-foreground text-sm">Unique selling point for trade journaling and behavior feedback.</p>
                </div>
                <div className="p-4 bg-profit/5 border border-profit/20 rounded-lg">
                  <h4 className="font-semibold text-profit mb-2">Instant Funding Feature</h4>
                  <p className="text-muted-foreground text-sm">For verified pro accounts (after challenge).</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Affiliate Army</h4>
                  <p className="text-muted-foreground text-sm">Recruit via YouTube/Discord trading influencers.</p>
                </div>
                <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                  <h4 className="font-semibold mb-2">B2B Licensing</h4>
                  <p className="text-muted-foreground text-sm">Offer Trader Pro as a white-labeled API toolkit.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Structure */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              👥 Team Structure & Scaling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* Phased Scaling Overview */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phase</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Revenue Target</TableHead>
                  <TableHead>Staff Needed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>🚀 Tier 1: MVP Launch</TableCell>
                  <TableCell>Months 0–3</TableCell>
                  <TableCell>$0–$100K/mo</TableCell>
                  <TableCell>2–4 people</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>⚙️ Tier 2: Traction & Growth</TableCell>
                  <TableCell>Months 4–9</TableCell>
                  <TableCell>$100K–$2M/mo</TableCell>
                  <TableCell>6–12 people</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>🧠 Tier 3: Scale to $13M/mo</TableCell>
                  <TableCell>Months 10–24</TableCell>
                  <TableCell>$2M–$13M+/mo</TableCell>
                  <TableCell>20–40+ people</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Tier 1 Team */}
            <div>
              <h4 className="text-xl font-bold mb-4">📍 TIER 1: MVP Launch Team (2–4 People)</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Responsibility</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>🧑‍💻 CTO</TableCell>
                    <TableCell>Technical Founder</TableCell>
                    <TableCell>Build & maintain platform using Lovable.dev + Supabase + Broker API</TableCell>
                    <TableCell>Can be AI-assisted or contracted</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>👨‍💼 CEO/COO</TableCell>
                    <TableCell>Business Lead</TableCell>
                    <TableCell>Vision, legal setup, ops, metrics, affiliate recruitment</TableCell>
                    <TableCell>You (Phil Russell)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>🎨 Designer</TableCell>
                    <TableCell>UX/UI + Branding</TableCell>
                    <TableCell>Design trader dashboard, landing pages, AI tool UX</TableCell>
                    <TableCell>Optional (use prebuilt templates)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>🤖 AI Product Manager</TableCell>
                    <TableCell>Agent Workflow Builder</TableCell>
                    <TableCell>Build AI-powered trader journal & analysis tools</TableCell>
                    <TableCell>Optional if CTO is capable</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* AI Automation */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              🤖 AI Automation Strategies
            </CardTitle>
            <CardDescription>To reduce staff needs and increase efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>AI Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Customer Support</TableCell>
                  <TableCell>GPT-powered Helpdesk Bot (Zendesk / Intercom)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Trader Evaluation</TableCell>
                  <TableCell>Auto-Fail/Pass Rule Checker (Python / Supabase Trigger Agent)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payout Reviews</TableCell>
                  <TableCell>AI-Powered Payout Validator + Risk Audit Tool</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Performance Analysis</TableCell>
                  <TableCell>Auto-generated Trader Report Card</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ad Creative Generation</TableCell>
                  <TableCell>Midjourney + GPT Ad Copy + Meta API integration</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Affiliate Reporting</TableCell>
                  <TableCell>Daily Digest & Leaderboard Bot</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Legal & Compliance */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              🎓 Required Credentials & Legal Protections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
              <p className="text-sm">
                <strong>Important:</strong> Running a funded trading platform in the U.S. does not require FINRA registration IF you're not managing customer deposits, executing trades on behalf of others, or offering investment advice.
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credential / Legal</TableHead>
                  <TableHead>Why It's Needed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>✅ General Counsel (in-house or fractional)</TableCell>
                  <TableCell>Draft Terms of Service, Disclaimers, Risk Language, Arbitration Clause</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>✅ KYC/AML Partner</TableCell>
                  <TableCell>Use tools like SumSub or Veriff for identity verification</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>✅ Payment Processor Underwriting</TableCell>
                  <TableCell>Stripe, Solidgate, or Tilled for evaluation fees</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>✅ CFTC/NFA Legal Review (optional)</TableCell>
                  <TableCell>If offering derivatives or copy trading via smart contracts</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>✅ Insurance (Cyber Liability, Errors & Omissions)</TableCell>
                  <TableCell>For user data protection & fraud scenarios</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Final Recommendations */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              📌 Final Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-profit">✅</span>
                <p>Start with 4 roles (CTO, CEO, Support, Design)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-profit">⚙️</span>
                <p>Scale up to 12 with marketing, trader ops, AI agent builders, and devs</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-profit">🧠</span>
                <p>Hire a fractional legal team early — ensure Terms of Use, Evaluation Agreement, and Payout structure are legally bulletproof</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-profit">🎯</span>
                <p>Use AI agents and automation aggressively to delay needing full headcount</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default BusinessPlan;