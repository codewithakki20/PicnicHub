// src/hooks/useForm.js
import { useState } from "react";

export default function useForm(initial = {}, onSubmit = () => {}) {
  const [values, setValues] = useState(initial);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(values);
  };

  const reset = () => setValues(initial);

  return { values, handleChange, handleSubmit, reset, setValues };
}
