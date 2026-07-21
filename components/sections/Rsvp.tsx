"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, PartyPopper } from "lucide-react";
import { rsvp as rsvpCopy, eventMeta } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";
import SectionHeading from "@/components/ui/SectionHeading";
import { Ornament, PalmLeaf } from "@/components/ui/Decor";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/cn";

type FormState = {
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
};

const initial: FormState = {
  name: "",
  email: "",
  phone: "",
  whatsapp: "",
  flightNumber: "",
  arrivalAirport: "",
  arrivalTime: "",
  transportRequired: "",
  dietaryPreference: "",
  dietaryNotes: "",
  traditionalAttireRequired: "",
  departureAirport: "",
  departureTime: "",
  departureTransportRequired: "",
};

/* ---- field primitives ---- */
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block font-sans text-[0.68rem] uppercase tracking-wide2 text-gold-dark">
      {children}
      {required && <span className="ml-0.5 text-terracotta">✱</span>}
    </label>
  );
}

const fieldCls =
  "peer w-full rounded-xl border border-gold/25 bg-ivory/40 px-4 py-3 font-sans text-sm text-ink outline-none transition-all duration-300 placeholder:text-ink-faint/60 focus:border-gold focus:bg-ivory/70 focus:shadow-[0_0_0_3px_rgba(191,159,99,0.15)]";

function Text({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: boolean;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(fieldCls, error && "border-terracotta focus:border-terracotta")}
      />
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  required,
  helper,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
  helper?: string;
  error?: boolean;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(fieldCls, "appearance-none", error && "border-terracotta", !value && "text-ink-faint/70")}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-ink">
            {o}
          </option>
        ))}
      </select>
      {helper && <p className="mt-1 font-sans text-[0.68rem] text-ink-faint">{helper}</p>}
    </div>
  );
}

function GroupTitle({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="col-span-full mt-2">
      <div className="flex items-center gap-3">
        <span className="script-accent text-2xl text-gold">{n}</span>
        <span className="font-sans text-[0.7rem] uppercase tracking-luxe text-palm">{title}</span>
        <span className="h-px flex-1 bg-gold/25" />
      </div>
      {note && (
        <p className="mt-2 font-sans text-[0.72rem] leading-relaxed text-ink-faint">
          {note}
        </p>
      )}
    </div>
  );
}

