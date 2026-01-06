
import React from 'react';

interface HeaderProps {
  onRefresh: () => void;
  onOpenPostar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, onOpenPostar }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-red-600/30 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="bg-red-600 text-white font-black px-2 py-1 rounded text-xl italic skew-x-[-10deg] group-hover:bg-red-500 transition-colors">
              VAZOU
            </div>
            <div className="text-white font-bold text-xl tracking-tighter">
              na <span className="text-red-600">Banda</span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Pesquisar fofocas ou flagras..." 
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-sm"
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={onOpenPostar}
              className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] md:text-xs font-bold py-2.5 px-4 rounded transition-all border border-slate-700"
            >
              POSTAR
            </button>
            <button 
              onClick={onRefresh}
              className="bg-red-600 hover:bg-red-700 text-white text-[10px] md:text-xs font-bold py-2.5 px-4 rounded transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              URGENTE
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
