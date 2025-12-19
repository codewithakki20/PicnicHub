import { Users, Target, Lightbulb, Heart, Award, Rocket, BookOpen, GraduationCap } from "lucide-react";

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-4">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl flex items-center justify-center shadow-xl">
                            <Heart size={40} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4">
                        About Us
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        More than just a platform — we're a learning ecosystem built for the future
                    </p>
                </div>

                {/* Main Story */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 mb-12">
                    <div className="prose prose-lg max-w-none">
                        <p className="text-lg text-slate-700 leading-relaxed mb-6">
                            <strong className="text-emerald-600">CMD College Bilaspur</strong> and{" "}
                            <strong className="text-emerald-600">LCIT College Bilaspur</strong> are more
                            than just colleges — we're learning ecosystems built for the future.
                        </p>
                        <p className="text-lg text-slate-700 leading-relaxed mb-6">
                            Rooted in <strong>Bilaspur, Chhattisgarh</strong>, we focus on creating
                            confident, skilled, and socially responsible students who are ready for
                            real-world challenges.
                        </p>
                        <p className="text-2xl font-bold text-slate-900 mb-4">
                            No rote learning. No outdated mindset.
                        </p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            Just growth, skills, and purpose 🚀
                        </p>
                    </div>
                </div>

                {/* Our Values */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ValueCard
                            icon={Rocket}
                            title="Innovation First"
                            description="We embrace cutting-edge technology and modern teaching methodologies to prepare students for tomorrow."
                            color="emerald"
                        />
                        <ValueCard
                            icon={Target}
                            title="Skill-Based Learning"
                            description="Practical, hands-on experience that builds real-world competencies, not just theoretical knowledge."
                            color="blue"
                        />
                        <ValueCard
                            icon={Lightbulb}
                            title="Critical Thinking"
                            description="We encourage students to question, analyze, and think independently rather than memorize."
                            color="purple"
                        />
                        <ValueCard
                            icon={Users}
                            title="Social Responsibility"
                            description="Building graduates who are not just successful, but also compassionate and socially aware."
                            color="orange"
                        />
                        <ValueCard
                            icon={Award}
                            title="Excellence"
                            description="Committed to the highest standards in education, infrastructure, and student support."
                            color="red"
                        />
                        <ValueCard
                            icon={Heart}
                            title="Student-Centric"
                            description="Every decision we make puts student growth, wellbeing, and success at the center."
                            color="pink"
                        />
                    </div>
                </div>

                {/* Our Colleges */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
                        Our Institutions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <CollegeCard
                            name="CMD College Bilaspur"
                            icon={GraduationCap}
                            description="A premier institution dedicated to holistic education and character building. We combine academic excellence with practical skills development."
                            highlights={[
                                "Modern infrastructure",
                                "Experienced faculty",
                                "Industry partnerships",
                                "Placement support"
                            ]}
                        />
                        <CollegeCard
                            name="LCIT College Bilaspur"
                            icon={BookOpen}
                            description="Leading the way in technical education and innovation. We empower students with the skills and knowledge to excel in the digital age."
                            highlights={[
                                "State-of-the-art labs",
                                "Project-based learning",
                                "Tech workshops",
                                "Startup incubation"
                            ]}
                        />
                    </div>
                </div>

                {/* Our Mission */}
                <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-16">
                    <div className="text-center">
                        <Target size={48} className="mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-xl leading-relaxed max-w-3xl mx-auto text-emerald-50">
                            To create a transformative educational experience that empowers students to
                            become skilled professionals, innovative thinkers, and responsible citizens
                            who can lead and inspire change in their communities and beyond.
                        </p>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Based in Bilaspur, Chhattisgarh
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Proudly serving the educational needs of Chhattisgarh and beyond,
                            we're committed to bringing world-class education to our region.
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-12 text-center">
                    <div className="inline-block bg-slate-900 text-white rounded-2xl px-8 py-4">
                        <p className="text-lg font-semibold">
                            Ready to start your journey with us?
                        </p>
                        <p className="text-sm text-slate-300 mt-1">
                            Join CMD College or LCIT College Bilaspur today
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================= COMPONENTS ================= */

function ValueCard({ icon: Icon, title, description, color }) {
    const colorClasses = {
        emerald: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600",
        blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600",
        purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600",
        orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-600",
        red: "bg-red-100 text-red-600 group-hover:bg-red-600",
        pink: "bg-pink-100 text-pink-600 group-hover:bg-pink-600",
    };

    return (
        <div className="group bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div
                className={`w-14 h-14 ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4 transition group-hover:text-white`}
            >
                <Icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}

function CollegeCard({ name, icon: Icon, description, highlights }) {
    return (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <Icon size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{name}</h3>
            </div>

            <p className="text-slate-600 leading-relaxed mb-6">{description}</p>

            <div className="space-y-2">
                <h4 className="font-bold text-slate-900 mb-3">Key Highlights:</h4>
                {highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        <span className="text-slate-700">{highlight}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
