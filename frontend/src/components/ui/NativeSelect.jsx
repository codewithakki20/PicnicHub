// src/components/ui/NativeSelect.jsx
import React from "react";

export default function NativeSelect({ value, onChange, options, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="border rounded-lg p-2 bg-white"
    >
      {children || (options || []).map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
