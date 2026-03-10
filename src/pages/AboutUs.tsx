```tsx
import { Header } from "@/components/ff/Header";
import { Footer } from "@/components/ff/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AboutUs = () => (
  <div className="min-h-screen bg-background text-foreground font-tech">
    <Header />

    <main className="max-w-6xl mx-auto px-4 md:px-8 py-16">

      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-t-muted hover:text-foreground mb-10 text-sm uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* HERO */}
      <section className="text-center mb-24">
        <span className="text-xs uppercase tracking-widest text-orange-400">
          Trusted by Free Fire Players
        </span>

        <h1 className="text-4xl md:text-5xl font-display mt-4 mb-6">
          About <span className="text-orange-400">Free Fire Redeem Code Today</span>
        </h1>

        <p className="max-w-2xl mx-auto text-t-muted leading-relaxed">
          We are passionate gamers dedicated to bringing you the most up-to-date,
          verified Free Fire redeem codes — completely free, every single day.
          No scams. No fake codes. Just real rewards.
        </p>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center mb-24">
        <div>
          <p className="text-3xl font-display text-orange-400">12+</p>
          <p className="text-sm text-t-muted">Active Codes Daily</p>
        </div>
        <div>
          <p className="text-3xl font-display text-orange-400">500K+</p>
          <p className="text-sm text-t-muted">Monthly Visitors</p>
        </div>
        <div>
          <p className="text-3xl font-display text-orange-400">24/7</p>
          <p className="text-sm text-t-muted">Code Updates</p>
        </div>
        <div>
          <p className="text-3xl font-display text-orange-400">100%</p>
          <p className="text-sm text-t-muted">Free Service</p>
        </div>
        <div>
          <p className="text-3xl font-display text-orange-400">3+</p>
          <p className="text-sm text-t-muted">Years of Service</p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="grid md:grid-cols-2 gap-12 mb-24">

        <div className="bg-card border border-border rounded-xl p-8">
          <h3 className="text-xl font-display mb-4">
            Born From a Gamer's Frustration
          </h3>

          <p className="text-t-muted leading-relaxed">
            Searching for working Free Fire redeem codes across unreliable
            websites can be frustrating. Many sites publish expired or fake
            codes that waste players’ time.
          </p>

          <p className="text-t-muted mt-4 leading-relaxed">
            That's why <strong>Free Fire Redeem Code Today</strong> was built —
            a platform where every code is verified before publishing so
            players can easily claim real rewards.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display mb-6">
            Your <span className="text-orange-400">#1 Trusted Source</span>
          </h2>

          <p className="text-t-muted mb-4 leading-relaxed">
            Founded by dedicated Free Fire players, our platform tracks
            redeem codes from official Garena announcements, gaming events,
            livestreams, and tournaments.
          </p>

          <p className="text-t-muted leading-relaxed">
            Every code is tested before publishing and removed when expired
            so players always see the latest working codes.
          </p>
        </div>

      </section>

      {/* MISSION */}
      <section className="mb-24">
        <h2 className="text-3xl font-display text-center mb-12">
          Why We Do <span className="text-orange-400">What We Do</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="border border-border rounded-xl p-6">
            <h3 className="font-display mb-3">Accuracy First</h3>
            <p className="text-t-muted text-sm">
              Every code is verified before publishing so players receive
              real rewards.
            </p>
          </div>

          <div className="border border-border rounded-xl p-6">
            <h3 className="font-display mb-3">Speed & Freshness</h3>
            <p className="text-t-muted text-sm">
              We monitor official sources and publish codes quickly.
            </p>
          </div>

          <div className="border border-border rounded-xl p-6">
            <h3 className="font-display mb-3">Completely Free</h3>
            <p className="text-t-muted text-sm">
              Our service will always remain free for all players.
            </p>
          </div>

        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="mb-24">
        <h2 className="text-3xl font-display text-center mb-12">
          How We Find & Verify Codes
        </h2>

        <div className="space-y-8">

          <div>
            <h3 className="font-display mb-2">1. Monitor Official Channels</h3>
            <p className="text-t-muted text-sm">
              We constantly track Garena announcements, streams, and events.
            </p>
          </div>

          <div>
            <h3 className="font-display mb-2">2. Manual Code Testing</h3>
            <p className="text-t-muted text-sm">
              Every code is tested before publishing on our platform.
            </p>
          </div>

          <div>
            <h3 className="font-display mb-2">3. Publish Rewards Details</h3>
            <p className="text-t-muted text-sm">
              We explain rewards like skins, diamonds, and bundles.
            </p>
          </div>

          <div>
            <h3 className="font-display mb-2">4. Continuous Re-Verification</h3>
            <p className="text-t-muted text-sm">
              Expired codes are removed quickly to keep lists clean.
            </p>
          </div>

        </div>
      </section>

      {/* VALUES */}
      <section className="mb-24">
        <h2 className="text-3xl font-display text-center mb-10">
          Our Core Values
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-center">

          <div className="border border-border rounded-xl p-6">
            <h3 className="font-display mb-2">Trust</h3>
            <p className="text-t-muted text-sm">
              We only publish reliable codes.
            </p>
          </div>

          <div className="border border-border rounded-xl p-6">
            <h3 className="font-display mb-2">Speed</h3>
            <p className="text-t-muted text-sm">
              Codes are updated immediately when available.
            </p>
          </div>

          <div className="border border-border rounded-xl p-6">
            <h3 className="font-display mb-2">Community</h3>
            <p className="text-t-muted text-sm">
              Built by gamers for gamers worldwide.
            </p>
          </div>

        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="border border-orange-500/30 bg-orange-500/10 rounded-xl p-6 mb-24">
        <h3 className="font-display mb-3 text-orange-400">Important Disclaimer</h3>
        <p className="text-sm text-t-muted leading-relaxed">
          Free Fire Redeem Code Today is an independent fan-run website and is
          not affiliated with or endorsed by Garena or Sea Limited. All
          trademarks belong to their respective owners. Codes shared on this
          website come from publicly available announcements.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center py-16 border-t border-border">

        <h2 className="text-3xl font-display mb-4">
          Ready to Claim <span className="text-orange-400">Free Rewards?</span>
        </h2>

        <p className="text-t-muted max-w-xl mx-auto mb-8">
          Hundreds of players redeem free diamonds, skins, and bundles every day.
        </p>

        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-6 py-3 rounded-lg transition"
        >
          View Today's Codes
        </Link>

      </section>

    </main>

    <Footer />
  </div>
);

export default AboutUs;
```;
