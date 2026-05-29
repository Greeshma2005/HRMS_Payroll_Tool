import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Activity, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/punch")({
  component: () => <RequireAuth><Punch /></RequireAuth>,
});

interface Ev { id: string; event_time: string; event_type: string; source: string; device_id: string | null; location: string | null; }

function Punch() {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  async function load() {
    if (!user) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const { data } = await supabase.from("punch_events").select("*").eq("user_id", user.id).gte("event_time", today.toISOString()).order("event_time", { ascending: false });
    setEvents((data ?? []) as any);
  }
  useEffect(() => { load(); }, [user]);

  const last = events[0];
  const nextType: "in" | "out" = last?.event_type === "in" ? "out" : "in";

  async function punch(type: "in" | "out") {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("punch_events").insert({ user_id: user.id, event_type: type, source: "manual", location: "Web client" });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(`Punched ${type === "in" ? "IN" : "OUT"} at ${new Date().toLocaleTimeString()}`);
    load();
  }

  return (
    <AppShell title="Punch In / Out" subtitle="Manual fallback for biometric / face-recognition devices">
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2"><CardContent className="p-6">
          <div className="flex items-center gap-3 text-xs text-muted-foreground"><Activity className="h-4 w-4 text-primary" />Today · {now.toLocaleDateString()}</div>
          <div className="mt-2 text-5xl font-semibold tracking-tight tabular-nums">{now.toLocaleTimeString()}</div>
          <p className="text-sm text-muted-foreground mt-2">{last ? `Last event: ${last.event_type.toUpperCase()} at ${new Date(last.event_time).toLocaleTimeString()}` : "No punches yet today."}</p>
          <div className="mt-6 flex gap-3">
            <Button size="lg" disabled={loading || nextType !== "in"} onClick={() => punch("in")}><LogIn className="h-4 w-4 mr-2" />Punch IN</Button>
            <Button size="lg" variant="outline" disabled={loading || nextType !== "out"} onClick={() => punch("out")}><LogOut className="h-4 w-4 mr-2" />Punch OUT</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />Devices can POST to <code className="bg-muted px-1 rounded">/functions/v1/biometric-webhook</code> with a shared secret.</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-sm font-medium mb-3">Today's punches</p>
          {events.length === 0 && <p className="text-xs text-muted-foreground">No events yet.</p>}
          <ul className="space-y-2">
            {events.map(e => (
              <li key={e.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                <div>
                  <Badge variant={e.event_type === "in" ? "default" : "secondary"}>{e.event_type.toUpperCase()}</Badge>
                  <span className="ml-2 tabular-nums">{new Date(e.event_time).toLocaleTimeString()}</span>
                </div>
                <span className="text-xs text-muted-foreground">{e.source}{e.device_id ? ` · ${e.device_id}` : ""}</span>
              </li>
            ))}
          </ul>
        </CardContent></Card>
      </div>
    </AppShell>
  );
}
