import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
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
import { Download, Upload, Plus, Search, Edit } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/employees")({
  component: () => (
    <RequireAuth>
      <Employees />
    </RequireAuth>
  ),
});

function Employees() {
  console.log(import.meta.env.VITE_SUPABASE_URL);

  const [q, setQ] = useState("");
  const [fetchedEmployees, setFetchedEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmployees() {
      const { data, error } = await supabase
  .from("employees")
  .select(`
    *,
    departments!employees_department_id_fkey (
      name
    ),
    designations!employees_designation_id_fkey (
      name
    )
  `);

      console.log("EMPLOYEE DATA:", data);
      console.log("ERROR:", error);
        
      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (error) {
        console.error("Supabase Error:", error);
        setLoading(false);
        return;
      }

      const mapped =
        data?.map((e: any) => ({
          id: e.id,
          code: e.employee_code,
          name: `${e.first_name ?? ""} ${e.last_name ?? ""}`.trim(),
          email: e.email,
          department: e.departments?.name ?? "",
          designation: e.designations?.name ?? "",
          location: "",
          manager: "",
          status: e.status ?? "Active",
          joined: e.joining_date ?? "",
          ctc: 0,
        })) || [];

      setFetchedEmployees(mapped);
      setLoading(false);
    }

    loadEmployees();
  }, []);

  const filtered = useMemo(
    () =>
      fetchedEmployees.filter((e) =>
      [e.name, e.code, e.email, e.department].some((v) =>
        (v || "").toLowerCase().includes(q.toLowerCase())
      )
    ),
  [q, fetchedEmployees]
);

  const search = useSearch({ from: "/employees" });
  const activeTab = search.tab || "employees";
  
  console.log("ACTIVE TAB =", activeTab);
  console.log("Selected Employee =", selectedEmployee);

      async function deleteEmployee(id: string) {

      const confirmDelete =
        confirm("Delete this employee?");

      if (!confirmDelete) return;

      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

      if (error) {
        alert(error.message);
        return;
      }

      window.location.reload();
    }

  return (
    <AppShell
      title="Employee Management"
      subtitle={`${fetchedEmployees.length} employees`}
      actions={null}
    >
      <Tabs value={activeTab}>
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="org">Org chart</TabsTrigger>
        </TabsList>
        <TabsContent value="employees">
          <Card>
              <CardContent className="p-0">

                {/* D365 Toolbar */}

                <div className="flex gap-2 border-b p-3">

                    <Link to="/employees-new">
                      <Button size="sm">
                        New
                      </Button>
                    </Link>

                    <Link
                      to="/employees-edit"
                      search={{ id: selectedEmployee || "" }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!selectedEmployee}
                      >
                        Edit
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!selectedEmployee}
                      onClick={() => {
                        if (selectedEmployee) {
                          deleteEmployee(selectedEmployee);
                        }
                      }}
                    >
                      Delete
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </Button>

                  </div>

                    {/* Search */}
                  <div className="p-3 border-b flex items-center gap-2">
                    <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search employee..."
                      className="pl-7 w-72"
                    />
                  </div>
                  </div>

                  {/* Grid */}
                  <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-xs text-muted-foreground">
                    <tr>
                      {["","Code","Name","Email","Department","Designation","Location","Manager","Status","Joined","CTC"].map(h => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e) => (
                      <tr key={e.id} onClick={() => setSelectedEmployee(e.id)}
                        className={`border-t cursor-pointer ${
                          selectedEmployee === e.id
                            ? "bg-blue-100"
                            : "hover:bg-accent/30"
                        }`}
                      >
                        
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
