"use client";

import { useMemo, useState } from "react";
import LetterCard, { LetterItem } from "./letter-card";
import WriteModal from "./write-modal";

interface LettersFeedProps {
  initialLetters: LetterItem[];
}

const CATEGORY_FILTERS = [
  { id: "all", label: "All Letters" },
  { id: "felt", label: "Most Felt" },
  { id: "addressed", label: "Addressed" },
  { id: "nobody", label: "To Nobody" },
];

export default function LettersFeed({ initialLetters }: LettersFeedProps) {
  const [letters, setLetters] = useState<LetterItem[]>(initialLetters);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Filter and sort computation
  const displayedLetters = useMemo(() => {
    let result = [...letters];

    // Filter computation
    if (activeFilter === "felt") {
      result.sort((a, b) => (b.feltThis || 0) - (a.feltThis || 0));
    } else if (activeFilter === "addressed") {
      result = result.filter(
        (l) => l.to && l.to.trim().length > 0 && l.to.trim().toLowerCase() !== "nobody"
      );
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (activeFilter === "nobody") {
      result = result.filter(
        (l) => !l.to || !l.to.trim() || l.to.trim().toLowerCase() === "nobody"
      );
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      // Chronological
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          (l.to && l.to.toLowerCase().includes(q)) ||
          l.content.toLowerCase().includes(q) ||
          (l.username && l.username.toLowerCase().includes(q))
      );
    }

    return result;
  }, [letters, activeFilter, searchQuery]);

  const handleLetterSent = async () => {
    try {
      const res = await fetch("/api/letters");
      if (res.ok) {
        const data = await res.json();
        setLetters(data);
      }
    } catch (e) {
      console.error("Failed to refresh feed:", e);
    }
  };

  return (
    <section id="explore" className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-24">
      {/* Section Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#211a14]/90">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2b221a] bg-[#140f0c] text-[#a89b88] text-[10px] font-mono uppercase tracking-widest mb-3">
            <span>पत्र संग्रह</span>
            <span>•</span>
            <span>Archive of the Unsaid</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-paper font-semibold text-[#f4efe6] tracking-wide">
            Read the Letters
          </h2>
          <p className="text-sm text-[#9c8e7c] mt-1.5 max-w-md font-paper italic leading-relaxed">
            Each sheet below was written by someone who couldn&apos;t say it out loud — words meant for someone specific, preserved where they will never cause them pain.
          </p>
        </div>

        {/* Search bar & Write Invitation */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipient or words..."
              className="w-full bg-[#140f0c] border border-[#261e16] rounded-full pl-9 pr-8 py-2.5 text-xs text-[#f4efe6] placeholder-[#786b5b] focus:outline-hidden focus:border-[#8B0000]/80 transition-colors"
            />
            {/* Minimal Search SVG */}
            <svg
              className="absolute left-3.5 top-3 text-[#786b5b] pointer-events-none"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-2.5 text-[#786b5b] hover:text-[#f4efe6] text-xs cursor-pointer"
              >
                &times;
              </button>
            )}
          </div>

          {/* Warm invitation button */}
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-5 py-2.5 rounded-full border border-[#8B0000]/60 bg-[#1f0d0a] hover:bg-[#8B0000] text-[#f4efe6] text-xs font-paper italic transition-all duration-300 shadow-[0_2px_15px_rgba(139,0,0,0.25)] shrink-0 cursor-pointer"
          >
            Leave a letter
          </button>
        </div>
      </div>

      {/* Real Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto py-6 scrollbar-none text-xs">
        {CATEGORY_FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 text-xs font-sans tracking-wide cursor-pointer ${
                isActive
                  ? "bg-[#f5f0e8] text-[#1c1815] font-semibold shadow-md"
                  : "bg-[#140f0c] border border-[#261e16] text-[#9c8e7c] hover:text-[#f4efe6] hover:border-[#382d22]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#786b5b] mb-7 px-1">
        <span>
          {displayedLetters.length} {displayedLetters.length === 1 ? "sheet" : "sheets"} on the desk
        </span>
        {activeFilter === "felt" && (
          <span className="text-[#c06b6b]">Sorted by most felt</span>
        )}
      </div>

      {/* 2-Column Aged Paper Cards Grid on Dark Background */}
      {displayedLetters.length === 0 ? (
        <div className="paper-sheet text-center py-16 border border-[#ded4c2] rounded-3xl p-8 max-w-xl mx-auto shadow-2xl">
          {/* Subtle Vintage Postmark / Wax Seal Graphic */}
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-[#cbbeaa] bg-[#ece2d0] flex items-center justify-center text-[#8B0000]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l9-6.2a2 2 0 0 1 2.4 0l7 5.2z" />
              <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
            </svg>
          </div>
          <h3 className="text-xl font-paper italic font-semibold text-[#2b2520]">
            {searchQuery
              ? "No letters found matching this search."
              : "The desk is quiet tonight."}
          </h3>
          <p className="text-xs text-[#786b5b] mt-1.5 max-w-sm mx-auto font-paper leading-relaxed">
            {searchQuery
              ? "Try searching for a different word or clear your search query."
              : "Perhaps you have the first unsaid words to leave here."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs px-4 py-2 rounded-full border border-[#c9bead] text-[#4a4033] hover:bg-[#e8dfcf] cursor-pointer"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="text-xs px-5 py-2 rounded-full bg-[#8B0000] hover:bg-[#720000] text-[#fbf8f3] font-medium shadow-sm cursor-pointer"
            >
              Write what you couldn&apos;t say
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8 items-start">
          {displayedLetters.map((letter) => (
            <LetterCard key={letter.id} letter={letter} />
          ))}
        </div>
      )}

      {/* Write Letter Modal */}
      <WriteModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onLetterSent={handleLetterSent}
      />
    </section>
  );
}

