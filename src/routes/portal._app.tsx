import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { CalendarDays, LayoutGrid, ListChecks, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/pearl";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/portal/_app")({
  ssr: false,
  component: PortalLayout,
});

const items = [
  { title: "Dashboard", url: "/portal", icon: LayoutGrid, exact: true },
  { title: "Bookings", url: "/portal/bookings", icon: ListChecks, exact: false },
  { title: "Calendar", url: "/portal/calendar", icon: CalendarDays, exact: false },
] as const;

function PortalSidebar() {
  const nav = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string, exact: boolean) => (exact ? path === url || path === url + "/" : path.startsWith(url));
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">{collapsed ? <span className="mx-auto font-display text-xl text-sidebar-foreground">P</span> : <span className="rounded-lg bg-card px-3 py-1.5 shadow-sm"><Logo sub="Owner Portal" /></span>}</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Clinic</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((i) => (
                <SidebarMenuItem key={i.url}>
                  <SidebarMenuButton asChild isActive={isActive(i.url, i.exact)} tooltip={i.title}>
                    <Link to={i.url}><i.icon className="size-4" /><span>{i.title}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={() => {
                sessionStorage.removeItem("ps-owner");
                toast.success("Signed out");
                nav({ to: "/portal/login" });
              }}
            >
              <LogOut className="size-4" /><span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function PortalLayout() {
  const nav = useNavigate();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("ps-owner")) setOk(true);
    else nav({ to: "/portal/login" });
  }, [nav]);
  if (!ok) return null;
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <PortalSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-sidebar-border bg-sidebar/95 px-4 text-sidebar-foreground backdrop-blur">
            <SidebarTrigger />
            <span className="text-sm font-medium text-sidebar-foreground/80">PearlSmile Dental · Owner Portal</span>
          </header>
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
