// src/hooks/useReels.js
import { useState, useEffect } from "react";
import reelsApi from "../api/reelsApi";

export default function useReels(params = {}) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await reelsApi.getReels(params);
    setReels(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [JSON.stringify(params)]);

  const like = async (id) => {
    await reelsApi.toggleReelLike(id);
    load();
  };

  return { reels, loading, reload: load, like };
}
