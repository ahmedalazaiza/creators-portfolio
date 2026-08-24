import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Twitter,
  Dribbble,
  Linkedin,
  Github,
  Mail,
  Heart,
  Globe,
  Award,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  discipline: string;
  bio: string;
  avatar: string;
  location: string;
  socials: {
    twitter?: string;
    dribbble?: string;
    linkedin?: string;
    github?: string;
  };
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "ahmed-alazaiza",
    name: "Ahmed Al-Azaiza",
    role: "Founder & Creative Lead",
    discipline: "Design Systems & Product Craft",
    bio: "Obsessed with micro-interactions, high-contrast aesthetics, and crafting tools that empower independent digital creators worldwide.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    location: "Dubai & Remote",
    socials: {
      twitter: "https://twitter.com",
      dribbble: "https://dribbble.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Head of 3D & Visual Experience",
    discipline: "Spatial CGI & Cinema 4D",
    bio: "Former lead at futuristic spatial labs. Directs visual benchmarking and lossless asset rendering engine for case studies.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    location: "Berlin, Germany",
    socials: {
      twitter: "https://twitter.com",
      dribbble: "https://dribbble.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "Principal Infrastructure Architect",
    discipline: "Distributed Systems & Realtime",
    bio: "Dedicated to zero-latency global replication, sub-second project rendering, and state-of-the-art secure auth protocols.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    location: "San Francisco, CA",
    socials: {
      twitter: "https://twitter.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "sophia-chen",
    name: "Sophia Chen",
    role: "Head of Community & Curation",
    discipline: "Editorial Design & Typography",
    bio: "Curator of the Weekly Masterwork awards and moderator of our global design feedback circle across 180+ regions.",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
    location: "Singapore",
    socials: {
      twitter: "https://twitter.com",
      dribbble: "https://dribbble.com",
    },
  },
  {
    id: "tarik-mansour",
    name: "Tarik Mansour",
    role: "Lead Frontend Engineer",
    discipline: "React, Motion & Canvas",
    bio: "Translates complex UI/UX designs into fluid 120fps browser interactions with zero layout shifts and accessibility first.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    location: "Amsterdam, NL",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "maya-patel",
    name: "Maya Patel",
    role: "Product Strategy & Creator Growth",
    discipline: "Creator Economy & Metrics",
    bio: "Helping studios and emerging designers turn exceptional case studies into direct high-value opportunities and partnerships.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    location: "London, UK",
    socials: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
];

export default function TeamPage() {
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
          to="/about"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          <span>About Portfolios</span>
        </Link>

        <Link
          to="/careers"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full btn-secondary text-xs font-semibold"
        >
          <span>We're Hiring!</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-[#171915] text-[#CDF22B] text-xs font-mono font-bold border border-slate-800 dark:border-white/10 shadow-2xs">
          <Sparkles size={14} />
          <span>The Minds Behind The Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
          Meet Our Team
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          We are a distributed team of designers, engineers, 3D artists, and curators united by a common conviction: creative work deserves a calm, state-of-the-art stage.
        </p>
      </section>

      {/* Team Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.id}
            className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#CDF22B]/60 transition-all p-6 space-y-5 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Avatar + Status Indicator */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-slate-100 dark:bg-[#171915] border-2 border-white dark:border-white/10 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#CDF22B] border-2 border-background" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-[#CDF22B] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-800 dark:text-[#CDF22B] font-medium">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {member.location}
                  </p>
                </div>
              </div>

              {/* Bio & Discipline Tag */}
              <div className="space-y-2.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#1e231b] border border-transparent dark:border-white/10 text-[10px] font-semibold text-foreground">
                  {member.discipline}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>

            {/* Social Links Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-mono">Connect:</span>
              <div className="flex items-center gap-2">
                {member.socials.twitter && (
                  <a
                    href={member.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on Twitter`}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-colors"
                  >
                    <Twitter size={14} />
                  </a>
                )}
                {member.socials.dribbble && (
                  <a
                    href={member.socials.dribbble}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on Dribbble`}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-pink-500 transition-colors"
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
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground transition-colors"
                  >
                    <Github size={14} />
                  </a>
                )}
                {member.socials.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-600 transition-colors"
                  >
                    <Linkedin size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Join the Team Callout */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
            Want to help build the future of portfolios?
          </h2>
          <p className="text-xs text-muted-foreground max-w-xl">
            We are always looking for passionate engineers, brand designers, and community ambassadors to join our remote team.
          </p>
        </div>

        <Link
          to="/careers"
          className="px-6 py-3 rounded-full btn-primary text-xs font-bold shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>View Open Positions</span>
          <ArrowRight size={14} />
        </Link>
      </section>
    </motion.main>
  );
}
