import type { DiagramId } from "@/content/profile";
import type { DiagramSpec } from "./Diagram";

/* Architecture diagrams as data. Coordinates are in SVG user units (viewBox). */

const agent: DiagramSpec = {
  width: 760,
  height: 372,
  groups: [
    { x: 186, y: 132, w: 418, h: 106, label: "reliability guards", labelX: 304 },
    { x: 8, y: 272, w: 744, h: 92, label: "33 tools", labelX: 100 },
  ],
  nodes: [
    { id: "issue", x: 16, y: 158, w: 128, label: "Issue / task", sub: "repo + description" },
    { id: "fsm", x: 200, y: 150, w: 176, h: 70, label: "FSM orchestrator", sub: "5 explicit states", tone: "accent" },
    { id: "llm", x: 200, y: 26, w: 176, label: "Open-source LLM", sub: "served via vLLM" },
    { id: "mem", x: 440, y: 26, w: 164, label: "Reflective memory", sub: "failed attempts → notes" },
    { id: "api", x: 440, y: 158, w: 150, label: "Tool router", sub: "guarded tool calls" },
    { id: "patch", x: 636, y: 158, w: 110, label: "Patch", sub: "+ passing tests", tone: "accent" },
    { id: "ast", x: 20, y: 296, w: 132, label: "AST retrieval", sub: "symbols · call sites" },
    { id: "sem", x: 166, y: 296, w: 132, label: "Semantic search", sub: "ChromaDB" },
    { id: "edit", x: 312, y: 296, w: 132, label: "File operations", sub: "sandboxed edits" },
    { id: "exec", x: 458, y: 296, w: 132, label: "Exec & tests", sub: "isolated runs" },
    { id: "git", x: 604, y: 296, w: 136, label: "Git", sub: "diff · blame · revert" },
  ],
  edges: [
    { from: "issue", to: "fsm" },
    { from: "fsm", to: "llm", label: "reason", flow: true },
    { from: "mem", to: "llm", label: "context" },
    { from: "fsm", to: "api", label: "tool call", flow: true },
    { from: "api", to: "mem", label: "reflect", dashed: true },
    { from: "api", to: "patch" },
    { from: "api", to: "ast", d: "M515 212 V252 H86 V296" },
    { from: "api", to: "sem", d: "M515 252 H232 V296" },
    { from: "api", to: "edit", d: "M515 252 H378 V296" },
    { from: "api", to: "exec", d: "M515 252 H524 V296" },
    { from: "api", to: "git", d: "M515 252 H672 V296" },
  ],
};

const harness: DiagramSpec = {
  width: 760,
  height: 380,
  groups: [{ x: 196, y: 282, w: 328, h: 84, label: "MCP", labelX: 212 }],
  nodes: [
    { id: "cli", x: 16, y: 42, w: 112, label: "Terminal", sub: "command line" },
    { id: "loop", x: 166, y: 34, w: 200, h: 70, label: "ReAct loop", sub: "iteration caps · token budget", tone: "accent" },
    { id: "agents", x: 396, y: 42, w: 184, label: "Sub-agents", sub: "researcher · writer · critic" },
    { id: "perms", x: 600, y: 42, w: 148, label: "Permissions", sub: "allow · deny · confirm" },
    { id: "files", x: 16, y: 168, w: 140, label: "File tools", sub: "sandboxed roots" },
    { id: "skills", x: 168, y: 168, w: 118, label: "Skills", sub: "loaded when needed" },
    { id: "mcp", x: 298, y: 168, w: 140, label: "MCP client", sub: "runtime discovery" },
    { id: "mem", x: 450, y: 168, w: 134, label: "Memory", sub: "Qdrant · semantic" },
    { id: "eval", x: 596, y: 168, w: 152, label: "Run evaluation", sub: "failure signals", tone: "accent" },
    { id: "tests", x: 16, y: 300, w: 160, label: "700+ tests", sub: "100+ ADRs", tone: "ghost" },
    { id: "s1", x: 206, y: 300, w: 94, label: "Meetings", sub: "scheduling" },
    { id: "s2", x: 310, y: 300, w: 100, label: "ICS calendar", sub: "events" },
    { id: "s3", x: 420, y: 300, w: 94, label: "Web search", sub: "lookup" },
    { id: "obs", x: 596, y: 300, w: 152, label: "Observability", sub: "Grafana · Jaeger" },
  ],
  edges: [
    { from: "cli", to: "loop" },
    { from: "loop", to: "agents", flow: true },
    { from: "agents", to: "perms", dashed: true },
    { from: "loop", to: "files", d: "M266 104 V136 H86 V168" },
    { from: "loop", to: "skills", d: "M266 136 H227 V168" },
    { from: "loop", to: "mcp", d: "M266 136 H368 V168", flow: true },
    { from: "loop", to: "mem", d: "M266 136 H517 V168" },
    { from: "loop", to: "eval", d: "M266 136 H672 V168", label: "trace", labelAt: { x: 630, y: 136 } },
    { from: "mcp", to: "s1", d: "M368 222 V262 H253 V300" },
    { from: "mcp", to: "s2", d: "M368 262 H360 V300" },
    { from: "mcp", to: "s3", d: "M368 262 H467 V300" },
    { from: "eval", to: "obs", flow: true },
  ],
};

