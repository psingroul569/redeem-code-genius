import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";

const CodePage = lazy(() => import("./pages/CodePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const HowToGuide = lazy(() => import("./pages/HowToGuide"));
const GuidesPage = lazy(() => import("./pages/Guides"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Help = lazy(() => import("./pages/Help"));
const Contact = lazy(() => import("./pages/Contact"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const PostsList = lazy(() => import("./pages/admin/PostsList"));
const PostEditor = lazy(() => import("./pages/admin/PostEditor"));
const PagesList = lazy(() => import("./pages/admin/PagesList"));
const PageEditor = lazy(() => import("./pages/admin/PageEditor"));
const MediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const MenusManager = lazy(() => import("./pages/admin/MenusManager"));
const RedirectsManager = lazy(() => import("./pages/admin/RedirectsManager"));
const SiteSettings = lazy(() => import("./pages/admin/SiteSettings"));
const ResetPassword = lazy(() => import("./pages/admin/ResetPassword"));
const DynamicPage = lazy(() => import("./pages/DynamicPage"));

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
          <Route path="/blogs/:slug" element={<Wrap><BlogPost /></Wrap>} />
          <Route path="/how-to-guide" element={<Wrap><HowToGuide /></Wrap>} />
          <Route path="/guides" element={<Wrap><GuidesPage /></Wrap>} />
          <Route path="/faq" element={<Wrap><FAQ /></Wrap>} />
          <Route path="/help" element={<Wrap><Help /></Wrap>} />
          <Route path="/contact" element={<Wrap><Contact /></Wrap>} />
          <Route path="/about-us" element={<Wrap><AboutUs /></Wrap>} />
          <Route path="/disclaimer" element={<Wrap><Disclaimer /></Wrap>} />
          <Route path="/privacy-policy" element={<Wrap><PrivacyPolicy /></Wrap>} />
          <Route path="/terms" element={<Wrap><Terms /></Wrap>} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<Wrap><AdminLogin /></Wrap>} />
          <Route path="/admin/reset-password" element={<Wrap><ResetPassword /></Wrap>} />
          <Route path="/admin" element={<Wrap><AdminLayout /></Wrap>}>
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<PostsList />} />
            <Route path="posts/:id" element={<PostEditor />} />
            <Route path="pages" element={<PagesList />} />
            <Route path="pages/:id" element={<PageEditor />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="menus" element={<MenusManager />} />
            <Route path="redirects" element={<RedirectsManager />} />
            <Route path="settings" element={<SiteSettings />} />
          </Route>

          {/* Dynamic CMS pages - must be before catch-all */}
          <Route path="/:slug" element={<Wrap><DynamicPage /></Wrap>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
