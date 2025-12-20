// src/pages/Admin/AdminCreateBlog.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";

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

import { Eye, Plus, X } from "lucide-react";
import JoditEditor from "jodit-react";

/* ================= HELPERS ================= */

const LOCAL_KEY = "admin_create_blog_draft_v1";

const slugify = (text = "") =>
  text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

const wordCount = (text = "") =>
  (text.replace(/<[^>]+>/g, " ").match(/\b\w+\b/g) || []).length;

const readingTime = (words) =>
  `${Math.max(1, Math.round(words / 200))} min read`;

/* ================= PAGE ================= */

export default function AdminCreateBlog() {
  const navigate = useNavigate();
  const editor = useRef(null);

  const blogCategories = ["Travel", "Picnic", "Events", "Campus", "Tech", "Tips", "Nature", "Party", "Adventure", "College Life", "Others"];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    status: "draft",
    scheduledAt: "",
    slug: "",
  });

  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [tagInput, setTagInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD DRAFT ================= */

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setFormData(parsed.formData || {});
      setContent(parsed.content || "");
      setFilePreview(parsed.filePreview || null);
    } catch { }
  }, []);

  /* ================= AUTOSAVE ================= */

  useEffect(() => {
    const id = setInterval(() => {
      localStorage.setItem(
        LOCAL_KEY,
        JSON.stringify({ formData, content, filePreview })
      );
    }, 5000);
    return () => clearInterval(id);
  }, [formData, content, filePreview]);

  /* ================= SLUG ================= */

  useEffect(() => {
    if (formData.title)
      setFormData((f) => ({ ...f, slug: slugify(f.title) }));
  }, [formData.title]);

  /* ================= FILE PREVIEW ================= */

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title) return setError("Title is required.");
    if (!formData.category) return setError("Category is required.");

    try {
      setLoading(true);
      await adminApi.createBlog({
        title: formData.title,
        excerpt: formData.description,
        content,
        tags: formData.tags,
        status: formData.status,
        slug: formData.slug,
        status: formData.status,
        category: formData.category,
        readTime: readTime,
        scheduledAt:
          formData.status === "scheduled" ? formData.scheduledAt : undefined,
        coverFile: file,
      });

      localStorage.removeItem(LOCAL_KEY);
      navigate("/admin/blogs");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create blog.");
    } finally {
      setLoading(false);
    }
  };

  const wc = wordCount(content);
  const readTime = readingTime(wc);

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50">

      <Card className="rounded-3xl border border-emerald-100 bg-white shadow-xl">
        <CardHeader className="border-b border-emerald-100 bg-emerald-50/70">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-emerald-900">
                ✍️ Create Blog
              </h2>
              <p className="text-sm text-amber-700 font-medium">
                Draft auto-saves locally
              </p>
            </div>

            <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
              <Eye size={16} /> Preview
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TITLE */}
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter blog title"
                className="focus:ring-emerald-500/30"
              />
            </div>

            {/* SLUG / STATUS */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Slug</Label>
                <Input value={formData.slug} disabled />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) =>
                    setFormData({ ...formData, status: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Schedule</Label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  disabled={formData.status !== "scheduled"}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledAt: e.target.value })
                  }
                  className="w-full border border-emerald-200 rounded-lg p-2"
                />
              </div>
            </div>

            {/* EXCERPT */}
            <div>
              <Label>Excerpt</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Short description"
              />
            </div>

            {/* CATEGORY + TAGS */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {blogCategories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (!tagInput.trim()) return;
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, tagInput.trim()],
                        });
                        setTagInput("");
                      }
                    }}
                    placeholder="Press Enter"
                  />
                  <Button type="button" onClick={() => {
                    if (!tagInput.trim()) return;
                    setFormData({
                      ...formData,
                      tags: [...formData.tags, tagInput.trim()],
                    });
                    setTagInput("");
                  }}>
                    <Plus size={14} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((t) => (
                    <span key={t} className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                      {t}
                      <button type="button" onClick={() =>
                        setFormData({
                          ...formData,
                          tags: formData.tags.filter(x => x !== t),
                        })
                      }>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* COVER */}
            <div>
              <Label>Cover Image</Label>
              <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
              {filePreview && (
                <img src={filePreview} className="mt-3 rounded-xl w-full max-h-64 object-cover" alt="" />
              )}
            </div>

            {/* CONTENT */}
            <div>
              <div className="flex justify-between mb-2 text-sm text-emerald-700 font-medium">
                <span>{wc} words</span>
                <span>{readTime}</span>
              </div>

              <JoditEditor ref={editor} value={content} onBlur={setContent} />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4">
              <Button
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold shadow-lg hover:scale-[1.01] transition"
              >
                {loading ? "Publishing…" : "Publish Blog"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  localStorage.setItem(
                    LOCAL_KEY,
                    JSON.stringify({ formData, content, filePreview })
                  );
                  alert("Draft saved locally");
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
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start p-6">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">{formData.title || "Preview"}</h3>
              <Button variant="secondary" onClick={() => setPreviewOpen(false)}>
                Close
              </Button>
            </div>

            {filePreview && (
              <img src={filePreview} className="rounded-xl mb-4" alt="" />
            )}

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      )}
    </div>
  );
}
