/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT: single source of truth
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every word on the site lives in this file. Edit here, never in components.
 *
 *  Sources: Haseeb_AI_Munich.pdf + Haseeb_Ramzan_FlowCV_Resume_2026-11-19.pdf.
 *  Anything NOT on either CV is marked `TODO:`. Search for "TODO" before
 *  publishing. Placeholder links render with a dashed amber underline.
 *
 *  Writing style: plain, first person, short sentences. No em dashes.
 *
 *  Structure rule: PROFESSIONAL EXPERIENCE (employers) and PROJECTS
 *  (independent, academic and open source work) are kept strictly separate.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ───────────────────────────── Types ───────────────────────────── */

export type WorkId = "detoxi" | "cytomate" | "alachisoft";
export type ProjectId = "lambda" | "harness" | "privategpt" | "vstorm" | "vriend" | "predictivedesk" | "integreat";
/** Where a skill was used. Powers the skills filter. */
export type EvidenceId = WorkId | ProjectId;

export type Link = { label: string; href: string | null };

export type Metric = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  /** Optional "before" value, rendered struck through before the result. */
  from?: number;
};

export type DiagramId = "agent" | "harness" | "storm" | "migrant";

export type CaseStudy = {
  id: string;
  title: string;
  kicker: string;
  period: string;
  context: string;
  summary: string;
  stack: string[];
  links: Link[];
  metrics: Metric[];
  /** Optional architecture diagram (see components/projects/diagrams/specs.ts). */
  diagram?: DiagramId;
  diagramCaption?: string;
  /** Optional screenshots (files in /public/projects/). The first one is shown large. */
  gallery?: { src: string; width: number; height: number; alt: string; caption?: string }[];
  problem: string;
  approach: string;
  decisions: { title: string; body: string }[];
};

export type Role = {
  id: WorkId;
  company: string;
  role: string;
  location: string;
  start: string; // YYYY-MM
  end: string | null; // null = present
  summary: string;
  stats?: { value: string; label: string }[];
  highlights: string[];
  stack: string[];
  badge?: string;
  /** Public links (e.g. app store pages). Entries with `href: null` are hidden. */
  links?: Link[];
};

export type Education = {
  school: string;
  degree: string;
  location: string;
  start: string;
  end: string | null;
  notes?: string[];
};

/* ───────────────────────────── Identity ───────────────────────────── */

export const profile = {
  name: "Haseeb Ramzan",
  shortName: "Haseeb",
  initials: "HR",
  title: "AI Engineer & Software Developer",
  location: "Passau, Germany",
  coordinates: "48.57°N 13.43°E",
  timeZone: "Europe/Berlin",

  /** TODO: set NEXT_PUBLIC_SITE_URL in your hosting provider once you have a domain. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  email: "hramzan0475@gmail.com",
  phone: { display: "+49 152 11327733", tel: "+4915211327733" },
  links: {
    github: "https://github.com/haseeb475",
    linkedin: "https://www.linkedin.com/in/haseebramzan",
    /** Drop your CV at /public/resume.pdf (consider removing your phone number first). */
    resume: "/resume.pdf",
  },

  seo: {
    description:
      "Haseeb Ramzan is a software engineer in Passau, Germany. He builds web platforms, mobile apps and AI systems, working mostly in Python, TypeScript and Kotlin.",
    keywords: ["Haseeb Ramzan", "AI Engineer", "Software Developer", "Agentic AI", "LLM", "RAG", "TypeScript", "Python", "Passau", "Germany"],
  },
} as const;

/* ───────────────────────────── Hero ───────────────────────────── */

export const hero = {
  /** Words wrapped in *asterisks* render in italic serif. */
  headline: "I build software people *rely on,* from mobile apps to AI agents.",
  intro:
    "I'm Haseeb, a software engineer based in Passau, Germany. For over three years I've worked on web platforms for banks and government teams, mobile apps downloaded more than 20,000 times, and lately AI systems that can work through real codebases on their own.",
  availability: {
    open: true,
    label: "Available for work",
    detail: "Full-time roles and freelance projects",
  },
};

