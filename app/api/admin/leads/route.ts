import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const allowedStatuses = new Set([
  "new",
  "contacted",
  "follow_up",
  "converted",
  "not_interested",
]);

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("insurance_leads")
    .select("id, name, phone, coverage_need, message, language, status, consent, source, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("Admin leads fetch failed:", error.message);
    return NextResponse.json({ error: "Unable to load leads." }, { status: 500 });
  }

  return NextResponse.json({ leads: data ?? [] });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    const status = typeof body.status === "string" ? body.status : "";

    if (!/^[0-9a-f-]{36}$/i.test(id) || !allowedStatuses.has(status)) {
      return NextResponse.json({ error: "Invalid lead or status." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("insurance_leads")
      .update({ status })
      .eq("id", id)
      .select("id, status")
      .single();

    if (error) {
      console.error("Lead status update failed:", error.message);
      return NextResponse.json({ error: "Unable to update lead." }, { status: 500 });
    }

    return NextResponse.json({ lead: data });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
