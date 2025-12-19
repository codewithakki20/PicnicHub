// src/pages/Admin/AdminEditBlog.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlog, updateBlog } from "../../api/blogApi";

import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import Button from "../../components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/Select";

import getPublicUrl from "../../utils/getPublicUrl";
import JoditEditor from "jodit-react";
import { RefreshCw, Eye, X, Plus } from "lucide-react";

const LOCAL_KEY_PREFIX = "admin_edit_blog_draft_v1_";

function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

function wordCount(text = "") {
  if (!text) return 0;
  const stripped = text.replace(/<[^>]+>/g, " ");
  const words = stripped.match(/\b\w+\b/g) || [];
  return words.length;
}

function readingTimeWords(count) {
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.round(count / wordsPerMinute));
  return `${minutes} min read`;
}

export default function AdminEditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);

  const categories = ["Travel", "Lifestyle", "Events", "Campus", "Tech"];

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    status: "draft", // draft | published | scheduled
    scheduledAt: "",
    slug: "",
    content: "",
  });

  const [content, setContent] = useState("");
  const [existingCover, setExistingCover] = useState(null);
  const [newCoverFile, setNewCoverFile] = useState(null);
  const [previewCoverUrl, setPreviewCoverUrl] = useState(null);

  // UI
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState("");

  // AI loaders (mock)
  const [aiTitleLoading, setAiTitleLoading] = useState(false);
  const [aiDescLoading, setAiDescLoading] = useState(false);
  const [aiContentLoading, setAiContentLoading] = useState(false);

  // tags input
  const [tagInput, setTagInput] = useState("");

  const localKey = `${LOCAL_KEY_PREFIX}${id}`;

  // Fetch blog
  useEffect(() => {
    const load = async () => {
      setFetching(true);
      try {
        const res = await getBlog(id);
        const data = res?.data || res;

        setFormData({
          title: data.title || "",
          description: data.excerpt || "",
          category: data.tags?.[0] || "",
          tags: data.tags || [],
          status: data.status || "draft",
          scheduledAt: data.scheduledAt || "",
          slug: data.slug || slugify(data.title || ""),
          content: data.content || "",
        });

        setContent(data.content || "");
        setExistingCover(data.coverImage ? getPublicUrl(data.coverImage) : null);

        // load autosave if exists (merge carefully)
        try {
          const raw = localStorage.getItem(localKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            // merge but don't override server fields that are intentionally empty
            setFormData((prev) => ({ ...prev, ...parsed.formData }));
            if (parsed.content) setContent(parsed.content);
            if (parsed.previewCoverUrl) setPreviewCoverUrl(parsed.previewCoverUrl);
          }
        } catch (e) {
          console.warn("Failed to load local draft", e);
        }
      } catch (err) {
        console.error("Failed to load blog", err);
        setError("Failed to load blog. Check console.");
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [id]);

  // preview url for uploaded file
  useEffect(() => {
    if (!newCoverFile) return;
    const url = URL.createObjectURL(newCoverFile);
    setPreviewCoverUrl(url);
    return () => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    };
  }, [newCoverFile]);

  // autosave to localStorage (throttled interval)
  useEffect(() => {
    const idt = setInterval(() => {
      try {
        const payload = {
          formData: {
            ...formData,
            content,
          },
          content,
          previewCoverUrl,
        };
        localStorage.setItem(localKey, JSON.stringify(payload));
      } catch (e) {
        console.warn("autosave failed", e);
      }
    }, 4000);
    return () => clearInterval(idt);
  }, [formData, content, previewCoverUrl, localKey]);

  // keep slug in sync with title unless user edited slug
  useEffect(() => {
    if (!formData.slug || formData.slug === "" || formData.slug === slugify(formData.title)) {
      setFormData((f) => ({ ...f, slug: slugify(formData.title) }));
    }
  }, [formData.title]);

  // AI mock helpers (replace with real API integration)
  const aiImproveTitle = async () => {
    setAiTitleLoading(true);
    setTimeout(() => {
      setFormData((f) => ({ ...f, title: (f.title || "Untitled") + " — Pro Edit" }));
      setAiTitleLoading(false);
    }, 900);
  };

  const aiImproveDesc = async () => {
    setAiDescLoading(true);
    setTimeout(() => {
      setFormData((f) => ({ ...f, description: (f.description || "").slice(0, 120) + "..." }));
      setAiDescLoading(false);
    }, 900);
  };

  const aiFixContent = async () => {
    setAiContentLoading(true);
    setTimeout(() => {
      const fixed = (content || "") + "<p><!-- grammar fixed --></p>";
      setContent(fixed);
      setFormData((f) => ({ ...f, content: fixed }));
      setAiContentLoading(false);
    }, 1400);
  };

  // input helpers
  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCategory = (val) => setFormData({ ...formData, category: val });

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setNewCoverFile(f);
  };

  // tags
  const addTag = () => {
    const t = (tagInput || "").trim();
    if (!t) return setTagInput("");
    if (!formData.tags.includes(t)) setFormData({ ...formData, tags: [...formData.tags, t] });
    setTagInput("");
  };

  const removeTag = (t) => setFormData({ ...formData, tags: formData.tags.filter((x) => x !== t) });

  const handleTagKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.title?.trim()) return setError("Title is required.");
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        excerpt: formData.description,
        content: content || formData.content,
        tags: formData.tags,
        status: formData.status,
        scheduledAt: formData.status === "scheduled" ? formData.scheduledAt : undefined,
        slug: formData.slug || slugify(formData.title),
      };

      // updateBlog expected to accept coverFile for multipart upload
      await updateBlog(id, { ...payload, coverFile: newCoverFile || undefined });

      // clear local autosave after successful update
      try {
        localStorage.removeItem(localKey);
      } catch {}

      navigate("/admin/blogs");
    } catch (err) {
      console.error("Update error:", err);
      setError(err?.response?.data?.message || "Failed to update blog.");
    } finally {
      setLoading(false);
    }
  };

  // clear local draft for this blog
  const clearLocalDraft = () => {
    if (!window.confirm("Clear local draft for this blog?")) return;
    try {
      localStorage.removeItem(localKey);
    } catch {}
    // reload original content from server
    window.location.reload();
  };

  // quick word count / read time
  const wc = wordCount(content || formData.content);
  const readTime = readingTimeWords(wc);

  if (fetching) {
    return <div className="p-6 text-center text-gray-500">Loading blog...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 min-h-screen">
      <Card className="bg-white border-2 border-purple-100 rounded-3xl shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-3xl border-b-2 border-purple-200">
          <div className="flex items-center justify-between w-full gap-4">
            <div>
              <h2 className="text-3xl font-black text-purple-900">✍️ Edit Blog — Pro</h2>
              <p className="text-sm text-gray-600 font-medium">Autosaves locally. Preview & schedule included.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-purple-300 rounded-2xl hover:bg-purple-50 hover:scale-105 transition-all font-semibold"
              >
                <Eye size={16} />
                Preview
              </button>

              <button
                type="button"
                onClick={clearLocalDraft}
                className="flex items-center gap-2 px-4 py-2 border-2 border-red-300 rounded-2xl hover:bg-red-50 hover:scale-105 transition-all font-semibold"
                title="Clear local draft"
              >
                <X size={16} />
                Clear Draft
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {error && <div className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 p-4 rounded-2xl mb-6 border-2 border-red-300 font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TITLE */}
            <div>
              <Label className="text-lg font-bold text-gray-800">Title</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInput}
                  required
                  className="border-2 border-purple-200 rounded-2xl focus:border-purple-500"
                />
                <Button type="button" onClick={aiImproveTitle} disabled={aiTitleLoading} className="hover:scale-105 transition-transform">
                  <RefreshCw className={aiTitleLoading ? "animate-spin" : ""} />
                </Button>
              </div>
            </div>

            {/* SLUG / STATUS / SCHEDULE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <Label>Slug (SEO)</Label>
                <Input name="slug" value={formData.slug} onChange={handleInput} placeholder="your-custom-slug" />
                <p className="text-xs text-gray-500 mt-1">Preview: <code className="bg-gray-100 px-1 rounded">{`/blog/${formData.slug || "your-slug"}`}</code></p>
              </div>

              <div>
                <Label>Status</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder={formData.status || "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Publish / Schedule</Label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleInput}
                  disabled={formData.status !== "scheduled"}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <Label>Description (Excerpt)</Label>
            <div className="flex gap-2">
              <Input
                name="description"
                value={formData.description}
                onChange={handleInput}
                className={aiDescLoading ? "animate-pulse" : ""}
              />
              <Button type="button" onClick={aiImproveDesc} disabled={aiDescLoading}>
                <RefreshCw className={aiDescLoading ? "animate-spin" : ""} />
              </Button>
            </div>

            {/* CATEGORY + TAGS */}
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select onValueChange={handleCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={formData.category || "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c, i) => (
                      <SelectItem key={i} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKey}
                    placeholder="press Enter to add tag"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button type="button" onClick={addTag}><Plus size={14} /></Button>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {formData.tags.map((t) => (
                    <span key={t} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full text-sm">
                      {t}
                      <button type="button" onClick={() => removeTag(t)} className="p-1">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* COVER IMAGE */}
            <div>
              <Label>Cover Image</Label>
              <div className="flex items-center gap-4">
                <Input type="file" accept="image/*" onChange={handleFileChange} />
                {(previewCoverUrl || existingCover) && (
                  <div className="w-44 h-28 rounded overflow-hidden border">
                    <img src={previewCoverUrl || existingCover} alt="cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Recommended: 1200×600 px. New upload will replace existing cover.</p>
            </div>

            {/* CONTENT */}
            <div>
              <Label>Blog Content</Label>

              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">Write or paste your content here.</p>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500">{wc} words • {readTime}</div>
                  <Button type="button" size="sm" onClick={aiFixContent} disabled={aiContentLoading}>
                    <RefreshCw className={aiContentLoading ? "animate-spin" : ""} />
                    <span className="ml-2">Fix Grammar</span>
                  </Button>
                </div>
              </div>

              <JoditEditor
                ref={editor}
                value={content}
                tabIndex={1}
                onBlur={(newContent) => {
                  setContent(newContent);
                  setFormData((f) => ({ ...f, content: newContent }));
                }}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 items-center pt-4">
              <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-2xl hover:shadow-lg hover:scale-105 transition-all" disabled={loading}>
                {loading ? "Updating..." : "Update Blog"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="border-2 border-purple-300 rounded-2xl font-bold hover:scale-105 transition-transform"
                onClick={() => {
                  // explicit save draft snapshot
                  try {
                    const payload = { formData: { ...formData, content }, content, previewCoverUrl };
                    localStorage.setItem(localKey, JSON.stringify(payload));
                    alert("Draft snapshot saved locally.");
                  } catch {
                    alert("Failed to save draft locally.");
                  }
                }}
              >
                Save Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* PREVIEW MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-6 overflow-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{formData.title || "Preview"}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{wc} words • {readTime}</span>
                <button className="px-3 py-1 border rounded" onClick={() => setPreviewOpen(false)}>Close</button>
              </div>
            </div>

            {(previewCoverUrl || existingCover) && (
              <img src={previewCoverUrl || existingCover} alt="cover" className="w-full h-56 object-cover rounded mb-4" />
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-600">{formData.description}</p>
              <div className="text-xs text-gray-500 mt-1">Category: {formData.category || "—"} • Tags: {(formData.tags || []).join(", ") || "—"}</div>
            </div>

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content || formData.content || "<p>No content</p>" }} />

            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setPreviewOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
