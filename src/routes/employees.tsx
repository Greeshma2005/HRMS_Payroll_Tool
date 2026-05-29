import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { employees, departments, locations } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { downloadCSV } from "@/lib/csv";
import { Download, Upload, Plus, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/employees")({
  component: () => <RequireAuth><Employees /></RequireAuth>,
});

function Employees() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => employees.filter((e) => [e.name, e.code, e.email, e.department].some((v) => v.toLowerCase().includes(q.toLowerCase()))), [q]);

  return (
    <AppShell
      title="Employee Management"
      subtitle="248 employees · 6 departments · 5 locations"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => downloadCSV("employees.csv", employees as any)}><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Open Imports module to bulk upload.")}><Upload className="h-3.5 w-3.5 mr-1.5" />Import</Button>
          <NewEmployeeDialog />
        </>
      }
    >
      <Tabs defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="org">Org chart</TabsTrigger>
        </TabsList>
        <TabsContent value="employees">
          <Card>
            <CardContent className="p-0">
              <div className="p-3 border-b flex items-center gap-2">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, code, email…" className="h-8 pl-7 w-72" />
                </div>
                <Badge variant="secondary">{filtered.length} results</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-xs text-muted-foreground">
                    <tr>
                      {["Code","Name","Email","Department","Designation","Location","Manager","Status","Joined","CTC"].map(h => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e) => (
                      <tr key={e.id} className="border-t hover:bg-accent/30">
                        <td className="px-3 py-1.5 font-mono text-xs">{e.code}</td>
                        <td className="px-3 py-1.5 font-medium">{e.name}</td>
                        <td className="px-3 py-1.5 text-muted-foreground">{e.email}</td>
                        <td className="px-3 py-1.5">{e.department}</td>
                        <td className="px-3 py-1.5">{e.designation}</td>
                        <td className="px-3 py-1.5">{e.location}</td>
                        <td className="px-3 py-1.5">{e.manager}</td>
                        <td className="px-3 py-1.5"><Badge variant={e.status === "Active" ? "default" : "secondary"}>{e.status}</Badge></td>
                        <td className="px-3 py-1.5">{e.joined}</td>
                        <td className="px-3 py-1.5 text-right">₹{e.ctc.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="departments">
          <Card><CardContent className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {departments.map((d) => (
              <div key={d} className="border rounded p-3"><p className="font-medium">{d}</p><p className="text-xs text-muted-foreground">{employees.filter(e => e.department === d).length} employees</p></div>
            ))}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="locations">
          <Card><CardContent className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {locations.map((l) => (
              <div key={l} className="border rounded p-3"><p className="font-medium">{l}</p><p className="text-xs text-muted-foreground">{employees.filter(e => e.location === l).length} employees</p></div>
            ))}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="org">
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Org chart visualization coming soon.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function NewEmployeeDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />New employee</Button></DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>New employee</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Employee saved (demo)"); }} className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label>Full name</Label><Input required /></div>
          <div><Label>Employee code</Label><Input required placeholder="EMP1025" /></div>
          <div><Label>Email</Label><Input type="email" required /></div>
          <div><Label>Department</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Location</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Designation</Label><Input /></div>
          <div><Label>CTC (₹)</Label><Input type="number" /></div>
          <DialogFooter className="col-span-2"><Button type="submit">Save</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
