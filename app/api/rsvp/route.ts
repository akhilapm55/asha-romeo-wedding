import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Field order MUST match the Google Sheet schema (see /apps-script/Code.gs). */
const FIELDS = [
  "name",
  "phone",
  "whatsapp",
  "flightNumber",
  "arrivalAirport",
  "arrivalTime",
  "transportRequired",
  "stayRequired",
  "attirePreference",
  "dietaryPreference",
  "dietaryNotes",
  "traditionalAttireRequired",
  "departureAirport",
  "departureTime",
  "departureTransportRequired",
] as const;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Server-side validation of the required fields.
  const required = ["name", "phone", "whatsapp"];
  const missing = required.filter(
    (k) => typeof body[k] !== "string" || !(body[k] as string).trim()
  );
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required field(s): ${missing.join(", ")}` },
      { status: 422 }
    );
  }

  // Normalise to a clean, ordered payload (strings only, trimmed).
  const payload: Record<string, string> = {};
  for (const f of FIELDS) {
    const v = body[f];
    payload[f] = typeof v === "string" ? v.trim() : "";
  }

  const url = process.env.APPS_SCRIPT_RSVP_URL;

  if (!url) {
    // Local preview convenience: let the success UX run in dev without a backend.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[rsvp] APPS_SCRIPT_RSVP_URL not set — running in preview mode, RSVP NOT stored:",
        payload
      );
      return NextResponse.json({ ok: true, stored: false, preview: true });
    }
    return NextResponse.json(
      { error: "RSVP is not configured yet. Please contact the couple." },
      { status: 503 }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error("[rsvp] Apps Script responded", res.status);
      return NextResponse.json(
        { error: "We couldn't save your RSVP. Please try again shortly." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("[rsvp] forward failed", err);
    return NextResponse.json(
      { error: "Network error reaching the RSVP service. Please try again." },
      { status: 502 }
    );
  }
}
