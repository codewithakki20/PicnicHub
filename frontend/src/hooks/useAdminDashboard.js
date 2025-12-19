// src/hooks/useAdminDashboard.js
import { useState, useEffect } from "react";
import adminApi from "../api/adminApi";

export default function useAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingMemories, setPendingMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    const s = await adminApi.getStats();
    const pending = await adminApi.getPendingMemories();
    setStats(s);
    setPendingMemories(pending);
    setLoading(false);
  };

  const approve = async (id) => {
    await adminApi.approveMemory(id);
    loadDashboard();
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return { stats, pendingMemories, approve, loading, reload: loadDashboard };
}
