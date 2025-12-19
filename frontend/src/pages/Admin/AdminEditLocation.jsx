// src/pages/Admin/AdminEditLocation.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import locationApi from "../../api/locationApi";
import adminApi from "../../api/adminApi";
import Input from "../../components/forms/Input";
import Textarea from "../../components/forms/Textarea";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function AdminEditLocation() {
  const { id } = useParams();
  const [values, setValues] = useState({
    name: "",
    description: "",
    lat: "",
    lng: "",
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [error, setError] = useState("");

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
      setError(err.response?.data?.message || "Failed to load location.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    try {
      await adminApi.updateLocation(id, {
        name: values.name,
        description: values.description,
        lat: Number(values.lat),
        lng: Number(values.lng),
      });

      setMsg("Location updated successfully!");
    } catch (err) {
      console.error("Failed to update location:", err);
      setError(err.response?.data?.message || "Failed to update location. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-gradient-to-br from-orange-50/80 to-red-50/80 min-h-screen">
      <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">✏️ Edit Location</h2>

      {error && <p className="text-white bg-gradient-to-r from-red-600 to-pink-600 p-4 rounded-2xl border-2 border-red-500 font-semibold">{error}</p>}
      {msg && <p className="text-white bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl border-2 border-green-500 font-semibold">{msg}</p>}

      <form onSubmit={submit} className="space-y-6 bg-white border-2 border-orange-100 rounded-3xl shadow-lg p-8">
        <Input
          label="Location Name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />

        <Textarea
          label="Description"
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Latitude"
            value={values.lat}
            onChange={(e) => setValues({ ...values, lat: e.target.value })}
          />

          <Input
            label="Longitude"
            value={values.lng}
            onChange={(e) => setValues({ ...values, lng: e.target.value })}
          />
        </div>

        <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3 rounded-2xl hover:shadow-lg hover:scale-105 transition-all">Update Location</Button>
      </form>
    </div>
  );
}
