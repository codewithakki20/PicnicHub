import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import memoryApi from "../../api/memoryApi";
import LocationSelect from "../../components/forms/LocationSelect";
import {
    MapPin,
    Calendar,
    Tag,
    AlertCircle,
    CheckCircle2,
    X,
    Sparkles,
    ArrowLeft,
    Loader2,
    Save
} from "lucide-react";

export default function EditMemory() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [values, setValues] = useState({
        title: "",
        description: "",
        year: "",
        tags: [],
        locationId: "",
    });

    const [tagInput, setTagInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: "", msg: "" });

    useEffect(() => {
        loadMemory();
        // eslint-disable-next-line
    }, [id]);

    const loadMemory = async () => {
        try {
            setLoading(true);
            const data = await memoryApi.getMemory(id);
            setValues({
                title: data.title || "",
                description: data.description || "",
                year: data.year ? data.year.toString() : "",
                tags: data.tags || [],
                locationId: data.locationId?._id || data.locationId || "", // Handle populated or raw ID
            });
        } catch (err) {
            setStatus({ type: "error", msg: "Failed to load memory details." });
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- HANDLERS ---------------- */

    const addTag = (e) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (!values.tags.includes(newTag)) {
                setValues(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            }
            setTagInput("");
        }
    };

    const removeTag = (t) =>
        setValues(prev => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: "", msg: "" });

        if (!values.title.trim()) return setStatus({ type: "error", msg: "Title is required." });
        if (!values.description.trim()) return setStatus({ type: "error", msg: "Description is required." });

        setSaving(true);
        try {
            await memoryApi.updateMemory(id, values);
            setStatus({ type: "success", msg: "Memory updated successfully!" });
            setTimeout(() => navigate(`/memories/${id}`), 1000);
        } catch (err) {
            console.error(err);
            setStatus({ type: "error", msg: "Failed to update memory." });
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
            <div className="max-w-3xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Edit Memory</h1>
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

                    <InputGroup label="Title">
                        <input
                            type="text"
                            placeholder="Give your memory a name..."
                            value={values.title}
                            onChange={e => setValues({ ...values, title: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium dark:text-white"
                        />
                    </InputGroup>

                    <InputGroup label="Description">
                        <textarea
                            placeholder="Tell the story behind this moment..."
                            value={values.description}
                            onChange={e => setValues({ ...values, description: e.target.value })}
                            rows={6}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none dark:text-white"
                        />
                    </InputGroup>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Year" icon={<Calendar size={16} />}>
                            <input
                                type="number"
                                placeholder="YYYY"
                                value={values.year}
                                onChange={e => setValues({ ...values, year: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:text-white"
                            />
                        </InputGroup>

                        <InputGroup label="Location" icon={<MapPin size={16} />}>
                            <div className="relative">
                                <LocationSelect
                                    value={values.locationId}
                                    onChange={id => setValues({ ...values, locationId: id })}
                                    className="w-full"
                                />
                            </div>
                        </InputGroup>
                    </div>

                    <InputGroup label="Tags" icon={<Tag size={16} />}>
                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                            {values.tags.map(tag => (
                                <span key={tag} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1 shadow-sm">
                                    #{tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-rose-500"><X size={12} /></button>
                                </span>
                            ))}
                            <input
                                type="text"
                                placeholder="Add tags..."
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={addTag}
                                className="bg-transparent outline-none flex-1 min-w-[100px] text-sm px-2 py-1 dark:text-white placeholder-slate-400"
                            />
                        </div>
                    </InputGroup>

                </div>

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full mt-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {saving ? "Saving..." : "Save Changes"}
                </button>

            </div>
        </div>
    );
}

function InputGroup({ label, icon, children }) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                {icon} {label}
            </label>
            <div className="relative">
                {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"></div>}
                {children}
            </div>
        </div>
    );
}
