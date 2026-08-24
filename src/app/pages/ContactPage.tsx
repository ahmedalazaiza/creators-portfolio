import React, { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowLeft,
  Mail,
  MessageSquare,
  Building,
  Send,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  Clock,
  Globe,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    // Simulate API delivery
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 800);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-8 pb-24 max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 space-y-16"
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Showcase</span>
        </Link>

        <Link
          to="/faq"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-[#1e231b] border border-transparent dark:border-white/10 text-foreground font-semibold text-xs hover:bg-slate-200 transition-all"
        >
          <HelpCircle size={13} />
          <span>View FAQs</span>
        </Link>
      </div>

      {/* Hero Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-[#171915] text-[#CDF22B] text-xs font-mono font-bold border border-slate-800 dark:border-white/10 shadow-2xs">
          <Mail size={13} />
          <span>We'd Love to Hear From You</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
          Contact & Inquiries
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Have a question about publishing, partnerships, enterprise curation, or press? Our team typically responds within 24 hours.
        </p>
      </section>

      {/* Main Grid: Form + Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left 7 Columns: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-md space-y-6">
            <div>
              <h2 className="text-lg font-bold font-display text-foreground">
                Send Us a Message
              </h2>
              <p className="text-xs text-muted-foreground">
                Fill out the form below and we'll route your request to the right department.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">
                    Message Delivered Successfully!
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. One of our specialists will review your message and get back to you shortly.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Inquiry Category Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Inquiry Topic
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "general", label: "General" },
                      { id: "support", label: "Creator Support" },
                      { id: "partnership", label: "Partnerships" },
                      { id: "press", label: "Press & Media" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          category === cat.id
                            ? "bg-slate-900 text-[#CDF22B] dark:bg-[#CDF22B] dark:text-slate-950 border-slate-900 dark:border-[#CDF22B] font-bold shadow-xs"
                            : "bg-slate-50 dark:bg-[#171915] border-slate-200 dark:border-white/10 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maya@example.com"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Subject / Title
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your inquiry..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Message Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can assist you..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full btn-primary text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin text-slate-900" />
                  ) : (
                    <Send size={14} />
                  )}
                  <span>{loading ? "Sending Message..." : "Submit Message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Direct Channels & Hubs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Email Channels */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Direct Contact Lines
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#171915]/80 border border-slate-200/60 dark:border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] flex items-center justify-center shrink-0 font-bold">
                  <Mail size={15} />
                </div>
                <div>
                  <p className="font-bold text-foreground">General & Creator Support</p>
                  <a href="mailto:support@portfolios.design" className="text-slate-800 dark:text-[#CDF22B] hover:underline font-mono">
                    support@portfolios.design
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#171915]/80 border border-slate-200/60 dark:border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] flex items-center justify-center shrink-0 font-bold">
                  <Building size={15} />
                </div>
                <div>
                  <p className="font-bold text-foreground">Enterprise & Studio Curation</p>
                  <a href="mailto:partners@portfolios.design" className="text-slate-800 dark:text-[#CDF22B] hover:underline font-mono">
                    partners@portfolios.design
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#171915]/80 border border-slate-200/60 dark:border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] flex items-center justify-center shrink-0 font-bold">
                  <MessageSquare size={15} />
                </div>
                <div>
                  <p className="font-bold text-foreground">Press & Media Enquiries</p>
                  <a href="mailto:press@portfolios.design" className="text-slate-800 dark:text-[#CDF22B] hover:underline font-mono">
                    press@portfolios.design
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Response SLA & Hours */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Clock size={15} className="text-[#CDF22B]" />
              <span>Response Times</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Our core curation and support teams operate across GMT+2 and PST time zones. We respond to 95% of inquiries within one business day.
            </p>
          </div>

          {/* FAQ Quick Link */}
          <div className="p-6 rounded-3xl bg-[#CDF22B]/10 border border-[#CDF22B]/30 space-y-2 text-xs">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <HelpCircle size={15} className="text-[#CDF22B]" />
              <span>Looking for Quick Answers?</span>
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Check our comprehensive FAQ section covering project uploads, image guidelines, account verification, and hiring.
            </p>
            <Link
              to="/faq"
              className="inline-block pt-1 font-bold text-slate-900 dark:text-[#CDF22B] hover:underline"
            >
              Explore Knowledge Base →
            </Link>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
