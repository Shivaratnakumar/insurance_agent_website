import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const allowedCoverage = new Set([
  "Myself",
  "My family",
  "My parents",
  "Myself + family + parents",
]);

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  try {
    // Simple honeypot field for basic bot filtering.
    const body = await request.json();
    if (cleanText(body.website, 200)) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const name = cleanText(body.name, 100);
    const phone = cleanText(body.phone, 18);
    const coverageNeed = cleanText(body.coverageNeed, 60);
    const message = cleanText(body.message, 1500);
    const language = body.language === "kn" ? "kn" : "en";
    const consent = body.consent === true;

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    if (!/^[0-9+() .-]{10,18}$/.test(phone) || phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Please enter a valid mobile number." }, { status: 400 });
    }

    if (!allowedCoverage.has(coverageNeed)) {
      return NextResponse.json({ error: "Please select who needs cover." }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: "Please provide consent to submit your enquiry." }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return NextResponse.json({ error: "Lead service is not configured yet." }, { status: 503 });
    }

    // Public/anon client: RLS permits INSERT only. It cannot read leads.
    const supabase = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error } = await supabase.from("insurance_leads").insert({
      name,
      phone,
      coverage_need: coverageNeed,
      message,
      language,
      consent,
      source: "website",
    });

    if (error) {
      console.error("Supabase lead insert failed:", error.message);
      return NextResponse.json({ error: "Unable to save your enquiry. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Your enquiry has been received." });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ error: "Invalid request. Please try again." }, { status: 400 });
  }
}
