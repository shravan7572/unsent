"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0d0a08]/75 border-b border-[#211a14]/60 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-xs text-[#9c8e7c]">
        {/* Clock & Sanctuary status indicator */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span
            className="font-mono text-[#f4efe6]/85 tracking-wider sm:tracking-widest text-[10px] sm:text-[11px] shrink-0"
            suppressHydrationWarning
          >
            {currentTime || "03:00:00 AM"}
          </span>
          <span className="text-[#382d22] hidden xs:inline sm:inline">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[#9c8e7c] text-[11px] truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] shrink-0" />
            <span className="font-paper italic text-[#b5a693] truncate">
              Built in the quiet hours for someone who left
            </span>
          </span>
        </div>

        {/* Nav Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <a
            href="#explore"
            className="hover:text-[#f4efe6] transition-colors hidden md:inline-block font-paper italic text-xs text-[#9c8e7c]"
          >
            Explore Archive
          </a>
          <Link
            href="/write"
            className="px-3.5 sm:px-4 py-1.5 rounded-full border border-[#8B0000]/60 bg-[#1f0d0a] hover:bg-[#8B0000] text-[#f4efe6] transition-all duration-300 font-paper italic text-xs shadow-xs"
          >
            Leave a letter
          </Link>
        </div>
      </div>
    </header>
  );
}

