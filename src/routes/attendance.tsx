import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { weeklyAttendance, employees } from "@/lib/mock-data";
import { downloadCSV } from "@/lib/csv";
import { Download, Upload } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/attendance")({
  component: () => <RequireAuth><Attendance /></RequireAuth>,
});

function Attendance() {
  const today = new Date().toISOString().slice(0,10);
  const rows = employees.slice(0, 15).map((e, i) => ({
    date: today,
    code: e.code,
    employee: e.name,
    shift: i % 3 === 2 ? "Night (22:00 – 06:00)" : "General (09:30 – 18:30)",
    in_time: i % 9 === 0 ? "—" : `09:${(i*7)%60 < 10 ? "0"+(i*7)%60 : (i*7)%60}`,
    out_time: i % 9 === 0 ? "—" : `18:${(i*5)%60 < 10 ? "0"+(i*5)%60 : (i*5)%60}`,
    hours: i % 9 === 0 ? 0 : 8.5 + ((i % 4) * 0.25),
    ot: i % 5 === 0 ? 1.5 : 0,
    status: i % 9 === 0 ? "Absent" : i % 7 === 0 ? "Half-day" : "Present",
    late: i % 6 === 0 ? "Late by 12m" : "—",
  }));

  return (
    <AppShell title="Attendance Management" subtitle="Captured from biometric devices + manual punches"
      actions={<>
        <Link to="/punch"><Button variant="outline" size="sm">Open Punch In/Out</Button></Link>
        <Button variant="outline" size="sm" onClick={() => downloadCSV("attendance.csv", rows)}><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
        <Button size="sm"><Upload className="h-3.5 w-3.5 mr-1.5" />Import</Button>
      </>}
    >
      <Tabs defaultValue="register">
        <TabsList>
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="ot">Overtime</TabsTrigger>
          <TabsTrigger value="late">Late / Early</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <Card className="mb-4"><CardContent className="p-4">
            <p className="text-sm font-medium mb-3">7-day summary</p>
            <div className="h-48"><ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAttendance}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
                <Bar dataKey="present" stackId="a" fill="var(--color-chart-1)" /><Bar dataKey="wfh" stackId="a" fill="var(--color-chart-2)" /><Bar dataKey="absent" stackId="a" fill="var(--color-chart-5)" />
              </BarChart></ResponsiveContainer></div>
          </CardContent></Card>
          <Card><CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>{["Date","Code","Employee","Shift","In","Out","Hours","OT","Late/Early","Status"].map(h => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}</tr>
                </thead>
                <tbody>{rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-1.5">{r.date}</td><td className="px-3 py-1.5 font-mono text-xs">{r.code}</td>
                    <td className="px-3 py-1.5 font-medium">{r.employee}</td><td className="px-3 py-1.5">{r.shift}</td>
                    <td className="px-3 py-1.5">{r.in_time}</td><td className="px-3 py-1.5">{r.out_time}</td>
                    <td className="px-3 py-1.5">{r.hours}h</td><td className="px-3 py-1.5">{r.ot}h</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{r.late}</td>
                    <td className="px-3 py-1.5"><Badge variant={r.status === "Present" ? "default" : r.status === "Half-day" ? "secondary" : "destructive"}>{r.status}</Badge></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="shifts"><Card><CardContent className="p-4 text-sm">General (09:30 – 18:30), Evening (14:00 – 23:00), Night (22:00 – 06:00). Weekly offs configurable per location.</CardContent></Card></TabsContent>
        <TabsContent value="ot"><Card><CardContent className="p-4 text-sm text-muted-foreground">OT requests are auto-flagged when hours &gt; 9. Manager approval required before payroll posting.</CardContent></Card></TabsContent>
        <TabsContent value="late"><Card><CardContent className="p-4 text-sm text-muted-foreground">Late marks beyond 3 per month trigger LOP rules per policy.</CardContent></Card></TabsContent>
      </Tabs>
    </AppShell>
  );
}