/* ───────────────────────────── About ───────────────────────────── */

export const about = {
  pullQuote:
    "I enjoy the part of the job that starts after launch, when real people use the thing and you find out what actually matters.",
  paragraphs: [
    "I studied Computer Science at FAST in Islamabad. My first job was at Alachisoft, writing C# for a distributed cache. After that I spent a year and a half working remotely for Cytomate, a company in Doha, building web platforms for banks, healthcare companies and government teams. That kind of software has to pass security audits, so I learned early to take testing, logging and access control seriously.",
    "Now I'm in Germany, doing a master's in AI Engineering at the University of Passau. Alongside my studies I work as a Werkstudent Software Developer at detoxi Health, on two apps that are live in the stores and a third that's on the way. In my free time I build AI agents, like one that fixes real bugs in open source projects.",
  ],
  /** Highlight strip under the About text. Keep these simple and broadly understandable. */
  notes: [
    { k: "Professional experience", v: "3+ years" },
    { k: "App downloads", v: "20K+" },
    { k: "Companies across", v: "3 countries" },
    { k: "Team award, 2024", v: "Best Cyber Security Solution" },
  ],
};

/* ───────────────────────────── Professional experience ───────────────────────────── */

export const experience: Role[] = [
  {
    id: "detoxi",
    company: "detoxi Health GmbH",
    role: "Werkstudent Software Developer",
    location: "Remote from Passau, team in Berlin",
    start: "2025-11",
    end: null,
    summary: "As a Werkstudent Software Developer I work on our mobile apps that help people build healthier screen time habits. Two are live in the stores and a third is on the way.",
    stats: [
      { value: "20K+", label: "downloads" },
      { value: "1,000+", label: "users in our usage study" },
      { value: "2", label: "apps in production" },
    ],
    highlights: [
      "Helped grow the main detoxi app (SolidJS and Capacitor) to over 20,000 downloads on Google Play and the App Store",
      "Added translations and payments so the app could launch in English and reach users outside Germany",
      "Wrote a Kotlin screen time plugin with a Focus Mode and rules for blocking apps",
      "Building a parental guidance app in React Native and Django, with a mood journal called “Logbuch”, in-app payments and AppsFlyer and Firebase tracking",
      "Launched a usage tracking app used by more than 1,000 people. We're now using that data to build a personal wellbeing score",
    ],
    stack: ["SolidJS", "Capacitor", "React Native", "Django", "Kotlin", "Firebase"],
    links: [
      { label: "Google Play", href: null }, // TODO: paste the detoxi Google Play URL
      { label: "App Store", href: null }, // TODO: paste the detoxi App Store URL
    ],
  },
  {
    id: "cytomate",
    company: "Cytomate",
    role: "Full Stack Developer",
    location: "Remote, team in Doha, Qatar",
    start: "2023-09",
    end: "2025-03",
    summary: "Working remotely, I built web platforms for banks, healthcare companies and government clients.",
    stats: [
      { value: "60%", label: "faster page loads" },
      { value: "3", label: "industries served" },
    ],
    highlights: [
      "Built web apps in TypeScript, React and Next.js, and designed REST APIs with role based access control",
      "Made pages load 60% faster with caching, lazy loading and code splitting",
      "Moved an old .NET desktop app to Electron so it runs on Windows, macOS and Linux",
      "Built PDF reports with Puppeteer and central logging with Elasticsearch, which helped the product earn Common Criteria certification",
      "Automated deployments, scheduled jobs and webhook integrations so the team spent less time on manual work",
    ],
    stack: ["TypeScript", "React", "Next.js", "Electron", "Elasticsearch", "Puppeteer"],
    badge: "Our team won Best Cyber Security Solution at the Qatar Digital Business Awards 2024",
  },
  {
    id: "alachisoft",
    company: "Alachisoft",
    role: "Software Engineer",
    location: "Islamabad, Pakistan",
    start: "2023-06",
    end: "2023-08",
    summary: "My first engineering job, working in C# on NCache, a distributed caching product.",
    stats: [{ value: "40%", label: "faster data exchange" }],
    highlights: [
      "Sped up data exchange between services by 40% with API automation and an event driven design",
      "Worked on serialization so cached data moved faster and more reliably between machines",
      "Built internal tools for caching and real time data sync",
    ],
    stack: ["C#", ".NET", "NCache"],
  },
];

