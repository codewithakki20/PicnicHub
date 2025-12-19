// src/components/ui/Dropdown.jsx
export default function Dropdown({ options = [], value, onChange }) {
  return (
    <select
      className="border p-2 rounded w-full outline-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
