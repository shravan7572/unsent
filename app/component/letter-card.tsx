"use client";

import axios from "axios";
import { useState, useSyncExternalStore } from "react";

export interface CommentItem {
  id: string;
  content: string;
  username: string | null;
  createdAt: string | Date;
}

export interface LetterItem {
  id: string;
  to: string | null;
  content: string;
  username: string | null;
  feltThis: number;
  createdAt: string | Date;
  comments?: CommentItem[];
}

function timeAgo(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSecs < 60) return "just now";
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLetterDate(dateInput: string | Date): string {
  const date = new Date(dateInput);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function LetterCard({ letter }: { letter: LetterItem }) {
  const [feltCount, setFeltCount] = useState(letter.feltThis || 0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>(letter.comments || []);
  const [commentContent, setCommentContent] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const hasFeltStored = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      return () => window.removeEventListener("storage", onStoreChange);
    },
    () => {
      try {
        return localStorage.getItem(`unsent_felt_${letter.id}`) === "true";
      } catch {
        return false;
      }
    },
    () => false
  );

  const [hasFeltClicked, setHasFeltClicked] = useState(false);
  const hasFelt = hasFeltStored || hasFeltClicked;

  const handleFeltReaction = async () => {
    if (hasFelt) return;

    setHasFeltClicked(true);
    setFeltCount((prev) => prev + 1);
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 450);

    try {
      localStorage.setItem(`unsent_felt_${letter.id}`, "true");
      await axios.post(`/api/letters/${letter.id}/felt`);
    } catch (err) {
      console.error("Failed to record reaction:", err);
      setHasFeltClicked(false);
      setFeltCount((prev) => Math.max(0, prev - 1));
      localStorage.removeItem(`unsent_felt_${letter.id}`);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError(null);

    const trimmed = commentContent.trim();
    if (!trimmed) {
      setCommentError("Note cannot be empty.");
      return;
    }

    if (trimmed.length > 100) {
      setCommentError("Max 100 characters allowed.");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const res = await axios.post(`/api/letters/${letter.id}/comments`, {
        content: trimmed,
        username: commentAuthor.trim() || null,
      });

      setComments((prev) => [...prev, res.data]);
      setCommentContent("");
      setCommentAuthor("");
    } catch (err) {
      console.error("Failed to submit note:", err);
      setCommentError("Could not leave note. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <article className="paper-sheet relative bg-[#f6f1e8] text-[#241e1a] border border-[#e2d7c5] rounded-3xl p-7 sm:p-9 shadow-[0_16px_40px_rgba(0,0,0,0.58)] hover:shadow-[0_22px_52px_rgba(0,0,0,0.72)] transition-all duration-300 flex flex-col justify-between group overflow-hidden">
      {/* Top Header - To: and Vintage Stamp */}
      <div>
        <div className="flex justify-between items-start gap-4 pb-4 border-b border-[#e2d6c3] mb-5">
          <div className="flex-1 min-w-0 pr-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#8B0000] font-semibold">
              To
            </span>
            <h2 className="text-xl sm:text-2xl font-paper italic font-semibold text-[#1c1815] tracking-wide mt-0.5 truncate">
              &ldquo;{letter.to || "Nobody"}&rdquo;
            </h2>
          </div>

          {/* Vintage Postmark Stamp Badge in Corner */}
          <div className="shrink-0 border border-dashed border-[#cbbeaa] rounded-xl px-2.5 py-1 text-center bg-[#eee6d7]/85 select-none -rotate-1 group-hover:rotate-0 transition-transform">
            <span className="block font-mono text-[8px] uppercase tracking-widest text-[#8B0000] font-bold">
              डाक • UNSENT
            </span>
            <span className="block font-mono text-[9px] text-[#786b5b]">
              {formatLetterDate(letter.createdAt)}
            </span>
          </div>
        </div>

        {/* Letter Body - Literary Ink Typography with left margin accent */}
        <div className="border-l-2 border-[#8B0000]/15 pl-4 sm:pl-5 my-1">
          <div className="font-paper text-[17px] sm:text-[18px] leading-[1.95] text-[#241e1a] whitespace-pre-wrap select-text font-normal">
            {letter.content}
          </div>
        </div>
      </div>

      {/* Footer - Signature and Reactions */}
      <div className="pt-6 mt-6 border-t border-[#e2d6c3] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#6d6152] italic font-paper text-base tracking-wide">
            — {letter.username || "Anonymous"}
          </span>
          <span className="text-[#a89b88] text-[10px] font-mono">
            • {timeAgo(letter.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Reaction: "I felt this" (Refined SVG Icon - No Emoji) */}
          <button
            onClick={handleFeltReaction}
            disabled={hasFelt}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              hasFelt
                ? "bg-[#8B0000] text-[#fbf8f3] border border-[#6d0000] shadow-[0_2px_12px_rgba(139,0,0,0.3)] cursor-default"
                : "bg-[#ebe4d7] border border-[#dcd1be] text-[#4a4033] hover:border-[#8B0000]/60 hover:text-[#8B0000] hover:bg-[#e3dac9]"
            }`}
            title={hasFelt ? "You felt this letter" : "I felt this"}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill={hasFelt ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${
                isPulsing ? "scale-130" : ""
              }`}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className="text-[11px] font-sans font-medium">I felt this</span>
            <span
              className={`font-mono text-[11px] pl-1.5 border-l ${
                hasFelt ? "border-red-400/50 text-[#fbf8f3]" : "border-[#cfc4b0] text-[#6d6152]"
              }`}
            >
              {feltCount}
            </span>
          </button>

          {/* Margin Notes Toggle (Refined Pen SVG - No Emoji) */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              showComments
                ? "bg-[#332b24] text-[#f6f1e8]"
                : "bg-[#ebe4d7] border border-[#dcd1be] text-[#554a3c] hover:bg-[#e3dac9]"
            }`}
            title="Notes on this letter"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span className="font-mono text-[11px]">{comments.length}</span>
          </button>
        </div>
      </div>

      {/* Margin Notes Accordion */}
      {showComments && (
        <div className="mt-5 pt-4 border-t border-[#e2d6c3] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#736859] font-mono">
            <span className="font-sans font-medium text-[11px]">
              Notes on this sheet ({comments.length})
            </span>
            <span className="text-[10px]">Max 100 characters</span>
          </div>

          {/* List of notes */}
          {comments.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-[#eee6d9] border border-[#ddd3c1] rounded-2xl p-3 text-xs text-[#2b2520]"
                >
                  <div className="flex justify-between items-center text-[10px] text-[#786c5c] mb-1 font-mono">
                    <span className="font-sans font-semibold text-[#453c33]">
                      {comment.username || "Anonymous"}
                    </span>
                    <span>{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="font-paper text-sm leading-relaxed text-[#231e1a]">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#827666] italic py-1 font-paper">
              No notes have been added to this paper yet.
            </p>
          )}

          {/* Leave a note form */}
          <form onSubmit={handleCommentSubmit} className="pt-2 space-y-2">
            {commentError && (
              <p className="text-xs text-[#8B0000] bg-red-100/70 border border-red-200 p-2 rounded-xl">
                {commentError}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="Name (optional)"
                maxLength={40}
                className="sm:w-1/3 bg-[#fdfbf7] border border-[#d8cdbc] rounded-xl px-3 py-1.5 text-xs text-[#2b2520] placeholder-[#9c907f] focus:outline-hidden focus:border-[#8B0000]"
              />
              <div className="relative flex-1">
                <input
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Add a margin note (max 100 chars)..."
                  maxLength={100}
                  required
                  className="w-full bg-[#fdfbf7] border border-[#d8cdbc] rounded-xl px-3 py-1.5 text-xs text-[#2b2520] placeholder-[#9c907f] focus:outline-hidden focus:border-[#8B0000] pr-12"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-[#9c907f] font-mono">
                  {commentContent.length}/100
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingComment || !commentContent.trim()}
                className="text-xs px-4 py-1.5 rounded-full bg-[#8B0000] hover:bg-[#720000] text-[#fbf8f3] font-medium disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
              >
                {isSubmittingComment ? "Saving..." : "Leave Note"}
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}
