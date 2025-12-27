import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden gradient-hero-liquid">
      {/* Liquid Blob Elements */}
      <div 
        className="liquid-blob-organic absolute"
        style={{
          top: '10%',
          right: '15%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle at 30% 30%, #00d9ff 0%, #ff00e5 50%, #7b2ff7 100%)',
          opacity: 0.4,
          filter: 'blur(60px)'
        }}
      />
      <div 
        className="liquid-blob-organic absolute"
        style={{
          bottom: '15%',
          left: '10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle at 40% 40%, #00d9ff 0%, #a855f7 100%)',
          opacity: 0.5,
          filter: 'blur(60px)',
          animationDelay: '2s'
        }}
      />

      {/* Stars */}
      <div className="star" style={{ top: '20%', right: '30%' }} />
      <div className="star" style={{ top: '70%', left: '25%' }} />
      <div className="star" style={{ top: '40%', right: '50%' }} />

      <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-4 relative z-10">
        <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
        <p className="mb-6 text-xl text-white/80">Oops! Page not found</p>
        <a 
          href="/" 
          className="inline-block bg-transparent border-2 border-white/80 text-white hover:bg-white hover:text-purple-600 rounded-full px-8 py-3 text-sm font-medium uppercase tracking-wide transition-all duration-300"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
