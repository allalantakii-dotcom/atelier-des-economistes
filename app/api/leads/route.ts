import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const studentPhone = body.student_whatsapp || body.whatsapp;
    const parentPhone = body.parent_whatsapp;

    if (!body.full_name || !studentPhone || !parentPhone || !body.level || !body.package || !body.payment_method) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (url && key) {
      const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
      await supabase.from("leads").insert({
        role: body.role || "student",
        full_name: body.full_name,
        whatsapp: studentPhone,
        academic_level: body.level,
        package_name: body.package,
        payment_method: body.payment_method,
        status: "pending",
      });
    }

    if (process.env.N8N_WEBHOOK_URL) {
      await fetch(process.env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.N8N_WEBHOOK_SECRET ? { "x-atelier-secret": process.env.N8N_WEBHOOK_SECRET } : {}),
        },
        body: JSON.stringify({ ...body, student_whatsapp: studentPhone, parent_whatsapp: parentPhone }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}