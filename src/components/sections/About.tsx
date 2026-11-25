import { about } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="page-x scroll-mt-20 py-20 md:py-36">
      <div className="label-mono flex items-center gap-4 text-muted">
        <span>§01</span>
        <span className="h-px flex-1 bg-rule" aria-hidden />
        <h2 id="about-title">About</h2>
      </div>

      <div className="mt-14 grid gap-x-12 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <span aria-hidden className="block font-display text-7xl leading-none text-accent">
            “
          </span>
          <SplitWords
            as="p"
            text={about.pullQuote}
            className="-mt-3 font-display text-[clamp(1.9rem,3.4vw,3.1rem)] leading-[1.12] tracking-[-0.01em]"
          />
        </div>

        <div className="space-y-5 lg:col-span-5 lg:col-start-8 lg:pt-10">
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p className="text-[1.0625rem] leading-[1.75] text-ink-2">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mt-20">
        <dl className="grid grid-cols-2 gap-px border-y border-rule bg-rule md:grid-cols-4">
          {about.notes.map((n) => (
            <div key={n.k} className="bg-paper py-6 pr-4 [&:nth-child(even)]:pl-4 md:px-6 md:first:pl-0">
              <dt className="label-mono text-muted">{n.k}</dt>
              <dd className="mt-3 font-display text-2xl leading-tight md:text-[1.75rem]">{n.v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
