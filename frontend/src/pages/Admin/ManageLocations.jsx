// src/pages/Admin/ManageLocations.jsx
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import getPublicUrl from "../../utils/getPublicUrl";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";

import {
  Search,
  Trash2,
  CheckSquare,
  Square,
  Move,
  Pin,
  Edit,
  BarChart2,
  Plus,
  AlertCircle,
  Image as ImageIcon,
  X,
} from "lucide-react";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ManageLocations() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [selected, setSelected] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryLocation, setGalleryLocation] = useState(null);

  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [analyticsLocation, setAnalyticsLocation] = useState(null);
  const [analyticsSeries, setAnalyticsSeries] = useState([]);

  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminApi.getLocations({ limit: 1000 }) || [];
      data.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
      setLocations(data);
      setTotalPages(Math.max(1, Math.ceil(data.length / limit)));
    } catch (err) {
      setError("Failed to load locations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleSelect = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const processed = locations
    .filter(l =>
      search
        ? (l.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.description || "").toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (sort === "az") return (a.name || "").localeCompare(b.name || "");
      if (sort === "za") return (b.name || "").localeCompare(a.name || "");
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const start = (page - 1) * limit;
  const paginated = processed.slice(start, start + limit);

  const confirmDelete = async () => {
    try {
      if (!deleteId) return;
      await adminApi.deleteLocation(deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      setError("Failed to delete location.");
    }
  };

  const openEdit = (loc) => {
    navigate(`/admin/locations/edit/${loc._id}`);
  };

  const openAnalytics = async (loc) => {
    setAnalyticsLocation(loc);
    try {
      const res = await adminApi.getLocationStats(loc._id);
      setAnalyticsSeries(res.history || []);
    } catch {
      setAnalyticsSeries([]);
    }
    setAnalyticsOpen(true);
  };

  const openGallery = (loc) => {
    setGalleryLocation(loc);
    setGalleryOpen(true);
  };

  const removeImage = async (imageUrl) => {
    if (!galleryLocation) return;
    try {
      const updatedImages = galleryLocation.images.filter(img => img !== imageUrl);
      await adminApi.updateLocation(galleryLocation._id, { images: updatedImages });
      // Update local state
      setGalleryLocation({ ...galleryLocation, images: updatedImages });
      await load();
    } catch (err) {
      setError("Failed to remove image");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Spinner />
      </div>
    );

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Manage Locations
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Search, edit, reorder & analyze locations
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/admin/locations/create")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition"
          >
            <Plus className="w-5 h-5" />
            Add Location
          </Button>
          <Button variant="secondary" onClick={load}>
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white"
            placeholder="Search name or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <DragDropContext onDragEnd={() => { }}>
          <Droppable droppableId="locations">
            {(p) => (
              <table ref={p.innerRef} {...p.droppableProps} className="w-full min-w-[900px]">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4"></th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Coordinates</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginated.map((loc, idx) => (
                    <Draggable key={loc._id} draggableId={loc._id} index={idx}>
                      {(d) => (
                        <tr ref={d.innerRef} {...d.draggableProps} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="px-6 py-4">
                            <button onClick={() => toggleSelect(loc._id)}>
                              {selected.includes(loc._id)
                                ? <CheckSquare className="w-5 h-5 text-emerald-600" />
                                : <Square className="w-5 h-5 text-slate-400" />}
                            </button>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div {...d.dragHandleProps} className="cursor-grab text-slate-400">
                                <Move className="w-4 h-4" />
                              </div>
                              <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                                {loc.images?.[0] ? (
                                  <img src={getPublicUrl(loc.images[0])} className="w-full h-full object-cover" alt="" />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-slate-400">
                                    <ImageIcon size={20} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{loc.name}</p>
                                <p className="text-xs text-slate-500 line-clamp-1">{loc.description}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-xs text-slate-500">
                            {loc.coords?.lat}, {loc.coords?.lng}
                          </td>

                          <td className="px-6 py-4">
                            {loc.isPinned && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Pin className="w-3 h-3" /> Pinned
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openGallery(loc)}
                                className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                                title="View Gallery"
                              >
                                <ImageIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openAnalytics(loc)}
                                className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors"
                                title="View Analytics"
                              >
                                <BarChart2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEdit(loc)}
                                className="p-2 hover:bg-orange-50 text-slate-400 hover:text-orange-600 rounded-lg transition-colors"
                                title="Edit Location"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteId(loc._id)}
                                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                title="Delete Location"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {p.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Location">
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 mx-auto mb-4 flex items-center justify-center">
            <Trash2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Delete this location?</h3>
          <p className="text-slate-500 mb-6">This will permanently delete the location.</p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </div>
        </div>
      </Modal>

      {/* Analytics Modal */}
      <Modal open={analyticsOpen} onClose={() => { setAnalyticsOpen(false); setAnalyticsLocation(null); }} title="Analytics">
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="w-16 h-12 rounded-lg bg-white shadow-sm overflow-hidden border border-slate-200">
              {analyticsLocation?.images && analyticsLocation.images.length > 0 ? (
                <img src={getPublicUrl(analyticsLocation.images[0])} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 line-clamp-1">{analyticsLocation?.name}</h3>
              <div className="flex gap-4 mt-1 text-sm text-slate-500">
                <span>{analyticsLocation?.visitCount || 0} Visits</span>
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #d1fae5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="visits" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => { setAnalyticsOpen(false); setAnalyticsLocation(null); }}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Gallery Modal */}
      <Modal
        open={galleryOpen}
        onClose={() => { setGalleryOpen(false); setGalleryLocation(null); }}
        title="Location Gallery"
      >
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <h3 className="font-bold text-emerald-900 mb-1">{galleryLocation?.name}</h3>
            <p className="text-sm text-emerald-600">{galleryLocation?.images?.length || 0} images</p>
          </div>

          {galleryLocation?.images && galleryLocation.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-2">
              {galleryLocation.images.map((imgUrl, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={getPublicUrl(imgUrl)}
                    alt={`${galleryLocation.name} ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-xl border border-slate-200"
                  />
                  <button
                    onClick={() => {
                      if (window.confirm("Remove this image?")) {
                        removeImage(imgUrl);
                      }
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-semibold">No images</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
            <Button variant="secondary" onClick={() => { setGalleryOpen(false); setGalleryLocation(null); }}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
