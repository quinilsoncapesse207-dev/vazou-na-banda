
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import PostCard from './components/PostCard';
import Footer from './components/Footer';
import { INITIAL_NEWS } from './constants';
import { NewsPost } from './types';
import { generateGossip } from './services/geminiService';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsPost[]>(INITIAL_NEWS);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [isPostarOpen, setIsPostarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Admin Tabs inside Postar Area
  const [activeAdminTab, setActiveAdminTab] = useState<'post' | 'manage'>('post');
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for new posts
  const [newPostData, setNewPostData] = useState({
    title: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    mediaType: 'image' as 'image' | 'video',
    author: 'Administrador'
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    const topics = ["Reality Show", "Celebridade", "Flagra", "Digital Influencer"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const newGossip = await generateGossip(randomTopic);
    if (newGossip.length > 0) {
      const gossipsWithVideos = newGossip.map((g, idx) => ({
        ...g,
        mediaType: idx === 0 ? 'video' : 'image' as 'video' | 'image'
      }));
      setNews(prev => [...gossipsWithVideos, ...prev]);
    }
    setLoading(false);
  }, []);

  const openPost = (post: NewsPost) => {
    setIsPostarOpen(false);
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closePost = () => {
    setSelectedPost(null);
  };

  const handleOpenPostarClick = () => {
    if (isAdmin) {
      openPostar();
    } else {
      setShowLoginModal(true);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'Quinilson@33') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setAdminPassword('');
      openPostar();
      showToast("Acesso de Administrador concedido!");
    } else {
      showToast("Senha incorreta! Acesso negado.");
      setAdminPassword('');
    }
  };

  const openPostar = () => {
    setSelectedPost(null);
    setIsPostarOpen(true);
    setActiveAdminTab('post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closePostar = () => {
    setIsPostarOpen(false);
  };

  const handleRemovePost = (id: string) => {
    if (!isAdmin) return;
    if (window.confirm("Remover este vídeo permanentemente?")) {
      setNews(prev => prev.filter(p => p.id !== id));
      showToast("Vídeo removido!");
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRemoveSelected = () => {
    if (selectedPostIds.size === 0) {
      showToast("Selecione ao menos um vídeo!");
      return;
    }
    if (window.confirm(`Tem certeza que deseja eliminar os ${selectedPostIds.size} vídeos selecionados?`)) {
      setNews(prev => prev.filter(p => !selectedPostIds.has(p.id)));
      showToast(`${selectedPostIds.size} vídeos eliminados com sucesso!`);
      setSelectedPostIds(new Set());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      setNewPostData({
        ...newPostData,
        thumbnail: url,
        mediaType: isVideo ? 'video' : 'image'
      });
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !newPostData.title || !newPostData.content) return;

    const post: NewsPost = {
      id: Math.random().toString(36).substr(2, 9),
      title: newPostData.title,
      category: 'Exclusivo',
      excerpt: newPostData.excerpt || newPostData.content.substring(0, 100) + '...',
      content: newPostData.content,
      thumbnail: newPostData.thumbnail || `https://picsum.photos/seed/${Math.random()}/800/450`,
      mediaType: newPostData.mediaType,
      views: '1',
      date: 'Agora mesmo',
      author: newPostData.author,
      isHot: true
    };

    setNews([post, ...news]);
    setIsPostarOpen(false);
    setNewPostData({ title: '', excerpt: '', content: '', thumbnail: '', mediaType: 'image', author: 'Administrador' });
    showToast("Vídeo vazado com sucesso!");
  };

  const videoPosts = news.filter(p => p.mediaType === 'video');

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header 
        onRefresh={handleRefresh}
        onOpenPostar={handleOpenPostarClick}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="text-center mb-6">
                <div className="inline-block bg-red-600/20 p-3 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h2 className="text-xl font-black text-white italic uppercase">Administrador</h2>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input type="password" autoFocus value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-center tracking-[0.5em] outline-none" placeholder="••••••••" />
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all uppercase">Acessar Painel</button>
              </form>
            </div>
          </div>
        )}

        {isPostarOpen && isAdmin ? (
          /* Create Post / Management View */
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900/50 p-6 md:p-10 rounded-2xl border border-slate-800 shadow-2xl">
              
              {/* Painel de Abas Admin */}
              <div className="flex border-b border-slate-800 mb-8 overflow-hidden rounded-t-lg">
                <button 
                  onClick={() => setActiveAdminTab('post')}
                  className={`flex-1 py-4 font-black italic uppercase text-sm tracking-widest transition-all ${activeAdminTab === 'post' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
                >
                  Vazar Novo
                </button>
                <button 
                  onClick={() => setActiveAdminTab('manage')}
                  className={`flex-1 py-4 font-black italic uppercase text-sm tracking-widest transition-all ${activeAdminTab === 'manage' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
                >
                  Gerenciar Portal
                </button>
              </div>

              {activeAdminTab === 'post' ? (
                /* Formulário de Postagem */
                <form onSubmit={handlePostSubmit} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white italic uppercase">Novo Flagra</h2>
                    <button type="button" onClick={closePostar} className="text-slate-500 hover:text-white text-xs font-bold uppercase">Fechar</button>
                  </div>
                  <input type="text" required value={newPostData.title} onChange={(e) => setNewPostData({...newPostData, title: e.target.value})} placeholder="Título da Notícia" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-white font-bold" />
                  <div onClick={() => fileInputRef.current?.click()} className="w-full h-56 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-red-600 transition-all bg-slate-800/30 overflow-hidden relative">
                    {newPostData.thumbnail ? <img src={newPostData.thumbnail} className="w-full h-full object-cover" /> : <p className="text-slate-500 text-sm font-bold uppercase">Carregar Vídeo/Foto</p>}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*,image/*" className="hidden" />
                  </div>
                  <textarea rows={6} required value={newPostData.content} onChange={(e) => setNewPostData({...newPostData, content: e.target.value})} placeholder="Escreva o conteúdo bombástico..." className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-white" />
                  <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-lg text-xl uppercase italic shadow-lg shadow-red-900/20">PUBLICAR AGORA</button>
                </form>
              ) : (
                /* Gerenciador de Vídeos (Seleção e Eliminação) */
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white italic uppercase">Manutenção</h2>
                      <p className="text-slate-500 text-[10px] uppercase font-bold mt-1">Selecione os vídeos que deseja remover</p>
                    </div>
                    {selectedPostIds.size > 0 && (
                      <button 
                        onClick={handleRemoveSelected}
                        className="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2 rounded text-xs uppercase animate-bounce"
                      >
                        ELIMINAR ({selectedPostIds.size})
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                    {news.map(post => (
                      <div 
                        key={post.id}
                        onClick={() => toggleSelection(post.id)}
                        className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${selectedPostIds.has(post.id) ? 'bg-red-600/20 border-red-600' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
                      >
                        <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${selectedPostIds.has(post.id) ? 'bg-red-600 border-red-400' : 'bg-black/30 border-slate-600'}`}>
                          {selectedPostIds.has(post.id) && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          )}
                        </div>
                        <img src={post.thumbnail} className="w-16 h-10 object-cover rounded bg-black" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold text-xs truncate uppercase italic">{post.title}</h4>
                          <span className="text-slate-500 text-[9px] uppercase font-bold">{post.date} • {post.views} Views</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {news.length === 0 && (
                    <div className="text-center py-12 text-slate-500 font-bold uppercase text-xs">O portal está vazio.</div>
                  )}

                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button onClick={closePostar} className="text-slate-500 hover:text-white text-xs font-bold uppercase">Concluído</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : selectedPost ? (
          /* Single Post View */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={closePost} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors font-bold uppercase text-xs">Voltar ao Início</button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black mb-6 border border-slate-800 relative shadow-2xl">
                  {selectedPost.mediaType === 'video' ? <video src={selectedPost.thumbnail} controls autoPlay className="w-full h-full object-contain" /> : <img src={selectedPost.thumbnail} className="w-full h-full object-cover" />}
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-6 italic uppercase leading-tight">{selectedPost.title}</h1>
                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">{selectedPost.content}</div>
                {isAdmin && (
                  <button onClick={() => { handleRemovePost(selectedPost.id); closePost(); }} className="mt-8 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-600 px-6 py-2 rounded-lg font-bold transition-all uppercase text-xs">Eliminar vídeo</button>
                )}
              </div>
              <div className="lg:col-span-1">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 uppercase italic"><span className="w-1 h-6 bg-red-600 rounded"></span>MAIS VISTAS</h3>
                <div className="space-y-4">
                  {news.filter(n => n.id !== selectedPost.id).slice(0, 5).map(n => (
                    <div key={n.id} className="flex gap-4 cursor-pointer group" onClick={() => openPost(n)}>
                      <img src={n.thumbnail} className="w-24 h-16 rounded object-cover flex-shrink-0" />
                      <h4 className="text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-red-500 transition-colors uppercase italic">{n.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View - All News (Tudo) */
          <div className="animate-in fade-in duration-500 space-y-12">
            {news.length > 0 && (
              <PostCard 
                post={news[0]} 
                variant="large" 
                onClick={openPost} 
                isAdmin={isAdmin} 
                onRemove={handleRemovePost}
              />
            )}

            {videoPosts.length > 0 && (
              <section className="relative">
                <h2 className="text-xl md:text-2xl font-black text-white italic mb-6 uppercase tracking-tighter flex items-center gap-2">
                  <span className="w-2 h-8 bg-red-600 rounded-full"></span> VÍDEOS QUE ESTÃO PARANDO A BANDA 🔥
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {videoPosts.map(video => (
                    <div key={video.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                      <PostCard 
                        post={video} 
                        onClick={openPost} 
                        isAdmin={isAdmin} 
                        onRemove={handleRemovePost}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
              <div className="col-span-full border-t border-slate-800 pt-8 mb-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Últimas Atualizações</h3>
              </div>
              {news.slice(1).map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onClick={openPost} 
                  isAdmin={isAdmin} 
                  onRemove={handleRemovePost}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold border border-red-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {toastMessage}
          </div>
        </div>
      )}

      {!selectedPost && !isPostarOpen && (
        <div className="fixed bottom-0 left-0 w-full bg-red-600 text-white py-1.5 z-50 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center px-4">
                <span className="font-black italic mr-4 uppercase">URGENTE:</span>
                <span className="font-medium uppercase">Portal Vazou na Banda - Flagras atualizados em tempo real • </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: fit-content; animation: marquee 30s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
