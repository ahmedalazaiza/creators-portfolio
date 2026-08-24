import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  User,
  Check,
  Globe,
  MapPin,
  Sparkles,
  Twitter,
  Dribbble,
  Linkedin,
  Github,
  Instagram,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [headline, setHeadline] = useState(user?.headline || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [bannerUrl, setBannerUrl] = useState(user?.bannerUrl || "");
  const [location, setLocation] = useState(user?.location || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [availableForWork, setAvailableForWork] = useState(
    user?.availableForWork ?? true
  );
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const [twitter, setTwitter] = useState(user?.socialLinks?.twitter || "");
  const [dribbble, setDribbble] = useState(user?.socialLinks?.dribbble || "");
  const [behance, setBehance] = useState(user?.socialLinks?.behance || "");
  const [linkedin, setLinkedin] = useState(user?.socialLinks?.linkedin || "");
  const [github, setGithub] = useState(user?.socialLinks?.github || "");
  const [instagram, setInstagram] = useState(user?.socialLinks?.instagram || "");

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold font-display text-foreground mb-3">
            Authentication Required
          </h2>
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills((prev) => [...prev, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName,
      headline,
      bio,
      avatarUrl,
      bannerUrl,
      location,
      website,
      availableForWork,
      skills,
      socialLinks: {
        twitter,
        dribbble,
        behance,
        linkedin,
        github,
        instagram,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-16 sm:pt-20 pb-16"
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft size={14} /> Back to Creator Studio
            </Link>
            <h1 className="text-3xl font-display font-extrabold text-foreground">
              Profile & Portfolio Settings
            </h1>
          </div>

          <Link
            to={`/@${user.username}`}
            className="px-4 py-2 rounded-full border border-border bg-card text-foreground text-xs font-semibold hover:bg-muted transition-colors"
          >
            Preview Public Profile
          </Link>
        </div>

        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span>Profile successfully updated! Changes are live.</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Identity & Visuals */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6">
            <h3 className="text-base font-bold font-display text-foreground border-b border-border pb-3">
              1. Visual Branding & Identity
            </h3>

            {/* Avatar & Banner URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                />
                {avatarUrl && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={avatarUrl}
                      alt="Avatar preview"
                      className="w-12 h-12 rounded-full object-cover border border-border"
                    />
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Avatar Preview
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                  Cover Banner URL
                </label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                />
              </div>
            </div>

            {/* Full Name & Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                  Display Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs font-semibold focus:outline-none focus:border-primary/60"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                  Professional Headline / Title
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Lead Product Designer & 3D Artist"
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                />
              </div>
            </div>

            {/* Biography */}
            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                About & Bio
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your creative background, career journey, and artistic philosophy..."
                className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
              />
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-muted/20">
              <div>
                <div className="text-xs font-bold text-foreground">
                  Available for Work & Commissions
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Show a prominent green status badge on your profile and project cards.
                </div>
              </div>
              <input
                type="checkbox"
                checked={availableForWork}
                onChange={(e) => setAvailableForWork(e.target.checked)}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Location, Web & Skills */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6">
            <h3 className="text-base font-bold font-display text-foreground border-b border-border pb-3">
              2. Details & Expertise
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                  Location
                </label>
                <div className="relative flex items-center">
                  <MapPin size={16} className="absolute left-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Riyadh, Saudi Arabia"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                  Personal Website / Linktree
                </label>
                <div className="relative flex items-center">
                  <Globe size={16} className="absolute left-3.5 text-muted-foreground" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                  />
                </div>
              </div>
            </div>

            {/* Skills Tag Editor */}
            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                Skills & Disciplines (press Enter)
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl border border-border bg-input-background min-h-12 items-center">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Add skill..."
                  className="flex-1 bg-transparent px-2 py-1 text-xs text-foreground focus:outline-none min-w-28"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6">
            <h3 className="text-base font-bold font-display text-foreground border-b border-border pb-3">
              3. Social Media & External Portfolios
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Twitter size={13} /> Twitter / X
                </label>
                <input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Dribbble size={13} /> Dribbble
                </label>
                <input
                  type="url"
                  value={dribbble}
                  onChange={(e) => setDribbble(e.target.value)}
                  placeholder="https://dribbble.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Linkedin size={13} /> LinkedIn
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Instagram size={13} /> Instagram
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full btn-primary text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check size={16} />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </motion.main>
  );
}
