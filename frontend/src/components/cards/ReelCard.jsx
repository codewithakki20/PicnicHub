import { useRef, useState } from "react";
import { Play, Heart, MessageCircle } from "lucide-react";
import getPublicUrl from "../../utils/getPublicUrl";

/*
  ReelCard
  - Used in grids, spotlight sections
  - Hover preview on desktop
  - Click navigates to reel page
*/

export default function ReelCard({ reel, onClick }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const videoSrc = getPublicUrl(reel?.videoUrl || reel?.video);
  const poster = getPublicUrl(reel?.thumbnail || reel?.cover);

  const handleEnter = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => { });
    }
  };

  const handleLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer bg-slate-900 dark:bg-black group shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* ================= MEDIA ================= */}
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? "scale-105" : "scale-100"
            }`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white bg-slate-900 dark:bg-slate-950">
          <Play size={40} />
        </div>
      )}

      {/* ================= GRADIENT ================= */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

      {/* ================= CENTER PLAY ================= */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-full opacity-0 group-hover:opacity-100 transition duration-300">
          <Play size={36} className="text-white fill-white" />
        </div>
      </div>

      {/* ================= TOP BADGE ================= */}
      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
        Reel
      </div>

      {/* ================= BOTTOM INFO ================= */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {/* Caption */}
        {reel.caption && (
          <p className="text-sm font-semibold line-clamp-2 drop-shadow mb-2">
            {reel.caption}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-3">
            {reel.views !== undefined && (
              <div className="flex items-center gap-1">
                <Play size={12} fill="white" />
                <span>{reel.views}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart size={12} fill="white" />
              <span>{reel.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={12} fill="white" />
              <span>{reel.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
