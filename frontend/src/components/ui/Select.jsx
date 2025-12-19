import { useState, createContext, useContext } from "react";

const SelectContext = createContext();

export function Select({ children, onValueChange, defaultValue }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  const handleSelect = (newValue) => {
    setValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value, onSelect: handleSelect, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className = "", children, ...props }) {
  const { open, setOpen } = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`w-full px-3 py-2 border rounded-md flex justify-between items-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectContext);
  return <span>{value || placeholder}</span>;
}

export function SelectContent({ children, className = "" }) {
  const { open } = useContext(SelectContext);
  if (!open) return null;

  return (
    <div className={`absolute z-10 w-full mt-1 bg-white border rounded-md shadow ${className}`}>
      {children}
    </div>
  );
}

export function SelectItem({ value, children }) {
  const { onSelect } = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className="w-full text-left px-3 py-2 hover:bg-blue-100"
    >
      {children}
    </button>
  );
}
