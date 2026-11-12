import React from 'react';
import { ShieldCheck, Download, Sun, Moon, FileText, Sparkles } from 'lucide-react';

interface HeaderProps {
  onExportClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeDocumentTitle: string;
  totalClausesCount: number;
  highRiskCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onExportClick,
  darkMode,
  onToggleDarkMode,
  activeDocumentTitle,
  totalClausesCount,
  highRiskCount,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <a href="/" className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            ContractGuardian
          </a>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none">
            LegalTech Risk & Clause Intelligence
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links / Breadcrumb Status */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span className="max-w-[260px] truncate text-slate-800 dark:text-slate-200 font-semibold" title={activeDocumentTitle}>
            {activeDocumentTitle}
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span>{totalClausesCount} Identified Clauses</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-rose-600 dark:text-rose-400 font-semibold">{highRiskCount} High Risk</span>
        </div>
      </nav>

      {/* Zone 3: Primary Action & Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleDarkMode}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onExportClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-md shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Redline Report</span>
        </button>
      </div>
    </header>
  );
};
