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
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/parent" element={<RequireParent><ParentDashboard /></RequireParent>} />
    <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
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