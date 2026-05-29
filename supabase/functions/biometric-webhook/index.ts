// Biometric / face-recognition device webhook.
// Devices POST: { employee_code, event_type: "in"|"out", event_time?, device_id?, location?, secret }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json();
    const sharedSecret = Deno.env.get("BIOMETRIC_WEBHOOK_SECRET");
    if (sharedSecret && body.secret !== sharedSecret) {
      return new Response(JSON.stringify({ error: "Invalid secret" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { employee_code, event_type, event_time, device_id, location } = body;
    if (!employee_code || !["in", "out"].includes(event_type)) {
      return new Response(JSON.stringify({ error: "employee_code and event_type ('in'|'out') are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: profile, error: pErr } = await supabase.from("profiles").select("id").eq("employee_code", employee_code).maybeSingle();
    if (pErr) throw pErr;
    if (!profile) {
      return new Response(JSON.stringify({ error: `Unknown employee_code: ${employee_code}` }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { error } = await supabase.from("punch_events").insert({
      user_id: profile.id,
      event_type,
      event_time: event_time ?? new Date().toISOString(),
      source: "biometric",
      device_id: device_id ?? null,
      location: location ?? null,
    });
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("biometric-webhook error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
