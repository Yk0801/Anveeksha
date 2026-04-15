import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import ParentDashboard from "@/pages/ParentDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

// ── Protected route wrappers ──────────────────────────────────────────────────
const RequireParent = ({ children }: { children: React.ReactNode }) => {
  const { parentStudentId } = useAuth();
  const location = useLocation();
  if (!parentStudentId) return <Navigate to="/login?role=parent" state={{ from: location }} replace />;
  return <>{children}</>;
};

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { adminUser } = useAuth();
  const location = useLocation();
  if (!adminUser) return <Navigate to="/login?role=admin" state={{ from: location }} replace />;
  if (adminUser.must_change_password) return <Navigate to="/login?role=admin" state={{ from: location }} replace />;
  return <>{children}</>;
};

import DashboardPanel from "@/components/admin/DashboardPanel";
import StudentsPanel from "@/components/admin/StudentsPanel";
import AttendanceAdminPanel from "@/components/admin/AttendanceAdminPanel";
import FeeManagementPanel from "@/components/admin/FeeManagementPanel";
import MarksAdminPanel from "@/components/admin/MarksAdminPanel";
import RemarksAdminPanel from "@/components/admin/RemarksAdminPanel";
import AdmissionsPanel from "@/components/admin/AdmissionsPanel";
import AnnouncementsPanel from "@/components/admin/AnnouncementsPanel";
import BusPanel from "@/components/admin/BusPanel";
import StaffPanel from "@/components/admin/StaffPanel";
import ManageUsersPanel from "@/components/admin/ManageUsersPanel";
import ReportsPanel from "@/components/admin/ReportsPanel";
import SettingsPanel from "@/components/admin/SettingsPanel";

const AdminIndexRedirect = () => {
  const { adminUser } = useAuth();
  if (adminUser?.role === "faculty") return <Navigate to="attendance" replace />;
  return <Navigate to="dashboard" replace />;
};

import ParentProfilePanel from "@/components/parent/ParentProfilePanel";
import ParentAttendancePanel from "@/components/parent/ParentAttendancePanel";
import ParentFeesPanel from "@/components/parent/ParentFeesPanel";
import ParentMarksPanel from "@/components/parent/ParentMarksPanel";
import ParentRemarksPanel from "@/components/parent/ParentRemarksPanel";
import ParentNoticesPanel from "@/components/parent/ParentNoticesPanel";
import ParentCertificatesPanel from "@/components/parent/ParentCertificatesPanel";
import ParentSettingsPanel from "@/components/parent/ParentSettingsPanel";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/parent" element={<RequireParent><ParentDashboard /></RequireParent>}>
      <Route index element={<Navigate to="/parent/profile" replace />} />
      <Route path="profile" element={<ParentProfilePanel />} />
      <Route path="attendance" element={<ParentAttendancePanel />} />
      <Route path="marks" element={<ParentMarksPanel />} />
      <Route path="fees" element={<ParentFeesPanel />} />
      <Route path="remarks" element={<ParentRemarksPanel />} />
      <Route path="notices" element={<ParentNoticesPanel />} />
      <Route path="certificates" element={<ParentCertificatesPanel />} />
      <Route path="settings" element={<ParentSettingsPanel />} />
    </Route>
    <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>}>
      <Route index element={<AdminIndexRedirect />} />
      <Route path="dashboard" element={<DashboardPanel />} />
      <Route path="students" element={<StudentsPanel />} />
      <Route path="attendance" element={<AttendanceAdminPanel />} />
      <Route path="fee" element={<FeeManagementPanel />} />
      <Route path="marks" element={<MarksAdminPanel />} />
      <Route path="remarks" element={<RemarksAdminPanel />} />
      <Route path="admissions" element={<AdmissionsPanel />} />
      <Route path="announcements" element={<AnnouncementsPanel />} />
      <Route path="bus" element={<BusPanel />} />
      <Route path="staff" element={<StaffPanel />} />
      <Route path="manage-users" element={<ManageUsersPanel />} />
      <Route path="reports" element={<ReportsPanel />} />
      <Route path="settings" element={<SettingsPanel />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;