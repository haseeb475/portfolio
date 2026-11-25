import { profile } from "@/content/profile";
import { Nav } from "@/components/layout/Nav";
import { SkipLink } from "@/components/layout/SkipLink";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Expertise } from "@/components/sections/Expertise";
import { Projects } from "@/components/sections/Projects";
import { Journey } from "@/components/sections/Journey";
import { Beyond } from "@/components/sections/Beyond";
import { Contact } from "@/components/sections/Contact";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  email: `mailto:${profile.email}`,
  telephone: profile.phone.tel,
  url: profile.siteUrl,
  address: { "@type": "PostalAddress", addressLocality: "Passau", addressCountry: "DE" },
  alumniOf: ["FAST National University of Computer and Emerging Sciences"],
  affiliation: { "@type": "CollegeOrUniversity", name: "University of Passau" },
  sameAs: [profile.links.github, profile.links.linkedin],
  knowsAbout: ["AI agents", "LLMs", "RAG", "TypeScript", "Python", "React", "Kotlin", "Django"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <SkipLink />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Expertise />
        <Beyond />
      </main>
      <Contact />
    </>
  );
}
