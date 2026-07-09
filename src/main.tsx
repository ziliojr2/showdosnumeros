import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Captura erros globais que não são pegos pelo React
window.addEventListener('error', (event) => {
  console.error('Erro global capturado:', event.error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="background: #1e293b; color: white; padding: 40px; min-height: 100vh; font-family: sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; text-align: center;">
          <div style="font-size: 60px; margin-bottom: 20px;">⚠️</div>
          <h1 style="font-size: 24px; margin-bottom: 16px;">Erro ao carregar o aplicativo</h1>
          <p style="color: #94a3b8; margin-bottom: 20px;">${event.message}</p>
          <pre style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px; text-align: left; overflow: auto; max-height: 300px; font-size: 12px; color: #fca5a5;">${event.error?.stack || 'Sem stack trace'}</pre>
          <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #10b981; color: black; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">🔄 Recarregar</button>
        </div>
      </div>
    `;
  }
});

// Captura erros de promises não tratadas
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada não tratada:', event.reason);
});

console.log('🎯 Iniciando Show dos Números...');

try {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Elemento root não encontrado");
  }
  
  console.log('✓ Container root encontrado');
  
  const root = createRoot(container);
  console.log('✓ React root criado');
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log('✓ App renderizado com sucesso');
} catch (error) {
  console.error('Erro fatal ao inicializar:', error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="background: #1e293b; color: white; padding: 40px; min-height: 100vh; font-family: sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; text-align: center;">
          <div style="font-size: 60px; margin-bottom: 20px;">💥</div>
          <h1 style="font-size: 24px; margin-bottom: 16px;">Erro fatal ao inicializar</h1>
          <p style="color: #94a3b8; margin-bottom: 20px;">${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
          <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #10b981; color: black; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">🔄 Recarregar</button>
        </div>
      </div>
    `;
  }
}
