import React from 'react';
import BrandMark from './BrandMark';

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
  panelFoot = 'MOCK API · JSON-SERVER',
}) {
  return (
    <div className="flex min-h-screen w-full bg-white selection:bg-indigo-600 selection:text-white">
      <div className="auth-enter flex flex-1 flex-col px-6 py-8 sm:px-12 lg:px-16">
        <div className="mb-8 lg:hidden">
          <BrandMark tone="dark" />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[400px] py-6">
            <p className="mb-3 whitespace-nowrap text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">
              {eyebrow}
            </p>
            <h1 className="break-words text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-[44px]">
              {title}
            </h1>
            <p className="mb-9 mt-3 text-[15px] leading-relaxed text-slate-500">{subtitle}</p>
            {children}
            {footer && <div className="mt-9">{footer}</div>}
          </div>
        </div>

        <p className="mt-8 text-center text-xs font-medium text-slate-500 lg:text-left">
          Dữ liệu demo · mock API json-server
        </p>
      </div>

      <aside className="relative hidden flex-[1.1] overflow-hidden bg-indigo-700 text-white lg:flex">
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1.3px, transparent 1.3px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="absolute -left-24 -top-32 h-[420px] w-[420px] rounded-full bg-indigo-500 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[460px] w-[460px] rounded-full bg-blue-800/80 blur-3xl" />
        <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full border border-white/15" />
        <div className="absolute left-1/4 top-1/3 ml-10 mt-10 h-72 w-72 rounded-full border border-white/10" />

        <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
          <BrandMark tone="light" />

          <div>
            <p className="mb-5 font-mono text-xs tracking-[0.2em] text-indigo-200">
              {panelKicker}
            </p>
            <p className="text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] xl:text-[44px]">
              {panelTitle}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              <p className="text-sm font-semibold text-indigo-100">{panelMeta}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t-2 border-white/25 pt-6">
            <p className="text-xs font-bold tracking-[0.18em] text-indigo-200">{panelFoot}</p>
            <p className="font-mono text-xs tabular-nums text-indigo-200">localhost:3001</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
