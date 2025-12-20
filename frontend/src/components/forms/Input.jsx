// src/components/forms/Input.jsx
export default function Input({ label, error, ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="font-medium">{label}</label>}
      <input
        {...props}
        className={`w-full border p-2 rounded outline-blue-500 ${props.className || ""}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
