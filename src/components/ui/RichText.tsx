import { Fragment } from "react";

/** Renders `*phrase*` segments as italic serif — keeps emphasis in content, not markup. */
export function RichText({ text, emClassName = "italic" }: { text: string; emClassName?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <em key={i} className={emClassName}>
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Splits `*emphasised*` text into words, keeping an `em` flag per word. */
export function splitWords(text: string): { word: string; em: boolean }[] {
  const out: { word: string; em: boolean }[] = [];
  for (const part of text.split(/(\*[^*]+\*)/g).filter(Boolean)) {
    const em = part.startsWith("*") && part.endsWith("*");
    const clean = em ? part.slice(1, -1) : part;
    for (const word of clean.split(/\s+/).filter(Boolean)) out.push({ word, em });
  }
  return out;
}
