import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";

export const Route = createFileRoute("/locations")({
  component: () => (
    <RequireAuth>
      <LocationsPage />
    </RequireAuth>
  ),
});

function LocationsPage() {
  return (
    <AppShell
      title="Locations"
      subtitle="Manage company locations"
    >
      Locations Page
    </AppShell>
  );
}