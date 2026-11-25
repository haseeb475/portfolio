"use client";

import { m } from "motion/react";
import { duration, ease, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { splitWords } from "./RichText";

type Props = {
  text: string;
  className?: string;
  as?: "h2" | "h3" | "p";
  delay?: number;
  id?: string;
};

/**
 * Masked word-by-word reveal on scroll. Screen readers get the plain sentence
 * from a visually-hidden copy; the animated spans are hidden from the accessibility tree.
 */
export function SplitWords({ text, className, as = "h2", delay = 0, id }: Props) {
  const words = splitWords(text);
  const Tag = m[as];
  return (
    <Tag
      id={id}
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      transition={{ staggerChildren: stagger.words, delayChildren: delay }}
    >
      <span className="sr-only">{text.replace(/\*/g, "")}</span>
      {words.map(({ word, em }, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <m.span
            className={cn("inline-block will-change-transform", em && "italic")}
            variants={{
              hidden: { y: "105%" },
              show: { y: "0%", transition: { duration: duration.slow, ease: ease.outExpo } },
            }}
          >
            {word}
          </m.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
