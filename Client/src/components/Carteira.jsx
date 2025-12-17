import { useState, useEffect } from 'react';
import { Coins, Loader2 } from 'lucide-react';

export default function Carteira() {
  const [moedas, setMoedas] = useState(0);
  const [loading, setLoading] = useState(true);

  const userLocal = JSON.parse(localStorage.getItem('user'));
  const userId = userLocal?.id; 
  
  // URL base da sua API
  const API_URL = "http://localhost:3001/api"; 

  // Função que busca o saldo no servidor
  const buscarSaldo = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/usuarios/${userId}/saldo`);
      
      if (response.ok) {
        const data = await response.json();
        setMoedas(data.moedas);
      }
    } catch (error) {
      console.error("Erro ao atualizar saldo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Busca o saldo assim que a carteira aparece na tela
    buscarSaldo();

    // 2. A "ORELHA": Fica ouvindo se alguém grita "balanceUpdated"
    // Isso acontece quando você termina o Quiz ou faz Check-in
    window.addEventListener('balanceUpdated', buscarSaldo);

    // 3. Limpeza: Desliga a escuta quando sai da tela para não dar erro
    return () => {
      window.removeEventListener('balanceUpdated', buscarSaldo);
    };
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed z-50 hover:scale-105 transition-transform"
      style={{ top: '20px', left: '20px', position: 'fixed' }}>
      <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
        <div className="text-yellow-500">
           {/* Se der erro no ícone, pode trocar <Coins /> por um emoji 🪙 */}
           <Coins size={24} /> 
        </div>
        <div className="flex items-center">
          {loading ? (
            <Loader2 className="animate-spin h-4 w-4 text-zinc-400" />
          ) : (
            <span className="font-extrabold text-xl text-zinc-800 dark:text-white leading-none">
              {Math.floor(moedas)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}