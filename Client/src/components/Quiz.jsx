import { useState, useEffect } from "react";
import Question from "./Question";
import "./Quiz.css";

export default function Quiz({ voltarInicio }) {
  //usuario logado
  let usuarioId = null;
  const userString = localStorage.getItem("user");

  if (userString) {
    try {
      const userObj = JSON.parse(userString); // convertendo pra string
      usuarioId = userObj.id; // acessando o id
    } catch (e) {
      console.error("Erro ao fazer parse do objeto user no localStorage:", e);
    }
  }

  //se for string vira numero
  const usuarioIdNumero = Number(usuarioId);

  //states (atualizar tela)
  const [questions, setQuestions] = useState([]);
  const [indice, setIndice] = useState(0);
  const [pontuacao, setPontuacao] = useState(0); // Pontos ganhos SÓ NESTA rodada
  const [fim, setFim] = useState(false);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);
  const [acertou, setAcertou] = useState(false);
  const [carregando, setCarregando] = useState(true);
  
  // NOVO STATE: Para guardar o saldo total que vem do banco
  const [saldoTotal, setSaldoTotal] = useState(null);

  //pegando do back
  useEffect(() => {
    fetch("http://localhost:3001/api/quiz")
      .then((res) => res.json())
      .then((data) => {
        const lista = Array.isArray(data) ? data : [data];

        //transformando as questos  o formato
        const adaptadas = lista.map((q) => ({
          id: q.id,
          pergunta: q.pergunta,
          alternativas: [
            q.alternativa_a,
            q.alternativa_b,
            q.alternativa_c,
            q.alternativa_d,
          ],
          resposta: q.resposta,
          explicacaocerta: q.explicacaocerta,
          explicacaoerrada: q.explicacaoerrada,
        }));
        setQuestions(adaptadas);
        setCarregando(false);
      })
      .catch((err) => {
        //erro
        console.error("Não buscou o quiz : ", err);
        setCarregando(false);
      });
  }, []);

  useEffect(() => {
    if (fim && usuarioIdNumero) {
      async function atualizarSaldo() {
        try {
          // Chama a rota que criamos para pegar o saldo real
          const res = await fetch(`http://localhost:3001/api/usuarios/${usuarioIdNumero}/saldo`);
          if (res.ok) {
            const data = await res.json();
            setSaldoTotal(data.moedas);

            // Atualiza o localStorage para garantir sincronia
            const userLocal = JSON.parse(localStorage.getItem("user"));
            if (userLocal) {
              userLocal.saldo = data.moedas; // ou userLocal.moedas
              localStorage.setItem("user", JSON.stringify(userLocal));
            }

            window.dispatchEvent(new Event("balanceUpdated"));
          }
        } catch (error) {
          console.error("Erro ao buscar saldo final:", error);
        }
      }
      atualizarSaldo();
    }
  }, [fim, usuarioIdNumero]);
  // -------------------------------------------------------------

  //pegarreposta, qd o usuario escolhe uma resposta, checando se acertou e mostrando explicação
  const pegarReposta = async (alternativa) => {
    const questaoAtual = questions[indice];
    //validcacao de usuario
    if (!usuarioIdNumero || usuarioIdNumero <= 0) {
      console.error("Usuário não logado, ID inválido ou falha na leitura.");
      alert("Sua sessão expirou ou o login é necessário para responder.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/quiz/responder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: usuarioIdNumero,
          questao_id: questaoAtual.id,
          resposta: alternativa,
        }),
      });

      const data = await res.json();

      if (data.acertou) {
        setPontuacao((p) => p + data.moedas_ganhas);
        setAcertou(true);

        window.dispatchEvent(new Event("balanceUpdated"));
      } else {
        setAcertou(false);
      }

      setMostrarExplicacao(true);
    } catch (error) {
      console.error("Erro ao responder quiz:", error);
    }
  };

  //pasando pra prox pergunta
  const proximaPergunta = () => {
    const next = indice + 1;
    if (next < questions.length) {
      setIndice(next);
      setMostrarExplicacao(false);
    } else {
      setFim(true);
    }
  };
  //estados do carregamento
  if (carregando) {
    return (
      <div className="quiz-inner-wrapper">
        <h2>Carregando Perguntas...</h2>
      </div>
    );
  }

  //caso tenha acabado
  if (fim) {
    return (
      <div className="quiz-inner-wrapper container-resultado">
        <h1>Fim do Quiz!</h1>
        
        {/* Mostra quanto ganhou na partida */}
        <div className="destaque-pontuacao">
          <p>Você ganhou nesta rodada:</p>
          <span className="exibir-moedas" style={{color: '#4CAF50'}}> +{pontuacao} 🪙</span>
        </div>

        <div className="destaque-pontuacao" style={{marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px'}}>
            <p>Seu Saldo Total:</p>
            <span className="exibir-moedas"> {saldoTotal !== null ? saldoTotal : "..."} 🪙</span>
        </div>

        <div className="acertos-erros">
          <div className="stat-box correto">
            <span className="stat-label">Corretas</span>
            <span className="stat-valor">{pontuacao}</span> 
            {/* Assumindo que 1 ponto = 1 acerto */}
          </div>
          <div className="stat-box errado">
            <span className="stat-label">Erradas</span>
            <span className="stat-valor">{questions.length - pontuacao}</span>
          </div>
        </div>

        <button className="btn-fim-quiz" onClick={voltarInicio}>
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    //mostrando as moedas
    <div className="quiz-inner-wrapper">
      <h1>Quiz sobre ISTs</h1>
      {/* Aqui mostra o score da partida atual */}
      <div>Pontos da rodada : {pontuacao} 🪙</div>

      {!mostrarExplicacao ? ( // se mostrar explicacao tiver falso, mostra pergunta
        //se tiver verdadeiro, vai pra tela da explicação
        <Question
          pergunta={questions[indice].pergunta}
          alternativas={questions[indice].alternativas}
          onResposta={pegarReposta}
        />
      ) : (
        <div>
          <h2>
            {acertou ? "Parabéns, você acertou!" : "Que pena, você errou."}
          </h2>
          <div className="explicacao">
            {acertou
              ? questions[indice].explicacaocerta
              : questions[indice].explicacaoerrada}
          </div>
          <button className="btn-quiz" onClick={proximaPergunta}>
            Próxima pergunta
          </button>
        </div>
      )}
    </div>
  );
}