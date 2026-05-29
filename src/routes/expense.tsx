import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { expenses } from "@/lib/mock-data";
import { downloadCSV } from "@/lib/csv";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/expense")({
  component: () => <RequireAuth><Expense /></RequireAuth>,
});

function Expense() {
  return (
    <AppShell title="Expense Management" subtitle="Submit, approve and track employee expenses"
      actions={<>
        <Button variant="outline" size="sm" onClick={() => downloadCSV("expenses.csv", expenses as any)}><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
        <NewExpense />
      </>}>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{["Employee","Category","Amount","Date","Status"].map(h => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}</tr></thead>
        <tbody>{expenses.map(e => (
          <tr key={e.id} className="border-t">
            <td className="px-3 py-2 font-medium">{e.employee}</td>
            <td className="px-3 py-2">{e.category}</td>
            <td className="px-3 py-2">₹{e.amount.toLocaleString("en-IN")}</td>
            <td className="px-3 py-2">{e.date}</td>
            <td className="px-3 py-2"><Badge variant={e.status === "Approved" || e.status === "Reimbursed" ? "default" : e.status === "Submitted" ? "secondary" : "destructive"}>{e.status}</Badge></td>
          </tr>
        ))}</tbody>
      </table></div></CardContent></Card>
    </AppShell>
  );
}

function NewExpense() {
  return (
    <Dialog><DialogTrigger asChild><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Submit expense</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Submit expense</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Expense submitted"); }} className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label>Category</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{["Travel - Cab","Travel - Flight","Meals","Office Supplies","Internet","Mobile","Other"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Amount (₹)</Label><Input type="number" required /></div>
          <div><Label>Date</Label><Input type="date" required /></div>
          <div className="col-span-2"><Label>Receipt (PDF/JPG)</Label><Input type="file" /></div>
          <DialogFooter className="col-span-2"><Button type="submit">Submit</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
