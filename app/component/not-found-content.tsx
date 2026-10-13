"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TopBar from "@/app/component/top-bar";

interface LostQuote {
  id: number;
  english: string;
  hindi: string;
  sender: string;
  postmark: string;
}

const LOST_QUOTES: LostQuote[] = [
  {
    id: 1,
    english:
      "Some letters are never delivered not because they lacked postage, but because the sender loved too quietly to ever let them go.",
    hindi:
      "कुछ ख़त इसलिए नहीं पहुंचे क्योंकि भेजने वाले ने उन्हें इतने ख़ामोश दिल से चाहा कि कभी छोड़ ही नहीं पाया।",
    sender: "— The Lost Postal Register • डाकघर",
    postmark: "UNSENT • ₹२.५०",
  },
  {
    id: 2,
    english:
      "I wrote your name on an envelope I never had the courage to seal. It sits in the dark of my drawer, quietly loving you forever.",
    hindi:
      "एक लिफ़ाफ़े पर तेरा नाम लिखा था, जिसे बंद करने की हिम्मत कभी न हुई। वो आज भी किसी कोने में खामोशी से तुझसे मोहब्बत करता है।",
    sender: "— Return to Sender • अनकहा",
    postmark: "UNDELIVERED",
  },
  {
    id: 3,
    english:
      "Not all things lost are meant to be found. Some words find their only peace in remaining unspoken.",
    hindi:
      "हर खोई हुई चीज़ का मिलना लाज़िमी नहीं। कुछ अल्फ़ाज़ों का सुकून सिर्फ़ अनकहे रहने में ही है।",
    sender: "— The Quiet Hours • रात के तीन बजे",
    postmark: "MIDNIGHT DESK",
  },
  {
    id: 4,
    english:
      "The saddest letters are not the ones with bad news, but the ones that held the deepest truth and were left on the bedside table.",
    hindi:
      "सबसे उदास वो ख़त नहीं होते जिनमें बुरी ख़बर हो, बल्कि वो होते हैं जिनमें सच था और वो कभी किसी तक पहुंचे ही नहीं।",
    sender: "— Unaddressed Sheet • बिना पते का ख़त",
    postmark: "LOST TRANSIT",
  },
  {
    id: 5,
    english:
      "Maybe we didn't lose each other in an argument. Maybe we just slipped through the cracks of things we were too proud to write down.",
    hindi:
      "शायद हम किसी झगड़े में नहीं बिछड़े। बस उन बातों के बीच खो गए जो हम लिखने से कतराते रहे।",
    sender: "— A Passenger on the Platform • मुसाफ़िर",
    postmark: "NO RETURN",
  },
  {
    id: 6,
    english:
      "If this page is lost, perhaps it is because the person who was supposed to read it has already moved on. And that is okay.",
    hindi:
      "अगर यह पन्ना खो गया है, तो शायद इसलिए कि जिसे इसे पढ़ना था वो आगे बढ़ चुका है। और ये भी ठीक है।",
    sender: "— An Unsent Sanctuary Note",
    postmark: "PEACE • शांति",
  },
];

