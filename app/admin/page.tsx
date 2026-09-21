"use client";

import { useState } from "react";
import { CheckCircle2, Copy, KeyRound, LockKeyhole, Plus, UserPlus } from "lucide-react";

type LeadStatus = "pending" | "paid" | "active";
type Lead = { id: number; name: string; phone: string; package: string; status: LeadStatus; room: string };

const initialLeads: Lead[] = [
  { id: 1, name: "Demo student", phone: "+212 6 00 00 00 00", package: "Pack 3 matières", status: "paid", room: "economie-groupe-a" },
  { id: 2, name: "New registration", phone: "+212 6 11 11 11 11", package: "1 Matière", status: "pending", room: "economie-groupe-a" },
];

export default function AdminPage() {
  const [leads, setLeads] = useState(initialLeads);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [createdAccess, setCreatedAccess] = useState<{ email: string; password: string }>();

  function markPaid(id: number) {
    setLeads((items) => items.map((lead) => lead.id === id ? { ...lead, status: "paid" } : lead));
  }

  function createAccess(lead: Lead) {
    setSelected(lead);
    setCreatedAccess({ email: `${lead.name.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@atelier.local`, password: "Temporary-access" });
    setLeads((items) => items.map((item) => item.id === lead.id ? { ...item, status: "active" } : item));
  }

  return (
    <main className="min-h-screen bg-[#f7f3ee] px-4 py-6 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-maroc.red">Atelier admin</p><h1 className="mt-2 text-3xl font-black">Admissions & access</h1><p className="mt-1 text-sm text-slate-500">Review registrations, confirm payment, and prepare classroom access.</p></div>
          <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm"><LockKeyhole size={16} className="text-maroc.green" /> Admin preview</div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[{ label: "New registrations", value: leads.filter((lead) => lead.status === "pending").length }, { label: "Paid", value: leads.filter((lead) => lead.status === "paid").length }, { label: "Active access", value: leads.filter((lead) => lead.status === "active").length }].map((stat) => <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{stat.label}</p><p className="mt-2 text-3xl font-black">{stat.value}</p></div>)}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-black">Registration queue</h2><p className="mt-1 text-sm text-slate-500">Confirm payment before creating access.</p></div><button type="button" className="flex items-center gap-2 rounded-xl bg-maroc.green px-4 py-2 text-sm font-extrabold text-white"><Plus size={16} /> Add student</button></div>
          <div className="divide-y divide-slate-100">{leads.map((lead) => <div key={lead.id} className="grid gap-4 p-5 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-center"><div><p className="font-black">{lead.name}</p><p className="text-sm text-slate-500">{lead.phone}</p></div><p className="text-sm text-slate-600">{lead.package}<br /><span className="text-xs text-slate-400">{lead.room}</span></p><span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${lead.status === "pending" ? "bg-amber-50 text-amber-700" : lead.status === "paid" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}>{lead.status === "pending" ? "Payment pending" : lead.status === "paid" ? "Paid" : "Access active"}</span><div className="flex flex-wrap gap-2">{lead.status === "pending" && <button type="button" onClick={() => markPaid(lead.id)} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"><CheckCircle2 size={14} className="mr-1 inline" />Mark paid</button>}{lead.status !== "pending" && <button type="button" onClick={() => createAccess(lead)} className="rounded-lg bg-maroc.green px-3 py-2 text-xs font-bold text-white"><UserPlus size={14} className="mr-1 inline" />{lead.status === "active" ? "View access" : "Create access"}</button>}</div></div>)}</div>
        </section>

        {createdAccess && selected && <section className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wider text-maroc.green">Access prepared for {selected.name}</p><h2 className="mt-1 text-xl font-black">Send these details privately</h2><div className="mt-4 grid gap-2 text-sm sm:grid-cols-2"><p><span className="font-bold">Login:</span> {createdAccess.email}</p><p><span className="font-bold">Temporary password:</span> {createdAccess.password}</p></div></div><button type="button" aria-label="Copy access details" onClick={() => navigator.clipboard?.writeText(`${createdAccess.email}\n${createdAccess.password}`)} className="rounded-lg bg-white p-3 text-slate-700 shadow-sm"><Copy size={17} /></button></div><p className="mt-4 text-xs text-green-800">Preview only: production account creation must use Supabase Auth on the server. Do not send this password in a public message.</p></section>}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600"><KeyRound size={17} className="mr-2 inline text-maroc.red" />Next production step: protect this dashboard with the teacher account, read leads from Supabase, and create real users through the server-side Supabase Admin API.</div>
      </div>
    </main>
  );
}