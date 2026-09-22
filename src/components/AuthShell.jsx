import React from 'react';

function BrandMark({ tone = 'light' }) {
  const text = tone === 'light' ? 'text-white' : 'text-slate-900';
  const box =
    tone === 'light'
      ? 'border-white/70 text-white'
      : 'border-indigo-600 text-indigo-600';
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-9 h-9 rounded-xl border-2 ${box} flex items-center justify-center`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <span className={`text-2xl font-extrabold tracking-tight ${text}`}>AuthStudio</span>
    </div>
  );
}

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  panelKicker = 'AUTH / 01 — PHIÊN BẢN DEMO',
  panelTitle = (
    <>
      Một tài khoản.
      <br />
      Vào thẳng việc.
    </>
  ),
  panelMeta = 'demo@example.com · password123',
  panelFoot = 'KHÔNG BACKEND · CHỈ TRÌNH DUYỆT',
}) {
  return (
    <div className="min-h-screen flex w-full bg-white selection:bg-indigo-600 selection:text-white">
      <div className="flex-1 flex flex-col px-6 py-8 sm:px-12 lg:px-16 auth-enter">
        <div className="lg:hidden mb-8">
          <BrandMark tone="dark" />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[400px] py-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600 mb-3 whitespace-nowrap">
              {eyebrow}
            </p>
            <h1 className="text-[40px] sm:text-[44px] font-extrabold tracking-[-0.03em] text-slate-950 leading-[1.05] break-words">
              {title}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-500 mb-9">{subtitle}</p>
            {children}
            {footer && <div className="mt-9">{footer}</div>}
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium text-center lg:text-left mt-8">
          Tài khoản demo · lưu trong localStorage
        </p>
      </div>

      <aside className="hidden lg:flex flex-[1.1] relative overflow-hidden bg-indigo-700 text-white">
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1.3px, transparent 1.3px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-indigo-500 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 w-[460px] h-[460px] rounded-full bg-blue-800/80 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full border border-white/15" />
        <div className="absolute top-1/3 left-1/4 mt-10 ml-10 w-72 h-72 rounded-full border border-white/10" />

        <div className="relative flex flex-col justify-between w-full p-12 xl:p-16">
          <BrandMark tone="light" />

          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-indigo-200 mb-5">
              {panelKicker}
            </p>
            <p className="text-4xl xl:text-[44px] font-extrabold leading-[1.05] tracking-[-0.02em] text-balance">
              {panelTitle}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              <p className="text-sm font-semibold text-indigo-100">
                {panelMeta}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/20 pt-6">
            <p className="text-xs font-bold tracking-[0.18em] text-indigo-200">
              {panelFoot}
            </p>
            <p className="font-mono text-xs text-indigo-200">localStorage →</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