export const education: Education[] = [
  {
    school: "University of Passau",
    degree: "M.Sc. Artificial Intelligence Engineering",
    location: "Passau, Germany",
    start: "2025-05",
    end: null,
    notes: ["Courses so far include Deep Learning and Introduction to AI Engineering"],
  },
  {
    school: "FAST National University of Computer and Emerging Sciences",
    degree: "B.S. Computer Science",
    location: "Islamabad, Pakistan",
    start: "2019-08",
    end: "2023-06",
    notes: [
      "Dean's List in Spring 2022, Fall 2022 and Spring 2023",
      "Teaching assistant for Calculus, Digital Logic Design, Probability and Statistics, and Differential Equations",
    ],
  },
];

/* ───────────────────────────── The journey (rally stage) ─────────────────────────────
 *  Work and study on one road. List stages oldest first; `journeyOrder` decides display order.
 *  `turn` picks the tulip arrow in the roadbook. `note` is a co-driver pace note.
 */

export type Turn = "start" | "right" | "left" | "hairpin" | "now";

export type JourneyStage =
  | { kind: "study"; school: string; city: string; country: string; turn: Turn; note: string }
  | { kind: "work"; id: WorkId; city: string; country: string; remote?: { city: string; country: string }; turn: Turn; note: string };

/** "newest-first" (like a CV) or "oldest-first" (like a story). The car drives whichever way you pick. */
export const journeyOrder: "newest-first" | "oldest-first" = "oldest-first";

export const journey: JourneyStage[] = [
  {
    kind: "study",
    school: "FAST National University of Computer and Emerging Sciences",
    city: "Islamabad",
    country: "Pakistan",
    turn: "start",
    note: "Start. Four years of straight road.",
  },
  { kind: "work", id: "alachisoft", city: "Islamabad", country: "Pakistan", turn: "right", note: "Short right, straight into C#." },
  {
    kind: "work",
    id: "cytomate",
    city: "Islamabad", // TODO: confirm where you worked from during Cytomate
    country: "Pakistan",
    remote: { city: "Doha", country: "Qatar" },
    turn: "left",
    note: "Keep left. A long stage, remote with a team in Doha.",
  },
  {
    kind: "study",
    school: "University of Passau",
    city: "Passau",
    country: "Germany",
    turn: "hairpin",
    note: "Hairpin. New country, new language.",
  },
  {
    kind: "work",
    id: "detoxi",
    city: "Passau",
    country: "Germany",
    remote: { city: "Berlin", country: "Germany" },
    turn: "now",
    note: "Flat out. Still on this stage.",
  },
];

/* ───────────────────────────── Projects (independent work) ───────────────────────────── */

