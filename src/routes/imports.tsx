import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { downloadCSV, parseCSV } from "@/lib/csv";
import { toast } from "sonner";

export const Route = createFileRoute("/imports")({
  component: () => <RequireAuth><Imports /></RequireAuth>,
});

const TEMPLATES: Record<string, string[]> = {
  Employees: ["code", "name", "email", "department", "designation", "location", "manager", "joined", "ctc"],
  Attendance: ["date", "code", "in_time", "out_time", "shift"],
  Leave: ["code", "type", "from", "to", "reason"],
  Payroll: ["code", "basic", "hra", "allowances", "deductions"],
  Expense: ["code", "category", "amount", "date"],
  Travel: ["code", "from", "to", "from_date", "to_date", "mode", "estimate"],
};

function Imports() {
  const [result, setResult] = useState<{ ok: number; errors: string[]; rows: any[] } | null>(null);
  const [activeTpl, setActiveTpl] = useState<string>("Employees");

  function downloadTemplate(name: string) {
    const headers = TEMPLATES[name];
    const sample: Record<string, string> = {};
    headers.forEach(h => sample[h] = "");
    downloadCSV(`${name.toLowerCase()}-template.csv`, [sample]);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>, name: string) {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    const rows = parseCSV(text);
    const required = TEMPLATES[name];
    const errors: string[] = [];
    rows.forEach((r, i) => {
      required.forEach(col => {
        if (!(col in r) || !r[col]) errors.push(`Row ${i + 2}: missing "${col}"`);
      });
    });
    setResult({ ok: rows.length - errors.length, errors: errors.slice(0, 10), rows });
    if (errors.length === 0) toast.success(`Validated ${rows.length} rows. Ready to import.`);
    else toast.error(`${errors.length} validation issues`);
  }

  return (
    <AppShell title="Imports / Exports" subtitle="Bulk upload from templates. Validations enforced before import."
      actions={<Badge variant="outline">ERP-ready format</Badge>}>
      <Tabs value={activeTpl} onValueChange={setActiveTpl}>
        <TabsList className="flex-wrap h-auto">{Object.keys(TEMPLATES).map(t => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}</TabsList>
        {Object.keys(TEMPLATES).map(name => (
          <TabsContent key={name} value={name}>
            <div className="grid md:grid-cols-3 gap-3">
              <Card className="md:col-span-1"><CardContent className="p-4">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <p className="font-medium mt-2">{name} template</p>
                <p className="text-xs text-muted-foreground mt-1">Columns: {TEMPLATES[name].join(", ")}</p>
                <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => downloadTemplate(name)}><Download className="h-3.5 w-3.5 mr-1.5" />Download template</Button>
              </CardContent></Card>
              <Card className="md:col-span-2"><CardContent className="p-4">
                <p className="font-medium">Upload {name}.csv</p>
                <p className="text-xs text-muted-foreground mt-1">All required columns must be present. Each row is validated.</p>
                <label className="mt-3 block border-2 border-dashed rounded p-6 text-center cursor-pointer hover:border-primary/60">
                  <Upload className="h-5 w-5 mx-auto text-muted-foreground" />
                  <p className="text-sm mt-2">Click to select a CSV file</p>
                  <input type="file" accept=".csv" className="hidden" onChange={(e) => onFile(e, name)} />
                </label>
                {result && (
                  <div className="mt-3 text-sm">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /><span>{result.ok} valid rows</span></div>
                    {result.errors.length > 0 && (
                      <div className="mt-2"><div className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-destructive" /><span>{result.errors.length} issues (first 10):</span></div>
                        <ul className="mt-1 text-xs text-muted-foreground list-disc ml-6">{result.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                      </div>
                    )}
                    <Button size="sm" className="mt-3" onClick={() => toast.success(`${result.ok} rows imported into ${name}`)}>Import {result.ok} rows</Button>
                  </div>
                )}
              </CardContent></Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </AppShell>
  );
}
