import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Mail,
    MessageCircle,
    Book,
    Search,
    FileText,
    Shield,
    Camera,
    Video,
    Users,
    Settings,
} from "lucide-react";

/* ======================================================
   HELP & SUPPORT
====================================================== */

export default function HelpSupport() {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    /* ================= FAQ DATA ================= */

    const faqs = useMemo(
        () => [
            {
                category: "Getting Started",
                icon: Book,
                questions: [
                    {
                        id: "create-account",
                        q: "How do I create an account?",
                        a: "Click on the Register button, fill in your details, verify your email, and you’re good to go.",
                    },
                    {
                        id: "reset-password",
                        q: "How do I reset my password?",
                        a: "On the login page, click Forgot Password and follow the email instructions.",
                    },
                    {
                        id: "is-free",
                        q: "Is PicnicHub free to use?",
                        a: "Yes! PicnicHub is completely free to use with no hidden charges.",
                    },
                ],
            },
            {
                category: "Memories & Content",
                icon: Camera,
                questions: [
                    {
                        id: "upload-memory",
                        q: "How do I upload a memory?",
                        a: "Tap the + button, select Memory, upload photos, add details, and share.",
                    },
                    {
                        id: "file-types",
                        q: "What file types are supported?",
                        a: "JPG, PNG, and WEBP images under 50MB each.",
                    },
                    {
                        id: "edit-delete",
                        q: "Can I edit or delete memories?",
                        a: "Yes. Open the memory, tap the menu, and choose Edit or Delete.",
                    },
                ],
            },
            {
                category: "Reels & Videos",
                icon: Video,
                questions: [
                    {
                        id: "upload-reel",
                        q: "How do I upload a reel?",
                        a: "Choose Reel from the + menu, upload a vertical video under 100MB.",
                    },
                    {
                        id: "video-format",
                        q: "What video formats are supported?",
                        a: "MP4, MOV, and WEBM in 9:16 aspect ratio.",
                    },
                ],
            },
            {
                category: "Social Features",
                icon: Users,
                questions: [
                    {
                        id: "follow-user",
                        q: "How do I follow users?",
                        a: "Visit a profile and tap Follow to see their content in your feed.",
                    },
                    {
                        id: "find-users",
                        q: "How do I find people?",
                        a: "Use Find People to browse or search for users.",
                    },
                ],
            },
            {
                category: "Privacy & Security",
                icon: Shield,
                questions: [
                    {
                        id: "data-safety",
                        q: "How is my data protected?",
                        a: "We use industry-standard encryption and security practices.",
                    },
                    {
                        id: "delete-account",
                        q: "Can I delete my account?",
                        a: "Yes. Go to Settings → Delete Account. This action is permanent.",
                    },
                ],
            },
            {
                category: "Account Settings",
                icon: Settings,
                questions: [
                    {
                        id: "change-password",
                        q: "How do I change my password?",
                        a: "Go to Settings → Change Password and follow the steps.",
                    },
                ],
            },
        ],
        []
    );

    /* ================= SEARCH ================= */

    const filteredFAQs = useMemo(() => {
        if (!searchQuery.trim()) return faqs;

        const q = searchQuery.toLowerCase();

        return faqs
            .map((cat) => ({
                ...cat,
                questions: cat.questions.filter(
                    (faq) =>
                        faq.q.toLowerCase().includes(q) ||
                        faq.a.toLowerCase().includes(q)
                ),
            }))
            .filter((cat) => cat.questions.length > 0);
    }, [searchQuery, faqs]);

    const totalResults = filteredFAQs.reduce(
        (sum, c) => sum + c.questions.length,
        0
    );

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-4">

                {/* HEADER */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center">
                            <HelpCircle size={40} className="text-emerald-600" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
                        Help & Support
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Answers, guides, and help when you need it.
                    </p>
                </div>

                {/* SEARCH */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Search for help…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-lg focus:ring-2 focus:ring-emerald-200"
                        />
                    </div>
                </div>

                {/* QUICK LINKS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
                    <QuickLink icon={Mail} title="Contact Support" to="/contact-support" />
                    <QuickLink icon={FileText} title="Terms & Privacy" to="/terms-privacy" />
                    <QuickLink icon={MessageCircle} title="Community" to="/user/find-people" />
                </div>

                {/* FAQ */}
                <div className="space-y-10">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            FAQs
                        </h2>
                        <p className="text-slate-600">
                            {searchQuery ? `${totalResults} results found` : "Browse by category"}
                        </p>
                    </div>

                    {filteredFAQs.length ? (
                        filteredFAQs.map((cat) => (
                            <FAQCategory
                                key={cat.category}
                                category={cat}
                                expandedFAQ={expandedFAQ}
                                setExpandedFAQ={setExpandedFAQ}
                            />
                        ))
                    ) : (
                        <EmptyResults />
                    )}
                </div>

                {/* CTA */}
                <div className="mt-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-10 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Still stuck?</h2>
                    <p className="text-emerald-100 mb-6">
                        Our support team replies fast — no bots, just humans.
                    </p>
                    <Link
                        to="/contact-support"
                        className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50"
                    >
                        <Mail size={20} /> Contact Support
                    </Link>
                </div>

            </div>
        </div>
    );
}

/* ======================================================
   COMPONENTS
====================================================== */

function QuickLink({ icon: Icon, title, to }) {
    return (
        <Link
            to={to}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition"
        >
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Icon size={24} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900">{title}</h3>
        </Link>
    );
}

function FAQCategory({ category, expandedFAQ, setExpandedFAQ }) {
    const Icon = category.icon;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Icon size={24} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold">{category.category}</h3>
            </div>

            <div className="space-y-3">
                {category.questions.map((faq) => {
                    const open = expandedFAQ === faq.id;
                    return (
                        <div key={faq.id} className="border rounded-xl overflow-hidden">
                            <button
                                onClick={() => setExpandedFAQ(open ? null : faq.id)}
                                className="w-full p-4 flex justify-between text-left hover:bg-slate-50"
                            >
                                <span className="font-semibold">{faq.q}</span>
                                {open ? <ChevronUp /> : <ChevronDown />}
                            </button>
                            {open && (
                                <div className="p-4 bg-slate-50 border-t text-slate-700 animate-fade-in">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function EmptyResults() {
    return (
        <div className="text-center py-20 text-slate-500">
            <Search size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold">No results found</h3>
            <p>
                Try another search or{" "}
                <Link to="/contact-support" className="text-emerald-600 underline">
                    contact support
                </Link>
            </p>
        </div>
    );
}
