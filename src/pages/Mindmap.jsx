import React, { useState, useMemo, useEffect } from "react";
import { color, motion } from "framer-motion";
import {Typewriter} from "react-simple-typewriter";
import {GoogleGenerativeAI} from "@google/generative-ai";
import emailjs from "@emailjs/browser";
import { dead_planet, dead_planet3, dead_planet2, sunny, rei, usericon } from "../assets";

const EMAIL_SERVICE_ID = "service_453mbog"; 
const EMAIL_TEMPLATE_ID = "template_pgv128f"; 
const EMAIL_PUBLIC_KEY = "BrLIGVtq4f2f_eb0-";
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
const genAI = new GoogleGenerativeAI("AIzaSyAShHKdWlGWeUqva5MBzHA-avwJb95YgM4");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
// Planet data



const MindMapNode = ({ node, isRoot = false, onSelect }) => {
  const childCount = node.children?.length || 0;
  const nodesPerRing = 4;

  const getChildPosition = (index) => {
    const ringIndex = Math.floor(index / nodesPerRing); // Find the ring of the planet
    const positionInRing = index % nodesPerRing; // Find the position in the ring
    const rx = 190 + ringIndex * 270; // Horizontal radius (rx)
    const ry = 160 + ringIndex * 100; // Vertical radius (ry)
    const isOddRing = ringIndex % 2 === 1; // Check if the ring index is odd
    const baseAngle = isOddRing ? Math.PI / 4 : 0; // Adjust starting angle for odd rings
    const angleStep = (2 * Math.PI) / nodesPerRing; // Calculate the angle step between planets in the ring
    const angle = baseAngle + positionInRing * angleStep; // Calculate the angle for the current planet
  
    // Adjust the x and y positions based on the elliptical radii
    const x = Math.cos(angle) * rx; // Apply the horizontal radius
    const y = Math.sin(angle) * ry; // Apply the vertical radius
  
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
              <ellipse 
                key={`ring-${index}`}
                cx="400" // Center x coordinate
                cy="400" // Center y coordinate
                rx={190 + Math.floor(index / nodesPerRing) * 270} // Horizontal radius
                ry={160 + Math.floor(index / nodesPerRing) * 100} // Vertical radius (can be smaller or larger)
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
                {(child.status === "chosen" || child.status === "completed") && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none">
                    {/* Show Profile Pictures side by side ONLY if they exist */}
                    {child.assignedTo.length > 0 && (
                      <div className="flex">
                        {child.assignedTo.map((emp, index) => (
                          emp.profilePicture && (
                            <div 
                              key={index} 
                              className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 border-2" 
                              style={{ borderColor: colors.lunarBlack }}
                            >
                              <img src={emp.profilePicture} alt="User" className="w-full h-full object-cover" />
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {/* Show Username Always */}
                    <span className="text-xs font-medium mt-1 px-2 py-1 rounded-lg bg-opacity-50" style={{ backgroundColor: colors.lunarBlack }}>{child.assignedTo.map(emp => emp.name).join(", ")}</span>
                  </div>
                )}
                <div 
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
                  style={{ color: colors.solarWhite, width: "300px" }}
                >
                  <span className="text-sm font-medium">
                    <Typewriter
                      words={[child.label]} // Typing out the label
                      typeSpeed={50} // Speed of typing
                      
                    />
                  </span>
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
  const [displayedInfo, setDisplayedInfo] = useState(""); // State for terminal content
  const [userInput, setUserInput] = useState(""); // State for textarea input
  const [emailContent, setEmailContent] = useState("");
  const [emailPrompt, setEmailPrompt] = useState("");
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const employees = {
    rei: { 
      name: "Rei", 
      profilePicture: rei,
      email: "ruslisherm.an@gmail.com" // Hardcoded dot inserted after "rusli"
    },
    bob: { 
      name: "Bob", 
      profilePicture: usericon,
      email: "ruslisherman@gmail.com" // Hardcoded dot inserted after "rusli"
    },
    charlie: { 
      name: "Charlie", 
      profilePicture: usericon,
      email: "ruslis.herman@gmail.com" // Hardcoded dot inserted after "rusli"
    },
    dave: { 
      name: "Dave", 
      profilePicture: usericon,
      email: "r.uslisherman@gmail.com" // Hardcoded dot inserted after "rusli"
    }
  };
  
  
  const [mindMapData, setMindmapData] = useState({
    id: "root",
    label: "Paper on Astrology",
    children: [
      { 
        id: "1", 
        label: "Introduction to Astrology", 
        image: dead_planet, 
        info: "Research the history, origins, and cultural significance of astrology. Then, create a paragraph outlining its importance in various civilizations.", 
        status: "new", 
        assignedTo: [employees.dave]
      },
      { 
        id: "2", 
        label: "Zodiac Signs & Elements", 
        image: dead_planet3, 
        info: "Define the 12 zodiac signs and their ruling elements. Write a paragraph on the personality traits associated with each element (fire, earth, air, water).", 
        status: "chosen", 
        assignedTo: [employees.rei, employees.bob]
      },
      { 
        id: "3", 
        label: "Planets & Their Influence", 
        image: dead_planet2, 
        info: "Explain how each planet influences various aspects of life. Write a section on Mercury (communication) and Venus (love) with examples.", 
        status: "completed", 
        assignedTo: [employees.rei, employees.bob]
      },
      { 
        id: "4", 
        label: "Astrological Houses & Charts", 
        image: dead_planet2, 
        info: "Research the 12 astrological houses and how they shape a person’s destiny. Write a detailed explanation of how birth charts influence personality and events.", 
        status: "new", 
        assignedTo: [employees.bob] 
      },
      { 
        id: "5", 
        label: "Aspects & Planetary Alignments", 
        image: dead_planet, 
        info: "Explain aspects like conjunctions and oppositions. Write a section detailing how planetary alignments impact astrological readings and predictions.", 
        status: "new", 
        assignedTo: [employees.rei]
      },
      { 
        id: "6", 
        label: "Astrology in Daily Life", 
        image: dead_planet, 
        info: "Examine how astrology affects daily decisions. Create a paragraph explaining how horoscopes and compatibility readings influence people’s choices.", 
        status: "chosen", 
        assignedTo: [employees.bob]
      },
      { 
        id: "7", 
        label: "Astrology & Psychology", 
        image: dead_planet2, 
        info: "Research how astrology relates to psychological theories and personality types. Write about the connection between astrology and Jungian archetypes.", 
        status: "completed", 
        assignedTo: [employees.charlie]
      },
      { 
        id: "8", 
        label: "Scientific Debate & Skepticism", 
        image: dead_planet, 
        info: "Investigate scientific skepticism regarding astrology. Write a section on the arguments for and against astrology’s validity in modern science.", 
        status: "new", 
        assignedTo: [employees.dave]
      },
      { 
        id: "9", 
        label: "Astrology’s Future & Technology", 
        image: dead_planet3, 
        info: "Explore how AI and data science are influencing astrology today. Write about the role of modern apps and technology in the future of astrology.", 
        status: "new", 
        assignedTo: [employees.rei]
      },
      { 
        id: "10", 
        label: "Astrology’s AI Future & Technology", 
        image: dead_planet3, 
        info: "Explore how AI and data science are influencing astrology today. Write about the role of modern apps and technology in the future of astrology.", 
        status: "new", 
        assignedTo: [employees.bob]
      }
    ]
  });
  
  
  
  const completedTasksCount = mindMapData.children.filter(child => child.status === 'completed').length;
  const chosenTasksCount = mindMapData.children.filter(child => child.status === 'chosen').length;
  const totalTasksCount = mindMapData.children.length;

  const handleTextChange = (event) => {
    setUserInput(event.target.value); // Update state with user input
  };
  const handleAcceptMission = (planetId) => {
    // Create a new object with updated children
    const updatedMindmapData = {
      ...mindMapData,
      children: mindMapData.children.map((planet) => {
        if (planet.id === planetId) {
          return { ...planet, status: "chosen" };
        }
        return planet;
      })
    };
    
    setMindmapData(updatedMindmapData);
    const chosenTasksCount = updatedMindmapData.children.filter(child => child.status === 'chosen').length;
    setTotalChosen(chosenTasksCount + "/" + totalTasksCount)
    setSelectedPlanet(null);
  };

  useEffect(() => {
    if (selectedPlanet) {
      setDisplayedInfo(selectedPlanet.info); // Reset to default info when a new planet is selected
    }
  }, [selectedPlanet]); // Runs whenever selectedPlanet changes
  
 
  
  const handleClosePanel = () => {
    setDisplayedInfo(selectedPlanet?.info || "");
    setSelectedPlanet(null);
    
    // Reset all email-related states
    setShowPromptEditor(false);
    setEmailContent("");
    setEmailPrompt("");
    
    // Reset any dropdown selection
    const alertDropdown = document.getElementById("alert-dropdown");
    if (alertDropdown) {
      alertDropdown.value = "none";
    }
  };

  
 

  const handleSelectPlanet = (planet, position) => {
    setSelectedPlanet(planet);
    setPanelPosition({ top: `calc(50% + ${position.y}px)`, left: `calc(50% + ${position.x + 100}px)` });
  };

  const [totalCompleted, setTotalCompleted] = useState(completedTasksCount + "/" + totalTasksCount);
  const [totalChosen, setTotalChosen] = useState(chosenTasksCount + "/" + totalTasksCount);
  useEffect(() => {
    // Initialize EmailJS
    emailjs.init(EMAIL_PUBLIC_KEY);
  }, []);

  const [searchResults, setSearchResults] = useState([]);
  const [emailPreview, setEmailPreview] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  // Modified function to handle generating email content using custom prompt
  const handleGenerateEmailContent = async (planet, customPrompt) => {
    
    try {
      // Use the custom prompt provided by the user
      const result = await model.generateContent(customPrompt + " + no matter what I said before make sure to not use any bolded characters");
      const generatedContent = result.response.text();
      
      // Set the email content
      setEmailContent(generatedContent);
      setShowPromptEditor(false);
      
    } catch (error) {
      console.error("Error generating email:", error);
      setDisplayedInfo("Error generating email content. Please try again.");
    }
  };

  // Updated function to handle sending the email with edited content
  const handleSendEmail = async (planet) => {
    setEmailSending(true);
    
    try {
      // Prepare email parameters for EmailJS
      const templateParams = {
        to_name: planet.assignedTo.map(emp => emp.name).join(", "),
        to_email: planet.assignedTo.map(emp => emp.email).join(", "), // Replace with actual emails
        subject: `Task Update: ${planet.label}`,
        message: emailContent, // Use the potentially edited content
        task_name: planet.label,
        task_description: planet.info

      };
      
      // Send the email using EmailJS
      await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        templateParams,
        EMAIL_PUBLIC_KEY
      );
      
      setEmailSending(false);
      setEmailContent("");
      setShowPromptEditor(false);
      setDisplayedInfo(`Email successfully sent to ${planet.assignedTo.map(emp => emp.name).join(", ")}`);
      
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailSending(false);
      setDisplayedInfo("Error sending email. Please try again.");
    }
  };

 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      <h1 className="text-3xl font-bold mb-12 z-10" style={{ color: colors.solarWhite }}></h1>
  
      <div className="relative z-10" style={{ width: '800px', height: '800px' }}>
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ top: '45%', left: '45%' }}
        >
          <MindMapNode node={mindMapData} isRoot={true} onSelect={handleSelectPlanet} />
        </div>
      </div>


      <div
        className="fixed right-6 top-4 flex items-center justify-center z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-opacity-90 p-6 rounded-lg shadow-lg text-green-400 
                      w-[200px] border-4 border-green-500 font-mono"
          style={{ backgroundColor: colors.lunarBlack }}
        >
          {/* Terminal Header */}
          <h2 className="text-xl font-bold mb-4 text-center border-b border-green-500 pb-2">
            Task Legend
          </h2>

          {/* Legend Items */}
          <div className="border border-green-400 p-4 rounded mb-4">
            {/* Completed */}
            <div className="flex items-center mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "green", marginRight: '8px' }}
              />
              <span>Completed</span>
            </div>
            
            {/* Chosen */}
            <div className="flex items-center mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors.sunsetGold, marginRight: '8px' }}
              />
              <span>Chosen</span>
            </div>
            
            {/* Unchosen */}
            <div className="flex items-center mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors.daylightBlue, marginRight: '8px' }}
              />
              <span>Unchosen</span>
            </div>
          </div>

          {/* Tasks Counter */}
          <div className="border-t border-green-500 pt-4">
            <div className="flex justify-between font-medium">
              <span>Completed:</span>
              <span>{totalCompleted}</span>
            </div>
            <div className="flex justify-between font-medium mt-2">
              <span>Chosen:</span>
              <span>{totalChosen}</span>
            </div>
          </div>
          
        </motion.div>
      </div>

  
      {selectedPlanet && selectedPlanet.status === "chosen" && (
        <div className="fixed inset-0 flex items-center justify-center z-20" style={{ transform: 'translateX(40px)' }}
        onClick={handleClosePanel} // Click outside to close
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
              <select 
                id="alert-dropdown" 
                className="mt-2 p-2 text-green-400 border border-green-500 rounded"
                style={{ backgroundColor: colors.lunarBlack }}
                onChange={(e) => {
                  if (e.target.value === "email") {
                    // Show prompt editor when email is selected
                    setShowPromptEditor(true);
                    
                    // Set default prompt
                    setEmailPrompt(`Write a professional email to team members about the following task: "${selectedPlanet.label}". 
                      Include these details: 
                      Task description: ${selectedPlanet.info}. 
                      Assigned to: ${selectedPlanet.assignedTo.map(emp => emp.name).join(", ")}. 
                      Make the email concise, professional, and include a call to action. 
                      Do not include any salutation or signature, just the body text.`.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim());
                      
                  } else {
                    setShowPromptEditor(false);
                    setEmailContent("");
                    setEmailPrompt("");
                  }
                }}
              >
                <option value="none">None</option>
                <option value="discord">Discord</option>
                <option value="email">Email</option>
              </select>
            </div>

            {/* Email Prompt Editor */}
            {showPromptEditor && (
              <div className="border border-blue-400 p-6 rounded mb-4 bg-opacity-30" style={{ backgroundColor: colors.lunarBlack }}>
                <h3 className="text-lg font-bold text-blue-300 mb-2">Customize Email Generation:</h3>
                <textarea
                  rows="4"
                  className="w-full p-4 text-blue-400 border border-blue-500 rounded mt-2"
                  style={{ backgroundColor: colors.lunarBlack }}
                  placeholder="Enter custom prompt for email generation..."
                  value={emailPrompt}
                  onChange={(e) => setEmailPrompt(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-black font-bold rounded hover:bg-blue-600 transition"
                    onClick={() => handleGenerateEmailContent(selectedPlanet, emailPrompt)}
                  >
                    Generate Email
                  </button>
                </div>
              </div>
            )}

            {/* Email Preview and Editor */}
            {emailContent && (
              <div className="border border-yellow-400 p-6 rounded mb-4 bg-opacity-30" style={{ backgroundColor: colors.lunarBlack }}>
                <h3 className="text-lg font-bold text-yellow-300 mb-2">Email Preview:</h3>
                <div className="mb-4">
                  <p className="text-yellow-200"><span className="font-bold">To:</span> {selectedPlanet.assignedTo.map(emp => emp.name).join(", ")}</p>
                  <p className="text-yellow-200"><span className="font-bold">Subject:</span> Task Update: {selectedPlanet.label}</p>
                </div>
                <div className="border-t border-yellow-500 pt-3">
                  <textarea
                    rows="8"
                    className="w-full p-4 text-yellow-200 border border-yellow-500 rounded mt-2"
                    style={{ backgroundColor: colors.lunarBlack }}
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder="Email content..."
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-600 transition mr-2"
                    onClick={() => {
                      setShowPromptEditor(false);
                      setEmailContent("");
                      setEmailPrompt("");
                      
                      // Reset any dropdown selection
                      const alertDropdown = document.getElementById("alert-dropdown");
                      if (alertDropdown) {
                        alertDropdown.value = "none";
                      }
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-600 transition"
                    onClick={() => handleSendEmail(selectedPlanet)}
                    disabled={emailSending}
                  >
                    {emailSending ? "Sending..." : "Send Email"}
                  </button>
                </div>
              </div>
            )}

            {/* Single Terminal Panel */}
            {!emailContent && !showPromptEditor && (
              <div className="border border-green-400 p-6 rounded mb-4">
                {displayedInfo}
              </div>
            )}

          

            
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
            className="bg-opacity-90 p-10 rounded-lg shadow-lg text-green-400 
                      w-[50%] max-w-2xl border-4 border-green-500 font-mono"
            style={{ backgroundColor: colors.lunarBlack }}
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Terminal Header */}
            <h2 className="text-4xl font-bold mb-6 text-center border-b border-green-500 pb-4">
              {selectedPlanet.label}
            </h2>

            {/* Single Terminal Panel */}
            <div className="border border-green-400 p-6 rounded mb-4">
              <p className="text-green-300 text-center">{selectedPlanet.info}</p>
            </div>
            
            {/* Employee Autocomplete Search */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-green-300 mb-2">
                Assign Employees:
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 text-green-400 border border-green-500 rounded"
                  style={{ backgroundColor: colors.lunarBlack }}
                  placeholder="Type to search employees..."
                  value={userInput}
                  onChange={handleTextChange}
                />
                
                {/* Dropdown for employee suggestions */}
                {userInput.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 border border-green-500 rounded overflow-y-auto max-h-40 z-30"
                      style={{ backgroundColor: colors.lunarBlack }}>
                    {Object.entries(employees)
                      .filter(([id, emp]) => 
                        emp.name.toLowerCase().includes(userInput.toLowerCase()) && 
                        !selectedPlanet.assignedTo.some(assigned => assigned.name === emp.name)
                      )
                      .map(([id, emp]) => (
                        <div 
                          key={id}
                          className="p-2 hover:bg-green-900 cursor-pointer flex items-center"
                          onClick={() => {
                            // Add employee to planet's assignedTo list
                            const updatedMindmapData = {
                              ...mindMapData,
                              children: mindMapData.children.map((planet) => {
                                if (planet.id === selectedPlanet.id) {
                                  return { 
                                    ...planet, 
                                    assignedTo: [...planet.assignedTo, emp] 
                                  };
                                }
                                return planet;
                              })
                            };
                            
                            setMindmapData(updatedMindmapData);
                            setSelectedPlanet({
                              ...selectedPlanet,
                              assignedTo: [...selectedPlanet.assignedTo, emp]
                            });
                            setUserInput("");
                          }}
                        >
                          {emp.profilePicture && (
                            <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                              <img src={emp.profilePicture} alt={emp.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <span>{emp.name}</span>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
            
            {/* Selected Employees Display */}
            {selectedPlanet.assignedTo.length > 0 && (
              <div className="mb-6 border border-green-500 rounded p-3">
                <p className="text-green-300 mb-2">Assigned Employees:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPlanet.assignedTo.map((emp, index) => (
                    <div key={index} className="flex items-center bg-green-900 rounded-full pl-1 pr-3 py-1">
                      {emp.profilePicture && (
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                          <img src={emp.profilePicture} alt={emp.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="mr-2">{emp.name}</span>
                      <button 
                        className="text-xs text-red-300 hover:text-red-500"
                        onClick={() => {
                          // Remove employee from assignedTo
                          const updatedAssignedTo = selectedPlanet.assignedTo.filter((_, i) => i !== index);
                          
                          const updatedMindmapData = {
                            ...mindMapData,
                            children: mindMapData.children.map((planet) => {
                              if (planet.id === selectedPlanet.id) {
                                return { ...planet, assignedTo: updatedAssignedTo };
                              }
                              return planet;
                            })
                          };
                          
                          setMindmapData(updatedMindmapData);
                          setSelectedPlanet({
                            ...selectedPlanet,
                            assignedTo: updatedAssignedTo
                          });
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assign Button */}
            <div className="flex justify-center">
              <button
                className="px-6 py-3 bg-green-500 text-black font-bold rounded hover:bg-green-600 transition"
                onClick={() => {
                  // Update the task status to chosen
                  const updatedMindmapData = {
                    ...mindMapData,
                    children: mindMapData.children.map((planet) => {
                      if (planet.id === selectedPlanet.id) {
                        return { ...planet, status: "chosen" };
                      }
                      return planet;
                    })
                  };
                  
                  setMindmapData(updatedMindmapData);
                  const chosenTasksCount = updatedMindmapData.children.filter(child => child.status === 'chosen').length;
                  setTotalChosen(chosenTasksCount + "/" + totalTasksCount);
                  setSelectedPlanet(null);
                }}
              >
                Assign
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
  
};

export default SolarSystemMindMap;
