import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RequireAuth } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/employees-new")({
  component: () => (
     <RequireAuth>
      <NewEmployeePage />
    </RequireAuth>
  ), 
});


function NewEmployeePage() {
  
  const navigate = useNavigate();
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

  async function saveEmployee() {
  
    if (
    !employeeCode ||
    !firstName ||
    !lastName ||
    !email ||
    !joiningDate ||
    !departmentId ||
    !designationId ||
    !gender
  ) {
    alert("Please fill all mandatory fields");
    return;
  }

    const { error } = await supabase
    .from("employees")
    .insert({
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
      status: "Active",
    });

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  alert("Employee created successfully");
}

  useEffect(() => {
  async function loadMasterData() {

    const { data: depts } = await supabase
      .from("departments")
      .select("*");

    const { data: desigs } = await supabase
      .from("designations")
      .select("*");

    setDepartments(depts || []);
    setDesignations(desigs || []);

    console.log("Departments", depts);
    console.log("Designations", desigs);
  }

  loadMasterData();
}, []);

  return (
    <AppShell
      title="Edit Employee"
      subtitle="Update employee details"
    >
      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <Label>Employee Code</Label>
              <Input
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                placeholder="EMP001"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div>
              <Label>Joining Date</Label>
              <Input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
              />
            </div>

            <div>
              <Label>Gender</Label>
              <Input
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>

            <div>
              <Label>Department</Label>

              <Select
                value={departmentId}
                onValueChange={setDepartmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>

                <SelectContent>
                  {departments.map((dept: any) => (
                    <SelectItem
                      key={dept.id}
                      value={dept.id}
                    >
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Designation</Label>
              <Select
                value={designationId}
                onValueChange={setDesignationId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Designation" />
                </SelectTrigger>
                <SelectContent>
                  {designations.map((desig: any) => (
                    <SelectItem
                      key={desig.id}
                      value={desig.id}
                    >
                      {desig.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Employment Type</Label>
              <Input placeholder="Permanent / Contract" />
            </div>

            <div>
              <Label>Reporting Manager</Label>
              <Input />
            </div>

            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate({
                    to: "/employees",
                  })
                }
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={saveEmployee}
              >
                Save Employee
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}