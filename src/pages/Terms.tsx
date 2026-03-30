import { Header } from "@/components/ff/Header";
import { Footer } from "@/components/ff/Footer";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  UserCheck,
  Ban,
  Ticket,
  Globe,
  ShieldCheck,
  Scale,
  BookOpen,
  RefreshCw,
  Mail,
} from "lucide-react";

const sections = [
  {
    icon: CheckCircle,
    title: "Acceptance of Terms",
    body: "Welcome to 'Free Fire Redeem Code Today'.By visiting or using this website, you agree to the terms and conditions set forth on this page. These Terms & Conditions apply to everyone who accesses the site whether you are here to obtain codes, browse content, or are simply passing through.",
    note: {
      label: "Please note",
      text: "If you do not agree with any part of these terms, please do not use this website. Continued use signifies your acceptance of everything stated herein.",
    },
  },
  {
    icon: UserCheck,
    title: "Who Can Use This Site",
    subsections: [
      {
        label: "Age Requirements",
        bullets: [
          "You must be at least 13 years old to use this website",
          "Users under 18 need a parent or guardian's permission",
          "Parents are responsible for how their children use this site",
          "We reserve the right to verify age if needed",
        ],
      },
      {
        label: "Your Responsibilities",
        bullets: [
          "Keep your access secure and do not share it with others",
          "Make sure any information you provide is accurate",
          "You are responsible for everything done under your access",
          "Let us know immediately if you notice any unauthorised use",
        ],
      },
    ],
  },
  {
    icon: Ban,
    title: "Things You Must Not Do",
    body: "To keep this site fair and safe for everyone, the following activities are strictly off-limits:",
    subsections: [
      {
        label: "General Prohibited Conduct",
        bullets: [
          "Using the site for anything unlawful or illegal",
          "Attempting to hack, disrupt, or damage our website or servers",
          "Creating fake accounts or pretending to be someone else",
          "Spamming, phishing, or distributing malware of any kind",
          "Violating any laws or regulations that apply to you",
          "Infringing on intellectual property rights",
          "Harassing, threatening, or abusing other users",
          "Scraping or automatically collecting data from the site",
        ],
      },
      {
        label: "Code Usage Rules",
        bullets: [
          "Codes are for personal use only — not for commercial resale",
          "Do not try to exploit or manipulate the code system",
          "Respect redemption limits and fair usage policies",
          "Do not share codes in ways that break platform terms",
          "Always use codes in line with the game's own terms of service",
        ],
      },
    ],
  },
  {
    icon: Ticket,
    title: "Code Availability & Fair Use",
    body: "Codes are shared on a first-come, first-served basis. We ask everyone to claim codes responsibly so the community benefits fairly.",
    bullets: [
      "Excessive claiming or hoarding of codes is discouraged",
      "We may limit access to users who abuse the system",
      "Automated code-claiming tools are strictly prohibited",
    ],
    note: {
      label: "Important",
      text: "We do not guarantee that any code will be valid, available, or work in your region. Codes may expire or reach their redemption limit at any time. You claim codes entirely at your own risk.",
    },
  },
  {
    icon: Globe,
    title: "Acceptable Use of the Website",
    subsections: [
      {
        label: "How to Use the Site",
        bullets: [
          "Use the website only for its intended purpose",
          "Be mindful of bandwidth and server resources",
          "Do not try to reverse-engineer or copy our systems",
          "Follow any guidelines or instructions posted on the site",
          "Report bugs and issues to us responsibly",
        ],
      },
      {
        label: "Content You Submit",
        bullets: [
          "Any content you submit must be original or properly licensed",
          "By submitting content, you give us permission to use it for site purposes",
          "We reserve the right to remove content that violates these terms",
          "You are responsible for the accuracy of what you share",
        ],
      },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Enforcement & Banning Policy",
    body: "We take violations seriously. If you break these terms, here is what may happen:",
    items: [
      { name: "Warning", desc: "A notice about the violation with a chance to correct it." },
      { name: "Temporary Restriction", desc: "Access to certain features may be limited for a period." },
      {
        name: "Permanent Ban",
        desc: "Repeated or serious violations can result in a permanent removal from the site.",
      },
      { name: "Legal Action", desc: "In severe cases, we may involve relevant authorities or pursue legal remedies." },
    ],
    footer:
      "If you believe a ban was applied unfairly, you can appeal by contacting us within 30 days. We review all appeals honestly and our final decision stands.",
  },
  {
    icon: BookOpen,
    title: "Intellectual Property",
    body: "All original content on this website — including text, design, layout, and features — belongs to Free Fire Redeem Code Today and is protected under applicable copyright and intellectual property laws.",
    bullets: [
      "Free Fire™ is a trademark of Garena International",
      "Google Play™ is a trademark of Google LLC",
      "All game logos and names belong to their respective owners",
      "We reference trademarks for informational purposes only and make no ownership claims",
    ],
  },
  {
    icon: Scale,
    title: "Disclaimers & Liability",
    subsections: [
      {
        label: "Service Availability",
        bullets: [
          "We do not guarantee that the site will always be online or error-free",
          "The site may occasionally go offline for maintenance",
          "We reserve the right to modify or shut down services at any time",
          "No warranty is offered for website functionality",
        ],
      },
    ],
    note: {
      label: "Limitation of Liability",
      text: "We are not liable for any damages direct, indirect, incidental, or consequential that arise from your use of this website. You use the site entirely at your own risk.",
    },
  },
  {
    icon: RefreshCw,
    title: "Changes to These Terms",
    body: "We may update these Terms from time to time. For significant changes, we will aim to give at least 30 days notice before they take effect. Smaller tweaks may go live without prior notice.",
    footer:
      "The latest version will always be on this page. If you keep using the site after an update, that means you accept the revised terms.",
  },
];

const Terms = () => (
  <div className="min-h-screen bg-background text-foreground font-tech">
    <Header />
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-t-muted hover:text-foreground mb-8 text-sm uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Page heading */}
      <div className="mb-12">
        <span className="inline-block text-xs uppercase tracking-widest text-accent border border-accent/20 bg-accent/5 px-3 py-1 rounded mb-4">
          Legal
        </span>
        <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-3">
          Terms & Conditions
        </h1>
        <p className="text-t-muted text-sm leading-relaxed max-w-2xl">
          These terms cover how you can use freefireredeemcodetoday.com. We have written them as plainly as possible so
          there are no surprises. Please read through before using the site.
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
              {/* Section header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <h2 className="font-display text-base md:text-lg uppercase tracking-tight text-foreground leading-tight mt-1.5">
                  {s.title}
                </h2>
              </div>

              {s.body && <p className="text-t-muted text-sm leading-relaxed mb-4">{s.body}</p>}

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

              {s.subsections && (
                <div className="space-y-5">
                  {s.subsections.map((sub) => (
                    <div key={sub.label}>
                      <p className="text-xs uppercase tracking-widest text-accent/70 mb-2.5">{sub.label}</p>
                      <ul className="space-y-2">
                        {sub.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2.5 text-sm text-t-muted">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {s.items && (
                <div className="space-y-2 mt-1">
                  {s.items.map((item) => (
                    <div key={item.name} className="bg-card border border-border rounded-lg px-4 py-3">
                      <p className="text-sm font-medium text-foreground mb-0.5">{item.name}</p>
                      <p className="text-xs text-t-muted leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {s.footer && (
                <p className="text-t-muted/70 text-xs leading-relaxed mt-4 pt-4 border-t border-border">{s.footer}</p>
              )}

              {s.note && (
                <div className="mt-4 bg-card border border-border rounded-lg px-4 py-3 text-sm text-t-muted">
                  <strong className="text-foreground">{s.note.label}: </strong>
                  {s.note.text}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Governing law */}
      <div className="mt-6 border border-border rounded-xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Scale className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="font-display text-base md:text-lg uppercase tracking-tight text-foreground mb-2">
              Governing Law
            </h2>
            <p className="text-t-muted text-sm leading-relaxed">
              These Terms are governed by the laws of the jurisdiction in which we operate. Any disputes arising from
              your use of this website will be resolved through binding arbitration or in the appropriate courts,
              depending on the nature of the dispute.
            </p>
          </div>
        </div>
      </div>

      {/* Agreement banner */}
      <div className="mt-6 bg-accent/5 border border-accent/20 rounded-xl px-6 py-5 text-sm text-t-muted text-center">
        By using this website, you confirm that you have read, understood, and agreed to these Terms & Conditions.
      </div>

      {/* Contact */}
      <div className="mt-6 border border-accent/20 bg-accent/5 rounded-xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="font-display text-base md:text-lg uppercase tracking-tight text-foreground mb-1">
              Questions About These Terms?
            </h2>
            <p className="text-t-muted text-sm mb-4">
              We are happy to clarify anything. Reach out and we will get back to you within 24–48 hours.
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

export default Terms;
