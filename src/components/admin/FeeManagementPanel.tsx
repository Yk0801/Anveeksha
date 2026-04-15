import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Student } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

// ─── FEE MANAGEMENT ──────────────────────────────────────────────────────────
const FeeManagementPanel = () => {
  const [search, setSearch] = useState("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [fees, setFees] = useState<any[]>([]);
  const [outstanding, setOutstanding] = useState<any[]>([]);
  const [tab, setTab] = useState<"student" | "outstanding">("student");
  
  // Fee Structure Form State
  const [showBuilder, setShowBuilder] = useState(false);
  const [feeForm, setFeeForm] = useState({ 
      tuition: "", terms: "1", books: "", uniform: "", admission: "", transport: "", dueDate: "" 
  });
  
  const [loadingList, setLoadingList] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Load all students on mount
  useEffect(() => {
    const loadAllStudents = async () => {
      setLoadingList(true);
      const { data } = await supabase.from("students").select("*").eq("status", "Active").order("name");
      setAllStudents((data as Student[]) || []);
      setLoadingList(false);
    };
    loadAllStudents();
  }, []);

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!search.trim()) return allStudents;
    const q = search.toLowerCase();
    return allStudents.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.admission_no?.toLowerCase().includes(q) ||
      s.class?.toLowerCase().includes(q)
    );
  }, [allStudents, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  useEffect(() => { setCurrentPage(1); }, [search, entriesPerPage]);

  const selectStudent = async (s: Student) => {
    setStudent(s);
    setShowBuilder(false);
    setLoadingProfile(true);
    const { data: fData } = await supabase.from("fees").select("*").eq("student_id", s.id).order("created_at", { ascending: false });
    setFees(fData || []);
    setLoadingProfile(false);
  };

  useEffect(() => {
    if (tab === "outstanding") {
      supabase.from("fees").select("*, students(name,class,admission_no)").eq("status", "Pending").order("due_date").then(({ data }) => setOutstanding(data || []));
    }
  }, [tab]);

  const generateStructure = async () => {
    if (!student) return;
    setSaving(true);
    
    // We will build an array of fee rows to insert
    const rowsToInsert: any[] = [];
    const basePayload = { 
        student_id: student.id, 
        due_date: feeForm.dueDate || new Date().toISOString().split("T")[0],
        status: "Pending" 
    };

    // 1. Admission Fee
    if (Number(feeForm.admission) > 0) {
        rowsToInsert.push({ ...basePayload, type: "Admission Fee", term: "One Time", amount: Number(feeForm.admission) });
    }
    // 2. Books & Bag
    if (Number(feeForm.books) > 0) {
        rowsToInsert.push({ ...basePayload, type: "Books & Bag", term: "Yearly", amount: Number(feeForm.books) });
    }
    // 3. Uniform
    if (Number(feeForm.uniform) > 0) {
        rowsToInsert.push({ ...basePayload, type: "Uniform Fee", term: "Yearly", amount: Number(feeForm.uniform) });
    }
    // 4. Transport
    if (Number(feeForm.transport) > 0) {
        rowsToInsert.push({ ...basePayload, type: "Transport Fee", term: "Yearly", amount: Number(feeForm.transport) });
    }
    
    // 5. Tuition Breakdown
    const tTotal = Number(feeForm.tuition);
    const tTerms = Number(feeForm.terms);
    if (tTotal > 0 && tTerms > 0) {
        const amountPerTerm = Math.round(tTotal / tTerms);
        for (let i = 1; i <= tTerms; i++) {
            rowsToInsert.push({ ...basePayload, type: "Tuition Fee", term: `Term ${i}`, amount: amountPerTerm });
        }
    }

    if (rowsToInsert.length === 0) {
        toast.error("No fees entered.");
        setSaving(false);
        return;
    }

    const { error } = await supabase.from("fees").insert(rowsToInsert);
    setSaving(false);
    
    if (error) { 
        toast.error(error.message); 
        return; 
    }
    
    toast.success("Fee Structure successfully assigned!");
    setShowBuilder(false);
    setFeeForm({ tuition: "", terms: "1", books: "", uniform: "", admission: "", transport: "", dueDate: "" });
    
    // Reload
    selectStudent(student);
  };

  const togglePaymentStatus = async (feeId: string, currentStatus: string) => {
    const isPaid = currentStatus === "Paid";
    const newStatus = isPaid ? "Pending" : "Paid";
    const paidOn = isPaid ? null : new Date().toISOString().split("T")[0];

    // Optimistic UI Update might glitch out total computation, so let's just await it and refresh correctly
    const { error } = await supabase
        .from("fees")
        .update({ status: newStatus, paid_on: paidOn })
        .eq("id", feeId);
        
    if (error) {
        toast.error("Failed to update status.");
        return;
    }
    
    toast.success(`Marked as ${newStatus}!`);
    const { data: fData } = await supabase.from("fees").select("*").eq("student_id", student?.id).order("created_at", { ascending: false });
    setFees(fData || []);
  };

  const deleteFee = async (feeId: string) => {
    const { error } = await supabase.from("fees").delete().eq("id", feeId);
    if (error) { toast.error("Failed to delete record."); return; }
    toast.success("Fee deleted forever.");
    setFees(fees.filter(f => f.id !== feeId));
  };

  // Math for correctly evaluating total ledger
  const total = fees.reduce((s, f) => s + Number(f.amount), 0);
  const paid = fees.filter(f => f.status === "Paid").reduce((s, f) => s + Number(f.amount), 0);

  return (
    <div>
      <SectionTitle>Fee Management</SectionTitle>
      
      <div className="flex gap-2 mb-5">
        {(["student", "outstanding"] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setStudent(null); }} className={`px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-lg ${tab === t ? "bg-[#d4af37] text-white shadow" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            {t === "student" ? "Student Fees" : "Outstanding Balances"}
          </button>
        ))}
      </div>

      {tab === "student" && (
        <>
          {/* Detailed Student View */}
          {student ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setStudent(null)} className="text-[#d4af37] text-sm font-bold hover:underline flex items-center gap-1">← Back to list</button>
                <span className="text-slate-300">|</span>
                <p className="text-sm font-semibold text-slate-700" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{student.name} — {student.class}-{student.section} ({student.admission_no})</p>
              </div>

              {/* Total Ledger Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                 <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                   <p className="text-xs font-bold text-slate-500 uppercase">Total Expected</p>
                   <p className="text-xl font-black text-slate-900">₹{total.toLocaleString()}</p>
                 </div>
                 <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
                   <p className="text-xs font-bold text-emerald-600 uppercase">Total Collected</p>
                   <p className="text-xl font-black text-emerald-700">₹{paid.toLocaleString()}</p>
                 </div>
                 <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
                   <p className="text-xs font-bold text-red-600 uppercase">Total Due</p>
                   <p className="text-xl font-black text-red-700">₹{(total - paid).toLocaleString()}</p>
                 </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 text-sm">Fee Records</h4>
                <button onClick={() => setShowBuilder(v => !v)} className="bg-[#d4af37] text-white font-bold text-xs px-4 py-2 rounded-lg shadow hover:bg-[#b08d29]">
                    + Add New Fee Structure
                </button>
              </div>

              {showBuilder && (
                <div className="border-2 border-slate-200 rounded-xl p-5 mb-6 bg-slate-50">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-600 mb-4" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Fee Generator</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <Inp label="Target Due Date (Global)" type="date" value={feeForm.dueDate} onChange={e => setFeeForm({ ...feeForm, dueDate: e.target.value })} />
                    <Inp label="Total Tuition Fee (₹)" type="number" placeholder="Ex: 30000" value={feeForm.tuition} onChange={e => setFeeForm({ ...feeForm, tuition: e.target.value })} />
                    <Sel label="Tuition Split" value={feeForm.terms} onChange={e => setFeeForm({ ...feeForm, terms: e.target.value })}>
                      <option value="1">Full Payment (1 Term)</option>
                      <option value="2">Two Parts (2 Terms)</option>
                      <option value="3">Three Parts (3 Terms)</option>
                    </Sel>
                    <Inp label="Books & Bag Fee (₹)" type="number" value={feeForm.books} onChange={e => setFeeForm({ ...feeForm, books: e.target.value })} />
                    <Inp label="Uniform Fee (₹)" type="number" value={feeForm.uniform} onChange={e => setFeeForm({ ...feeForm, uniform: e.target.value })} />
                    <Inp label="Admission Fee (₹)" type="number" value={feeForm.admission} onChange={e => setFeeForm({ ...feeForm, admission: e.target.value })} />
                    <Inp label="Transport Fee (Yearly) (₹)" type="number" value={feeForm.transport} onChange={e => setFeeForm({ ...feeForm, transport: e.target.value })} />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={generateStructure} disabled={saving} className="bg-[#d4af37] text-white font-bold text-xs px-5 py-2.5 flex-1 max-w-[200px] rounded-lg disabled:opacity-60 text-center shadow">
                        {saving ? "Generating…" : "Assign Structure"}
                    </button>
                    <button onClick={() => setShowBuilder(false)} className="text-slate-500 font-bold text-xs px-5 py-2.5 rounded-lg border border-slate-200 bg-white">Cancel</button>
                  </div>
                </div>
              )}

              {loadingProfile ? (
                 <p className="text-slate-400 text-sm py-4">Loading student profile…</p>
              ) : (
                <div className="overflow-x-auto">
                    <table className="portal-table w-full">
                        <thead><tr><th>Given Date</th><th>Type</th><th>Term</th><th>Amount</th><th>Status</th><th>Paid On</th><th className="text-right">Actions</th></tr></thead>
                        <tbody>
                        {fees.map((f, i) => (
                            <tr key={f.id} className="hover:bg-slate-50">
                                <td className="text-slate-500">{new Date(f.created_at).toLocaleDateString("en-GB")}</td>
                                <td className="font-bold text-slate-800">{f.type}</td>
                                <td>{f.term}</td>
                                <td className="font-medium">₹{Number(f.amount).toLocaleString()}</td>
                                <td>
                                    <span className={f.status === "Paid" ? "status-paid cursor-pointer hover:bg-emerald-200" : "status-pending cursor-pointer hover:bg-red-200"} onClick={() => togglePaymentStatus(f.id, f.status)} title="Click to toggle Paid/Pending status">
                                        {f.status}
                                    </span>
                                </td>
                                <td>{f.paid_on ? new Date(f.paid_on).toLocaleDateString("en-GB") : "—"}</td>
                                <td className="text-right flex items-center justify-end gap-3">
                                    <button onClick={() => togglePaymentStatus(f.id, f.status)} className={`text-xs font-bold ${f.status === "Paid" ? "text-slate-400" : "text-emerald-600"} hover:underline`}>
                                        {f.status === "Paid" ? "Mark Pending" : "Mark as Paid"}
                                    </button>
                                    <button onClick={() => deleteFee(f.id)} className="text-red-400 text-xs font-semibold hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {fees.length === 0 && <tr><td colSpan={7} className="text-center py-6 text-slate-400">No fee structure assigned yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
              )}
            </>
          ) : (
            /* Student List View */
            <>
              {/* Search + Entries */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex gap-3 flex-1 min-w-[200px]">
                  <input type="text" placeholder="Search student name, admission no, or class…" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 shadow-sm" style={{ fontFamily: "Inter,sans-serif" }} />
                </div>
                <EntriesDropdown value={entriesPerPage} onChange={setEntriesPerPage} />
              </div>

              {loadingList ? (
                <p className="text-slate-400 text-sm py-6">Loading students…</p>
              ) : (
                <>
                  <div className="overflow-x-auto shadow-sm rounded-lg border border-slate-200">
                    <table className="portal-table w-full m-0 border-none">
                      <thead><tr className="bg-slate-50"><th className="px-4 py-3">#</th><th>Name</th><th>Class</th><th>Admission No.</th><th className="text-right px-4">Action</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedStudents.length === 0 && <tr><td colSpan={5} className="text-center py-6 text-slate-400">No students found.</td></tr>}
                        {paginatedStudents.map((s, i) => (
                          <tr key={s.id} className="hover:bg-gold-50/40 cursor-pointer transition-colors" onClick={() => selectStudent(s)}>
                            <td className="text-slate-400 px-4 py-3">{startIndex + i + 1}</td>
                            <td className="font-medium text-slate-800">{s.name}</td>
                            <td>{s.class} – {s.section}</td>
                            <td className="text-slate-500 tracking-wider font-mono text-xs">{s.admission_no}</td>
                            <td className="text-right px-4">
                              <button onClick={(e) => { e.stopPropagation(); selectStudent(s); }} className="text-[#d4af37] text-xs font-bold hover:underline bg-white border border-[#d4af37]/30 px-3 py-1.5 rounded">View / Add Fees</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredStudents.length} startIndex={startIndex} endIndex={endIndex} />
                </>
              )}
            </>
          )}
        </>
      )}

      {tab === "outstanding" && (
        <div className="overflow-x-auto shadow-sm border border-slate-200 rounded-lg">
            <table className="portal-table w-full m-0">
            <thead><tr className="bg-slate-50"><th className="px-4 py-3">#</th><th>Student Name</th><th>Class</th><th>Type / Term</th><th>Amount Due</th><th>Due Date</th></tr></thead>
            <tbody>
                {outstanding.map((f, i) => (
                <tr key={f.id} className="hover:bg-red-50/20">
                    <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                    <td className="font-bold text-slate-800">{(f.students as any)?.name || "—"}</td>
                    <td>{(f.students as any)?.class || "—"}</td>
                    <td className="text-slate-600">{f.type} <span className="opacity-60 text-[10px] ml-1 uppercase">({f.term})</span></td>
                    <td className="text-red-500 font-black tracking-wide">₹{Number(f.amount).toLocaleString()}</td>
                    <td className="text-slate-500">{new Date(f.due_date).toLocaleDateString("en-GB")}</td>
                </tr>
                ))}
                {outstanding.length === 0 && <tr><td colSpan={6} className="text-center py-6 text-slate-400">No outstanding fees anywhere! You are fully collected.</td></tr>}
            </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default FeeManagementPanel;
