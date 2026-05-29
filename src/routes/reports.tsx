import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Sparkles } from "lucide-react";
import { downloadCSV } from "@/lib/csv";
import { employees, payroll, leaveRequests, expenses, travel } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  component: () => (
    <RequireAuth>
      <Reports />
    </RequireAuth>
  ),
});

const REPORTS = [
  {
    name: "Attendance summary (monthly)",
    get: () =>
      employees.map((e, i) => ({
        code: e.code,
        name: e.name,
        present: 20 - (i % 4),
        absent: i % 3,
        leave: i % 5,
        ot: i % 6,
      })),
  },
  { name: "Payroll register", get: () => payroll },
  { name: "Leave register", get: () => leaveRequests },
  { name: "Expense register", get: () => expenses },
  { name: "Travel register", get: () => travel },
  { name: "Employee Register", get: () => employees },
  {
    name: "PF / ESI contributions",
    get: () =>
      payroll.map((p) => ({
        employee: p.employee,
        pf: Math.round(p.basic * 0.12),
        esi: Math.round(p.basic * 0.0075),
      })),
  },
  {
    name: "TDS register",
    get: () => payroll.map((p) => ({ employee: p.employee, tds: Math.round(p.net * 0.1) })),
  },
];

function Reports() {
  return (
    <AppShell
      title="Reports & Analytics"
      subtitle="Excel-downloadable reports across all modules"
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.info("AI Assistant — ask anything about your data")}
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Ask AI
        </Button>
      }
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {REPORTS.map((r) => (
          <Card key={r.name}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    CSV / Excel · refreshed daily
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadCSV(`${r.name}.csv`, r.get() as any)}
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download
                    </Button>
                    <Badge variant="outline" className="text-[10px]">
                      {r.get().length} rows
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
