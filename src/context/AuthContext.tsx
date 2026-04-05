import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type AdminRole = "superadmin" | "admin" | "faculty";

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: AdminRole;
    designation?: string;
    subject?: string;
    mobile?: string;
    must_change_password: boolean;
}

interface AuthContextType {
    adminUser: AdminUser | null;
    parentStudentId: string | null;
    isAdmin: boolean;
    isFaculty: boolean;
    isSuperAdmin: boolean;
    loginAdmin: (email: string, password: string) => Promise<{ error?: string; mustChange?: boolean }>;
    loginParent: (admissionNo: string, password: string) => Promise<{ error?: string }>;
    logout: () => void;
    changePassword: (newPassword: string) => Promise<{ error?: string }>;
    sendOtp: (email: string) => Promise<{ error?: string }>;
    verifyOtp: (email: string, otp: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [parentStudentId, setParentStudentId] = useState<string | null>(null);

    useEffect(() => {
        // Restore session from localStorage
        const role = localStorage.getItem("saps_role");
        if (role === "parent") {
            setParentStudentId(localStorage.getItem("saps_student_id"));
        } else if (role === "admin" || role === "faculty") {
            const stored = localStorage.getItem("saps_admin_user");
            if (stored) {
                try { setAdminUser(JSON.parse(stored)); } catch { }
            }
        }
    }, []);

    const loginAdmin = async (email: string, password: string) => {
        const { data, error } = await supabase
            .from("admin_users")
            .select("*")
            .eq("email", email.trim().toLowerCase())
            .eq("password", password)
            .eq("is_active", true)
            .single();

        if (error) {
            console.error("Supabase login error:", error);
            return { error: `DB Error: ${error.message} (${error.code})` };
        }
        if (!data) {
            return { error: "No data returned (Invalid email or password)." };
        }

        const user: AdminUser = {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
            designation: data.designation,
            subject: data.subject,
            mobile: data.mobile,
            must_change_password: data.must_change_password,
        };

        setAdminUser(user);
        localStorage.setItem("saps_role", data.role === "faculty" ? "faculty" : "admin");
        localStorage.setItem("saps_admin_user", JSON.stringify(user));

        if (data.must_change_password) {
            return { mustChange: true };
        }
        return {};
    };

    const loginParent = async (admissionNo: string, password: string) => {
        const { data, error } = await supabase
            .from("students")
            .select("id, name, status")
            .eq("admission_no", admissionNo.trim().toUpperCase())
            .eq("password", password)
            .single();

        if (error || !data) return { error: "Invalid Admission Number or Password." };
        if (data.status !== "Active") return { error: "This student account is inactive. Contact school admin." };

        setParentStudentId(data.id);
        localStorage.setItem("saps_role", "parent");
        localStorage.setItem("saps_student_id", data.id);
        return {};
    };

    const logout = () => {
        setAdminUser(null);
        setParentStudentId(null);
        localStorage.removeItem("saps_role");
        localStorage.removeItem("saps_student_id");
        localStorage.removeItem("saps_admin_user");
    };

    const changePassword = async (newPassword: string) => {
        if (!adminUser) return { error: "Not logged in." };
        const { error } = await supabase
            .from("admin_users")
            .update({ password: newPassword, must_change_password: false })
            .eq("id", adminUser.id);

        if (error) return { error: error.message };

        const updated = { ...adminUser, must_change_password: false };
        setAdminUser(updated);
        localStorage.setItem("saps_admin_user", JSON.stringify(updated));
        return {};
    };

    // Simple OTP: generate 6-digit code, store in DB, "send" via console (replace with email service in prod)
    const sendOtp = async (email: string) => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

        const { error } = await supabase
            .from("admin_users")
            .update({ otp, otp_expires_at: expires })
            .eq("email", email.trim().toLowerCase());

        if (error) return { error: "Email not found or database error." };

        // In production: send email via Resend/Nodemailer
        // For MVP: log OTP to console so developer can test
        console.log(`[SAPS OTP for ${email}]: ${otp}`);
        return {};
    };

    const verifyOtp = async (email: string, otp: string) => {
        const { data, error } = await supabase
            .from("admin_users")
            .select("otp, otp_expires_at")
            .eq("email", email.trim().toLowerCase())
            .single();

        if (error || !data) return { error: "Email not found." };
        if (data.otp !== otp) return { error: "Incorrect OTP." };
        if (new Date(data.otp_expires_at) < new Date()) return { error: "OTP has expired. Request a new one." };

        // Clear OTP after use
        await supabase.from("admin_users").update({ otp: null, otp_expires_at: null }).eq("email", email);
        return {};
    };

    return (
        <AuthContext.Provider value={{
            adminUser, parentStudentId,
            isAdmin: adminUser?.role === "admin" || adminUser?.role === "superadmin",
            isFaculty: adminUser?.role === "faculty",
            isSuperAdmin: adminUser?.role === "superadmin",
            loginAdmin, loginParent, logout, changePassword, sendOtp, verifyOtp,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};