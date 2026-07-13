import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MarketingLayout from "./components/MarketingLayout";
import { TutorialProvider } from "./components/tutorial/TutorialProvider";
import { TutorialManager } from "./components/tutorial/TutorialManager";
import Index from "./pages/Index";
import BusinessPlan from "./pages/BusinessPlan";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import OrderFlow from "./pages/OrderFlow";
import MarketAnalysis from "./pages/MarketAnalysis";
import RiskManagement from "./pages/RiskManagement";
import Funding from "./pages/Funding";
import Performance from "./pages/Performance";
import Settings from "./pages/Settings";
import Education from "./pages/Education";
import Screener from "./pages/Screener";
import Support from "./pages/Support";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import CourseModule from "./pages/CourseModule";
import CourseCategories from "./pages/CourseCategories";
import Resources from "./pages/Resources";
import AlertConfiguration from "./pages/AlertConfiguration";
import PEAnalyzer from "./pages/PEAnalyzer";
import MarketOracle from "./pages/MarketOracle";
import QuantEngine from "./pages/QuantEngine";
import QuantEngineGuide from "./pages/QuantEngineGuide";
import FinanceReference from "./pages/FinanceReference";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import About from "./pages/About";
import TradingRules from "./pages/TradingRules";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { AuthPage } from "./components/AuthPage";

const queryClient = new QueryClient();

/** Wraps a page in the public marketing shell (top nav + footer, light theme). */
const M = ({ children }: { children: React.ReactNode }) => (
  <MarketingLayout>{children}</MarketingLayout>
);

/** Wraps a page in the trading application shell (dark sidebar theme). */
const A = ({ children }: { children: React.ReactNode }) => (
  <Layout>{children}</Layout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TutorialProvider>
        <Toaster />
        <Sonner />
        <TutorialManager />
        <BrowserRouter>
          <Routes>
            {/* ---------- Public marketing site ---------- */}
            <Route path="/" element={<M><Index /></M>} />
            <Route path="/education" element={<M><Education /></M>} />
            <Route path="/education/courses" element={<M><CourseCatalog /></M>} />
            <Route path="/education/course/:courseId" element={<M><CourseDetail /></M>} />
            <Route path="/education/course/:courseId/module/:moduleId" element={<M><CourseModule /></M>} />
            <Route path="/education/categories" element={<M><CourseCategories /></M>} />
            <Route path="/education/finance-reference" element={<M><FinanceReference /></M>} />
            <Route path="/resources" element={<M><Resources /></M>} />
            <Route path="/support" element={<M><Support /></M>} />
            <Route path="/faq" element={<M><FAQ /></M>} />
            <Route path="/about" element={<M><About /></M>} />
            <Route path="/trading-rules" element={<M><TradingRules /></M>} />
            <Route path="/privacy-policy" element={<M><PrivacyPolicy /></M>} />
            <Route path="/terms-of-service" element={<M><TermsOfService /></M>} />
            <Route path="/payment-success" element={<M><PaymentSuccess /></M>} />
            <Route path="/payment-canceled" element={<M><PaymentCanceled /></M>} />

            {/* ---------- Auth (standalone) ---------- */}
            <Route path="/auth" element={<AuthPage />} />

            {/* ---------- Trading application ---------- */}
            <Route path="/business-plan" element={<A><BusinessPlan /></A>} />
            <Route path="/analytics" element={<A><Analytics /></A>} />
            <Route path="/reports" element={<A><Reports /></A>} />
            <Route path="/screener" element={<A><Screener /></A>} />
            <Route path="/tools/order-flow" element={<A><OrderFlow /></A>} />
            <Route path="/tools/order-flow/alerts" element={<A><AlertConfiguration /></A>} />
            <Route path="/tools/analysis" element={<A><MarketAnalysis /></A>} />
            <Route path="/tools/risk" element={<A><RiskManagement /></A>} />
            <Route path="/tools/pe-analyzer" element={<A><PEAnalyzer /></A>} />
            <Route path="/tools/market-oracle" element={<A><MarketOracle /></A>} />
            <Route path="/tools/quant-engine" element={<A><QuantEngine /></A>} />
            <Route path="/tools/quant-engine/guide" element={<A><QuantEngineGuide /></A>} />
            <Route path="/account/funding" element={<A><Funding /></A>} />
            <Route path="/account/performance" element={<A><Performance /></A>} />
            <Route path="/account/settings" element={<A><Settings /></A>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<M><NotFound /></M>} />
          </Routes>
        </BrowserRouter>
      </TutorialProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
