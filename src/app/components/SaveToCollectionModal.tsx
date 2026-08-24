import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bookmark, Plus, Check, X, FolderPlus, Sparkles } from "lucide-react";
import { useCollections } from "../hooks/useCollections";
import { Project } from "../types";

interface SaveToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function SaveToCollectionModal({
  isOpen,
  onClose,
  project,
}: SaveToCollectionModalProps) {
  const {
    collections,
    createCollection,
    toggleProjectInCollection,
    isProjectInCollection,
  } = useCollections();

  const [newTitle, setNewTitle] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);

  if (!isOpen) return null;

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const created = createCollection(newTitle.trim());
    toggleProjectInCollection(created.id, project.id);
    setNewTitle("");
    setShowCreateInput(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        />

        {/* Dialog Modal / Bottom Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.98 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative rounded-t-[32px] sm:rounded-3xl border-t sm:border border-slate-300 dark:border-white/15 bg-white dark:bg-[#151813] p-5 sm:p-6 sm:max-w-md w-full space-y-4 shadow-2xl z-10 pb-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))] sm:pb-6"
        >
          {/* Mobile Drag Indicator Bar */}
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto -mt-2 mb-1 sm:hidden shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                <Bookmark size={16} />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                Save to Moodboard / Collection
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Project Preview */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-12 h-9 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-foreground truncate">
                {project.title}
              </h4>
              <p className="text-[10px] text-muted-foreground truncate">
                by {project.creator?.fullName || "Creator"}
              </p>
            </div>
          </div>

          {/* Collections List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {collections.map((col) => {
              const isSaved = isProjectInCollection(col.id, project.id);
              return (
                <button
                  key={col.id}
                  onClick={() => toggleProjectInCollection(col.id, project.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer min-h-[48px] active:scale-98 ${
                    isSaved
                      ? "border-[#CDF22B] bg-[#CDF22B]/15 text-slate-900 dark:text-[#CDF22B] font-bold shadow-xs"
                      : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#181b15] hover:bg-slate-50 dark:hover:bg-white/5 text-foreground"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs truncate">{col.title}</div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {col.projectIds.length} items
                    </span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      isSaved
                        ? "bg-[#CDF22B] text-slate-950 border-[#CDF22B] font-bold"
                        : "border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/5"
                    }`}
                  >
                    {isSaved && <Check size={14} strokeWidth={2.5} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Create New Collection Row */}
          {showCreateInput ? (
            <form onSubmit={handleCreateAndAdd} className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
              <input
                type="text"
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Name your new moodboard..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#11130e] text-foreground text-xs focus:outline-none focus:border-[#CDF22B] min-h-[44px]"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateInput(false)}
                  className="min-h-[40px] px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="min-h-[40px] px-5 py-1.5 rounded-full btn-primary text-slate-950 text-xs font-bold disabled:opacity-40 cursor-pointer active:scale-95"
                >
                  Create & Save
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowCreateInput(true)}
              className="w-full min-h-[44px] py-2.5 rounded-2xl border border-dashed border-slate-300 dark:border-white/20 hover:border-[#CDF22B] text-xs font-semibold text-muted-foreground hover:text-slate-900 dark:hover:text-[#CDF22B] transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Plus size={15} />
              <span>Create New Moodboard</span>
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
