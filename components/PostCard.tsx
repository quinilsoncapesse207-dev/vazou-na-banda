
import React from 'react';
import { NewsPost } from '../types';

interface PostCardProps {
  post: NewsPost;
  onClick: (post: NewsPost) => void;
  onRemove?: (id: string) => void;
  isAdmin?: boolean;
  variant?: 'large' | 'small';
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onClick, 
  onRemove, 
  isAdmin, 
  variant = 'small',
  isSelectionMode = false,
  isSelected = false,
  onSelect
}) => {
  const isVideo = post.mediaType === 'video';

  const handleCardClick = () => {
    if (isSelectionMode && onSelect) {
      onSelect(post.id);
    } else {
      onClick(post);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(post.id);
    }
  };

  const removeBtnClasses = "absolute z-20 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl transition-all transform hover:scale-110 border border-red-400 hover:animate-shake";
  const selectionClasses = isSelected ? "ring-4 ring-red-600 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]" : "border-slate-700/50";

  if (variant === 'large') {
    return (
      <div 
        onClick={handleCardClick}
        className={`relative overflow-hidden rounded-xl cursor-pointer group mb-8 h-[300px] md:h-[450px] transition-all duration-300 ${isSelectionMode ? selectionClasses : ""}`}
      >
        {isVideo ? (
          <video 
            src={post.thumbnail} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        ) : (
          <img 
            src={post.thumbnail} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        {/* Checkbox de Seleção */}
        {isSelectionMode && (
          <div className="absolute top-4 left-4 z-30">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-red-600 border-red-400 shadow-lg' : 'bg-black/50 border-white/50'}`}>
              {isSelected && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        )}

        {isAdmin && onRemove && !isSelectionMode && (
          <button 
            onClick={handleRemove}
            className={`${removeBtnClasses} top-4 right-4 p-2`}
            title="Remover Post"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl opacity-80 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6V4z"/></svg>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              {isVideo ? 'Vídeo Vazado' : 'Destaque'}
            </span>
            <span className="text-slate-300 text-xs font-medium">{post.date}</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-4 group-hover:text-red-400 transition-colors">
            {post.title}
          </h2>
          <p className="text-slate-300 text-sm md:text-lg line-clamp-2 max-w-2xl">
            {post.excerpt}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-slate-800/50 rounded-lg overflow-hidden border hover:border-red-600/30 cursor-pointer group transition-all relative ${isSelectionMode ? selectionClasses : "border-slate-700/50"}`}
    >
      {/* Checkbox de Seleção */}
      {isSelectionMode && (
        <div className="absolute top-2 left-2 z-30">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-red-600 border-red-400 shadow-lg scale-110' : 'bg-black/50 border-white/50'}`}>
            {isSelected && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      )}

      {isAdmin && onRemove && !isSelectionMode && (
        <button 
          onClick={handleRemove}
          className={`${removeBtnClasses} top-2 right-2 p-1.5`}
          title="Remover Post"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}

      <div className="relative aspect-video bg-slate-900">
        {isVideo ? (
          <div className="w-full h-full relative">
            <video 
              src={post.thumbnail} 
              className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <svg className="w-10 h-10 text-white opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6V4z"/></svg>
            </div>
          </div>
        ) : (
          <img 
            src={post.thumbnail} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
          />
        )}
        
        {post.isHot && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            {isVideo ? 'VÍDEO' : 'QUENTE'}
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded">
          {post.views} Views
        </div>
      </div>
      <div className="p-4">
        <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest block mb-1">
          {post.category}
        </span>
        <h3 className="text-slate-100 font-bold leading-snug group-hover:text-red-500 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-slate-500 text-[10px]">{post.date}</span>
          <span className="text-slate-400 text-[10px] font-medium">{post.author}</span>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: scale(1.1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(5deg); }
          75% { transform: scale(1.1) rotate(-5deg); }
        }
        .hover\\:animate-shake:hover {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PostCard;
