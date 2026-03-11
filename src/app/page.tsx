export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--brand-cream)] relative overflow-hidden">
      {/* Layered ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-8%] w-[600px] h-[600px] rounded-full bg-[var(--brand-primary)]/[0.04] blur-[150px]" />
        <div className="absolute bottom-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full bg-[var(--brand-accent)]/[0.06] blur-[130px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[var(--brand-accent-rose)]/[0.04] blur-[100px]" />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(circle, var(--brand-primary) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative z-10 flex flex-col items-center min-h-screen px-5 sm:px-6">

        {/* ═══ Nav Bar ═══ */}
        <nav className="w-full max-w-4xl flex items-center justify-between py-5 animate-fadeInUp">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-sm font-semibold text-[var(--neutral-700)] tracking-tight">Paragon Pass</span>
          </div>
          <a
            href="/pricing"
            className="text-xs text-[var(--neutral-400)] hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            ตารางราคา →
          </a>
        </nav>

        {/* ═══ Hero Section ═══ */}
        <section className="flex flex-col items-center justify-center flex-1 pt-8 pb-6 sm:pt-16 sm:pb-10 w-full max-w-2xl">
          {/* Clinic badge */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[var(--neutral-200)]/50 rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-[var(--neutral-500)] font-medium tracking-wide">
                Dr.den Clinic — เปิดให้ใช้งานแล้ว
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-brand-text tracking-tight leading-[1.05] mb-6">
              Paragon Pass
            </h1>
            <p className="text-lg sm:text-xl text-[var(--neutral-600)] font-light max-w-lg mx-auto leading-relaxed">
              จำลองราคาหัตถการ
              <span className="gradient-brand-text font-medium"> เปรียบเทียบ </span>
              ทุก Pass
            </p>
            <p className="text-sm text-[var(--neutral-400)] font-light max-w-sm mx-auto leading-relaxed mt-3">
              เลือกหัตถการที่สนใจ ระบบคำนวณให้ทันทีว่า Pass ไหนคุ้มที่สุดสำหรับคุณ
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mt-10 w-full sm:w-auto animate-fadeInUp" style={{ animationDelay: '0.18s' }}>
            <a
              href="/catalog"
              className="group relative px-10 py-4 gradient-brand text-white rounded-2xl font-semibold shadow-brand hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-center text-base overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative z-10">เริ่มจำลองราคา</span>
              <span className="relative z-10 ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="/pricing"
              className="px-10 py-4 bg-white/80 backdrop-blur-sm text-[var(--neutral-600)] rounded-2xl font-medium hover:bg-white hover:shadow-md transition-all duration-300 border border-[var(--neutral-200)]/80 text-center"
            >
              ดูตารางราคา
            </a>
          </div>
        </section>

        {/* ═══ Pass Cards Section ═══ */}
        <section className="w-full max-w-3xl pb-10 animate-fadeInUp" style={{ animationDelay: '0.26s' }}>
          {/* Section label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--neutral-200)]" />
            <span className="text-[11px] text-[var(--neutral-400)] tracking-[0.2em] uppercase font-medium">
              Pass ทั้ง 3 ระดับ
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--neutral-200)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

            {/* ── Silver Pass ── */}
            <a href="/catalog" className="group block">
              <div className="relative bg-white rounded-3xl border border-[var(--neutral-200)]/70 overflow-hidden transition-all duration-400 hover:border-slate-300/80 hover:shadow-[0_20px_60px_-10px_rgba(100,116,139,0.15)] hover:-translate-y-2">
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200" />

                <div className="p-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mb-5 border border-slate-200/60 shadow-sm group-hover:shadow-md transition-shadow">
                    <svg viewBox="0 0 32 32" className="w-7 h-7">
                      <rect x="4" y="8" width="24" height="16" rx="3" fill="none" stroke="#94A3B8" strokeWidth="1.5"/>
                      <path d="M12 8V24" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 2"/>
                      <circle cx="20" cy="16" r="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1"/>
                      <text x="20" y="18.5" textAnchor="middle" fill="#64748B" fontSize="6" fontWeight="700">S</text>
                    </svg>
                  </div>

                  {/* Info */}
                  <p className="text-base font-semibold text-slate-700 mb-0.5">Silver Pass</p>
                  <p className="text-[10px] text-slate-400 tracking-[0.15em] uppercase mb-4">Single-use Ticket</p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2.5">
                      <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-[13px] text-[var(--neutral-500)] font-light">ปลดล็อกราคา Silver</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-[13px] text-[var(--neutral-500)] font-light">ซื้อได้ไม่จำกัดจำนวน</p>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="pt-5 border-t border-[var(--neutral-100)]">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-[var(--neutral-400)] font-light mb-0.5">ค่าตั๋ว</p>
                        <p className="text-3xl font-bold text-slate-700 tabular-nums leading-none">
                          <span className="text-sm font-normal text-slate-400">฿</span>299
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>

            {/* ── Gold Pass ── */}
            <a href="/catalog" className="group block sm:-mt-3 sm:mb-[-12px]">
              <div className="relative bg-white rounded-3xl border-2 border-amber-200 overflow-hidden transition-all duration-400 hover:border-amber-300 hover:shadow-[0_20px_60px_-10px_rgba(217,169,56,0.25)] hover:-translate-y-2 shadow-lg">
                {/* Top accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-gradient-to-r from-amber-500 to-amber-400 text-white text-[9px] font-bold tracking-wider px-3 py-1.5 rounded-full shadow-md">
                    ★ ยอดนิยม
                  </span>
                </div>

                <div className="p-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center mb-5 border border-amber-200/80 shadow-sm group-hover:shadow-md transition-shadow">
                    <svg viewBox="0 0 32 32" className="w-7 h-7">
                      <rect x="4" y="8" width="24" height="16" rx="3" fill="none" stroke="#F59E0B" strokeWidth="1.5"/>
                      <path d="M12 8V24" stroke="#FCD34D" strokeWidth="1" strokeDasharray="3 2"/>
                      <circle cx="20" cy="16" r="4" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1"/>
                      <text x="20" y="18.5" textAnchor="middle" fill="#92400E" fontSize="6" fontWeight="700">G</text>
                      <circle cx="9" cy="12" r="1" fill="#FCD34D"/>
                      <circle cx="26" cy="20" r="0.8" fill="#FCD34D"/>
                    </svg>
                  </div>

                  {/* Info */}
                  <p className="text-base font-semibold text-amber-800 mb-0.5">Gold Pass</p>
                  <p className="text-[10px] text-amber-400 tracking-[0.15em] uppercase mb-4">Single-use Ticket</p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2.5">
                      <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-[13px] text-[var(--neutral-500)] font-light">ราคา Silver + Gold</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-[13px] text-[var(--neutral-500)] font-light">Gold สูงสุด 4 รายการ/ครั้ง</p>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="pt-5 border-t border-amber-100">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-[var(--neutral-400)] font-light mb-0.5">ค่าตั๋ว</p>
                        <p className="text-3xl font-bold text-amber-800 tabular-nums leading-none">
                          <span className="text-sm font-normal text-amber-400">฿</span>999
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <svg className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>

            {/* ── Paragon Card ── */}
            <a href="/catalog" className="group block">
              <div className="relative bg-gradient-to-br from-[#3D243A] via-[#4E2F4B] to-[#5E3A56] rounded-3xl overflow-hidden transition-all duration-400 hover:shadow-[0_20px_60px_-10px_rgba(139,94,131,0.35)] hover:-translate-y-2 shadow-brand">
                {/* Holographic top accent */}
                <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-300 via-amber-300 to-purple-400 animate-shimmer" />
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />

                <div className="relative p-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.08] backdrop-blur-sm flex items-center justify-center mb-5 border border-white/[0.1] group-hover:bg-white/[0.12] transition-colors">
                    <svg viewBox="0 0 32 32" className="w-7 h-7">
                      <rect x="4" y="8" width="24" height="16" rx="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                      <rect x="4" y="12" width="24" height="3" fill="rgba(255,255,255,0.08)"/>
                      <rect x="7" y="18" width="8" height="3" rx="1" fill="rgba(251,191,36,0.3)" stroke="rgba(251,191,36,0.4)" strokeWidth="0.5"/>
                      <circle cx="24" cy="20" r="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
                      <text x="24" y="22" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="4" fontWeight="700">P</text>
                    </svg>
                  </div>

                  {/* Info */}
                  <p className="text-base font-semibold text-white mb-0.5">Paragon Card</p>
                  <p className="text-[10px] text-white/35 tracking-[0.15em] uppercase mb-4">Membership Card</p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2.5">
                      <svg className="w-3.5 h-3.5 text-amber-300/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-[13px] text-white/55 font-light">ราคาดีที่สุดทุกรายการ</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <svg className="w-3.5 h-3.5 text-amber-300/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-[13px] text-white/55 font-light">ใช้ได้ 3 เดือน ไม่จำกัด</p>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="pt-5 border-t border-white/[0.08]">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-white/35 font-light mb-0.5">ค่าบัตร</p>
                        <p className="text-3xl font-bold text-white tabular-nums leading-none">
                          <span className="text-sm font-normal text-white/40">฿</span>2,999
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.15] transition-colors">
                        <svg className="w-4 h-4 text-white/50 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* ═══ How it Works ═══ */}
        <section className="w-full max-w-2xl pb-16 animate-fadeInUp" style={{ animationDelay: '0.34s' }}>
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-[var(--neutral-200)]/50 p-8 shadow-sm">
            <p className="text-center text-[11px] text-[var(--neutral-400)] tracking-[0.2em] uppercase font-medium mb-6">
              วิธีใช้งาน
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: "🛒", label: "เลือกหัตถการ", desc: "เลือกรายการที่สนใจจากแคตตาล็อก" },
                { icon: "⚡", label: "ระบบคำนวณ", desc: "เปรียบเทียบราคาทุก Pass ให้ทันที" },
                { icon: "📱", label: "แชร์ผลลัพธ์", desc: "ดาวน์โหลดรูปหรือส่งทาง LINE" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <p className="text-sm font-medium text-[var(--neutral-700)] mb-1">{item.label}</p>
                  <p className="text-[11px] text-[var(--neutral-400)] font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-6 h-6 rounded-lg gradient-brand flex items-center justify-center">
              <span className="text-white text-[7px] font-bold">P</span>
            </div>
          </div>
          <p className="text-[11px] text-[var(--neutral-300)] font-light tracking-wider">
            Dr.den Clinic · Beauty · Confidence
          </p>
        </footer>
      </div>
    </main>
  );
}
