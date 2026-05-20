import { Header } from "@/components/ff/Header";
import { Footer } from "@/components/ff/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Database, Cookie, Settings, Shield, Users, Baby, RefreshCw, Mail, Eye } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { SITE_NAME } from "@/constants";


const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    body: "We keep data collection minimal and only gather what is genuinely needed to run the site properly. Here is a straightforward breakdown of what gets collected and how.",
    subsections: [
      {
        label: "Automatically Collected",
        bullets: [
          "Device info - browser type, operating system, screen resolution",
          "Usage data - pages visited, time spent, click patterns",
          "IP address and general location (country or region only)",
          "Referral source - how you landed on our site",
        ],
      },
      {
        label: "Information You Provide",
        bullets: [
          "Contact form submissions - name, email address, message",
          "Feedback and survey responses (if you choose to fill one)",
          "Comments or user-generated content where applicable",
        ],
      },
    ],
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    body: "We use cookies and similar technologies to keep the site running smoothly and to understand how people use it. You can manage cookie preferences through your browser settings, though switching off certain cookies may affect how parts of the site work.",
    subsections: [
      {
        label: "Types of Cookies We Use",
        items: [
          {
            name: "Essential Cookies",
            desc: "Required for basic website functionality - the site cannot work properly without these.",
          },
          {
            name: "Analytics Cookies",
            desc: "Help us see which pages are popular and how visitors move around the site (via Google Analytics).",
          },
          { name: "Advertising Cookies", desc: "Used to show relevant ads and measure how well they perform." },
          { name: "Preference Cookies", desc: "Remember your settings so you do not have to reset them every visit." },
        ],
      },
    ],
  },
  {
    icon: Settings,
    title: "How We Use Your Information",
    body: "We only use your information for things that genuinely improve your experience on the site. Nothing is sold to third parties.",
    bullets: [
      "Keep the website running and fix issues as they come up",
      "Improve site performance and the overall user experience",
      "Reply to your messages and support requests",
      "Send important updates when something on the site changes",
      "Understand usage patterns so we can improve our content",
      "Detect and prevent fraud or security threats",
      "Meet any legal obligations that apply to us",
    ],
  },
  {
    icon: Users,
    title: "Third-Party Services",
    body: "We work with a small number of trusted third-party services. Each of them may collect certain information about your visit in line with their own privacy policies.",
    items: [
      {
        name: "Google Analytics",
        desc: "Helps us understand how traffic flows through the site - pages visited, session length, browser type. Google may process your IP address as part of this.",
        link: { label: "View Google's Privacy Policy", url: "https://policies.google.com/privacy" },
      },
      {
        name: "Advertising Networks",
        desc: "We partner with ad networks to show relevant ads. These networks may use cookies to tailor ads based on browsing behavior across different sites.",
      },
      {
        name: "Social Media Platforms",
        desc: "Some pages include social sharing buttons. If you interact with them, the respective platforms (Facebook, Twitter, etc.) may collect data about your visit per their own policies.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Data Security",
    body: "We take reasonable steps to keep your information secure. That said, no system connected to the internet is completely risk-free, and we cannot guarantee absolute security.",
    bullets: [
      "SSL encryption for all data transmission",
      "Regular security reviews and software updates",
      "Access controls and authentication on internal systems",
      "Data backup and recovery procedures in place",
    ],
  },
  {
    icon: Eye,
    title: "Your Rights",
    body: "You have real control over your personal information. Here is what you can ask us to do at any time:",
    bullets: [
      "Access - request a copy of any personal data we hold about you",
      "Correction - ask us to fix anything that is inaccurate or incomplete",
      "Deletion - request that we delete your personal information",
      "Opt-out - unsubscribe from any marketing or update emails",
      "Data Portability - ask us to transfer your data to another service",
    ],
    footer:
      "To exercise any of these rights, reach out to us at contact@todayesports.com and we will respond promptly.",
  },
  {
    icon: Baby,
    title: "Children's Privacy",
    body: "This site is not directed at children under the age of 13. We do not knowingly collect personal information from anyone under 13. If you are a parent or guardian and think your child has submitted information to us, please get in touch straight away and we will remove it.",
  },
  {
    icon: RefreshCw,
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. When we do, the revised version will be posted on this page with an updated date at the top. We recommend checking back occasionally - especially if you use the site regularly. Continued use of the site after any changes means you are comfortable with the updated policy.",
  },
];

const PrivacyPolicy = () => {
  useSEO({
    title: `Privacy Policy | ${SITE_NAME}`,
    description: 'How freefireredeemcodetoday.com collects, uses, and protects your data. Cookies, analytics, your rights, and contact details.',
    path: '/privacy-policy',
  });
  return (
  <div className="min-h-screen bg-background text-foreground font-tech">

    <Header />

    <main className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-t-muted hover:text-foreground mb-10 text-sm uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <span className="inline-block text-xs uppercase tracking-widest text-accent border border-accent/20 bg-accent/5 px-3 py-1 rounded mb-4">
          Legal
        </span>
        <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-3">
          Privacy Policy
        </h1>
        <p className="text-t-muted text-sm leading-relaxed max-w-2xl">
          At Free Fire Redeem Code Today, we believe privacy should be simple to understand - not buried in legal
          jargon. This page explains exactly what data we collect, why we collect it, and how it is used.
        </p>
        <p className="text-t-muted/60 text-xs mt-3">Last Updated: January 2025</p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="border border-border rounded-xl p-6 md:p-8 hover:border-accent/30 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <h2 className="font-display text-base md:text-lg uppercase tracking-tight text-foreground leading-tight mt-1.5">
                  {s.title}
                </h2>
              </div>

              {/* Body */}
              {s.body && <p className="text-t-muted text-sm leading-relaxed mb-4">{s.body}</p>}

              {/* Simple bullet list */}
              {s.bullets && (
                <ul className="space-y-2 mb-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-t-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {/* Subsections (Information We Collect / Cookies) */}
              {s.subsections && (
                <div className="space-y-5">
                  {s.subsections.map((sub) => (
                    <div key={sub.label}>
                      <p className="text-xs uppercase tracking-widest text-accent/70 mb-2.5">{sub.label}</p>

                      {/* Bullet-style subsection */}
                      {sub.bullets && (
                        <ul className="space-y-2">
                          {sub.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2.5 text-sm text-t-muted">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Key-value cookie items */}
                      {sub.items && (
                        <div className="space-y-2">
                          {sub.items.map((item) => (
                            <div key={item.name} className="bg-card border border-border rounded-lg px-4 py-3">
                              <p className="text-sm font-medium text-foreground mb-0.5">{item.name}</p>
                              <p className="text-xs text-t-muted leading-relaxed">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Third-party service cards */}
              {s.items && (
                <div className="space-y-3 mt-1">
                  {s.items.map((item) => (
                    <div key={item.name} className="bg-card border border-border rounded-lg px-4 py-3">
                      <p className="text-sm font-medium text-foreground mb-1">{item.name}</p>
                      <p className="text-xs text-t-muted leading-relaxed">{item.desc}</p>
                      {item.link && (
                        <a
                          href={item.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-xs text-accent hover:underline"
                        >
                          {item.link.label} →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Footer note */}
              {s.footer && (
                <p className="text-t-muted/70 text-xs leading-relaxed mt-4 pt-4 border-t border-border">{s.footer}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact card */}
      <div className="mt-8 border border-accent/20 bg-accent/5 rounded-xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="font-display text-base md:text-lg uppercase tracking-tight text-foreground mb-1">
              Contact Us
            </h2>
            <p className="text-t-muted text-sm mb-4">
              Got a question about this policy or want to know more about how we handle your data? We are happy to help.
            </p>
            <div className="space-y-1.5 text-sm">
              <p className="text-t-muted">
                Email:{" "}
                <a href="mailto:contact@todayesports.com" className="text-accent hover:underline">
                  contact@todayesports.com
                </a>
              </p>
              <p className="text-t-muted">
                Website:{" "}
                <a href="https://freefireredeemcodetoday.com" className="text-accent hover:underline">
                  freefireredeemcodetoday.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
  );
};

export default PrivacyPolicy;

