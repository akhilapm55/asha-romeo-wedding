"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function KeyGate({ invalid }: { invalid?: boolean }) {
  const [key, setKey] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) router.push(`/guest-dashboard?key=${encodeURIComponent(key.trim())}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-6">
      <form
        onSubmit={submit}
        className="glass w-full max-w-sm rounded-3xl px-8 py-12 text-center"
      >
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-palm text-ivory">
          <Lock size={22} />
        </div>
        <h1 className="font-serif text-3xl text-palm">Private Access</h1>
        <p className="mt-2 font-sans text-sm text-ink-soft">
          Enter the access key to view the guest dashboard.
        </p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Access key"
          autoFocus
          className="mt-6 w-full rounded-xl border border-gold/30 bg-white/70 px-4 py-3 text-center font-sans text-sm outline-none focus:border-gold"
        />
        {invalid && (
          <p className="mt-3 font-sans text-xs text-terracotta">
            That key didn&apos;t work. Please try again.
          </p>
        )}
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-palm py-3 font-sans text-xs uppercase tracking-wide2 text-ivory transition hover:bg-palm-dark"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
