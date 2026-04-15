import React, { useMemo } from "react";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-3 mb-5"
    style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{children}</h2>
);

export const Inp = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{label}</label>
    <input {...props} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 bg-white" style={{ fontFamily: "Inter,sans-serif" }} />
  </div>
);

export const Sel = ({ label, children, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{label}</label>
    <select {...props} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 bg-white" style={{ fontFamily: "Inter,sans-serif" }}>
      {children}
    </select>
  </div>
);

export const PaginationControls = ({ currentPage, totalPages, onPageChange, totalItems, startIndex, endIndex }: {
  currentPage: number; totalPages: number; onPageChange: (page: number) => void; totalItems: number; startIndex: number; endIndex: number;
}) => {
  const pages = useMemo(() => {
    const arr: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) arr.push(i);
    } else {
      arr.push(1);
      if (currentPage > 3) arr.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) arr.push(i);
      if (currentPage < totalPages - 2) arr.push("...");
      arr.push(totalPages);
    }
    return arr;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
      <p className="text-xs text-slate-500" style={{ fontFamily: "Inter,sans-serif" }}>Showing <strong>{totalItems}</strong> of <strong>{totalItems}</strong> records</p>
      <div />
    </div>
  );

  return (
    <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-slate-100 gap-3">
      <p className="text-xs text-slate-500" style={{ fontFamily: "Inter,sans-serif" }}>Showing <strong>{startIndex + 1}</strong>–<strong>{Math.min(endIndex, totalItems)}</strong> of <strong>{totalItems}</strong> records</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all" title="First page"><ChevronsLeft className="w-3.5 h-3.5" /></button>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all" title="Previous page"><ChevronLeft className="w-3.5 h-3.5" /></button>
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-slate-300 text-xs">…</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p as number)} className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-all ${
              currentPage === p
                ? "bg-[#d4af37] text-white shadow-sm shadow-[#d4af37]/20"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{p}</button>
          )
        )}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all" title="Next page"><ChevronRight className="w-3.5 h-3.5" /></button>
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all" title="Last page"><ChevronsRight className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
};

export const EntriesDropdown = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-slate-500 font-medium" style={{ fontFamily: "Inter,sans-serif" }}>Show</span>
    <select value={value} onChange={e => onChange(Number(e.target.value))} className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 bg-white cursor-pointer" style={{ fontFamily: "Inter,sans-serif" }}>
      {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
    </select>
    <span className="text-xs text-slate-500 font-medium" style={{ fontFamily: "Inter,sans-serif" }}>entries</span>
  </div>
);
