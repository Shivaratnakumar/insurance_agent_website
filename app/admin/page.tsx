"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Download, LogOut, RefreshCw, Search, ShieldCheck, Phone, MessageCircle } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  phone: string;
  coverage_need: string;
  message: string;
  language: "en" | "kn";
  status: "new" | "contacted" | "follow_up" | "converted" | "not_interested";
  created_at: string;
};

const statusLabels: Record<Lead["status"], string> = {
  new: "New",
  contacted: "Contacted",
  follow_up: "Follow-up",
  converted: "Converted",
  not_interested: "Not interested",
};

const statusStyles: Record<Lead["status"], string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  follow_up: "bg-violet-50 text-violet-700",
  converted: "bg-emerald-50 text-emerald-700",
  not_interested: "bg-slate-100 text-slate-600",
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  async function loadLeads() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/leads", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Could not load leads.");
      setLoading(false);
      return;
    }
    setLeads(payload.leads ?? []);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSignedIn(true);
        void loadLeads();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSignedIn(true);
    await loadLeads();
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSignedIn(false);
    setLeads([]);
  }

  async function updateStatus(id: string, status: Lead["status"]) {
    setNotice("");
    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Could not update status.");
      return;
    }
    setLeads(current => current.map(lead => lead.id === id ? { ...lead, status } : lead));
    setNotice("Lead status updated.");
  }

  const filtered = leads.filter(lead => {
    const matchesStatus = filter === "all" || lead.status === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q || [lead.name, lead.phone, lead.coverage_need, lead.message].some(value => value?.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const counts = {
    total: leads.length,
    new: leads.filter(x => x.status === "new").length,
    followUp: leads.filter(x => x.status === "follow_up").length,
    converted: leads.filter(x => x.status === "converted").length,
  };

  function exportCsv() {
    const columns = ["name", "phone", "coverage_need", "message", "language", "status", "created_at"];
    const quote = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [columns.join(","), ...filtered.map(row => columns.map(key => quote(row[key as keyof Lead])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "health-insurance-leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!signedIn) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
        <form onSubmit={signIn} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy-900 text-white"><ShieldCheck size={27}/></div>
          <h1 className="mt-5 text-center text-2xl font-black text-navy-950">Consultant Admin</h1>
          <p className="mt-2 text-center text-sm text-slate-500">Sign in to manage your health insurance enquiries.</p>
          {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <label className="mt-6 grid gap-2 text-sm font-bold text-slate-700">Admin email
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-navy-700"/>
          </label>
          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Password
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-navy-700"/>
          </label>
          <button disabled={loading} className="mt-6 w-full rounded-full bg-navy-900 px-5 py-3.5 font-extrabold text-white hover:bg-navy-800 disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button>
          <p className="mt-4 text-center text-xs leading-5 text-slate-500">Only the email configured in ADMIN_EMAIL is authorised to view leads.</p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-shell flex flex-wrap items-center justify-between gap-4 py-5">
          <div><p className="text-xs font-black uppercase tracking-widest text-amber-700">Shivaratnakumar Patil</p><h1 className="mt-1 text-2xl font-black text-navy-950">Lead management</h1></div>
          <div className="flex gap-2">
            <button onClick={loadLeads} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-navy-900"><RefreshCw size={16}/>Refresh</button>
            <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-navy-900"><Download size={16}/>Export CSV</button>
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-bold text-white"><LogOut size={16}/>Sign out</button>
          </div>
        </div>
      </header>

      <section className="container-shell py-8">
        {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total leads", counts.total, "All enquiries"],
            ["New", counts.new, "Awaiting first contact"],
            ["Follow-up", counts.followUp, "Need another touchpoint"],
            ["Converted", counts.converted, "Marked as converted"],
          ].map(([label, value, hint]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-navy-950">{value}</p><p className="mt-1 text-xs text-slate-400">{hint}</p></div>)}
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, phone or enquiry..." className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-navy-700"/></div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700">
            <option value="all">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="follow_up">Follow-up</option><option value="converted">Converted</option><option value="not_interested">Not interested</option>
          </select>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 font-extrabold text-navy-950">Customer enquiries ({filtered.length})</div>
          {loading ? <p className="p-8 text-center text-slate-500">Loading leads...</p> : filtered.length === 0 ? <p className="p-10 text-center text-slate-500">No enquiries found yet.</p> : (
            <div className="divide-y divide-slate-100">
              {filtered.map(lead => <article key={lead.id} className="grid gap-4 p-5 lg:grid-cols-[1.2fr_1fr_1.2fr_auto] lg:items-center">
                <div><p className="font-extrabold text-navy-950">{lead.name}</p><p className="mt-1 text-xs text-slate-500">{new Date(lead.created_at).toLocaleString()} · {lead.language === "kn" ? "Kannada" : "English"}</p><p className="mt-2 text-sm text-slate-600">{lead.coverage_need}</p></div>
                <div className="flex flex-wrap gap-2"><a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-navy-900"><Phone size={15}/>{lead.phone}</a><a href={`https://wa.me/91${lead.phone.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700"><MessageCircle size={15}/>WhatsApp</a></div>
                <div><p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{lead.message || "No additional message"}</p></div>
                <div className="min-w-[155px]"><span className={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[lead.status]}`}>{statusLabels[lead.status]}</span><select value={lead.status} onChange={e=>updateStatus(lead.id, e.target.value as Lead["status"])} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold"><option value="new">New</option><option value="contacted">Contacted</option><option value="follow_up">Follow-up</option><option value="converted">Converted</option><option value="not_interested">Not interested</option></select></div>
              </article>)}
            </div>
          )}
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">Customer information is personal data. Use it only to respond to the enquiry, restrict dashboard access, and follow applicable privacy and consent requirements. CSV exports should be stored securely.</p>
      </section>
    </main>
  );
}
