import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import getPublicUrl from "../../utils/getPublicUrl";
import formatDate from "../../utils/formatDate";

/*
  BlogCard
  - Used on Home + Blogs page
  - Editorial / journal-style
*/

export default function BlogCard({ blog, onClick }) {
  const cover = getPublicUrl(blog.coverImage);
  const author = blog.authorId?.name || blog.author?.name || "PicnicHub";

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl overflow-hidden
      border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1
      transition-all duration-500 flex flex-col"
    >
      {/* ================= COVER ================= */}
      <div className="relative aspect-[15/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {cover ? (
          <img
            src={cover}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <BookOpen size={36} />
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Tag */}
        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur
          text-slate-800 dark:text-white text-xs font-semibold rounded-full shadow-sm">
          {blog.tags?.[0] || "Story"}
        </span>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-6 flex flex-col flex-1">
        {/* Meta */}
        <div className="text-xs flex items-center gap-3 text-slate-400 dark:text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(blog.createdAt)}
          </span>

          <span className="opacity-60">•</span>

          <span className="flex items-center gap-1">
            <User size={12} />
            {author}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3
          group-hover:text-green-700 dark:group-hover:text-green-500 transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
          {blog.excerpt}
        </p>

        {/* CTA */}
        <span className="mt-auto flex items-center gap-2 text-green-700 dark:text-green-500
          font-semibold text-sm group-hover:gap-3 transition-all">
          Read story
          <ArrowRight size={16} />
        </span>
      </div>
    </article>
  );
}
