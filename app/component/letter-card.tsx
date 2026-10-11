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

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Deterministic date formatting — 100% identical on SSR and Client across all locales
function formatLetterDate(dateInput: string | Date): string {
  const d = new Date(dateInput);
  const day = d.getUTCDate();
  const month = MONTHS[d.getUTCMonth()];
  return `${day} ${month}`;
}

function timeAgo(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffSecs = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffSecs < 60) return "just now";
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
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

  // Check if content is Hindi / Devanagari script for specialized typography
  const hasDevanagari = /[\u0900-\u097F]/.test(letter.content);

  // Subtle deterministic micro-tilt for desktop, clean flush boundaries on mobile
  const tiltClass =
    letter.id.charCodeAt(letter.id.length - 1) % 2 === 0
      ? "sm:-rotate-[0.3deg] sm:hover:rotate-0"
      : "sm:rotate-[0.3deg] sm:hover:rotate-0";

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
    <article
      className={`paper-sheet paper-margin-rule relative rounded-2xl p-4 sm:p-6 pb-4 sm:pb-6 border border-[#dfd3bd] flex flex-col justify-between group transition-all duration-300 overflow-hidden ${tiltClass}`}
    >
      {/* Top Airmail Striping Accent */}
      <div className="h-1 airmail-edge rounded-t-xl -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-3 sm:mb-4" />

      {/* Top Header - To: and Vintage Postage Stamp with Postmark */}
      <div>
        <div className="flex justify-between items-start gap-2.5 sm:gap-3 pb-3 border-b border-[#dfd4c1] mb-3.5 sm:mb-4">
          <div className="flex-1 min-w-0 pr-1">
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#8B0000] font-bold block mb-0.5">
              To
            </span>
            <h2 className="font-handwriting text-lg sm:text-[22px] text-[#1b1510] font-semibold tracking-wide leading-tight truncate">
              {letter.to && letter.to.trim().toLowerCase() !== "nobody"
                ? `“${letter.to}”`
                : "“Nobody”"}
            </h2>
          </div>

          {/* Petite Vintage Postage Stamp Badge */}
          <div className="shrink-0 relative select-none">
            {/* Cancellation Wavy Ink Lines crossing over stamp */}
            <svg
              className="absolute -left-6 top-1/2 -translate-y-1/2 w-11 h-6 text-[#8B0000]/35 pointer-events-none z-10"
              viewBox="0 0 100 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M0,13 Q25,3 50,13 T100,13" />
              <path d="M0,22 Q25,12 50,22 T100,22" />
              <path d="M0,31 Q25,21 50,31 T100,31" />
            </svg>

            {/* Perforated Postage Stamp */}
            <div className="vintage-stamp rounded-xs px-2 py-1 text-center -rotate-2 group-hover:rotate-0 transition-transform duration-300 relative z-0">
              <div className="flex items-center justify-between gap-1 border-b border-[#ded3be] pb-0.5 mb-0.5">
                <span className="font-mono text-[7px] uppercase tracking-widest text-[#8B0000] font-bold">
                  डाक
                </span>
                <span className="font-mono text-[7px] text-[#786756] font-semibold">
                  ₹२.५०
                </span>
              </div>
              <div className="w-5 h-3.5 mx-auto flex items-center justify-center text-[#8B0000]/65 my-0.5">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M21 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
                  <path d="M21 8l-9 6-9-6" />
                  <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
                </svg>
              </div>
              <span
                className="block font-mono text-[7.5px] text-[#6d5e4f] tracking-tight"
                suppressHydrationWarning
              >
                {formatLetterDate(letter.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Letter Body - Inset beyond the paper margin rule */}
        <div className="pl-3 sm:pl-5 my-1.5">
          <div
            className={`${
              hasDevanagari
                ? "font-devanagari text-[15px] sm:text-[16px] leading-[1.85]"
                : "font-paper text-[15px] sm:text-[15.5px] leading-[1.8]"
            } text-[#241c16] whitespace-pre-wrap select-text font-normal`}
          >
            {letter.content}
          </div>
        </div>
      </div>

      {/* Footer - Signature and Compact Reactions */}
      <div className="pt-3.5 sm:pt-4 mt-4 sm:mt-5 border-t border-[#dfd4c1] flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 pl-0.5 sm:pl-2 min-w-0 flex-1 pr-1">
          <span className="text-[#48392c] font-handwriting text-base sm:text-[19px] tracking-wide font-medium truncate">
            — {letter.username || "Anonymous"}
          </span>
          <span
            className="text-[#968673] text-[9px] sm:text-[9.5px] font-mono shrink-0"
            suppressHydrationWarning
          >
            • {timeAgo(letter.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Reaction: "I felt this" (Tactile Wax Seal Impression - No Emoji) */}
          <button
            onClick={handleFeltReaction}
            disabled={hasFelt}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
              hasFelt
                ? "bg-[#8B0000] text-[#fbf8f3] border border-[#6d0000] shadow-[0_2px_10px_rgba(139,0,0,0.3)] cursor-default"
                : "bg-[#eee6d7] border border-[#d8cca] text-[#42372c] hover:border-[#8B0000]/60 hover:text-[#8B0000] hover:bg-[#e4dcce] shadow-xs"
            }`}
            title={hasFelt ? "You felt this letter" : "I felt this"}
          >
            <svg
              width="11"
              height="11"
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
            <span className="text-[10.5px] font-sans font-medium">Felt</span>
            <span
              className={`font-mono text-[10.5px] pl-1 border-l ${
                hasFelt
                  ? "border-red-400/50 text-[#fbf8f3]"
                  : "border-[#cfc3af] text-[#6d5e4e]"
              }`}
            >
              {feltCount}
            </span>
          </button>

          {/* Margin Notes Toggle (Fountain Pen SVG - No Emoji) */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              showComments
                ? "bg-[#2e251e] text-[#fbf7f0] shadow-xs"
                : "bg-[#eee6d7] border border-[#d8cca] text-[#4d4032] hover:bg-[#e4dcce] hover:text-[#1c1611] shadow-xs"
            }`}
            title="Margin notes on this letter"
          >
            <svg
              width="11"
              height="11"
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
            <span className="font-mono text-[10.5px]">{comments.length}</span>
          </button>
        </div>
      </div>

      {/* Margin Notes Accordion — Pinned Memo Slips */}
      {showComments && (
        <div className="mt-4 pt-3.5 border-t border-[#ded3be] space-y-2.5">
          <div className="flex items-center justify-between text-xs text-[#736452] font-mono">
            <span className="font-sans font-semibold text-[10.5px] uppercase tracking-wider text-[#544535]">
              Margin Notes ({comments.length})
            </span>
            <span className="text-[9.5px]">Pinned slips</span>
          </div>

          {/* List of notes */}
          {comments.length > 0 ? (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {comments.map((comment, idx) => (
                <div
                  key={comment.id}
                  className={`margin-note-slip rounded-lg p-2.5 text-xs text-[#2b231d] relative ${
                    idx % 2 === 0 ? "-rotate-[0.3deg]" : "rotate-[0.3deg]"
                  }`}
                >
                  {/* Subtle red pin accent */}
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#8B0000]/60" />
                  <div className="flex justify-between items-center text-[9.5px] text-[#786754] mb-1 font-mono pr-2.5">
                    <span className="font-sans font-semibold text-[#423425]">
                      {comment.username || "Anonymous"}
                    </span>
                    <span suppressHydrationWarning>
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="font-paper text-[13.5px] leading-relaxed text-[#231b14]">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#827463] italic py-0.5 font-paper">
              No notes have been added to this paper yet.
            </p>
          )}

          {/* Leave a note form */}
          <form onSubmit={handleCommentSubmit} className="pt-1.5 space-y-2">
            {commentError && (
              <p className="text-xs text-[#8B0000] bg-red-100/70 border border-red-200 p-1.5 rounded-lg">
                {commentError}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-1.5">
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="Name (optional)"
                maxLength={40}
                className="sm:w-1/3 bg-[#fdfbf7] border border-[#d5c7b3] rounded-lg px-2.5 py-1 text-xs text-[#2b231d] placeholder-[#948472] focus:outline-hidden focus:border-[#8B0000]"
              />
              <div className="relative flex-1">
                <input
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Add a margin note..."
                  maxLength={100}
                  required
                  className="w-full bg-[#fdfbf7] border border-[#d5c7b3] rounded-lg px-2.5 py-1 text-xs text-[#2b231d] placeholder-[#948472] focus:outline-hidden focus:border-[#8B0000] pr-11"
                />
                <span className="absolute right-2 top-1.5 text-[9px] text-[#948472] font-mono">
                  {commentContent.length}/100
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingComment || !commentContent.trim()}
                className="text-[11px] px-3.5 py-1 rounded-full bg-[#8B0000] hover:bg-[#720000] text-[#fdfbf8] font-medium disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
              >
                {isSubmittingComment ? "Saving..." : "Pin Note"}
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}
