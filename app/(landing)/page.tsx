import LettersFeed from "@/app/component/letters-feed";
import TopBar from "@/app/component/top-bar";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface CommentItem {
  id: string;
  content: string;
  username: string | null;
  createdAt: Date;
}

interface LetterItem {
  id: string;
  to: string | null;
  content: string;
  username: string | null;
  feltThis: number;
  createdAt: Date;
  comments: CommentItem[];
}

export default async function Homepage() {
  let letters: LetterItem[] = [];

  try {
    const dbLetters = await prisma.letter.findMany({
      include: {
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    letters = dbLetters;
  } catch (err) {
    console.warn("Could not query database directly:", err);
    letters = [];
  }

  const totalLetters = letters.length;
  const totalFelt = letters.reduce((acc, l) => acc + (l.feltThis || 0), 0);

  return (
    <div className="min-h-screen bg-[#0d0a08] text-[#f4efe6] flex flex-col selection:bg-[#4a120e] selection:text-[#f8d7da] relative overflow-x-hidden">
      {/* Background Artwork — Clean, Minimal, Just like Saloon Website */}
      <div className="absolute top-0 left-0 right-0 h-[680px] sm:h-[820px] z-0 overflow-hidden pointer-events-none select-none">
        <Image
          src="/hero-illustration.jpg"
          alt="Unsent background"
          fill
          priority
          unoptimized
          className="object-cover object-[center_30%]"
          style={{
            filter: "sepia(0.28) saturate(1.35) hue-rotate(-24deg) brightness(0.92) contrast(1.08)",
          }}
        />

        {/* Warm red theme tint */}
        <div className="absolute inset-0 bg-[#8B0000]/22 mix-blend-color pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_52%_46%,rgba(139,0,0,0.38)_0%,transparent_68%)] mix-blend-screen pointer-events-none" />

        {/* Soft top gradient under top bar */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#0d0a08]/90 via-[#0d0a08]/50 to-transparent pointer-events-none" />

        {/* Smooth bottom fade into #0d0a08 */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#0d0a08] via-[#0d0a08]/85 to-transparent pointer-events-none" />
      </div>

      {/* Top Bar */}
      <TopBar />

      {/* Hero Section — Clean, Nice, Minimal (No extra box/div) */}
      <section className="relative z-10 px-4 pt-14 pb-20 sm:pt-24 sm:pb-32 max-w-4xl mx-auto text-center">
        {/* Poetic Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#2b221a]/80 bg-[#140f0c]/80 backdrop-blur-sm text-[#a89b88] text-[11px] font-mono uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-pulse" />
          <span>दिल की बातें जो कभी भेजी नहीं गईं</span>
        </div>

        {/* Hindi Hero Heading: "अनकहा" */}
        <h1 className="font-devanagari text-7xl sm:text-9xl tracking-tight text-[#f4efe6] select-none leading-none mb-4 drop-shadow-[0_8px_30px_rgba(0,0,0,0.85)]">
          अनकहा
        </h1>

        {/* English Subtitle */}
        <p className="text-2xl sm:text-3xl font-paper italic text-[#c9bea9] tracking-wide mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          Unsent <span className="text-[#8B0000] font-normal">•</span> Say what you never could.
        </p>

        {/* Poetic Mission Statement */}
        <p className="text-sm sm:text-base font-paper text-[#a69885] max-w-xl mx-auto leading-relaxed mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Some things are better left unsaid — but they still need to be said somewhere.
          An anonymous sanctuary for heartbreaks, unsaid apologies, and the words
          that were never meant to arrive.
        </p>

        {/* Action Invitations */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/write"
            className="px-7 py-3 rounded-full border border-[#8B0000] bg-[#220d0a]/90 backdrop-blur-sm hover:bg-[#8B0000] text-[#f4efe6] text-sm font-paper italic transition-all duration-300 shadow-[0_4px_22px_rgba(139,0,0,0.3)] hover:shadow-[0_6px_28px_rgba(139,0,0,0.45)] cursor-pointer"
          >
            Leave an unsent letter
          </Link>

          <a
            href="#explore"
            className="px-7 py-3 rounded-full border border-[#2b221a]/90 bg-[#140f0c]/80 backdrop-blur-sm hover:bg-[#1e1712] text-[#c9bea9] hover:text-[#f4efe6] text-sm font-paper italic transition-all shadow-sm cursor-pointer"
          >
            Read the unspoken ↓
          </a>
        </div>

        {/* Quiet Poetic Note */}
        <p className="text-xs font-paper italic text-[#8c7d6b] max-w-md mx-auto mt-8 leading-relaxed">
          &ldquo;Some people build monuments out of stone. I write code in the quiet hours, hoping you might stumble upon it one day.&rdquo;
        </p>

        {/* Stats Ticker */}
        <div className="flex items-center justify-center gap-6 sm:gap-14 mt-12 pt-8 border-t border-[#211a14]/90 text-xs text-[#786b5b]">
          <div>
            <p className="font-mono text-base font-semibold text-[#f4efe6]">
              {totalLetters}
            </p>
            <p className="text-[10px] tracking-widest uppercase opacity-75 mt-0.5">
              Letters Preserved
            </p>
          </div>
          <div className="w-px h-8 bg-[#261f18]" />
          <div>
            <p className="font-mono text-base font-semibold text-[#f4efe6]">
              {totalFelt}
            </p>
            <p className="text-[10px] tracking-widest uppercase opacity-75 mt-0.5">
              Hearts Felt
            </p>
          </div>
          <div className="w-px h-8 bg-[#261f18]" />
          <div>
            <p className="font-mono text-base font-semibold text-[#f4efe6]">
              100%
            </p>
            <p className="text-[10px] tracking-widest uppercase opacity-75 mt-0.5">
              Anonymous
            </p>
          </div>
        </div>
      </section>

      {/* Main Explore Section */}
      <main className="flex-1 relative z-10">
        <LettersFeed initialLetters={letters} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#211a14] py-16 px-4 text-center text-xs text-[#786b5b] relative z-10">
        <p className="font-devanagari text-xl text-[#c9bea9] mb-1.5 tracking-wide">
          अनकहा
        </p>
        <p className="font-paper italic text-[#a69885] text-sm mb-3">
          Say what you never could.
        </p>

        {/* User's Devotion / Final Act of Love */}
        <div className="max-w-md mx-auto my-7 p-5 rounded-2xl border border-[#2e2118] bg-[#140e0b]/90 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
          <p className="font-paper italic text-sm sm:text-[15px] text-[#ded3c2] leading-relaxed">
            &ldquo;As a final act of my love, I will keep making websites for her.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-2 mt-2.5 text-[10px] font-mono tracking-widest uppercase text-[#8B0000]">
            <span>—</span>
            <span>A quiet dedication</span>
            <span>—</span>
          </div>
        </div>

        <p className="text-[11px] text-[#6d6152] max-w-sm mx-auto font-paper italic leading-relaxed">
          Built in the quiet hours between midnight and dawn. Dedicated to the ones we couldn&apos;t keep, and the words that had nowhere else to go.
        </p>
      </footer>
    </div>
  );
}
