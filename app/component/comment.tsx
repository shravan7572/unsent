"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function CommentModal({ letterId }: { letterId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const content = messageRef.current?.value?.trim();
    const username = usernameRef.current?.value?.trim();

    if (!content) {
      setError("Note cannot be empty.");
      return;
    }

    if (content.length > 100) {
      setError("Note must be 100 characters or fewer.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/api/letters/${letterId}/comments`, {
        content,
        username: username || null,
      });
      if (messageRef.current) messageRef.current.value = "";
      if (usernameRef.current) usernameRef.current.value = "";
      setOpen(false);
      router.refresh();
    } catch (err: unknown) {
      console.error("Failed to post note:", err);
      setError("Failed to leave note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="text-xs px-3 py-1 rounded-full border border-[#ded4c3] bg-[#ece5d8] text-[#4a4033] hover:bg-[#e4dcce] transition-colors cursor-pointer"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        Leave Note
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="paper-sheet bg-[#f5f0e8] text-[#231f1c] border border-[#e3dac9] p-6 sm:p-7 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#e4dbcd]">
              <h3 className="font-paper italic font-semibold text-base text-[#1c1815]">
                Leave a Margin Note
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-[#857766] hover:text-[#231f1c] p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {error && (
              <div className="p-2 mb-3 text-xs text-[#8B0000] bg-red-100/70 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#736655] mb-1">
                  Name (optional)
                </label>
                <input
                  ref={usernameRef}
                  type="text"
                  maxLength={40}
                  className="w-full border border-[#d8cdbc] bg-[#fdfbf7] p-2 text-xs rounded-xl focus:outline-hidden focus:border-[#8B0000]"
                  placeholder="Your name or alias"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#736655] mb-1">
                  Note (max 100 chars)
                </label>
                <textarea
                  ref={messageRef}
                  rows={3}
                  maxLength={100}
                  required
                  className="w-full border border-[#d8cdbc] bg-[#fdfbf7] p-2 text-xs rounded-xl resize-none focus:outline-hidden focus:border-[#8B0000]"
                  placeholder="Leave words of comfort..."
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-full border border-[#d8cdbc] text-[#615444] hover:bg-[#ece4d6] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 text-xs rounded-full bg-[#8B0000] hover:bg-[#720000] text-[#fbf8f3] font-medium disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {loading ? "Leaving note..." : "Leave Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}