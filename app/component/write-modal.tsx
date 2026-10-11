"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface WriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLetterSent?: () => void;
}

export default function WriteModal({ isOpen, onClose, onLetterSent }: WriteModalProps) {
  const [to, setTo] = useState("");
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = content.trim();
    if (!trimmed) {
      setError("Please write your words before letting them go.");
      return;
    }

    if (trimmed.length > 1000) {
      setError("Letters must be 1000 characters or fewer.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/letters", {
        to: to.trim() || null,
        username: username.trim() || null,
        content: trimmed,
      });

      setSentSuccess(true);
      if (onLetterSent) onLetterSent();
      router.refresh();
    } catch (err: unknown) {
      console.error("Failed to send letter:", err);
      setError("Could not release letter. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setTo("");
    setUsername("");
    setContent("");
    setSentSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div className="paper-sheet relative bg-[#f6f1e8] text-[#241e1a] border border-[#e2d6c3] rounded-3xl w-full max-w-xl p-5 sm:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto">
        {/* Subtle decorative left margin rule like classic journal paper */}
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-[#8B0000]/15 pointer-events-none" />

        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[#857766] hover:text-[#231f1c] text-xl p-1 transition-colors cursor-pointer"
          title="Close sheet"
        >
          &times;
        </button>

        {sentSuccess ? (
          <div className="text-center py-10 space-y-4">
            {/* Elegant Crimson Wax Seal Graphic (No Emoji) */}
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#8B0000] border-2 border-[#6d0000] shadow-[0_6px_25px_rgba(139,0,0,0.35)] flex items-center justify-center text-[#fdf8f3]">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h3 className="text-2xl font-paper italic font-semibold text-[#1c1815]">
              Your letter has been sent to nobody.
            </h3>
            <p className="text-sm text-[#665a4c] max-w-sm mx-auto font-paper leading-relaxed">
              It is now resting peacefully among the unsent in the dark. Your heart has one less weight to carry.
            </p>
            <p className="text-xs text-[#8c7d6c] font-paper italic pt-1 max-w-xs mx-auto">
              &ldquo;I could not make you stay, so I made a world where you never have to leave.&rdquo;
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setTo("");
                  setUsername("");
                  setContent("");
                  setSentSuccess(false);
                }}
                className="text-xs px-5 py-2.5 rounded-full border border-[#d8cdbc] bg-[#ece4d6] text-[#4a4033] hover:bg-[#e3d9c7] transition-colors cursor-pointer font-paper italic"
              >
                Write another letter
              </button>
              <button
                onClick={handleResetAndClose}
                className="text-xs px-5 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#720000] text-[#fbf8f3] font-medium transition-colors shadow-sm cursor-pointer"
              >
                Read all letters
              </button>
            </div>
          </div>
        ) : (
          <div className="pl-3 sm:pl-4">
            <div className="mb-6 pb-4 border-b border-[#e4dbcd] flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B0000] font-semibold">
                  डाक पत्र • Unsent Stationery
                </span>
                <h3 className="text-2xl font-paper italic font-bold text-[#1c1815] mt-0.5">
                  Say what you never could.
                </h3>
                <p className="text-xs text-[#736655] mt-1 font-paper italic">
                  Write freely. It will be preserved anonymously forever.
                </p>
              </div>

              {/* Vintage postmark stamp */}
              <div className="hidden sm:block shrink-0 border border-[#cbbeaa] rounded-xl px-2.5 py-1 text-center bg-[#eee6d7]/70 select-none">
                <span className="block font-mono text-[8px] uppercase tracking-widest text-[#8B0000] font-bold">
                  डाक
                </span>
                <span className="block font-mono text-[8px] text-[#786b5b]">
                  UNSENT
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 text-xs text-[#8B0000] bg-red-100/70 border border-red-200 p-2.5 rounded-2xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#736655] mb-1 font-medium">
                    To: (optional)
                  </label>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="e.g. The one on platform 4, My almost"
                    maxLength={100}
                    className="w-full bg-[#fdfbf7] border border-[#d8cdbc] rounded-xl px-3.5 py-2 text-xs text-[#2b2520] placeholder-[#9c907f] focus:outline-hidden focus:border-[#8B0000] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#736655] mb-1 font-medium">
                    From: (optional)
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Leave blank for Anonymous"
                    maxLength={50}
                    className="w-full bg-[#fdfbf7] border border-[#d8cdbc] rounded-xl px-3.5 py-2 text-xs text-[#2b2520] placeholder-[#9c907f] focus:outline-hidden focus:border-[#8B0000] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#736655] font-medium">
                    The Letter:
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      content.length > 950 ? "text-[#8B0000]" : "text-[#8c806f]"
                    }`}
                  >
                    {content.length} / 1000
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the words you kept bottled up inside..."
                  required
                  rows={7}
                  maxLength={1000}
                  className="w-full bg-[#fdfbf7] border border-[#d8cdbc] rounded-2xl p-4 text-[16px] font-paper text-[#2b2520] placeholder-[#9c907f] focus:outline-hidden focus:border-[#8B0000] resize-y transition-colors leading-[1.8] shadow-inner"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-[#857766] italic font-paper text-center sm:text-left">
                  &ldquo;Even if she never reads this, the silence will keep it safe.&rdquo;
                </span>
                <div className="flex gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="flex-1 sm:flex-none text-xs px-4 py-2 rounded-full border border-[#d8cdbc] hover:bg-[#ece4d6] text-[#615444] transition-colors cursor-pointer text-center"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="flex-1 sm:flex-none text-xs px-5 py-2 rounded-full bg-[#8B0000] hover:bg-[#720000] text-[#fbf8f3] font-medium transition-all shadow-[0_2px_14px_rgba(139,0,0,0.3)] disabled:opacity-40 cursor-pointer text-center"
                  >
                    {isSubmitting ? "Releasing words..." : "Send it to nobody"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
