// Versão de teste simplificada sem bibliotecas externas
import { useState } from 'react';

export default function AppTest() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto">
          <span className="text-4xl font-black">B</span>
        </div>
        <h1 className="text-4xl font-bold">Show dos Números</h1>
        <p className="text-white/60">Teste de carregamento</p>
        
        <div className="bg-white/10 rounded-2xl p-6 space-y-4">
          <div className="text-6xl font-bold text-emerald-400">{count}</div>
          <button 
            onClick={() => setCount(c => c + 1)}
            className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-600 transition"
          >
            Clique para testar
          </button>
        </div>

        <div className="text-xs text-white/40 space-y-1">
          <div>✓ React funcionando</div>
          <div>✓ Tailwind funcionando</div>
          <div>✓ Estado funcionando</div>
          <div>URL: {window.location.href}</div>
          <div>Protocolo: {window.location.protocol}</div>
        </div>

        <button
          onClick={() => window.location.href = 'index.html'}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition text-sm"
        >
          Ir para App Completo →
        </button>
      </div>
    </div>
  );
}
