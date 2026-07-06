import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/Dashboard";
import KeyGate from "@/components/dashboard/KeyGate";

export const dynamic = "force-dynamic";

// Keep this page out of search engines / previews.
export const metadata: Metadata = {
  title: "Guest Dashboard",
  robots: { index: false, follow: false },
};

export default function GuestDashboardPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const expected = process.env.DASHBOARD_ACCESS_KEY;
  const provided = searchParams?.key;
  const authorised = Boolean(expected) && provided === expected;

  if (!authorised) {
    return <KeyGate invalid={Boolean(provided)} />;
  }

  return (
    <main className="min-h-screen bg-ivory">
      <Dashboard accessKey={provided as string} />
    </main>
  );
}
