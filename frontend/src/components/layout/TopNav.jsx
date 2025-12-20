import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusSquare, Bell, History, Image as ImageIcon, Film } from "lucide-react";

export default function TopNav() {
    const navigate = useNavigate();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <>
            {/* CREATE DRAWER */}
            {isCreateOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-200"
                    onClick={() => setIsCreateOpen(false)}
                >
                    <div
                        className="w-full bg-white dark:bg-slate-900 rounded-t-3xl p-6 pb-8 space-y-4 animate-in slide-in-from-bottom duration-300 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center mb-2" onClick={() => setIsCreateOpen(false)}>
                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        </div>

                        <h3 className="text-center font-bold text-lg text-slate-900 dark:text-white mb-6">Create New</h3>

                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => {
                                    setIsCreateOpen(false);
                                    navigate("/create-story");
                                }}
                                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95"
                            >
                                <div className="p-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full shadow-lg">
                                    <History size={24} />
                                </div>
                                <span className="font-medium text-sm text-slate-700 dark:text-slate-300">Story</span>
                            </button>

                            <button
                                onClick={() => {
                                    setIsCreateOpen(false);
                                    navigate("/user/upload-memory");
                                }}
                                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95"
                            >
                                <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-full shadow-lg">
                                    <ImageIcon size={24} />
                                </div>
                                <span className="font-medium text-sm text-slate-700 dark:text-slate-300">Memory</span>
                            </button>

                            <button
                                onClick={() => {
                                    setIsCreateOpen(false);
                                    navigate("/user/upload-reel");
                                }}
                                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95"
                            >
                                <div className="p-4 bg-gradient-to-br from-violet-500 to-indigo-500 text-white rounded-full shadow-lg">
                                    <Film size={24} />
                                </div>
                                <span className="font-medium text-sm text-slate-700 dark:text-slate-300">Reel</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Top Header */}
            <div className="md:hidden sticky top-0 bg-white z-40 px-4 py-3 border-b border-slate-100 flex justify-between items-center shadow-sm">
                <span className="font-bold text-xl text-[#2e7d32] tracking-tight">PicnicHub</span>
                <div className="flex gap-4 text-slate-900 items-center">
                    <button onClick={() => setIsCreateOpen(true)}>
                        <PlusSquare size={26} />
                    </button>
                    <button onClick={() => navigate("/notifications")}>
                        <Bell size={26} />
                    </button>
                </div>
            </div>
        </>
    );
}
