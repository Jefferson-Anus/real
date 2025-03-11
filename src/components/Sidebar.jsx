import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { navLinks } from "../constants";
import {sun} from "../assets";
import { IconPlanet } from "@tabler/icons-react";
import { settings, table, sitemap, brain } from '../assets';

const Icon = ({ styles, name, imageUrl, isActive, handleClick }) => {
  console.log("Rendering Icon:", name);

  return (
    <div 
      className={`h-[48px] w-[48px] rounded-[10px] ${isActive === name ? 'bg-[#2c2f32]' : ''} flex items-center justify-center ${styles}`}
      onClick={handleClick}
    >
      <img 
        src={imageUrl}  
        alt={`${name} icon`}
        className="h-6 w-6"
      />
    </div>
  );
};




const Sidebar = () => {
  const navigate = useNavigate();
  
  return (
    
    <div className="sticky top-5 flex h-[93vh] flex-col items-center justify-between">
      
      <Link to="/">
        <div className="rounded-[10px] bg-[#2c2f32] p-2">
          <IconPlanet size={40} color="#FFB81C" className="w-[40px] h-[40px]"/>
        </div>
      </Link>
      <div className="mt-12 flex w-[76px] flex-1 flex-col items-center justify-between rounded-[20px] bg-[#1c1c24] py-4">
        <div className="flex flex-col items-center justify-center gap-5">
          <Icon 
            name="Dashboard"
            imageUrl={brain}
            isActive="Dashboard"
            handleClick={() => { 
              navigate("/AI");
            }}
          />
          <Icon 
            name="Records"
            imageUrl={sitemap}
            isActive="Records"
            handleClick={() => { 
              navigate("/Mindmap");
            }}
          />
          <Icon 
            name="Screening"
            imageUrl={table}
            isActive="Screening"
            handleClick={() => { 
              navigate("/Table");
            }}
          />
          <Icon 
            name="Profile"
            imageUrl={settings}
            isActive="Profile"
            handleClick={() => console.log("Clicked Test Icon!")}
          />
        </div>
      </div>
      
    </div>
    
  );
};

export default Sidebar;
