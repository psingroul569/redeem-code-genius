import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Home, BookOpen, Gift,
  Package, Crosshair, Flame, Smile, PawPrint, User, Shield, Lock,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/ff/ThemeToggle";
import { GuideCategory } from "@/data/ffGuides";
import { track, guidePageType, ensureAdsTag } from "@/lib/ads";

export const CATEGORY_ICONS: Record<GuideCategory["icon"], React.ElementType> = {
  package: Package,
  crosshair: Crosshair,
  flame: Flame,
  smile: Smile,
  paw: PawPrint,
  user: User,
  shield: Shield,
  lock: Lock,
};

interface GuideShellProps {
  title: string;
  backTo?: string;
  /** Force the dark gaming look regardless of the site theme. */
  dark?: boolean;
  children: React.ReactNode;
}

/** Fires ffg_page_view plus a page-specific ffg_view_<type> event on every route change. */
export function useGuidePageView() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const [, , category, item] = pathname.split("/");
    const params = new URLSearchParams(search);
    const type = guidePageType(pathname);
    const data = {
      page_type: type,
      page_path: pathname,
      category: type === "home" || type === "categories" ? undefined : category,
      item,
      server: params.get("server") ?? undefined,
      level: params.get("level") ?? undefined,
      rank: params.get("rank") ?? undefined,
    };
    ensureAdsTag();
    track("ffg_page_view", data);
    track(`ffg_view_${type}`, data);
  }, [pathname, search]);
}

const NAV = [
  { to: "/ff-guides", label: "Home", icon: Home },
  { to: "/ff-guides/how-to", label: "How To", icon: BookOpen },
  { to: "/", label: "Codes", icon: Gift },
];

export const GuideShell: React.FC<GuideShellProps> = ({ title, backTo, dark, children }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useGuidePageView();

  return (
    <div className={`min-h-screen text-foreground font-tech flex flex-col ${dark ? "dark bg-[#05070d]" : "bg-background"}`}>
      <header className={`sticky top-0 z-40 backdrop-blur border-b border-border ${dark ? "bg-[#05070d]/90" : "bg-background/90"}`}>
        <div className="max-w-3xl mx-auto px-4 h-16 grid grid-cols-[48px_1fr_48px] items-center gap-2">
          {backTo ? (
            <button
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(backTo))}
              aria-label="Go back"
              className="w-11 h-11 rounded-2xl border border-border bg-surface flex items-center justify-center hover:bg-surface-hover transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <Link to="/ff-guides" className="w-11 h-11 rounded-2xl bg-surface border border-border overflow-hidden">
              <img src="/logo.png" alt="FF Guides" className="w-full h-full object-contain p-1" />
            </Link>
          )}
          <h1 className="min-w-0 truncate text-center font-bold text-lg md:text-xl uppercase tracking-[0.12em]">
            {title}
          </h1>
          <div className="flex justify-end">
            {backTo ? (
              <Link
                to="/ff-guides"
                aria-label="Home"
                className="w-11 h-11 rounded-2xl border border-border bg-surface flex items-center justify-center hover:bg-surface-hover transition-colors"
              >
                <Home size={20} />
              </Link>
            ) : (
              !dark && <ThemeToggle theme={theme} onToggle={toggleTheme} />
            )}
          </div>
        </div>
      </header>

      <main key={pathname} className="flex-1 w-full max-w-3xl mx-auto px-4 pt-5 pb-28 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {children}
      </main>

      <BottomNav dark={dark} />
    </div>
  );
};

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="font-display text-sm uppercase italic tracking-wide text-t-muted mb-3 mt-8 first:mt-0">{children}</h2>
);

const NON_HOME = ["/ff-guides/how-to", "/ff-guides/privacy-policy", "/ff-guides/disclaimer"];

/** Bottom tab bar. Home stays lit while drilling into categories and items. */
export const BottomNav: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const { pathname } = useLocation();
  const activeTo = pathname === "/" ? "/" : NON_HOME.includes(pathname) ? pathname : "/ff-guides";

  return (
    <nav
      className={`fixed bottom-0 inset-x-0 z-40 backdrop-blur border-t pb-[env(safe-area-inset-bottom)] ${
        dark ? "bg-[#05070d]/90 border-white/10" : "bg-background/95 border-border"
      }`}
    >
      <div className="max-w-3xl mx-auto grid grid-cols-3">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
              activeTo === to ? (dark ? "text-sky-300" : "text-success") : dark ? "text-white/50 hover:text-white" : "text-t-muted hover:text-foreground"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
