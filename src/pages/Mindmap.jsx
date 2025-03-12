import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";



import { dead_planet, dead_planet3, dead_planet2, sunny } from "../assets";

// Color scheme
const colors = {
  background: "#13131A",
  sunsetGold: "#FFB81C",
  solarFlare: "#FF5A36",
  daylightBlue: "#3C9DC6",
  solarWhite: "#F8F8F8",
  astroGray: "#5A5A5A",
  lunarBlack: "#1A1A1A"
};

// Planet data
const mindMapData = {
  id: "root",
  label: "Solar System",
  children: [
    { id: "mercury", label: "Mercury", image: dead_planet, info: "A hot, rocky planet.", status: "new" },
    { id: "venus", label: "Venus", image: dead_planet3, info: "A planet with a thick, toxic atmosphere.", status: "chosen" },
    { id: "earth", label: "Earth", image: dead_planet2, info: "The only known planet with life.", status: "completed" },
    { id: "mars", label: "Mars", image: dead_planet2, info: "A red planet with potential for life.", status: "new" },
    { id: "jupiter", label: "Jupiter", image: dead_planet, info: "The largest planet in the Solar System.", status: "new" },
    { id: "saturn", label: "Saturn", image: dead_planet, info: "Famous for its stunning rings.", status: "chosen" },
    { id: "uranus", label: "Uranus", image: dead_planet2, info: "A tilted ice giant.", status: "completed" },
    { id: "neptune", label: "Neptune", image: dead_planet, info: "A deep blue, stormy planet.", status: "new" },
    { id: "myanus", label: "My anus", image: dead_planet3, info: "A celestial joke.", status: "new" },
  ],
};

