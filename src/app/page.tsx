export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--brand-cream)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-15%] w-[600px] h-[600px] rounded-full bg-[var(--brand-primary)]/6 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-15%] w-[500px] h-[500px] rounded-full bg-[var(--brand-accent)]/10 blur-[100px]" />
        <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] rounded-full bg-[var(--brand-accent-rose)]/8 blur-[80px]" />
        <div className="absolute bottom-[30%] right-[20%] w-[250px] h-[250px] rounded-full bg-purple-300/6 blur-[90px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-12">
        {/* Logo & Brand */}
        <div className="text-center mb-14 animate-fadeInUp">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--brand-accent)] to-transparent" />
            <span className="text-[var(--brand-accent)] text-[11px] tracking-[0.4em] uppercase font-light">
              Dr.den Clinic
            </span>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--brand-accent)] to-transparent" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-brand-text tracking-tight mb-4">
            Paragon Pass
          </h1>
          <p className="text-lg sm:text-xl text-[var(--neutral-500)] font-light max-w-lg mx-auto leading-relaxed">
            ระบบจำลองราคาหัตถการความงาม
          </p>
          <p className="text-sm text-[var(--neutral-400)] font-light max-w-md mx-auto mt-3 leading-relaxed">
            เลือกหัตถการที่สนใจ ระบบจะคำนวณให้ทันทีว่า
            <br className="hidden sm:block" />
            ซื้อ Pass แบบไหนถึงจะคุ้มค่าที่สุดสำหรับคุณ
          </p>
        </div>

        {/* Pass Tier Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5 mb-14 w-full max-w-3xl animate-fadeInUp" style={{ animationDelay: '0.15s' }}>

          {/* ── Silver Pass ── */}
          <div className="relative group">
            {/* Glow behind */}
            <div className="absolute -inset-1 bg-gradient-to-br from-slate-300/30 via-slate-200/20 to-slate-400/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-white via-slate-50 to-gray-100 rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden card-hover">
              {/* Ticket perforated edge */}
              <div className="absolute left-0 top-0 bottom-0 w-2.5 flex flex-col justify-around py-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-[var(--brand-cream)] shadow-inner" />
                ))}
              </div>
              {/* Tear line */}
              <div className="absolute left-[14px] top-0 bottom-0 border-l border-dashed border-slate-200/60" />
              {/* Shine sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />

              <div className="relative pl-7 pr-5 py-6 text-center">
                {/* Ticket illustration */}
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner" />
                  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full relative z-10">
                    <rect x="8" y="14" width="48" height="36" rx="6" className="fill-white/80 stroke-slate-300" strokeWidth="1.5"/>
                    <path d="M24 14V50" className="stroke-slate-200" strokeWidth="1.5" strokeDasharray="4 3"/>
                    <circle cx="36" cy="32" r="8" className="fill-slate-100 stroke-slate-400" strokeWidth="1"/>
                    <text x="36" y="36" textAnchor="middle" className="fill-slate-600 text-[14px] font-bold">S</text>
                    <rect x="28" y="42" width="16" height="2" rx="1" className="fill-slate-200"/>
                  </svg>
                </div>

                <p className="text-base font-bold text-slate-700 tracking-tight">Silver Pass</p>
                <p className="text-[10px] text-slate-400 tracking-[0.2em] uppercase mt-1 font-medium">Single-use Ticket</p>

                <div className="mt-3 space-y-0.5">
                  <p className="text-xs text-[var(--neutral-500)]">ปลดล็อกราคา Silver</p>
                  <p className="text-[10px] text-[var(--neutral-400)] font-light">ซื้อได้ไม่จำกัดจำนวน</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80">
                  <p className="text-[10px] text-[var(--neutral-400)] font-light mb-1">ค่าตั๋ว</p>
                  <p className="text-2xl font-extrabold text-slate-700 tabular-nums">
                    <span className="text-sm font-normal text-slate-400 mr-0.5">฿</span>299
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Gold Pass ── */}
          <div className="relative group sm:scale-105 sm:-mt-2 sm:mb-[-8px] z-10">
            {/* Glow behind */}
            <div className="absolute -inset-1.5 bg-gradient-to-br from-amber-300/40 via-yellow-200/30 to-orange-300/40 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-50/60 rounded-3xl border border-amber-300/80 shadow-gold overflow-hidden card-hover">
              {/* Popular badge */}
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-l from-amber-500 to-amber-400 text-white text-[9px] font-bold tracking-wider uppercase px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow-md">
                  ยอดนิยม
                </div>
              </div>
              {/* Ticket perforated edge */}
              <div className="absolute left-0 top-0 bottom-0 w-2.5 flex flex-col justify-around py-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-[var(--brand-cream)] shadow-inner" />
                ))}
              </div>
              {/* Tear line */}
              <div className="absolute left-[14px] top-0 bottom-0 border-l border-dashed border-amber-200/60" />
              {/* Gold shimmer sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/60 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />

              <div className="relative pl-7 pr-5 py-6 text-center">
                {/* Ticket illustration */}
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/80 shadow-inner" />
                  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full relative z-10">
                    <rect x="8" y="14" width="48" height="36" rx="6" className="fill-amber-50/90 stroke-amber-400" strokeWidth="1.5"/>
                    <path d="M24 14V50" className="stroke-amber-200" strokeWidth="1.5" strokeDasharray="4 3"/>
                    <circle cx="36" cy="32" r="8" className="fill-amber-100 stroke-amber-500" strokeWidth="1"/>
                    <text x="36" y="36" textAnchor="middle" className="fill-amber-700 text-[14px] font-bold">G</text>
                    <rect x="28" y="42" width="16" height="2" rx="1" className="fill-amber-200"/>
                    {/* Star decorations */}
                    <circle cx="16" cy="22" r="1.5" className="fill-amber-300/60"/>
                    <circle cx="50" cy="44" r="1" className="fill-amber-300/40"/>
                  </svg>
                </div>

                <p className="text-base font-bold text-amber-800 tracking-tight">Gold Pass</p>
                <p className="text-[10px] text-amber-500 tracking-[0.2em] uppercase mt-1 font-medium">Single-use Ticket</p>

                <div className="mt-3 space-y-0.5">
                  <p className="text-xs text-[var(--neutral-500)]">ราคา Silver + Gold</p>
                  <p className="text-[10px] text-[var(--neutral-400)] font-light">Gold สูงสุด 4 รายการ/ครั้ง</p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/80">
                  <p className="text-[10px] text-[var(--neutral-400)] font-light mb-1">ค่าตั๋ว</p>
                  <p className="text-2xl font-extrabold text-amber-800 tabular-nums">
                    <span className="text-sm font-normal text-amber-400 mr-0.5">฿</span>999
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Paragon Card ── */}
          <div className="relative group">
            {/* Glow behind - premium purple */}
            <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 via-pink-300/20 to-rose-400/30 rounded-3xl blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-purple-50 via-pink-50/50 to-rose-50/40 rounded-3xl border border-purple-300/70 shadow-brand overflow-hidden card-hover">
              {/* Holographic stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-shimmer" />
              {/* Shine sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/40 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />

              <div className="relative px-5 py-6 text-center">
                {/* Card illustration - premium */}
                <div className="w-20 h-14 mx-auto mb-4 relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-200/60 to-pink-200/40 shadow-inner" />
                  <svg viewBox="0 0 80 56" fill="none" className="w-full h-full relative z-10">
                    {/* Card body */}
                    <rect x="4" y="4" width="72" height="48" rx="8" className="fill-white/70 stroke-purple-300" strokeWidth="1.5"/>
                    {/* Magnetic stripe */}
                    <rect x="4" y="14" width="72" height="8" className="fill-purple-400/30"/>
                    <rect x="4" y="14" width="72" height="8" className="fill-purple-400/20" style={{ mask: 'url(#stripe-mask)' }}/>
                    {/* Chip */}
                    <rect x="12" y="28" width="14" height="10" rx="2" className="fill-amber-200/80 stroke-amber-400/60" strokeWidth="0.8"/>
                    <line x1="19" y1="28" x2="19" y2="38" className="stroke-amber-300/60" strokeWidth="0.5"/>
                    <line x1="12" y1="33" x2="26" y2="33" className="stroke-amber-300/60" strokeWidth="0.5"/>
                    {/* Card number dots */}
                    <circle cx="36" cy="36" r="1" className="fill-purple-300/50"/>
                    <circle cx="40" cy="36" r="1" className="fill-purple-300/50"/>
                    <circle cx="44" cy="36" r="1" className="fill-purple-300/50"/>
                    <circle cx="48" cy="36" r="1" className="fill-purple-300/50"/>
                    {/* Logo circle */}
                    <circle cx="62" cy="36" r="7" className="fill-purple-100 stroke-purple-400" strokeWidth="0.8"/>
                    <text x="62" y="40" textAnchor="middle" className="fill-purple-700 text-[10px] font-bold">P</text>
                    {/* Name line */}
                    <rect x="12" y="44" width="30" height="2" rx="1" className="fill-purple-200/60"/>
                  </svg>
                </div>

                <p className="text-base font-bold text-purple-800 tracking-tight">Paragon Card</p>
                <p className="text-[10px] text-purple-400 tracking-[0.2em] uppercase mt-1 font-medium">Membership Card</p>

                <div className="mt-3 space-y-0.5">
                  <p className="text-xs text-[var(--neutral-500)]">ราคาดีที่สุดทุกรายการ</p>
                  <p className="text-[10px] text-[var(--neutral-400)] font-light">ใช้ได้ 3 เดือน ไม่จำกัด</p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-200/80">
                  <p className="text-[10px] text-[var(--neutral-400)] font-light mb-1">ค่าบัตร</p>
                  <p className="text-2xl font-extrabold text-purple-800 tabular-nums">
                    <span className="text-sm font-normal text-purple-400 mr-0.5">฿</span>2,999
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <a
            href="/catalog"
            className="group relative px-10 py-4 gradient-brand text-white rounded-2xl font-semibold shadow-brand hover:shadow-lg transition-all duration-300 hover:scale-[1.03] text-center text-base"
          >
            <span className="relative z-10">เริ่มจำลองราคา</span>
            <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a
            href="/pricing"
            className="px-10 py-4 bg-white/70 backdrop-blur-sm text-[var(--neutral-600)] rounded-2xl font-medium hover:bg-white transition-all duration-300 border border-[var(--neutral-200)] text-center"
          >
            ดูตารางราคาทั้งหมด
          </a>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-8 flex items-center gap-2 text-[var(--neutral-400)] text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-accent-rose)]" />
          <span className="font-light tracking-wider">Dr.den Clinic • Beauty • Confidence</span>
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[var(--brand-accent-rose)] to-[var(--brand-accent)]" />
        </div>
      </div>
    </main>
  );
}
