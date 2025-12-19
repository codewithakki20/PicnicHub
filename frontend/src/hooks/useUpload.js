// src/hooks/useUpload.js
import { useState } from "react";

export default function useUpload(initial = []) {
  const [files, setFiles] = useState(initial);

  const onChange = (e) => {
    const f = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...f]);
  };

  const clear = () => setFiles([]);

  return { files, onChange, clear };
}
