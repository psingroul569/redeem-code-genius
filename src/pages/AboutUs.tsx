import { Header } from "@/components/ff/Header";
import { Footer } from "@/components/ff/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Users, Zap, Target, Clock, CheckCircle, Globe, Heart } from "lucide-react";

const AboutUs = () => {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Us – FF Redeem Codes Today",
    "description": "Learn about freefireredeemcodetoday.com — the most trusted Free Fire redeem code platform built by gamers, for gamers.",
    "url": "https://freefireredeemcodetoday.com/about-us",
    "mainEntity": {
      "@type": "Organization",
      "name": "FF Redeem Codes Today",
      "url": "https://freefireredeemcodetoday.com",
      "foundingDate": "2023",
      "description": "Independent Free Fire redeem code verification platform serving millions of Garena Free Fire players worldwide.",
      "sameAs": [
        "https://freefireredeemcodetoday.com",
        "https://x.com/FalconFF_Real"
      ],
      "founder": {
        "@type": "Person",
        "name": "Jaxon Lee",
        "jobTitle": "Lead Rewards Analyst",
        "description": "Free Fire analyst since 2017 with 7+ years of experience tracking Garena's event patterns and reward cycles.",
        "image": "https://i.ibb.co/Kxc3C8Ts/Jaxon-Free-Fire-1.jpg",
        "sameAs": ["https://x.com/FalconFF_Real"]
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://freefireredeemcodetoday.com" },
      { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://freefireredeemcodetoday.com/about-us" }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-tech">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-t-muted hover:text-foreground mb-8 text-sm uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-4">
          About Us
        </h1>
        <p className="text-t-muted text-sm uppercase tracking-[0.2em] mb-10 border-b border-border pb-6">
          The Story Behind freefireredeemcodetoday.com
        </p>

        {/* Who We Are */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight text-foreground">
              Who We Are
            </h2>
          </div>
          <div className="space-y-4 text-t-muted leading-relaxed">
            <p>
              We're a small team of Free Fire players who got tired of the same problem every single day — hunting for working redeem codes across dozens of random websites, only to find out most of them were expired, fake, or copied from somewhere else.
            </p>
            <p>
              That frustration is exactly why <strong className="text-foreground">freefireredeemcodetoday.com</strong> exists. We built this platform in 2023 because we wanted one reliable place where players like us could find verified, working codes without wasting time. No clickbait, no fake promises — just codes that actually work.
            </p>
            <p>
              Our team includes experienced Free Fire players, a content analyst who tracks Garena's official event patterns, and developers who keep the platform running smoothly. We play the game ourselves, so we understand what matters to you.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight text-foreground">
              What We Actually Do
            </h2>
          </div>
          <div className="space-y-4 text-t-muted leading-relaxed">
            <p>
              Every day, Garena releases redeem codes for Free Fire and Free Fire MAX across different server regions — India, Indonesia, Brazil, Europe, and more. These codes give you free rewards like diamonds, weapon skins, character bundles, emotes, and pet food.
            </p>
            <p>
              The catch? Most codes expire within hours, and they're often region-locked. That's where we come in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {[
              {
                icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                title: "Code Verification",
                desc: "We test every code before publishing it. If a code shows up on our site, it means we've checked it on actual game servers. We don't just copy-paste from other websites."
              },
              {
                icon: <Clock className="w-5 h-5 text-amber-500" />,
                title: "Hourly Updates",
                desc: "New codes can drop at any time. Our system checks for fresh codes every hour so you don't miss time-sensitive rewards."
              },
              {
                icon: <Globe className="w-5 h-5 text-blue-500" />,
                title: "Server-Specific Info",
                desc: "Every code on our site has a clear server label — India, Brazil, Indonesia, Europe, or Global. No more guessing whether a code works in your region."
              },
              {
                icon: <Zap className="w-5 h-5 text-primary" />,
                title: "Real-Time Status",
                desc: "We show you whether a code is Working, Limited (running out fast), or Expired. This saves you the frustration of trying codes that are already dead."
              }
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  {item.icon}
                  <h3 className="text-foreground font-bold text-sm uppercase tracking-wider">{item.title}</h3>
                </div>
                <p className="text-t-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why We Do This */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight text-foreground">
              Why We Do This
            </h2>
          </div>
          <div className="space-y-4 text-t-muted leading-relaxed">
            <p>
              Honestly? Because we know how it feels. You see a YouTube thumbnail saying "GET 10,000 FREE DIAMONDS" and it turns out to be complete garbage. Or you find a code on some blog, try it, and it expired two days ago. It's annoying.
            </p>
            <p>
              We wanted to build something different — a platform that respects your time. If a code is expired, we tell you. If it's region-locked, we label it clearly. If it's running out fast, we flag it. That's it. No tricks.
            </p>
            <p>
              Free Fire has over 100 million active players. A huge number of them are students and young gamers who can't spend money on in-game purchases. Redeem codes are one of the few ways to get premium items for free, and we think everyone deserves a fair shot at claiming them before they expire.
            </p>
          </div>
        </section>

        {/* Our Numbers */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight text-foreground">
              Our Track Record
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "42,800+", label: "Codes Verified", sub: "Since 2023" },
              { value: "98.5%", label: "Accuracy Rate", sub: "Community-verified" },
              { value: "99.9%", label: "Platform Uptime", sub: "Always available" },
              { value: "5+", label: "Server Regions", sub: "Global coverage" }
            ].map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="text-2xl md:text-3xl font-display text-foreground mb-1">{stat.value}</div>
                <div className="text-foreground text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                <div className="text-t-muted text-[11px]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Don't Do */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight text-foreground mb-4">
            What We Don't Do
          </h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-t-muted leading-relaxed mb-4">
              Transparency matters to us. Here's what you should know:
            </p>
            <ul className="space-y-3 text-t-muted text-sm">
              {[
                "We are NOT officially affiliated with Garena, Free Fire, or any game publisher. We're an independent community resource.",
                "We will NEVER ask for your Free Fire password, login credentials, or any personal account information.",
                "We don't generate or hack redeem codes. All codes on our site come from official Garena events, social media drops, and partner promotions.",
                "We don't guarantee that every code will work for every player — some codes have limited redemptions, and once they're gone, they're gone."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5 text-xs font-bold">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight text-foreground mb-4">
            Who's Behind This
          </h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <img
                src="https://i.ibb.co/Kxc3C8Ts/Jaxon-Free-Fire-1.jpg?auto=format&fit=crop&q=80&w=96"
                alt="Jaxon Lee - Lead Rewards Analyst at FF Redeem Codes Today"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary/30"
                loading="lazy"
              />
              <div>
                <h3 className="text-foreground font-bold text-lg">Jaxon Lee</h3>
                <p className="text-primary text-xs uppercase tracking-wider font-bold mb-2">Lead Rewards Analyst · Since 2017</p>
                <p className="text-t-muted text-sm leading-relaxed mb-3">
                  Jaxon has been part of the Free Fire community since its beta launch in 2017. With 7+ years of experience tracking Garena's event patterns and reward cycles, he leads our code verification process. He's a former Garena community moderator, a verified Wiki contributor, and has helped thousands of players claim legitimate rewards.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Ex-Garena Moderator", "Wiki Contributor", "Esports Analyst"].map(badge => (
                    <span key={badge} className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-t-muted text-sm mt-5 leading-relaxed">
              Beyond Jaxon, our team includes content writers who play Free Fire daily, regional contributors who monitor server-specific drops across India, Indonesia, Brazil, and Europe, and developers who keep the platform fast and reliable.
            </p>
          </div>
        </section>

        {/* How to Reach Us */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight text-foreground mb-4">
            Got Questions?
          </h2>
          <div className="space-y-4 text-t-muted leading-relaxed">
            <p>
              If something's not working, if you found a code we missed, or if you just want to say hi — we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Contact Us
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:border-primary/30 transition-colors"
              >
                Read Our FAQ
              </Link>
            </div>
          </div>
        </section>

        {/* Final Note */}
        <section className="border-t border-border pt-8">
          <p className="text-t-muted text-sm leading-relaxed italic">
            Thanks for being part of this community. Whether you've been with us since day one or just found us today — we're glad you're here. Every code we verify, every update we push, it's all for players like you. Keep grinding, keep claiming those rewards, and stay safe out there. 🔥
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
