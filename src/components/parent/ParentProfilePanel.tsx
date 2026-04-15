import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#d4af37] mb-4 pb-2 border-b border-slate-100" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
    {children}
  </h3>
);

const ParentProfilePanel = () => {
  const { parentStudentId } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parentStudentId) return;
    supabase.from("students").select("*").eq("id", parentStudentId).single().then(({ data }) => {
      if (data) setStudent(data);
      setLoading(false);
    });
  }, [parentStudentId]);

  if (loading || !student) return <div className="p-6 text-slate-500">Loading profile...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionTitle>Bio-Data</SectionTitle>
        <div className="grid md:grid-cols-2 gap-y-4 gap-x-6">
          {[["Name", student.name], ["Admission No.", student.admission_no], ["Roll No.", student.roll_no || "—"], 
            ["Class / Section", `${student.class} — ${student.section}`], ["Date of Birth", student.dob], 
            ["Gender", student.gender], ["Nationality", student.nationality || "Indian"], ["Religion", student.religion || "—"],
            ["Caste", student.caste || "—"], ["Student Mobile", student.student_mobile || "—"], 
            ["Student Email", student.student_email || "—"], ["Aadhar", student.aadhar_no || "—"],
            ["Joining Date", student.joining_date || "—"], ["Blood Group", student.blood_group || "—"]
          ].map(([l, v]) => (
            <div key={l as string} className="flex justify-between py-2 border-b border-slate-50 text-sm">
              <span className="text-slate-500 font-medium">{l}</span>
              <span className="text-slate-900 font-semibold text-right">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionTitle>Parent Details</SectionTitle>
        <div className="grid md:grid-cols-2 gap-y-4 gap-x-6">
          {[["Father's Name", student.father_name], ["Father's Occupation", student.father_occupation || "—"], 
            ["Father's Mobile", student.father_mobile || "—"], ["Father's Email", student.father_email || "—"], 
            ["Father's Aadhar", student.father_aadhar || "—"], ["Mother's Name", student.mother_name], 
            ["Mother's Occupation", student.mother_occupation || "—"], ["Mother's Mobile", student.mother_mobile || "—"], 
            ["Mother's Email", student.mother_email || "—"], ["Mother's Aadhar", student.mother_aadhar || "—"],
            ["Correspondence Address", student.correspondence_address || "—"], ["Permanent Address", student.permanent_address || "—"],
            ["Annual Income", student.annual_income || "—"]
          ].map(([l, v]) => (
            <div key={l as string} className="flex justify-between py-2 border-b border-slate-50 text-sm">
              <span className="text-slate-500 font-medium">{l}</span>
              <span className="text-slate-900 font-semibold text-right">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {student.guardian_name && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <SectionTitle>Guardian Details</SectionTitle>
          <div className="grid md:grid-cols-2 gap-y-4 gap-x-6">
            {[["Guardian's Name", student.guardian_name], ["Relationship", student.guardian_relation || "—"], 
              ["Guardian's Mobile", student.guardian_mobile || "—"], ["Guardian's Email", student.guardian_email || "—"], 
              ["Guardian's Aadhar", student.guardian_aadhar || "—"], ["Guardian's Address", student.guardian_address || "—"]
            ].map(([l, v]) => (
              <div key={l as string} className="flex justify-between py-2 border-b border-slate-50 text-sm">
                <span className="text-slate-500 font-medium">{l}</span>
                <span className="text-slate-900 font-semibold text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentProfilePanel;
