import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { designations } from "@/lib/mock-data";

export const Route = createFileRoute("/designations")({
  component: () => (
    <RequireAuth>
      <DesignationsPage />
    </RequireAuth>
  ),
});

function DesignationsPage() {
  const [designations, setDesignations] = useState<any[]>([]);

  useEffect(() => {
    loadDesignations();
  }, []);

  async function loadDesignations() {
    const { data, error } = await supabase
      .from("designations")
      .select("*");

    console.log("Designations:", data);
    console.log("Error:", error);

    if (!error) {
      setDesignations(data || []);
    }
  }

  return (
    <AppShell
      title="Designations"
      subtitle="Manage company designations"
    >
      <div className="bg-white rounded-lg border p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Designation Name</th>
            </tr>
          </thead>

          <tbody>
            {designations.map((designation) => (
              <tr key={designation.id}>
                <td className="py-2">{designation.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}