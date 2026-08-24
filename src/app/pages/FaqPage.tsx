import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle,
  ArrowLeft,
  Search,
  ChevronDown,
  Sparkles,
  Upload,
  ShieldCheck,
  Award,
  Users,
  Compass,
  Mail,
  ArrowRight,
} from "lucide-react";

interface FaqItem {
  id: string;
  category: "general" | "publishing" | "verification" | "hiring" | "licensing";
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "what-is-portfolios",
    category: "general",
    question: "What is Portfolios and how is it different from other platforms?",
    answer: "Portfolios is a calm, curated showcase built specifically for digital product designers, 3D artists, and creative technologists. Unlike noisy, ad-heavy social feeds, Portfolios emphasizes deep, comprehensive case studies, lossless visual rendering, zero algorithmic clutter, and genuine peer appreciations.",
  },
  {
    id: "is-portfolios-free",
    category: "general",
    question: "Is it completely free to create an account and publish work?",
    answer: "Yes! Creating your creator profile, publishing unlimited project case studies, and receiving appreciations is 100% free forever for all creators worldwide.",
  },
  {
    id: "how-to-publish",
    category: "publishing",
    question: "How do I upload and publish my first case study?",
    answer: "Once signed in, click the 'Upload Project' button in the top navigation or creator dashboard. You can upload high-resolution cover artwork, gallery slides, add project metadata (tools used, year, discipline), write a detailed case study narrative, and publish instantly.",
  },
  {
    id: "image-specs",
    category: "publishing",
    question: "What image resolutions and formats are recommended?",
    answer: "We support PNG, JPG, WebP, SVG, and high-framerate GIFs. For optimal crispness on retina and 4K displays, we recommend images with a minimum width of 1920px or 2560px with a 16:9, 4:3, or 16:10 aspect ratio.",
  },
  {
    id: "email-verification",
    category: "verification",
    question: "Why do I need to verify my email before publishing?",
    answer: "Email verification ensures platform security, protects community integrity, and prevents automated spam bots from cluttering the curated discovery showcase. Once verified, all publishing permissions unlock permanently.",
  },
  {
    id: "instant-refresh",
    category: "verification",
    question: "I verified my email in another tab, how do I refresh my session?",
    answer: "Simply click the 'I've verified my email – Refresh Status' button in the top verification banner or modal dialog. Our system instantly validates your token with Supabase and unlocks your studio immediately.",
  },
  {
    id: "hiring-creators",
    category: "hiring",
    question: "How can agencies and studios hire or contact creators on the platform?",
    answer: "Every creator with an active profile features a direct 'Contact' button on their public portfolio page (`/@username`) and within project case studies, allowing recruiters to reach out directly with zero intermediary commission fees.",
  },
  {
    id: "available-for-work",
    category: "hiring",
    question: "How do I show that I am available for freelance or full-time roles?",
    answer: "Go to your Account Settings and toggle the 'Available for Work' badge. A glowing emerald badge will appear on your public profile header and on all your project cards across the explore feed.",
  },
  {
    id: "copyright-ownership",
    category: "licensing",
    question: "Do I retain full copyright and ownership of all uploaded artwork?",
    answer: "Absolutely 100%. You retain full, exclusive intellectual property rights and copyright to all images, case studies, branding assets, and narratives you publish on Portfolios. We never claim ownership of your work.",
  },
  {
    id: "delete-project",
    category: "publishing",
    question: "Can I edit or delete my projects after publishing?",
    answer: "Yes, you can edit project titles, descriptions, tools, and gallery images anytime from your Creator Studio, or delete any project permanently whenever you wish.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "general", label: "General" },
  { id: "publishing", label: "Publishing & Media" },
  { id: "verification", label: "Account & Auth" },
  { id: "hiring", label: "Hiring & Inquiries" },
  { id: "licensing", label: "Copyright & IP" },
];

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "what-is-portfolios": true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-8 pb-24 max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 space-y-16"
    >
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Showcase</span>
        </Link>

        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full btn-primary text-xs font-bold"
        >
          <Mail size={13} />
          <span>Contact Support</span>
        </Link>
      </div>

      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-[#171915] text-[#CDF22B] text-xs font-mono font-bold border border-slate-800 dark:border-white/10 shadow-2xs">
          <HelpCircle size={13} />
          <span>Frequently Asked Questions</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
          How Can We Help You?
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Everything you need to know about publishing case studies, verification, hiring creators, and our platform standards.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics (e.g. upload images, email verify, hire)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl glass-card border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Filter Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-[#CDF22B] text-slate-900 font-bold shadow-sm shadow-[#CDF22B]/20"
                : "glass-card text-muted-foreground hover:text-foreground border border-slate-200/70 dark:border-white/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion FAQ List */}
      <section className="max-w-3xl mx-auto space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div
                key={faq.id}
                className="glass-card rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-foreground cursor-pointer select-none"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 dark:bg-[#1e231b] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#CDF22B] text-slate-950" : "text-muted-foreground"
                    }`}
                  >
                    <ChevronDown size={15} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-slate-100 dark:border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 glass-card rounded-3xl p-8 border border-slate-200 dark:border-white/10 space-y-2">
            <p className="text-sm font-bold text-foreground">No questions found</p>
            <p className="text-xs text-muted-foreground">
              Try searching with different keywords or browse all categories.
            </p>
          </div>
        )}
      </section>

      {/* Still Have Questions Banner */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-white/10 text-center max-w-2xl mx-auto space-y-4">
        <h3 className="text-lg sm:text-xl font-bold font-display text-foreground">
          Still Have a Question?
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Can't find what you are looking for? Send a direct message to our support team and we will be thrilled to help you.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer"
        >
          <Mail size={14} />
          <span>Contact Our Support Team</span>
        </Link>
      </section>
    </motion.main>
  );
}
