// 63 D365 F&O-style workspace tiles. A handful link to live module routes;
// the rest are inbuilt placeholders that open a generic workspace view.
import {
  Users, Calendar, Clock, Wallet, Plane, Receipt, Banknote, BarChart3, FileSpreadsheet,
  ClipboardList, Building2, ShieldCheck, BookOpen, GraduationCap, Briefcase, MapPin,
  Award, Heart, Target, TrendingUp, PieChart, FileText, Mail, MessageSquare, Bell,
  Globe2, Cog, Database, KeySquare, UserCog, Activity, CircleDollarSign, Layers,
  Boxes, ListChecks, Hash, BadgeCheck, Stamp, Scale, FilePlus2, FileCheck2, Archive,
  CalendarClock, CalendarCheck2, Hourglass, Coffee, MoonStar, SunMedium, IdCard,
  UserPlus, UserMinus, FolderKanban, NotebookPen, Workflow, GitBranch, Network,
  PlugZap, Cable, Cloud, Sparkles, Brain, Bot, LineChart, BarChart2, Search,
} from "lucide-react";

export interface Workspace {
  id: string;
  title: string;
  group: string;
  icon: any;
  href?: string;
  powerBI?: boolean;
}

export const workspaces: Workspace[] = [
  // Core HR
  { id: "ws-emp", title: "Employee Management", group: "Human Resources", icon: Users, href: "/employees" },
  { id: "ws-att", title: "Attendance Management", group: "Time & Attendance", icon: Clock, href: "/attendance" },
  { id: "ws-leave", title: "Leave Management", group: "Time & Attendance", icon: Calendar, href: "/leave" },
  { id: "ws-pay", title: "Payroll Management", group: "Payroll", icon: Wallet, href: "/payroll" },
  { id: "ws-travel", title: "Travel Management", group: "Expenses", icon: Plane, href: "/travel" },
  { id: "ws-exp", title: "Expense Management", group: "Expenses", icon: Receipt, href: "/expense" },
  { id: "ws-reim", title: "Reimbursements", group: "Expenses", icon: Banknote, href: "/reimbursement" },
  { id: "ws-punch", title: "Punch In / Out", group: "Time & Attendance", icon: Activity, href: "/punch" },
  { id: "ws-reports", title: "Reports", group: "Analytics", icon: BarChart3, href: "/reports" },
  { id: "ws-import", title: "Imports / Exports", group: "Data Management", icon: FileSpreadsheet, href: "/imports" },

  // Power BI loaded
  { id: "ws-hr-dash", title: "HR Analytics", group: "Analytics", icon: PieChart, powerBI: true, href: "/reports" },
  { id: "ws-pay-dash", title: "Payroll Analytics", group: "Analytics", icon: LineChart, powerBI: true, href: "/reports" },
  { id: "ws-att-dash", title: "Attendance Analytics", group: "Analytics", icon: BarChart2, powerBI: true, href: "/reports" },
  { id: "ws-exp-dash", title: "Expense Analytics", group: "Analytics", icon: TrendingUp, powerBI: true, href: "/reports" },
  { id: "ws-talent", title: "Talent Insights", group: "Analytics", icon: Sparkles, powerBI: true, href: "/reports" },

  // Workspace stubs (the remaining 48 inbuilt workspaces)
  ...[
    ["Onboarding", FolderKanban, "Human Resources"],
    ["Offboarding", UserMinus, "Human Resources"],
    ["Recruitment", UserPlus, "Human Resources"],
    ["Job Requisitions", Briefcase, "Human Resources"],
    ["Org Chart", Network, "Human Resources"],
    ["Branches & Locations", MapPin, "Human Resources"],
    ["Holiday Calendar", CalendarCheck2, "Human Resources"],
    ["Shift Planner", CalendarClock, "Time & Attendance"],
    ["Rotational Offs", GitBranch, "Time & Attendance"],
    ["Overtime Approvals", Hourglass, "Time & Attendance"],
    ["Late / Early Tracking", Clock, "Time & Attendance"],
    ["Night Shifts", MoonStar, "Time & Attendance"],
    ["Break Tracking", Coffee, "Time & Attendance"],
    ["Comp Off", SunMedium, "Time & Attendance"],
    ["Leave Balances", ClipboardList, "Time & Attendance"],
    ["Leave Approvals", BadgeCheck, "Time & Attendance"],
    ["Payslips", FileCheck2, "Payroll"],
    ["Salary Revisions", CircleDollarSign, "Payroll"],
    ["Variable Pay", Award, "Payroll"],
    ["Bonuses & Incentives", Sparkles, "Payroll"],
    ["Loan & EMI", Banknote, "Payroll"],
    ["Tax Declarations", FileText, "Payroll"],
    ["Proof Submissions", FilePlus2, "Payroll"],
    ["Bank Transfer Files", Archive, "Payroll"],
    ["Compliance (PF/ESI/PT)", ShieldCheck, "Payroll"],
    ["Travel Bookings", Plane, "Expenses"],
    ["Per-Diem", Hash, "Expenses"],
    ["Expense Categories", Layers, "Expenses"],
    ["Approval Matrix", Workflow, "Workflow"],
    ["Notifications", Bell, "Workflow"],
    ["Inbox", Mail, "Workflow"],
    ["Announcements", MessageSquare, "Workflow"],
    ["Documents Vault", Boxes, "Documents"],
    ["Letters & Templates", NotebookPen, "Documents"],
    ["ID Cards", IdCard, "Documents"],
    ["Performance Reviews", Target, "Performance"],
    ["Goals & OKRs", Scale, "Performance"],
    ["1:1s", BookOpen, "Performance"],
    ["Learning & Development", GraduationCap, "Performance"],
    ["Wellbeing", Heart, "Performance"],
    ["ERP Integration", Cable, "Integrations"],
    ["D365 F&O Sync", PlugZap, "Integrations"],
    ["SAP / Oracle Sync", Cloud, "Integrations"],
    ["Webhook Logs", Database, "Integrations"],
    ["Master Data", Building2, "Integrations"],
    ["AI Assistant", Bot, "AI"],
    ["AI Reports", Brain, "AI"],
    ["AI Search", Search, "AI"],
    ["Settings", Cog, "Administration"],
    ["Users & Roles", UserCog, "Administration"],
    ["API Keys", KeySquare, "Administration"],
    ["Audit Logs", ListChecks, "Administration"],
    ["Multi-state Compliance", Stamp, "Administration"],
    ["Locale & Timezone", Globe2, "Administration"],
  ].map(([title, icon, group], i) => ({
    id: `ws-x-${i}`,
    title: title as string,
    group: group as string,
    icon: icon as any,
  })),
];
