export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--brand-cream)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--brand-primary)]/5 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[var(--brand-accent)]/8 blur-3xl" />
        <div className="absolute top-[30%] left-[20%] w-[200px] h-[200px] rounded-full bg-[var(--brand-accent-rose)]/6 blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo & Brand */}
        <div className="text-center mb-12 animate-fadeInUp">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--brand-accent)]" />
            <span className="text-[var(--brand-accent)] text-xs tracking-[0.3em] uppercase font-light">
              Dr.den Clinic
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--brand-accent)]" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold gradient-brand-text tracking-tight mb-3">
            Paragon Pass
          </h1>
          <p className="text-lg text-[var(--neutral-500)] font-light max-w-lg mx-auto leading-relaxed">
            ระบบจำลองราคาหัตถการความงาม
          </p>
          <p className="text-sm text-[var(--neutral-400)] font-light max-w-md mx-auto mt-2 leading-relaxed">
            เลือกหัตถการที่สนใจ ระบบจะคำนวณให้ทันทีว่า
            <br className="hidden sm:block" />
            ซื้อ Pass แบบไหนถึงจะคุ้มค่าที่สุดสำหรับคุณ
          </p>
        </div>

        {/* Pass Tier Preview */}
        <div className="flex flex-col sm:flex-row gap-5 mb-12 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          {/* Silver Pass - Ticket Style */}
          <div className="relative group min-w-[200px] card-hover">
            <div className="relative bg-gradient-to-br from-gray-50 via-slate-100 to-gray-50 rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
              {/* Ticket perforated edge */}
              <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col justify-around py-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[var(--brand-cream)]" />
                ))}
              </div>
              <div className="pl-5 pr-5 py-5 text-center">
                {/* Ticket icon */}
                <div className="w-12 h-12 mx-auto mb-3 relative">
                  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                    <rect x="4" y="10" width="40" height="28" rx="4" className="fill-slate-200/80 stroke-slate-400" strokeWidth="1.5"/>
                    <path d="M16 10V38" className="stroke-slate-300" strokeWidth="1.5" strokeDasharray="3 3"/>
                    <circle cx="24" cy="24" r="6" className="fill-slate-400/30 stroke-slate-500" strokeWidth="1"/>
                    <text x="24" y="27" textAnchor="middle" className="fill-slate-600 text-[10px] font-bold">S</text>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">Silver Pass</p>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase mt-0.5">Single-use Ticket</p>
                <p className="text-xs text-[var(--neutral-400)] mt-1.5">ปลดล็อกราคา Silver</p>
                <p className="text-[10px] text-[var(--neutral-400)] mt-0.5 font-light">ซื้อได้ไม่จำกัดจำนวน</p>
                <div className="mt-3 pt-2 border-t border-slate-200/80">
                  <p className="text-[10px] text-[var(--neutral-400)] font-light">ค่าตั๋ว</p>
                  <p className="text-lg font-bold text-slate-700 tabular-nums">฿299</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gold Pass - Ticket Style */}
          <div className="relative group min-w-[200px] card-hover">
            <div className="relative bg-gradient-to-br from-amber-50/80 via-yellow-50 to-orange-50/60 rounded-2xl border border-amber-300 shadow-gold overflow-hidden">
              {/* Ticket perforated edge */}
              <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col justify-around py-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[var(--brand-cream)]" />
                ))}
              </div>
              <div className="pl-5 pr-5 py-5 text-center">
                {/* Ticket icon */}
                <div className="w-12 h-12 mx-auto mb-3 relative">
                  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                    <rect x="4" y="10" width="40" height="28" rx="4" className="fill-amber-200/60 stroke-amber-400" strokeWidth="1.5"/>
                    <path d="M16 10V38" className="stroke-amber-300" strokeWidth="1.5" strokeDasharray="3 3"/>
                    <circle cx="24" cy="24" r="6" className="fill-amber-300/40 stroke-amber-500" strokeWidth="1"/>
                    <text x="24" y="27" textAnchor="middle" className="fill-amber-700 text-[10px] font-bold">G</text>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-amber-800">Gold Pass</p>
                <p className="text-[10px] text-amber-400 tracking-wider uppercase mt-0.5">Single-use Ticket</p>
                <p className="text-xs text-[var(--neutral-400)] mt-1.5">ราคา Silver + Gold</p>
                <p className="text-[10px] text-[var(--neutral-400)] mt-0.5 font-light">Gold สูงสุด 4 รายการ/ครั้ง</p>
                <div className="mt-3 pt-2 border-t border-amber-200/80">
                  <p className="text-[10px] text-[var(--neutral-400)] font-light">ค่าตั๋ว</p>
                  <p className="text-lg font-bold text-amber-800 tabular-nums">฿999</p>
                </div>
              </div>
            </div>
          </div>

          {/* Paragon Card - Card Style */}
          <div className="relative group min-w-[200px] card-hover">
            <div className="relative bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-rose-50/40 rounded-2xl border border-purple-300 shadow-brand overflow-hidden">
              <div className="px-5 py-5 text-center">
                {/* Card icon */}
                <div className="w-14 h-10 mx-auto mb-3 relative">
                  <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
                    <rect x="2" y="2" width="52" height="36" rx="6" className="fill-purple-200/50 stroke-purple-400" strokeWidth="1.5"/>
                    <rect x="2" y="10" width="52" height="6" className="fill-purple-400/40"/>
                    <rect x="8" y="22" width="16" height="4" rx="1" className="fill-purple-300/60"/>
                    <rect x="8" y="29" width="24" height="3" rx="1" className="fill-purple-200/60"/>
                    <circle cx="44" cy="26" r="5" className="fill-purple-300/40 stroke-purple-500" strokeWidth="0.8"/>
                    <text x="44" y="29" textAnchor="middle" className="fill-purple-700 text-[8px] font-bold">P</text>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-purple-800">Paragon Card</p>
                <p className="text-[10px] text-purple-400 tracking-wider uppercase mt-0.5">Membership Card</p>
                <p className="text-xs text-[var(--neutral-400)] mt-1.5">ราคาดีที่สุดทุกรายการ</p>
                <p className="text-[10px] text-[var(--neutral-400)] mt-0.5 font-light">ใช้ได้ 3 เดือน ไม่จำกัด</p>
                <div className="mt-3 pt-2 border-t border-purple-200/80">
                  <p className="text-[10px] text-[var(--neutral-400)] font-light">ค่าบัตร</p>
                  <p className="text-lg font-bold text-purple-800 tabular-nums">฿2,999</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <a
            href="/catalog"
            className="group relative px-8 py-3.5 gradient-brand text-white rounded-2xl font-medium shadow-brand hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-center"
          >
            <span className="relative z-10">เริ่มจำลองราคา</span>
            <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a
            href="/pricing"
            className="px-8 py-3.5 bg-white/60 backdrop-blur-sm text-[var(--neutral-600)] rounded-2xl font-medium hover:bg-white/90 transition-all duration-300 border border-[var(--neutral-200)] text-center"
          >
            ดูตารางราคาทั้งหมด
          </a>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-8 flex items-center gap-2 text-[var(--neutral-400)] text-xs">
          <div className="w-1 h-1 rounded-full bg-[var(--brand-accent)]" />
          <span className="font-light tracking-wider">Dr.den Clinic • Beauty • Confidence</span>
          <div className="w-1 h-1 rounded-full bg-[var(--brand-accent)]" />
        </div>
      </div>
    </main>
  );
}
