import { Header } from "@/components/ff/Header";
import { Footer } from "@/components/ff/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "No Affiliation with Garena or Free Fire",
    content: `This website — freefireredeemcodetoday.com — is an independent fan site and has no official connection to Garena International, Free Fire, or any of their parent or affiliated companies. We are not a partner, reseller, or authorized representative of Garena in any form. Free Fire™ and the Free Fire logo are registered trademarks of Garena International I Private Limited. All in-game assets, characters, branding, and intellectual property belong to their respective owners. We use game-related terminology solely for informational and fan-community purposes.`,
  },
  {
    title: "About the Redeem Codes We Publish",
    content: `All redeem codes featured on this site are collected from publicly available sources — including Garena's official social media pages, livestream events, developer broadcasts, and community giveaways. We do not create, generate, or have any insider access to these codes. Redeem codes are time-sensitive and region-specific. Each code can only be claimed a limited number of times before it expires or runs out. By the time you find a code on this site, it may already be expired, fully redeemed, or unavailable in your region. If a code shows an error, it typically means it has already hit its usage limit or passed its validity window — this is not a fault of this website.`,
  },
  {
    title: "Accuracy of Information",
    content: `We make every effort to keep information on this site accurate and up to date. However, given the fast-changing nature of in-game events and code drops, we cannot guarantee that all content is fully current at any given moment. Reward descriptions, code validity dates, and regional availability may differ from what is listed here. We recommend verifying through Garena's official channels if you are unsure. We accept no liability for decisions made based on outdated or inaccurate information on this site.`,
  },
  {
    title: "Your Account Safety",
    content: `We will never ask for your Free Fire UID, account password, email address, or any personal credentials. Redeem codes should only be entered on Garena's official rewards page at reward.ff.garena.com. Do not enter your account details on any third-party site, including this one. If you ever receive a message claiming to be from this website and asking for your login details, treat it as a scam and report it immediately.`,
  },
  {
    title: "External Links",
    content: `Some pages on this site contain links to third-party websites, YouTube videos, or social media profiles for reference. Once you leave our site, we have no control over the content or practices of those external platforms. These links are provided as a convenience and do not constitute an endorsement of any external service. Visiting external links is entirely at your own discretion.`,
  },
  {
    title: "Advertising",
    content: `This site may display third-party advertisements to help cover the cost of running the site. Ads are clearly separated from editorial content. The presence of an advertisement does not imply our endorsement of the advertised product or service. We do not receive any payment from Garena for featuring specific codes or content.`,
  },
  {
    title: "Limitation of Liability",
    content: `The content on this website is provided on an "as is" basis for informational purposes only. freefireredeemcodetoday.com, its authors, and contributors shall not be held liable for any direct or indirect damages — including account issues, loss of in-game items, or any consequences arising from reliance on information published here. Your use of this site is entirely at your own risk.`,
  },
  {
    title: "Changes to This Disclaimer",
    content: `We may update this disclaimer from time to time to reflect changes in our practices or for legal and operational reasons. The most current version will always be available on this page. Continued use of the site after any updates means you accept the revised disclaimer.`,
  },
];

const Disclaimer = () => (
  <div className="min-h-screen bg-background text-foreground font-tech">
    <Header />
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-t-muted hover:text-foreground mb-8 text-sm uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-2">Disclaimer</h1>
      <p className="text-t-muted text-sm mb-10">
        Last updated: January 2025 &nbsp;·&nbsp; freefireredeemcodetoday.com is an independent fan site and is not
        affiliated with Garena or Free Fire.
      </p>

      <div className="space-y-8">
        {sections.map((s) => (
          <div key={s.title} className="border-b border-border pb-8 last:border-0">
            <h2 className="font-display text-lg uppercase tracking-tight text-foreground mb-3">{s.title}</h2>
            <p className="text-t-muted leading-relaxed text-sm">{s.content}</p>
          </div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Disclaimer;