export const projects: CaseStudy[] = [
  {
    id: "coding-lambda",
    title: "Coding Lambda",
    kicker: "An AI agent that fixes bugs",
    period: "2025", // TODO: confirm dates
    context: "Personal project", // TODO: academic, personal or open source?
    summary:
      "An AI agent that fixes real bugs in open source repositories. It plans a fix, finds the code that matters, edits files in a sandbox, runs the tests and learns from what failed. It runs entirely on open source models.",
    stack: ["Python", "vLLM", "FastAPI", "ChromaDB", "Git", "RAG"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/haseeb475/coding-agent" },
    ],
    metrics: [
      { from: 32.2, value: 37.0, decimals: 1, suffix: "%", label: "SWE-bench Verified" },
      { value: 47.6, decimals: 1, prefix: "−", suffix: "%", label: "Fewer tokens used" },
      { value: 96.3, decimals: 1, suffix: "%", label: "HumanEval" },
      { value: 33, label: "Tools the agent can use" },
    ],
    diagram: "agent",
    diagramCaption: "The agent moves through fixed steps and calls tools through a guarded router.",
    problem: "Simple agent loops get lost in big codebases. They repeat themselves and waste a lot of tokens.",
    approach:
      "I split the work into fixed steps: plan, find code, edit, test and reflect. Each step only gets the tools it needs, and code search combines the syntax tree with semantic search.",
    decisions: [
      { title: "Fixed steps", body: "You can see what the agent is doing, and stop it when it starts going in circles." },
      { title: "Smarter code search", body: "Looking up exact functions and classes, plus semantic search, gives the model less but better context." },
      { title: "Learn from failures", body: "Edits and tests run in a sandbox. When a test fails, the agent writes a note for its next try." },
    ],
  },
  {
    id: "agent-harness",
    title: "Agent Harness",
    kicker: "A terminal-based agent system",
    period: "2026",
    context: "Open source",
    summary:
      "A command line harness for AI agents that I co-developed. It keeps agents on a short leash with iteration caps, a token budget and sandboxed tools, and it records every run so you can see exactly where things went wrong.",
    stack: ["Python 3.12", "MCP", "Qdrant", "OpenTelemetry", "Prometheus", "Grafana", "Jaeger", "Docker / Podman", "pytest"],
    links: [{ label: "Source", href: null }], // TODO: GitHub repo URL
    metrics: [
      { value: 700, suffix: "+", label: "Tests running in CI" },
      { value: 100, suffix: "+", label: "Architecture decision records" },
      { value: 3, label: "MCP servers connected" },
      { value: 3, label: "Specialised sub-agents" },
    ],
    diagram: "harness",
    diagramCaption: "A ReAct loop with hard limits, tools discovered over MCP, scoped sub-agents and memory, and an evaluation layer that reads every run.",
    problem:
      "Agents are easy to start and hard to trust. They loop, overspend tokens, touch files they shouldn't, and when they fail it's hard to say why.",
    approach:
      "We wrapped a ReAct loop in hard limits and clear permissions, connected tools through MCP, and gave a researcher, a writer and a critic sub-agent only the tools they need. Long-term memory lives in Qdrant.",
    decisions: [
      {
        title: "Limits by default",
        body: "Iteration caps and a token budget ledger stop runaway loops. File tools only work inside isolated folders, and skills load only when they're needed.",
      },
      {
        title: "Tools found at runtime",
        body: "The agent discovers tools from MCP servers for scheduling, calendars and web search. We added bounded tools like finding a free meeting slot or counting working days.",
      },
      {
        title: "Failures you can see",
        body: "Every run's trace is checked for retry storms, repeated calls and silent errors, then shown in Prometheus, Grafana and Jaeger.",
      },
    ],
  },
  {
    id: "migrant-assistant",
    title: "Migrant Assistant",
    kicker: "A private guide through German bureaucracy",
    period: "2026",
    context: "Hackathon · 2nd place",
    summary:
      "Our team's entry for the AI4Good Hackathon in Munich, built for Tür an Tür Digitalfabrik's Integreat track, where we placed second. Instead of a chat box, it gives people new to Germany a step by step route for things like registering their address, and their personal details never leave their device.",
    stack: ["React", "Vite", "NestJS", "FastAPI", "RAG", "Ollama", "Gemini (optional)"],
    links: [{ label: "Source", href: null }], // TODO: repo or demo link
    metrics: [
      { value: 2, suffix: "nd", label: "Place in the Integreat track" },
      { value: 2, label: "Days to build it" },
      { value: 0, label: "Accounts needed to use it" },
    ],
    diagram: "migrant",
    diagramCaption: "A self-hostable stack. Personal details stay in the browser, and weak answers end in a refusal or a human counselor.",
    problem:
      "Newcomers often don't know which step comes first, may not speak the language, and are asked to trust AI with very personal details. Tür an Tür asked for accurate, current answers, data kept on the device, and an open, self-hostable stack.",
    approach:
      "We made it a journey instead of a chat. People either tap through guided questions or pick a goal, and the answer becomes cards with documents, steps, appointments and sources, grounded in official pages and Integreat's regional content.",
    decisions: [
      {
        title: "Journey, not chat",
        body: "A Bubble Guide asks one question at a time, so people get a clear path even when they don't know what to ask.",
      },
      {
        title: "Privacy in the architecture",
        body: "Personal facts live in a wallet in the browser. Questions are de-identified before retrieval, and users can see, export or clear everything.",
      },
      {
        title: "Cite it or don't say it",
        body: "Answers come from official and regional sources. When sources are weak, it asks a follow-up, refuses, or hands over to a human counselor.",
      },
    ],
  },
  {
    id: "vstorm",
    title: "VStorm",
    kicker: "Smarter task scheduling",
    period: "2023",
    context: "Bachelor thesis",
    summary:
      "A scheduler for Apache Storm that predicts whether each task needs mostly CPU, GPU or disk, and sends it to the machine that suits it best.",
    stack: ["Apache Storm", "Python", "Machine Learning", "Linux", "Bash"],
    links: [{ label: "Source", href: null }], // TODO: link (or remove)
    metrics: [
      { value: 30, prefix: "+", suffix: "%", label: "Better cluster usage" },
      { value: 70, prefix: "−", suffix: "%", label: "Setup time" },
    ],
    diagram: "storm",
    diagramCaption: "Live metrics go into a classifier, and the scheduler uses its predictions to place tasks.",
    problem: "Storm's default scheduler treats every task the same, so some machines get overloaded while others sit idle.",
    approach: "A small ML model predicts what kind of work each task is, and the scheduler places it to match. Setting up the cluster is fully scripted.",
    decisions: [
      { title: "Place work by type", body: "CPU, GPU and disk heavy tasks each go where there's room for them." },
      { title: "Script the setup", body: "Linux and Bash scripts cut the time to set up a cluster by 70%." },
      // TODO: the AI CV says Vue.js, the FlowCV says Next.js for the dashboard. Confirm.
      { title: "Make it visible", body: "A live dashboard shows how busy each machine is." },
    ],
  },
];

