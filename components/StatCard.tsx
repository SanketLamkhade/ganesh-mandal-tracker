import Link from "next/link";

interface StatCardProps {
  label: string;
  value: string;
  accent?: "saffron" | "maroon" | "green";
}

const accentStyles = {
  saffron: "border-saffron/40 bg-saffron/5 text-saffron",
  maroon: "border-maroon/30 bg-maroon/5 text-maroon",
  green: "border-leaf-green/40 bg-leaf-green/5 text-leaf-green",
};

export default function StatCard({
  label,
  value,
  accent = "maroon",
}: StatCardProps) {
  return (
    <div className={`card-mandal p-4 ${accentStyles[accent]}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className="mt-1 font-heading text-xl font-bold sm:text-2xl">{value}</p>
    </div>
  );
}

interface NavCardProps {
  href: string;
  title: string;
  description: string;
  icon: string;
  color: "saffron" | "maroon";
}

export function NavCard({ href, title, description, icon, color }: NavCardProps) {
  const bg =
    color === "saffron"
      ? "from-saffron/10 to-saffron/5 border-saffron/30"
      : "from-maroon/10 to-maroon/5 border-maroon/20";

  return (
    <Link
      href={href}
      className={`card-mandal flex items-center gap-4 bg-gradient-to-br p-5 ${bg}`}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-3xl shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-heading text-lg font-semibold text-maroon">{title}</h3>
        <p className="text-sm text-maroon/60">{description}</p>
      </div>
      <span className="ml-auto text-maroon/40">→</span>
    </Link>
  );
}
