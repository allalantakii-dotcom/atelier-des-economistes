"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase-browser";

type Role = "student" | "teacher";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!supabase) {
      setError("Supabase is not configured. Add the Supabase URL and publishable key first.");
      return;
    }
    setLoading(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (signInError || !data.user) {
      setError(signInError?.message || "Email or password is incorrect.");
      return;
    }
    const identity = data.user.user_metadata?.full_name || data.user.email || "student";
    router.push(`/classroom/economie-groupe-a?role=${role}&identity=${encodeURIComponent(identity)}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-md"><Logo light />
        <div className="mt-12 rounded-3xl bg-white p-8 text-slate-900 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-maroc.red">Academy access</p>
          <h1 className="mt-3 text-3xl font-black">Enter your classroom</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Use the email and password created by the academy administrator.</p>

          <div className="mt-7 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
            <button type="button" onClick={() => setRole("student")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold ${role === "student" ? "bg-white text-maroc.green shadow-sm" : "text-slate-500"}`}><GraduationCap size={16} /> Student</button>
            <button type="button" onClick={() => setRole("teacher")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold ${role === "teacher" ? "bg-white text-maroc.red shadow-sm" : "text-slate-500"}`}><ShieldCheck size={16} /> Teacher</button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-bold text-slate-700"><span className="mb-2 block">Email</span><input required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-maroc.green" type="email" autoComplete="email" placeholder="student@example.com" /></label>
            <label className="block text-sm font-bold text-slate-700"><span className="mb-2 block">Password</span><input required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-maroc.green" type="password" autoComplete="current-password" placeholder="Your password" /></label>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
            <button disabled={loading} type="submit" className="auth-submit-button flex w-full items-center justify-center gap-2 rounded-xl p-4 font-extrabold shadow-lg transition disabled:cursor-wait disabled:opacity-60">{loading ? "Signing in..." : role === "teacher" ? "Start class" : "Join class"}<ArrowRight size={18} /></button>
          </form>
          <p className="mt-5 text-center text-xs leading-5 text-slate-400">Accounts are created by the academy administrator after payment confirmation.</p>
        </div>
      </div>
    </main>
  );
}