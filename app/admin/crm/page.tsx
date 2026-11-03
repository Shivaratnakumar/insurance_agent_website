"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  Users,
  CalendarClock,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Phone,
  MessageCircle,
  CheckCircle2,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  date_of_birth: string | null;
  created_at: string;
};

type Lead = {
  id: string;
  name: string;
  phone: string;
  status: string;
  coverage_need: string;
};

type Followup = {
  id: string;
  customer_id: string;
  due_at: string;
  note: string;
  status: "pending" | "completed" | "cancelled";
  customer?: { id: string; name: string; phone: string };
};

type Policy = {
  id: string;
  customer_id: string;
  insurer: string;
  policy_number: string | null;
  premium: number;
  expiry_date: string;
  status: string;
  customer?: { id: string; name: string; phone: string };
};

type CrmData = {
  customers: Customer[];
  leads: Lead[];
  followups: Followup[];
  policies: Policy[];
};

const emptyData: CrmData = {
  customers: [],
  leads: [],
  followups: [],
  policies: [],
};

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isWithinNextDays(dateValue: string, days: number) {
  const today = new Date();
  const date = new Date(`${dateValue}T00:00:00`);
  const end = new Date();
  end.setDate(today.getDate() + days);

  const thisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate());
  if (thisYear < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    thisYear.setFullYear(today.getFullYear() + 1);
  }

  return thisYear >= today && thisYear <= end;
}

