import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import reelsApi from "../../api/reelsApi";
import LocationSelect from "../../components/forms/LocationSelect";
import {
    MapPin,
    Sparkles,
    ArrowLeft,
    Loader2,
    Save,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function EditReel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [caption, setCaption] = useState("");
    const [locationId, setLocationId] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: "", msg: "" });

    useEffect(() => {
        loadReel();
        // eslint-disable-next-line
    }, [id]);

    const loadReel = async () => {
        try {
            setLoading(true);
            const data = await reelsApi.getReel(id);
            setCaption(data.caption || "");
            setLocationId(data.locationId?._id || data.locationId || "");
        } catch (err) {
            setStatus({ type: "error", msg: "Failed to load reel details." });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: "", msg: "" });

        setSaving(true);
        try {
            await reelsApi.updateReel(id, {
                caption,
                locationId
            });
            setStatus({ type: "success", msg: "Reel updated successfully!" });
            setTimeout(() => navigate(`/reels/${id}`), 1000);
        } catch (err) {
            console.error(err);
            setStatus({ type: "error", msg: "Failed to update reel." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#FAFAF8] dark:bg-slate-900">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] dark:bg-slate-900 pt-24 pb-20 px-4 transition-colors">
            <div className="max-w-xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Edit Reel</h1>
                        <p className="text-slate-500 dark:text-slate-400">Update details</p>
                    </div>
                </div>

                {/* ALERT */}
                {status.msg && (
                    <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 border ${status.type === "success"
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                        : "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
                        }`}>
                        {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="font-medium">{status.msg}</span>
                    </div>
                )}

                {/* FORM */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                            <Sparkles size={16} className="text-emerald-500" /> Caption
                        </label>
                        <textarea
                            placeholder="Write a catchy caption about your reel..."
                            value={caption}
                            onChange={e => setCaption(e.target.value)}
                            rows={6}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                            <MapPin size={16} className="text-emerald-500" /> Location
                        </label>
                        <LocationSelect
                            value={locationId}
                            onChange={setLocationId}
                            placeholder="Where was this filmed?"
                            className="w-full"
                        />
                    </div>

                </div>

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full mt-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {saving ? "Save Changes" : "Save Changes"}
                </button>

            </div>
        </div>
    );
}
