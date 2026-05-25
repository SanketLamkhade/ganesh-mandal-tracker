import MandalHeader from "./MandalHeader";
import NavBar from "./NavBar";

interface PageShellProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export default function PageShell({
  children,
  showNav = true,
}: PageShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="absolute inset-0 -z-10 mandal-pattern" />
      <div className={`mx-auto w-full max-w-2xl flex-1 ${showNav ? "pb-24" : ""}`}>
        <MandalHeader />
        {children}
      </div>
      {showNav && <NavBar />}
    </div>
  );
}
