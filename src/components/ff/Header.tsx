import React from "react";
import { AppView } from "@/types";
import { Zap } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  currentView?: AppView;
  setView?: (view: AppView) => void;
  isSyncing?: boolean;
  syncingRegion?: string | null;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView = "home",
  setView = () => {},
  isSyncing = false,
  syncingRegion = null,
  theme = "light",
  onToggleTheme = () => {},
}) => {
  return (
    <header className="sticky top-0 bg-background/90 backdrop-blur-xl pt-4 pb-4 z-50 border-b border-border transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-5 group cursor-pointer min-w-0" onClick={() => setView("home")}>
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 bg-success/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-10 h-10 md:w-12 md:h-12 bg-surface border border-border rounded-xl flex items-center justify-center group-hover:border-success/50 transition-all duration-300 shadow-inner">
              <Zap size={22} className="text-success fill-success/10 md:w-6 md:h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background flex items-center justify-center">
                <div className="w-1 h-1 bg-background rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
          {/* Mobile: compact centered branding */}
          <div className="flex md:hidden flex-col min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-[15px] tracking-tight text-t-muted leading-none font-black italic">Free Fire</span>
              <span className="font-display text-[15px] tracking-tight text-foreground leading-none font-black uppercase">REDEEM CODE</span>
              <span className="font-display text-[15px] tracking-tight text-success leading-none font-black italic uppercase">TODAY</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[8px] text-t-muted tracking-[0.15em] font-tech uppercase font-bold truncate">
                Free Fire Working Redeem Codes For
              </span>
              <span className="text-[8px] text-success font-tech font-bold uppercase tracking-widest animate-pulse">
                Today
              </span>
            </div>
          </div>
          {/* Desktop: full branding with subtitle */}
          <div className="hidden md:flex flex-col min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl tracking-tight text-t-muted leading-none font-black italic">Free Fire</span>
              <span className="font-display text-2xl tracking-tight text-foreground leading-none font-black uppercase">REDEEM CODE</span>
              <span className="font-display text-2xl tracking-tight text-success leading-none font-black italic uppercase">TODAY</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] text-t-muted tracking-[0.2em] font-tech uppercase font-bold truncate">
                Free Fire Working Redeem Codes For
              </span>
              <span className="text-[10px] text-success font-tech font-bold uppercase tracking-widest animate-pulse">
                Today
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
};
