import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft sm:p-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">AI Study App</p>
        <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
          Upload notes. Study smarter. Ace your test.
        </h1>
        <div className="mt-8">
          <Link
            href="/upload"
            className="inline-flex min-w-40 items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white transition hover:opacity-95"
          >
            Upload
          </Link>
        </div>
      </section>
    </main>
  );
}
