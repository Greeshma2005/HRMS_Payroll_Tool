import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { travel } from "@/lib/mock-data";
import { downloadCSV } from "@/lib/csv";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/travel")({
  component: () => <RequireAuth><Travel /></RequireAuth>,
});

function Travel() {
  return (
    <AppShell title="Travel Management" subtitle="Travel requests, approvals and bookings"
      actions={<>
        <Button variant="outline" size="sm" onClick={() => downloadCSV("travel.csv", travel as any)}><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
        <NewTravel />
      </>}>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{["Employee","From","To","Dates","Mode","Estimate","Status"].map(h => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}</tr></thead>
        <tbody>{travel.map(t => (
          <tr key={t.id} className="border-t">
            <td className="px-3 py-2 font-medium">{t.employee}</td>
            <td className="px-3 py-2">{t.from}</td><td className="px-3 py-2">{t.to}</td>
            <td className="px-3 py-2">{t.dates}</td><td className="px-3 py-2">{t.mode}</td>
            <td className="px-3 py-2">₹{t.estimate.toLocaleString("en-IN")}</td>
            <td className="px-3 py-2"><Badge variant={t.status === "Approved" || t.status === "Booked" ? "default" : "secondary"}>{t.status}</Badge></td>
          </tr>
        ))}</tbody>
      </table></div></CardContent></Card>
    </AppShell>
  );
}

function NewTravel() {
  return (
    <Dialog><DialogTrigger asChild><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />New travel request</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New travel request</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Travel request submitted"); }} className="grid grid-cols-2 gap-3">
          <div><Label>From</Label><Input required /></div>
          <div><Label>To</Label><Input required /></div>
          <div><Label>From date</Label><Input type="date" required /></div>
          <div><Label>To date</Label><Input type="date" required /></div>
          <div><Label>Mode</Label><Input placeholder="Flight / Train / Cab" /></div>
          <div><Label>Estimate (₹)</Label><Input type="number" /></div>
          <DialogFooter className="col-span-2"><Button type="submit">Submit</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
