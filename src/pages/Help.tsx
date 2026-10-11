import { Header } from '@/components/ff/Header';
import { Footer } from '@/components/ff/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Globe2, HelpCircle, Mail } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const HELP_TOPICS = [
  {
    icon: KeyRound,
    title: 'Redeem code not working',
    body: "Codes expire fast and are region-locked. Check the status badge next to each code, then follow the ",
    linkTo: '/how-to-guide',
    linkLabel: 'step-by-step redeem guide',
    after: '.',
  },
  {
    icon: Globe2,
    title: 'Wrong server / region',
    body: 'A code for India may not work on Brazil, Indonesia, or Europe servers. Switch the region tab on the ',
    linkTo: '/',
    linkLabel: 'homepage',
    after: ' to see codes for your server.',
  },
  {
    icon: HelpCircle,
    title: 'General questions',
    body: 'Most redemption, region, and troubleshooting questions are already answered in our ',
    linkTo: '/faq',
    linkLabel: '50+ question FAQ',
    after: '.',
  },
  {
    icon: Mail,
    title: 'Still stuck?',
    body: 'Reach the team directly on the ',
    linkTo: '/contact',
    linkLabel: 'contact page',
    after: ' and we\'ll get back to you.',
  },
];

const Help = () => {
  useSEO({
    title: 'Help Center - Free Fire Redeem Code Support',
    description: 'Quick answers for Free Fire redeem code issues: expired codes, wrong region, and where to get more help. Links to our full FAQ and redeem guide.',
    path: '/help',
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-tech">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-t-muted hover:text-foreground mb-8 text-sm uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-4">Help Center</h1>
        <p className="text-t-muted leading-relaxed mb-10">
          Quick fixes for the most common Free Fire redeem code problems. Pick a topic below, or head straight to the FAQ for the full list.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          {HELP_TOPICS.map(({ icon: Icon, title, body, linkTo, linkLabel, after }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-5 h-5 text-success" aria-hidden="true" />
                <h2 className="font-display uppercase tracking-tight text-foreground text-base">{title}</h2>
              </div>
              <p className="text-sm text-t-body leading-relaxed">
                {body}
                <Link to={linkTo} className="text-success font-bold underline hover:no-underline">{linkLabel}</Link>
                {after}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
