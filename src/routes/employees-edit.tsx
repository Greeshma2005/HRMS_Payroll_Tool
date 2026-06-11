import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";

export const Route = createFileRoute("/employees-edit")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: String(search.id ?? ""),
  }),

  component: () => (
    <RequireAuth>
      <EditEmployeePage />
    </RequireAuth>
  ),
});

function EditEmployeePage() {
  
  const search = useSearch({
  from: "/employees-edit",
});

const employeeId = search.id;
const [employee, setEmployee] = useState<any>(null);
const [employeeCode, setEmployeeCode] = useState("");
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [gender, setGender] = useState("");
const [dateOfBirth, setDateOfBirth] = useState("");
const [joiningDate, setJoiningDate] = useState("");
const [departmentId, setDepartmentId] = useState("");
const [designationId, setDesignationId] = useState("");
const [departments, setDepartments] = useState<any[]>([]);
const [designations, setDesignations] = useState<any[]>([]);

useEffect(() => {
  loadEmployee();
  loadMasterData(); 
}, []);

console.log("Employee ID =", employeeId);

async function loadEmployee() {

  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      departments (
        name
      ),
      designations (
        name
      )
    `)
    .eq("id", employeeId)
    .single();

  console.log("Employee", data);
  console.log("Error", error);

  if (!error && data) {

  setEmployee(data);

  setEmployeeCode(data.employee_code || "");
  setFirstName(data.first_name || "");
  setLastName(data.last_name || "");
  setEmail(data.email || "");
  setPhone(data.phone || "");
  setGender(data.gender || "");
  setDateOfBirth(data.date_of_birth || "");
  setJoiningDate(data.joining_date || "");
  setDepartmentId(data.department_id || "");
  setDesignationId(data.designation_id || "");
  }
}

async function loadMasterData() {

  const { data: depts } = await supabase
    .from("departments")
    .select("*");

  const { data: desigs } = await supabase
    .from("designations")
    .select("*");

  setDepartments(depts || []);
  setDesignations(desigs || []);
}

async function updateEmployee() {

console.log("Employee ID =", employeeId);

  const { error } = await supabase
    .from("employees")
    .update({
      employee_code: employeeCode,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      gender: gender,
      date_of_birth: dateOfBirth,
      joining_date: joiningDate,
      department_id: departmentId,
      designation_id: designationId,
    })
    .eq("id", employeeId);

  console.log("UPDATE ERROR", error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Employee updated successfully");
}

console.log("Employee ID =", employeeId);
  
    return (
    <AppShell
  title="Edit Employee"
  subtitle="Update employee details"
>
  <div className="p-4">

  <input
    value={employeeCode}
    onChange={(e) => setEmployeeCode(e.target.value)}
  />

  <input
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
  />

  <input
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
  />

  <input
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <button onClick={updateEmployee}>
    Update Employee
  </button>

</div>
</AppShell>
  );
}