import { useEffect, useState, useCallback } from "react";
import adminApi from "../../api/adminApi";
import Spinner from "../../components/ui/Spinner";
import Pagination from "../../components/ui/Pagination";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import getPublicUrl from "../../utils/getPublicUrl";

import {
  Search,
  Trash2,
  Edit,
  Eye,
  Maximize2,
  Move,
  BarChart2,
  AlertCircle,
  MessageCircle,
  Image as ImageIcon
} from "lucide-react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function ManageMemories() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [viewModal, setViewModal] = useState(false);
  const [commentsModal, setCommentsModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [comments, setComments] = useState([]);

  /* ================= LOAD ================= */

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminApi.getMemories?.({ limit: 500 });
      const data = res?.memories || res || [];
      setMemories(data);
      setTotalPages(Math.max(1, Math.ceil(data.length / limit)));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load memories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadComments = async (memoryId) => {
    try {
      const res = await adminApi.getMemoryComments?.(memoryId);
      setComments(res?.comments || res || []);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setComments([]);
    }
  };

  const deleteComment = async (memoryId, commentId) => {
    try {
      await adminApi.deleteMemoryComment?.(memoryId, commentId);
      loadComments(memoryId);
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  /* ================= HELPERS ================= */

  const getFirstMediaUrl = (m) => {
    if (!m) return null;
    if (m.media?.length) return m.media[0].url;
    if (m.images?.length) return m.images[0];
    return m.coverImage || null;
  };

  const processed = memories
    .filter((m) =>
      search
        ? (m.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (m.description || "").toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "az") return (a.title || "").localeCompare(b.title || "");
      if (sort === "za") return (b.title || "").localeCompare(a.title || "");
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  useEffect(() => { setPage(1); }, [search, sort]);

  const paginated = processed.slice((page - 1) * limit, page * limit);

  /* ================= UI ================= */

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 via-lime-50 to-yellow-50">
        <Spinner />
      </div>
    );

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen bg-gradient-to-br from-emerald-50 via-lime-50 to-yellow-50">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-emerald-900">
            Manage Memories
          </h1>
          <p className="text-emerald-700 font-medium">
            Review, edit, analyze & moderate memories
          </p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 bg-white border border-emerald-200 rounded-xl
            hover:bg-emerald-50 text-emerald-700 font-bold transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-emerald-200 rounded-xl
              focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
            placeholder="Search memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 bg-white border border-emerald-200 rounded-xl
            focus:ring-2 focus:ring-emerald-500/30"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-emerald-100 rounded-3xl shadow-xl overflow-hidden">
        <DragDropContext onDragEnd={() => { }}>
          <Droppable droppableId="memories">
            {(p) => (
              <table ref={p.innerRef} {...p.droppableProps} className="w-full min-w-[900px]">
                <thead className="bg-emerald-50 border-b border-emerald-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-700 uppercase">Memory</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-700 uppercase">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-700 uppercase">Stats</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-emerald-700 uppercase">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-14 text-center">
                        <div className="flex flex-col items-center gap-3 text-emerald-400">
                          <ImageIcon className="w-14 h-14" />
                          <p className="text-lg font-bold">
                            {search ? "No memories found" : "No memories yet"}
                          </p>
                          <p className="text-sm">
                            {search ? "Try different keywords" : "User uploads will appear here"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((m, idx) => (
                      <Draggable key={m._id} draggableId={m._id} index={idx}>
                        {(d) => (
                          <tr ref={d.innerRef} {...d.draggableProps}
                            className="hover:bg-emerald-50/60 transition">
                            <td className="px-6 py-4 flex items-center gap-4">
                              <div {...d.dragHandleProps} className="cursor-grab text-slate-400">
                                <Move className="w-4 h-4" />
                              </div>

                              <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border">
                                {getFirstMediaUrl(m) ? (
                                  <img
                                    src={getPublicUrl(getFirstMediaUrl(m))}
                                    className="w-full h-full object-cover"
                                    alt=""
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <ImageIcon />
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="font-bold text-slate-900">{m.title || "Untitled"}</p>
                                <p className="text-xs text-slate-500">
                                  {new Date(m.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-700">
                              {m.uploaderName || "Unknown"}
                            </td>

                            <td className="px-6 py-4">
                              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                <Maximize2 className="w-3 h-3" /> {m.views || 0}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedMemory(m);
                                    loadComments(m._id);
                                    setCommentsModal(true);
                                  }}
                                  className="p-2 hover:bg-emerald-100 rounded-lg"
                                  title="View Comments"
                                >
                                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedMemory(m);
                                    setViewModal(true);
                                  }}
                                  className="p-2 hover:bg-blue-50 rounded-lg"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete "${m.title}"?`)) {
                                      adminApi.deleteMemory(m._id).then(load);
                                    }
                                  }}
                                  className="p-2 hover:bg-red-50 rounded-lg"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))
                  )}
                  {p.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* VIEW DETAILS MODAL */}
      <Modal open={viewModal} onClose={() => setViewModal(false)} title="Memory Details">
        {selectedMemory && (
          <div className="space-y-4 p-4">
            {getFirstMediaUrl(selectedMemory) && (
              <img
                src={getPublicUrl(getFirstMediaUrl(selectedMemory))}
                alt={selectedMemory.title}
                className="w-full rounded-xl max-h-80 object-cover"
              />
            )}

            <div>
              <h3 className="text-2xl font-bold text-emerald-900">{selectedMemory.title || "Untitled"}</h3>
              <p className="text-sm text-emerald-600">
                By {selectedMemory.uploaderName || "Unknown"} on {new Date(selectedMemory.createdAt).toLocaleDateString()}
              </p>
            </div>

            {selectedMemory.description && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-sm font-semibold text-emerald-600 mb-1">Description</p>
                <p className="text-emerald-900">{selectedMemory.description}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 text-center">
                <p className="text-xs text-blue-600 font-semibold">Views</p>
                <p className="text-xl font-bold text-blue-900">{selectedMemory.views || 0}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center">
                <p className="text-xs text-emerald-600 font-semibold">Likes</p>
                <p className="text-xl font-bold text-emerald-900">{selectedMemory.likesCount || selectedMemory.likes?.length || 0}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 text-center">
                <p className="text-xs text-purple-600 font-semibold">Comments</p>
                <p className="text-xl font-bold text-purple-900">{selectedMemory.commentsCount || selectedMemory.comments?.length || 0}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setViewModal(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* COMMENTS MODAL */}
      <Modal open={commentsModal} onClose={() => setCommentsModal(false)} title="Memory Comments">
        {selectedMemory && (
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-emerald-900">{selectedMemory.title || "Untitled"}</h3>
                <p className="text-sm text-emerald-600">{comments.length} comments</p>
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto space-y-3">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-emerald-900">
                            {comment.user?.name || comment.userName || "Unknown User"}
                          </p>
                          <span className="text-xs text-emerald-600">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-emerald-800">{comment.text || comment.content}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm("Delete this comment?")) {
                            deleteComment(selectedMemory._id, comment._id);
                          }
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                        title="Delete Comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-emerald-600">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-semibold">No comments yet</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2 border-t border-emerald-100 mt-4">
              <Button variant="secondary" onClick={() => setCommentsModal(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