const MindMapNode = ({ node, isRoot = false, onSelect }) => {
  const childCount = node.children?.length || 0;
  const nodesPerRing = 4;

  const getChildPosition = (index) => {
    const ringIndex = Math.floor(index / nodesPerRing);
    const positionInRing = index % nodesPerRing;
    const baseRadius = 175 + ringIndex * 175;
    const isOddRing = ringIndex % 2 === 1;
    const baseAngle = isOddRing ? Math.PI / 4 : 0;
    const angleStep = (2 * Math.PI) / nodesPerRing;
    const angle = baseAngle + positionInRing * angleStep;
    const x = Math.cos(angle) * baseRadius;
    const y = Math.sin(angle) * baseRadius;
    return { x, y };
  };

  const childPositions = useMemo(() => {
    return node.children?.map((_, index) => getChildPosition(index)) || [];
  }, [node.children?.length]);

  return (
    <div className="relative">
      <div 
        className="flex items-center justify-center rounded-full shadow-lg text-center z-10"
        style={{ 
          
          backgroundColor: colors.sunsetGold,
          color: colors.lunarBlack,
          width: "8rem",
          height: "8rem",
          boxShadow: `0 0 40px 15px ${colors.sunsetGold}90`
        }}
        
      >
  
        
        <span className="px-2 font-semibold">{node.label}</span>
      </div>

      {node.children?.length > 0 && (
        <>
          <svg 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: '800px', height: '800px', overflow: 'visible', zIndex: 0 }}
          >
            {childPositions.map((pos, index) => (
              <circle 
                key={`ring-${index}`}
                cx="400" 
                cy="400" 
                r={175 + Math.floor(index / nodesPerRing) * 175} 
                stroke={colors.astroGray} 
                strokeWidth="2" 
                fill="none" 
                opacity="0.7"
              />
            ))}
          </svg>

          {node.children.map((child, index) => {
            const position = childPositions[index];
            return (
              <div 
                key={child.id} 
                className="absolute top-1/2 left-1/2 z-10 cursor-pointer"
                style={{ transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)` }}
                onClick={(e) => onSelect(child, position)}
              >
                <div className="relative">
                <motion.div
                  className="flex items-center justify-center rounded-full overflow-visible"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 40 + index * 7,
                    ease: "linear",
                    repeat: Infinity
                  }}
                >
                  <div 
                    className="flex items-center justify-center rounded-full" 
                    style={{ 
                      width: "6rem", 
                      height: "6rem", 
                      boxShadow: `0 0 10px 5px ${child.status === "chosen" ? colors.sunsetGold : child.status === "completed" ? "green" : colors.daylightBlue}`
                    }}
                  >
                    <img src={child.image} className="w-full h-full object-cover" />
                  </div>
                </motion.div>
                    <div 
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
                      style={{ color: colors.solarWhite, width: "100px" }}
                    >
                      <span className="text-sm font-medium">{child.label}</span>
                    </div>

              
                    
                  
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

const SolarSystemMindMap = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });


  
 

  const handleSelectPlanet = (planet, position) => {
    setSelectedPlanet(planet);
    setPanelPosition({ top: `calc(50% + ${position.y}px)`, left: `calc(50% + ${position.x + 100}px)` });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      <h1 className="text-3xl font-bold mb-12 z-10" style={{ color: colors.solarWhite }}></h1>
  
      <div className="relative z-10" style={{ width: '800px', height: '800px' }}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <MindMapNode node={mindMapData} isRoot={true} onSelect={handleSelectPlanet} />
        </div>
      </div>
  
      {selectedPlanet && selectedPlanet.status === "chosen" && (
        <div className="fixed inset-0 flex items-center justify-center z-20" style={{ transform: 'translateX(40px)' }}
        onClick={() => setSelectedPlanet(null)} // Click outside to close
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-opacity-90 p-10 rounded-lg shadow-lg text-green-400 
                      w-[60%] max-w-3xl border-4 border-green-500 font-mono"
            style={{ backgroundColor: colors.lunarBlack }}
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
            
          >
            {/* Terminal Header */}
            <h2 className="text-4xl font-bold mb-6 text-center border-b border-green-500 pb-4">
              {selectedPlanet.label}
            </h2>
  
            {/* Dropdown (Alert) */}
            <div className="mb-6">
              <label htmlFor="alert-dropdown" className="block text-lg font-semibold text-green-300">
                Alert:
              </label>
              <select id="alert-dropdown" className="mt-2 p-2 text-green-400 border border-green-500 rounded"
                style={{ backgroundColor: colors.lunarBlack }}>
                <option value="none">None</option>
                <option value="discord">Discord</option>
              </select>
            </div>
  
            {/* Single Terminal Panel */}
            <div className="border border-green-400 p-6 rounded mb-4">{selectedPlanet.info}</div>
  
            {/* Chatbox */}
            <div className="border-t border-green-500 pt-4">
              <div className="mb-4">
                <label htmlFor="chatbox" className="block text-lg font-semibold text-green-300">
                  Input:
                </label>
                <textarea
                  id="chatbox"
                  rows="4"
                  className="w-full p-4 text-green-400 border border-green-500 rounded mt-2"
                  style={{ backgroundColor: colors.lunarBlack }}
                  placeholder="Send a message..."
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
  
      {selectedPlanet && selectedPlanet.status === "new" && (
        <div className="fixed inset-0 flex items-center justify-center z-20" style={{ transform: 'translateX(40px)' }}
        onClick={() => setSelectedPlanet(null)} // Click outside to close
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-opacity-90 p-10 rounded-lg shadow-lg text-yellow-400 
                      w-[50%] max-w-2xl border-4 border-yellow-500 font-mono"
            style={{ backgroundColor: colors.lunarBlack }}
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
            
          >
            {/* Terminal Header */}
            <h2 className="text-4xl font-bold mb-6 text-center border-b border-yellow-500 pb-4">
              {selectedPlanet.label}
            </h2>
  
            {/* Single Terminal Panel */}
            <div className="border border-yellow-400 p-6 rounded mb-4">
              <p className="text-yellow-300 text-center">{selectedPlanet.info}</p>
            </div>
  
            {/* Accept Button */}
            <div className="flex justify-center">
              <button
                className="px-6 py-3 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-600 transition"
                onClick={() => handleAcceptMission(selectedPlanet.id)}
              >
                Accept
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
  
};

export default SolarSystemMindMap;
