import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import memoryApi from "../../api/memoryApi";
import LocationSelect from "../../components/forms/LocationSelect";
import {
  MapPin,
  Calendar,
  Tag,
  Upload,
  AlertCircle,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Video as VideoIcon,
  Sparkles,
  ArrowLeft,
  Loader2
} from "lucide-react";

export default function UploadMemory() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    title: "",
    description: "",
    year: new Date().getFullYear().toString(),
    tags: [],
    locationId: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

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

  const handleFiles = (files, type) => {
    if (type === 'image') {
      setImages(prev => [...prev, ...files]);
    } else {
      setVideos(prev => [...prev, ...files]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    if (!values.title.trim()) return setStatus({ type: "error", msg: "Please verify the title." });
    if (!values.description.trim()) return setStatus({ type: "error", msg: "Description is required." });
    if (images.length === 0 && videos.length === 0)
      return setStatus({ type: "error", msg: "Upload at least one photo or video." });

    setLoading(true);
    try {
      await memoryApi.createMemory({
        ...values,
        images,
        videos,
      });
      setStatus({ type: "success", msg: "Memory created successfully! 🎉" });
      setTimeout(() => navigate("/memories"), 1500);
    } catch (err) {
      setStatus({ type: "error", msg: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">New Memory</h1>
            <p className="text-slate-500 dark:text-slate-400">Capture the moment forever</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COL - MEDIA & PREVIEW */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Upload size={18} /> Media
              </h2>

              <div className="space-y-4">
                <MediaUploadButton
                  title="Add Photos"
                  subtitle="JPG, PNG"
                  icon={ImageIcon}
                  accept="image/*"
                  inputRef={imageInputRef}
                  onChange={files => handleFiles(files, 'image')}
                  count={images.length}
                />
                <MediaUploadButton
                  title="Add Videos"
                  subtitle="MP4, MOV"
                  icon={VideoIcon}
                  accept="video/*"
                  inputRef={videoInputRef}
                  onChange={files => handleFiles(files, 'video')}
                  count={videos.length}
                />
              </div>

              {/* MINI PREVIEW LIST */}
              {(images.length > 0 || videos.length > 0) && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Selected</h3>
                  <div className="flex flex-wrap gap-2">
                    {images.map((img, i) => (
                      <div key={`img-${i}`} className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden relative group">
                        <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={14} className="text-white" />
                        </button>
                      </div>
                    ))}
                    {videos.map((vid, i) => (
                      <div key={`vid-${i}`} className="w-12 h-12 rounded-lg bg-slate-900 overflow-hidden relative group flex items-center justify-center">
                        <VideoIcon size={16} className="text-slate-500" />
                        <button
                          onClick={() => setVideos(videos.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={14} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COL - FORM */}
          <div className="lg:col-span-2 space-y-6">
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
                  rows={4}
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
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? "Creating..." : "Create Memory"}
            </button>
          </div>

        </div>
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
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">{/* Icon placeholder used for padding logic, real icon is in label or absolute */}</div>}
        {children}
      </div>
    </div>
  );
}

function MediaUploadButton({ title, subtitle, icon: Icon, accept, inputRef, onChange, count }) {
  return (
    <div
      onClick={() => inputRef.current.click()}
      className="group cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all flex items-center gap-4"
    >
      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{count > 0 ? `${count} files selected` : subtitle}</p>
      </div>
      <input
        type="file"
        multiple
        hidden
        accept={accept}
        ref={inputRef}
        onChange={e => onChange(Array.from(e.target.files))}
      />
    </div>
  );
}
