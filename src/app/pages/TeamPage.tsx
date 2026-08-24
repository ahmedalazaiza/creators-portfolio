import React, { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Plus,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  department: string;
  avatar: string;
  bgColor: string;
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

const ALL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "jocelyn-schleifer",
    name: "Jocelyn Schleifer",
    role: "Software Engineer",
    bio: "There are many variations of passages of Lorem Ipsum available",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    bgColor: "bg-[#9ec8e2]",
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "martin-donin",
    name: "Martin Donin",
    role: "Software Engineer",
    bio: "There are many variations of passages of Lorem Ipsum available",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
    bgColor: "bg-[#f0a996]",
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Head of 3D & Visual Experience",
    bio: "There are many variations of passages of Lorem Ipsum available",
    department: "Design & CGI",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    bgColor: "bg-[#e6beae]",
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "sophia-chen",
    name: "Sophia Chen",
    role: "Lead Editorial & Design Curator",
    bio: "There are many variations of passages of Lorem Ipsum available",
    department: "Curation",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
    bgColor: "bg-[#9a91f5]",
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "edward-gilmore",
    name: "Edward Gilmore",
    role: "Founder and CEO",
    bio: "There are many variations of passages of Lorem Ipsum available",
    department: "Leadership",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    bgColor: "bg-[#8ed0bf]",
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "lucy-kims",
    name: "Lucy Kims",
    role: "Member Experience Manager",
    bio: "There are many variations of passages of Lorem Ipsum available",
    department: "Community",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
    bgColor: "bg-[#f4d08e]",
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "tarik-mansour",
    name: "Tarik Mansour",
    role: "Senior Frontend Engineer",
    bio: "There are many variations of passages of Lorem Ipsum available",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
    bgColor: "bg-[#b8d5e5]",
    socials: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      github: "https://github.com",
    },
  },
  {
    id: "maya-patel",
    name: "Maya Patel",
    role: "Product Strategy & Growth",
    bio: "There are many variations of passages of Lorem Ipsum available",
    department: "Product",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
    bgColor: "bg-[#d7bde2]",
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
];

const INITIAL_BATCH_SIZE = 8;
const BATCH_INCREMENT = 4;

export default function TeamPage() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);

  const visibleMembers = ALL_TEAM_MEMBERS.slice(0, visibleCount);
  const hasMore = visibleCount < ALL_TEAM_MEMBERS.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BATCH_INCREMENT);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-8 pb-24 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-12"
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

        <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-[#0F172A] dark:text-white">
          Meet Our Team
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
          The passionate curators, engineers, and designers building the elevated sanctuary for world-class digital craft.
        </p>
      </section>

      {/* ─── Team Grid (Styled with ProjectCard standard tokens & hover effects) ───────────── */}
      <section className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
          {visibleMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="group flex flex-col rounded-[28px] overflow-hidden bg-white dark:bg-[#151813] border border-slate-300 dark:border-white/15 hover:border-slate-400 dark:hover:border-white/30 transition-colors"
            >
              {/* Top: Portrait Image with Pastel Background */}
              <div className={`w-full aspect-4/3 sm:h-72 relative overflow-hidden ${member.bgColor} flex items-end justify-center`}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom: Name, Role, Bio & Left-Aligned Social Icons */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3.5 bg-white dark:bg-[#151813]">
                <div className="space-y-1 text-left">
                  <h3 className="text-sm sm:text-base font-bold font-display text-foreground leading-snug group-hover:text-slate-900 dark:group-hover:text-[#CDF22B] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground">
                    {member.role}
                  </p>
                  <p className="text-xs text-muted-foreground pt-1 leading-relaxed line-clamp-2">
                    {member.bio}
                  </p>
                </div>

                {/* Social Circle Icons (Left Aligned) */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-200/90 dark:border-white/10">
                  {member.socials.facebook && (
                    <a
                      href={member.socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on Facebook`}
                      className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
                    >
                      <Facebook size={13} />
                    </a>
                  )}

                  {member.socials.instagram && (
                    <a
                      href={member.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on Instagram`}
                      className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
                    >
                      <Instagram size={13} />
                    </a>
                  )}

                  {member.socials.twitter && (
                    <a
                      href={member.socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on Twitter / X`}
                      className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
                    >
                      <Twitter size={13} />
                    </a>
                  )}

                  {member.socials.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
                    >
                      <Linkedin size={13} />
                    </a>
                  )}

                  {member.socials.github && (
                    <a
                      href={member.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on GitHub`}
                      className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
                    >
                      <Github size={13} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center pt-4">
            <button
              onClick={handleLoadMore}
              className="px-7 py-3 rounded-full btn-secondary text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs inline-flex items-center gap-2"
            >
              <span>Load More Team Members</span>
              <Plus size={14} />
            </button>
            <p className="text-[11px] text-muted-foreground mt-2 font-mono">
              Showing {visibleMembers.length} of {ALL_TEAM_MEMBERS.length} team members
            </p>
          </div>
        )}
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