const migrant: DiagramSpec = {
  width: 760,
  height: 330,
  groups: [
    { x: 8, y: 26, w: 192, h: 220, label: "your device" },
    { x: 320, y: 238, w: 432, h: 84, label: "sources", labelX: 330 },
  ],
  nodes: [
    { id: "web", x: 22, y: 48, w: 164, label: "Web app", sub: "React · Vite · guest mode", tone: "accent" },
    { id: "wallet", x: 22, y: 168, w: 164, label: "Data wallet", sub: "stays in the browser" },
    { id: "api", x: 232, y: 48, w: 160, label: "NestJS API", sub: "de-identify · orchestrate" },
    { id: "rag", x: 420, y: 48, w: 150, label: "FastAPI RAG", sub: "grounded retrieval" },
    { id: "llm", x: 602, y: 48, w: 150, label: "LLM or refusal", sub: "Ollama · Gemini optional" },
    { id: "human", x: 602, y: 150, w: 150, label: "Counselor handoff", sub: "when confidence is low", tone: "ghost" },
    { id: "uploads", x: 334, y: 258, w: 128, label: "Admin uploads", sub: "trusted documents" },
    { id: "official", x: 476, y: 258, w: 128, label: "Official pages", sub: "crawled, kept fresh" },
    { id: "regional", x: 618, y: 258, w: 128, label: "Integreat", sub: "regional content" },
  ],
  edges: [
    { from: "web", to: "wallet", dashed: true },
    { from: "web", to: "api", flow: true },
    { from: "api", to: "rag", flow: true },
    { from: "rag", to: "llm", flow: true },
    { from: "llm", to: "human", dashed: true },
    { from: "uploads", to: "rag", d: "M398 258 V222 H495 V102" },
    { from: "official", to: "rag", d: "M540 258 V222 H495" },
    { from: "regional", to: "rag", d: "M682 258 V222 H495" },
  ],
};

const storm: DiagramSpec = {
  width: 760,
  height: 312,
  groups: [{ x: 436, y: 18, w: 316, h: 284, label: "apache storm cluster" }],
  nodes: [
    { id: "mon", x: 20, y: 38, w: 176, label: "Metrics collector", sub: "CPU · GPU · I/O" },
    { id: "ml", x: 20, y: 130, w: 176, label: "ML classifier", sub: "workload prediction", tone: "accent" },
    { id: "dash", x: 20, y: 228, w: 176, label: "Live dashboard", sub: "Vue.js · cluster health" },
    { id: "sched", x: 236, y: 130, w: 164, label: "Scheduler", sub: "resource-aware placement", tone: "accent" },
    { id: "w1", x: 456, y: 44, w: 136, label: "Worker", sub: "CPU-heavy tasks" },
    { id: "w2", x: 604, y: 44, w: 136, label: "Worker", sub: "GPU tasks" },
    { id: "w3", x: 456, y: 130, w: 136, label: "Worker", sub: "I/O-heavy tasks" },
    { id: "w4", x: 604, y: 130, w: 136, label: "Worker", sub: "mixed" },
    { id: "prov", x: 456, y: 228, w: 284, label: "Provisioning", sub: "Linux + Bash automation · −70% setup time" },
  ],
  edges: [
    { from: "mon", to: "ml", flow: true },
    { from: "ml", to: "sched", label: "class" },
    { from: "sched", to: "w1", d: "M400 157 H428 V71 H456" },
    { from: "sched", to: "w3", flow: true },
    { from: "w2", to: "mon", d: "M672 44 V8 H108 V38", label: "telemetry", labelAt: { x: 380, y: 20 }, dashed: true },
    { from: "mon", to: "dash", d: "M20 65 H10 V255 H20" },
  ],
};

export const diagrams: Record<DiagramId, DiagramSpec> = { agent, harness, storm, migrant };

export const diagramTitles: Record<DiagramId, string> = {
  migrant:
    "Migrant Assistant architecture: a React and Vite web app with a data wallet that stays in the browser sends de-identified questions to a NestJS API, which calls a FastAPI RAG service. The RAG service draws on admin uploads, crawled official pages and Integreat regional content, and an LLM (Ollama by default, Gemini optional) answers or refuses, with a handoff to a human counselor when confidence is low.",
  agent:
    "Coding Lambda architecture: an issue enters a finite-state orchestrator that reasons with an open-source LLM served by vLLM, calls 33 tools through a guarded tool router, AST retrieval, semantic search on ChromaDB, sandboxed file operations, test execution and Git, and stores reflections in memory, producing a patch with passing tests.",
  harness:
    "Agent Harness architecture: a terminal front end drives a ReAct loop with iteration caps and a token budget. The loop delegates to researcher, writer and critic sub-agents governed by allow, deny and confirm permissions, uses sandboxed file tools, just-in-time skills, an MCP client that discovers tools from meeting, calendar and web search servers, and Qdrant long-term memory. Each run's trace feeds an evaluation layer shown in Prometheus, Grafana and Jaeger.",
  storm:
    "VStorm: a metrics collector feeds an ML classifier that predicts workload type; a resource-aware scheduler places tasks on Apache Storm workers; telemetry flows back; a Vue.js dashboard shows cluster health; provisioning is automated with Linux and Bash.",
};
