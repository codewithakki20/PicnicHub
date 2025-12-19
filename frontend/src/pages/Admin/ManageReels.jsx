// src/pages/Admin/ManageReels.jsx
import { useEffect, useState, useCallback } from "react";
import reelsApi from "../../api/reelsApi";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import getPublicUrl from "../../utils/getPublicUrl";

import {
  Search,
  Trash2,
  Star,
  StarOff,
  BarChart2,
  CheckSquare,
  Square,
  Film,
  Edit,
  Eye,
  Maximize2,
  Move,
  Pin,
  AlertCircle,
  ArrowUpDown,
  MessageCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";

export default function ManageReels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterFeature, setFilterFeature] = useState("all");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const [selected, setSelected] = useState([]);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [statsModal, setStatsModal] = useState(false);
  const [statsReel, setStatsReel] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerReel, setViewerReel] = useState(null);

  const [editModal, setEditModal] = useState(false);
  const [editingReel, setEditingReel] = useState(null);
  const [newCaption, setNewCaption] = useState("");

  const [viewModal, setViewModal] = useState(false);
  const [viewingReel, setViewingReel] = useState(null);

  const [commentsModal, setCommentsModal] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);
  const [comments, setComments] = useState([]);

  const [page, setPage] = useState(1);
  const limit = 9;
  const [totalPages, setTotalPages] = useState(1);

  const categories = [...new Set(reels.map(r => r.category).filter(Boolean))];

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reelsApi.getReels({ limit: 500, category });
      const data = res?.reels || res || [];
      data.sort((a, b) => (b.isPinned === true) - (a.isPinned === true));
      setReels(data);
      setTotalPages(Math.max(1, Math.ceil(data.length / limit)));
    } catch {
      setError("Failed to load reels.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFeature = async (id) => {
    await reelsApi.toggleFeature(id);
    load();
  };

  const togglePin = async (id, pinned) => {
    await reelsApi.pinReel(id, pinned);
    load();
  };

  const deleteReel = async () => {
    await reelsApi.deleteReel(deleteId);
    setDeleteId(null);
    load();
  };

  const bulkDelete = async () => {
    for (const id of selected) await reelsApi.deleteReel(id);
    setSelected([]);
    setBulkDeleteModal(false);
    load();
  };

  const loadComments = async (reelId) => {
    try {
      const res = await reelsApi.getComments(reelId);
      setComments(res?.comments || res || []);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setComments([]);
    }
  };

  const deleteComment = async (reelId, commentId) => {
    try {
      await reelsApi.deleteComment(reelId, commentId);
      loadComments(reelId);
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  const updateCaption = async () => {
    if (!editingReel) return;
    try {
      await reelsApi.updateReel(editingReel._id, { caption: newCaption });
      setEditModal(false);
      setEditingReel(null);
      setNewCaption("");
      load();
    } catch (err) {
      alert("Failed to update caption");
    }
  };

  const processed = reels
    .filter(r => filterFeature === "featured" ? r.isFeatured : filterFeature === "normal" ? !r.isFeatured : true)
    .filter(r => category ? r.category === category : true)
    .filter(r => search ? (r.caption || "").toLowerCase().includes(search.toLowerCase()) : true)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginated = processed.slice((page - 1) * limit, page * limit);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-emerald-50">
        <Spinner />
      </div>
    );

  return (
    <div className="p-6 md:p-10 space-y-8 bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-black text-emerald-900">Manage Reels 🎬</h1>
        <p className="text-emerald-700 font-medium">
          Feature, reorder & moderate community reels
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 font-medium">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* FILTERS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputBox icon={Search}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search caption..."
            className="w-full bg-transparent outline-none font-medium"
          />
        </InputBox>

        <SelectBox icon={Star}>
          <select value={filterFeature} onChange={(e) => setFilterFeature(e.target.value)}>
            <option value="all">All Reels</option>
            <option value="featured">Featured</option>
            <option value="normal">Normal</option>
          </select>
        </SelectBox>

        <SelectBox icon={ArrowUpDown}>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </SelectBox>
      </div>

      {/* BULK BAR */}
      {selected.length > 0 && (
        <div className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg">
          <span className="font-bold">{selected.length} selected</span>
          <Button variant="destructive" onClick={() => setBulkDeleteModal(true)}>
            Delete Selected
          </Button>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow overflow-hidden">
        <DragDropContext onDragEnd={() => { }}>
          <table className="w-full min-w-[900px]">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-6 py-4"></th>
                <th className="px-6 py-4 text-left text-xs font-black text-emerald-700">Reel</th>
                <th className="px-6 py-4 text-left text-xs font-black text-emerald-700">Category</th>
                <th className="px-6 py-4 text-left text-xs font-black text-emerald-700">Status</th>
                <th className="px-6 py-4 text-left text-xs font-black text-emerald-700">Views</th>
                <th className="px-6 py-4 text-right text-xs font-black text-emerald-700">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-emerald-100">
              {paginated.map((r) => (
                <tr key={r._id} className="hover:bg-emerald-50/60 group">
                  <td className="px-6 py-4">
                    <button onClick={() => setSelected(s =>
                      s.includes(r._id) ? s.filter(x => x !== r._id) : [...s, r._id]
                    )}>
                      {selected.includes(r._id)
                        ? <CheckSquare className="text-emerald-600" />
                        : <Square className="text-slate-400" />}
                    </button>
                  </td>

                  <td className="px-6 py-4 flex items-center gap-4">
                    <video src={getPublicUrl(r.videoUrl)} className="w-20 h-14 rounded-lg object-cover" muted />
                    <div>
                      <p className="font-bold text-emerald-900 line-clamp-1">{r.caption || "Untitled"}</p>
                      <p className="text-xs text-emerald-600">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      {r.category || "General"}
                    </span>
                  </td>

                  <td className="px-6 py-4 space-y-1">
                    {r.isFeatured && (
                      <span className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                    <button
                      onClick={() => togglePin(r._id, !r.isPinned)}
                      className={`text-xs font-bold ${r.isPinned ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600"}`}
                    >
                      {r.isPinned ? "Pinned" : "Pin"}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-emerald-700">
                    {r.views || 0}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                      <IconBtn
                        icon={<MessageCircle />}
                        color="emerald"
                        onClick={() => {
                          setSelectedReel(r);
                          loadComments(r._id);
                          setCommentsModal(true);
                        }}
                      />
                      <IconBtn
                        icon={<Eye />}
                        color="blue"
                        onClick={() => {
                          setViewingReel(r);
                          setViewModal(true);
                        }}
                      />
                      <IconBtn
                        icon={<Edit />}
                        color="orange"
                        onClick={() => {
                          setEditingReel(r);
                          setNewCaption(r.caption || "");
                          setEditModal(true);
                        }}
                      />
                      <IconBtn icon={<Trash2 />} color="red" onClick={() => setDeleteId(r._id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DragDropContext>

        <div className="border-t border-emerald-100 p-4">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
      {/* DELETE MODAL */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Reel">
        <div className="text-center py-4">
          <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-emerald-900 font-semibold mb-4">Are you sure you want to delete this reel?</p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteReel}>Delete</Button>
          </div>
        </div>
      </Modal>

      {/* BULK DELETE MODAL */}
      <Modal open={bulkDeleteModal} onClose={() => setBulkDeleteModal(false)} title="Bulk Delete">
        <div className="text-center py-4">
          <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-emerald-900 font-semibold mb-4">
            Delete {selected.length} reels?
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setBulkDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={bulkDelete}>Delete</Button>
          </div>
        </div>
      </Modal>

      {/* EDIT CAPTION MODAL */}
      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Caption">
        {editingReel && (
          <div className="space-y-4 p-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-700 mb-2">Caption</label>
              <textarea
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                rows="4"
                placeholder="Enter reel caption..."
              />
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={updateCaption}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal open={viewModal} onClose={() => setViewModal(false)} title="Reel Details">
        {viewingReel && (
          <div className="space-y-4 p-4">
            <video
              src={getPublicUrl(viewingReel.videoUrl)}
              controls
              className="w-full rounded-xl max-h-96"
            />

            <div>
              <h3 className="text-2xl font-bold text-emerald-900">{viewingReel.caption || "Untitled"}</h3>
              <p className="text-sm text-emerald-600">
                By {viewingReel.uploaderName || "Unknown"} on {new Date(viewingReel.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 text-center">
                <p className="text-xs text-blue-600 font-semibold">Views</p>
                <p className="text-xl font-bold text-blue-900">{viewingReel.views || 0}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center">
                <p className="text-xs text-emerald-600 font-semibold">Likes</p>
                <p className="text-xl font-bold text-emerald-900">{viewingReel.likesCount || viewingReel.likes?.length || 0}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 text-center">
                <p className="text-xs text-purple-600 font-semibold">Comments</p>
                <p className="text-xl font-bold text-purple-900">{viewingReel.commentsCount || viewingReel.comments?.length || 0}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setViewModal(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* COMMENTS MODAL */}
      <Modal open={commentsModal} onClose={() => setCommentsModal(false)} title="Reel Comments">
        {selectedReel && (
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-emerald-900">{selectedReel.caption || "Untitled"}</h3>
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
                            deleteComment(selectedReel._id, comment._id);
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

/* helpers */
function InputBox({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-emerald-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-emerald-400/30">
      <Icon className="w-4 h-4 text-emerald-500" />
      {children}
    </div>
  );
}

function SelectBox({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-emerald-200 rounded-xl px-4 py-2.5">
      <Icon className="w-4 h-4 text-emerald-500" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

function IconBtn({ icon, color = "emerald", onClick }) {
  const colors = {
    emerald: "text-emerald-600 hover:bg-emerald-50",
    orange: "text-orange-600 hover:bg-orange-50",
    red: "text-red-600 hover:bg-red-50",
    blue: "text-blue-600 hover:bg-blue-50",
  };
  return (
    <button onClick={onClick} className={`p-2 rounded-lg ${colors[color]}`}>
      {icon}
    </button>
  );
}
