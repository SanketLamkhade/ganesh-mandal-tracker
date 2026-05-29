import MandalAvatar from "@/components/MandalAvatar";
import { MANDAL } from "@/lib/constants";

export default function MandalHeader() {
  return (
    <header className="relative overflow-hidden rounded-b-2xl bg-gradient-to-br from-maroon via-[#8B2525] to-maroon px-4 py-5 text-white shadow-lg sm:px-6">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-4 border-gold" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full border-2 border-gold" />
      </div>

      <div className="relative mx-auto flex max-w-2xl items-center gap-3">
        <MandalAvatar size="sm" />
        <div>
          <h1 className="font-heading text-xl font-bold leading-tight sm:text-2xl">
            {MANDAL.name}
          </h1>
          <p className="mt-0.5 text-xs text-white/80 sm:text-sm">
            {MANDAL.registerNumber} &bull; {MANDAL.establishYear}
          </p>
        </div>
      </div>
    </header>
  );
}
