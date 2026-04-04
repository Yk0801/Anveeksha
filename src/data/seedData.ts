// Sri Anveeksha Public School — Seed Data

export const SCHOOL = {
  name: "Sri Anveeksha Public School",
  short: "SAPS",
  tagline: "Where every story begins with curiosity.",
  address: "Ootla, Jinnaram, Sangareddy District, Telangana 502319",
  phone: "+91 98765 43210",
  email: "info@srianveeksha.edu.in",
  admEmail: "admin@srianveeksha.edu.in",
  officeHours: "Mon – Sat: 9:00 AM – 4:00 PM",
  established: 2010,
};

export const ADMIN_CREDENTIALS = {
  email: "admin@srianveeksha.edu.in",
  password: "admin123",
};

export interface Student {
  id: string;
  name: string;
  admissionNo: string;
  rollNo: string;
  class: string;
  section: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  joiningDate: string;
  aadhar: string;
  address: string;
  photo?: string;
  status: string;
}

export interface Parent {
  studentId: string;
  loginPassword: string;
  fatherName: string;
  fatherOcc: string;
  fatherMobile: string;
  fatherEmail: string;
  motherName: string;
  motherOcc: string;
  motherMobile: string;
  motherEmail: string;
  currentAddress: string;
  permanentAddress: string;
  annualIncome: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string; // YYYY-MM-DD
  status: "P" | "A" | "L" | "H";
}

export interface FeeRecord {
  studentId: string;
  term: string;
  type: string;
  amount: number;
  dueDate: string;
  paidOn: string | null;
  status: "Paid" | "Pending";
  receiptNo: string | null;
}

export interface Remark {
  studentId: string;
  subject: string;
  remark: string;
  givenBy: string;
  date: string;
  category: "Academic" | "Disciplinary" | "General";
}

export const STUDENTS: Student[] = [
  {
    id: "S001",
    name: "Arjun Kumar Reddy",
    admissionNo: "ADM001",
    rollNo: "001",
    class: "Pre-KG",
    section: "A",
    dob: "2021-05-15",
    gender: "Male",
    bloodGroup: "O+",
    joiningDate: "2024-06-10",
    aadhar: "XXXX-XXXX-1234",
    address: "H.No. 5-4-32, Ootla Village, Jinnaram, Sangareddy, Telangana 502319",
    status: "Active",
  },
  {
    id: "S002",
    name: "Kavya Sharma",
    admissionNo: "ADM002",
    rollNo: "002",
    class: "Pre-KG",
    section: "A",
    dob: "2021-08-22",
    gender: "Female",
    bloodGroup: "A+",
    joiningDate: "2024-06-10",
    aadhar: "XXXX-XXXX-5678",
    address: "D.No. 2-1-10, Jinnaram Village, Sangareddy, Telangana 502319",
    status: "Active",
  },
  {
    id: "S003",
    name: "Mohammed Aariz Khan",
    admissionNo: "ADM003",
    rollNo: "003",
    class: "LKG",
    section: "A",
    dob: "2020-11-03",
    gender: "Male",
    bloodGroup: "B+",
    joiningDate: "2023-06-10",
    aadhar: "XXXX-XXXX-9012",
    address: "H.No. 8-2-15, Ootla, Jinnaram, Sangareddy, Telangana 502319",
    status: "Active",
  },
  {
    id: "S004",
    name: "Pooja Nair",
    admissionNo: "ADM004",
    rollNo: "004",
    class: "LKG",
    section: "B",
    dob: "2020-03-18",
    gender: "Female",
    bloodGroup: "AB+",
    joiningDate: "2023-06-10",
    aadhar: "XXXX-XXXX-3456",
    address: "Flat 3B, Shiridi Residency, Jinnaram, Sangareddy, Telangana",
    status: "Active",
  },
  {
    id: "S005",
    name: "Rohith Goud",
    admissionNo: "ADM005",
    rollNo: "005",
    class: "UKG",
    section: "A",
    dob: "2019-07-30",
    gender: "Male",
    bloodGroup: "O-",
    joiningDate: "2022-06-10",
    aadhar: "XXXX-XXXX-7890",
    address: "H.No. 1-5-7, Ootla Village, Jinnaram, Telangana 502319",
    status: "Active",
  },
];

