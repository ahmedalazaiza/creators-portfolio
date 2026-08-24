import React, { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Twitter,
  Dribbble,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Mail,
  Heart,
  Globe,
  Award,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  socials: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    dribbble?: string;
  };
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "edward-gilmore",
    name: "Edward Gilmore",
    role: "Founder and CEO",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "lucy-kims",
    name: "Lucy Kims",
    role: "Member Experience Manager",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      dribbble: "https://dribbble.com",
    },
  },
  {
    id: "dan-wilson",
    name: "Dan Wilson",
    role: "Senior Community Manager",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Head of 3D & Visual Experience",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    socials: {
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
      dribbble: "https://dribbble.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "Principal Infrastructure Architect",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      youtube: "https://youtube.com",
    },
  },
  {
    id: "sophia-chen",
    name: "Sophia Chen",
    role: "Lead Editorial & Design Curator",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
    socials: {
      instagram: "https://instagram.com",
      dribbble: "https://dribbble.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
];

export default function TeamPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // For 3-column slider view
  const maxIndex = Math.max(0, TEAM_MEMBERS.length - 3);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-8 pb-24 max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 space-y-16"
    >
      {/* Top Navigation Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/about"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>About Portfolios</span>
        </Link>

        <div className="flex items-center gap-2.5 text-xs">
          <Link
            to="/contact"
            className="px-4 py-1.5 rounded-full btn-secondary text-xs font-semibold"
          >
            Contact Us
          </Link>
          <Link
            to="/careers"
            className="px-4 py-1.5 rounded-full btn-primary text-xs font-bold"
          >
            We're Hiring
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] text-white dark:bg-[#171915] dark:border dark:border-white/10 text-xs font-mono font-bold shadow-md">
          <Sparkles size={13} className="text-[#CDF22B]" />
          <span>Our Creative Leaders</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-[#0F172A] dark:text-white">
          Meet Our Team
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          The passionate curators, engineers, and designers building the elevated sanctuary for world-class digital craft.
        </p>
      </section>

      {/* ─── Team Members Carousel / Grid Section ───────────────────── */}
      <section className="relative px-2 sm:px-8">
        {/* Navigation Arrows (Left & Right) */}
        <button
          onClick={handlePrev}
          aria-label="Previous Team Members"
          className="hidden sm:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white dark:bg-[#171915] border border-slate-200 dark:border-white/15 shadow-xl items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-[#CDF22B] hover:scale-110 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Team Members"
          className="hidden sm:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white dark:bg-[#171915] border border-slate-200 dark:border-white/15 shadow-xl items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-[#CDF22B] hover:scale-110 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-[#171915] rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-white/20 transition-all text-center flex flex-col justify-between group"
            >
              {/* Top Square Portrait Image */}
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#070905] relative shadow-inner">
                <img
                  src={member.avatar}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Name, Role & Social Links */}
              <div className="pt-5 pb-2 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#0F172A] dark:text-white tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {member.role}
                  </p>
                </div>

                {/* Social Circle Icons */}
                <div className="flex items-center justify-center gap-2.5 pt-2">
                  {member.socials.facebook && (
                    <a
                      href={member.socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on Facebook`}
                      className="w-8 h-8 rounded-full border border-slate-300/80 dark:border-white/15 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-[#CDF22B] hover:border-[#0F172A] dark:hover:border-[#CDF22B] transition-colors"
                    >
                      <span className="font-serif font-bold text-xs">f</span>
                    </a>
                  )}

                  {member.socials.instagram && (
                    <a
                      href={member.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on Instagram`}
                      className="w-8 h-8 rounded-full border border-slate-300/80 dark:border-white/15 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-pink-500 hover:border-pink-500 dark:hover:text-[#CDF22B] dark:hover:border-[#CDF22B] transition-colors"
                    >
                      <Instagram size={14} />
                    </a>
                  )}

                  {member.socials.youtube && (
                    <a
                      href={member.socials.youtube}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on YouTube`}
                      className="w-8 h-8 rounded-full border border-slate-300/80 dark:border-white/15 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:border-rose-500 dark:hover:text-[#CDF22B] dark:hover:border-[#CDF22B] transition-colors"
                    >
                      <Youtube size={14} />
                    </a>
                  )}

                  {member.socials.twitter && (
                    <a
                      href={member.socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on Twitter`}
                      className="w-8 h-8 rounded-full border border-slate-300/80 dark:border-white/15 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-sky-500 hover:border-sky-500 dark:hover:text-[#CDF22B] dark:hover:border-[#CDF22B] transition-colors"
                    >
                      <Twitter size={14} />
                    </a>
                  )}

                  {member.socials.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      className="w-8 h-8 rounded-full border border-slate-300/80 dark:border-white/15 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-sky-600 hover:border-sky-600 dark:hover:text-[#CDF22B] dark:hover:border-[#CDF22B] transition-colors"
                    >
                      <Linkedin size={14} />
                    </a>
                  )}

                  {member.socials.dribbble && (
                    <a
                      href={member.socials.dribbble}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on Dribbble`}
                      className="w-8 h-8 rounded-full border border-slate-300/80 dark:border-white/15 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-pink-500 hover:border-pink-500 dark:hover:text-[#CDF22B] dark:hover:border-[#CDF22B] transition-colors"
                    >
                      <Dribbble size={14} />
                    </a>
                  )}

                  {member.socials.github && (
                    <a
                      href={member.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on GitHub`}
                      className="w-8 h-8 rounded-full border border-slate-300/80 dark:border-white/15 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-[#CDF22B] hover:border-[#0F172A] dark:hover:border-[#CDF22B] transition-colors"
                    >
                      <Github size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join the Team Callout */}
      <section className="bg-[#0F172A] dark:bg-[#171915] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 dark:border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#CDF22B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 text-center md:text-left relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            Want to help build the future of portfolios?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            We are always looking for passionate product designers, distributed systems engineers, and community champions to join our team.
          </p>
        </div>

        <Link
          to="/careers"
          className="px-7 py-3.5 rounded-full btn-primary text-xs sm:text-sm font-bold shadow-xl shrink-0 flex items-center gap-2 cursor-pointer active:scale-95 text-[#0F172A] relative z-10"
        >
          <span>View Open Positions</span>
          <ArrowRight size={15} />
        </Link>
      </section>
    </motion.main>
  );
}
