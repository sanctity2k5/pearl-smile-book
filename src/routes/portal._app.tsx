import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { CalendarDays, ExternalLink, LayoutGrid, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/pearl";

export const Route = createFileRoute("/portal/_app")({
  ssr: false,
  component: PortalLayout,
});

function PortalLayout() {
  const nav = useNavigate();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("ps-owner")) setOk(true);
    else nav({ to: "/portal/login" });
  }, [nav]);
  if (!ok) return null;
  const link = "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground";
  const active = { className: "!bg-primary-soft !text-primary" };
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Logo sub="Owner Portal" />
          <nav className="flex items-center gap-1">
            <Link to="/portal" activeOptions={{ exact: true }} activeProps={active} className={link}><LayoutGrid className="size-4" /><span className="hidden sm:inline">Dashboard</span></Link>
            <Link to="/portal/calendar" activeProps={active} className={link}><CalendarDays className="size-4" /><span className="hidden sm:inline">Calendar</span></Link>
            <Link to="/book" target="_blank" className={link}><ExternalLink className="size-4" /><span className="hidden md:inline">Booking page</span></Link>
            <button
              className={link}
              aria-label="Sign out"
              onClick={() => {
                sessionStorage.removeItem("ps-owner");
                nav({ to: "/portal/login" });
              }}
            >
              <LogOut className="size-4" />
            </button>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
