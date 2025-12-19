import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText, Shield, ChevronRight, Calendar } from "lucide-react";

export default function TermsPrivacy() {
    const [params, setParams] = useSearchParams();
    const initialTab = params.get("tab") || "terms";
    const [activeTab, setActiveTab] = useState(initialTab);

    // Sync tab → URL
    useEffect(() => {
        setParams({ tab: activeTab }, { replace: true });
    }, [activeTab, setParams]);

    return (
        <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-4">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
                        Legal Information
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Our commitment to transparency and your privacy
                    </p>
                </div>

                {/* Sticky Tabs */}
                <div className="sticky top-20 z-10 flex justify-center mb-10">
                    <div className="bg-white rounded-full border border-slate-200 p-1 flex gap-1 shadow-md">
                        <TabButton
                            active={activeTab === "terms"}
                            onClick={() => setActiveTab("terms")}
                            icon={FileText}
                            label="Terms of Service"
                        />
                        <TabButton
                            active={activeTab === "privacy"}
                            onClick={() => setActiveTab("privacy")}
                            icon={Shield}
                            label="Privacy Policy"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                    {activeTab === "terms" ? <TermsContent /> : <PrivacyContent />}
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                    <Calendar size={16} />
                    <span>Last updated: December 17, 2025</span>
                </div>
            </div>
        </div>
    );
}

/* ================= TAB BUTTON ================= */

function TabButton({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 rounded-full flex items-center gap-2 text-sm font-semibold transition
        ${active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        >
            <Icon size={18} />
            {label}
        </button>
    );
}

/* ================= TERMS CONTENT ================= */

function TermsContent() {
    return (
        <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <FileText size={32} className="text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900">
                        Terms of Service
                    </h2>
                    <p className="text-slate-600">Please read these terms carefully</p>
                </div>
            </div>

            <div className="prose prose-slate max-w-none">
                <Section title="1. Acceptance of Terms">
                    <p>
                        By accessing and using PicnicHub ("the Service"), you accept and
                        agree to be bound by the terms and provision of this agreement.
                    </p>
                </Section>

                <Section title="2. Description of Service">
                    <p>
                        PicnicHub provides users with a platform to share memories, reels,
                        and blogs about picnics and outdoor experiences.
                    </p>
                </Section>

                <Section title="3. User Accounts">
                    <p>
                        To use certain features of the Service, you must register for an
                        account. You agree to provide accurate and complete registration
                        information.
                    </p>
                </Section>

                <Section title="4. User Content">
                    <p>
                        You retain ownership of content you post. By posting content, you
                        grant us a license to use, display, and distribute it on the
                        Service.
                    </p>
                </Section>
            </div>
        </div>
    );
}

/* ================= PRIVACY CONTENT ================= */

function PrivacyContent() {
    return (
        <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Shield size={32} className="text-blue-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900">
                        Privacy Policy
                    </h2>
                    <p className="text-slate-600">How we protect your information</p>
                </div>
            </div>

            <div className="prose prose-slate max-w-none">
                <Section title="1. Information We Collect">
                    <p>
                        We collect information you provide directly to us (e.g., account
                        details, content) and usage data (e.g., interactions, log data).
                    </p>
                </Section>

                <Section title="2. How We Use Your Information">
                    <p>
                        We use details to operate the Service, personalize your experience,
                        and communicate updates or security alerts.
                    </p>
                </Section>

                <Section title="3. Information Sharing">
                    <p>
                        We do not sell your personal data. We share info only with service
                        providers, for legal compliance, or with your consent.
                    </p>
                </Section>
            </div>
        </div>
    );
}

/* ================= SECTION COMPONENT ================= */

function Section({ title, children }) {
    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ChevronRight size={20} className="text-emerald-600" />
                {title}
            </h3>
            <div className="text-slate-700 leading-relaxed space-y-3">{children}</div>
        </div>
    );
}
