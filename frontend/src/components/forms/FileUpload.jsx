// src/components/forms/FileUpload.jsx
export default function FileUpload({ label, multiple, onChange, accept, value }) {
  return (
    <div className="space-y-1">
      {label && <p className="font-medium">{label}</p>}
      <input
        type="file"
        multiple={multiple}
        onChange={onChange}
        accept={accept || "image/*"}
        className="border p-2 rounded w-full cursor-pointer bg-gray-50"
      />
      {value && (
        <p className="text-sm text-gray-600 mt-1">
          Selected: {value.name || value}
        </p>
      )}
    </div>
  );
}
