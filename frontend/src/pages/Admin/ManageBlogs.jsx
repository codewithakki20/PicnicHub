// src/pages/Admin/ManageBlogs.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import blogApi from "../../api/blogApi";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import getPublicUrl from "../../utils/getPublicUrl";

import {
  Search,
  Eye,
  Trash2,
  Edit,
  CheckSquare,
  Square,
  Filter,
  ArrowUpDown,
  Plus,
  AlertCircle,
  BarChart2,
  Heart,
  MessageCircle,
} from "lucide-react";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const [selected, setSelected] = useState([]);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const [statsModal, setStatsModal] = useState(false);
  const [statsBlog, setStatsBlog] = useState(null);

  /* ================= LOAD ================= */

  const load = async () => {
    setLoading(true);
    const res = await blogApi.getBlogs({ limit: 200 });
    const data = res?.blogs || res || [];
    setBlogs(data);
    setTotalPages(Math.ceil(data.length / limit));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= HELPERS ================= */

  const toggleSelect = (id) => {
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  const bulkDelete = async () => {
    for (const id of selected) {
      await blogApi.deleteBlog(id);
    }
    setSelected([]);
    setBulkDeleteModal(false);
    load();
  };

  const removeBlog = async () => {
    if (!deleteId) return;
    await blogApi.deleteBlog(deleteId);
    setDeleteId(null);
    load();
  };

  /* ================= PROCESS ================= */

  const processed = useMemo(() => {
    return blogs
      .filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((b) => (category ? b.category === category : true))
      .sort((a, b) => {
        if (sort === "az") return a.title.localeCompare(b.title);
        if (sort === "za") return b.title.localeCompare(a.title);
        if (sort === "oldest")
          return new Date(a.createdAt) - new Date(b.createdAt);
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [blogs, search, category, sort]);

  const paginatedBlogs = processed.slice(
    (page - 1) * limit,
    page * limit
  );

  const categories = [...new Set(blogs.map((b) => b.category).filter(Boolean))];

  /* ================= LOADING ================= */

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-emerald-50">
        <Spinner />
      </div>
    );

  /* ================= RENDER ================= */

  return (
    <div className="p-6 md:p-10 space-y-8 bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-emerald-900">
            Manage Blogs ✍️
          </h1>
          <p className="text-emerald-700 font-medium">
            Create, edit & publish stories
          </p>
        </div>

        <Link to="/admin/blogs/create">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30">
            <Plus className="w-5 h-5 mr-2" />
            Create Blog
          </Button>
        </Link>
      </div>

      {/* FILTERS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FilterBox icon={Search}>
          <input
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none font-medium"
          />
        </FilterBox>

        <FilterBox icon={Filter}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent outline-none w-full"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </FilterBox>

        <FilterBox icon={ArrowUpDown}>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent outline-none w-full"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
        </FilterBox>
      </div>

      {/* EMPTY STATE */}
      {processed.length === 0 && (
        <div className="text-center py-24 text-emerald-600">
          <AlertCircle className="mx-auto mb-4" />
          <p className="font-bold text-lg">No blogs found</p>
          <p className="text-sm">Try changing search or filters</p>
        </div>
      )}

      {/* TABLE */}
      {processed.length > 0 && (
        <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow overflow-hidden">
          <table className="w-full min-w-[900px]">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-6 py-4 w-12">
                  <button
                    onClick={() =>
                      setSelected(
                        selected.length === paginatedBlogs.length
                          ? []
                          : paginatedBlogs.map((b) => b._id)
                      )
                    }
                  >
                    {selected.length === paginatedBlogs.length &&
                      paginatedBlogs.length > 0 ? (
                      <CheckSquare />
                    ) : (
                      <Square />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-emerald-700">
                  Blog
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-emerald-700">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-emerald-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-emerald-700">
                  Stats
                </th>
                <th className="px-6 py-4 text-right text-xs font-black text-emerald-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-emerald-100">
              {paginatedBlogs.map((b) => (
                <tr
                  key={b._id}
                  className="hover:bg-emerald-50/60 group"
                >
                  <td className="px-6 py-4">
                    <button onClick={() => toggleSelect(b._id)}>
                      {selected.includes(b._id) ? (
                        <CheckSquare className="text-emerald-600" />
                      ) : (
                        <Square />
                      )}
                    </button>
                  </td>

                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-16 h-12 rounded-lg bg-emerald-100 overflow-hidden border">
                      {b.coverImage ? (
                        <img
                          src={getPublicUrl(b.coverImage)}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <Eye className="mx-auto my-3 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-emerald-900 line-clamp-1">
                        {b.title}
                      </p>
                      <p className="text-xs text-emerald-600">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      {b.category || "General"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {b.status === "draft" ? (
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                        Draft
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        Published
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-emerald-700">
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> {b.views || 0}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => {
                          setStatsBlog(b);
                          setStatsModal(true);
                        }}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                        title="View Stats"
                      >
                        <BarChart2 size={16} />
                      </button>
                      <Link
                        to={`/admin/blogs/edit/${b._id}`}
                        className="p-2 rounded-lg text-orange-600 hover:bg-orange-50"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(b._id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-emerald-100 p-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        </div>
      )}

      {/* BULK ACTION BAR */}
      {selected.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border shadow-xl rounded-full px-6 py-3 flex items-center gap-4 z-50">
          <span className="font-bold text-emerald-700">
            {selected.length} selected
          </span>
          <Button
            variant="destructive"
            onClick={() => setBulkDeleteModal(true)}
          >
            Delete Selected
          </Button>
        </div>
      )}

      {/* MODALS */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Blog"
      >
        <ConfirmDelete
          onCancel={() => setDeleteId(null)}
          onConfirm={removeBlog}
        />
      </Modal>

      <Modal
        open={bulkDeleteModal}
        onClose={() => setBulkDeleteModal(false)}
        title="Bulk Delete"
      >
        <ConfirmDelete
          message={`Delete ${selected.length} blogs?`}
          onCancel={() => setBulkDeleteModal(false)}
          onConfirm={bulkDelete}
        />
      </Modal>

      {/* STATS MODAL */}
      <Modal
        open={statsModal}
        onClose={() => setStatsModal(false)}
        title="Blog Statistics"
      >
        {statsBlog && (
          <div className="space-y-6 p-4">
            <div>
              <h3 className="text-2xl font-bold text-emerald-900">{statsBlog.title}</h3>
              <p className="text-sm text-emerald-600">
                Published on {new Date(statsBlog.createdAt).toLocaleDateString()}
              </p>
              {statsBlog.category && (
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                  {statsBlog.category}
                </span>
              )}
            </div>

            {statsBlog.coverImage && (
              <img
                src={getPublicUrl(statsBlog.coverImage)}
                alt={statsBlog.title}
                className="w-full rounded-xl max-h-64 object-cover"
              />
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                <Eye className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-900">{statsBlog.views || 0}</p>
                <p className="text-xs text-blue-600 font-semibold">Views</p>
              </div>

              <div className="bg-rose-50 rounded-xl p-4 border border-rose-100 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-rose-600" />
                <p className="text-2xl font-bold text-rose-900">
                  {statsBlog.likesCount || statsBlog.likes?.length || 0}
                </p>
                <p className="text-xs text-rose-600 font-semibold">Likes</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-purple-900">
                  {statsBlog.commentsCount || statsBlog.comments?.length || 0}
                </p>
                <p className="text-xs text-purple-600 font-semibold">Comments</p>
              </div>
            </div>

            {statsBlog.excerpt && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-sm font-semibold text-emerald-600 mb-2">Excerpt</p>
                <p className="text-emerald-900">{statsBlog.excerpt}</p>
              </div>
            )}

            {statsBlog.tags && statsBlog.tags.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-emerald-600 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {statsBlog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2 border-t border-emerald-100">
              <Button variant="secondary" onClick={() => setStatsModal(false)}>
                Close
              </Button>
              <Link to={`/blogs/${statsBlog.slug || statsBlog._id}`}>
                <Button variant="primary">View Blog</Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ================= HELPERS ================= */

function FilterBox({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-emerald-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-emerald-400/30">
      <Icon className="w-4 h-4 text-emerald-500" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ConfirmDelete({
  onCancel,
  onConfirm,
  message = "This action cannot be undone.",
}) {
  return (
    <div className="text-center py-4">
      <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
      <p className="text-slate-600 mb-6">{message}</p>
      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </div>
  );
}
