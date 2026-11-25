import { ArrowUpRight, FileText, Phone } from "lucide-react";
import { contact, hero, profile } from "@/content/profile";
import { ContactForm } from "@/components/ui/ContactForm";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { LocalTime } from "@/components/ui/LocalTime";
import { SplitWords } from "@/components/ui/SplitWords";
import { Reveal } from "@/components/ui/Reveal";
import { publicFileExists } from "@/lib/assets";

const linkClass = "group flex min-h-20 items-center gap-4 py-6 transition-colors hover:text-signal";

export function Contact() {
  const hasResume = publicFileExists(profile.links.resume);
  const links = [
    { label: "GitHub", sub: "haseeb475", href: profile.links.github, Icon: GithubIcon },
    { label: "LinkedIn", sub: "in/haseebramzan", href: profile.links.linkedin, Icon: LinkedinIcon },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-h"
      className="relative isolate scroll-mt-0 overflow-hidden bg-panel text-panel-ink"
    >
      <div aria-hidden className="bg-grid-panel absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <div className="page-x pb-10 pt-24 md:pt-36">
        <div className="label-mono flex items-center gap-4 text-panel-muted">
          <span>§06</span>
          <span className="h-px flex-1 bg-panel-rule" aria-hidden />
          <span>Contact</span>
        </div>

        <div className="mt-14 grid gap-x-16 gap-y-14 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-6">
            <SplitWords
              id="contact-h"
              text={contact.closing}
              className="font-display text-[clamp(2.6rem,5.6vw,5.4rem)] leading-[1.02] tracking-[-0.014em] [&_.italic]:text-signal"
            />
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-panel-ink/75">{contact.body}</p>
            </Reveal>
            <Reveal delay={0.3} className="mt-10">
              <p className="label-mono mb-3 text-panel-muted">Or email me directly</p>
              <CopyEmail email={profile.email} />
            </Reveal>
            <Reveal delay={0.32} className="mt-8">
              <p className="label-mono mb-2 text-panel-muted">Or give me a call</p>
              <a
                href={`tel:${profile.phone.tel}`}
                className="group inline-flex min-h-11 items-center gap-3 font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-none transition-colors hover:text-signal"
              >
                <Phone className="size-5 text-panel-muted transition-colors group-hover:text-signal" aria-hidden />
                {profile.phone.display}
              </a>
            </Reveal>
            <Reveal delay={0.35}>
              <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-panel-muted">
                <span className="size-1.5 rounded-full bg-signal" aria-hidden />
                <span className="text-panel-ink">{hero.availability.label}</span>
                <span aria-hidden>·</span>
                <span>{profile.location}</span>
                <span aria-hidden>·</span>
                <span>
                  local time <LocalTime timeZone={profile.timeZone} className="text-panel-ink" />
                </span>
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="min-w-0 lg:col-span-6">
            <ContactForm to={profile.email} />
          </Reveal>
        </div>

        <ul className="mt-20 grid border-t border-panel-rule sm:grid-cols-3">
          {links.map(({ label, sub, href, Icon }) => (
            <li
              key={label}
              className="border-b border-panel-rule sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0"
            >
              <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
                <Icon className="size-5 shrink-0" />
                <span className="flex-1">
                  <span className="block font-medium">{label}</span>
                  <span className="block font-mono text-xs text-panel-muted">{sub}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            </li>
          ))}
          <li className="sm:pl-6">
            {hasResume ? (
              <a href={profile.links.resume} target="_blank" rel="noreferrer" className={linkClass}>
                <FileText className="size-5 shrink-0" />
                <span className="flex-1">
                  <span className="block font-medium">Résumé</span>
                  <span className="block font-mono text-xs text-panel-muted">PDF</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            ) : (
              <span className="flex min-h-20 items-center gap-4 py-6" title="Add public/resume.pdf">
                <FileText className="size-5 shrink-0 text-panel-muted" />
                <span className="todo text-sm">Résumé (add public/resume.pdf)</span>
              </span>
            )}
          </li>
        </ul>

        <footer className="mt-24 flex flex-col gap-4 border-t border-panel-rule pt-6 font-mono text-[0.6875rem] text-panel-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {process.env.NEXT_PUBLIC_BUILD_YEAR} {profile.name}
          </p>
          <p>Set in Newsreader, Geist &amp; Geist Mono · Built with Next.js, Tailwind &amp; Motion</p>
          <a href="#top" className="inline-flex min-h-11 items-center transition-colors hover:text-panel-ink">
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