/** More independent projects, shown as a compact list under the case studies. */
export const moreProjects: { id?: ProjectId; title: string; period: string; body: string; stack: string; href: string | null; badge?: string }[] = [
  {
    id: "privategpt",
    title: "PrivateGPT",
    period: "2025",
    body: "A self-hosted assistant that answers questions from over 1,000 internal documents synced from SharePoint. Admins and users get their own views, and the documents stay on the company's own server.",
    stack: "Next.js · FastAPI · LangChain · OpenAI",
    href: null, // TODO
  },
  {
    id: "vriend",
    title: "Vriend",
    period: "2025",
    body: "A chatbot with distinct personalities. A FastAPI persona engine drives the conversation, MongoDB remembers past chats and user profiles, and a Next.js front end handles real-time chat. Packaged with Docker.",
    stack: "FastAPI · MongoDB · Next.js · Docker",
    href: null, // TODO
  },
  {
    id: "predictivedesk",
    title: "PredictiveDesk",
    period: "2024",
    body: "A full ticketing platform with a scikit-learn model that estimates how long each ticket will take to resolve, so teams can plan ahead and avoid missing their SLAs.",
    stack: "MERN · scikit-learn",
    href: null, // TODO
  },
];

/* ───────────────────────────── Evidence (filter columns) ───────────────────────────── */

export const evidence: Record<EvidenceId, { label: string; kind: "work" | "project" }> = {
  detoxi: { label: "detoxi Health", kind: "work" },
  cytomate: { label: "Cytomate", kind: "work" },
  alachisoft: { label: "Alachisoft", kind: "work" },
  lambda: { label: "Coding Lambda", kind: "project" },
  harness: { label: "Agent Harness", kind: "project" },
  privategpt: { label: "PrivateGPT", kind: "project" },
  vstorm: { label: "VStorm", kind: "project" },
  vriend: { label: "Vriend", kind: "project" },
  predictivedesk: { label: "PredictiveDesk", kind: "project" },
  integreat: { label: "Migrant Assistant", kind: "project" },
};

