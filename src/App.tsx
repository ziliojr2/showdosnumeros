import { useState, useRef, useEffect, Component, type ReactNode } from 'react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';

console.log('✓ Bibliotecas importadas com sucesso');

// Error Boundary para capturar erros e evitar página em branco
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const isFileProtocol = window.location.protocol === 'file:';
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-2xl text-center space-y-4">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-2xl font-bold">Ops! Algo deu errado</h1>
            <p className="text-white/70 text-sm">
              Ocorreu um erro ao carregar o aplicativo.
            </p>
            
            {isFileProtocol && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-left">
                <h3 className="font-bold text-amber-400 mb-2">📁 Abrindo via file://</h3>
                <p className="text-sm text-amber-200/80 mb-3">
                  Você está abrindo este arquivo diretamente no navegador (protocolo file://). 
                  Por questões de segurança, alguns recursos podem não funcionar corretamente.
                </p>
                <div className="text-xs space-y-2 text-amber-100/70">
                  <p><strong>✅ Solução 1:</strong> Use um servidor local:</p>
                  <code className="block bg-black/30 p-2 rounded text-emerald-300">npx serve dist</code>
                  <p><strong>✅ Solução 2:</strong> Use Firefox (mais permissivo)</p>
                  <p><strong>✅ Solução 3:</strong> Hospede online (Netlify, Vercel, etc)</p>
                  <p className="mt-2 text-amber-200/60">
                    📖 Veja instruções completas no arquivo <code>COMO_ABRIR.md</code>
                  </p>
                </div>
              </div>
            )}
            
            <pre className="bg-black/40 p-4 rounded-xl text-xs text-left overflow-auto max-h-48 text-red-300">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-600 transition"
            >
              🔄 Recarregar Página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface Card {
  id: number;
  name: string;
  numbers: number[];
  marked: Set<number>;
}

const BINGO_COLS = ['B', 'I', 'N', 'G', 'O'];
const NUMBERS_PER_COL = 15;
const TOTAL_NUMBERS = 75;