export default function Rsvp() {
  const [form, setForm] = useState<FormState>(initial);
  const [sameWhats, setSameWhats] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const reduced = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);

  const set = (k: keyof FormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleSame = (checked: boolean) => {
    setSameWhats(checked);
    if (checked) set("whatsapp", form.phone);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof FormState)[] = ["name", "email"];
    const miss = required.filter((k) => !form[k].trim());
    setMissing(miss as string[]);
    if (miss.length) {
      setStatus("error");
      setErrorMsg("Please fill in your name and email address.");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please check your connection and try again.");
    }
  };

  return (
    <section
      id="rsvp"
      className="section-shell relative overflow-hidden bg-ivory-warm py-28 sm:py-36"
    >
      <PalmLeaf className="pointer-events-none absolute -left-8 top-16 w-36 rotate-12 text-palm/10" />
      <PalmLeaf className="pointer-events-none absolute -right-8 bottom-16 w-36 -rotate-12 text-olive/10" />

      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Will you join us?"
          title="RSVP"
          script="we would be honoured"
        />

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass mt-14 rounded-3xl px-8 py-16 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 180, damping: 12 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-palm text-ivory"
              >
                <PartyPopper size={28} />
              </motion.div>
              <h3 className="font-serif text-4xl text-palm">{rsvpCopy.successTitle}</h3>
              <Ornament className="mx-auto my-6 w-40" />
              <p className="mx-auto max-w-md font-sans text-ink-soft">{rsvpCopy.successBody}</p>
              <p className="mt-8 script-accent text-3xl text-gold">See you in Nileshwaram</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              ref={formRef}
              onSubmit={submit}
              initial={reduced ? false : { opacity: 0, y: 30 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="glass mt-14 rounded-3xl p-6 sm:p-10"
            >
              {rsvpCopy.deadline && (
                <p className="mb-8 text-center font-sans text-xs uppercase tracking-wide2 text-terracotta">
                  Kindly reply by {rsvpCopy.deadline}
                </p>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <GroupTitle n="01" title="Who's coming" />
                <Text
                  label="Full name"
                  name="name"
                  value={form.name}
                  onChange={(v) => set("name", v)}
                  required
                  placeholder="Your name"
                  error={missing.includes("name")}
                />
                <Text
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(v) => set("email", v)}
                  required
                  placeholder="you@example.com"
                  error={missing.includes("email")}
                />
                <Text
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => {
                    set("phone", v);
                    if (sameWhats) set("whatsapp", v);
                  }}
                  placeholder="+1 / +91 … (optional)"
                />
                <div>
                  <Text
                    label="WhatsApp"
                    name="whatsapp"
                    type="tel"
                    value={form.whatsapp}
                    onChange={(v) => set("whatsapp", v)}
                    placeholder="Where we'll send updates (optional)"
                  />
                  <label className="mt-2 flex cursor-pointer items-center gap-2 font-sans text-[0.72rem] text-ink-soft">
                    <input
                      type="checkbox"
                      checked={sameWhats}
                      onChange={(e) => toggleSame(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="flex h-4 w-4 items-center justify-center rounded border border-gold/50 peer-checked:bg-palm peer-checked:text-ivory">
                      {sameWhats && <Check size={11} />}
                    </span>
                    Same as phone
                  </label>
                </div>

                <GroupTitle
                  n="02"
                  title="Arrival"
                  note="All optional — share your flight details only if you have them. It simply helps us arrange your airport pickup. You can always tell us later."
                />
                <Text
                  label="Flight number (optional)"
                  name="flightNumber"
                  value={form.flightNumber}
                  onChange={(v) => set("flightNumber", v)}
                  placeholder="e.g. EK 508 — if you know it"
                />
                <Select
                  label="Arrival airport"
                  name="arrivalAirport"
                  value={form.arrivalAirport}
                  onChange={(v) => set("arrivalAirport", v)}
                  options={["Mangalore", "Kannur"]}
                />
                <Text
                  label="Arrival date & time"
                  name="arrivalTime"
                  type="datetime-local"
                  value={form.arrivalTime}
                  onChange={(v) => set("arrivalTime", v)}
                />
                <Select
                  label="Transport required?"
                  name="transportRequired"
                  value={form.transportRequired}
                  onChange={(v) => set("transportRequired", v)}
                  options={["Yes", "No"]}
                />

                <GroupTitle n="03" title="Preferences" />
                <Select
                  label="Dietary preference"
                  name="dietaryPreference"
                  value={form.dietaryPreference}
                  onChange={(v) => set("dietaryPreference", v)}
                  options={["Veg", "Non-veg", "Vegan", "Jain", "Other"]}
                />
                <Select
                  label="Traditional attire required?"
                  name="traditionalAttireRequired"
                  value={form.traditionalAttireRequired}
                  onChange={(v) => set("traditionalAttireRequired", v)}
                  options={["Yes", "No"]}
                  helper="We can help arrange saree / blouse / mundu"
                />
                <AnimatePresence>
                  {form.dietaryPreference === "Other" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden sm:col-span-2"
                    >
                      <Text
                        label="Dietary notes / allergies"
                        name="dietaryNotes"
                        value={form.dietaryNotes}
                        onChange={(v) => set("dietaryNotes", v)}
                        placeholder="Anything we should know?"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <GroupTitle
                  n="04"
                  title="Departure"
                  note="Also optional — leave blank if your plans aren't fixed yet."
                />
                <Select
                  label="Departure airport"
                  name="departureAirport"
                  value={form.departureAirport}
                  onChange={(v) => set("departureAirport", v)}
                  options={["Kannur", "Mangalore"]}
                />
                <Text
                  label="Departure date & time"
                  name="departureTime"
                  type="datetime-local"
                  value={form.departureTime}
                  onChange={(v) => set("departureTime", v)}
                />
                <Select
                  label="Departure transport required?"
                  name="departureTransportRequired"
                  value={form.departureTransportRequired}
                  onChange={(v) => set("departureTransportRequired", v)}
                  options={["Yes", "No"]}
                />
              </div>

              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-center font-sans text-sm text-terracotta"
                >
                  {errorMsg}
                </motion.p>
              )}

              <div className="mt-10 flex flex-col items-center gap-3">
                <MagneticButton type="submit" variant="solid" className="min-w-[220px]">
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    "Send our RSVP"
                  )}
                </MagneticButton>
                <p className="font-sans text-[0.7rem] text-ink-faint">
                  Celebrating on {eventMeta.dateLine}
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
