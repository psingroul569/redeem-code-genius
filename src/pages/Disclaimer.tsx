import { Header } from "@/components/ff/Header";
import { Footer } from "@/components/ff/Footer";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldOff,
  TicketX,
  Link2,
  AlertTriangle,
  UserCheck,
  Copyright,
  Scale,
  RefreshCw,
  Mail,
} from "lucide-react";

const sections = [
  {
    icon: ShieldOff,
    title: "No Official Affiliation",
    highlight: "We are NOT affiliated with Garena, Google, or any official game developers.",
    bullets: [
      "Free Fire Redeem Code Today is an independent platform",
      "We are not endorsed by or connected to Garena International",
      "We are not affiliated with Google Play Store or Google LLC",
      "All trademarks and game names belong to their respective owners",
      "We do not represent any official gaming company or brand",
    ],
    footer:
      "All codes are sourced independently through public channels, community events, social media promotions, and verified third-party partners.",
  },
  {
    icon: TicketX,
    title: "Code Availability & Accuracy",
    subtitle: "No Guarantee of Code Validity",
    bullets: [
      "We cannot guarantee that all codes will work for every user",
      "Codes may expire, reach redemption limits, or be region-specific",
      "Some codes may have already been used by other users",
      "Code availability is subject to change without notice",
      "We are not responsible for non-working or expired codes",
    ],
    note: {
      label: "Important",
      text: "All codes provided are for digital gift items only. No real cash payouts or monetary rewards are offered. This is not a gambling or real money gaming platform.",
    },
  },
  {
    icon: Link2,
    title: "Third-Party Links & Services",
    body: "Our website may contain links to third-party websites, services, or advertisements. We are not responsible for:",
    bullets: [
      "Content, privacy policies, or practices of third-party websites",
      "Accuracy or reliability of information on external sites",
      "Any damages or losses from using third-party services",
      "Advertising content displayed through ad networks",
      "Actions taken by users on external platforms",
    ],
    footer:
      "Users access third-party links at their own risk and should review the terms and privacy policies of those sites.",
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    body: "To the fullest extent permitted by law, Free Fire Redeem Code Today and its operators shall not be liable for:",
    bullets: [
      "Any direct, indirect, incidental, or consequential damages",
      "Loss of data, profits, or business opportunities",
      "Account suspensions or bans from gaming platforms",
      "Technical issues, website downtime, or service interruptions",
      "Misuse of codes or violation of game terms of service",
      "Any disputes between users and gaming platforms",
    ],
    footer: "Users assume full responsibility for their actions when using redeem codes and accessing our website.",
  },
  {
    icon: UserCheck,
    title: "User Responsibility",
    body: "By using our website, you acknowledge and agree that:",
    bullets: [
      "You are responsible for verifying code validity before use",
      "You will comply with all applicable game terms of service",
      "You will not hold us liable for any issues arising from code usage",
      'You understand that codes are provided "as-is" without warranty',
      "You will use the website and codes at your own risk",
      "You are at least 13 years old or have parental consent",
    ],
  },
  {
    icon: Copyright,
    title: "Intellectual Property",
    body: "All content on this website, including text, graphics, logos, and design elements, is the property of Free Fire Redeem Code Today or used with permission. Game names, logos, and trademarks belong to their respective owners.",
    bullets: [
      "Free Fire™ is a trademark of Garena International",
      "Google Play™ is a trademark of Google LLC",
      "All game logos and images are used for informational purposes only",
      "We do not claim ownership of any third-party trademarks",
    ],
  },
  {
    icon: Scale,
    title: "Compliance & Legal",
    body: "This website complies with applicable laws and platform policies:",
    bullets: [
      "Google AdSense Publisher Policies",
      "Google Play Developer Policy",
      "Digital content distribution guidelines",
      "Data protection and privacy regulations",
      "Advertising standards and practices",
    ],
    note: {
      label: "Note",
      text: "This platform is for entertainment and informational purposes only. We promote responsible gaming and do not encourage excessive spending on digital items.",
    },
  },
  {
    icon: RefreshCw,
    title: "Changes to Disclaimer",
    body: "We reserve the right to modify this disclaimer at any time without prior notice. Changes will be effective immediately upon posting on this page. Continued use of our website constitutes acceptance of any modifications.",
  },
];

const Disclaimer = () => (
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
        <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-3">Disclaimer</h1>
        <p className="text-t-muted text-sm leading-relaxed max-w-2xl">
          Please read this carefully before using any codes or content from this site. freefireredeemcodetoday.com is an
          independent fan platform — not affiliated with Garena or any official game developer.
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
                <div>
                  <h2 className="font-display text-base md:text-lg uppercase tracking-tight text-foreground leading-tight">
                    {s.title}
                  </h2>
                  {s.subtitle && <p className="text-t-muted text-xs mt-0.5">{s.subtitle}</p>}
                </div>
              </div>

              {/* Highlight banner */}
              {s.highlight && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-3 mb-4 text-sm text-accent font-medium">
                  {s.highlight}
                </div>
              )}

              {/* Body text */}
              {s.body && <p className="text-t-muted text-sm leading-relaxed mb-3">{s.body}</p>}

              {/* Bullet list */}
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

              {/* Footer text */}
              {s.footer && (
                <p className="text-t-muted/70 text-xs leading-relaxed mt-3 pt-3 border-t border-border">{s.footer}</p>
              )}

              {/* Note box */}
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

      {/* Contact card */}
      <div className="mt-8 border border-accent/20 bg-accent/5 rounded-xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="font-display text-base md:text-lg uppercase tracking-tight text-foreground mb-1">
              Contact Information
            </h2>
            <p className="text-t-muted text-sm mb-3">
              If you have questions about this disclaimer or need clarification on any terms:
            </p>
            <div className="space-y-1 text-sm">
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

export default Disclaimer;
