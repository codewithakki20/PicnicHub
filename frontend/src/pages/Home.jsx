import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

import { useAuthContext } from "../context/AuthContext";
import memoryApi from "../api/memoryApi";

import StorySection from "../components/home/StorySection";
import FeedPost from "../components/home/FeedPost";
import ReelsSection from "../components/home/ReelsSection";
import BlogsSection from "../components/home/BlogsSection";
import RightSidebar from "../components/layout/RightSidebar";

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex justify-center gap-16 md:mt-4 px-4">

      {/* FEED COLUMN */}
      <div className="w-full max-w-[470px] space-y-6 pb-20">

        {/* STORIES */}
        <StorySection user={user} />

        {/* FEED */}
        <Feed navigate={navigate} />

        {/* REELS */}
        <ReelsSection />

        {/* BLOGS */}
        <BlogsSection />
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden lg:block w-80">
        <RightSidebar />
      </div>

    </div>
  );
}

/* =========================================================
   FEED
========================================================= */

function Feed({ navigate }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    memoryApi
      .getMemories({ limit: 10 })
      .then((res) => {
        if (!mounted) return;
        setMemories(res.memories || []);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  /* ---------- LOADING SKELETON ---------- */
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-[480px] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------- EMPTY FEED ---------- */
  if (!memories.length) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-primary-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={32} className="text-primary-600 dark:text-primary-400" />
        </div>

        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          Welcome to PicnicHub 🌿
        </h3>

        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Follow people to see their memories here.
        </p>

        <Link
          to="/user/find-people"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline"
        >
          Find people to follow →
        </Link>
      </div>
    );
  }

  /* ---------- FEED POSTS ---------- */
  return (
    <div className="flex flex-col gap-6">
      {memories.map((memory) => (
        <FeedPost
          key={memory._id}
          memory={memory}
          navigate={navigate}
        />
      ))}
    </div>
  );
}
