import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
const Index = lazy(() => import("./pages/Index"));

const NotFound = lazy(() => import("./pages/NotFound"));
const Blogs = lazy(() => import("./pages/Blogs"));
const HowToGuide = lazy(() => import("./pages/HowToGuide"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Help = lazy(() => import("./pages/Help"));
const Contact = lazy(() => import("./pages/Contact"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));

const queryClient = new QueryClient();

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={null}>{children}</Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Suspense fallback={null}>
        <Toaster />
        <Sonner />
      </Suspense>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blogs" element={<Wrap><Blogs /></Wrap>} />
          <Route path="/how-to-guide" element={<Wrap><HowToGuide /></Wrap>} />
          <Route path="/faq" element={<Wrap><FAQ /></Wrap>} />
          <Route path="/help" element={<Wrap><Help /></Wrap>} />
          <Route path="/contact" element={<Wrap><Contact /></Wrap>} />
          <Route path="/about-us" element={<Wrap><AboutUs /></Wrap>} />
          <Route path="/disclaimer" element={<Wrap><Disclaimer /></Wrap>} />
          <Route path="/privacy-policy" element={<Wrap><PrivacyPolicy /></Wrap>} />
          <Route path="/terms" element={<Wrap><Terms /></Wrap>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
