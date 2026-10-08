import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 px-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Demo system using synthetic student data for educational purposes.</span>
      </div>
      <div className="text-right text-slate-400">
        <span>AI Student Risk Intelligence Dashboard • GTU Engineering Portfolio Project</span>
      </div>
    </footer>
  );
};
