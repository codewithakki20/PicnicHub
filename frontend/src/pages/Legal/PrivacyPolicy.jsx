import React from "react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-200">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-slate prose-lg max-w-none">

                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to <strong>Memory Hub</strong>. Your privacy matters to us.
                        This Privacy Policy explains what information we collect, why we
                        collect it, and how we protect it when you use our platform.
                    </p>

                    <p>
                        By using Memory Hub, you agree to the practices described in this
                        policy.
                    </p>

                    <h2>2. Information We Collect</h2>
                    <p>
                        We collect information you choose to share with us, including:
                    </p>
                    <ul>
                        <li>Account details (name, email, profile photo)</li>
                        <li>Content you upload (posts, images, reels, comments)</li>
                        <li>Interactions (likes, follows, messages, notifications)</li>
                        <li>Support requests or feedback you send us</li>
                    </ul>

                    <p>
                        We may also collect basic technical data such as device type,
                        browser, and usage patterns to improve performance and security.
                    </p>

                    <h2>3. How We Use Your Information</h2>
                    <p>
                        Your data helps us:
                    </p>
                    <ul>
                        <li>Run and maintain the platform smoothly</li>
                        <li>Personalize your feed and recommendations</li>
                        <li>Send important updates and notifications</li>
                        <li>Improve features, performance, and user experience</li>
                        <li>Detect fraud, abuse, or security issues</li>
                    </ul>

                    <h2>4. Data Sharing</h2>
                    <p>
                        We <strong>do not sell</strong> your personal data.
                    </p>
                    <p>
                        Your information may only be shared:
                    </p>
                    <ul>
                        <li>With trusted services required to operate the app</li>
                        <li>If legally required by law or authorities</li>
                        <li>To protect the safety and rights of users</li>
                    </ul>

                    <h2>5. Data Security</h2>
                    <p>
                        We use industry-standard security measures to protect your data.
                        While no system is 100% secure, we continuously work to safeguard
                        your information against unauthorized access.
                    </p>

                    <h2>6. Your Rights</h2>
                    <p>
                        You have the right to:
                    </p>
                    <ul>
                        <li>Access and update your personal information</li>
                        <li>Delete your content or account</li>
                        <li>Control notification and privacy settings</li>
                    </ul>

                    <h2>7. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Any changes
                        will be reflected on this page with an updated date.
                    </p>

                    <h2>8. Contact Us</h2>
                    <p>
                        If you have questions, concerns, or feedback about this Privacy
                        Policy, reach out to us at:
                    </p>
                    <p className="font-semibold text-blue-600">
                        hello@memoryhub.com
                    </p>

                </div>
            </div>
        </div>
    );
}