/* ───────────────────────────── Skills ─────────────────────────────
 *  `used` = where the CVs show the skill in action. Empty means "I know it"
 *  (listed on a CV, not tied to a role or project here) and renders dashed.
 */

export type Skill = { name: string; used: EvidenceId[] };
export type SkillGroup = { id: string; label: string; skills: Skill[] };

export const expertise: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "Python", used: ["lambda", "harness", "privategpt", "vriend", "predictivedesk", "vstorm"] },
      { name: "TypeScript", used: ["detoxi", "cytomate"] },
      { name: "JavaScript", used: ["cytomate", "predictivedesk"] },
      { name: "Kotlin", used: ["detoxi"] },
      { name: "C#", used: ["alachisoft"] },
      { name: "Shell", used: ["vstorm"] },
      { name: "Java", used: [] },
      { name: "C++", used: [] },
    ],
  },
  {
    id: "frontend",
    label: "Frontend and mobile",
    skills: [
      { name: "React", used: ["cytomate", "predictivedesk", "integreat"] },
      { name: "Next.js", used: ["cytomate", "privategpt", "vriend"] },
      { name: "React Native", used: ["detoxi"] },
      { name: "Solid.js", used: ["detoxi"] },
      { name: "Capacitor", used: ["detoxi"] },
      { name: "Electron", used: ["cytomate"] },
      { name: "Tailwind CSS", used: [] },
    ],
  },
  {
    id: "backend",
    label: "Backend and APIs",
    skills: [
      { name: "FastAPI", used: ["lambda", "privategpt", "vriend", "integreat"] },
      { name: "NestJS", used: ["integreat"] },
      { name: "Node.js and Express", used: ["privategpt", "predictivedesk"] },
      { name: "Django", used: ["detoxi"] },
      { name: ".NET", used: ["alachisoft", "cytomate"] },
      { name: "REST APIs", used: ["cytomate", "predictivedesk"] },
      { name: "Microservices", used: ["cytomate", "privategpt"] },
      { name: "Event driven systems", used: ["alachisoft"] },
    ],
  },
  {
    id: "data",
    label: "Data",
    skills: [
      { name: "MongoDB", used: ["vriend", "predictivedesk"] },
      { name: "Vector databases", used: ["lambda", "harness", "privategpt"] },
      { name: "Elasticsearch", used: ["cytomate"] },
      { name: "NCache", used: ["alachisoft"] },
      { name: "PostgreSQL", used: [] },
      { name: "MySQL", used: [] },
      { name: "Redis", used: [] },
    ],
  },
  {
    id: "ai",
    label: "AI and ML",
    skills: [
      { name: "AI agents", used: ["lambda", "harness"] },
      { name: "MCP", used: ["harness"] },
      { name: "RAG", used: ["lambda", "privategpt", "integreat"] },
      { name: "LLM apps", used: ["privategpt", "vriend"] },
      { name: "vLLM", used: ["lambda"] },
      { name: "LangChain", used: ["privategpt"] },
      { name: "OpenAI API", used: ["privategpt"] },
      { name: "scikit-learn", used: ["predictivedesk"] },
      { name: "Ollama", used: ["integreat"] },
      { name: "Model evaluation", used: ["lambda", "harness"] },
    ],
  },
  {
    id: "infra",
    label: "Cloud and DevOps",
    skills: [
      { name: "Git and CI/CD", used: ["detoxi", "cytomate", "lambda", "harness"] },
      { name: "Docker", used: ["vriend", "harness"] },
      { name: "Observability", used: ["harness", "cytomate"] },
      { name: "pytest", used: ["harness"] },
      { name: "Linux", used: ["vstorm"] },
      { name: "Apache Storm", used: ["vstorm"] },
      { name: "AWS", used: [] },
      { name: "Azure DevOps", used: [] },
      { name: "Kubernetes", used: [] },
      { name: "Jenkins", used: [] },
    ],
  },
];

export const certifications = ["AWS Cloud Technical Essentials"];

/* ───────────────────────────── Outside of work ───────────────────────────── */

