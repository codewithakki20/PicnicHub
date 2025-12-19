// src/hooks/useMemories.js
import { useState, useEffect } from "react";
import memoryApi from "../api/memoryApi";

export default function useMemories(params = {}) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await memoryApi.getMemories(params);
    setMemories(res);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [JSON.stringify(params)]);

  const like = async (id) => {
    await memoryApi.toggleLike(id);
    load();
  };

  return {
    memories,
    loading,
    reload: load,
    like,
  };
}
