import { Header } from "@/components/ff/Header";
import { Footer } from "@/components/ff/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Send, MessageCircle } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-tech">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-t-muted hover:text-foreground mb-8 text-sm uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-t-muted leading-relaxed">
            Have questions about Free Fire redeem codes or need support? We're here to help!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
              <MessageCircle className="text-green-500" size={24} />
              Send us a Message
            </h2>

            {isSubmitted && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <p className="text-green-400">Thank you! Your message has been sent successfully.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-t-muted mb-1 uppercase tracking-widest">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-t-muted mb-1 uppercase tracking-widest"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-t-muted mb-1 uppercase tracking-widest"
                >
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="" className="bg-background">
                    Select a subject
                  </option>
                  <option value="code-not-working" className="bg-background">
                    Redeem Code Not Working
                  </option>
                  <option value="technical-issue" className="bg-background">
                    Technical Issue
                  </option>
                  <option value="suggestion" className="bg-background">
                    Suggestion
                  </option>
                  <option value="partnership" className="bg-background">
                    Partnership Inquiry
                  </option>
                  <option value="other" className="bg-background">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-t-muted mb-1 uppercase tracking-widest"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Please describe your inquiry in detail..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Mail className="text-green-500" size={24} />
                Direct Contact
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground">Email Support</h3>
                  <p className="text-t-muted">contact@todayesports.com</p>
                  <p className="text-sm text-t-muted/70">We typically respond within 24 hours</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Response Time</h3>
                  <p className="text-t-muted">24–48 hours for general inquiries</p>
                  <p className="text-t-muted">2–4 hours for urgent technical issues</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-foreground">Code not working?</h3>
                  <p className="text-sm text-t-muted">
                    Check our FAQ section or try different codes from our updated list.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Want to report a bug?</h3>
                  <p className="text-sm text-t-muted">
                    Please include your device info and steps to reproduce the issue.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Partnership inquiries?</h3>
                  <p className="text-sm text-t-muted">
                    We welcome collaborations with gaming content creators and brands.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
