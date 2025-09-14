"use client";
import React from "react";

interface LogoRowProps {
  src: string[];
}

const LogoRow: React.FC<LogoRowProps> = ({ src }) => {
  return (
    <div className="flex gap-x-12 md:gap-x-20">
      {src.map((logo, index) => (
        <img
          className="w-[120px] h-[120px] md:w-[170px] md:h-[170px] object-cover"
          key={index}
          src={logo}
          alt={`logo-${index}`}
        />
      ))}
    </div>
  );
};
export default LogoRow;