export default function NotFoundContent() {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const activeQuote = LOST_QUOTES[activeQuoteIndex];

  const handleNextQuote = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % LOST_QUOTES.length);
      setIsFlipping(false);
    }, 180);
  };

  return (
    <div className="min-h-screen bg-[#0d0a08] text-[#f4efe6] flex flex-col selection:bg-[#4a120e] selection:text-[#f8d7da] relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 right-0 h-[650px] sm:h-[750px] z-0 overflow-hidden pointer-events-none select-none opacity-30">
        <Image
          src="/not-found.jpg"
          alt="A lost letter in the twilight sky"
          fill
          priority
          unoptimized
          className="object-cover object-center filter blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a08]/60 via-[#0d0a08]/85 to-[#0d0a08]" />
      </div>

      {/* Floating Top Bar for seamless sanctuary navigation */}
      <TopBar />

      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20 sm:pb-28 flex flex-col items-center text-center">
        {/* Poetic Postal Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#422c1e]/90 bg-[#160e0a]/85 backdrop-blur-md text-[#d5c5b5] text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] mb-4 sm:mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-pulse" />
          <span>डाक विभाग • 404 • Undelivered Dispatch</span>
        </div>

        {/* The Solitary Return-to-Sender Envelope Artwork */}
        <div className="relative w-full max-w-lg sm:max-w-xl mx-auto rounded-3xl overflow-hidden border border-[#3d271c]/80 shadow-[0_16px_50px_rgba(0,0,0,0.85)] group mb-8 sm:mb-10 bg-[#120b08]">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src="/not-found.jpg"
              alt="A solitary watercolor letter stamped Return to Sender floating in the starry twilight sky"
              fill
              priority
              unoptimized
              className="object-cover object-center transition-transform duration-700 group-hover:scale-103"
            />
            {/* Subtle inner vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a08]/70 via-transparent to-transparent pointer-events-none" />

            {/* Vintage Postmark Stamp Badge in Top Corner */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-[#120b08]/85 backdrop-blur-md border border-[#422d20] px-3 py-1.5 rounded-full shadow-md pointer-events-none">
              <span className="font-mono text-[9px] sm:text-[10px] text-[#e0cfbe] tracking-widest uppercase">
                डाक • ४०४ • Lost in Transit
              </span>
            </div>
          </div>
        </div>

        {/* 404 Headline */}
        <h1 className="font-devanagari text-4xl sm:text-5xl md:text-6xl text-[#fcf8f2] tracking-wide mb-3 leading-tight font-normal drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
          This letter got lost.
        </h1>

        {/* Hindi Secondary Line */}
        <p className="font-devanagari text-sm sm:text-base text-[#b85454] tracking-wide mb-3 font-normal">
          यह ख़त कभी मंज़िल तक नहीं पहुंच सका...
        </p>

        {/* User's Exact Specified Copy */}
        <p className="font-paper italic text-lg sm:text-2xl text-[#ece0d0] max-w-lg mx-auto leading-relaxed mb-8 sm:mb-10 font-light drop-shadow-sm px-2">
          The page you’re looking for was never delivered — or maybe it was never meant to arrive.
        </p>

        {/* Action Invitations */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-md mx-auto mb-16 sm:mb-20">
          {/* User's Exact Action: ← Go back home */}
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#8B0000] hover:bg-[#720000] text-[#fcf9f5] text-xs font-paper italic tracking-wider transition-all duration-300 border border-[#a82525]/70 shadow-[0_2px_16px_rgba(139,0,0,0.35)] hover:shadow-[0_4px_24px_rgba(139,0,0,0.55)] cursor-pointer text-center"
          >
            ← Go back home
          </Link>

          {/* Secondary Action: Leave an unsent letter */}
          <Link
            href="/write"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#160e0a]/85 hover:bg-[#221610] text-[#ded2c3] hover:text-[#fcf9f5] text-xs font-paper italic tracking-wider transition-all duration-300 border border-[#3e2d21] shadow-xs cursor-pointer text-center backdrop-blur-sm"
          >
            Leave an unsent letter
          </Link>

          {/* Explore archive */}
          <Link
            href="/#explore"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-transparent hover:bg-[#1a120c] text-[#a89785] hover:text-[#f4efe6] text-xs font-paper italic tracking-wider transition-all duration-300 cursor-pointer text-center"
          >
            Explore the archive ↓
          </Link>
        </div>

        {/* ── LOST LETTER QUOTES SECTION ── */}
        <section className="w-full max-w-2xl mx-auto pt-10 sm:pt-14 border-t border-[#261b14]/70">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-8 h-px bg-[#422c1e]" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#a89988]">
              गुमशुदा ख़त • Words Left in the Mailbag
            </span>
            <span className="w-8 h-px bg-[#422c1e]" />
          </div>

          {/* Interactive Aged Paper Sheet Quote Card */}
          <article className="paper-sheet paper-margin-rule relative rounded-2xl p-6 sm:p-8 border border-[#ded3bd] text-left shadow-2xl transition-all duration-300">
            {/* Top Airmail Striping Accent */}
            <div className="h-1 airmail-edge rounded-t-xl -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-5 sm:mb-6" />

            {/* Vintage Postmark Header */}
            <div className="flex items-center justify-between border-b border-[#dfd4c1] pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[8.5px] uppercase tracking-widest text-[#8B0000] font-bold">
                  डाक विभाग
                </span>
                <span className="text-[#a89988] text-[9px]">•</span>
                <span className="font-mono text-[8.5px] uppercase tracking-wider text-[#786756]">
                  {activeQuote.postmark}
                </span>
              </div>
              <span className="font-mono text-[9px] text-[#8a7968]">
                Lost Dispatch #{activeQuote.id} of {LOST_QUOTES.length}
              </span>
            </div>

            {/* Quote Body with smooth transition */}
            <div
              className={`transition-opacity duration-200 ${
                isFlipping ? "opacity-0" : "opacity-100"
              }`}
            >
              {/* Hindi Translation */}
              <p className="font-devanagari text-base sm:text-[18px] text-[#241c16] leading-[1.85] mb-3.5 pl-3 sm:pl-4 border-l-2 border-[#8B0000]/40">
                &ldquo;{activeQuote.hindi}&rdquo;
              </p>

              {/* English Literary Body */}
              <p className="font-paper italic text-[16px] sm:text-[17.5px] text-[#3d3228] leading-[1.75] pl-3 sm:pl-4">
                &ldquo;{activeQuote.english}&rdquo;
              </p>

              {/* Signature */}
              <div className="pt-4 mt-5 border-t border-[#dfd4c1] flex items-center justify-between">
                <span className="font-handwriting text-base sm:text-[19px] text-[#524133]">
                  {activeQuote.sender}
                </span>
                <span className="font-mono text-[9px] text-[#91816e] uppercase tracking-wider">
                  Undelivered
                </span>
              </div>
            </div>

            {/* Cycler Button */}
            <div className="mt-6 pt-4 border-t border-[#ded4c2] flex items-center justify-between">
              <span className="text-[11px] font-paper italic text-[#877665]">
                Perhaps another lost letter will bring you solace.
              </span>
              <button
                type="button"
                onClick={handleNextQuote}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ebdcc8] hover:bg-[#ded0bc] text-[#382b20] font-paper italic text-xs border border-[#cfc0ab] transition-colors cursor-pointer shadow-xs"
              >
                <span>दूसरा ख़त पढ़ें</span>
                <span className="opacity-50">•</span>
                <span>Next quote ↺</span>
              </button>
            </div>
          </article>

          {/* Quiet Three-quote Grid for Browsing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
            {LOST_QUOTES.filter((q) => q.id !== activeQuote.id)
              .slice(0, 2)
              .map((quote) => (
                <div
                  key={quote.id}
                  className="p-4 sm:p-5 rounded-xl border border-[#2b1f16] bg-[#140e0a]/80 text-left"
                >
                  <p className="font-paper italic text-xs sm:text-[13.5px] text-[#ded2c3] leading-relaxed mb-2.5">
                    &ldquo;{quote.english}&rdquo;
                  </p>
                  <span className="font-handwriting text-sm text-[#a89582] block">
                    {quote.sender}
                  </span>
                </div>
              ))}
          </div>
        </section>
      </main>

      {/* Quiet Atelier Footer */}
      <footer className="relative z-10 w-full py-8 text-center border-t border-[#1f1712] text-xs text-[#7d6f5e] font-paper italic">
        <p>अनकहा • Unsent — For all the letters that found peace in silence.</p>
      </footer>
    </div>
  );
}
