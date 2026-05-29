import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { workspaces } from "@/lib/workspaces";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Pin, ArrowUpRight } from "lucide-react";
import { weeklyAttendance, payrollTrend, leaveRequests } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid } from "recharts";

export const Route = createFileRoute("/")({
  component: () => <RequireAuth><Dashboard /></RequireAuth>,
});

function Dashboard() {
  const [q, setQ] = useState("");
  const grouped = useMemo(() => {
    const f = workspaces.filter((w) => w.title.toLowerCase().includes(q.toLowerCase()));
    return f.reduce<Record<string, typeof workspaces>>((acc, w) => {
      (acc[w.group] ??= []).push(w);
      return acc;
    }, {});
  }, [q]);

  return (
    <AppShell
      title="Workspaces"
      subtitle="63 inbuilt workspaces (parity with PU:39). Pick a workspace to start working."
      actions={
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter workspaces…" className="h-8 pl-7 w-56" />
          </div>
          <Button size="sm" variant="outline"><Pin className="h-3.5 w-3.5 mr-1.5" />Pin layout</Button>
        </div>
      }
    >
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Headcount", value: "248", sub: "+4 this month" },
          { label: "Present today", value: "226", sub: "91% attendance" },
          { label: "On leave", value: "11", sub: "5 approvals pending" },
          { label: "Payroll (₹ Cr)", value: "9.4", sub: "May payroll ready" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</p>
              <p className="text-2xl font-semibold mt-1">{k.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two charts (Power BI-style) */}
      <div className="grid lg:grid-cols-3 gap-3 mb-5">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium">Attendance — last 7 days</p>
                <p className="text-xs text-muted-foreground">Embedded Power BI tile (demo)</p>
              </div>
              <Badge variant="outline">Power BI</Badge>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="present" fill="var(--color-chart-1)" radius={[3,3,0,0]} />
                  <Bar dataKey="wfh" fill="var(--color-chart-2)" radius={[3,3,0,0]} />
                  <Bar dataKey="absent" fill="var(--color-chart-5)" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium">Payroll trend (₹ Cr)</p>
                <p className="text-xs text-muted-foreground">6-month spend</p>
              </div>
              <Badge variant="outline">Power BI</Badge>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={payrollTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="var(--color-chart-1)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending approvals */}
      <Card className="mb-5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Pending approvals</p>
            <Link to="/leave" className="text-xs text-primary inline-flex items-center hover:underline">Open Leave <ArrowUpRight className="h-3 w-3 ml-0.5" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/50">
                <tr><th className="text-left px-3 py-2">Employee</th><th className="text-left px-3 py-2">Type</th><th className="text-left px-3 py-2">Dates</th><th className="text-left px-3 py-2">Reason</th><th className="px-3 py-2">Status</th></tr>
              </thead>
              <tbody>
                {leaveRequests.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="px-3 py-2">{l.employee}</td>
                    <td className="px-3 py-2">{l.type}</td>
                    <td className="px-3 py-2">{l.from} → {l.to}</td>
                    <td className="px-3 py-2 text-muted-foreground">{l.reason}</td>
                    <td className="px-3 py-2 text-center"><Badge variant={l.status === "Approved" ? "default" : l.status === "Pending" ? "secondary" : "destructive"}>{l.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Workspace grid grouped by category */}
      {Object.entries(grouped).map(([group, items]) => (
        <section key={group} className="mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{group}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {items.map((w) => {
              const Icon = w.icon;
              const inner = (
                <div className="group bg-card border rounded-md p-3 hover:border-primary/60 hover:shadow-sm transition cursor-pointer h-24 flex flex-col">
                  <div className="flex items-start justify-between">
                    <Icon className="h-5 w-5 text-primary" />
                    {w.powerBI && <Badge variant="outline" className="text-[9px] px-1 py-0">PBI</Badge>}
                  </div>
                  <p className="text-[12.5px] font-medium mt-auto leading-tight">{w.title}</p>
                </div>
              );
              return w.href ? <Link key={w.id} to={w.href}>{inner}</Link> : <div key={w.id}>{inner}</div>;
            })}
          </div>
        </section>
      ))}
    </AppShell>
  );
}
