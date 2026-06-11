import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Users,
  Calendar,
  Clock,
  Wallet,
  Plane,
  Receipt,
  Banknote,
  BarChart3,
  FileSpreadsheet,
  Home,
  Activity,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  icon?: any;
  children?: NavItem[];
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: Home },
  {
    label: "Employee Management",
    icon: Users,
    children: [
      { label: "Employees", href: "/employees" },
      { label: "New Employee", href: "/employees-new" },
      { label: "Departments", href: "/departments" },
      { label: "Designations", href: "/designations" },
      { label: "Locations", href: "/locations" },
    ],
  },
  {
    label: "Attendance",
    icon: Clock,
    children: [
      { label: "Attendance Register", href: "/attendance" },
      { label: "Punch In / Out", href: "/punch" },
      { label: "Shift Planner", href: "/attendance?tab=shifts" },
      { label: "Overtime", href: "/attendance?tab=ot" },
      { label: "Late / Early", href: "/attendance?tab=late" },
    ],
  },
  {
    label: "Leave Management",
    icon: Calendar,
    children: [
      { label: "Leave Requests", href: "/leave" },
      { label: "Apply for Leave", href: "/leave?new=1" },
      { label: "Leave Balances", href: "/leave?tab=balances" },
      { label: "Holiday Calendar", href: "/leave?tab=holidays" },
    ],
  },
  {
    label: "Payroll",
    icon: Wallet,
    children: [
      { label: "Run Payroll", href: "/payroll" },
      { label: "Payslips", href: "/payroll?tab=payslips" },
      { label: "Salary Revisions", href: "/payroll?tab=revisions" },
      { label: "Tax Declarations", href: "/payroll?tab=tax" },
      { label: "Bank Transfer", href: "/payroll?tab=bank" },
    ],
  },
  {
    label: "Travel",
    icon: Plane,
    children: [
      { label: "Travel Requests", href: "/travel" },
      { label: "New Request", href: "/travel?new=1" },
      { label: "Bookings", href: "/travel?tab=bookings" },
    ],
  },
  {
    label: "Expense",
    icon: Receipt,
    children: [
      { label: "Expense Reports", href: "/expense" },
      { label: "Submit Expense", href: "/expense?new=1" },
      { label: "Categories", href: "/expense?tab=cats" },
    ],
  },
  {
    label: "Reimbursements",
    icon: Banknote,
    children: [
      { label: "Pending", href: "/reimbursement" },
      { label: "Processed", href: "/reimbursement?tab=processed" },
    ],
  },
  { label: "Reports & Analytics", href: "/reports", icon: BarChart3 },
  { label: "Imports / Exports", href: "/imports", icon: FileSpreadsheet },
  { label: "AI Assistant", href: "/reports?ai=1", icon: Sparkles },
];

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const { user, signOut, roles } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState<Record<string, boolean>>({ "Employee Management": true });
  const [collapsed, setCollapsed] = useState(false);
  const loc = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* D365-style header */}
      <header className="bg-d365-header text-d365-header-foreground h-12 flex items-center px-3 gap-3 shrink-0">
        {/* <button onClick={() => setCollapsed((c) => !c)} className="p-1.5 hover:bg-white/10 rounded">
          <Menu className="h-4 w-4" />
        </button> */}
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="h-6 w-6 rounded bg-primary/80 grid place-items-center text-[10px] font-bold">
            L
          </div>
          <span>People's Pulse</span>
        </Link>
        <div className="hidden md:flex items-center gap-2 ml-6 text-xs opacity-80">
          <span>Workspaces</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium opacity-100">{title ?? "Dashboard"}</span>
        </div>
        <div className="flex-1 flex justify-center max-w-xl mx-auto px-4">
          <div className="relative w-full">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-70" />
            <Input
              placeholder="Search across modules…"
              className="h-7 pl-8 bg-white/10 border-white/15 text-white placeholder:text-white/60 focus-visible:ring-white/40"
            />
          </div>
        </div>
        <button className="p-1.5 hover:bg-white/10 rounded relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded">
          <Settings className="h-4 w-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-primary/80 text-primary-foreground">
                  {(user?.email ?? "U").slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs hidden sm:inline">{user?.email}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Roles: {roles.join(", ") || "employee"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await signOut();
                nav({ to: "/auth" });
              }}
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Left nav */}
        <aside
          className={cn("border-r bg-sidebar transition-all shrink-0", collapsed ? "w-12" : "w-60")}
        >
          <div className="p-2">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="p-1.5 hover:bg-sidebar-accent rounded w-full flex justify-start"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          <nav className="py-2 text-sm">
            {NAV.map((item) => {
              const Icon = item.icon;
              if (!item.children) {
                const active = item.href && loc.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href!}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 hover:bg-sidebar-accent",
                      active && "bg-sidebar-accent font-medium",
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4 text-primary" />}
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              }
              const isOpen = open[item.label];
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setOpen((o) => ({ ...o, [item.label]: !o[item.label] }))}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-sidebar-accent"
                  >
                    {Icon && <Icon className="h-4 w-4 text-primary" />}
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {isOpen ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </>
                    )}
                  </button>
                  {!collapsed && isOpen && (
                    <div className="ml-7 border-l">
                      {item.children.map((c) => {
                        const active = c.href && c.href.startsWith(loc.pathname);
                        return (
                          <Link
                            key={c.label}
                            to={c.href!}
                            className={cn(
                              "block pl-3 pr-2 py-1.5 text-[12.5px] text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
                              active && "text-foreground font-medium bg-sidebar-accent",
                            )}
                          >
                            {c.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col min-w-0">
          {title && (
            <div className="border-b bg-card">
              <div className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
                  {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            </div>
          )}
          <div className="flex-1 overflow-auto p-5">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, user } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);
  if (loading || !user)
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  return <>{children}</>;
}
