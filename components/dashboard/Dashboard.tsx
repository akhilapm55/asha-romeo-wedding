"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  PlaneLanding,
  PlaneTakeoff,
  Car,
  Shirt,
  Utensils,
  Search,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react";

/** Canonical guest shape. Resilient to header casing from the Sheet. */
interface Guest {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  flightNumber: string;
  arrivalAirport: string;
  arrivalTime: string;
  transportRequired: string;
  dietaryPreference: string;
  dietaryNotes: string;
  traditionalAttireRequired: string;
  departureAirport: string;
  departureTime: string;
  departureTransportRequired: string;
}

const HEADERS: { key: keyof Guest; label: string }[] = [
  { key: "timestamp", label: "Timestamp" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "flightNumber", label: "Flight Number" },
  { key: "arrivalAirport", label: "Arrival Airport" },
  { key: "arrivalTime", label: "Arrival Time" },
  { key: "transportRequired", label: "Transport Required" },
  { key: "dietaryPreference", label: "Dietary Preference" },
  { key: "dietaryNotes", label: "Dietary Notes" },
  { key: "traditionalAttireRequired", label: "Traditional Attire Required" },
  { key: "departureAirport", label: "Departure Airport" },
  { key: "departureTime", label: "Departure Time" },
  { key: "departureTransportRequired", label: "Departure Transport Required" },
];

/** Read a value from a raw row by fuzzy header match. */
function pick(row: Record<string, unknown>, ...names: string[]): string {
  const keys = Object.keys(row);
  for (const n of names) {
    const hit = keys.find(
      (k) => k.toLowerCase().replace(/[^a-z]/g, "") === n.toLowerCase().replace(/[^a-z]/g, "")
    );
    if (hit != null && row[hit] != null) return String(row[hit]);
  }
  return "";
}

function normalise(row: Record<string, unknown>): Guest {
  return {
    timestamp: pick(row, "timestamp", "time", "date"),
    name: pick(row, "name"),
    email: pick(row, "email"),
    phone: pick(row, "phone"),
    whatsapp: pick(row, "whatsapp"),
    flightNumber: pick(row, "flightnumber", "flight"),
    arrivalAirport: pick(row, "arrivalairport"),
    arrivalTime: pick(row, "arrivaltime"),
    transportRequired: pick(row, "transportrequired"),
    dietaryPreference: pick(row, "dietarypreference"),
    dietaryNotes: pick(row, "dietarynotes"),
    traditionalAttireRequired: pick(row, "traditionalattirerequired", "traditionaldress"),
    departureAirport: pick(row, "departureairport"),
    departureTime: pick(row, "departuretime"),
    departureTransportRequired: pick(row, "departuretransportrequired"),
  };
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-white/70 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-palm">
        <Icon size={16} />
        <span className="font-sans text-[0.66rem] uppercase tracking-wide2 text-ink-faint">
          {label}
        </span>
      </div>
      <p className="mt-2 font-serif text-3xl text-palm">{value}</p>
      {sub && <p className="mt-1 font-sans text-[0.72rem] text-ink-faint">{sub}</p>}
    </div>
  );
}

