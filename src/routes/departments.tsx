import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/departments")({
  component: () => (
    <RequireAuth>
      <DepartmentsPage />
    </RequireAuth>
  ),
});

function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    const { data, error } = await supabase
      .from("departments")
      .select("*");

    console.log("Departments:", data);
    console.log("Error:", error);

    if (!error) {
      setDepartments(data || []);
    }
  }

  return (
  <AppShell
    title="Departments"
    subtitle="Manage company departments"
    actions={
      <>
        <Button>
          + Add Department
        </Button>
      </>
    }
  >
    <div className="bg-white rounded-lg border p-4">
      <table className="w-full">
        <thead>
        <tr>
            <th className="text-left">Code</th>
            <th className="text-left">Department Name</th>
        </tr>
        </thead>

        <tbody>
        {departments.map((dept) => (
            <tr key={dept.id} className="border-t">
            <td>{dept.department_code}</td>
            <td>{dept.name}</td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  </AppShell>
);
}