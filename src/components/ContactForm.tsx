"use client";

import { useState } from "react";
import { Alert, Button, Input, TextArea } from "@/components/ui";

/** Posts to the optional FastAPI backend (/api/contact). Only rendered when NEXT_PUBLIC_API_URL is configured. */
export default function ContactForm({ apiUrl }: { apiUrl: string }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      subject: String(fd.get("subject") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      website: String(fd.get("website") || ""), // honeypot
    };
    if (body.message.length < 10) return setError("Please write a message of at least 10 characters.");
    setError("");
    setState("sending");
    try {
      const res = await fetch(`${apiUrl}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.detail === "string" ? data.detail : "The message could not be sent.");
      }
      setState("ok");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setState("error");
      setError((err as Error).message || "Network error. Please try again or use email.");
    }
  }

  if (state === "ok") return <Alert kind="success">Thank you — your message has been sent.</Alert>;

  return (
    <form onSubmit={submit} className="not-prose space-y-4 rounded-xl border border-border bg-surface p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" name="name" required maxLength={100} autoComplete="name" />
        <Input label="Email (so we can reply)" name="email" type="email" required maxLength={200} autoComplete="email" />
      </div>
      <Input label="Subject" name="subject" maxLength={150} />
      <TextArea label="Message" name="message" required minLength={10} maxLength={5000} className="font-sans" />
      <div aria-hidden className="hidden">
        <label>Leave empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {error && <Alert kind="error">{error}</Alert>}
      <Button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</Button>
    </form>
  );
}