function BingoApp() {
  console.log('🎨 BingoApp iniciando...');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [cards, setCards] = useState<Card[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentName, setCurrentName] = useState('');
  const [manualNumbers, setManualNumbers] = useState('');
  const [isAutoDrawing, setIsAutoDrawing] = useState(false);
  const [winners, setWinners] = useState<Card[]>([]);
  const [activeTab, setActiveTab] = useState<'cadastro' | 'sorteio' | 'gerador' | 'exportar' | 'importar' | 'ajustes' | 'admin'>('sorteio');
  const [winCondition, setWinCondition] = useState<'full' | 'line' | 'column'>('full');
  const autoDrawRef = useRef<number | null>(null);
  const winnerIdsRef = useRef<Set<number>>(new Set());
  const [bulkCount, setBulkCount] = useState(5);
  const [isDrawingAnimation, setIsDrawingAnimation] = useState(false);
  const [animatingNumber, setAnimatingNumber] = useState<number | null>(null);
  const [controlPassword, setControlPassword] = useState('bingo2026');
  const [adLeftImage, setAdLeftImage] = useState<string>('');
  const [adRightImage, setAdRightImage] = useState<string>('');
  
  // Ajustes do Evento
  const [eventTitle, setEventTitle] = useState('Show dos Números');
  const [eventSubtitle, setEventSubtitle] = useState('Bingo Online em Tempo Real');
  const [eventPrize, setEventPrize] = useState('');
  const [eventRule, setEventRule] = useState('Cartela Cheia');
  const [cardColor, setCardColor] = useState('emerald');
  const [cardsPerPage, setCardsPerPage] = useState<number>(8);

  // Efeito de confetes quando há novo vencedor
  useEffect(() => {
    if (winners.length === 0) return;
    
    let cancelled = false;
    
    // Disparar confetes de ambos os lados
    const duration = 3000;
    const end = Date.now() + duration;
    
    const frame = () => {
      if (cancelled) return;
      try {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899']
        });
      } catch (err) {
        console.error('Erro ao disparar confetes:', err);
      }
      
      if (Date.now() < end && !cancelled) {
        requestAnimationFrame(frame);
      }
    };
    frame();
    
    // Explosão central
    try {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899']
      });
    } catch (err) {
      console.error('Erro ao disparar confetes:', err);
    }
    
    return () => {
      cancelled = true;
    };
  }, [winners.length]);

  // Função auxiliar: salva cartelas em formato JSON (para importar depois)
  const saveCardsAsJSON = () => {
    try {
      if (cards.length === 0) {
        alert('Nenhuma cartela para salvar!');
        return;
      }
      
      const data = {
        version: '1.0',
        app: 'ShowDosNumeros',
        exportDate: new Date().toISOString(),
        cards: cards.map(c => ({
          id: c.id,
          name: c.name,
          numbers: c.numbers
        })),
        total: cards.length
      };
      
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const fileName = `cartelas-show-numeros-${new Date().toISOString().slice(0,10)}-${Date.now()}.json`;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 200);
      
      alert(`✓ Arquivo JSON salvo!\n\n${fileName}\nTotal: ${cards.length} cartela(s)`);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao gerar arquivo. Tente novamente.');
    }
  };
  const [limitedPassword, setLimitedPassword] = useState('convidado123');
  const [limitedAccessPages, setLimitedAccessPages] = useState('sorteio,gerador,importar');
  const [userRole, setUserRole] = useState<'admin' | 'limited' | null>(null);

  // Generate a random bingo card (5x5 grid flattened)
  const generateRandomCard = (name: string): Card => {
    const numbers: number[] = [];
    for (let col = 0; col < 5; col++) {
      const start = col * NUMBERS_PER_COL + 1;
      const pool = Array.from({ length: NUMBERS_PER_COL }, (_, i) => start + i);
      for (let i = 0; i < 5; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        numbers.push(pool.splice(idx, 1)[0]);
      }
    }
    // Center is free (N column middle)
    numbers[12] = 0; // free space
    return {
      id: Date.now(),
      name: name.trim(),
      numbers,
      marked: new Set([0]),
    };
  };

  // Add manual card
  const addManualCard = () => {
    if (!currentName.trim()) return alert('Digite um nome!');
    
    const nums = manualNumbers
      .split(/[\s,]+/)
      .map(n => parseInt(n.trim()))
      .filter(n => n >= 1 && n <= TOTAL_NUMBERS);
    
    if (nums.length !== 25) {
      return alert('Insira exatamente 25 números únicos (1-75)!');
    }
    
    const uniqueNums = [...new Set(nums)];
    if (uniqueNums.length !== 25) {
      return alert('Números devem ser únicos!');
    }

    const newCard: Card = {
      id: Date.now(),
      name: currentName.trim(),
      numbers: uniqueNums,
      marked: new Set([uniqueNums[12]]), // assume center free if provided
    };
    
    setCards([...cards, newCard]);
    setCurrentName('');
    setManualNumbers('');
  };

  // Add auto-generated card
  const addAutoCard = () => {
    if (!currentName.trim()) return alert('Digite um nome!');
    const newCard = generateRandomCard(currentName);
    setCards([...cards, newCard]);
    setCurrentName('');
  };

  // Draw a number with suspense animation
  const drawNumber = () => {
    const remaining = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1)
      .filter(n => !drawnNumbers.includes(n));
    
    if (remaining.length === 0 || isDrawingAnimation) return;

    setIsDrawingAnimation(true);
    setAnimatingNumber(null);

    // Rapid cycling animation
    let cycles = 0;
    const maxCycles = 20;
    const interval = setInterval(() => {
      const tempNum = remaining[Math.floor(Math.random() * remaining.length)];
      setAnimatingNumber(tempNum);
      cycles++;
      
      if (cycles >= maxCycles) {
        clearInterval(interval);
        // Final number after suspense
        setTimeout(() => {
          const random = remaining[Math.floor(Math.random() * remaining.length)];
          const newDrawn = [...drawnNumbers, random];
          setDrawnNumbers(newDrawn);
          setAnimatingNumber(random);
          updateCardsWithDrawn(newDrawn);
          setIsDrawingAnimation(false);
        }, 300);
      }
    }, 80);
  };

  // Auto draw with interval (using ref to avoid stale closures)
  const toggleAutoDraw = () => {
    if (isAutoDrawing) {
      // Stop auto draw
      if (autoDrawRef.current !== null) {
        clearInterval(autoDrawRef.current);
        autoDrawRef.current = null;
      }
      setIsAutoDrawing(false);
    } else {
      // Start auto draw
      setIsAutoDrawing(true);
      autoDrawRef.current = window.setInterval(() => {
        // Use functional form to get current drawn numbers
        setDrawnNumbers(prev => {
          // Check if we should stop (all numbers drawn or winner exists)
          if (prev.length >= TOTAL_NUMBERS) {
            if (autoDrawRef.current !== null) {
              clearInterval(autoDrawRef.current);
              autoDrawRef.current = null;
            }
            setIsAutoDrawing(false);
            return prev;
          }
          
          const remaining = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1)
            .filter(n => !prev.includes(n));
          
          if (remaining.length === 0) {
            if (autoDrawRef.current !== null) {
              clearInterval(autoDrawRef.current);
              autoDrawRef.current = null;
            }
            setIsAutoDrawing(false);
            return prev;
          }
          
          const random = remaining[Math.floor(Math.random() * remaining.length)];
          const updated = [...prev, random];
          updateCardsWithDrawn(updated);
          return updated;
        });
      }, 800);
    }
  };

  // Check win conditions
  const checkWinCondition = (marked: Set<number>, numbers: number[], condition: 'full' | 'line' | 'column'): boolean => {
    if (condition === 'full') {
      return marked.size === 25;
    }
    
    // Check lines (rows)
    if (condition === 'line') {
      for (let row = 0; row < 5; row++) {
        let rowComplete = true;
        for (let col = 0; col < 5; col++) {
          const idx = col * 5 + row;
          const num = numbers[idx];
          if (!marked.has(num) && num !== 0) {
            rowComplete = false;
            break;
          }
        }
        if (rowComplete) return true;
      }
    }
    
    // Check columns
    if (condition === 'column') {
      for (let col = 0; col < 5; col++) {
        let colComplete = true;
        for (let row = 0; row < 5; row++) {
          const idx = col * 5 + row;
          const num = numbers[idx];
          if (!marked.has(num) && num !== 0) {
            colComplete = false;
            break;
          }
        }
        if (colComplete) return true;
      }
    }
    
    return false;
  };

  // Check and update marked numbers on cards
  const updateCardsWithDrawn = (drawn: number[]) => {
    const updatedCards = cards.map(card => {
      const newMarked = new Set(card.marked);
      card.numbers.forEach((num) => {
        if (drawn.includes(num) || num === 0) {
          newMarked.add(num);
        }
      });
      
      // Check for winner based on condition (allow multiple winners for multiple prizes)
      if (checkWinCondition(newMarked, card.numbers, winCondition) && !winnerIdsRef.current.has(card.id)) {
        winnerIdsRef.current.add(card.id);
        setWinners(prev => [...prev, card]);
        // Pausa o auto-sorteio ao detectar um vencedor
        if (autoDrawRef.current !== null) {
          clearInterval(autoDrawRef.current);
          autoDrawRef.current = null;
          setIsAutoDrawing(false);
        }
      }
      
      return { ...card, marked: newMarked };
    });
    
    setCards(updatedCards);
  };

  // Handle login with role detection
  const handleLogin = () => {
    setLoginError('');
    if (!loginEmail.trim() || !loginPass.trim()) {
      setLoginError('Preencha email e senha');
      return;
    }
    
    // Check admin password
    if (loginPass === controlPassword) {
      setUserRole('admin');
      setIsLoggedIn(true);
      setActiveTab('cadastro');
    } 
    // Check limited password
    else if (loginPass === limitedPassword) {
      setUserRole('limited');
      setIsLoggedIn(true);
      // Redirect to first allowed page
      const allowed = limitedAccessPages.split(',')[0]?.trim() as 'cadastro' | 'sorteio' | 'gerador' | 'admin';
      setActiveTab(allowed || 'sorteio');
    }
    // Fallback demo auth
    else if (loginEmail.includes('@') && loginPass.length >= 4) {
      setUserRole('admin');
      setIsLoggedIn(true);
    } else {
      setLoginError('Senha incorreta. Admin: ' + controlPassword + ' | Limitado: ' + limitedPassword);
    }
  };

  // Quick generator without name (used inline now)
  // const generateQuickCard = () => {
  //   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //   const randomName = `Cartela ${letters[Math.floor(Math.random() * 26)]}${Math.floor(100 + Math.random() * 900)}`;
  //   const newCard = generateRandomCard(randomName);
  //   setCards([...cards, newCard]);
  // };

  // Reset everything - limpa TODOS os dados do jogo incluindo vencedores
  const resetGame = () => {
    // Para auto-sorteio se estiver ativo
    if (autoDrawRef.current !== null) {
      clearInterval(autoDrawRef.current);
      autoDrawRef.current = null;
    }
    // Limpa IDs dos vencedores (para permitir que ganhem novamente em novo jogo)
    winnerIdsRef.current = new Set();
    // Limpa cartelas e números sorteados
    setCards([]);
    setDrawnNumbers([]);
    // ⭐ LIMPA A LISTA DE VENCEDORES ⭐
    setWinners([]);
    // Limpa animação do número sorteado
    setAnimatingNumber(null);
    setIsDrawingAnimation(false);
    // Para o auto-sorteio
    setIsAutoDrawing(false);
    // Limpa formulários de cadastro
    setCurrentName('');
    setManualNumbers('');
  };

  // Obter classe de cor baseada na configuração
  const getCardColorClass = () => {
    const colorMap: Record<string, string> = {
      emerald: 'bg-emerald-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      rose: 'bg-rose-500',
      amber: 'bg-amber-500'
    };
    return colorMap[cardColor] || 'bg-emerald-500';
  };

  // Calcular layout de impressão baseado em cardsPerPage
  // Retorna { cols, rows, cardWidth, cardHeight } para página A4 (210mm x 297mm, margem 8mm = 194mm x 281mm úteis)
  const getPrintLayoutConfig = (perPage: number) => {
    const pageW = 194; // mm úteis
    const pageH = 281; // mm úteis
    const gap = 4; // mm entre cartelas
    
    // Determina cols x rows baseado no número
    const layouts: Record<number, { cols: number; rows: number }> = {
      2: { cols: 2, rows: 1 },
      3: { cols: 3, rows: 1 },
      4: { cols: 2, rows: 2 },
      6: { cols: 3, rows: 2 },
      8: { cols: 4, rows: 2 },
      9: { cols: 3, rows: 3 },
      10: { cols: 5, rows: 2 },
      12: { cols: 4, rows: 3 },
      15: { cols: 5, rows: 3 },
      16: { cols: 4, rows: 4 },
      20: { cols: 5, rows: 4 }
    };
    
    const layout = layouts[perPage] || { cols: 4, rows: 2 };
    const cardWidth = Math.floor((pageW - (layout.cols - 1) * gap) / layout.cols);
    const cardHeight = Math.floor((pageH - (layout.rows - 1) * gap) / layout.rows);
    
    return { ...layout, cardWidth, cardHeight };
  };

  // Gerar PDF real com as cartelas no layout
  const exportCardsPDF = () => {
    if (cards.length === 0) {
      alert('Nenhuma cartela para exportar!');
      return;
    }

    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const layout = getPrintLayoutConfig(cardsPerPage);
      const gap = 4;
      const pageW = 210;
      const margin = 8;
      const startX = margin;
      const startY = margin + 10; // espaço para cabeçalho
      
      // Cabeçalho
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(eventTitle, pageW / 2, 12, { align: 'center' });
      if (eventSubtitle) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(eventSubtitle, pageW / 2, 18, { align: 'center' });
      }

      cards.forEach((card, cardIdx) => {
        const positionInPage = cardIdx % (layout.cols * layout.rows);
        const col = positionInPage % layout.cols;
        const row = Math.floor(positionInPage / layout.cols);
        
        // Nova página se necessário
        if (positionInPage === 0 && cardIdx > 0) {
          pdf.addPage();
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          pdf.text(eventTitle, pageW / 2, 12, { align: 'center' });
        }
        
        const x = startX + col * (layout.cardWidth + gap);
        const y = startY + row * (layout.cardHeight + gap);
        
        // Cabeçalho da cartela (fundo preto)
        const headerH = layout.cardHeight * 0.15;
        pdf.setFillColor(0, 0, 0);
        pdf.rect(x, y, layout.cardWidth, headerH, 'F');
        
        // Nome da cartela
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(Math.max(7, layout.cardHeight * 0.08));
        pdf.setFont('helvetica', 'bold');
        const cardName = card.name.length > 18 ? card.name.substring(0, 18) : card.name;
        pdf.text(cardName, x + 1.5, y + headerH * 0.65);
        
        // ID da cartela (lado direito)
        const idText = card.id.toString().slice(-4);
        pdf.text(idText, x + layout.cardWidth - 1.5, y + headerH * 0.65, { align: 'right' });
        
        // Área dos números
        const gridY = y + headerH;
        const gridH = layout.cardHeight - headerH;
        const cellW = layout.cardWidth / 5;
        const cellH = gridH / 5;
        
        // Cabeçalho BINGO
        const bingoLetters = ['B', 'I', 'N', 'G', 'O'];
        pdf.setFillColor(220, 220, 220);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(Math.max(6, layout.cardHeight * 0.055));
        bingoLetters.forEach((letter, idx) => {
          pdf.rect(x + idx * cellW, gridY, cellW, cellH * 0.3, 'F');
          pdf.text(letter, x + idx * cellW + cellW / 2, gridY + cellH * 0.2, { align: 'center' });
        });
        
        // Grid de números
        const numStartY = gridY + cellH * 0.3;
        const numCellH = (gridH - cellH * 0.3) / 5;
        
        pdf.setDrawColor(150, 150, 150);
        pdf.setFontSize(Math.max(6, layout.cardHeight * 0.065));
        pdf.setFont('helvetica', 'normal');
        
        for (let rowIdx = 0; rowIdx < 5; rowIdx++) {
          for (let colIdx = 0; colIdx < 5; colIdx++) {
            const idx = colIdx * 5 + rowIdx;
            const num = card.numbers[idx];
            const cellX = x + colIdx * cellW;
            const cellY = numStartY + rowIdx * numCellH;
            
            pdf.rect(cellX, cellY, cellW, numCellH);
            
            if (num === 0) {
              pdf.text('★', cellX + cellW / 2, cellY + numCellH * 0.65, { align: 'center' });
            } else {
              pdf.text(num.toString(), cellX + cellW / 2, cellY + numCellH * 0.65, { align: 'center' });
            }
          }
        }
        
        // Borda externa da cartela
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.3);
        pdf.rect(x, y, layout.cardWidth, layout.cardHeight);
      });

      const fileName = `cartelas-${eventTitle.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0,10)}.pdf`;
      pdf.save(fileName);
      alert(`✓ PDF gerado com sucesso!\n\nArquivo: ${fileName}\nTotal: ${cards.length} cartela(s)\nLayout: ${layout.cols}×${layout.rows} (${layout.cols * layout.rows} por folha)`);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  // Render a bingo card
  const renderCard = (card: Card) => {
    const isWinnerCard = winners.some(w => w.id === card.id);
    
    return (
      <div key={card.id} className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 ${isWinnerCard ? 'border-emerald-500 ring-4 ring-emerald-200' : 'border-slate-200'}`}>
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex justify-between items-center">
          <div>
            <span className="font-bold text-lg text-white">{card.name}</span>
          </div>
          <div className="text-emerald-400 text-sm font-mono">
            {card.marked.size - 1}/24
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-5 gap-1.5 bg-slate-100 p-2 rounded-xl">
            {BINGO_COLS.map((col, colIdx) => (
              <div key={colIdx} className="text-center">
                <div className="font-bold text-xs text-slate-500 mb-1">{col}</div>
                {Array.from({ length: 5 }).map((_, rowIdx) => {
                  const idx = colIdx * 5 + rowIdx;
                  const num = card.numbers[idx];
                  const isMarked = card.marked.has(num);
                  
                  return (
                    <div
                      key={idx}
                      className={`h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${
                        num === 0 
                          ? 'bg-amber-400 text-white font-bold' 
                          : isMarked 
                            ? `${getCardColorClass()} text-white shadow-md` 
                            : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {num === 0 ? '★' : num}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Login screen - render first if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex w-16 h-16 rounded-3xl bg-emerald-500 items-center justify-center mb-6">
              <span className="font-black text-4xl text-black">B</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter mb-2">Show dos Números</h1>
            <p className="text-white/60">Acesse para gerenciar o sorteio</p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl">
            <div className="space-y-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-white/50">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="admin@bingo.com"
                  className="mt-2 w-full bg-black/50 border border-white/20 focus:border-emerald-500 rounded-2xl px-5 py-4 text-base placeholder:text-white/30 outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-white/50">Senha</label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••"
                  className="mt-2 w-full bg-black/50 border border-white/20 focus:border-emerald-500 rounded-2xl px-5 py-4 text-base placeholder:text-white/30 outline-none"
                />
              </div>

              {loginError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-2xl text-sm">
                  {loginError}
                </div>
              )}

              <button 
                onClick={handleLogin}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-semibold text-black text-lg active:scale-[0.98] transition"
              >
                Entrar no Painel
              </button>

              <div className="text-center text-xs text-white/40 pt-2">
                Demo: qualquer email válido e senha com 4+ caracteres
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center">
              <span className="font-black text-3xl tracking-tighter text-black">B</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">{eventTitle}</h1>
              <p className="text-xs text-white/50 -mt-1">{eventSubtitle || 'Tempo real • Cartelas automáticas'}</p>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => {
                const winnersInfo = winners.length > 0 ? `\n\n🏆 ${winners.length} vencedor(es) será(ão) removido(s)!` : '';
                if (confirm(`Tem certeza que deseja reiniciar?\n\n⚠️ Será apagado:\n• Cartelas cadastradas\n• Números sorteados\n• Lista de vencedores${winnersInfo}`)) {
                  resetGame();
                }
              }}
              className="px-4 py-2 text-sm rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition shadow-lg shadow-rose-900/30"
            >
              🔄 Reiniciar
            </button>
            <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2 text-sm rounded-xl bg-white/5 hover:bg-white/10 text-white/60 transition">Sair</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-white/10 flex-wrap">
          {(['sorteio', 'gerador', 'exportar', 'importar', 'cadastro', 'ajustes', 'admin'] as const)
            .filter(tab => {
              if (userRole === 'limited') {
                return limitedAccessPages.includes(tab) || tab === 'sorteio';
              }
              return true;
            })
            .map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${activeTab === tab ? 'border-emerald-500 text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
              >
                {tab === 'sorteio' ? 'Sorteio' : tab === 'gerador' ? 'Gerador' : tab === 'exportar' ? 'Exportar' : tab === 'importar' ? 'Importar' : tab === 'cadastro' ? 'Cadastro' : tab === 'ajustes' ? '⚙️ Ajustes' : 'Admin'}
              </button>
            ))}
        </div>

        {/* CADASTRO TAB */}
        {activeTab === 'cadastro' && (
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white/5 rounded-3xl p-8">
                <h2 className="font-semibold text-xl mb-6">Nova Cartela</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/60">Nome do Jogador</label>
                    <input
                      value={currentName}
                      onChange={(e) => setCurrentName(e.target.value)}
                      placeholder="Ex: Maria Silva"
                      className="mt-1.5 w-full bg-white/10 border border-white/20 focus:border-emerald-500 rounded-2xl px-5 py-3.5 text-lg placeholder:text-white/30 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/60 mb-1.5 block">Números Manuais (25 números)</label>
                    <textarea
                      value={manualNumbers}
                      onChange={(e) => setManualNumbers(e.target.value)}
                      placeholder="1 15 23 47 62 8 19..."
                      className="w-full bg-white/10 border border-white/20 h-24 rounded-2xl p-4 text-sm resize-y font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button onClick={addManualCard} className="py-4 rounded-2xl bg-white text-black font-semibold active:scale-[0.985] transition">Adicionar Manual</button>
                    <button onClick={addAutoCard} className="py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-semibold active:scale-[0.985] transition">Gerar Automático</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de cartelas */}
            <div className="md:col-span-3">
              <div className="flex justify-between mb-4 px-1">
                <div className="font-medium">Cartelas Cadastradas ({cards.length})</div>
              </div>
              
              {cards.length === 0 ? (
                <div className="bg-white/5 rounded-3xl h-64 flex items-center justify-center text-white/40">Nenhuma cartela cadastrada</div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                  {cards.map(renderCard)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* GERADOR RAPIDO TAB */}
        {activeTab === 'gerador' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 rounded-3xl p-10 border border-white/10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">Gerador Rápido de Cartelas</h2>
                <p className="text-white/60">Gere múltiplas cartelas automáticas apenas com números</p>
              </div>

              {/* Linha 1: Quantidade + Gerar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                <div className="flex items-center gap-3 bg-black/40 rounded-2xl px-6 py-3 border border-white/10">
                  <label className="text-sm text-white/60">Quantidade:</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={bulkCount}
                    onChange={(e) => setBulkCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20 bg-transparent text-center text-xl font-mono outline-none"
                  />
                </div>
                <button 
                  onClick={() => {
                    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    const newCards = Array.from({ length: bulkCount }, (_, i) => {
                      const randomName = `Cartela ${letters[Math.floor(Math.random() * 26)]}${Math.floor(100 + Math.random() * 900)}`;
                      return generateRandomCard(randomName + ' #' + (cards.length + i + 1));
                    });
                    setCards([...cards, ...newCards]);
                  }}
                  className="h-14 px-10 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-lg rounded-2xl active:scale-[0.98] transition shadow-lg shadow-emerald-500/25"
                >
                  ⚡ Gerar {bulkCount} Cartela{bulkCount !== 1 ? 's' : ''}
                </button>
              </div>

              {/* Linha 2: Ações secundárias */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10 flex-wrap">
                <button 
                  onClick={() => window.print()}
                  className="h-12 px-6 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl text-sm transition border border-white/10"
                >
                  🖨️ Imprimir
                </button>
                <button 
                  onClick={() => setCards([])}
                  className="h-12 px-6 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-medium rounded-2xl text-sm transition border border-rose-500/30"
                >
                  🗑️ Excluir Todas
                </button>
                <button 
                  onClick={() => setActiveTab('exportar')}
                  className="h-12 px-6 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium rounded-2xl text-sm transition border border-emerald-500/30"
                >
                  📤 Ir para Exportação
                </button>
              </div>

                {/* Styles for printing - preenche toda a folha com todas as cartelas */}
              <style>{`
                @media print {
                  @page { size: A4; margin: 8mm; }
                  body * { visibility: hidden; }
                  .print-area, .print-area * { visibility: visible; }
                  .print-area { 
                    position: absolute; 
                    left: 0; 
                    top: 0; 
                    width: 100%; 
                    display: grid !important;
                    gap: 4mm !important;
                    max-height: none !important;
                    overflow: visible !important;
                    grid-template-columns: repeat(${getPrintLayoutConfig(cardsPerPage).cols}, 1fr) !important;
                  }
                  .print-card { 
                    width: ${getPrintLayoutConfig(cardsPerPage).cardWidth}mm !important;
                    height: auto !important; 
                    page-break-inside: avoid; 
                    break-inside: avoid; 
                    max-width: ${getPrintLayoutConfig(cardsPerPage).cardWidth}mm !important;
                  }
                  .no-print { display: none !important; }
                }
                .print-card { width: 5cm; height: auto; }
              `}</style>

                <div 
                  className="print-area grid gap-[5mm] max-h-[500px] overflow-y-auto pr-2"
                  style={{ gridTemplateColumns: `repeat(${getPrintLayoutConfig(cardsPerPage).cols}, minmax(0, 1fr))` }}
                >
                {cards.length === 0 ? (
                  <div className="col-span-4 text-center py-16 text-white/40 bg-black/20 rounded-2xl border border-white/5">
                    Nenhuma cartela gerada ainda<br />
                    <span className="text-sm">Defina a quantidade e clique em Gerar</span>
                  </div>
                ) : (
                  cards.map(card => (
                    <div key={card.id} className="print-card bg-white text-black rounded-[3mm] overflow-hidden border">
                      <div className="h-[9mm] bg-black text-white flex items-center justify-between px-[2mm] text-[7pt] font-bold">
                        <span className="truncate">{card.name.replace('Cartela ', '#')}</span>
                        <span className="font-mono">{card.id.toString().slice(-4)}</span>
                      </div>
                      <div className="p-[2mm]">
                        <div className="grid grid-cols-5 gap-[0.5mm]">
                          {BINGO_COLS.map((_, colIdx) => 
                            Array.from({ length: 5 }).map((__, rowIdx) => {
                              const idx = colIdx * 5 + rowIdx;
                              const num = card.numbers[idx];
                              return (
                                <div key={idx} className="aspect-square flex items-center justify-center text-[9pt] font-bold border border-gray-400">
                                  {num === 0 ? '★' : num}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cards.length > 0 && (
                <div className="mt-8 flex justify-between items-center text-sm text-white/50 px-1">
                  <span>{cards.length} cartela{cards.length !== 1 ? 's' : ''} gerada{cards.length !== 1 ? 's' : ''}</span>
                  <button onClick={() => setCards([])} className="text-white/40 hover:text-white/70 transition">Limpar todas</button>
                </div>
              )}
            </div>
            </div>
        )}

        {/* EXPORTAR TAB */}
        {activeTab === 'exportar' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-3xl p-10 border border-white/10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3">📤 Exportar Cartelas</h2>
                <p className="text-white/60">Escolha o formato de exportação das cartelas geradas</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {/* Card: Salvar JSON */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl p-6 border border-emerald-500/30">
                  <div className="text-4xl mb-3">💾</div>
                  <h3 className="font-bold text-lg mb-2">Salvar Arquivo JSON</h3>
                  <p className="text-sm text-white/60 mb-4">
                    Exporta as cartelas em formato JSON para importar posteriormente na aba Sorteio.
                  </p>
                  <button 
                    onClick={saveCardsAsJSON}
                    className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl transition"
                  >
                    💾 Salvar JSON
                  </button>
                </div>

                {/* Card: Exportar PDF */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl p-6 border border-blue-500/30">
                  <div className="text-4xl mb-3">📄</div>
                  <h3 className="font-bold text-lg mb-2">Exportar PDF</h3>
                  <p className="text-sm text-white/60 mb-4">
                    Gera arquivo PDF com as cartelas formatadas para impressão (requer senha).
                  </p>
                  <button 
                    onClick={exportCardsPDF}
                    disabled={cards.length === 0}
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-black font-semibold rounded-xl transition disabled:opacity-40"
                  >
                    📄 Exportar PDF
                  </button>
                </div>

                {/* Card: Imprimir */}
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl p-6 border border-purple-500/30">
                  <div className="text-4xl mb-3">🖨️</div>
                  <h3 className="font-bold text-lg mb-2">Imprimir Agora</h3>
                  <p className="text-sm text-white/60 mb-4">
                    Abre a janela de impressão do navegador com as cartelas no tamanho 5cm.
                  </p>
                  <button 
                    onClick={() => {
                      if (cards.length === 0) {
                        alert('Nenhuma cartela para imprimir!');
                        return;
                      }
                      setActiveTab('gerador');
                      setTimeout(() => window.print(), 100);
                    }}
                    className="w-full h-12 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition"
                  >
                    Imprimir
                  </button>
                </div>

                {/* Card: Estatísticas */}
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-2xl p-6 border border-amber-500/30">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="font-bold text-lg mb-2">Estatísticas</h3>
                  <div className="text-sm text-white/60 mb-4 space-y-1">
                    <div>Total de cartelas: <strong className="text-white">{cards.length}</strong></div>
                    <div>Números por cartela: <strong className="text-white">25</strong></div>
                    <div>Formato: <strong className="text-white">5×5 BINGO</strong></div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('gerador')}
                    className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition"
                  >
                    Ver Cartelas
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => setActiveTab('gerador')}
                  className="text-white/50 hover:text-white/80 text-sm transition"
                >
                  ← Voltar ao Gerador
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IMPORTAR TAB */}
        {activeTab === 'importar' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-3xl p-10 border border-white/10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3">📥 Importar Cartelas</h2>
                <p className="text-white/60">Carregue um arquivo JSON de cartelas exportado anteriormente</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl p-8 border border-blue-500/30 mb-8">
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-white/20 hover:border-blue-500/50 rounded-2xl p-10 text-center transition">
                    <div className="text-5xl mb-4">📁</div>
                    <div className="text-lg font-semibold mb-2">Clique para carregar arquivo JSON</div>
                    <div className="text-sm text-white/50">ou arraste e solte aqui</div>
                    <div className="text-xs text-white/40 mt-4">Formato aceito: .json</div>
                  </div>
                  <input
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        try {
                          const content = ev.target?.result as string;
                          if (!content || typeof content !== 'string') {
                            throw new Error('Arquivo vazio');
                          }

                          const data = JSON.parse(content);

                          if (!data.cards || !Array.isArray(data.cards) || data.cards.length === 0) {
                            throw new Error('Formato inválido: campo "cards" ausente ou vazio');
                          }

                          const importedCards: Card[] = data.cards
                            .filter((c: any) => c && typeof c === 'object')
                            .map((c: any, idx: number) => ({
                              id: Date.now() + idx + Math.floor(Math.random() * 1000),
                              name: (typeof c.name === 'string' && c.name) ? c.name : `Cartela Importada #${idx + 1}`,
                              numbers: (Array.isArray(c.numbers) && c.numbers.length === 25)
                                ? c.numbers.map((n: any) => Number(n) || 0)
                                : generateRandomCard('temp').numbers,
                              marked: new Set<number>([0])
                            }));

                          if (importedCards.length === 0) {
                            throw new Error('Nenhuma cartela válida encontrada');
                          }

                          setCards(prev => [...prev, ...importedCards]);
                          alert(`✓ ${importedCards.length} cartela(s) importada(s) com sucesso!`);
                        } catch (err: any) {
                          alert(`Erro ao importar: ${err?.message || 'Formato JSON inválido'}\n\nO arquivo deve estar no formato gerado pelo botão "Salvar Arquivo".`);
                        } finally {
                          if (e.target) (e.target as HTMLInputElement).value = '';
                        }
                      };
                      reader.onerror = () => {
                        alert('Erro ao ler o arquivo.');
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-emerald-400">{cards.length}</div>
                  <div className="text-xs text-white/50">Cartelas Carregadas</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-2xl font-bold text-blue-400">25</div>
                  <div className="text-xs text-white/50">Números por Cartela</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">📋</div>
                  <div className="text-2xl font-bold text-purple-400">JSON</div>
                  <div className="text-xs text-white/50">Formato Aceito</div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-sm text-amber-200">
                <strong className="text-amber-300">💡 Dica:</strong> As cartelas importadas serão adicionadas às cartelas já existentes. Se quiser começar do zero, use o botão "Excluir Todas" na aba Gerador antes de importar.
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => setActiveTab('sorteio')}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-2xl transition"
                >
                  Ir para Sorteio →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AJUSTES DO EVENTO TAB */}
        {activeTab === 'ajustes' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-3xl p-10 border border-white/10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">⚙️ Ajustes do Evento</h2>
                <p className="text-white/60">Configure as informações e aparência do seu bingo</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Título do Evento */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-white/70">Título do Bingo</label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Ex: Bingo Beneficente 2026"
                    className="w-full bg-black/40 border border-white/20 rounded-2xl px-5 py-3 text-lg outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Subtítulo / Descrição */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-white/70">Subtítulo / Descrição</label>
                  <textarea
                    value={eventSubtitle}
                    onChange={(e) => setEventSubtitle(e.target.value)}
                    placeholder="Ex: Sorteio ao vivo com prêmios incríveis!"
                    rows={3}
                    className="w-full bg-black/40 border border-white/20 rounded-2xl px-5 py-3 outline-none focus:border-emerald-500 resize-y"
                  />
                </div>

                {/* Prêmio do Compromisso */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">🏆 Prêmio do Compromisso</label>
                  <input
                    type="text"
                    value={eventPrize}
                    onChange={(e) => setEventPrize(e.target.value)}
                    placeholder="Ex: R$ 1.000,00 + Cesta Básica"
                    className="w-full bg-black/40 border border-white/20 rounded-2xl px-5 py-3 outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Regra para Sorteio */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">📋 Regra para Sorteio / Ganhador</label>
                  <select
                    value={eventRule}
                    onChange={(e) => setEventRule(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-2xl px-5 py-3 outline-none focus:border-emerald-500"
                  >
                    <option value="Cartela Cheia">Cartela Cheia</option>
                    <option value="Linha Completa">Linha Completa</option>
                    <option value="Coluna Completa">Coluna Completa</option>
                    <option value="Diagonal">Diagonal</option>
                    <option value="Quatro Cantos">Quatro Cantos</option>
                  </select>
                </div>

                {/* Cor da Cartela Digital */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">🎨 Cor da Cartela Digital</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { key: 'emerald', color: 'bg-emerald-500', label: 'Verde' },
                      { key: 'blue', color: 'bg-blue-500', label: 'Azul' },
                      { key: 'purple', color: 'bg-purple-500', label: 'Roxo' },
                      { key: 'rose', color: 'bg-rose-500', label: 'Rosa' },
                      { key: 'amber', color: 'bg-amber-500', label: 'Âmbar' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setCardColor(opt.key)}
                        className={`h-12 rounded-xl ${opt.color} ${cardColor === opt.key ? 'ring-4 ring-white' : 'opacity-60 hover:opacity-100'} transition`}
                        title={opt.label}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-white/40 mt-2">Cor usada nos números marcados</div>
                </div>

                {/* Cartelas por Folha */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">🖨️ Cartelas por Folha (A4)</label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[2, 3, 4, 6, 8, 9, 10, 12, 15].map(n => {
                      const cfg = getPrintLayoutConfig(n);
                      return (
                        <button
                          key={n}
                          onClick={() => setCardsPerPage(n)}
                          className={`px-3 py-2.5 rounded-xl border transition text-center ${
                            cardsPerPage === n
                              ? 'bg-emerald-500/20 border-emerald-500 text-white'
                              : 'bg-black/40 border-white/20 text-white/70 hover:border-white/40'
                          }`}
                        >
                          <div className="font-bold text-sm">{n}</div>
                          <div className="text-[10px] opacity-70">{cfg.cols}×{cfg.rows}</div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-xs text-white/60">
                    <div className="flex justify-between">
                      <span>Layout:</span>
                      <strong className="text-white">{getPrintLayoutConfig(cardsPerPage).cols} × {getPrintLayoutConfig(cardsPerPage).rows}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Largura cartela:</span>
                      <strong className="text-white">{getPrintLayoutConfig(cardsPerPage).cardWidth}mm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Altura cartela:</span>
                      <strong className="text-white">{getPrintLayoutConfig(cardsPerPage).cardHeight}mm</strong>
                    </div>
                  </div>
                </div>

                {/* Preview dos Ajustes */}
                <div className="md:col-span-2 mt-6">
                  <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-white/10">
                    <h3 className="font-semibold mb-4 text-white/80">📱 Preview do Evento</h3>
                    <div className="bg-black/40 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold mb-2">{eventTitle}</div>
                      <div className="text-sm text-white/60 mb-4">{eventSubtitle}</div>
                      {eventPrize && (
                        <div className="inline-block bg-emerald-500/20 border border-emerald-500/40 rounded-full px-4 py-2 text-sm">
                          🏆 <strong>{eventPrize}</strong>
                        </div>
                      )}
                      <div className="mt-4 text-xs text-white/40">
                        Regra: <span className="text-white/70">{eventRule}</span> • Cor: <span className="text-white/70">{cardColor}</span> • Impressão: <span className="text-white/70">{cardsPerPage} cartelas/folha</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão Salvar */}
                <div className="md:col-span-2 mt-4">
                  <button
                    onClick={() => {
                      alert('✓ Ajustes salvos com sucesso!\n\nAs configurações serão aplicadas automaticamente.');
                    }}
                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-lg rounded-2xl transition active:scale-[0.98]"
                  >
                    💾 Salvar Ajustes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN TAB */}
        {activeTab === 'admin' && userRole === 'admin' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-3xl p-10 border border-white/10">
              <h2 className="text-3xl font-bold mb-8">Painel de Controle • Senhas e Acessos</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-emerald-400">Senha Principal (Admin)</h3>
                    <p className="text-xs text-white/50 mb-3">Acesso total a todas as páginas e funções</p>
                    <input
                      type="text"
                      value={controlPassword}
                      onChange={(e) => setControlPassword(e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-2xl px-5 py-3 font-mono"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-amber-400">Senha de Acesso Limitado</h3>
                    <p className="text-xs text-white/50 mb-3">Para convidados e auxiliares</p>
                    <input
                      type="text"
                      value={limitedPassword}
                      onChange={(e) => setLimitedPassword(e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-2xl px-5 py-3 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Páginas Permitidas (Acesso Limitado)</h3>
                  <p className="text-xs text-white/50 mb-3">Separe por vírgula: sorteio, gerador, exportar, importar, cadastro, ajustes, admin</p>
                  <textarea
                    value={limitedAccessPages}
                    onChange={(e) => setLimitedAccessPages(e.target.value)}
                    className="w-full h-32 bg-black/50 border border-white/20 rounded-2xl px-5 py-3 font-mono text-sm"
                    placeholder="sorteio, gerador"
                  />
                  <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300">
                    <strong>Admin atual:</strong> {controlPassword}<br/>
                    <strong>Limitado atual:</strong> {limitedPassword}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SORTEIO TAB */}
        {activeTab === 'sorteio' && (
          <div className="max-w-7xl mx-auto">
            {/* Número sorteado + Propagandas */}
            <div className="flex flex-col xl:flex-row items-center justify-center gap-10 xl:gap-16 mb-10">
              {/* Propaganda Esquerda */}
              <div className="w-[250px] h-[250px] flex-shrink-0 relative">
                <label className="block w-full h-full cursor-pointer group relative bg-white/5 rounded-3xl border-2 border-dashed border-white/20 hover:border-emerald-500/50 overflow-hidden transition">
                  {adLeftImage ? (
                    <>
                      <img src={adLeftImage} alt="Propaganda Esquerda" className="w-full h-full object-cover" />
                      {userRole === 'admin' ? (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm font-semibold">
                          Trocar Imagem
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/40 p-4 text-center">
                      <div className="text-3xl mb-2">📢</div>
                      <div className="text-xs font-semibold">PROPAGANDA</div>
                      <div className="text-[10px] mt-1">
                        {userRole === 'admin' ? 'Clique para carregar (250×250)' : 'Espaço Reservado'}
                      </div>
                    </div>
                  )}
                  {userRole === 'admin' && (
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setAdLeftImage(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  )}
                </label>
                {userRole === 'admin' && adLeftImage && (
                  <button
                    onClick={() => {
                      if (confirm('Remover esta propaganda?')) setAdLeftImage('');
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg z-10"
                    title="Remover propaganda"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Número Sorteado (centro) */}
              <div className="flex flex-col items-center">
                <div className="text-center mb-6">
                  <div className={`font-mono text-[10rem] leading-none font-black tracking-[-8px] tabular-nums transition-all duration-200 ${isDrawingAnimation ? 'text-amber-400 scale-105' : 'text-emerald-400 scale-100'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {animatingNumber !== null ? String(animatingNumber).padStart(2, '0') : (drawnNumbers.length > 0 ? String(drawnNumbers[drawnNumbers.length - 1]).padStart(2, '0') : '--')}
                  </div>
                  <div className="text-[11px] tracking-[5px] text-white/50 mt-3 font-medium">
                    {isDrawingAnimation ? 'SORTEANDO...' : 'ÚLTIMO NÚMERO SORTEADO'}
                  </div>
                  {isDrawingAnimation && (
                    <div className="mt-3 flex gap-1 justify-center">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Propaganda Direita */}
              <div className="w-[250px] h-[250px] flex-shrink-0 relative">
                <label className="block w-full h-full cursor-pointer group relative bg-white/5 rounded-3xl border-2 border-dashed border-white/20 hover:border-emerald-500/50 overflow-hidden transition">
                  {adRightImage ? (
                    <>
                      <img src={adRightImage} alt="Propaganda Direita" className="w-full h-full object-cover" />
                      {userRole === 'admin' ? (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm font-semibold">
                          Trocar Imagem
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/40 p-4 text-center">
                      <div className="text-3xl mb-2">📢</div>
                      <div className="text-xs font-semibold">PROPAGANDA</div>
                      <div className="text-[10px] mt-1">
                        {userRole === 'admin' ? 'Clique para carregar (250×250)' : 'Espaço Reservado'}
                      </div>
                    </div>
                  )}
                  {userRole === 'admin' && (
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setAdRightImage(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  )}
                </label>
                {userRole === 'admin' && adRightImage && (
                  <button
                    onClick={() => {
                      if (confirm('Remover esta propaganda?')) setAdRightImage('');
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg z-10"
                    title="Remover propaganda"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Win condition selector + Botões */}
            <div className="flex flex-col items-center gap-4 mb-10">
              <div className="bg-white/5 rounded-2xl p-1 flex gap-1 flex-wrap justify-center">
                {[
                  { key: 'full', label: 'Cartela Cheia' },
                  { key: 'line', label: 'Linha' },
                  { key: 'column', label: 'Coluna' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setWinCondition(opt.key as any)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${winCondition === opt.key ? 'bg-emerald-500 text-black' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap justify-center">
                <button 
                  onClick={drawNumber} 
                  className="px-10 py-3.5 text-lg font-semibold bg-white text-black rounded-2xl active:scale-[0.985]"
                >
                  Sortear Número
                </button>
                <button 
                  onClick={toggleAutoDraw} 
                  className={`px-10 py-3.5 text-lg font-semibold rounded-2xl transition active:scale-[0.985] ${isAutoDrawing ? 'bg-rose-500' : 'bg-emerald-500'}`}
                >
                  {isAutoDrawing ? 'Parar Automático' : 'Auto Sorteio'}
                </button>
                {winners.length > 0 && (
                  <button 
                    onClick={() => {
                      if (confirm('Limpar vencedores para iniciar novo prêmio?')) {
                        winnerIdsRef.current = new Set();
                        setWinners([]);
                      }
                    }}
                    className="px-8 py-3.5 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-black rounded-2xl active:scale-[0.985]"
                  >
                    Novo Prêmio ({winners.length})
                  </button>
                )}
              </div>
            </div>

            {/* Layout 3 colunas: Números | Centro | Ranking */}
            <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-start">
              {/* Coluna esquerda: Números */}
              <div>
                <div className="text-[11px] font-medium tracking-[3px] mb-3 px-1 text-white/50">NÚMEROS SORTEADOS</div>
                <div className="bg-white/5 rounded-3xl p-4 border border-white/10 min-h-[420px]">
                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1).map(n => {
                      const isDrawn = drawnNumbers.includes(n);
                      return (
                        <div 
                          key={n} 
                          className={`aspect-square flex items-center justify-center rounded-xl text-[13px] font-mono font-medium transition-all ${
                            isDrawn 
                              ? 'bg-emerald-500 text-black font-bold scale-105' 
                              : 'bg-white/5 text-white/25'
                          }`}
                        >
                          {String(n).padStart(2, '0')}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-center">
                    <div className="text-[10px] text-white/40">TOTAL SORTEADOS</div>
                    <div className="text-2xl font-mono font-bold text-emerald-400">{drawnNumbers.length}<span className="text-white/30 text-lg">/{TOTAL_NUMBERS}</span></div>
                  </div>
                 </div>
              </div>

              {/* Centro: Upload e Winner */}
              <div className="flex flex-col gap-4">
                <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
                  <div className="text-[11px] font-medium tracking-[3px] mb-3 text-white/60">IMPORTAR CARTELAS</div>
                  <label className="block w-full cursor-pointer">
                    <div className="border-2 border-dashed border-white/20 hover:border-emerald-500/50 rounded-2xl p-5 text-center transition">
                      <div className="text-2xl mb-2">📁</div>
                      <div className="text-sm font-medium">Clique para carregar .json</div>
                      <div className="text-[11px] text-white/40 mt-1">Arquivo salvo anteriormente</div>
                    </div>
                    <input 
                      type="file" 
                      accept=".json,.txt,application/json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          try {
                            const content = ev.target?.result as string;
                            if (!content || typeof content !== 'string') {
                              throw new Error('Arquivo vazio');
                            }
                            
                            const data = JSON.parse(content);
                            
                            if (!data.cards || !Array.isArray(data.cards) || data.cards.length === 0) {
                              throw new Error('Formato inválido: campo "cards" ausente ou vazio');
                            }
                            
                            const importedCards: Card[] = data.cards
                              .filter((c: any) => c && typeof c === 'object')
                              .map((c: any, idx: number) => ({
                                id: Date.now() + idx + Math.floor(Math.random() * 1000),
                                name: (typeof c.name === 'string' && c.name) ? c.name : `Cartela Importada #${idx + 1}`,
                                numbers: (Array.isArray(c.numbers) && c.numbers.length === 25) 
                                  ? c.numbers.map((n: any) => Number(n) || 0) 
                                  : generateRandomCard('temp').numbers,
                                marked: new Set<number>([0])
                              }));
                            
                            if (importedCards.length === 0) {
                              throw new Error('Nenhuma cartela válida encontrada');
                            }
                            
                            setCards(prev => [...prev, ...importedCards]);
                            alert(`✓ ${importedCards.length} cartela(s) importada(s) com sucesso!`);
                          } catch (err: any) {
                            alert(`Erro ao importar: ${err?.message || 'Formato JSON inválido'}\n\nO arquivo deve estar no formato gerado pelo botão "Salvar Arquivo".`);
                          } finally {
                            if (e.target) (e.target as HTMLInputElement).value = '';
                          }
                        };
                        reader.onerror = () => {
                          alert('Erro ao ler o arquivo.');
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>
                  <div className="mt-3 text-[10px] text-center text-white/30">
                    {cards.length} cartela{cards.length !== 1 ? 's' : ''} carregada{cards.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {winners.length > 0 && (
                  <div className="bg-emerald-500 text-black rounded-3xl px-6 py-5 text-center">
                    <div className="uppercase tracking-[3px] text-[10px] font-bold mb-2">
                      🏆 VENCEDOR{winners.length > 1 ? 'ES' : ''} ({winners.length})
                    </div>
                    <div className="space-y-1.5">
                      {winners.map((w, idx) => (
                        <div key={w.id} className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold bg-black/20 w-6 h-6 rounded-full flex items-center justify-center">
                            {idx + 1}º
                          </span>
                          <span className="text-lg font-bold tracking-tighter leading-tight flex-1 truncate">{w.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Coluna direita: Ranking */}
              <div>
                <div className="text-[11px] font-medium tracking-[3px] mb-3 px-1 text-white/50">RANKING TEMPO REAL</div>
                <div className="bg-white/5 rounded-3xl p-4 border border-white/10 min-h-[420px]">
                  {cards.length === 0 ? (
                    <div className="text-white/30 text-sm py-16 text-center">Sem cartelas</div>
                  ) : (
                    <div className="space-y-2">
                      {[...cards]
                        .sort((a, b) => (b.marked.size - 1) - (a.marked.size - 1))
                        .slice(0, 10)
                        .map((card, idx) => {
                          const markedCount = card.marked.size - 1;
                          const missing = 24 - markedCount;
                          return (
                            <div 
                              key={card.id} 
                              className={`flex items-center gap-2.5 p-2.5 rounded-2xl ${idx === 0 ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-white/[0.03]'}`}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${idx === 0 ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/60'}`}>
                                {idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-medium truncate leading-tight">{card.name.replace('Cartela ', '#')}</div>
                                <div className="text-[10px] text-white/45">{markedCount}/24</div>
                              </div>
                              <div className={`text-right font-mono ${
                                missing === 1 ? 'text-emerald-400' : 
                                missing === 2 ? 'text-blue-400' : 
                                missing === 3 ? 'text-rose-400' : 
                                'text-white/55'
                              }`}>
                                <div className="text-[13px] font-bold leading-none">{missing}</div>
                                <div className="text-[9px] leading-none opacity-70">falta{missing !== 1 ? 'm' : ''}</div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cartelas abaixo */}
            <div className="mt-10">
              <div className="font-medium mb-4 px-1 text-[11px] tracking-[2px] text-white/50">CARTELAS ATIVAS ({cards.length})</div>
              {cards.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cards.map(renderCard)}
                </div>
              ) : (
                <div className="text-center py-16 text-white/40 bg-white/5 rounded-3xl">Cadastre cartelas primeiro</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapper com ErrorBoundary para capturar erros e evitar tela branca
export default function App() {
  return (
    <ErrorBoundary>
      <BingoApp />
    </ErrorBoundary>
  );
}
