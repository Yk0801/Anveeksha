import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/utils";

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
    findParentForReset: (admissionNo: string) => Promise<{ error?: string; father_email_id?: string; father_mobile_number?: string, name?: string }>;
    sendParentOtpEmail: (adm: string, email: string, name: string) => Promise<{ error?: string }>;
    sendParentOtpSms: (adm: string, mobile: string, name: string) => Promise<{ error?: string }>;
    verifyParentOtp: (adm: string, otp: string) => Promise<{ error?: string }>;
    changeParentPasswordOffline: (adm: string, pwd: string) => Promise<{ error?: string }>;
    invokeFast2Sms: (message: string, numbers: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
        const role = localStorage.getItem("saps_role");
        if (role === "admin" || role === "faculty") {
            const stored = localStorage.getItem("saps_admin_user");
            if (stored) {
                try { return JSON.parse(stored); } catch { return null; }
            }
        }
        return null;
    });

    const [parentStudentId, setParentStudentId] = useState<string | null>(() => {
        const role = localStorage.getItem("saps_role");
        if (role === "parent") {
            return localStorage.getItem("saps_student_id");
        }
        return null;
    });

    const loginAdmin = async (email: string, password: string) => {
        const hashedPassword = await hashPassword(password);
        const { data, error } = await supabase
            .from("admin_users")
            .select("*")
            .eq("email", email.trim().toLowerCase())
            .eq("password", hashedPassword)
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
        const hashedPassword = await hashPassword(newPassword);
        const { error } = await supabase
            .from("admin_users")
            .update({ password: hashedPassword, must_change_password: false })
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

    // --- Parent Forgot Password Methods ---
    const findParentForReset = async (admissionNo: string) => {
        const { data, error } = await supabase
            .from("students")
            .select("name, father_email_id, father_mobile_number, mother_email_id, mother_mobile_number, guardian_mail_id, guardian_mobile_number, email, mobile_number")
            .eq("admission_no", admissionNo.trim().toUpperCase())
            .single();
            
        if (error || !data) return { error: "Student not found." };
        
        // Find best email
        const targetEmail = data.father_email_id || data.mother_email_id || data.guardian_mail_id || data.email;
        // Find best mobile
        const targetMobile = data.father_mobile_number || data.mother_mobile_number || data.guardian_mobile_number || data.mobile_number;
        
        return { 
            name: data.name, 
            father_email_id: targetEmail, 
            father_mobile_number: targetMobile 
        };
    };

    const sendParentOtpEmail = async (admissionNo: string, email: string, name: string) => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        const { error } = await supabase
            .from("students")
            .update({ otp, otp_expires_at: expires })
            .eq("admission_no", admissionNo.trim().toUpperCase());

        if (error) return { error: "Failed to set OTP in database." };

        // Call the Edge Function
        try {
            const { error: fnErr } = await supabase.functions.invoke("send-parent-otp", {
                body: { email, otp, name }
            });
            if (fnErr) return { error: fnErr.message };
        } catch (e: any) {
            return { error: e.message || "Failed to trigger edge function" };
        }

        return {};
    };

    const invokeFast2Sms = async (message: string, numbers: string) => {
        try {
            // Fast2SMS strictly wants 10-digit numbers, commas allowed. Strip +91, spaces.
            const cleanNumbers = numbers.replace(/\+91/g, '').replace(/\D/g, '');
            const { error: fnErr, data } = await supabase.functions.invoke("fast2sms", {
                body: { message, numbers: cleanNumbers }
            });
            
            if (fnErr) {
                // If the edge function returns a 400 with a custom JSON error, we extract it here!
                let detailedMsg = fnErr.message;
                if (fnErr.context && typeof fnErr.context.json === 'function') {
                    try {
                        const errBody = await fnErr.context.json();
                        if (errBody.error) detailedMsg = errBody.error;
                    } catch (e) {}
                }
                return { error: detailedMsg };
            }
            if (data?.error) return { error: data.error };
        } catch (e: any) {
            return { error: e.message || "Failed to trigger fast2sms edge function" };
        }
        return {};
    };

    const sendParentOtpSms = async (admissionNo: string, mobile: string, name: string) => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        const { error } = await supabase
            .from("students")
            .update({ otp, otp_expires_at: expires })
            .eq("admission_no", admissionNo.trim().toUpperCase());

        if (error) return { error: "Failed to set OTP in database." };

        const message = `Hi ${name || "Parent"}, ${otp} is your verification code for Sri Anveeksha Admin/Parent portal.`;
        return await invokeFast2Sms(message, mobile);
    };


    const verifyParentOtp = async (admissionNo: string, otp: string) => {
        const { data, error } = await supabase
            .from("students")
            .select("otp, otp_expires_at")
            .eq("admission_no", admissionNo.trim().toUpperCase())
            .single();

        if (error || !data) return { error: "Student not found." };
        if (data.otp !== otp) return { error: "Incorrect OTP." };
        if (new Date(data.otp_expires_at) < new Date()) return { error: "OTP has expired." };

        // Clear OTP after use
        await supabase.from("students").update({ otp: null, otp_expires_at: null }).eq("admission_no", admissionNo.trim().toUpperCase());
        return {};
    };

    const changeParentPasswordOffline = async (admissionNo: string, newPassword: string) => {
        const { error } = await supabase
            .from("students")
            .update({ password: newPassword }) // Parent passwords are not currently hashed based on seedData/implementation
            .eq("admission_no", admissionNo.trim().toUpperCase());
            
        if (error) return { error: error.message };
        return {};
    };

    return (
        <AuthContext.Provider value={{
            adminUser, parentStudentId,
            isAdmin: adminUser?.role === "admin" || adminUser?.role === "superadmin",
            isFaculty: adminUser?.role === "faculty",
            isSuperAdmin: adminUser?.role === "superadmin",
            loginAdmin, loginParent, logout, changePassword, sendOtp, verifyOtp,
            findParentForReset, sendParentOtpEmail, sendParentOtpSms, verifyParentOtp, changeParentPasswordOffline,
            invokeFast2Sms
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