export const PARENTS: Parent[] = [
  {
    studentId: "S001", loginPassword: "password123",
    fatherName: "Ramesh Kumar Reddy", fatherOcc: "Farmer", fatherMobile: "9876543210", fatherEmail: "ramesh.reddy@gmail.com",
    motherName: "Sunitha Reddy", motherOcc: "Homemaker", motherMobile: "9876543211", motherEmail: "sunitha.reddy@gmail.com",
    currentAddress: "H.No. 5-4-32, Ootla, Jinnaram", permanentAddress: "H.No. 5-4-32, Ootla, Jinnaram", annualIncome: "₹3,00,000",
  },
  {
    studentId: "S002", loginPassword: "password123",
    fatherName: "Suresh Sharma", fatherOcc: "Business", fatherMobile: "9876543212", fatherEmail: "suresh.sharma@gmail.com",
    motherName: "Rekha Sharma", motherOcc: "Teacher", motherMobile: "9876543213", motherEmail: "rekha.sharma@gmail.com",
    currentAddress: "D.No. 2-1-10, Jinnaram Village", permanentAddress: "D.No. 2-1-10, Jinnaram Village", annualIncome: "₹5,50,000",
  },
  {
    studentId: "S003", loginPassword: "password123",
    fatherName: "Abdul Khan", fatherOcc: "Shop Owner", fatherMobile: "9876543214", fatherEmail: "abdul.khan@gmail.com",
    motherName: "Fathima Khan", motherOcc: "Homemaker", motherMobile: "9876543215", motherEmail: "fathima.khan@gmail.com",
    currentAddress: "H.No. 8-2-15, Ootla", permanentAddress: "H.No. 8-2-15, Ootla", annualIncome: "₹4,00,000",
  },
  {
    studentId: "S004", loginPassword: "password123",
    fatherName: "Gopal Nair", fatherOcc: "Software Engineer", fatherMobile: "9876543216", fatherEmail: "gopal.nair@gmail.com",
    motherName: "Lakshmi Nair", motherOcc: "Nurse", motherMobile: "9876543217", motherEmail: "lakshmi.nair@gmail.com",
    currentAddress: "Flat 3B, Shiridi Residency, Jinnaram", permanentAddress: "Flat 3B, Shiridi Residency, Jinnaram", annualIncome: "₹9,00,000",
  },
  {
    studentId: "S005", loginPassword: "password123",
    fatherName: "Srinivas Goud", fatherOcc: "Govt. Employee", fatherMobile: "9876543218", fatherEmail: "srinivas.goud@gmail.com",
    motherName: "Padmavathi Goud", motherOcc: "Homemaker", motherMobile: "9876543219", motherEmail: "padmavathi.goud@gmail.com",
    currentAddress: "H.No. 1-5-7, Ootla", permanentAddress: "H.No. 1-5-7, Ootla", annualIncome: "₹4,80,000",
  },
];

const genDates = (studentId: string): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const months = ["2025-01", "2025-02", "2025-03"];
  const holidays = ["2025-01-26", "2025-02-26", "2025-03-17"];
  months.forEach((month) => {
    const [y, m] = month.split("-").map(Number);
    const days = new Date(y, m, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dow = new Date(dateStr).getDay();
      if (dow === 0) continue; // skip Sundays
      if (holidays.includes(dateStr)) { records.push({ studentId, date: dateStr, status: "H" }); continue; }
      if (dow === 6) { records.push({ studentId, date: dateStr, status: "H" }); continue; } // Saturdays holiday
      const rand = Math.random();
      const status: "P" | "A" | "L" = rand > 0.92 ? "A" : rand > 0.87 ? "L" : "P";
      records.push({ studentId, date: dateStr, status });
    }
  });
  return records;
};

export const ATTENDANCE: AttendanceRecord[] = [
  ...genDates("S001"), ...genDates("S002"), ...genDates("S003"), ...genDates("S004"), ...genDates("S005")
];

