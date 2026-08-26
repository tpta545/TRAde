"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-trade-red px-4 py-3 text-sm font-medium text-trade-white hover:bg-trade-red-dark disabled:opacity-60"
    >
      {pending ? "Enviando…" : children}
    </button>
  );
}
