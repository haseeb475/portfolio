import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-x flex min-h-dvh flex-col justify-center py-24">
      <p className="label-mono text-muted">Error 404 · state: unknown</p>
      <h1 className="mt-6 font-display text-[clamp(3rem,9vw,8rem)] leading-[0.95] tracking-[-0.014em]">
        This path didn&apos;t <em className="text-accent">resolve.</em>
      </h1>
      <p className="mt-6 max-w-md text-muted">The page you were looking for isn&apos;t here. The rest of the system is fine.</p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 w-fit items-center rounded-full bg-ink px-6 font-medium text-paper transition-colors hover:bg-accent"
      >
        Back to the index
      </Link>
    </main>
  );
}
