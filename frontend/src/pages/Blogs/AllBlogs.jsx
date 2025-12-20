import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, X, Sparkles, Hash } from "lucide-react";

import blogApi from "../../api/blogApi";
import BlogCard from "../../components/cards/BlogCard";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import Spinner from "../../components/ui/Spinner";

/* ======================================================
   CONSTANTS & CONFIG
====================================================== */
const QUICK_TAGS = ["Travel", "Picnic", "Adventure", "Culture", "Tips", "Nature"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ======================================================
   ALL BLOGS COMPONENT
====================================================== */
export default function AllBlogs() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "", tag: "" });
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  /* ---------- Fetch ---------- */
  // Use useCallback to prevent infinite loop in useInfiniteScroll dependency
  const fetchBlogs = useCallback(async (page) => {
    try {
      const res = await blogApi.getBlogs({
        page,
        search: filters.search,
        tag: filters.tag,
      });
      return res?.blogs || res || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [filters.search, filters.tag]);

  // Hook handles pagination logic
  const { items: blogs, loader, end, setPage, setItems } = useInfiniteScroll(fetchBlogs, [
    filters.search,
    filters.tag,
  ]);

  /* ---------- Handlers ---------- */
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    // Reset to page 1 is handled by useInfiniteScroll dependency change
  };

  const handleTagSelect = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tag: prev.tag === tag ? "" : tag, // Toggle
    }));
  };

  const clearFilters = () => {
    setFilters({ search: "", tag: "" });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-24">
      {/* ================= HEADER & HERO ================= */}
      <div className="bg-white border-b border-stone-200 pt-28 pb-10 px-4 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-600 font-bold text-sm tracking-wider uppercase mb-2"
              >
                <Sparkles size={16} />
                <span>PicnicHub Journals</span>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
                Discover Stories
              </h1>
              <p className="mt-3 text-stone-500 text-lg max-w-xl leading-relaxed">
                Explore curated travel guides, hidden gems, and local tips from our community.
              </p>
            </div>

            {/* Search Input */}
            <div className={`
              relative w-full md:w-96 transition-all duration-300
              ${isSearchFocused ? 'ring-2 ring-green-500/20 scale-[1.02]' : 'hover:bg-stone-50'}
            `}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-stone-400" />
              </div>
              <input
                type="text"
                placeholder="Search ideas, places..."
                value={filters.search}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-11 pr-4 py-3.5 bg-stone-100 border-none rounded-2xl 
                text-stone-800 placeholder-stone-400 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Filters / Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-2 p-2 bg-stone-100 rounded-full text-stone-400">
              <Filter size={16} />
            </div>

            {/* 'All' / Clear */}
            {filters.tag && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-semibold 
                 hover:bg-red-100 transition-colors flex items-center gap-1.5"
              >
                <X size={14} /> Clear
              </button>
            )}

            {/* Quick Tags */}
            {QUICK_TAGS.map((tag) => {
              const isActive = filters.tag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`
                     px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                     ${isActive
                      ? "bg-stone-900 text-white border-stone-900 shadow-md transform scale-105"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-50"
                    }
                   `}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Empty State */}
        {blogs.length === 0 && end ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center mb-6">
              <Hash size={40} className="text-stone-300" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">No stories found</h2>
            <p className="text-stone-500">
              We couldn't find any blogs matching your search.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 text-green-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {blogs.map((blog) => (
              <motion.div key={blog._id} variants={itemVariants} className="break-inside-avoid">
                <BlogCard
                  blog={blog}
                  onClick={() => navigate(`/blogs/${blog.slug}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Loader Trigger */}
        <div className="flex justify-center py-16" ref={loader}>
          {!end && <Spinner />}
          {end && blogs.length > 0 && (
            <span className="text-stone-400 text-sm font-medium italic">
              — You've reached the end —
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
