import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  User,
  Check,
  Globe,
  MapPin,
  Sparkles,
  Camera,
  Briefcase,
  Twitter,
  Dribbble,
  Linkedin,
  Github,
  Instagram,
  RefreshCw,
} from "lucide-react";
import { useAuth, UserProfile } from "../context/AuthContext";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const { user, updateProfile } = useAuth();

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

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state whenever user changes or modal opens
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setHeadline(user.headline || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatarUrl || "");
      setBannerUrl(user.bannerUrl || "");
      setLocation(user.location || "");
      setWebsite(user.website || "");
      setAvailableForWork(user.availableForWork ?? true);
      setSkills(user.skills || []);
      setTwitter(user.socialLinks?.twitter || "");
      setDribbble(user.socialLinks?.dribbble || "");
      setBehance(user.socialLinks?.behance || "");
      setLinkedin(user.socialLinks?.linkedin || "");
      setGithub(user.socialLinks?.github || "");
      setInstagram(user.socialLinks?.instagram || "");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const val = skillInput.trim();
      if (!skills.includes(val)) {
        setSkills((prev) => [...prev, val]);
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleGenerateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(2, 9);
    setAvatarUrl(`https://api.dicebear.com/7.x/shapes/svg?seed=${seed}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
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
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 900);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="glass-card w-full max-w-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-card/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shadow-md shadow-[#CDF22B]/20">
              <User size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground">
                Edit Creator Profile
              </h2>
              <p className="text-xs text-muted-foreground">
                Update your public portfolio info and professional details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
            <div className="relative group">
              <img
                src={
                  avatarUrl ||
                  `https://api.dicebear.com/7.x/shapes/svg?seed=${user.username || "creator"}`
                }
                alt="Avatar Preview"
                className="w-20 h-20 rounded-2xl object-cover bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-md"
              />
            </div>

            <div className="space-y-2 flex-1 text-center sm:text-left min-w-0">
              <label className="text-xs font-bold text-foreground block">
                Profile Avatar
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://... image URL"
                  className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl bg-background border border-slate-200 dark:border-slate-700 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
                />
                <button
                  type="button"
                  onClick={handleGenerateRandomAvatar}
                  className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-[#CDF22B] hover:text-slate-950 text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Randomize</span>
                </button>
              </div>
            </div>
          </div>

          {/* Primary Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ahmed Al-Azaiza"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-200 dark:border-slate-700 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Lead Product Designer & 3D Artist"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-200 dark:border-slate-700 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Bio / About</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other creatives about your craft, design principles, and background..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-200 dark:border-slate-700 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] resize-none"
            />
          </div>

          {/* Location & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <MapPin size={12} className="text-[#CDF22B]" /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Riyadh, Saudi Arabia"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-200 dark:border-slate-700 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <Globe size={12} className="text-[#CDF22B]" /> Website / Portfolio Link
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. https://ahmedalazaiza.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-200 dark:border-slate-700 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
              />
            </div>
          </div>

          {/* Available for Work Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available for Freelance & Full-time Roles
              </p>
              <p className="text-[11px] text-muted-foreground">
                Displays a prominent "Available for Work" badge on your profile and project cards
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAvailableForWork(!availableForWork)}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors cursor-pointer ${
                availableForWork ? "bg-[#CDF22B]" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-slate-950 transition-transform ${
                  availableForWork ? "translate-x-5.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Skills / Specialties */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              Skills & Creative Disciplines (Press Enter to add)
            </label>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="e.g. Design Systems, Figma, 3D CGI, Cinema 4D..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-200 dark:border-slate-700 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
            />
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-foreground text-xs font-semibold"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-500 cursor-pointer ml-1"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Social Links Accordion / Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-foreground block">
              Social & Portfolio Links
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-slate-200 dark:border-slate-700">
                <Twitter size={14} className="text-sky-500 shrink-0" />
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="Twitter / X profile URL"
                  className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-slate-200 dark:border-slate-700">
                <Dribbble size={14} className="text-pink-500 shrink-0" />
                <input
                  type="text"
                  value={dribbble}
                  onChange={(e) => setDribbble(e.target.value)}
                  placeholder="Dribbble profile URL"
                  className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-slate-200 dark:border-slate-700">
                <Linkedin size={14} className="text-blue-600 shrink-0" />
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="LinkedIn profile URL"
                  className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-slate-200 dark:border-slate-700">
                <Github size={14} className="text-foreground shrink-0" />
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="GitHub profile URL"
                  className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <Check size={14} />
                  <span>Profile Updated!</span>
                </>
              ) : (
                <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
