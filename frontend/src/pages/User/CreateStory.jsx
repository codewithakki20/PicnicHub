import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Image as ImageIcon, Sparkles, Loader2, Upload } from "lucide-react";
import storyApi from "../../api/storyApi";

export default function CreateStory() {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (!f.type.startsWith("image/")) {
            setError("Only image files are allowed.");
            return;
        }

        if (f.size > 10 * 1024 * 1024) {
            setError("Image must be under 10MB.");
            return;
        }

        setFile(f);
        setPreview(URL.createObjectURL(f));
        setError("");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) handleFileChange({ target: { files: [f] } });
    };

    const handleSubmit = async () => {
        if (!file) return;

        setLoading(true);
        try {
            await storyApi.createStory(file);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to post story.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">

            {/* CLOSE BUTTON */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 right-6 p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition"
            >
                <X size={24} />
            </button>

            {/* PHONE FRAME */}
            <div className="relative w-full max-w-[400px] aspect-[9/18] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-slate-800 ring-1 ring-slate-700/50 flex flex-col">

                {/* HEADER OVERLAY */}
                <div className="absolute top-0 inset-x-0 z-20 p-6 pt-8 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start pointer-events-none">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800/80 backdrop-blur-md flex items-center justify-center border border-slate-700">
                            <Sparkles size={14} className="text-emerald-400" />
                        </div>
                        <span className="font-bold text-white text-sm shadow-black drop-shadow-md">Add to Story</span>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div
                    className="flex-1 relative flex flex-col"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    {!preview ? (
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="flex-1 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-white/5 transition duration-300 group"
                        >
                            <div className="w-24 h-24 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-emerald-500/50 transition-all">
                                <ImageIcon size={40} className="text-slate-400 group-hover:text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Upload Photo</h3>
                            <p className="text-slate-400 text-sm mb-8">Tap to browse or drag & drop</p>

                            <div className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                                JPG, PNG • Max 10MB
                            </div>
                        </div>
                    ) : (
                        <div className="relative flex-1 bg-black group">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-contain"
                            />

                            {/* REMOVE BTN */}
                            <button
                                onClick={(e) => { e.stopPropagation(); reset(); }}
                                className="absolute top-20 right-4 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white/90 hover:bg-rose-500 hover:text-white transition shadow-lg border border-white/10"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>

                {/* ERROR TOAST */}
                {error && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-500/90 backdrop-blur text-white px-6 py-3 rounded-2xl font-medium shadow-xl text-center max-w-[90%] z-30 animate-in zoom-in-95 leading-tight">
                        {error}
                    </div>
                )}

                {/* ACTION FOOTER */}
                <div className="absolute bottom-0 inset-x-0 p-6 pb-8 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
                    <button
                        onClick={handleSubmit}
                        disabled={!file || loading}
                        className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg
                            ${!file || loading
                                ? "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800"
                                : "bg-white text-black hover:bg-slate-200 active:scale-[0.98]"}`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                        {loading ? "Sharing..." : "Share to Story"}
                    </button>
                </div>

            </div>
        </div>
    );
}
