import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
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
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import CourseModule from "./pages/CourseModule";
import CourseCategories from "./pages/CourseCategories";
import Resources from "./pages/Resources";
import AlertConfiguration from "./pages/AlertConfiguration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/business-plan" element={<BusinessPlan />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/tools/order-flow" element={<OrderFlow />} />
            <Route path="/tools/analysis" element={<MarketAnalysis />} />
            <Route path="/tools/risk" element={<RiskManagement />} />
            <Route path="/account/funding" element={<Funding />} />
            <Route path="/account/performance" element={<Performance />} />
            <Route path="/account/settings" element={<Settings />} />
            <Route path="/education" element={<Education />} />
            <Route path="/education/courses" element={<CourseCatalog />} />
            <Route path="/education/course/:courseId" element={<CourseDetail />} />
            <Route path="/education/course/:courseId/module/:moduleId" element={<CourseModule />} />
            <Route path="/education/categories" element={<CourseCategories />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/tools/order-flow/alerts" element={<AlertConfiguration />} />
            <Route path="/support" element={<Support />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
