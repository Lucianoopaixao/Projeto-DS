import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import './Carteira.css';

export default function Carteira() {
  const [moedas, setMoedas] = useState(0);
  const [loading, setLoading] = useState(true);

  const userLocal = JSON.parse(localStorage.getItem('user'));
  const userId = userLocal?.id; 
  
  const API_URL = "http://localhost:3001/api"; 

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
    buscarSaldo();
    window.addEventListener('balanceUpdated', buscarSaldo);
    return () => {
      window.removeEventListener('balanceUpdated', buscarSaldo);
    };
  }, [userId]);

  if (!userId) return null;

  return (
    // Usando a classe do CSS puro
    <div className="carteira-container">
      
      {/* Ícone da moeda */}
      <div className="carteira-icon">🪙</div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {loading ? (
          <Loader2 className="animate-spin" size={24} color="#ccc" />
        ) : (
          /* Número do saldo */
          <span className="carteira-saldo">
            {Math.floor(moedas)}
          </span>
        )}
      </div>
    </div>
  );
}