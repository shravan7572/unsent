"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function WriteLetter() {
  const [to, setTo] = useState("");
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    setLoading(true);
    try {
      await axios.post("/api/letters", {
        to: to.trim() || null,
        username: username.trim() || null,
        content: trimmed,
      });
      setSent(true);
    } catch (err: unknown) {
      console.error("Failed to send letter:", err);
      setError("Could not release letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTo("");
    setUsername("");
    setContent("");
    setSent(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0d0a08] text-[#f4efe6] flex flex-col font-sans selection:bg-[#4a120e] selection:text-[#f8d7da]">
      {/* Top Header */}
      <header className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 flex items-center justify-between border-b border-[#211a14]">
        <Link
          href="/"
          className="text-xs text-[#9c8e7c] hover:text-[#f4efe6] transition-colors flex items-center gap-1.5 font-serif italic"
        >
          <span>&larr;</span> Back to the letters
        </Link>
        <span className="font-devanagari text-lg text-[#c9bea9]">
          अनकहा
        </span>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-12 flex-1 flex flex-col justify-center">
        {sent ? (
          <div className="paper-sheet border border-[#e2d6c3] bg-[#f6f1e8] text-[#241e1a] p-8 sm:p-12 rounded-3xl text-center space-y-5 shadow-2xl relative">
            {/* Elegant Crimson Wax Seal Graphic (No Emoji) */}
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-[#8B0000] border-2 border-[#6d0000] shadow-[0_6px_25px_rgba(139,0,0,0.35)] flex items-center justify-center text-[#fdf8f3]">
              <svg
                width="28"
                height="28"
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
            <h1 className="text-2xl sm:text-3xl font-paper italic font-semibold text-[#1c1815]">
              Your letter has been sent to nobody.
            </h1>
            <p className="text-sm sm:text-base text-[#665a4c] font-paper leading-relaxed max-w-md mx-auto">
              It is now resting peacefully among the unsent in the dark. Your words are safe, and your heart has one less burden to carry alone.
            </p>
            <p className="text-xs text-[#8c7d6c] font-paper italic pt-1 max-w-sm mx-auto">
              &ldquo;I could not make you stay, so I made a world where you never have to leave.&rdquo;
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button
                onClick={handleReset}
                className="text-xs px-5 py-2.5 rounded-full border border-[#d8cdbc] bg-[#ece4d6] text-[#4a4033] hover:bg-[#e3d9c7] transition-colors cursor-pointer font-paper italic"
              >
                Write another letter
              </button>
              <Link
                href="/"
                className="text-xs px-5 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#720000] text-[#fbf8f3] font-medium transition-all shadow-sm cursor-pointer"
              >
                Read all letters &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="paper-sheet relative border border-[#e2d6c3] bg-[#f6f1e8] text-[#241e1a] p-7 sm:p-10 rounded-3xl shadow-2xl space-y-6 overflow-hidden">
            {/* Subtle decorative left margin rule like classic journal paper */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-[#8B0000]/15 pointer-events-none" />

            <div className="pl-3 sm:pl-4">
              <div className="border-b border-[#e4dbcd] pb-4 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B0000] font-semibold">
                    डाक पत्र • An Unsent Sheet
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-paper italic font-bold text-[#1c1815] mt-0.5">
                    Say what you never could.
                  </h1>
                  <p className="text-xs text-[#736655] mt-1 font-paper leading-relaxed">
                    Addressed to someone who will never receive it. Preserved anonymously for souls who feel the same.
                  </p>
                </div>

                {/* Vintage postmark stamp badge */}
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
                <div className="mt-4 p-3 text-xs text-[#8B0000] bg-red-100/70 rounded-2xl border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 mt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#736655] mb-1.5 font-medium">
                      To: (optional)
                    </label>
                    <input
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      maxLength={100}
                      className="w-full bg-[#fdfbf7] border border-[#d8cdbc] rounded-xl px-4 py-2.5 text-xs text-[#2b2520] placeholder-[#9c907f] focus:outline-hidden focus:border-[#8B0000] transition-colors"
                      placeholder="e.g. The one on platform 4, My almost"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#736655] mb-1.5 font-medium">
                      From: (optional)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      maxLength={50}
                      className="w-full bg-[#fdfbf7] border border-[#d8cdbc] rounded-xl px-4 py-2.5 text-xs text-[#2b2520] placeholder-[#9c907f] focus:outline-hidden focus:border-[#8B0000] transition-colors"
                      placeholder="Leave blank for Anonymous"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#736655] font-medium">
                      The Letter:
                    </label>
                    <span
                      className={`text-xs font-mono ${
                        content.length > 950 ? "text-[#8B0000]" : "text-[#8c806f]"
                      }`}
                    >
                      {content.length} / 1000
                    </span>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={9}
                    required
                    maxLength={1000}
                    className="w-full bg-[#fdfbf7] border border-[#d8cdbc] rounded-2xl p-4 text-[17px] font-paper text-[#2b2520] placeholder-[#9c907f] focus:outline-hidden focus:border-[#8B0000] resize-y transition-colors leading-[1.85] shadow-inner"
                    placeholder="Write the words you kept bottled up inside. Max 1000 characters..."
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-[#857766] italic font-paper">
                    &ldquo;For the one who will never know how many lines were written in her name.&rdquo;
                  </span>
                  <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="px-7 py-3 rounded-full bg-[#8B0000] hover:bg-[#720000] text-[#fbf8f3] font-medium text-xs font-sans tracking-wide transition-all shadow-[0_2px_14px_rgba(139,0,0,0.3)] disabled:opacity-40 cursor-pointer"
                  >
                    {loading ? "Releasing words..." : "Send it to nobody"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}