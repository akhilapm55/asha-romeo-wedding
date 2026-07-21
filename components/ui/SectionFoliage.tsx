import { PalmLeaf } from "@/components/ui/Decor";
import { cn } from "@/lib/cn";

/**
 * Static decorative palm fronds tucked into a section's corners. Sits inside
 * the section (above its background, below the content) so it's always visible
 * — unlike a global fixed layer, which solid section backgrounds paint over.
 */
export default function SectionFoliage({
  dark = false,
  className,
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <span className="absolute -left-6 top-8 w-24 rotate-[18deg] sm:-left-8 sm:w-44">
        <PalmLeaf
          className={cn(
            "w-full animate-leaf-sway",
            dark ? "text-ivory/[0.10]" : "text-palm/[0.10]"
          )}
        />
      </span>
      {/* second corner leaf only on larger screens — keeps phones uncluttered */}
      <span className="absolute -right-10 bottom-6 hidden w-48 -rotate-[22deg] sm:block">
        <PalmLeaf
          className={cn(
            "w-full animate-leaf-sway",
            dark ? "text-gold-light/[0.12]" : "text-olive/[0.11]"
          )}
          style={{ animationDelay: "1.5s" }}
        />
      </span>
    </div>
  );
}
