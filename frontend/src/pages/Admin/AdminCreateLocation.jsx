// src/pages/Admin/AdminCreateLocation.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";

import Input from "../../components/forms/Input";
import Textarea from "../../components/forms/Textarea";
import Button from "../../components/ui/Button";
import { MapPin } from "lucide-react";

export default function AdminCreateLocation() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    description: "",
    lat: "",
    lng: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      await adminApi.createLocation({
        name: values.name,
        description: values.description,
        lat: Number(values.lat),
        lng: Number(values.lng),
      });

      setMsg("Location created successfully!");
      setTimeout(() => navigate("/admin/locations"), 1200);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to create location. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Add New Location
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Create a discoverable place for memories & reels
        </p>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
          {error}
        </div>
      )}

      {msg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
          {msg}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={submit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-lg"
      >
        {/* LOCATION NAME */}
        <Input
          label="Location Name"
          icon={MapPin}
          required
          value={values.name}
          onChange={(e) =>
            setValues({ ...values, name: e.target.value })
          }
          placeholder="e.g. Marine Drive, Mumbai"
        />

        {/* DESCRIPTION */}
        <Textarea
          label="Description"
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
          placeholder="Describe the vibe, scenery, or why this place is special..."
        />

        {/* COORDINATES */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Latitude"
            type="number"
            step="any"
            required
            value={values.lat}
            onChange={(e) =>
              setValues({ ...values, lat: e.target.value })
            }
            placeholder="28.6139"
          />

          <Input
            label="Longitude"
            type="number"
            step="any"
            required
            value={values.lng}
            onChange={(e) =>
              setValues({ ...values, lng: e.target.value })
            }
            placeholder="77.2090"
          />
        </div>

        {/* SUBMIT */}
        <div className="pt-4">
          <Button
            disabled={loading}
            className="w-full h-12 text-base font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg"
          >
            {loading ? "Creating location..." : "Create Location"}
          </Button>
        </div>
      </form>
    </div>
  );
}
