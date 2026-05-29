// Mock dataset shared across modules. Replace with backend queries later.
export const departments = ["Engineering", "Finance", "HR", "Sales", "Operations", "Marketing"];
export const locations = ["Bengaluru", "Hyderabad", "Mumbai", "Pune", "Remote"];

export interface Employee {
  id: string;
  code: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  location: string;
  manager: string;
  status: "Active" | "Inactive" | "On Leave";
  joined: string;
  ctc: number;
}

export const employees: Employee[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `e${i + 1}`,
  code: `EMP${String(1001 + i)}`,
  name: ["Aarav Sharma","Diya Patel","Vivaan Rao","Anaya Iyer","Aditya Nair","Ishaan Gupta","Saanvi Reddy","Arjun Kumar","Myra Singh","Reyansh Verma","Aanya Joshi","Kabir Malhotra","Anika Bose","Vihaan Das","Sara Khan","Aryan Mehta","Riya Kapoor","Ayaan Shah","Aadhya Pillai","Krish Naidu","Tara Menon","Dev Anand","Pari Chawla","Rohan Bhatt"][i],
  email: `user${i + 1}@company.com`,
  department: departments[i % departments.length],
  designation: ["Engineer","Sr. Engineer","Manager","Analyst","Lead","Director"][i % 6],
  location: locations[i % locations.length],
  manager: i < 3 ? "—" : ["Aarav Sharma", "Diya Patel", "Vivaan Rao"][i % 3],
  status: i % 9 === 0 ? "On Leave" : "Active",
  joined: `202${i % 5}-0${(i % 9) + 1}-1${i % 9}`,
  ctc: 600000 + i * 47000,
}));

export interface LeaveRequest {
  id: string;
  employee: string;
  type: "Casual" | "Sick" | "Earned" | "WFH" | "Comp Off";
  from: string;
  to: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
}
export const leaveRequests: LeaveRequest[] = [
  { id: "L1", employee: "Aarav Sharma", type: "Casual", from: "2026-05-28", to: "2026-05-29", days: 2, status: "Pending", reason: "Family event" },
  { id: "L2", employee: "Diya Patel", type: "Sick", from: "2026-05-25", to: "2026-05-25", days: 1, status: "Approved", reason: "Fever" },
  { id: "L3", employee: "Arjun Kumar", type: "Earned", from: "2026-06-10", to: "2026-06-15", days: 6, status: "Pending", reason: "Vacation" },
  { id: "L4", employee: "Sara Khan", type: "WFH", from: "2026-05-27", to: "2026-05-27", days: 1, status: "Approved", reason: "Internet work" },
];

export interface PayrollRow {
  employee: string; basic: number; hra: number; allowances: number; deductions: number; net: number;
}
export const payroll: PayrollRow[] = employees.slice(0, 10).map((e) => {
  const basic = Math.round(e.ctc * 0.4 / 12);
  const hra = Math.round(basic * 0.5);
  const allow = Math.round(e.ctc * 0.15 / 12);
  const ded = Math.round(basic * 0.12 + 200);
  return { employee: e.name, basic, hra, allowances: allow, deductions: ded, net: basic + hra + allow - ded };
});

export interface TravelRequest {
  id: string; employee: string; from: string; to: string; dates: string; mode: string; estimate: number; status: "Draft" | "Submitted" | "Approved" | "Booked";
}
export const travel: TravelRequest[] = [
  { id: "T1", employee: "Vivaan Rao", from: "Bengaluru", to: "Mumbai", dates: "2026-06-02 → 2026-06-04", mode: "Flight", estimate: 18500, status: "Approved" },
  { id: "T2", employee: "Anaya Iyer", from: "Hyderabad", to: "Pune", dates: "2026-06-07 → 2026-06-08", mode: "Flight", estimate: 12000, status: "Submitted" },
  { id: "T3", employee: "Kabir Malhotra", from: "Mumbai", to: "Bengaluru", dates: "2026-05-30 → 2026-05-31", mode: "Train", estimate: 4500, status: "Booked" },
];

export interface ExpenseRow {
  id: string; employee: string; category: string; amount: number; date: string; status: "Submitted" | "Approved" | "Reimbursed" | "Rejected";
}
export const expenses: ExpenseRow[] = [
  { id: "E1", employee: "Vivaan Rao", category: "Travel - Cab", amount: 1240, date: "2026-05-21", status: "Approved" },
  { id: "E2", employee: "Anaya Iyer", category: "Meals", amount: 870, date: "2026-05-23", status: "Submitted" },
  { id: "E3", employee: "Aarav Sharma", category: "Office Supplies", amount: 2300, date: "2026-05-18", status: "Reimbursed" },
  { id: "E4", employee: "Sara Khan", category: "Internet", amount: 1500, date: "2026-05-15", status: "Approved" },
];

export const holidays = [
  { date: "2026-01-26", name: "Republic Day", location: "All India" },
  { date: "2026-03-17", name: "Holi", location: "All India" },
  { date: "2026-08-15", name: "Independence Day", location: "All India" },
  { date: "2026-10-02", name: "Gandhi Jayanti", location: "All India" },
  { date: "2026-11-12", name: "Diwali", location: "All India" },
];

// 7-day attendance snapshot for charts
export const weeklyAttendance = [
  { day: "Mon", present: 220, absent: 12, wfh: 38 },
  { day: "Tue", present: 228, absent: 9, wfh: 33 },
  { day: "Wed", present: 232, absent: 7, wfh: 31 },
  { day: "Thu", present: 226, absent: 11, wfh: 33 },
  { day: "Fri", present: 215, absent: 14, wfh: 41 },
  { day: "Sat", present: 110, absent: 4, wfh: 19 },
  { day: "Sun", present: 0, absent: 0, wfh: 0 },
];

export const payrollTrend = [
  { month: "Dec", amount: 8.2 },
  { month: "Jan", amount: 8.5 },
  { month: "Feb", amount: 8.7 },
  { month: "Mar", amount: 8.9 },
  { month: "Apr", amount: 9.1 },
  { month: "May", amount: 9.4 },
];
