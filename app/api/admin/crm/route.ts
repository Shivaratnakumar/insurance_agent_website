import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const supabase = createSupabaseAdminClient();

  const [customers, followups, policies, leads] = await Promise.all([
    supabase
      .from("insurance_customers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500),

    supabase
      .from("insurance_followups")
      .select("*, customer:insurance_customers(id, name, phone)")
      .order("due_at", { ascending: true })
      .limit(500),

    supabase
      .from("insurance_policies")
      .select("*, customer:insurance_customers(id, name, phone)")
      .order("expiry_date", { ascending: true })
      .limit(500),

    supabase
      .from("insurance_leads")
      .select("id, name, phone, status, coverage_need, created_at")
      .neq("status", "converted")
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  const error = customers.error || followups.error || policies.error || leads.error;

  if (error) {
    console.error("CRM load failed:", error.message);
    return NextResponse.json(
      { error: "Unable to load CRM data. Check that the CRM SQL has been run." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    customers: customers.data ?? [],
    followups: followups.data ?? [],
    policies: policies.data ?? [],
    leads: leads.data ?? [],
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const supabase = createSupabaseAdminClient();

    if (body.action === "convert_lead") {
      const leadId = String(body.lead_id || "");

      if (!/^[0-9a-f-]{36}$/i.test(leadId)) {
        return NextResponse.json({ error: "Invalid lead." }, { status: 400 });
      }

      const { data: lead, error: leadError } = await supabase
        .from("insurance_leads")
        .select("id, name, phone, status")
        .eq("id", leadId)
        .single();

      if (leadError || !lead) {
        return NextResponse.json({ error: "Lead not found." }, { status: 404 });
      }

      const { data: existing } = await supabase
        .from("insurance_customers")
        .select("id")
        .eq("source_lead_id", leadId)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "This lead is already a customer." },
          { status: 409 }
        );
      }

      const { data: customer, error } = await supabase
        .from("insurance_customers")
        .insert({
          source_lead_id: leadId,
          name: lead.name,
          phone: lead.phone,
        })
        .select()
        .single();

      if (error) {
        console.error("Lead conversion failed:", error.message);
        return NextResponse.json({ error: "Could not convert lead." }, { status: 500 });
      }

      await supabase
        .from("insurance_leads")
        .update({ status: "converted" })
        .eq("id", leadId);

      return NextResponse.json({ customer });
    }

    if (body.action === "create_customer") {
      const name = String(body.name || "").trim();
      const phone = String(body.phone || "").trim();
      const email = String(body.email || "").trim();
      const dob = body.date_of_birth || null;

      if (name.length < 2 || !/^[0-9+() .-]{10,18}$/.test(phone)) {
        return NextResponse.json(
          { error: "Enter a valid customer name and phone number." },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("insurance_customers")
        .insert({
          name,
          phone,
          email: email || null,
          date_of_birth: dob,
        })
        .select()
        .single();

      if (error) {
        console.error("Customer creation failed:", error.message);
        return NextResponse.json({ error: "Could not create customer." }, { status: 500 });
      }

      return NextResponse.json({ customer: data });
    }

    if (body.action === "create_followup") {
      const customerId = String(body.customer_id || "");
      const dueAt = String(body.due_at || "");
      const note = String(body.note || "").trim();

      if (!/^[0-9a-f-]{36}$/i.test(customerId) || !Number.isFinite(Date.parse(dueAt))) {
        return NextResponse.json(
          { error: "Select a customer and a valid follow-up date." },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("insurance_followups")
        .insert({ customer_id: customerId, due_at: dueAt, note })
        .select()
        .single();

      if (error) {
        console.error("Follow-up creation failed:", error.message);
        return NextResponse.json({ error: "Could not create follow-up." }, { status: 500 });
      }

      return NextResponse.json({ followup: data });
    }

    if (body.action === "create_policy") {
      const customerId = String(body.customer_id || "");
      const insurer = String(body.insurer || "").trim();
      const policyNumber = String(body.policy_number || "").trim();
      const premium = Number(body.premium);
      const expiryDate = String(body.expiry_date || "");
      const startDate = body.start_date ? String(body.start_date) : null;

      if (
        !/^[0-9a-f-]{36}$/i.test(customerId) ||
        !insurer ||
        !Number.isFinite(premium) ||
        premium < 0 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(expiryDate)
      ) {
        return NextResponse.json(
          { error: "Enter valid policy details and expiry date." },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("insurance_policies")
        .insert({
          customer_id: customerId,
          insurer,
          policy_number: policyNumber || null,
          premium,
          start_date: startDate,
          expiry_date: expiryDate,
        })
        .select()
        .single();

      if (error) {
        console.error("Policy creation failed:", error.message);
        return NextResponse.json({ error: "Could not save policy." }, { status: 500 });
      }

      return NextResponse.json({ policy: data });
    }

    return NextResponse.json({ error: "Unknown CRM action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const id = String(body.id || "");
    const status = String(body.status || "");

    if (
      !/^[0-9a-f-]{36}$/i.test(id) ||
      !["pending", "completed", "cancelled"].includes(status)
    ) {
      return NextResponse.json({ error: "Invalid follow-up update." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("insurance_followups")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Follow-up update failed:", error.message);
      return NextResponse.json({ error: "Could not update follow-up." }, { status: 500 });
    }

    return NextResponse.json({ followup: data });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}