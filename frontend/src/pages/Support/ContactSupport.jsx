import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import supportApi from "../../api/supportApi";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";

/* ======================================================
   CONTACT SUPPORT
====================================================== */

export default function ContactSupport() {
    const { user } = useAuthContext();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    /* ================= PREFILL USER ================= */

    useEffect(() => {
        if (user) {
            setFormData((p) => ({
                ...p,
                name: user.name || "",
                email: user.email || "",
            }));
        }
    }, [user]);

    /* ================= HANDLERS ================= */

    const handleChange = (field, value) => {
        setFormData((p) => ({ ...p, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim(),
            message: formData.message.trim(),
        };

        if (!payload.message || !payload.subject) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            await supportApi.contactSupport(payload);
            toast.success("Message sent! Our team will get back to you 💙");

            setFormData((p) => ({
                ...p,
                subject: "",
                message: "",
            }));
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* HEADER */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                    Contact Support
                </h1>
                <p className="text-lg text-slate-600">
                    Got a question or stuck somewhere? We got you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* CONTACT INFO */}
                <div className="space-y-8">
                    <div className="bg-blue-50 p-8 rounded-3xl">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">
                            Get in Touch
                        </h3>

                        <InfoRow icon={Mail} title="Email Us">
                            hello@memoryhub.com <br />
                            support@memoryhub.com
                        </InfoRow>

                        <InfoRow icon={Phone} title="Call Us">
                            +1 (234) 567-890
                            <p className="text-sm text-slate-500">Mon–Fri · 8am–5pm</p>
                        </InfoRow>

                        <InfoRow icon={MapPin} title="Visit Us">
                            123 Adventure Lane <br />
                            Nature City, Earth 404
                        </InfoRow>
                    </div>
                </div>

                {/* FORM */}
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="Your name"
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="you@email.com"
                            />
                        </div>

                        <Input
                            label="Subject"
                            value={formData.subject}
                            onChange={(e) => handleChange("subject", e.target.value)}
                            placeholder="How can we help?"
                        />

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Message
                            </label>
                            <textarea
                                rows={4}
                                required
                                value={formData.message}
                                onChange={(e) => handleChange("message", e.target.value)}
                                placeholder="Tell us a bit more…"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-200 resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                text-white font-bold rounded-xl shadow-lg shadow-blue-600/30
                transition flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending…
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

/* ======================================================
   SMALL COMPONENTS
====================================================== */

function InfoRow({ icon: Icon, title, children }) {
    return (
        <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h4 className="font-bold text-slate-900">{title}</h4>
                <p className="text-slate-600">{children}</p>
            </div>
        </div>
    );
}

function Input({ label, type = "text", ...props }) {
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
                {label}
            </label>
            <input
                type={type}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-200"
                {...props}
            />
        </div>
    );
}