export const FEES: FeeRecord[] = [
  { studentId: "S001", term: "Term 1", type: "Tuition Fee", amount: 8000, dueDate: "Jul 15, 2025", paidOn: "Jul 10, 2025", status: "Paid", receiptNo: "RCP-001" },
  { studentId: "S001", term: "Term 1", type: "Transport Fee", amount: 1500, dueDate: "Jul 15, 2025", paidOn: "Jul 10, 2025", status: "Paid", receiptNo: "RCP-002" },
  { studentId: "S001", term: "Term 2", type: "Tuition Fee", amount: 8000, dueDate: "Oct 15, 2025", paidOn: null, status: "Pending", receiptNo: null },
  { studentId: "S001", term: "Term 2", type: "Transport Fee", amount: 1500, dueDate: "Oct 15, 2025", paidOn: null, status: "Pending", receiptNo: null },

  { studentId: "S002", term: "Term 1", type: "Tuition Fee", amount: 8000, dueDate: "Jul 15, 2025", paidOn: "Jul 12, 2025", status: "Paid", receiptNo: "RCP-003" },
  { studentId: "S002", term: "Term 1", type: "Transport Fee", amount: 1500, dueDate: "Jul 15, 2025", paidOn: "Jul 12, 2025", status: "Paid", receiptNo: "RCP-004" },
  { studentId: "S002", term: "Term 2", type: "Tuition Fee", amount: 8000, dueDate: "Oct 15, 2025", paidOn: null, status: "Pending", receiptNo: null },
  { studentId: "S002", term: "Term 2", type: "Transport Fee", amount: 1500, dueDate: "Oct 15, 2025", paidOn: null, status: "Pending", receiptNo: null },

  { studentId: "S003", term: "Term 1", type: "Tuition Fee", amount: 9000, dueDate: "Jul 15, 2025", paidOn: "Jul 8, 2025", status: "Paid", receiptNo: "RCP-005" },
  { studentId: "S003", term: "Term 1", type: "Transport Fee", amount: 1500, dueDate: "Jul 15, 2025", paidOn: "Jul 8, 2025", status: "Paid", receiptNo: "RCP-006" },
  { studentId: "S003", term: "Term 2", type: "Tuition Fee", amount: 9000, dueDate: "Oct 15, 2025", paidOn: null, status: "Pending", receiptNo: null },
  { studentId: "S003", term: "Term 2", type: "Transport Fee", amount: 1500, dueDate: "Oct 15, 2025", paidOn: null, status: "Pending", receiptNo: null },

  { studentId: "S004", term: "Term 1", type: "Tuition Fee", amount: 9000, dueDate: "Jul 15, 2025", paidOn: "Jul 14, 2025", status: "Paid", receiptNo: "RCP-007" },
  { studentId: "S004", term: "Term 2", type: "Tuition Fee", amount: 9000, dueDate: "Oct 15, 2025", paidOn: null, status: "Pending", receiptNo: null },

  { studentId: "S005", term: "Term 1", type: "Tuition Fee", amount: 10000, dueDate: "Jul 15, 2025", paidOn: "Jul 5, 2025", status: "Paid", receiptNo: "RCP-008" },
  { studentId: "S005", term: "Term 1", type: "Transport Fee", amount: 1500, dueDate: "Jul 15, 2025", paidOn: "Jul 5, 2025", status: "Paid", receiptNo: "RCP-009" },
  { studentId: "S005", term: "Term 2", type: "Tuition Fee", amount: 10000, dueDate: "Oct 15, 2025", paidOn: null, status: "Pending", receiptNo: null },
  { studentId: "S005", term: "Term 2", type: "Transport Fee", amount: 1500, dueDate: "Oct 15, 2025", paidOn: null, status: "Pending", receiptNo: null },
];

