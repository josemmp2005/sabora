import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  PlusCircle, 
  Settings, 
  History, 
  LogOut, 
  X,
  Moon,
  Sun
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../hooks/useUserProfile';

interface SidebarProps {
  session: any;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNewRecipe: () => void;
  onOpenHistory: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  session, 
  isOpen, 
  onClose, 
  onLogout, 
  onNewRecipe
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  // Usar el hook para obtener el perfil actualizado desde la DB
  const { username } = useUserProfile(session);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) onClose();
  };

  const MenuItem = ({ 
    icon: Icon, 
    label, 
    onClick, 
    danger = false,
    isUser = false 
  }: { 
    icon: any, 
    label: string, 
    onClick: () => void, 
    danger?: boolean,
    isUser?: boolean
  }) => (
    <button 
      onClick={() => {
        onClick();
        if (window.innerWidth < 768) onClose();
      }}
      className={`
        flex items-center w-full p-4 transition-all duration-200 overflow-hidden whitespace-nowrap
        ${danger ? 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary hover:bg-orange-50 dark:hover:bg-orange-900/10'}
        ${isUser ? 'md:mb-6 md:mt-4' : ''}
      `}
    >
      <div className={`flex-shrink-0 flex items-center justify-center ${isUser ? 'w-10 h-10' : 'w-6 h-6'}`}>
        {isUser ? (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
            <span className="text-lg font-bold text-white">
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
        ) : (
          <Icon className="w-6 h-6" />
        )}
      </div>

      <span className={`
        ml-4 font-medium transition-all duration-300
        ${isHovered ? 'opacity-100 translate-x-0' : 'md:opacity-0 md:-translate-x-4'}
        ${danger ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}
      `}>
        {isUser ? username : label}
      </span>
    </button>
  );

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in"
          onClick={onClose}
        />
      )}

      <aside 
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-gray-800 z-50 shadow-xl md:shadow-none border-r border-gray-100 dark:border-gray-700
          transition-all duration-300 ease-in-out flex flex-col py-4 overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isHovered ? 'w-64' : 'w-64 md:w-20'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="md:hidden w-full flex justify-between items-center px-4 mb-6 flex-shrink-0">
          <Logo className="w-8 h-8" textClassName="text-lg" />
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <MenuItem 
          icon={User} 
          label="Perfil" 
          isUser={true} 
          onClick={() => handleNavigation('/app/profile')} 
        />

        <div className={`w-full px-4 hidden md:block transition-opacity duration-300 mb-2 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
           <div className="h-px bg-gray-100 dark:bg-gray-700 w-full"></div>
        </div>

        <MenuItem 
          icon={PlusCircle} 
          label="Nueva Receta" 
          onClick={() => {
            handleNavigation('/app');
            onNewRecipe();
          }} 
        />

        <div className="flex-grow flex flex-col w-full gap-1">
          <MenuItem 
            icon={Settings} 
            label="Preferencias" 
            onClick={() => handleNavigation('/app/preferences')} 
          />

          <MenuItem 
            icon={History} 
            label="Historial" 
            onClick={() => handleNavigation('/app/history')} 
          />
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="flex items-center w-full p-4 text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all duration-200 overflow-hidden whitespace-nowrap mb-1"
        >
          <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
            {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </div>
          <span className={`ml-4 font-medium transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'md:opacity-0 md:-translate-x-4'} text-gray-700 dark:text-gray-300`}>
            {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
          </span>
        </button>

        <div className={`w-full px-4 hidden md:block transition-opacity duration-300 my-2 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
           <div className="h-px bg-gray-100 dark:bg-gray-700 w-full"></div>
        </div>

        <MenuItem 
          icon={LogOut} 
          label="Cerrar Sesión" 
          danger={true} 
          onClick={onLogout} 
        />

      </aside>
    </>
  );
};

export default Sidebar;