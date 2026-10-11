"use client";

import { useEffect, useRef, useState } from "react";
import LetterCard, { LetterItem } from "./letter-card";
import WriteModal from "./write-modal";

interface LettersFeedProps {
  initialLetters: LetterItem[];
  totalCount?: number;
}

const CATEGORY_FILTERS = [
  { id: "all", label: "All Letters" },
  { id: "felt", label: "Most Felt" },
  { id: "addressed", label: "Addressed" },
  { id: "nobody", label: "To Nobody" },
];

export default function LettersFeed({
  initialLetters,
  totalCount = 0,
}: LettersFeedProps) {
  const [letters, setLetters] = useState<LetterItem[]>(initialLetters);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFetchingFilter, setIsFetchingFilter] = useState(false);
  const [hasMore, setHasMore] = useState(
    totalCount > initialLetters.length || initialLetters.length >= 10
  );
  const [displayedTotal, setDisplayedTotal] = useState(totalCount || initialLetters.length);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // Fetch letters when filter or search changes
  const fetchFilteredLetters = async (filter: string, search: string) => {
    setIsFetchingFilter(true);
    try {
      const params = new URLSearchParams({
        limit: "10",
        filter,
        search,
      });

      const res = await fetch(`/api/letters?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.letters || [];
        const nextHasMore = Array.isArray(data)
          ? items.length >= 10
          : Boolean(data.hasMore);
        const count = Array.isArray(data) ? items.length : data.totalCount ?? items.length;

        setLetters(items);
        setHasMore(nextHasMore);
        setDisplayedTotal(count);
      }
    } catch (err) {
      console.error("Failed to fetch filtered letters:", err);
    } finally {
      setIsFetchingFilter(false);
    }
  };

  // Handle filter category clicks
  const handleFilterSelect = (filterId: string) => {
    if (activeFilter === filterId && !searchQuery) return;
    setActiveFilter(filterId);
    fetchFilteredLetters(filterId, searchQuery);
  };

  // Debounced search query change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchFilteredLetters(activeFilter, searchQuery);
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Load more letters on demand (cursor pagination)
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore || letters.length === 0) return;

    setIsLoadingMore(true);
    try {
      const lastLetter = letters[letters.length - 1];
      const params = new URLSearchParams({
        limit: "10",
        cursor: lastLetter.id,
        filter: activeFilter,
        search: searchQuery,
      });

      const res = await fetch(`/api/letters?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const newItems: LetterItem[] = Array.isArray(data)
          ? data
          : data.letters || [];
        const nextHasMore = Array.isArray(data)
          ? newItems.length >= 10
          : Boolean(data.hasMore);

        setLetters((prev) => {
          const existingIds = new Set(prev.map((l) => l.id));
          const uniqueNew = newItems.filter((l) => !existingIds.has(l.id));
          return [...prev, ...uniqueNew];
        });

        setHasMore(nextHasMore);
      }
    } catch (err) {
      console.error("Failed to load more letters:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Refresh feed after sending a letter
  const handleLetterSent = async () => {
    await fetchFilteredLetters(activeFilter, searchQuery);
  };

  return (
    <section
      id="explore"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-24"
    >
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
            Each sheet below was written by someone who couldn&apos;t say it out
            loud — words meant for someone specific, preserved where they will
            never cause them pain.
          </p>
        </div>

        {/* Search bar & Write Invitation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
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
            className="w-full sm:w-auto text-center px-5 py-2.5 rounded-full border border-[#8B0000]/60 bg-[#1f0d0a] hover:bg-[#8B0000] text-[#f4efe6] text-xs font-paper italic transition-all duration-300 shadow-[0_2px_15px_rgba(139,0,0,0.25)] shrink-0 cursor-pointer"
          >
            Leave a letter
          </button>
        </div>
      </div>

      {/* Real Category Filters — Edge-to-edge Swipeable on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto py-5 sm:py-6 scrollbar-none text-xs touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORY_FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => handleFilterSelect(f.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 text-xs font-sans tracking-wide cursor-pointer ${
                isActive
                  ? "bg-[#f7f2e8] text-[#1c1611] font-medium border border-[#ded3bf] shadow-sm"
                  : "bg-[#160f0b] border border-[#2b2016] text-[#a49483] hover:text-[#f4efe6] hover:border-[#423224]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#8a7a69] mb-7 px-1">
        <span>
          Showing {letters.length} of {displayedTotal}{" "}
          {displayedTotal === 1 ? "sheet" : "sheets"} on the desk
        </span>
        {activeFilter === "felt" && (
          <span className="text-[#c06b6b]">Sorted by most felt</span>
        )}
      </div>

      {/* Loading Filter Indicator */}
      {isFetchingFilter && (
        <div className="py-12 text-center text-xs font-paper italic text-[#a49483] flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-ping" />
          <span>Searching the archive...</span>
        </div>
      )}

      {/* 2-Column Aged Paper Cards Grid on Dark Background */}
      {!isFetchingFilter && letters.length === 0 ? (
        <div className="paper-sheet text-center py-16 border border-[#ded4c2] rounded-3xl p-8 max-w-xl mx-auto shadow-2xl">
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
        !isFetchingFilter && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
              {letters.map((letter) => (
                <LetterCard key={letter.id} letter={letter} />
              ))}
            </div>

            {/* Unfold More Letters Button / End of Archive Notice */}
            <div className="mt-14 text-center">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full border border-[#3e2d21] bg-[#160e0a]/85 hover:bg-[#221610] hover:border-[#8B0000]/60 text-[#dfd4c5] hover:text-[#fcf9f5] text-xs font-paper italic tracking-wider transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-ping" />
                      <span>Gently unfolding more letters...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#b85454] font-normal">पत्र और खोलें</span>
                      <span className="opacity-40">•</span>
                      <span>Unfold more letters ↓</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="py-10 max-w-md mx-auto text-center border-t border-[#221912]/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B0000]/60 mx-auto mb-3" />
                  <p className="font-paper italic text-sm text-[#8c7b69] leading-relaxed">
                    You have reached the quietest corner of the desk tonight.
                  </p>
                  <span className="block text-[10px] font-mono tracking-widest uppercase text-[#5a4c3d] mt-1">
                    All preserved letters have been read
                  </span>
                </div>
              )}
            </div>
          </>
        )
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