function countBy(list: Guest[], key: keyof Guest) {
  const m: Record<string, number> = {};
  for (const g of list) {
    const v = (g[key] || "—").trim() || "—";
    m[v] = (m[v] || 0) + 1;
  }
  return m;
}
const fmt = (m: Record<string, number>) =>
  Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}: ${v}`)
    .join("  ·  ");

export default function Dashboard({ accessKey }: { accessKey: string }) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [fArrival, setFArrival] = useState("");
  const [fTransport, setFTransport] = useState("");
  const [fDiet, setFDiet] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/guests?key=${encodeURIComponent(accessKey)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load.");
      setGuests((data.rows as Record<string, unknown>[]).map(normalise));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      if (fArrival && g.arrivalAirport !== fArrival) return false;
      if (fTransport && g.transportRequired !== fTransport) return false;
      if (fDiet && g.dietaryPreference !== fDiet) return false;
      if (q) {
        const hay = `${g.name} ${g.phone} ${g.whatsapp} ${g.flightNumber}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [guests, q, fArrival, fTransport, fDiet]);

  const uniq = (k: keyof Guest) =>
    Array.from(new Set(guests.map((g) => g[k]).filter(Boolean))) as string[];

  const exportCsv = () => {
    const rows = [
      HEADERS.map((h) => h.label),
      ...filtered.map((g) => HEADERS.map((h) => g[h.key] ?? "")),
    ];
    const csv = rows
      .map((r) =>
        r
          .map((c) => `"${String(c).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `rsvps-${filtered.length}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const selectCls =
    "rounded-lg border border-gold/30 bg-white px-3 py-2 font-sans text-sm text-ink outline-none focus:border-gold";

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-sans text-[0.66rem] uppercase tracking-luxe text-gold-dark">
            Private · Asha &amp; Romeo
          </p>
          <h1 className="font-serif text-4xl text-palm">Guest Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 font-sans text-xs uppercase tracking-wide2 text-palm transition hover:bg-gold/10"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={exportCsv}
            disabled={!filtered.length}
            className="flex items-center gap-2 rounded-full bg-palm px-4 py-2 font-sans text-xs uppercase tracking-wide2 text-ivory transition hover:bg-palm-dark disabled:opacity-40"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 font-sans text-sm text-terracotta">
          {error}
        </div>
      )}

      {/* stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Users} label="Total Guests" value={guests.length} sub={`${filtered.length} shown`} />
        <Stat icon={Car} label="Transport Required" value={countBy(guests, "transportRequired")["Yes"] || 0} sub="arrival pickups" />
        <Stat icon={Shirt} label="Traditional Dress" value={countBy(guests, "traditionalAttireRequired")["Yes"] || 0} sub="saree / mundu" />
        <Stat icon={PlaneLanding} label="Arrival Airport" value={Object.keys(countBy(filtered, "arrivalAirport")).length} sub={fmt(countBy(guests, "arrivalAirport"))} />
        <Stat icon={PlaneTakeoff} label="Departure Airport" value={Object.keys(countBy(filtered, "departureAirport")).length} sub={fmt(countBy(guests, "departureAirport"))} />
        <Stat icon={Utensils} label="Dietary Preference" value={Object.keys(countBy(guests, "dietaryPreference")).length} sub={fmt(countBy(guests, "dietaryPreference"))} />
        <Stat icon={Car} label="Dep. Transport" value={countBy(guests, "departureTransportRequired")["Yes"] || 0} sub="departure drops" />
      </div>

      {/* controls */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, flight…"
            className="w-full rounded-lg border border-gold/30 bg-white py-2 pl-9 pr-3 font-sans text-sm outline-none focus:border-gold"
          />
        </div>
        <select className={selectCls} value={fArrival} onChange={(e) => setFArrival(e.target.value)}>
          <option value="">Arrival: All</option>
          {uniq("arrivalAirport").map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select className={selectCls} value={fTransport} onChange={(e) => setFTransport(e.target.value)}>
          <option value="">Transport: All</option>
          <option>Yes</option>
          <option>No</option>
        </select>
        <select className={selectCls} value={fDiet} onChange={(e) => setFDiet(e.target.value)}>
          <option value="">Diet: All</option>
          {uniq("dietaryPreference").map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </div>

      {/* table */}
      <div className="overflow-x-auto rounded-2xl border border-gold/20 bg-white/70">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-ink-faint">
            <Loader2 className="animate-spin" size={18} /> Loading RSVPs…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center font-sans text-sm text-ink-faint">
            {guests.length === 0 ? "No RSVPs yet." : "No guests match these filters."}
          </div>
        ) : (
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-gold/20 bg-sand-light/50">
                {HEADERS.map((h) => (
                  <th
                    key={h.key}
                    className="whitespace-nowrap px-3 py-3 font-sans text-[0.62rem] uppercase tracking-wide2 text-palm"
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => (
                <tr key={i} className="border-b border-gold/10 hover:bg-gold/5">
                  {HEADERS.map((h) => (
                    <td key={h.key} className="whitespace-nowrap px-3 py-2.5 text-ink-soft">
                      {g[h.key] || <span className="text-ink-faint/50">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="mt-4 font-sans text-[0.68rem] text-ink-faint">
        Showing {filtered.length} of {guests.length} RSVPs · This page is private and holds guest
        contact details — do not share the link or key.
      </p>
    </div>
  );
}