export const REMARKS: Remark[] = [
  { studentId: "S001", subject: "English", remark: "Shows excellent listening skills and participates actively.", givenBy: "Mrs. Lakshmi", date: "Mar 10, 2025", category: "Academic" },
  { studentId: "S001", subject: "Mathematics", remark: "Needs extra practice with number recognition.", givenBy: "Mr. Suresh", date: "Mar 8, 2025", category: "Academic" },
  { studentId: "S001", subject: "General", remark: "Very cooperative with peers and teachers.", givenBy: "Mrs. Priya", date: "Mar 5, 2025", category: "General" },

  { studentId: "S002", subject: "Art", remark: "Exceptionally creative. Outstanding work in drawing.", givenBy: "Mrs. Kavitha", date: "Mar 12, 2025", category: "Academic" },
  { studentId: "S002", subject: "General", remark: "Disrupted class activity twice this week.", givenBy: "Mrs. Priya", date: "Mar 7, 2025", category: "Disciplinary" },
  { studentId: "S002", subject: "English", remark: "Pronunciation and vocabulary improving well.", givenBy: "Mrs. Lakshmi", date: "Mar 3, 2025", category: "Academic" },

  { studentId: "S003", subject: "Mathematics", remark: "Grasps concepts quickly. Ready for advanced exercises.", givenBy: "Mr. Suresh", date: "Mar 14, 2025", category: "Academic" },
  { studentId: "S003", subject: "General", remark: "Leadership shown during group play.", givenBy: "Mrs. Priya", date: "Mar 6, 2025", category: "General" },
  { studentId: "S003", subject: "EVS", remark: "Curious and asks insightful questions.", givenBy: "Mr. Rahul", date: "Mar 2, 2025", category: "Academic" },

  { studentId: "S004", subject: "English", remark: "Reading fluency is commendable for her age.", givenBy: "Mrs. Lakshmi", date: "Mar 11, 2025", category: "Academic" },
  { studentId: "S004", subject: "General", remark: "Consistently on time and follows school rules.", givenBy: "Mrs. Priya", date: "Mar 4, 2025", category: "General" },
  { studentId: "S004", subject: "Mathematics", remark: "Excellent number writing and counting skills.", givenBy: "Mr. Suresh", date: "Mar 1, 2025", category: "Academic" },

  { studentId: "S005", subject: "EVS", remark: "Demonstrated excellent understanding of plants and environment.", givenBy: "Mr. Rahul", date: "Mar 13, 2025", category: "Academic" },
  { studentId: "S005", subject: "Mathematics", remark: "Top performer in class. Leads number activities.", givenBy: "Mr. Suresh", date: "Mar 9, 2025", category: "Academic" },
  { studentId: "S005", subject: "General", remark: "Used inappropriate language during recess. Counselled.", givenBy: "Mrs. Priya", date: "Mar 1, 2025", category: "Disciplinary" },
];

export const NOTICES = [
  { id: 1, date: "04 Apr 2025", title: "Annual Sports Day – 18 April 2025", description: "Students are to wear sports uniform. Parents are invited.", read: false },
  { id: 2, date: "01 Apr 2025", title: "Summer Vacation Schedule", description: "School will remain closed from May 15 to June 9. Classes resume June 10.", read: false },
  { id: 3, date: "28 Mar 2025", title: "Term 2 Fee Reminder", description: "Please ensure Term 2 fees are paid before October 15 to avoid late charges.", read: true },
  { id: 4, date: "15 Mar 2025", title: "Parent-Teacher Meeting", description: "PTM scheduled on March 22, 2025, from 10 AM to 1 PM.", read: true },
];

export const RECEIPTS = [
  { receiptNo: "RCP-001", date: "Jul 10, 2025", amount: 8000, method: "Online Transfer", studentId: "S001" },
  { receiptNo: "RCP-002", date: "Jul 10, 2025", amount: 1500, method: "Online Transfer", studentId: "S001" },
  { receiptNo: "RCP-003", date: "Jul 12, 2025", amount: 8000, method: "Cash", studentId: "S002" },
  { receiptNo: "RCP-004", date: "Jul 12, 2025", amount: 1500, method: "Cash", studentId: "S002" },
  { receiptNo: "RCP-005", date: "Jul 8, 2025", amount: 9000, method: "UPI", studentId: "S003" },
  { receiptNo: "RCP-006", date: "Jul 8, 2025", amount: 1500, method: "UPI", studentId: "S003" },
  { receiptNo: "RCP-007", date: "Jul 14, 2025", amount: 9000, method: "Cheque", studentId: "S004" },
  { receiptNo: "RCP-008", date: "Jul 5, 2025", amount: 10000, method: "Online Transfer", studentId: "S005" },
  { receiptNo: "RCP-009", date: "Jul 5, 2025", amount: 1500, method: "Online Transfer", studentId: "S005" },
];

