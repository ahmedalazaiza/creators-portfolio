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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-xs"
        />

        {/* Dialog Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative rounded-2xl border border-border bg-card p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bookmark size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-foreground">
                Save to Moodboard / Collection
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X size={15} />
            </button>
          </div>

          {/* Project Preview */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border">
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
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {collections.map((col) => {
              const isSaved = isProjectInCollection(col.id, project.id);
              return (
                <button
                  key={col.id}
                  onClick={() => toggleProjectInCollection(col.id, project.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left cursor-pointer ${
                    isSaved
                      ? "border-primary/50 bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border bg-card hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs truncate">{col.title}</div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {col.projectIds.length} items
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      isSaved
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border bg-muted/30"
                    }`}
                  >
                    {isSaved && <Check size={12} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Create New Collection Row */}
          {showCreateInput ? (
            <form onSubmit={handleCreateAndAdd} className="space-y-2 pt-2 border-t border-border">
              <input
                type="text"
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Name your new moodboard..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateInput(false)}
                  className="px-3.5 py-1 rounded-full btn-secondary text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold disabled:opacity-40"
                >
                  Create & Save
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowCreateInput(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-border hover:border-primary/50 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Create New Moodboard</span>
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
