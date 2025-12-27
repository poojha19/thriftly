import React from 'react';

/**
 * LiquidBackground Component
 * Fixed version using your original color palette.
 */
const LiquidBackground = () => {
  return (
    <>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes shimmer {
          0% { opacity: 0.3; transform: translateX(-10%); }
          50% { opacity: 0.5; transform: translateX(10%); }
          100% { opacity: 0.3; transform: translateX(-10%); }
        }
        .animate-blob {
          animation: blob 7s infinite alternate ease-in-out;
        }
        .animate-blob-slow {
          animation: blob 12s infinite alternate ease-in-out;
        }
        .animate-shimmer {
          animation: shimmer 10s infinite alternate linear;
        }
        /* Defining your aurora background to ensure it's not empty */
        .bg-aurora {
          background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
          background-image: radial-gradient(at 0% 0%, rgba(243, 232, 255, 0.5) 0, transparent 50%), 
                            radial-gradient(at 50% 0%, rgba(255, 241, 242, 0.5) 0, transparent 50%), 
                            radial-gradient(at 100% 0%, rgba(237, 233, 254, 0.5) 0, transparent 50%);
        }
      `}</style>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none w-full h-full min-h-screen">
        {/* Base aurora gradient */}
        <div className="absolute inset-0 w-full h-full bg-aurora" />
        
        {/* Animated liquid blobs using your original colors */}
        <div
          className="absolute liquid-blob w-[600px] h-[600px] rounded-full blur-3xl bg-gradient-to-br from-purple-300/40 to-pink-300/40 -top-32 -left-32 animate-blob"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute liquid-blob w-[500px] h-[500px] rounded-full blur-3xl bg-gradient-to-br from-pink-300/30 to-purple-400/30 top-1/4 -right-20 animate-blob-slow"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute liquid-blob w-[400px] h-[400px] rounded-full blur-3xl bg-gradient-to-br from-violet-300/35 to-fuchsia-300/35 bottom-0 left-1/4 animate-blob"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute liquid-blob w-[350px] h-[350px] rounded-full blur-3xl bg-gradient-to-br from-fuchsia-200/30 to-purple-300/30 top-1/2 left-1/2 animate-blob-slow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute liquid-blob w-[450px] h-[450px] rounded-full blur-3xl bg-gradient-to-br from-pink-200/25 to-violet-300/25 -bottom-20 -right-20 animate-blob"
          style={{ animationDelay: "3s" }}
        />
        
        {/* Subtle shimmer overlay */}
        <div className="absolute inset-0 w-full h-full animate-shimmer opacity-30 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Soft vignette using a neutral light fade */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-white/50" />
      </div>
    </>
  );
};

export default LiquidBackground;