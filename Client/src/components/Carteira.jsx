import { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';

export default function Carteira() {
  const [moedas, setMoedas] = useState(0);
  const userLocal = JSON.parse(localStorage.getItem('user'));
  const userId = userLocal?.id; 

  useEffect(() => {
    if (userId) {
      // Faz o fetch simples. Se der erro, paciência (log no console e vida que segue)
      fetch(`http://localhost:3001/api/usuarios/${userId}/saldo`)
        .then(res => {
            if(res.ok) return res.json();
            throw new Error("Erro ao buscar saldo");
        })
        .then(data => setMoedas(data.moedas))
        .catch(err => console.error("Erro simples:", err));
    }
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed z-50 top-5 left-5">
      <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2">
        <div className="text-yellow-500"><Coins size={24} /></div>
        <span className="font-bold text-xl text-gray-800">
          {moedas}
        </span>
      </div>
    </div>
  );
}