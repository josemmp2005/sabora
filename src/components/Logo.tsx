import React from "react";
import logoSrc from '../assets/logo.png';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "w-12 h-12",
  showText = true,
  textClassName = "text-2xl",
}) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <img src={logoSrc} alt="Sabora Logo" className={className} />
      {showText && (
        <span className={`font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-orange-700 ${textClassName}`}>
          Sabora
        </span>
      )}
    </div>
  );
};
