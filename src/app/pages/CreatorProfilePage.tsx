import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Globe,
  Briefcase,
  Clock,
  UserCheck,
  UserPlus,
  Mail,
  Bookmark,
  Share2,
  ChevronRight,
  ChevronLeft,
  Star,
  Eye,
  Heart,
  Grid,
  Sparkles,
  Award,
  Layers,
  X,
  ThumbsUp,
} from "lucide-react";
import { useCreator } from "../hooks/useCreator";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import HireModal from "../components/HireModal";

// Creator Creative Services Mock Offerings (Matching Screenshot 2)
const CREATOR_SERVICES = [
  {
    id: "srv-1",
    title: "Brand Identity",
    price: "From US$ 750",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80",
    ],
  },
  {
    id: "srv-2",
    title: "Packaging Design",
    price: "From US$ 500",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=400&q=80",
    ],
  },
  {
    id: "srv-3",
    title: "Social Media Kit",
    price: "From US$ 250",
    images: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
    ],
  },
  {
    id: "srv-4",
    title: "Professional Web & UI Design",
    price: "From US$ 500",
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
    ],
  },
];

export default function CreatorProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<"work" | "services">("work");
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [showBottomHireToast, setShowBottomHireToast] = useState(true);
  const [isSavedCandidate, setIsSavedCandidate] = useState(false);

  const { creator, creatorProjects, totalAppreciations, totalViews, isFollowing, toggleFollow } =
    useCreator(username);
  const { user } = useAuth();

  const isOwnProfile =
    Boolean(user?.username && creator?.username && user.username === creator.username) ||
    Boolean(user?.id && creator?.id && user.id === creator.id);

  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen pt-14 sm:pt-16 pb-24 bg-background text-foreground"
      >
        {/* Full-Width Panoramic Artwork Banner (Screenshot 2 Exact) */}
        <div className="relative h-48 sm:h-64 w-full bg-[#05070d] border-b border-border overflow-hidden flex items-center justify-center">
          {creator.bannerUrl ? (
            <img
              src={creator.bannerUrl}
              alt={creator.fullName}
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#070a14] via-[#0d1428] to-[#070a14] flex items-center justify-center">
              <div className="text-center space-y-1">
                <span className="text-lg sm:text-2xl font-mono uppercase tracking-[0.3em] font-black text-white/90">
                  {creator.fullName}
                </span>
                <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                  {creator.headline || "Lead Product Designer & Creative Director"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Behance 2-Column Profile Body Container */}
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar Column (Col span 3 ~ 320px) */}
            <div className="lg:col-span-3 space-y-5 lg:sticky lg:top-20">
              {/* Overlapping Avatar with PRO badge */}
              <div className="relative -mt-16 sm:-mt-20 inline-block">
                <img
                  src={creator.avatarUrl}
                  alt={creator.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-background bg-card shadow-lg"
                />
                <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-xs bg-[#0057ff] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                  PRO
                </span>
              </div>

              {/* Creator Name & Title */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
                  {creator.fullName}
                </h1>
              </div>

              {/* Creator Metadata List with Icons */}
              <div className="space-y-2.5 text-xs text-muted-foreground border-b border-border pb-4">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Briefcase size={14} className="text-[#0057ff] shrink-0" />
                  <span>Available for Freelance & Fulltime</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground shrink-0" />
                  <span>{creator.headline || "Senior Graphic & Product Designer"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={14} className="text-muted-foreground shrink-0" />
                  <span>Freelancer</span>
                </div>

                {creator.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-muted-foreground shrink-0" />
                    <span>{creator.location}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons (Follow / Message / Save Candidate) */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleFollow(creator.id)}
                  className={`w-full py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
                    isFollowing
                      ? "border border-border bg-muted text-muted-foreground"
                      : "bg-[#0057ff] hover:bg-[#004cdb] text-white"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={14} /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} /> + Follow
                    </>
                  )}
                </button>

                <button
                  onClick={() => setHireModalOpen(true)}
                  className="w-full py-2.5 rounded-full border border-border bg-card hover:bg-muted text-foreground font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail size={14} className="text-[#0057ff]" />
                  <span>Message</span>
                </button>

                <button
                  onClick={() => setIsSavedCandidate(!isSavedCandidate)}
                  className="w-full py-2.5 rounded-full border border-border bg-card hover:bg-muted text-foreground font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bookmark
                    size={14}
                    className={isSavedCandidate ? "text-[#0057ff] fill-[#0057ff]" : "text-muted-foreground"}
                  />
                  <span>{isSavedCandidate ? "Saved Candidate" : "Save Candidate"}</span>
                </button>
              </div>

              {/* Hire [Creator] Box (Screenshot 2 Exact) */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-foreground">
                  Hire {creator.fullName.split(" ")[0]}
                </h3>

                <div className="space-y-1.5">
                  <button
                    onClick={() => setHireModalOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-xs text-foreground font-medium text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase size={13} className="text-[#0057ff]" />
                      <span>Freelance Job</span>
                    </div>
                    <ChevronRight size={13} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => setHireModalOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-xs text-foreground font-medium text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase size={13} className="text-[#0057ff]" />
                      <span>Full-Time Job</span>
                    </div>
                    <ChevronRight size={13} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="pt-2 border-t border-border flex items-center gap-1.5 text-[11px] text-[#0057ff] font-medium">
                  <Star size={12} className="fill-[#0057ff]" />
                  <span>4 reviews (22 paid jobs)</span>
                </div>
              </div>

              {/* Profile Stats List (Views, Appreciations, Followers, Following) */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Project Views</span>
                  <strong className="text-foreground">
                    {(totalViews || 36520).toLocaleString()}
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Appreciations</span>
                  <strong className="text-foreground">
                    {(totalAppreciations || 2280).toLocaleString()}
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Followers</span>
                  <strong className="text-foreground">
                    {(creator.followersCount || 527).toLocaleString()}
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Following</span>
                  <strong className="text-foreground">
                    {(creator.followingCount || 184).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>

            {/* Right Main Content Area (Col span 9) */}
            <div className="lg:col-span-9 space-y-8">
              {/* Work / Services Navigation Tabs */}
              <div className="flex items-center gap-6 border-b border-border pb-3">
                <button
                  onClick={() => setActiveTab("work")}
                  className={`text-sm font-bold pb-3 relative transition-all cursor-pointer ${
                    activeTab === "work"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Work
                  {activeTab === "work" && (
                    <motion.span
                      layoutId="profileTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0057ff]"
                    />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("services")}
                  className={`text-sm font-bold pb-3 relative transition-all cursor-pointer ${
                    activeTab === "services"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Services
                  {activeTab === "services" && (
                    <motion.span
                      layoutId="profileTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0057ff]"
                    />
                  )}
                </button>
              </div>

              {/* Services Showcase Cards Carousel (Screenshot 2 Exact) */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground font-display">
                    Services
                  </h3>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHireModalOpen(true)}
                      className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer mr-2"
                    >
                      View All
                    </button>
                    <button
                      aria-label="Previous service"
                      className="p-1 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      aria-label="Next service"
                      className="p-1 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground cursor-pointer"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {CREATOR_SERVICES.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setHireModalOpen(true)}
                      className="rounded-xl border border-border bg-card overflow-hidden hover:border-[#0057ff]/50 transition-all group cursor-pointer shadow-xs flex flex-col justify-between"
                    >
                      {/* 3-Image Collage Header Preview */}
                      <div className="grid grid-cols-3 gap-0.5 bg-muted/40 aspect-[16/9] overflow-hidden">
                        {service.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ))}
                      </div>

                      {/* Service Body */}
                      <div className="p-3.5 space-y-1">
                        <h4 className="text-xs font-bold text-foreground group-hover:text-[#0057ff] transition-colors truncate">
                          {service.title}
                        </h4>
                        <p className="text-[11px] font-mono text-[#0057ff] font-bold">
                          {service.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Projects Grid Section */}
              <section className="space-y-4">
                <h3 className="text-base font-bold text-foreground font-display">
                  Projects ({creatorProjects.length})
                </h3>

                {creatorProjects.length === 0 ? (
                  <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-muted/10 space-y-2">
                    <Grid size={24} className="text-muted-foreground mx-auto" />
                    <h4 className="text-sm font-bold text-foreground">No projects uploaded yet</h4>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-7">
                    {creatorProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>

        {/* Floating Bottom Sticky Hire Bar (Screenshot 2 Exact) */}
        <AnimatePresence>
          {showBottomHireToast && !isOwnProfile && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40"
            >
              <div className="flex items-center gap-3.5 px-4 py-2 rounded-full bg-[#1c2333]/95 backdrop-blur-md border border-white/10 text-white shadow-2xl">
                <img
                  src={creator.avatarUrl}
                  alt={creator.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                />

                <span className="text-xs font-bold truncate">
                  {creator.fullName} is available for hire
                </span>

                <button
                  onClick={() => setHireModalOpen(true)}
                  className="px-4 py-1.5 rounded-full bg-white text-black hover:bg-white/90 text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  Hire {creator.fullName.split(" ")[0]}
                </button>

                <button
                  onClick={() => setShowBottomHireToast(false)}
                  className="p-1 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      {/* Hire Modal */}
      <HireModal
        isOpen={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        creator={creator}
      />
    </>
  );
}
