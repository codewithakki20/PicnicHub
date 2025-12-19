// src/components/forms/Textarea.jsx
export default function Textarea({ label, error, ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="font-medium">{label}</label>}
      <textarea
        {...props}
        className="w-full border p-2 rounded outline-blue-500"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
