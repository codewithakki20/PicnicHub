import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import reelsApi from "../../api/reelsApi";
import LocationSelect from "../../components/forms/LocationSelect";
import {
  MapPin,
  Film,
  Upload,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  ArrowLeft,
  Loader2
} from "lucide-react";

export default function UploadReel() {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [locationId, setLocationId] = useState("");
  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const videoInputRef = useRef(null);

  /* ---------- HANDLERS ---------- */

  const handleFile = (file) => {
    if (!file.type.startsWith("video/")) {
      return setStatus({ type: "error", msg: "Only video files are supported." });
    }
    if (file.size > 100 * 1024 * 1024) {
      return setStatus({ type: "error", msg: "Video must be under 100MB." });
    }

    setStatus({ type: "", msg: "" });
    setVideo(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) return setStatus({ type: "error", msg: "Please select a video." });

    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      await reelsApi.createReel({
        caption: caption.trim(),
        locationId,
        videoFile: video,
      });

      setStatus({ type: "success", msg: "Reel published successfully! 🎬" });
      setTimeout(() => navigate("/reels"), 1500);
    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.message || "Upload failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-slate-900 pt-24 pb-20 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">New Reel</h1>
            <p className="text-slate-500 dark:text-slate-400">Share your story in motion</p>
          </div>
        </div>

        {/* STATUS ALERT */}
        {status.msg && (
          <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 border ${status.type === "success"
            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
            : "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
            }`}>
            {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{status.msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* LEFT: PREVIEW / UPLOAD AREA */}
          <div className="lg:sticky lg:top-24">
            <div
              className={`relative bg-black rounded-3xl overflow-hidden aspect-[9/16] shadow-2xl border-4 border-white dark:border-slate-800 group
                                ${!video ? 'cursor-pointer hover:border-emerald-500 transition-colors' : ''}`}
              onDrop={!video ? handleDrop : undefined}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => !video && videoInputRef.current.click()}
            >
              {!video ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-100 dark:bg-slate-800 transition-colors">
                  <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload size={32} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Upload Video</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[200px]">
                    Drag and drop or click to browse. MP4 or MOV up to 100MB.
                  </p>
                </div>
              ) : (
                <>
                  <video src={previewUrl} className="w-full h-full object-cover" controls autoPlay loop muted />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideo(null);
                      setPreviewUrl("");
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-rose-500 transition z-10"
                  >
                    <X size={20} />
                  </button>
                </>
              )}
              <input
                type="file"
                accept="video/*"
                hidden
                ref={videoInputRef}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-500" /> Caption
                </label>
                <textarea
                  placeholder="Write a catchy caption about your reel..."
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none dark:text-white text-lg"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-500" /> Location
                </label>
                <LocationSelect
                  value={locationId}
                  onChange={setLocationId}
                  placeholder="Where was this filmed?"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !video}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg py-4 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Film size={20} />}
                {loading ? "Publishing..." : "Share Reel"}
              </button>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-900/20">
              <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">Pro Tip</h4>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">
                Reels with vertical orientation (9:16) and trending music tend to perform better. Keep your caption short and sweet!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
