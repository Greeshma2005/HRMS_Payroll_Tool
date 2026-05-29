import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { leaveRequests, holidays } from "@/lib/mock-data";
import { downloadCSV } from "@/lib/csv";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/leave")({
  component: () => <RequireAuth><Leave /></RequireAuth>,
});

function Leave() {
  const balances = [
    { type: "Casual Leave", available: 6, taken: 4 },
    { type: "Sick Leave", available: 8, taken: 2 },
    { type: "Earned Leave", available: 12, taken: 5 },
    { type: "Comp Off", available: 1, taken: 0 },
  ];

  return (
    <AppShell title="Leave Management" subtitle="Apply, approve and track all leave types"
      actions={<>
        <Button variant="outline" size="sm" onClick={() => downloadCSV("leaves.csv", leaveRequests as any)}><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
        <ApplyDialog />
      </>}>
      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="holidays">Holiday calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <Card><CardContent className="p-0">
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{["Employee","Type","From","To","Days","Reason","Status","Actions"].map(h => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}</tr></thead>
              <tbody>{leaveRequests.map(l => (
                <tr key={l.id} className="border-t">
                  <td className="px-3 py-2 font-medium">{l.employee}</td>
                  <td className="px-3 py-2">{l.type}</td>
                  <td className="px-3 py-2">{l.from}</td><td className="px-3 py-2">{l.to}</td>
                  <td className="px-3 py-2">{l.days}</td>
                  <td className="px-3 py-2 text-muted-foreground">{l.reason}</td>
                  <td className="px-3 py-2"><Badge variant={l.status === "Approved" ? "default" : l.status === "Pending" ? "secondary" : "destructive"}>{l.status}</Badge></td>
                  <td className="px-3 py-2">
                    {l.status === "Pending" && <div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => toast.success("Approved")}>Approve</Button><Button size="sm" variant="ghost" onClick={() => toast.error("Rejected")}>Reject</Button></div>}
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="balances">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {balances.map(b => (
              <Card key={b.type}><CardContent className="p-4">
                <p className="text-xs uppercase text-muted-foreground tracking-wide">{b.type}</p>
                <p className="text-2xl font-semibold mt-1">{b.available}</p>
                <p className="text-xs text-muted-foreground">{b.taken} taken · accrual monthly</p>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="holidays">
          <Card><CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground"><tr><th className="text-left px-3 py-2">Date</th><th className="text-left px-3 py-2">Holiday</th><th className="text-left px-3 py-2">Applies to</th></tr></thead>
              <tbody>{holidays.map(h => <tr key={h.date} className="border-t"><td className="px-3 py-2">{h.date}</td><td className="px-3 py-2 font-medium">{h.name}</td><td className="px-3 py-2 text-muted-foreground">{h.location}</td></tr>)}</tbody>
            </table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function ApplyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Apply for leave</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Apply for leave</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Leave application submitted"); }} className="space-y-3">
          <div><Label>Leave type</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{["Casual","Sick","Earned","WFH","Comp Off","On Duty"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>From</Label><Input type="date" required /></div>
            <div><Label>To</Label><Input type="date" required /></div>
          </div>
          <div><Label>Reason</Label><Textarea rows={3} placeholder="Brief reason for your manager" /></div>
          <DialogFooter><Button type="submit">Submit</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
