"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function LoginPage() {
  return (
    <React.Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </React.Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-cream)]">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-soft animate-pulse">
        <div className="h-8 bg-[var(--brand-blush)] rounded w-1/2 mx-auto mb-8" />
        <div className="space-y-4">
          <div className="h-10 bg-[var(--brand-blush)] rounded-xl" />
          <div className="h-10 bg-[var(--brand-blush)] rounded-xl" />
          <div className="h-10 bg-[var(--brand-blush)] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-cream)] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-120px] right-[-80px] w-80 h-80 rounded-full bg-[var(--brand-primary)]/5 blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-60px] w-72 h-72 rounded-full bg-[var(--brand-accent)]/8 blur-3xl" />

      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft relative z-10 animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl gradient-brand flex items-center justify-center shadow-brand">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h1 className="text-2xl font-semibold gradient-brand-text tracking-tight">
            Paragon Pass
          </h1>
          <p className="text-sm text-[var(--neutral-400)] mt-1 font-light">Dr.den Clinic Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5"
            >
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none transition bg-white/70"
              placeholder="admin@paragonpass.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5"
            >
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none transition bg-white/70"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 gradient-brand text-white rounded-xl font-medium shadow-brand hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="text-center text-[11px] text-[var(--neutral-400)] mt-6 font-light">
          Default: admin@paragonpass.com / admin123
        </p>
      </div>
    </div>
  );
}
