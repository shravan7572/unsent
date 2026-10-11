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
    <header className="relative z-40 w-full px-4 sm:px-8 pt-4 sm:pt-6 pb-2 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-[#9c8e7c]">
        {/* Clock & Sanctuary status indicator */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span
            className="font-mono text-[#f4efe6] tracking-wider sm:tracking-widest text-[10px] sm:text-[11px] shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
            suppressHydrationWarning
          >
            {currentTime || "03:00:00 AM"}
          </span>
          <span className="text-[#5a4838] hidden xs:inline sm:inline drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            |
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[#c4b5a5] text-[11px] truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] shrink-0  shadow-[0_0_8px_#8B0000]" />
            <span className="font-paper italic truncate">
              Built in the quiet hours for someone who left
            </span>
          </span>
        </div>

        {/* Nav Actions */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <a
            href="#explore"
            className="hover:text-[#f4efe6] transition-colors hidden md:inline-block font-paper italic text-xs text-[#c4b5a5] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
          >
            Explore Archive
          </a>
          <Link
            href="/write"
            className="px-4 py-1.5 rounded-full border border-[#8B0000]/70 bg-[#8B0000] hover:bg-[#720000] text-[#fcf9f5] transition-all duration-300 font-paper italic text-xs shadow-[0_2px_14px_rgba(139,0,0,0.4)]"
          >
            Leave a letter
          </Link>
        </div>
      </div>
    </header>
  );
}
