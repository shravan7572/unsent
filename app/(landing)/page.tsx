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
  let totalLetters = 0;
  let totalFelt = 0;

  try {
    const [count, feltSum, dbLetters] = await Promise.all([
      prisma.letter.count(),
      prisma.letter.aggregate({
        _sum: { feltThis: true },
      }),
      prisma.letter.findMany({
        take: 10,
        include: {
          comments: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      }),
    ]);

    totalLetters = count;
    totalFelt = feltSum._sum.feltThis || 0;
    letters = dbLetters;
  } catch (err) {
    console.warn("Could not query database directly:", err);
    letters = [];
  }

  return (
    <div className="min-h-screen bg-[#0d0a08] text-[#f4efe6] flex flex-col selection:bg-[#4a120e] selection:text-[#f8d7da] relative overflow-x-hidden">
      {/* Background Artwork — Clean, Minimal, Just like Saloon Website */}
      <div className="absolute top-0 left-0 right-0 h-[880px] sm:h-[1040px] z-0 overflow-hidden pointer-events-none select-none">
        <Image
          src="/hero-illustration.jpg"
          alt="Unsent background"
          fill
          priority
          unoptimized
          className="object-cover object-[center_26%]"
          style={{
            filter: "sepia(0.25) saturate(1.32) hue-rotate(-22deg) brightness(0.9) contrast(1.08)",
          }}
        />

        {/* Warm red theme tint */}
        <div className="absolute inset-0 bg-[#8B0000]/22 mix-blend-color pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_52%_46%,rgba(139,0,0,0.38)_0%,transparent_68%)] mix-blend-screen pointer-events-none" />

        {/* Soft top gradient under top bar */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0d0a08]/90 via-[#0d0a08]/40 to-transparent pointer-events-none" />

        {/* Smooth bottom fade into #0d0a08 */}
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[#0d0a08] via-[#0d0a08]/85 to-transparent pointer-events-none" />
      </div>

      {/* Top Bar */}
      <TopBar />

      {/* Hero Section — Balanced Vertical Rhythm & Mobile-Friendly Polish */}
      <section className="relative z-10 px-4 pt-10 sm:pt-20 pb-20 sm:pb-40 max-w-4xl mx-auto text-center">
        {/* Poetic Tag */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#422c1e]/90 bg-[#160e0a]/80 backdrop-blur-md text-[#d5c5b5] text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] sm:tracking-[0.2em] mb-4 sm:mb-5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] " />
          <span>दिल की बातें जो कभी भेजी नहीं गईं</span>
        </div>

        {/* Hindi Hero Heading: "अनकहा" — Classical Refined Serifs */}
        <h1 className="font-devanagari text-6xl sm:text-8xl md:text-9xl tracking-wide text-[#fcf8f2] select-none leading-none mb-3 drop-shadow-[0_6px_35px_rgba(0,0,0,0.95)] font-normal">
          अनकहा
        </h1>

        {/* English Subtitle — High-End Garamond Serif */}
        <p className="text-xl sm:text-2xl md:text-3xl font-paper italic text-[#ece0d0] tracking-wide mb-3 sm:mb-4 font-light drop-shadow-[0_3px_15px_rgba(0,0,0,0.9)]">
          Unsent <span className="text-[#8B0000] font-normal mx-2">•</span> Say what you never could.
        </p>

        {/* Poetic Mission Statement — High Contrast & Clear Visibility */}
        <p className="text-xs sm:text-base font-paper text-[#e4d7c6] max-w-lg mx-auto leading-relaxed mb-7 sm:mb-8 font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] px-2">
          Some things are better left unsaid — but they still need to be said somewhere.
          An anonymous sanctuary for heartbreaks and words never meant to arrive.
        </p>

        {/* Action Invitations — Clean Touch Targets on Mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto w-full">
          <Link
            href="/write"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#8B0000] hover:bg-[#720000] text-[#fcf9f5] text-xs font-paper italic tracking-wider transition-all duration-300 border border-[#a82525]/70 shadow-[0_2px_14px_rgba(139,0,0,0.3)] hover:shadow-[0_4px_18px_rgba(139,0,0,0.45)] cursor-pointer text-center"
          >
            Leave an unsent letter
          </Link>

          <a
            href="#explore"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#160e0a]/80 hover:bg-[#221610] text-[#dcd0c0] hover:text-[#fcf9f5] text-xs font-paper italic tracking-wider transition-all duration-300 border border-[#3e2d21] shadow-xs cursor-pointer text-center"
          >
            Read the unspoken ↓
          </a>
        </div>

        {/* Floating Man Area in Background + Perfectly Visible Quote Capsule */}
        <div className="pt-16 sm:pt-40 max-w-lg mx-auto px-1 sm:px-0">
          {/* Luminous, High-Visibility Quote Capsule */}
          <div className="py-3.5 px-4 sm:py-4 sm:px-6 rounded-2xl bg-[#140c08]/80 backdrop-blur-md border border-[#3d271c]/80 shadow-[0_6px_25px_rgba(0,0,0,0.6)]">
            <p className="text-xs sm:text-[15px] font-paper italic text-[#f2e7d7] leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              &ldquo;Some people build monuments out of stone. I write code in the quiet hours, hoping you might stumble upon it one day.&rdquo;
            </p>
            <span className="block text-[9.5px] sm:text-[10px] font-mono tracking-widest uppercase text-[#b85454] mt-2">
              — For the one who slipped away
            </span>
          </div>

          {/* Clean, Polished Stats Ticker */}
          <div className="flex items-center justify-center gap-4 sm:gap-14 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#261c16]/80 text-xs text-[#a89988]">
            <div>
              <p className="font-mono text-sm sm:text-base font-semibold text-[#fcf8f2]">
                {totalLetters}
              </p>
              <p className="text-[9px] sm:text-[10px] tracking-wider uppercase opacity-80 mt-0.5">
                Letters Preserved
              </p>
            </div>
            <div className="w-px h-6 sm:h-7 bg-[#2b1f18]" />
            <div>
              <p className="font-mono text-sm sm:text-base font-semibold text-[#fcf8f2]">
                {totalFelt}
              </p>
              <p className="text-[9px] sm:text-[10px] tracking-wider uppercase opacity-80 mt-0.5">
                Hearts Felt
              </p>
            </div>
            <div className="w-px h-6 sm:h-7 bg-[#2b1f18]" />
            <div>
              <p className="font-mono text-sm sm:text-base font-semibold text-[#fcf8f2]">
                100%
              </p>
              <p className="text-[9px] sm:text-[10px] tracking-wider uppercase opacity-80 mt-0.5">
                Anonymous
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Explore Section */}
      <main className="flex-1 relative z-10">
        <LettersFeed initialLetters={letters} totalCount={totalLetters} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#211a14] py-12 sm:py-16 px-4 text-center text-xs text-[#786b5b] relative z-10">
        <p className="font-devanagari text-xl text-[#c9bea9] mb-1.5 tracking-wide">
          अनकहा
        </p>
        <p className="font-paper italic text-[#a69885] text-sm mb-3">
          Say what you never could.
        </p>

        {/* User's Devotion / Final Act of Love */}
        <div className="max-w-md mx-auto my-6 sm:my-7 p-4 sm:p-5 rounded-2xl border border-[#2e2118] bg-[#140e0b]/90 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
          <p className="font-paper italic text-sm sm:text-[15px] text-[#ded3c2] leading-relaxed">
            &ldquo;As a final act of my love, I will keep making websites for her.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-[9.5px] sm:text-[10px] font-mono tracking-widest uppercase text-[#8B0000]">
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
