import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import locationApi from "../../api/locationApi";
import adminApi from "../../api/adminApi";
import { ChevronLeft, MapPin, AlignLeft, Globe } from "lucide-react";
import Button from "../../components/ui/Button";

export default function AdminEditLocation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    description: "",
    lat: "",
    lng: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const loc = await locationApi.getLocation(id);
        setValues({
          name: loc.name || "",
          description: loc.description || "",
          lat: loc.coords?.lat || loc.lat || "",
          lng: loc.coords?.lng || loc.lng || "",
        });
      } catch (err) {
        console.error("Failed to load location:", err);
        setError("Failed to load location details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await adminApi.updateLocation(id, {
        name: values.name,
        description: values.description,
        lat: Number(values.lat),
        lng: Number(values.lng),
      });

      setSuccess("Location updated successfully!");
      setTimeout(() => navigate("/admin/locations"), 1000);
    } catch (err) {
      console.error("Failed to update location:", err);
      setError(err.response?.data?.message || "Failed to update location.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* HEADER */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/locations")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-4"
        >
          <ChevronLeft size={20} />
          <span>Back to Locations</span>
        </button>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Edit Location
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Update the location details.
        </p>
      </div>

      {/* FEEDBACK */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
          {success}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Location Name
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="e.g. Central Park"
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <div className="relative">
            <AlignLeft className="absolute left-3 top-4 text-slate-400" size={18} />
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Describe this place..."
              rows={4}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-900 dark:text-white resize-none"
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Latitude
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="number"
                step="any"
                name="lat"
                value={values.lat}
                onChange={handleChange}
                placeholder="28.6139"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Longitude
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="number"
                step="any"
                name="lng"
                value={values.lng}
                onChange={handleChange}
                placeholder="77.2090"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={saving}
            className="w-full py-4 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {saving ? "Saving..." : "Update Location"}
          </Button>
        </div>
      </form>
    </div>
  );
}
