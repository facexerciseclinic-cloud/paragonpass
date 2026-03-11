export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--brand-cream)] relative overflow-hidden">
      {/* Soft ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--brand-primary)]/5 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[var(--brand-accent)]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen px-5 sm:px-6">

        {/* ═══ Hero Section ═══ */}
        <section className="flex flex-col items-center justify-center flex-1 pt-16 pb-8 sm:pt-24 sm:pb-12 w-full max-w-2xl">
          {/* Clinic badge */}
          <div className="animate-fadeInUp">
            <div className="inline-flex items-center gap-2.5 bg-white/60 backdrop-blur-sm border border-[var(--neutral-200)]/60 rounded-full px-4 py-1.5 mb-8">
              <div className="w-5 h-5 rounded-full gradient-brand flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">P</span>
              </div>
              <span className="text-xs text-[var(--neutral-500)] font-medium tracking-wide">
                Dr.den Clinic
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.08s' }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-brand-text tracking-tight leading-[1.1] mb-5">
              Paragon Pass
            </h1>
            <p className="text-base sm:text-lg text-[var(--neutral-500)] font-light max-w-md mx-auto leading-relaxed mb-2">
              ระบบจำลองราคาหัตถการความงาม
            </p>
            <p className="text-sm text-[var(--neutral-400)] font-light max-w-sm mx-auto leading-relaxed">
              เลือกหัตถการที่สนใจ แล้วดูว่า Pass ไหนคุ้มที่สุดสำหรับคุณ
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mt-10 w-full sm:w-auto animate-fadeInUp" style={{ animationDelay: '0.16s' }}>
            <a
              href="/catalog"
              className="group relative px-8 py-3.5 gradient-brand text-white rounded-2xl font-semibold shadow-brand hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-center text-[15px]"
            >
              เริ่มจำลองราคา
              <span className="ml-1.5 inline-block group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="/pricing"
              className="px-8 py-3.5 bg-white/70 backdrop-blur-sm text-[var(--neutral-600)] rounded-2xl font-medium hover:bg-white transition-all duration-300 border border-[var(--neutral-200)]/80 text-center text-[15px]"
            >
              ดูตารางราคา
            </a>
          </div>
        </section>

        {/* ═══ Pass Cards Section ═══ */}
        <section className="w-full max-w-3xl pb-20 animate-fadeInUp" style={{ animationDelay: '0.24s' }}>
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--neutral-200)]" />
            <span className="text-[11px] text-[var(--neutral-400)] tracking-[0.15em] uppercase font-medium">
              เลือก Pass ที่ใช่
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--neutral-200)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* ── Silver Pass ── */}
            <a href="/catalog" className="group block">
              <div className="relative bg-white rounded-2xl border border-[var(--neutral-200)]/80 overflow-hidden transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1">
                {/* Top accent */}
                <div className="h-1 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300" />

                <div className="p-5 pt-4">
                  {/* Icon + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-slate-600">S</span>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-slate-700">Silver Pass</p>
                      <p className="text-[10px] text-slate-400 tracking-wider uppercase">Single-use</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <p className="text-xs text-[var(--neutral-500)] font-light">ปลดล็อกราคา Silver</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <p className="text-xs text-[var(--neutral-500)] font-light">ซื้อได้ไม่จำกัดจำนวน</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between pt-4 border-t border-[var(--neutral-100)]">
                    <div>
                      <p className="text-[10px] text-[var(--neutral-400)] font-light">ค่าตั๋ว</p>
                      <p className="text-2xl font-bold text-slate-700 tabular-nums">
                        <span className="text-xs font-normal text-slate-400">฿</span>299
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors font-light">
                      เลือก →
                    </span>
                  </div>
                </div>
              </div>
            </a>

            {/* ── Gold Pass ── */}
            <a href="/catalog" className="group block sm:-mt-2 sm:mb-[-8px]">
              <div className="relative bg-white rounded-2xl border-2 border-amber-300/80 overflow-hidden transition-all duration-300 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 shadow-md">
                {/* Top accent */}
                <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
                {/* Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-amber-500 text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    ยอดนิยม
                  </span>
                </div>

                <div className="p-5 pt-4">
                  {/* Icon + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-amber-700">G</span>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-amber-800">Gold Pass</p>
                      <p className="text-[10px] text-amber-400 tracking-wider uppercase">Single-use</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-300" />
                      <p className="text-xs text-[var(--neutral-500)] font-light">ราคา Silver + Gold</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-300" />
                      <p className="text-xs text-[var(--neutral-500)] font-light">Gold สูงสุด 4 รายการ/ครั้ง</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between pt-4 border-t border-amber-100">
                    <div>
                      <p className="text-[10px] text-[var(--neutral-400)] font-light">ค่าตั๋ว</p>
                      <p className="text-2xl font-bold text-amber-800 tabular-nums">
                        <span className="text-xs font-normal text-amber-400">฿</span>999
                      </p>
                    </div>
                    <span className="text-xs text-amber-400 group-hover:text-amber-600 transition-colors font-light">
                      เลือก →
                    </span>
                  </div>
                </div>
              </div>
            </a>

            {/* ── Paragon Card ── */}
            <a href="/catalog" className="group block">
              <div className="relative bg-gradient-to-br from-[#3D243A] to-[#5E3A56] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-brand">
                {/* Holographic top accent */}
                <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 animate-shimmer" />

                <div className="p-5 pt-4">
                  {/* Icon + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15">
                      <span className="text-sm font-bold text-amber-200">P</span>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-white">Paragon Card</p>
                      <p className="text-[10px] text-white/40 tracking-wider uppercase">Membership</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-300/60" />
                      <p className="text-xs text-white/60 font-light">ราคาดีที่สุดทุกรายการ</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-300/60" />
                      <p className="text-xs text-white/60 font-light">ใช้ได้ 3 เดือน ไม่จำกัด</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between pt-4 border-t border-white/10">
                    <div>
                      <p className="text-[10px] text-white/40 font-light">ค่าบัตร</p>
                      <p className="text-2xl font-bold text-white tabular-nums">
                        <span className="text-xs font-normal text-white/50">฿</span>2,999
                      </p>
                    </div>
                    <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors font-light">
                      เลือก →
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* How it works */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {[
              { step: "1", label: "เลือกหัตถการ", desc: "เลือกรายการที่สนใจ" },
              { step: "2", label: "ระบบคำนวณ", desc: "เปรียบเทียบทุก Pass" },
              { step: "3", label: "ดูผลลัพธ์", desc: "แชร์หรือบันทึกรูป" },
            ].map((item) => (
              <div key={item.step}>
                <div className="w-8 h-8 rounded-full bg-[var(--brand-blush)] flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs font-semibold text-[var(--brand-primary)]">{item.step}</span>
                </div>
                <p className="text-xs font-medium text-[var(--neutral-600)]">{item.label}</p>
                <p className="text-[10px] text-[var(--neutral-400)] font-light mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-8 text-center">
          <p className="text-[11px] text-[var(--neutral-300)] font-light tracking-wider">
            Dr.den Clinic · Beauty · Confidence
          </p>
        </footer>
      </div>
    </main>
  );
}
