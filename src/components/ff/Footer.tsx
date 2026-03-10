import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border pt-10 pb-10 relative z-10 font-tech">
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <p className="text-center text-t-muted text-xs uppercase tracking-[0.3em] mb-6">As Seen On</p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 md:gap-x-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-500 px-4">
          {["GAMINGWEEK", "ESPORTSDAILY", "FF WIKIA", "REDDIT", "DISCORD PRO"].map((brand) => (
            <span
              key={brand}
              className="text-base md:text-xl font-display text-foreground tracking-tighter whitespace-nowrap"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mb-12 border-b border-border pb-12">
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6 md:gap-x-16">
          <div className="col-span-3 lg:col-span-1 mb-4 lg:mb-0">
            <h3 className="font-display text-2xl md:text-3xl text-foreground mb-4 uppercase tracking-tight leading-none">
              FF REDEEM CODE TODAY
            </h3>
            <p className="text-t-muted text-sm md:text-base leading-relaxed mb-6 max-w-md">
              Your trusted intelligence Platform for Garena Free Fire MAX and Garena Free Fire redeem codes. We verify
              every single code on live server nodes for maximum accuracy.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="text-foreground font-bold text-sm md:text-base mb-6 tracking-[0.15em] uppercase border-b border-border pb-2 inline-block">
              Resources
            </h4>
            <ul className="space-y-4 text-sm md:text-base text-t-muted">
              <li>
                <Link to="/blogs" className="hover:text-foreground transition-colors block">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-foreground transition-colors block">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-foreground transition-colors block">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="text-foreground font-bold text-sm md:text-base mb-6 tracking-[0.15em] uppercase border-b border-border pb-2 inline-block">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm md:text-base text-t-muted">
              <li>
                <Link to="/help" className="hover:text-foreground transition-colors block">
                  Help
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors block">
                  Email
                </Link>
              </li>
              <li className="text-[10px] md:text-xs text-t-muted/40 pt-1 tracking-widest uppercase">
                Verified Response: 24H
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="text-foreground font-bold text-sm md:text-base mb-6 tracking-[0.15em] uppercase border-b border-border pb-2 inline-block">
              Compliance
            </h4>
            <ul className="space-y-4 text-sm md:text-base text-t-muted">
              <li>
                <Link to="/about-us" className="hover:text-foreground transition-colors block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-foreground transition-colors block">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-foreground transition-colors block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors block">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs text-t-muted/60 leading-relaxed uppercase tracking-[0.25em] mb-6 max-w-3xl mx-auto px-4">
          This platform is an independent resource for gaming enthusiasts. We are not officially affiliated with Garena
          International. All trademarks belong to their respective owners.
        </p>
        <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-[0.4em] font-bold">
          &copy; {new Date().getFullYear()} FF REDEEM CODE TODAY
        </div>
      </div>
    </footer>
  );
};
