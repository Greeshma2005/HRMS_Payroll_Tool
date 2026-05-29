import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { payroll, employees, payrollTrend } from "@/lib/mock-data";
import { downloadCSV } from "@/lib/csv";
import { Download, Play, FileCheck2 } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/payroll")({
  component: () => <RequireAuth><Payroll /></RequireAuth>,
});

function Payroll() {
  const total = payroll.reduce((s, r) => s + r.net, 0);

  return (
    <AppShell title="Payroll Management" subtitle="May 2026 cycle · 248 employees · Multi-state compliant"
      actions={<>
        <Button variant="outline" size="sm" onClick={() => downloadCSV("payroll-may.csv", payroll as any)}><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
        <Button variant="outline" size="sm" onClick={() => toast.success("Bank file generated (ICICI format)")}><FileCheck2 className="h-3.5 w-3.5 mr-1.5" />Bank file</Button>
        <Button size="sm" onClick={() => toast.success("Payroll run started")}><Play className="h-3.5 w-3.5 mr-1.5" />Run payroll</Button>
      </>}
    >
      <div className="grid md:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Headcount", value: "248" },
          { label: "Gross (₹)", value: `${(total*22 / 100000).toFixed(1)}L` },
          { label: "Deductions", value: "12.4%" },
          { label: "Net payable", value: `₹${(total*22 / 100000).toFixed(1)}L` },
        ].map(k => <Card key={k.label}><CardContent className="p-4"><p className="text-xs uppercase text-muted-foreground">{k.label}</p><p className="text-2xl font-semibold mt-1">{k.value}</p></CardContent></Card>)}
      </div>

      <Tabs defaultValue="run">
        <TabsList>
          <TabsTrigger value="run">Current run</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="revisions">Salary revisions</TabsTrigger>
          <TabsTrigger value="tax">Tax declarations</TabsTrigger>
          <TabsTrigger value="bank">Bank transfer</TabsTrigger>
        </TabsList>
        <TabsContent value="run">
          <Card className="mb-4"><CardContent className="p-4">
            <p className="text-sm font-medium mb-3">Payroll trend (₹ Cr)</p>
            <div className="h-48"><ResponsiveContainer width="100%" height="100%">
              <LineChart data={payrollTrend}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="amount" stroke="var(--color-chart-1)" strokeWidth={2} /></LineChart>
            </ResponsiveContainer></div>
          </CardContent></Card>
          <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{["Employee","Basic","HRA","Allowances","Deductions","Net pay","Status"].map(h => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}</tr></thead>
            <tbody>{payroll.map((r,i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-1.5 font-medium">{r.employee}</td>
                <td className="px-3 py-1.5">₹{r.basic.toLocaleString("en-IN")}</td>
                <td className="px-3 py-1.5">₹{r.hra.toLocaleString("en-IN")}</td>
                <td className="px-3 py-1.5">₹{r.allowances.toLocaleString("en-IN")}</td>
                <td className="px-3 py-1.5">₹{r.deductions.toLocaleString("en-IN")}</td>
                <td className="px-3 py-1.5 font-semibold">₹{r.net.toLocaleString("en-IN")}</td>
                <td className="px-3 py-1.5"><Badge variant="secondary">Ready</Badge></td>
              </tr>
            ))}</tbody>
          </table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="payslips">
          <Card><CardContent className="p-4 text-sm">{employees.slice(0,6).map(e => <div key={e.id} className="flex items-center justify-between py-2 border-b last:border-b-0"><span className="font-medium">{e.name}</span><Button size="sm" variant="outline" onClick={() => toast.success(`Payslip downloaded for ${e.name}`)}><Download className="h-3.5 w-3.5 mr-1.5" />May 2026 payslip</Button></div>)}</CardContent></Card>
        </TabsContent>
        <TabsContent value="revisions"><Card><CardContent className="p-4 text-sm text-muted-foreground">Salary revisions are queued for approval before payroll lock date.</CardContent></Card></TabsContent>
        <TabsContent value="tax"><Card><CardContent className="p-4 text-sm text-muted-foreground">Section 80C, 80D, HRA exemption, NPS — proof submission window closes on 28 Feb.</CardContent></Card></TabsContent>
        <TabsContent value="bank"><Card><CardContent className="p-4 text-sm">Bank transfer file is auto-generated in ICICI/HDFC/SBI format. Last generated: <span className="font-mono">may-2026-payroll-icici.txt</span></CardContent></Card></TabsContent>
      </Tabs>
    </AppShell>
  );
}
