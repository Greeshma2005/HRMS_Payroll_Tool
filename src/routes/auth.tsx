import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth")({ component: AuthPage });

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  fullName: z.string().trim().min(1).max(120).optional(),
});

const DEMO_EMAIL = "demo@lumenhrms.app";
const DEMO_PASSWORD = "Demo@12345";

function AuthPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [fullName, setFullName] = useState("Demo User");

  useEffect(() => { if (user) nav({ to: "/" }); }, [user, nav]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    nav({ to: "/" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password, fullName });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. You are signed in.");
    nav({ to: "/" });
  }

  async function demoLogin() {
    setLoading(true);
    let { error } = await supabase.auth.signInWithPassword({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
    if (error) {
      const up = await supabase.auth.signUp({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        options: { emailRedirectTo: window.location.origin, data: { full_name: "Demo User" } },
      });
      if (up.error) { setLoading(false); return toast.error(up.error.message); }
      const re = await supabase.auth.signInWithPassword({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
      error = re.error;
    }
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in as Demo User");
    nav({ to: "/" });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-d365-header text-d365-header-foreground">
        <div className="flex items-center gap-2 font-semibold">
          <div className="h-7 w-7 rounded bg-primary grid place-items-center text-xs font-bold">L</div>
          People's Pulse HRMS
        </div>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight max-w-md">A cloud HRMS built around D365-style workspaces.</h2>
          <p className="text-sm opacity-80 mt-3 max-w-md">Attendance from biometric devices, leave, payroll, travel and expenses — with ERP sync to D365 F&amp;O, SAP and Oracle.</p>
          <ul className="mt-6 grid grid-cols-2 gap-2 text-xs opacity-90 max-w-md">
            {["Face / biometric punch","Multi-state payroll","Excel import & export","Power BI dashboards","REST + webhook APIs","AI analytics"].map(s => <li key={s} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{s}</li>)}
          </ul>
        </div>
        <p className="text-xs opacity-60">© Lumen HRMS</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your HRMS workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={signIn} className="space-y-3 mt-4">
                  <div><Label htmlFor="e1">Email</Label><Input id="e1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  <div><Label htmlFor="p1">Password</Label><Input id="p1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                  <Button type="submit" disabled={loading} className="w-full">{loading ? "…" : "Sign in"}</Button>
                  <Button type="button" variant="secondary" disabled={loading} className="w-full" onClick={demoLogin}>
                    {loading ? "…" : "Sign in as Demo (no setup)"}
                  </Button>
                  <p className="text-[11px] text-muted-foreground text-center">
                    Demo credentials prefilled — {DEMO_EMAIL} / {DEMO_PASSWORD}
                  </p>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={signUp} className="space-y-3 mt-4">
                  <div><Label htmlFor="n">Full name</Label><Input id="n" value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
                  <div><Label htmlFor="e2">Work email</Label><Input id="e2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  <div><Label htmlFor="p2">Password</Label><Input id="p2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                  <Button type="submit" disabled={loading} className="w-full">{loading ? "…" : "Create account"}</Button>
                </form>
              </TabsContent>
            </Tabs>
            <p className="text-center text-xs text-muted-foreground mt-4"><Link to="/" className="underline">Back to Dashboard</Link></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
