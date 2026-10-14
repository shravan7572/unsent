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
      {/* Mobile Background Artwork (Vertical Portrait 9:16) */}
      <div className="sm:hidden absolute top-0 left-0 right-0 h-[920px] z-0 overflow-hidden pointer-events-none select-none">
        <Image
          src="/hero-illustration-mobile.png"
          alt="Two souls with unsent letters"
          fill
          priority
          unoptimized
          className="object-cover object-top"
          style={{
            filter: "brightness(1.15) contrast(1.04) saturate(1.12)",
          }}
        />

        {/* Minimal top gradient for title & status legibility — leaves the boy & girl 100% clear & bright */}
        <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#0d0a08]/60 via-[#0d0a08]/20 to-transparent pointer-events-none" />

        {/* Seamless bottom fade into #0d0a08 starting below the characters' ledge */}
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[#0d0a08] from-30% via-[#0d0a08]/85 via-65% to-transparent pointer-events-none" />

        {/* Watermark guard in bottom right corner */}
        <div className="absolute bottom-0 right-0 w-36 h-36 bg-gradient-to-tl from-[#0d0a08] via-[#0d0a08]/90 to-transparent pointer-events-none" />
      </div>

      {/* Desktop Background Artwork (Horizontal Landscape 16:9) */}
      <div className="hidden sm:block absolute top-0 left-0 right-0 h-[800px] sm:h-[900px] md:h-[960px] z-0 overflow-hidden pointer-events-none select-none">
        <Image
          src="/hero-illustration.jpg"
          alt="Two souls with unsent letters"
          fill
          priority
          unoptimized
          className="object-cover sm:object-[center_18%]"
          style={{
            filter: "brightness(1.08) contrast(1.03) saturate(1.08)",
          }}
        />

        {/* Soft, delicate center vignette for text clarity while keeping the art bright and luminous */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_50%_at_50%_40%,rgba(13,10,8,0.52)_0%,rgba(13,10,8,0.12)_65%,transparent_100%)] pointer-events-none" />

        {/* Minimal top gradient so stars and night sky extend all the way behind the floating navbar */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0d0a08]/30 to-transparent pointer-events-none" />

        {/* Smooth bottom fade into #0d0a08 */}
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[#0d0a08] from-25% via-[#0d0a08]/85 via-65% to-transparent pointer-events-none" />
      </div>

      {/* Floating Top Bar */}
      <TopBar />

      {/* Hero Section — Centered Between Both Souls, Pure & Minimal */}
      <section className="relative z-10 px-4 pt-5 sm:pt-16 md:pt-20 pb-12 sm:pb-32 max-w-md sm:max-w-lg md:max-w-xl mx-auto text-center">
        {/* Poetic Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#422c1e]/90 bg-[#160e0a]/85 backdrop-blur-md text-[#d5c5b5] text-[9.5px] sm:text-[11px] font-mono uppercase tracking-[0.14em] sm:tracking-[0.2em] mb-2.5 sm:mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000]" />
          <span>दिल की बातें जो कभी भेजी नहीं गईं</span>
        </div>

        {/* Hindi Hero Heading: "अनकहा" — Centered Calligraphic Serif in the Open Sky */}
        <h1 className="font-devanagari text-5xl sm:text-7xl md:text-8xl tracking-wide text-[#fcf8f2] select-none leading-none mb-1.5 sm:mb-4 drop-shadow-[0_8px_36px_rgba(0,0,0,0.98)] font-normal">
          अनकहा
        </h1>

        {/* English Subtitle — High-End Garamond Serif with luminous rose bullet */}
        <p className="text-base sm:text-2xl md:text-[26px] font-paper italic text-[#ece0d0] tracking-wide mb-1.5 sm:mb-3 font-light drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]">
          Unsent <span className="text-[#e25555] font-normal mx-1.5 sm:mx-2 drop-shadow-[0_0_8px_rgba(226,85,85,0.5)]">•</span> Say what you never could.
        </p>

        {/* Poetic Mission Statement / Quote — Lifted up into the sky with titles */}
        <p className="text-xs sm:text-[15px] font-paper text-[#e4d7c6] max-w-sm sm:max-w-md mx-auto leading-relaxed mb-0 font-light drop-shadow-[0_2px_14px_rgba(0,0,0,0.98)] px-1 sm:px-2">
          Some things are better left unsaid — but they still need to be said somewhere.
          <span className="block text-[#c4b5a7] mt-0.5 text-xs font-paper italic">
            An anonymous sanctuary for heartbreaks and words never meant to arrive.
          </span>
        </p>

        {/* Dedicated Window for the Two Souls — Leaves the characters and their letters 100% visible */}
        <div className="h-[370px] xs:h-[400px] sm:h-0 w-full pointer-events-none" />

        {/* Action Invitations — Clean Atelier Buttons sitting below the characters on the dark ledge */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 max-w-xs sm:max-w-none mx-auto w-full pt-1 sm:pt-0">
          <Link
            href="/write"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#8B0000] hover:bg-[#720000] text-[#fcf9f5] text-xs font-paper italic tracking-wider transition-all duration-300 border border-[#a82525]/70 shadow-[0_2px_16px_rgba(139,0,0,0.35)] hover:shadow-[0_4px_22px_rgba(139,0,0,0.5)] cursor-pointer text-center"
          >
            Leave an unsent letter
          </Link>

          <a
            href="#explore"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#241712]/90 hover:bg-[#322018] text-[#f4efe6] hover:text-[#ffffff] text-xs font-paper italic tracking-wider transition-all duration-300 border border-[#6b5240] hover:border-[#96775d] shadow-[0_2px_14px_rgba(0,0,0,0.5)] cursor-pointer text-center backdrop-blur-sm"
          >
            Read the unspoken ↓
          </a>
        </div>

        {/* Quiet Minimal Stats Ticker — Clean Hairline, No Extra Boxes */}
        <div className="flex items-center justify-center gap-6 sm:gap-12 mt-6 sm:mt-16 pt-4 sm:pt-6 border-t border-[#2a1d15]/50 text-xs text-[#9d8d7b] max-w-md mx-auto">
          <div>
            <p className="font-mono text-sm sm:text-base font-semibold text-[#fcf8f2] drop-shadow-sm">
              {totalLetters}
            </p>
            <p className="text-[9px] sm:text-[10px] tracking-wider uppercase opacity-75 mt-0.5">
              Letters Preserved
            </p>
          </div>
          <div className="w-px h-6 bg-[#2b1f18]" />
          <div>
            <p className="font-mono text-sm sm:text-base font-semibold text-[#fcf8f2] drop-shadow-sm">
              {totalFelt}
            </p>
            <p className="text-[9px] sm:text-[10px] tracking-wider uppercase opacity-75 mt-0.5">
              Hearts Felt
            </p>
          </div>
          <div className="w-px h-6 bg-[#2b1f18]" />
          <div>
            <p className="font-mono text-sm sm:text-base font-semibold text-[#fcf8f2] drop-shadow-sm">
              100%
            </p>
            <p className="text-[9px] sm:text-[10px] tracking-wider uppercase opacity-75 mt-0.5">
              Anonymous
            </p>
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

        <p className="font-paper italic text-xs sm:text-[13px] text-[#938270] max-w-sm mx-auto mb-5 leading-relaxed">
          &ldquo;Some people build monuments out of stone. I write code in the quiet hours, hoping you might stumble upon it one day.&rdquo;
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
