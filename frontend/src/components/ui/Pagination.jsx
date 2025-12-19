import React from "react";

export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="flex gap-2 justify-center py-4">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <div className="px-4 py-2 bg-white border rounded">
        Page {page} / {totalPages}
      </div>

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
