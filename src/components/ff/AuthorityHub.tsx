import React from "react";
import { LEAD_AUTHOR, TRUST_METRICS, COMMUNITY_TESTIMONIALS } from "@/constants";
import { ShieldCheck, UserCheck, Award, Terminal, Twitter, MessageCircle, CheckCircle2 } from "lucide-react";

export const AuthorityHub: React.FC = () => {
  return (
    <section className="py-6 bg-muted border-y border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-foreground uppercase italic tracking-tight">
            Verified by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-success">Experts</span>
          </h2>
          <p className="text-t-muted mt-6 max-w-2xl mx-auto leading-relaxed">
            We don't just scrape. Our team of former esports organizers and Garena moderators manually verify every code
            on specific server nodes to ensure 100% functionality.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-12">
            <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-success/10 transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <img
                      src={LEAD_AUTHOR.image}
                      alt={LEAD_AUTHOR.name}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-border shadow-2xl"
                    />

                    <div className="absolute -bottom-2 -right-2 bg-success text-primary-foreground p-1.5 rounded-lg border border-background">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface rounded-full text-[9px] font-tech uppercase font-bold tracking-widest text-t-muted mb-2">
                      <Terminal size={10} /> Editor-in-Chief
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-display text-foreground uppercase italic tracking-tight mb-2">
                  {LEAD_AUTHOR.name}
                </h3>
                <p className="text-success font-tech text-sm uppercase tracking-widest font-bold mb-4">
                  {LEAD_AUTHOR.role}
                </p>
                <p className="text-t-body text-sm leading-relaxed mb-6">{LEAD_AUTHOR.bio}</p>
                <div className="space-y-3">
                  {LEAD_AUTHOR.badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm text-foreground bg-surface p-3 rounded-lg border border-border"
                    >
                      <Award size={16} className="text-secondary" />
                      {badge}
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] text-t-muted font-tech uppercase tracking-widest">
                    Experience: {LEAD_AUTHOR.experience}
                  </span>
                  <a href="#" className="text-t-muted hover:text-foreground transition-colors">
                    <Twitter size={18} />
                  </a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {TRUST_METRICS.slice(0, 2).map((metric, idx) => (
                <div key={idx} className="bg-card border border-border p-5 rounded-2xl text-center">
                  <h4 className="font-display text-2xl text-foreground mb-1">{metric.value}</h4>
                  <p className="text-[9px] text-t-muted font-tech uppercase tracking-widest">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="text-xl font-display text-foreground uppercase italic tracking-tight mb-8 flex items-center gap-3">
                <UserCheck className="text-success" /> Codes Verification Process
              </h3>
              <div className="relative">
                <div className="absolute top-8 left-0 w-full h-0.5 bg-border hidden md:block"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  {[
                    {
                      num: 1,
                      title: "Discovery",
                      desc: "Our AI and Team monitor 150+ official Garena social channels.",
                    },
                    { num: 2, title: "Latency Test", desc: "Team test code validity on 5 regional server nodes." },
                    { num: 3, title: "Publication", desc: "Codes are published live with a probability score." },
                  ].map((step) => (
                    <div
                      key={step.num}
                      className="bg-background border border-border p-6 rounded-2xl relative group hover:border-success/30 transition-all"
                    >
                      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-6 mx-auto border-4 border-card group-hover:bg-success-bg group-hover:text-success transition-colors text-t-muted">
                        {step.num}
                      </div>
                      <h4 className="text-foreground font-bold text-center mb-2">{step.title}</h4>
                      <p className="text-xs text-center text-t-muted">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-tech font-bold text-t-body uppercase tracking-widest">
                  Community Validated
                </h3>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-surface border border-background flex items-center justify-center text-[8px] text-foreground"
                    >
                      {i}
                    </div>
                  ))}
                  <div className="w-6 h-6 rounded-full bg-success text-primary-foreground flex items-center justify-center text-[8px] font-bold border border-background">
                    +9k
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMMUNITY_TESTIMONIALS.map((t, idx) => (
                  <div
                    key={idx}
                    className="bg-surface border border-border p-4 rounded-xl flex flex-col justify-between hover:bg-surface-hover transition-colors"
                  >
                    <p className="text-sm text-t-body italic mb-4">"{t.comment}"</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-tr from-purple-500 to-blue-500"></div>
                        <div>
                          <div className="text-xs font-bold text-foreground">{t.user}</div>
                          <div className="text-[8px] text-success uppercase tracking-wider">{t.rank}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-t-muted uppercase font-bold">
                        {t.platform === "Discord" ? <MessageCircle size={10} /> : <Twitter size={10} />} {t.platform}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
