// src/pages/Admin/ManageUsers.jsx
import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";

import {
  Ban,
  CheckCircle2,
  Search,
  UserMinus,
  UserPlus,
  Eye,
  History,
  ArrowUpDown,
  Shield,
  Mail
} from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("az");

  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmBan, setConfirmBan] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [logsModal, setLogsModal] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);

  const load = async () => {
    try {
      const data = await adminApi.getUsers(page, 20);
      setUsers(data.users || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (id) => {
    setActivityLogs(await adminApi.getUserActivityLogs(id));
  };

  useEffect(() => {
    load();
  }, [page]);

  const toggleBan = async () => {
    await adminApi.toggleBanUser(selectedUser._id, !selectedUser.isBanned);
    setConfirmBan(false);
    load();
  };

  const changeRole = async (u, newRole) => {
    await adminApi.updateUserRole(u._id, newRole);
    load();
  };

  const filteredUsers = users
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortType === "az"
        ? a.name.localeCompare(b.name)
        : sortType === "za"
          ? b.name.localeCompare(a.name)
          : sortType === "new"
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : sortType === "role"
              ? a.role.localeCompare(b.role)
              : b.isBanned - a.isBanned
    );

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
        <h1 className="text-4xl font-black text-emerald-900">Manage Users 🌿</h1>
        <p className="text-emerald-700 font-medium">
          Control and monitor community members
        </p>
      </div>

      {/* SEARCH + SORT */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-5 rounded-3xl border border-emerald-100 shadow">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
          <input
            placeholder="Search by name or email…"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-500 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative w-full sm:w-52">
          <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4" />
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="w-full pl-12 pr-8 py-3 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-400/30"
          >
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
            <option value="new">Newest</option>
            <option value="role">By Role</option>
            <option value="banned">Banned First</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow overflow-hidden">
        <table className="w-full min-w-[900px]">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-emerald-600 uppercase">User</th>
              <th className="px-6 py-4 text-left text-xs font-black text-emerald-600 uppercase">Role</th>
              <th className="px-6 py-4 text-left text-xs font-black text-emerald-600 uppercase">Status</th>
              <th className="px-6 py-4 text-right text-xs font-black text-emerald-600 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-emerald-100">
            {filteredUsers.map((u) => (
              <tr key={u._id} className="hover:bg-emerald-50/60 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-amber-400 text-white font-black flex items-center justify-center">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-emerald-900">{u.name}</p>
                      <p className="text-sm text-emerald-600 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {u.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="relative inline-block">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-emerald-600" />
                    <select
                      value={u.role || "user"}
                      onChange={(e) => changeRole(u, e.target.value)}
                      className={`pl-8 pr-6 py-1.5 rounded-full text-xs font-black cursor-pointer ${u.role === "admin"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {u.isBanned ? (
                    <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-xs flex items-center gap-1">
                      <Ban className="w-3 h-3" /> Banned
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                    <IconBtn onClick={() => { setSelectedUser(u); setProfileModal(true); }} icon={<Eye />} />
                    <IconBtn onClick={() => { setSelectedUser(u); fetchLogs(u._id); setLogsModal(true); }} icon={<History />} />
                    <IconBtn
                      onClick={() => { setSelectedUser(u); setConfirmBan(true); }}
                      icon={u.isBanned ? <UserPlus /> : <UserMinus />}
                      danger
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-emerald-100 p-4">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      {/* BAN MODAL */}
      <Modal open={confirmBan} onClose={() => setConfirmBan(false)} title="Confirm Action">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-black text-emerald-900">
            {selectedUser?.isBanned ? "Unban User?" : "Ban User?"}
          </h3>
          <p className="text-emerald-700">
            {selectedUser?.isBanned ? "Restore access for" : "Revoke access for"}{" "}
            <strong>{selectedUser?.name}</strong>
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setConfirmBan(false)}>Cancel</Button>
            <Button variant={selectedUser?.isBanned ? "primary" : "destructive"} onClick={toggleBan}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* PROFILE VIEW MODAL */}
      <Modal open={profileModal} onClose={() => setProfileModal(false)} title="User Profile">
        {selectedUser && (
          <div className="space-y-6 p-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-amber-400 text-white font-black text-3xl flex items-center justify-center">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-900">{selectedUser.name}</h3>
                <p className="text-emerald-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {selectedUser.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InfoBox label="Role" value={selectedUser.role} />
              <InfoBox label="Status" value={selectedUser.isBanned ? "Banned" : "Active"} />
              <InfoBox label="Verified" value={selectedUser.isVerified ? "Yes" : "No"} />
              <InfoBox label="Joined" value={new Date(selectedUser.createdAt).toLocaleDateString()} />
            </div>

            {selectedUser.bio && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-sm font-semibold text-emerald-600 mb-1">Bio</p>
                <p className="text-emerald-900">{selectedUser.bio}</p>
              </div>
            )}

            {(selectedUser.college || selectedUser.branch) && (
              <div className="flex flex-wrap gap-2">
                {selectedUser.college && (
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                    🎓 {selectedUser.college}
                  </span>
                )}
                {selectedUser.branch && (
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    📚 {selectedUser.branch}
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setProfileModal(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ACTIVITY LOGS MODAL */}
      <Modal open={logsModal} onClose={() => setLogsModal(false)} title="Activity History">
        {selectedUser && (
          <div className="space-y-4 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-amber-400 text-white font-black text-xl flex items-center justify-center">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-emerald-900">{selectedUser.name}</h3>
                <p className="text-sm text-emerald-600">Recent Activity</p>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {activityLogs && activityLogs.length > 0 ? (
                activityLogs.map((log, idx) => (
                  <div key={idx} className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-emerald-900">{log.action}</span>
                      <span className="text-xs text-emerald-600">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-xs text-emerald-600 mt-1">{log.details}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-emerald-600">
                  <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-semibold">No activity logs available</p>
                  <p className="text-sm">This feature may not be fully implemented yet</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2 border-t border-emerald-100 mt-4">
              <Button variant="secondary" onClick={() => setLogsModal(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* --- small helper --- */
function IconBtn({ icon, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition ${danger
        ? "text-red-500 hover:bg-red-50"
        : "text-emerald-600 hover:bg-emerald-50"
        }`}
    >
      {icon}
    </button>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
      <p className="text-xs font-semibold text-emerald-600 mb-1">{label}</p>
      <p className="text-sm font-bold text-emerald-900 capitalize">{value}</p>
    </div>
  );
}
