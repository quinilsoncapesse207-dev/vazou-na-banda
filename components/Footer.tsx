
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-red-600 text-white font-black px-2 py-1 rounded text-lg italic skew-x-[-10deg]">
                VAZOU
              </div>
              <div className="text-white font-bold text-lg tracking-tighter">
                na <span className="text-red-600">Banda</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              O maior portal de entretenimento, fofocas e flagras do Brasil. 
              Conteúdo atualizado 24 horas por dia para você não perder nada do mundo dos famosos.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Categorias</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-red-500 cursor-pointer">Flagras Exclusivos</li>
              <li className="hover:text-red-500 cursor-pointer">Reality Shows</li>
              <li className="hover:text-red-500 cursor-pointer">Vida dos Influencers</li>
              <li className="hover:text-red-500 cursor-pointer">Moda e Estilo</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-red-500 cursor-pointer">Termos de Uso</li>
              <li className="hover:text-red-500 cursor-pointer">Política de Privacidade</li>
              <li className="hover:text-red-500 cursor-pointer">Anuncie Conosco</li>
              <li className="hover:text-red-500 cursor-pointer">Contato</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-900 text-center text-[10px] uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Vazou na Banda - Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
