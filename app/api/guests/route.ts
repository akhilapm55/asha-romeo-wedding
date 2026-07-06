import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Private read endpoint for the guest dashboard.
 * Gated by DASHBOARD_ACCESS_KEY. Fetches rows from the Apps Script `doGet`
 * (same Web App URL as RSVP) server-side so the sheet/script URL never
 * reaches the browser.
 */
export async function GET(req: NextRequest) {
  const key =
    req.nextUrl.searchParams.get("key") || req.headers.get("x-dashboard-key");
  const expected = process.env.DASHBOARD_ACCESS_KEY;

  if (!expected) {
    return NextResponse.json(
      { error: "Dashboard is not configured (missing DASHBOARD_ACCESS_KEY)." },
      { status: 503 }
    );
  }
  if (!key || key !== expected) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = process.env.APPS_SCRIPT_RSVP_URL;
  if (!url) {
    return NextResponse.json(
      { error: "RSVP source not configured (missing APPS_SCRIPT_RSVP_URL)." },
      { status: 503 }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Sheet source responded ${res.status}.` },
        { status: 502 }
      );
    }
    const data = await res.json();
    // Apps Script doGet returns { rows: [...] }.
    const rows = Array.isArray(data) ? data : data.rows ?? [];
    return NextResponse.json({ rows });
  } catch (err) {
    console.error("[guests] fetch failed", err);
    return NextResponse.json(
      { error: "Could not reach the RSVP source." },
      { status: 502 }
    );
  }
}
