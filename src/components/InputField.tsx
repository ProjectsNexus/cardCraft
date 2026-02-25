import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const InputField = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  placeholder,
  type = "text",
  prefix
}: { 
  label: string; 
  icon: any; 
  value: string; 
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
}) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
      <Icon size={12} />
      {label}
    </label>
    <div className="flex">
      {prefix && (
        <div className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-[10px] font-bold text-slate-400 flex items-center">
          {prefix}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-3 py-2 bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
          prefix ? "rounded-r-lg" : "rounded-lg"
        )}
      />
    </div>
  </div>
);
