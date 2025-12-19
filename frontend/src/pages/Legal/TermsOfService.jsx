import React from "react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-200">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
                        Terms of Service
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-slate prose-lg max-w-none">

                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using <strong>Memory Hub</strong>, you agree to be
                        bound by these Terms of Service. If you do not agree with any part
                        of these terms, please stop using the platform.
                    </p>

                    <h2>2. Eligibility</h2>
                    <p>
                        You must be at least 13 years old to use Memory Hub. By using the
                        platform, you confirm that you meet this requirement and have the
                        legal capacity to agree to these terms.
                    </p>

                    <h2>3. Your Account</h2>
                    <p>
                        You are responsible for maintaining the security of your account
                        and for all activity that occurs under it. Please keep your login
                        credentials safe and notify us immediately of any unauthorized use.
                    </p>

                    <h2>4. User Content</h2>
                    <p>
                        You own the content you post on Memory Hub, including photos,
                        videos, and text.
                    </p>
                    <p>
                        By uploading content, you grant us a limited, non-exclusive license
                        to host, display, and optimize it solely for operating and improving
                        the platform.
                    </p>

                    <h2>5. Prohibited Conduct</h2>
                    <p>
                        To keep Memory Hub safe and respectful, you agree not to:
                    </p>
                    <ul>
                        <li>Post harmful, abusive, hateful, or illegal content</li>
                        <li>Harass, threaten, or impersonate others</li>
                        <li>Violate copyright or intellectual property rights</li>
                        <li>Attempt to hack, disrupt, or misuse the platform</li>
                        <li>Use the platform for spam or malicious activities</li>
                    </ul>

                    <h2>6. Account Suspension & Termination</h2>
                    <p>
                        We reserve the right to suspend or terminate accounts that violate
                        these terms or harm the community. This may happen with or without
                        prior notice, depending on the severity of the violation.
                    </p>

                    <h2>7. Platform Availability</h2>
                    <p>
                        We strive to keep Memory Hub running smoothly, but we do not
                        guarantee uninterrupted access. Features may change, pause, or
                        evolve as we continue improving the platform.
                    </p>

                    <h2>8. Limitation of Liability</h2>
                    <p>
                        Memory Hub is provided “as is.” We are not liable for any indirect,
                        incidental, or consequential damages arising from your use of the
                        platform.
                    </p>

                    <h2>9. Changes to These Terms</h2>
                    <p>
                        We may update these Terms of Service from time to time. Continued
                        use of the platform after updates means you accept the revised
                        terms.
                    </p>

                    <h2>10. Contact Us</h2>
                    <p>
                        If you have questions or concerns about these Terms, contact us at:
                    </p>
                    <p className="font-semibold text-blue-600">
                        support@memoryhub.com
                    </p>

                </div>
            </div>
        </div>
    );
}
