import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Check, X, ArrowLeft } from "lucide-react";
import userApi from "../../api/userApi";

/* ======================================================
   CHANGE PASSWORD
====================================================== */

export default function ChangePassword() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [show, setShow] = useState({
        current: false,
        next: false,
        confirm: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    /* ================= VALIDATION ================= */

    const rules = {
        length: formData.newPassword.length >= 8,
        upper: /[A-Z]/.test(formData.newPassword),
        lower: /[a-z]/.test(formData.newPassword),
        number: /\d/.test(formData.newPassword),
        match:
            formData.newPassword &&
            formData.confirmPassword &&
            formData.newPassword === formData.confirmPassword,
    };

    const passwordValid = Object.values(rules).every(Boolean);

    /* ================= HANDLERS ================= */

    const updateField = (e) => {
        setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
        setError("");
    };

    const toggle = (key) => setShow((p) => ({ ...p, [key]: !p[key] }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!formData.currentPassword) {
            setError("Enter your current password");
            return;
        }

        if (!passwordValid) {
            setError("Password does not meet requirements");
            return;
        }

        try {
            setLoading(true);
            await userApi.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            setSuccess(true);
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });

            setTimeout(() => navigate("/user/settings"), 1800);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Current password is incorrect"
            );
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
            <div className="max-w-2xl mx-auto px-4">

                {/* BACK */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                        <Lock size={28} className="text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900">
                            Change Password
                        </h1>
                        <p className="text-slate-600">
                            Keep your account locked down 🔐
                        </p>
                    </div>
                </div>

                {/* ALERTS */}
                {success && (
                    <Alert
                        type="success"
                        title="Password updated"
                        text="Redirecting to settings…"
                    />
                )}

                {error && (
                    <Alert
                        type="error"
                        title="Something went wrong"
                        text={error}
                    />
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    <PasswordField
                        label="Current Password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        show={show.current}
                        onToggle={() => toggle("current")}
                        onChange={updateField}
                    />

                    <PasswordField
                        label="New Password"
                        name="newPassword"
                        value={formData.newPassword}
                        show={show.next}
                        onToggle={() => toggle("next")}
                        onChange={updateField}
                    >
                        <Requirements rules={rules} />
                    </PasswordField>

                    <PasswordField
                        label="Confirm New Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        show={show.confirm}
                        onToggle={() => toggle("confirm")}
                        onChange={updateField}
                    >
                        {formData.confirmPassword && (
                            <Requirement met={rules.match} text="Passwords match" />
                        )}
                    </PasswordField>

                    <button
                        type="submit"
                        disabled={loading || !passwordValid || !formData.currentPassword}
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                        {loading ? "Updating…" : "Update Password"}
                    </button>
                </form>

            </div>
        </div>
    );
}

/* ======================================================
   SUB COMPONENTS
====================================================== */

function PasswordField({ label, name, value, show, onToggle, onChange, children }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow border">
            <label className="font-bold text-slate-900 mb-3 block">{label}</label>
            <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border rounded-xl"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {children}
        </div>
    );
}

function Requirements({ rules }) {
    return (
        <div className="mt-4 space-y-2">
            <Requirement met={rules.length} text="At least 8 characters" />
            <Requirement met={rules.upper} text="One uppercase letter" />
            <Requirement met={rules.lower} text="One lowercase letter" />
            <Requirement met={rules.number} text="One number" />
        </div>
    );
}

function Requirement({ met, text }) {
    return (
        <div className={`flex items-center gap-2 text-sm ${met ? "text-emerald-600" : "text-slate-400"}`}>
            {met ? <Check size={14} /> : <X size={14} />}
            {text}
        </div>
    );
}

function Alert({ type, title, text }) {
    const styles =
        type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-rose-50 border-rose-200 text-rose-800";

    return (
        <div className={`rounded-2xl p-4 mb-6 border ${styles}`}>
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm">{text}</p>
        </div>
    );
}
