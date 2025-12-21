import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import blogApi from "../../api/blogApi";
import Spinner from "../../components/ui/Spinner";
import getPublicUrl from "../../utils/getPublicUrl";
import formatDate from "../../utils/formatDate";

/*
  BlogDetails
  - Editorial / long-read experience
  - Calm, readable, journal-style
*/

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await blogApi.getBlog(slug);
        setBlog(res);
      } catch (err) {
        console.error("Failed to load blog:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center text-slate-500">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4">

        {/* ================= COVER ================= */}
        {blog.coverImage && (
          <div className="relative mb-12">
            <img
              src={getPublicUrl(blog.coverImage)}
              alt={blog.title}
              className="w-full max-h-[520px] object-cover rounded-[2.5rem]
              shadow-2xl shadow-slate-200/60"
            />
            <div className="absolute inset-0 rounded-[2.5rem]
              bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>
        )}

        {/* ================= HEADER ================= */}
        <header className="mb-14 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-slate-500 text-sm font-medium">
            <span className="px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
              📅 {formatDate(blog.createdAt)}
            </span>

            {blog.location && (
              <span className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-green-700 font-medium">
                <MapPin size={16} />
                {blog.location.name || blog.location}
              </span>
            )}

            {blog.tags?.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full text-sm font-semibold
                bg-green-50 text-green-700 border border-green-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <article
          className="prose prose-lg max-w-none
          prose-headings:font-extrabold prose-headings:text-slate-900
          prose-p:text-slate-700 prose-p:leading-relaxed
          prose-strong:text-slate-900
          prose-a:text-green-700 hover:prose-a:text-green-800
          prose-img:rounded-3xl prose-img:shadow-xl prose-img:border prose-img:border-slate-100
          prose-blockquote:border-l-4 prose-blockquote:border-green-600
          prose-blockquote:bg-green-50/60 prose-blockquote:px-6 prose-blockquote:py-3
          prose-blockquote:rounded-r-xl prose-blockquote:italic
          mb-20 bg-white p-8 md:p-12 rounded-[2.5rem]
          shadow-xl shadow-slate-200/50 border border-slate-100"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* ================= AUTHOR ================= */}
        <section className="relative rounded-[2.5rem] overflow-hidden
          bg-gradient-to-br from-slate-900 to-slate-800
          shadow-2xl p-8 md:p-10 text-white">

          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 blur-[90px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 blur-[90px] rounded-full" />

          <div className="relative flex items-center gap-6">
            <div className="w-20 h-20 rounded-full
              bg-gradient-to-br from-green-400 to-green-600
              flex items-center justify-center text-3xl
              shadow-lg shadow-green-500/30">
              ✍️
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-green-400 mb-1">
                Written by
              </p>
              <p className="text-3xl font-extrabold">
                {blog.authorId?.name ||
                  blog.author?.name ||
                  "Unknown Author"}
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
