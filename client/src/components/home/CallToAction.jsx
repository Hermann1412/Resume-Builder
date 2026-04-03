import React from "react";

const CallToAction = () => {
  return (
    <section
      id="cta"
      className="w-full max-w-6xl mx-auto px-6 md:px-10 mt-20"
    >
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-rose-50 to-amber-50 p-8 md:p-12 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">
              Built For Real Careers
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
              This is not a generic builder. It is your story, your voice, your next move.
            </h2>
            <p className="mt-4 text-slate-600 text-base md:text-lg">
              Create a resume that sounds like you, looks modern, and stays focused on what hiring managers actually care about.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://github.com/Hermann1412"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 border border-slate-300 text-slate-700 hover:bg-white transition"
            >
              View My GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
