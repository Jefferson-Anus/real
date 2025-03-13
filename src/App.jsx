import React, { useMemo } from "react";

import Sidebar from "./components/Sidebar";
import {Route, Routes, useNavigate} from 'react-router-dom';
import {Mindmap, WebWorkPage} from "./pages";
const colors = {
    background: "#13131A",
    sunsetGold: "#FFB81C",
    solarFlare: "#FF5A36",
    daylightBlue: "#3C9DC6",
    solarWhite: "#F8F8F8",
    astroGray: "#5A5A5A",
    lunarBlack: "#1A1A1A"
  };
const StarryBackground = () => {
  // Generate random stars
  const stars = useMemo(() => {
    const starCount = 300; // Number of stars
    const result = [];
    
    for (let i = 0; i < starCount; i++) {
      // Random position
      const x = Math.random() * 100; // % position
      const y = Math.random() * 100; // % position
      
      // Random size (mostly small)
      const size = Math.random() * 0.25 + 0.05; // 0.05 to 0.3 viewport width %
      
      // Random opacity (for twinkling effect)
      const opacity = Math.random() * 0.7 + 0.3; // 0.3 to 1.0
      
      result.push({ x, y, size, opacity });
    }
    
    return result;
  }, []);
  
  return (
    <div className="fixed inset-0 w-full h-full" style={{ backgroundColor: colors.background, zIndex: -10 }}>
      {stars.map((star, index) => (
        <div 
          key={index}
          className="absolute rounded-full"
          style={{
            backgroundColor: colors.solarWhite,
            width: `${star.size}vh`,
            height: `${star.size}vh`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 3}px ${star.size}px rgba(255, 255, 255, 0.8)`,
            animation: `twinkle ${Math.random() * 5 + 3}s ease-in-out infinite alternate`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: ${Math.random() * 0.3 + 0.3}; }
          100% { opacity: ${Math.random() * 0.3 + 0.7}; }
        }
      `}</style>
    </div>
  );
};

const App = () => {
    return(
        <div className="relative flex min-h-screen flex-row p-4">
            <StarryBackground/>
            <div className="relative mr-10 hidden sm:flex">
                <Sidebar/>

            </div>

            <div className = "mx-auto max-w-[1280px] flex-1 max-sm:w-full sm:pr-5">
                {/*navbar*/}


                <Routes>
                <Route path="/" element={<div>Home page</div>}/>
                <Route path="/Mindmap" element={<Mindmap />} />
                <Route path="/table" element={<WebWorkPage />} /> {/* Updated route */}
            

                </Routes>
            </div>

        </div>
    )
}

export default App;