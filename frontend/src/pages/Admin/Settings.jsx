import { useState, useEffect } from "react";
import {
    Settings as SettingsIcon,
    Save,
    AlertTriangle,
    CheckCircle,
    Image,
    Video,
    Shield,
    BarChart,
    Share2,
    Palette,
} from "lucide-react";
import settingsApi from "../../api/settingsApi";
import Spinner from "../../components/ui/Spinner";

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        siteName: "",
        contactEmail: "",
        maintenanceMode: false,
        allowRegistration: true,
        maxImageSizeMB: 5,
        maxVideoSizeMB: 50,
        enableComments: true,
        enableLikes: true,
        requireEmailVerification: false,
        enableAnalytics: true,
        facebookUrl: "",
        instagramUrl: "",
        twitterUrl: "",
        primaryColor: "#10b981",
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await settingsApi.getSettings();
            setFormData({
                siteName: data.siteName || "",
                contactEmail: data.contactEmail || "",
                maintenanceMode: data.maintenanceMode || false,
                allowRegistration:
                    data.allowRegistration !== undefined ? data.allowRegistration : true,
                maxImageSizeMB: data.maxImageSizeMB || 5,
                maxVideoSizeMB: data.maxVideoSizeMB || 50,
                enableComments: data.enableComments !== undefined ? data.enableComments : true,
                enableLikes: data.enableLikes !== undefined ? data.enableLikes : true,
                requireEmailVerification: data.requireEmailVerification || false,
                enableAnalytics: data.enableAnalytics !== undefined ? data.enableAnalytics : true,
                facebookUrl: data.facebookUrl || "",
                instagramUrl: data.instagramUrl || "",
                twitterUrl: data.twitterUrl || "",
                primaryColor: data.primaryColor || "#10b981",
            });
        } catch {
            setMessage({ type: "error", text: "Failed to load settings." });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({
            ...p,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await settingsApi.updateSettings(formData);
            setMessage({ type: "success", text: "Settings updated successfully!" });
        } catch {
            setMessage({ type: "error", text: "Failed to update settings." });
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <Spinner />
            </div>
        );

    return (
        <div className="p-6 md:p-8 space-y-8 min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-emerald-900 tracking-tight flex items-center gap-3">
                    <SettingsIcon className="w-8 h-8 text-emerald-600" />
                    Settings
                </h1>
                <p className="text-amber-700 font-medium">
                    Manage application preferences
                </p>
            </div>

            <div className="bg-white border border-emerald-100 rounded-3xl shadow-xl p-8 max-w-2xl">
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-medium ${message.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                    >
                        {message.type === "success" ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertTriangle className="w-5 h-5" />
                        )}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* General */}
                    <div>
                        <h3 className="text-lg font-black text-emerald-900 mb-4 border-b border-emerald-100 pb-2">
                            General
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Site Name
                                </label>
                                <input
                                    type="text"
                                    name="siteName"
                                    value={formData.siteName}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                    placeholder="PicnicHub"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Contact Email
                                </label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                    placeholder="support@picnichub.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* System Controls */}
                    <div>
                        <h3 className="text-lg font-black text-emerald-900 mb-4 border-b border-emerald-100 pb-2">
                            System Controls
                        </h3>

                        <div className="space-y-4">
                            {/* Allow Registration */}
                            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div>
                                    <div className="font-bold text-emerald-900">
                                        Allow Registration
                                    </div>
                                    <div className="text-sm text-emerald-700">
                                        Enable new users to sign up
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="allowRegistration"
                                        checked={formData.allowRegistration}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                                </label>
                            </div>

                            {/* Maintenance Mode */}
                            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                                <div>
                                    <div className="font-bold text-red-900">
                                        Maintenance Mode
                                    </div>
                                    <div className="text-sm text-red-700">
                                        Disable access for non-admin users
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="maintenanceMode"
                                        checked={formData.maintenanceMode}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Content Limits */}
                    <div>
                        <h3 className="text-lg font-black text-emerald-900 mb-4 border-b border-emerald-100 pb-2 flex items-center gap-2">
                            <Image className="w-5 h-5" />
                            Content Limits
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Max Image Size (MB)
                                </label>
                                <input
                                    type="number"
                                    name="maxImageSizeMB"
                                    min="1"
                                    max="100"
                                    value={formData.maxImageSizeMB}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Max Video Size (MB)
                                </label>
                                <input
                                    type="number"
                                    name="maxVideoSizeMB"
                                    min="1"
                                    max="500"
                                    value={formData.maxVideoSizeMB}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="text-lg font-black text-emerald-900 mb-4 border-b border-emerald-100 pb-2 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Features & Moderation
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div>
                                    <div className="font-bold text-blue-900">Enable Comments</div>
                                    <div className="text-sm text-blue-700">Allow users to comment on posts</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="enableComments"
                                        checked={formData.enableComments}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <div>
                                    <div className="font-bold text-purple-900">Enable Likes</div>
                                    <div className="text-sm text-purple-700">Allow users to like content</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="enableLikes"
                                        checked={formData.enableLikes}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <div>
                                    <div className="font-bold text-amber-900">Require Email Verification</div>
                                    <div className="text-sm text-amber-700">Users must verify email to access features</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="requireEmailVerification"
                                        checked={formData.requireEmailVerification}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-amber-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div>
                                    <div className="font-bold text-emerald-900 flex items-center gap-2">
                                        <BarChart className="w-4 h-4" />
                                        Enable Analytics
                                    </div>
                                    <div className="text-sm text-emerald-700">Track user activity and statistics</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="enableAnalytics"
                                        checked={formData.enableAnalytics}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-lg font-black text-emerald-900 mb-4 border-b border-emerald-100 pb-2 flex items-center gap-2">
                            <Share2 className="w-5 h-5" />
                            Social Media Links
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Facebook URL
                                </label>
                                <input
                                    type="url"
                                    name="facebookUrl"
                                    value={formData.facebookUrl}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                    placeholder="https://facebook.com/picnichub"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Instagram URL
                                </label>
                                <input
                                    type="url"
                                    name="instagramUrl"
                                    value={formData.instagramUrl}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                    placeholder="https://instagram.com/picnichub"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Twitter URL
                                </label>
                                <input
                                    type="url"
                                    name="twitterUrl"
                                    value={formData.twitterUrl}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                    placeholder="https://twitter.com/picnichub"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div>
                        <h3 className="text-lg font-black text-emerald-900 mb-4 border-b border-emerald-100 pb-2 flex items-center gap-2">
                            <Palette className="w-5 h-5" />
                            Appearance
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Primary Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="primaryColor"
                                        value={formData.primaryColor}
                                        onChange={handleChange}
                                        className="h-12 w-12 rounded-xl border border-slate-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.primaryColor}
                                        onChange={(e) => setFormData(p => ({ ...p, primaryColor: e.target.value }))}
                                        className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
                                        placeholder="#10b981"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:scale-[1.01] transition disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
