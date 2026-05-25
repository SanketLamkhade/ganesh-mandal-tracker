function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface EntryListProps {
  title: string;
  entries: Array<{
    _id: string;
    date: string;
    amount: number;
    label: string;
    sublabel?: string;
    badge?: string;
    badgeColor?: "green" | "orange";
  }>;
  emptyMessage?: string;
}

export default function EntryList({
  title,
  entries,
  emptyMessage = "No entries yet",
}: EntryListProps) {
  return (
    <div className="card-mandal mt-6 p-5">
      <h3 className="mb-4 font-heading text-base font-semibold text-maroon">
        {title}
      </h3>

      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-maroon/50">{emptyMessage}</p>
      ) : (
        <ul className="divide-y divide-gold/20">
          {entries.map((entry) => (
            <li key={entry._id} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-maroon">{entry.label}</p>
                {entry.sublabel && (
                  <p className="truncate text-xs text-maroon/50">{entry.sublabel}</p>
                )}
                <p className="mt-0.5 text-xs text-maroon/40">
                  {formatDate(entry.date)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-semibold text-maroon">
                  {formatCurrency(entry.amount)}
                </p>
                {entry.badge && (
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                      entry.badgeColor === "green"
                        ? "bg-leaf-green/10 text-leaf-green"
                        : "bg-saffron/10 text-saffron"
                    }`}
                  >
                    {entry.badge}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { formatCurrency, formatDate };
