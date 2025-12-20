import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  X,
  Image as ImageIcon,
  Grid,
  List as ListIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import memoryApi from "../../api/memoryApi";
import MemoryCard from "../../components/cards/MemoryCard";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import Spinner from "../../components/ui/Spinner";
import { useAuthContext } from "../../context/AuthContext";

/* ================= DEBOUNCE ================= */

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

/* ================= PAGE ================= */

export default function Memories() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [viewMode, setViewMode] = useState("masonry");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const [newPost, setNewPost] = useState({
    description: "",
    image: null,
    preview: null,
  });

  /* ================= FETCH ================= */

  const fetchMemories = async (page) => {
    try {
      const res = await memoryApi.getMemories({
        page,
        limit: 12,
        search: debouncedSearch || undefined,
      });
      return res?.memories || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const {
    items: memories,
    loader,
    end,
    setItems,
  } = useInfiniteScroll(fetchMemories, [debouncedSearch]);

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      if (newPost.preview) URL.revokeObjectURL(newPost.preview);
    };
  }, [newPost.preview]);

  /* ================= CREATE ================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (newPost.preview) URL.revokeObjectURL(newPost.preview);

    setNewPost((p) => ({
      ...p,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const resetModal = () => {
    if (newPost.preview) URL.revokeObjectURL(newPost.preview);
    setNewPost({ description: "", image: null, preview: null });
    setIsCreateModalOpen(false);
  };

  const handleCreatePost = async () => {
    if (!newPost.image || isPosting) return;

    setIsPosting(true);
    try {
      const form = new FormData();
      form.append("description", newPost.description);
      form.append("images", newPost.image);

      const res = await memoryApi.createMemory(form);

      // push to top instantly
      setItems((prev) => [res, ...prev]);
      resetModal();
    } catch {
      alert("Failed to post memory");
    } finally {
      setIsPosting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-24">
      {/* ================= HEADER ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Shared Memories
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Capture and explore beautiful moments.
            </p>
          </div>

          {user && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 
                         rounded-full font-semibold hover:scale-105 active:scale-95 
                         transition-all shadow-lg"
            >
              <Plus size={20} />
              Share Moment
            </button>
          )}
        </div>

        {/* Search + View */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border flex gap-2">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search places, vibes, moments…"
              className="w-full pl-12 pr-4 py-3 outline-none bg-transparent"
            />
          </div>

          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode("masonry")}
              className={`p-2 rounded-lg ${viewMode === "masonry"
                ? "bg-white shadow-sm"
                : "text-slate-400"
                }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list"
                ? "bg-white shadow-sm"
                : "text-slate-400"
                }`}
            >
              <ListIcon size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= FEED ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {memories.length === 0 && end ? (
          <div className="text-center py-32 text-slate-400">
            <p className="text-xl font-semibold">No memories yet</p>
            <p className="text-sm mt-2">
              Be the first to share one ✨
            </p>
          </div>
        ) : viewMode === "masonry" ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {memories.map((m) => (
              <div key={m._id} className="break-inside-avoid">
                <MemoryCard
                  memory={m}
                  minimal
                  aspectRatio="aspect-auto"
                  onClick={() => navigate(`/memories/${m._id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            {memories.map((m) => (
              <MemoryCard
                key={m._id}
                memory={m}
                onClick={() => navigate(`/memories/${m._id}`)}
              />
            ))}
          </div>
        )}

        {/* Loader */}
        <div ref={loader} className="py-20 flex justify-center">
          {!end && <Spinner />}
        </div>
      </div>

      {/* ================= CREATE MODAL ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b">
              <h3 className="text-2xl font-bold">Share a Memory</h3>
              <button
                onClick={resetModal}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <textarea
                value={newPost.description}
                onChange={(e) =>
                  setNewPost((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                placeholder="What made this moment special?"
                className="w-full resize-none min-h-[100px] outline-none text-lg"
              />

              <div className="relative aspect-video rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden">
                {newPost.preview ? (
                  <img
                    src={newPost.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-3 text-slate-400">
                    <ImageIcon size={32} />
                    <span className="font-semibold">Upload photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
              <button
                onClick={resetModal}
                className="px-6 py-3 rounded-xl font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                disabled={!newPost.image || isPosting}
                onClick={handleCreatePost}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold 
                           disabled:opacity-50"
              >
                {isPosting ? "Posting…" : "Post Memory"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
