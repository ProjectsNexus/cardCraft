import React from 'react';

export const ColorPicker = ({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void 
}) => (
  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
    <span className="text-xs font-medium text-slate-600">{label}</span>
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
    />
  </div>
);
