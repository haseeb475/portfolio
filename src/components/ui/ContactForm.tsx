"use client";

import { AnimatePresence, m } from "motion/react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useId, useState } from "react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Contact form.
 *
 * - If NEXT_PUBLIC_CONTACT_ENDPOINT is set (e.g. a Formspree form URL like
 *   https://formspree.io/f/xxxxxxx), the message is posted there and lands in your inbox.
 * - Otherwise it opens the visitor's email app with everything filled in, addressed to you.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

type Fields = { name: string; email: string; phone: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "opened" | "error";

const EMPTY: Fields = { name: "", email: "", phone: "", message: "" };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Please tell me your name.";
  if (!f.email.trim()) e.email = "I'll need an email to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "That email doesn't look quite right.";
  if (f.phone.trim() && !/^[+()\d\s-]{6,}$/.test(f.phone.trim())) e.phone = "Numbers, spaces and + only, please.";
  if (f.message.trim().length < 10) e.message = "A little more detail would help.";
  return e;
}

export function ContactForm({ to }: { to: string }) {
  const uid = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if ((form.elements.namedItem("company") as HTMLInputElement | null)?.value) return; // bot trap

    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const { name, email, phone, message } = fields;

    if (!ENDPOINT) {
      const subject = `Hello from ${name.trim()}`;
      const body = `Hi Haseeb,\n\n${message.trim()}\n\n${name.trim()}\n${email.trim()}${phone.trim() ? `\n${phone.trim()}` : ""}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("opened");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, phone, message, _subject: `Portfolio message from ${name}` }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setFields(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  const field = (k: keyof Fields) => ({
    id: `${uid}-${k}`,
    name: k,
    value: fields[k],
    onChange: set(k),
    "aria-invalid": Boolean(errors[k]) || undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
    className: cn(
      "w-full border-0 border-b bg-transparent px-0 py-3 text-[1.0625rem] text-panel-ink outline-none transition-colors placeholder:text-panel-muted/60",
      "focus:border-signal focus-visible:outline-none",
      errors[k] ? "border-[#ff7a6b]" : "border-panel-rule hover:border-panel-muted",
    ),
  });

  const label = (k: keyof Fields, text: string, optional?: boolean) => (
    <label htmlFor={`${uid}-${k}`} className="label-mono flex justify-between text-panel-muted">
      {text}
      {optional && <span className="normal-case tracking-normal">optional</span>}
    </label>
  );

  const error = (k: keyof Fields) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="mt-2 text-sm text-[#ff7a6b]">
        {errors[k]}
      </p>
    ) : null;

  return (
    <div className="rounded-2xl border border-panel-rule bg-panel-2/60 p-6 md:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <m.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: ease.outExpo }}
            className="flex min-h-[22rem] flex-col justify-center"
            role="status"
          >
            <span className="grid size-11 place-items-center rounded-full bg-signal text-panel">
              <Check className="size-5" />
            </span>
            <p className="mt-6 font-display text-3xl">Thanks, got it.</p>
            <p className="mt-2 text-panel-muted">I&apos;ll get back to you soon.</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-8 inline-flex min-h-11 w-fit items-center font-mono text-xs text-panel-muted underline underline-offset-4 hover:text-panel-ink"
            >
              Send another message
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-7"
            aria-label="Contact form"
          >
            <div className="grid gap-7 sm:grid-cols-2">
              <div>
                {label("name", "Name")}
                <input {...field("name")} type="text" autoComplete="name" placeholder="Your name" required />
                {error("name")}
              </div>
              <div>
                {label("email", "Email")}
                <input {...field("email")} type="email" autoComplete="email" placeholder="you@example.com" required />
                {error("email")}
              </div>
            </div>
            <div>
              {label("phone", "Phone", true)}
              <input {...field("phone")} type="tel" autoComplete="tel" placeholder="+49 …" />
              {error("phone")}
            </div>
            <div>
              {label("message", "Message")}
              <textarea
                {...field("message")}
                rows={4}
                placeholder="What are you working on?"
                required
                className={cn(field("message").className, "resize-none")}
              />
              {error("message")}
            </div>

            {/* Honeypot: hidden from people, tempting for bots */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Company
                <input type="text" name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-signal px-6 font-medium text-panel transition-transform active:scale-[0.97] disabled:opacity-70"
              >
                {status === "sending" ? "Sending" : "Send message"}
                {status === "sending" ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
              <p className="text-sm text-panel-muted" role="status" aria-live="polite">
                {status === "opened" && "Your email app should open with everything filled in. Just hit send."}
                {status === "error" && (
                  <>
                    Something went wrong. You can email me directly at{" "}
                    <a href={`mailto:${to}`} className="text-panel-ink underline underline-offset-4">
                      {to}
                    </a>
                    .
                  </>
                )}
              </p>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
