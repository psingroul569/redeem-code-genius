import { Header } from '@/components/ff/Header';
import { Footer } from '@/components/ff/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const FAQ = () => (
  <div className="min-h-screen bg-background text-foreground font-tech">
    <Header />
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-t-muted hover:text-foreground mb-8 text-sm uppercase tracking-widest transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-6">Frequently Asked Questions</h1>
      <p className="text-t-muted leading-relaxed">FAQ content coming soon.</p>
    </main>
    <Footer />
  </div>
);

export default FAQ;