export const STAFF = [
  { id: 1, name: "Mrs. Ananya Mishra", designation: "Principal", subject: "Administration", mobile: "9876540001", email: "ananya@srianveeksha.edu.in" },
  { id: 2, name: "Mrs. Lakshmi Devi", designation: "Senior Teacher", subject: "English", mobile: "9876540002", email: "lakshmi@srianveeksha.edu.in" },
  { id: 3, name: "Mr. Suresh Kumar", designation: "Teacher", subject: "Mathematics", mobile: "9876540003", email: "suresh@srianveeksha.edu.in" },
  { id: 4, name: "Mr. Rahul Verma", designation: "Teacher", subject: "EVS / Science", mobile: "9876540004", email: "rahul@srianveeksha.edu.in" },
  { id: 5, name: "Mrs. Priya Rao", designation: "Class Teacher – Pre-KG A", subject: "General", mobile: "9876540005", email: "priya@srianveeksha.edu.in" },
  { id: 6, name: "Mrs. Kavitha Sharma", designation: "Art Teacher", subject: "Art & Craft", mobile: "9876540006", email: "kavitha@srianveeksha.edu.in" },
  { id: 7, name: "Ms. Deepa Nair", designation: "Dance Teacher", subject: "Dance", mobile: "9876540007", email: "deepa@srianveeksha.edu.in" },
  { id: 8, name: "Mr. Arun Goud", designation: "PT Master", subject: "Physical Education", mobile: "9876540008", email: "arun@srianveeksha.edu.in" },
];

export const BUS_ROUTES = [
  { id: 1, routeNo: "R-01", routeName: "Ootla – Jinnaram", areas: "Ootla, Bhanur, Chegunta", pickup: "7:30 AM", drop: "4:30 PM", driver: "Ramu Naik", mobile: "9876550001" },
  { id: 2, routeNo: "R-02", routeName: "Sangareddy – Patancheru", areas: "Sangareddy, Manoharabad, Patancheru", pickup: "7:00 AM", drop: "5:00 PM", driver: "Venkat Reddy", mobile: "9876550002" },
  { id: 3, routeNo: "R-03", routeName: "Narsapur – Sadasivpet", areas: "Narsapur, Ramachandrapuram, Sadasivpet", pickup: "7:15 AM", drop: "4:45 PM", driver: "Kishore Kumar", mobile: "9876550003" },
];

export const ADMISSIONS_INQUIRIES = [
  { id: 1, parentName: "Vijay Rao", childName: "Anika Rao", class: "Pre-KG", phone: "9876561001", date: "Apr 2, 2025", status: "New" },
  { id: 2, parentName: "Sameer Joshi", childName: "Rohan Joshi", class: "LKG", phone: "9876561002", date: "Apr 1, 2025", status: "Reviewing" },
  { id: 3, parentName: "Nalini Devi", childName: "Nisha Devi", class: "UKG", phone: "9876561003", date: "Mar 30, 2025", status: "Accepted" },
  { id: 4, parentName: "Vamshi Krishna", childName: "Kiran Krishna", class: "Pre-KG", phone: "9876561004", date: "Mar 28, 2025", status: "Rejected" },
];

export const ANNOUNCEMENTS = [
  { id: 1, title: "Annual Sports Day – April 18", message: "All students must wear sports uniform. Parents warmly invited.", audience: "All", date: "Apr 4, 2025" },
  { id: 2, title: "Summer Vacation Notice", message: "School closed May 15 – June 9. Classes resume June 10.", audience: "All Parents", date: "Apr 1, 2025" },
  { id: 3, title: "Staff Meeting Reminder", message: "Monthly staff meeting on April 7 at 3:30 PM in the conference room.", audience: "All Staff", date: "Mar 30, 2025" },
];
