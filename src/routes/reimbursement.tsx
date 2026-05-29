import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { expenses } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/reimbursement")({
  component: () => <RequireAuth><Reim /></RequireAuth>,
});

function Reim() {
  const pending = expenses.filter(e => e.status === "Approved");
  const processed = expenses.filter(e => e.status === "Reimbursed");
  return (
    <AppShell title="Reimbursements" subtitle="Process approved expenses for payout">
      <Tabs defaultValue="pending">
        <TabsList><TabsTrigger value="pending">Pending payout ({pending.length})</TabsTrigger><TabsTrigger value="processed">Processed ({processed.length})</TabsTrigger></TabsList>
        <TabsContent value="pending">
          <Card><CardContent className="p-0"><table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{["Employee","Category","Amount","Date","Action"].map(h => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}</tr></thead>
            <tbody>{pending.map(e => (
              <tr key={e.id} className="border-t"><td className="px-3 py-2 font-medium">{e.employee}</td><td className="px-3 py-2">{e.category}</td><td className="px-3 py-2">₹{e.amount.toLocaleString("en-IN")}</td><td className="px-3 py-2">{e.date}</td>
                <td className="px-3 py-2"><Button size="sm" variant="outline" onClick={() => toast.success(`Marked reimbursed for ${e.employee}`)}>Mark paid</Button></td>
              </tr>
            ))}</tbody>
          </table></CardContent></Card>
        </TabsContent>
        <TabsContent value="processed">
          <Card><CardContent className="p-0"><table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{["Employee","Category","Amount","Date","Status"].map(h => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}</tr></thead>
            <tbody>{processed.map(e => (
              <tr key={e.id} className="border-t"><td className="px-3 py-2 font-medium">{e.employee}</td><td className="px-3 py-2">{e.category}</td><td className="px-3 py-2">₹{e.amount.toLocaleString("en-IN")}</td><td className="px-3 py-2">{e.date}</td><td className="px-3 py-2"><Badge>Reimbursed</Badge></td></tr>
            ))}</tbody>
          </table></CardContent></Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