// verify: written in your voice. Change anything that doesn't sound like you.
export type Pastime = "football" | "volleyball" | "hiking" | "cars" | "tech" | "german";

export const beyond = {
  title: "Outside of *work.*",
  intro: "The things I do when the laptop is closed.",
  /** Volunteering / leadership, shown separately from the fun stuff. */
  volunteering: {
    org: "AIESEC in Germany",
    role: "Team Leader, Outgoing Global Volunteer",
    location: "Passau",
    start: "2025-11",
    body: "I lead a team that helps students find volunteering placements abroad. We build and keep up partnerships with AIESEC contacts in other countries, so each student gets matched with a placement that suits them.",
    why: "Having moved countries myself, I know how big that step is. I like helping other people take it.",
    /** The illustration next to it: "pass" (boarding pass) or "globe". */
    visual: "pass" as "pass" | "globe",
  },
  items: [
    {
      id: "football" as Pastime,
      title: "Football",
      tag: "On the pitch",
      body: "Football is how I switch off. A pitch, a ball and a few friends, and the week is forgotten.",
      note: "best reset button there is",
      secret: [
        "Used to cheer for Barça. These days I'm all in on FC Bayern.",
        "Currently grinding my FIFA skills. The online lobbies are humbling.",
      ],
    },
    {
      id: "volleyball" as Pastime,
      title: "Volleyball",
      tag: "Learning",
      body: "I'm learning volleyball from scratch. My serve is still a work in progress, and I'm enjoying every wobbly one.",
      note: "serve: loading…",
      // verify: playful notes I wrote. Replace with your own.
      secret: [
        "Skill check: bump ✓, set getting there, serve still loading.",
        "Goal for now: one serve that clears the net every time.",
      ],
    },
    {
      id: "hiking" as Pastime,
      title: "Hiking",
      tag: "Exploring",
      body: "I'm always hunting for trails I haven't walked yet. Passau sits where three rivers meet, so there's plenty to discover close by.",
      note: "next trail: who knows",
      secret: [
        "Made it to base camp of Nanga Parbat in Pakistan, one of the 8,000 m giants.",
        "In Bavaria I've walked plenty of trails, Eibsee and Tegernsee among them.",
        "Always looking for the next one, so send tips.",
      ],
    },
    {
      id: "cars" as Pastime,
      title: "Cars and rally",
      tag: "Petrolhead",
      body: "Off-road rally and adventure driving are my kind of weekend. You might have spotted the car further up this page.",
      note: "yes, that's why",
      // verify: playful notes I wrote. Replace with your own.
      secret: [
        "Off-road over motorway, every single time.",
        "You've already met my favourite car. It drove you through my journey up there.",
      ],
    },
    {
      id: "tech" as Pastime,
      title: "Tech deep dives",
      tag: "Always watching",
      body: "I keep up with new tech through reviews and long deep dives. New gadgets, new tools, new ideas, I'm in.",
      note: "just one more video",
      // verify: playful notes I wrote. Replace with your own.
      secret: [
        "Open browser tabs right now: too many to admit.",
        "The rule I break every week: just one more review.",
      ],
    },
    {
      id: "german" as Pastime,
      title: "Learning German",
      tag: "Daily practice",
      body: "English comes easy. German is my daily challenge, and I'm getting better one word at a time.",
      note: "jeden Tag ein bisschen",
      // verify: playful notes I wrote. Replace with your own.
      secret: [
        "A2 right now. B1 is the next stop.",
        "Still losing every fight with the word Eichhörnchen.",
      ],
    },
  ],
  languages: [
    { name: "English", level: "C1" },
    { name: "German", level: "A2" },
  ],
};

/* ───────────────────────────── Contact ───────────────────────────── */

export const contact = {
  closing: "Have something in mind? *Let's talk.*",
  body: "I'm open to full-time roles and freelance projects. Send me a message and I'll get back to you.",
};

/* ───────────────────────────── Navigation ───────────────────────────── */

export const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Journey" },
  { id: "projects", label: "Projects" },
  { id: "expertise", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