export default function CrmPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CrmData>(emptyData);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerDob, setCustomerDob] = useState("");

  const [selectedLead, setSelectedLead] = useState("");
  const [followupCustomer, setFollowupCustomer] = useState("");
  const [followupDate, setFollowupDate] = useState("");
  const [followupNote, setFollowupNote] = useState("");

  const [policyCustomer, setPolicyCustomer] = useState("");
  const [insurer, setInsurer] = useState("TATA AIG");
  const [policyNumber, setPolicyNumber] = useState("");
  const [premium, setPremium] = useState("");
  const [policyStart, setPolicyStart] = useState("");
  const [policyExpiry, setPolicyExpiry] = useState("");

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/crm", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || "Unable to load CRM.");
        setLoading(false);
        return;
      }

      setData(payload);
    } catch {
      setError("Could not connect to the CRM server.");
    }

    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: sessionData }) => {
      if (sessionData.session) {
        setSignedIn(true);
        void loadData();
      } else {
        setLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setSignedIn(false);
    setData(emptyData);
  }

  async function submitAction(body: Record<string, unknown>) {
    setError("");
    setNotice("");

    const response = await fetch("/api/admin/crm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error || "The operation failed.");
      return false;
    }

    setNotice("Saved successfully.");
    await loadData();
    return true;
  }

  async function convertLead() {
    if (!selectedLead) {
      setError("Select a lead to convert.");
      return;
    }

    const success = await submitAction({
      action: "convert_lead",
      lead_id: selectedLead,
    });

    if (success) setSelectedLead("");
  }

  async function createCustomer(e: FormEvent) {
    e.preventDefault();

    const success = await submitAction({
      action: "create_customer",
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      date_of_birth: customerDob || null,
    });

    if (success) {
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setCustomerDob("");
    }
  }

  async function createFollowup(e: FormEvent) {
    e.preventDefault();

    const success = await submitAction({
      action: "create_followup",
      customer_id: followupCustomer,
      due_at: new Date(followupDate).toISOString(),
      note: followupNote,
    });

    if (success) {
      setFollowupDate("");
      setFollowupNote("");
    }
  }

  async function createPolicy(e: FormEvent) {
    e.preventDefault();

    const success = await submitAction({
      action: "create_policy",
      customer_id: policyCustomer,
      insurer,
      policy_number: policyNumber,
      premium,
      start_date: policyStart || null,
      expiry_date: policyExpiry,
    });

    if (success) {
      setPolicyNumber("");
      setPremium("");
      setPolicyStart("");
      setPolicyExpiry("");
    }
  }

  async function updateFollowup(id: string, status: Followup["status"]) {
    setError("");
    setNotice("");

    const response = await fetch("/api/admin/crm", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error || "Could not update follow-up.");
      return;
    }

    setNotice("Follow-up updated.");
    await loadData();
  }

  const today = new Date().toISOString().slice(0, 10);

  const pendingFollowups = data.followups.filter(
    item => item.status === "pending"
  );

  const dueFollowups = pendingFollowups.filter(
    item => item.due_at.slice(0, 10) <= today
  );

  const upcomingPolicies = data.policies.filter(
    policy =>
      policy.status === "active" &&
      policy.expiry_date >= today &&
      policy.expiry_date <= new Date(Date.now() + 30 * 86400000)
        .toISOString()
        .slice(0, 10)
  );

  const birthdays = data.customers.filter(
    customer =>
      customer.date_of_birth &&
      isWithinNextDays(customer.date_of_birth, 30)
  );

  const activePolicies = data.policies.filter(
    policy => policy.status === "active"
  );

  if (!signedIn) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow">
          <ShieldCheck className="mx-auto text-navy-900" size={40} />
          <h1 className="mt-4 text-xl font-black text-navy-950">
            Consultant CRM
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Please sign in through your existing admin page first.
          </p>
          <Link
            href="/admin"
            className="mt-6 inline-flex rounded-full bg-navy-900 px-6 py-3 font-bold text-white"
          >
            Go to Admin Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-shell flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
            >
              <ArrowLeft size={15} /> Back to lead management
            </Link>
            <p className="text-xs font-black uppercase tracking-widest text-amber-700">
              Shivaratnakumar Patil
            </p>
            <h1 className="mt-1 text-2xl font-black text-navy-950">
              Consultant CRM
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-navy-900"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-bold text-white"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="container-shell space-y-7 py-8">
        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            {notice}
          </p>
        )}

        {loading ? (
          <p className="rounded-xl bg-white p-8 text-center text-slate-500">
            Loading CRM...
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Customers",
                  value: data.customers.length,
                  icon: Users,
                },
                {
                  label: "Pending follow-ups",
                  value: pendingFollowups.length,
                  icon: CalendarClock,
                },
                {
                  label: "Due / overdue",
                  value: dueFollowups.length,
                  icon: CheckCircle2,
                },
                {
                  label: "Active policies",
                  value: activePolicies.length,
                  icon: ShieldCheck,
                },
              ].map(item => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500">
                      {item.label}
                    </p>
                    <item.icon className="text-amber-700" size={21} />
                  </div>
                  <p className="mt-3 text-3xl font-black text-navy-950">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <form
                onSubmit={createCustomer}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h2 className="flex items-center gap-2 text-lg font-black text-navy-950">
                  <Plus size={19} /> Add customer
                </h2>
                <div className="mt-4 grid gap-3">
                  <input
                    required
                    minLength={2}
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Customer name"
                    className="rounded-xl border border-slate-300 px-4 py-3"
                  />
                  <input
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="Phone number"
                    className="rounded-xl border border-slate-300 px-4 py-3"
                  />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="Email (optional)"
                    className="rounded-xl border border-slate-300 px-4 py-3"
                  />
                  <label className="grid gap-1 text-sm text-slate-600">
                    Date of birth (optional)
                    <input
                      type="date"
                      value={customerDob}
                      onChange={e => setCustomerDob(e.target.value)}
                      className="rounded-xl border border-slate-300 px-4 py-3"
                    />
                  </label>
                  <button className="rounded-full bg-navy-900 px-5 py-3 font-bold text-white">
                    Save customer
                  </button>
                </div>
              </form>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black text-navy-950">
                  Convert website lead
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create a customer record from an existing enquiry.
                </p>
                <div className="mt-4 grid gap-3">
                  <select
                    value={selectedLead}
                    onChange={e => setSelectedLead(e.target.value)}
                    className="rounded-xl border border-slate-300 px-4 py-3"
                  >
                    <option value="">Select an unconverted lead</option>
                    {data.leads.map(lead => (
                      <option key={lead.id} value={lead.id}>
                        {lead.name} · {lead.phone} · {lead.status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={convertLead}
                    disabled={!selectedLead}
                    className="rounded-full bg-amber-700 px-5 py-3 font-bold text-white disabled:opacity-50"
                  >
                    Convert lead to customer
                  </button>
                </div>
              </div>

              <form
                onSubmit={createFollowup}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-black text-navy-950">
                  Schedule follow-up
                </h2>
                <div className="mt-4 grid gap-3">
                  <select
                    required
                    value={followupCustomer}
                    onChange={e => setFollowupCustomer(e.target.value)}
                    className="rounded-xl border border-slate-300 px-4 py-3"
                  >
                    <option value="">Select customer</option>
                    {data.customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} · {customer.phone}
                      </option>
                    ))}
                  </select>
                  <label className="grid gap-1 text-sm text-slate-600">
                    Follow-up date and time
                    <input
                      required
                      type="datetime-local"
                      value={followupDate}
                      onChange={e => setFollowupDate(e.target.value)}
                      className="rounded-xl border border-slate-300 px-4 py-3"
                    />
                  </label>
                  <textarea
                    value={followupNote}
                    onChange={e => setFollowupNote(e.target.value)}
                    placeholder="Reason / notes for follow-up"
                    rows={3}
                    className="rounded-xl border border-slate-300 px-4 py-3"
                  />
                  <button
                    disabled={!data.customers.length}
                    className="rounded-full bg-navy-900 px-5 py-3 font-bold text-white disabled:opacity-50"
                  >
                    Save follow-up
                  </button>
                </div>
              </form>

              <form
                onSubmit={createPolicy}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-black text-navy-950">
                  Add insurance policy
                </h2>
                <div className="mt-4 grid gap-3">
                  <select
                    required
                    value={policyCustomer}
                    onChange={e => setPolicyCustomer(e.target.value)}
                    className="rounded-xl border border-slate-300 px-4 py-3"
                  >
                    <option value="">Select customer</option>
                    {data.customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} · {customer.phone}
                      </option>
                    ))}
                  </select>
                  <input
                    required
                    value={insurer}
                    onChange={e => setInsurer(e.target.value)}
                    placeholder="Insurance company"
                    className="rounded-xl border border-slate-300 px-4 py-3"
                  />
                  <input
                    value={policyNumber}
                    onChange={e => setPolicyNumber(e.target.value)}
                    placeholder="Policy number (optional)"
                    className="rounded-xl border border-slate-300 px-4 py-3"
                  />
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={premium}
                    onChange={e => setPremium(e.target.value)}
                    placeholder="Annual premium (₹)"
                    className="rounded-xl border border-slate-300 px-4 py-3"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1 text-sm text-slate-600">
                      Start date
                      <input
                        type="date"
                        value={policyStart}
                        onChange={e => setPolicyStart(e.target.value)}
                        className="rounded-xl border border-slate-300 px-3 py-3"
                      />
                    </label>
                    <label className="grid gap-1 text-sm text-slate-600">
                      Expiry date
                      <input
                        required
                        type="date"
                        value={policyExpiry}
                        onChange={e => setPolicyExpiry(e.target.value)}
                        className="rounded-xl border border-slate-300 px-3 py-3"
                      />
                    </label>
                  </div>
                  <button
                    disabled={!data.customers.length}
                    className="rounded-full bg-navy-900 px-5 py-3 font-bold text-white disabled:opacity-50"
                  >
                    Save policy
                  </button>
                </div>
              </form>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black text-navy-950">
                  Follow-ups
                </h2>
                <div className="mt-4 space-y-3">
                  {pendingFollowups.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No pending follow-ups.
                    </p>
                  )}
                  {pendingFollowups.map(item => (
                    <article
                      key={item.id}
                      className="rounded-xl border border-slate-100 p-4"
                    >
                      <p className="font-bold text-navy-950">
                        {item.customer?.name || "Customer"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {dateLabel(item.due_at)} ·{" "}
                        {new Date(item.due_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.note || "No notes"}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.customer?.phone && (
                          <>
                            <a
                              href={`tel:${item.customer.phone}`}
                              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold"
                            >
                              <Phone size={13} /> Call
                            </a>
                            <a
                              href={`https://wa.me/91${item.customer.phone.replace(/\D/g, "").slice(-10)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"
                            >
                              <MessageCircle size={13} /> WhatsApp
                            </a>
                          </>
                        )}
                        <button
                          onClick={() => updateFollowup(item.id, "completed")}
                          className="rounded-full bg-emerald-700 px-3 py-2 text-xs font-bold text-white"
                        >
                          Mark completed
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black text-navy-950">
                  Policies expiring in 30 days
                </h2>
                <div className="mt-4 space-y-3">
                  {upcomingPolicies.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No active policies expiring in the next 30 days.
                    </p>
                  )}
                  {upcomingPolicies.map(policy => (
                    <article
                      key={policy.id}
                      className="rounded-xl border border-slate-100 p-4"
                    >
                      <p className="font-bold text-navy-950">
                        {policy.customer?.name || "Customer"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {policy.insurer} · {policy.policy_number || "No policy number"}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-amber-700">
                        Expires: {dateLabel(policy.expiry_date)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Premium: ₹{Number(policy.premium).toLocaleString("en-IN")}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black text-navy-950">
                  Birthdays in the next 30 days
                </h2>
                <div className="mt-4 space-y-3">
                  {birthdays.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No upcoming birthdays recorded.
                    </p>
                  )}
                  {birthdays.map(customer => (
                    <article
                      key={customer.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"
                    >
                      <div>
                        <p className="font-bold text-navy-950">
                          {customer.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          Birthday: {dateLabel(customer.date_of_birth!)}
                        </p>
                      </div>
                      <a
                        href={`https://wa.me/91${customer.phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(`Wishing you a very happy birthday, ${customer.name}! 🎂`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"
                      >
                        Send greeting
                      </a>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black text-navy-950">
                  Recent customers
                </h2>
                <div className="mt-4 space-y-3">
                  {data.customers.slice(0, 10).map(customer => (
                    <article
                      key={customer.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"
                    >
                      <div>
                        <p className="font-bold text-navy-950">
                          {customer.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {customer.phone}
                        </p>
                      </div>
                      <a
                        href={`tel:${customer.phone}`}
                        className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-navy-900"
                      >
                        Call customer
                      </a>
                    </article>
                  ))}
                  {data.customers.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No customers added yet.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </>
        )}

        <p className="text-xs leading-5 text-slate-500">
          Store customer and policy details only with appropriate permission.
          Restrict CRM access, use secure devices, and avoid sharing customer
          records or policy documents through unsecured channels. Follow
          applicable privacy and insurance regulations.
        </p>
      </section>
    </main>
  );
}