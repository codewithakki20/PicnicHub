// src/pages/Admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../../api/adminApi";
import Spinner from "../../components/ui/Spinner";

// Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Icons
import {
  Users,
  Image as Memories,
  Film,
  FileText,
  MapPin,
  Plus,
  Settings,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [monthlyUploads, setMonthlyUploads] = useState([]);

  useEffect(() => {
    (async () => {
      setStats(await adminApi.getStats());
      setRecent(await adminApi.getRecentActivity());
      setMonthlyUploads(await adminApi.getMonthlyUploads());
    })();
  }, []);

  if (!stats)
    return (
      <div className="flex justify-center items-center min-h-screen bg-emerald-50">
        <Spinner />
      </div>
    );

  const cards = [
    { label: "Users", value: stats.totalUsers, icon: Users, color: "emerald" },
    { label: "Memories", value: stats.totalMemories, icon: Memories, color: "green" },
    { label: "Reels", value: stats.totalReels, icon: Film, color: "rose" },
    { label: "Blogs", value: stats.totalBlogs, icon: FileText, color: "amber" },
    { label: "Locations", value: stats.totalLocations, icon: MapPin, color: "orange" },
  ];

  return (
    <div className="p-6 md:p-10 space-y-10 bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-emerald-900">
            PicnicHub Dashboard 🌿
          </h1>
          <p className="text-emerald-700 font-medium">
            Your platform at a glance
          </p>
        </div>

        <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-full border border-emerald-200 shadow text-sm font-bold text-emerald-700">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          System Healthy
        </div>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white rounded-[2rem] border border-emerald-100 shadow-lg p-6 hover:-translate-y-1 transition-all"
          >
            <div className={`p-4 rounded-2xl mb-4 bg-${c.color}-50 text-${c.color}-600`}>
              <c.icon className="w-6 h-6" />
            </div>
            <p className="text-4xl font-black text-emerald-900">{c.value}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow-lg p-10">
        <h2 className="text-2xl font-bold text-emerald-900 mb-8 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <Shortcut label="Add Blog" link="/admin/blogs/create" color="amber" />
          <Shortcut label="Add Memory" link="/admin/memories/create" color="emerald" />
          <Shortcut label="Add Location" link="/admin/locations/create" color="orange" />
          <Shortcut label="Users" link="/admin/users" color="green" />
          <Shortcut label="Settings" link="/admin/settings" color="slate" />
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* LINE */}
        <ChartCard title="Monthly Uploads 🌞">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyUploads}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecfeff" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="uploads"
                stroke="#10b981"
                strokeWidth={4}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* BAR */}
        <ChartCard title="Content Split 🧺">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Memories", count: stats.totalMemories },
                { name: "Reels", count: stats.totalReels },
                { name: "Blogs", count: stats.totalBlogs },
                { name: "Locations", count: stats.totalLocations },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* RECENT */}
      <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow-lg p-10">
        <h2 className="text-2xl font-bold text-emerald-900 mb-6">
          Recent Activity 🌱
        </h2>

        {recent.length === 0 ? (
          <p className="text-center text-emerald-600 font-medium">
            No recent actions
          </p>
        ) : (
          <div className="space-y-4">
            {recent.map((r, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition"
              >
                <p className="font-bold text-emerald-900">{r.title}</p>
                <p className="text-sm text-emerald-600">{r.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------- Components -------- */

function Shortcut({ label, link, color }) {
  return (
    <Link
      to={link}
      className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-emerald-100 hover:-translate-y-1 transition-all bg-white"
    >
      <div className={`p-4 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Plus />
      </div>
      <span className="font-bold text-emerald-800 text-sm">{label}</span>
    </Link>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow-lg p-8">
      <h2 className="text-xl font-bold text-emerald-900 mb-6">{title}</h2>
      {children}
    </div>
  );
}
