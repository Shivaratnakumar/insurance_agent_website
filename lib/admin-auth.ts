import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Please sign in." }, { status: 401 }),
    };
  }

  const allowedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!allowedEmail || user.email?.toLowerCase() !== allowedEmail) {
    return {
      user: null,
      response: NextResponse.json({ error: "You are not authorised." }, { status: 403 }),
    };
  }

  return { user, response: null };
}
