import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

import blogApi from "../../api/blogApi";
import getPublicUrl from "../../utils/getPublicUrl";

/* ================= HELPERS ================= */

const resolveUrl = (url) =>
    url ? (url.startsWith("http") ? url : getPublicUrl(url)) : "/placeholder.jpg";

/* ================= COMPONENT ================= */

export default function BlogsSection() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        blogApi
            .getBlogs({ limit: 3 })
            .then((res) => setBlogs(res.blogs || []));
    }, []);

    if (!blogs.length) return null;

    return (
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800">

            {/* HEADER */}
            <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="font-semibold text-sm text-slate-500 tracking-wide uppercase">
                    Travel Blogs
                </h3>

                <Link
                    to="/blogs"
                    className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                    See all
                </Link>
            </div>

            {/* BLOG LIST */}
            <div className="flex flex-col gap-4">
                {blogs.map((b) => (
                    <article
                        key={b._id}
                        onClick={() => navigate(`/blogs/${b.slug || b._id}`)}
                        className="group flex gap-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer
                       hover:bg-primary-50 dark:hover:bg-slate-800/60 transition"
                    >
                        {/* COVER */}
                        <img
                            src={resolveUrl(b.coverImage)}
                            alt={b.title}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        />

                        {/* CONTENT */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">
                                    {b.title}
                                </h4>

                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                                    {b.excerpt}
                                </p>
                            </div>

                            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400">
                                <BookOpen size={12} />
                                Read article
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
