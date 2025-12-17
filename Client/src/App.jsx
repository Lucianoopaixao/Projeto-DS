import "./App.css";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Importações dos seus componentes
import Login from "./components/Login";
import Quiz from "./components/Quiz";
import FollowTreatment from "./components/FollowTreatment";
import RegisterAppointment from "./components/RegisterAppointment";
import Check from "./components/Check";
import Inicio from "./components/Inicio";
import Carteira from "./components/Carteira"; 

import QuizConfirmImage from "./assets/quiz.svg";

const RotaProtegida = ({ children }) => {
  const token = localStorage.getItem("token");

  // Se não tiver token, chuta o usuário para a tela de Login ("/")
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Se tiver token, renderiza o conteúdo (Home + Carteira)
  return children;
};

function SistemaDoJogo() {
  const [tela, setTela] = useState("Introdução");
  const [documentAccepted, setDocumentAccepted] = useState(false);

  // Função para DESLOGAR
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const renderWrapper = (children) => (
    <div className="inner-wrapper">{children}</div>
  );

  if (tela === "Introdução") {
    // DICA: Se não quiser a carteira na tela de "Clique para começar", 
    // teríamos que mudar a lógica, mas aqui ela aparecerá conforme pedido.
    return <div className="intro" onClick={() => setTela("Início")}></div>;
  }

  if (tela === "Início") {
    return (
      <Inicio
        irParaQuiz={() => setTela("confirmar-quiz")}
        irParaAcompanhar={() => setTela("acompanhar")}
      />
    );
  }

  // TELA DE CONFIRMAÇÃO DO QUIZ
  if (tela === "confirmar-quiz") {
    return renderWrapper(
      <>
        <h1>Quiz sobre ISTs</h1>
        <p>Você está prestes a iniciar o Quiz sobre ISTs. Deseja continuar?</p>

        <img
          src={QuizConfirmImage}
          alt="Ilustração de confirmação do Quiz"
          className="quiz-confirm-img"
        />

        <div className="button-row">
          <button onClick={() => setTela("quiz")}>Iniciar</button>
          <button onClick={() => setTela("Início")}>Voltar</button>
        </div>
      </>
    );
  }

  if (tela === "quiz") {
    return <Quiz voltarInicio={() => setTela("Início")} />;
  }
  
  // Acompanhar tratamento
  if (tela === "acompanhar") {
    return (
      <FollowTreatment
        onBack={() => setTela("Início")}
        onFirstAction={() => setTela("registrar-consulta")}
        onSecondAction={() => setTela("check")}
      />
    );
  }
  
  // Registrar consulta
  if (tela === "registrar-consulta") {
    return <RegisterAppointment onBack={() => setTela("acompanhar")} />;
  }
  
  // Parte do check-in
  if (tela === "check") {
    return (
      <Check
        onBack={() => setTela("acompanhar")}
        documentAccepted={documentAccepted}
        setDocumentAccepted={setDocumentAccepted}
      />
    );
  }

  return null;
}

// --- APP PRINCIPAL EDITADO ---
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Pública: Login (Sem Carteira) */}
        <Route path="/" element={<Login />} />

        {/* Rota Pública: Cadastro */}
        <Route path="/cadastro" element={<div>Cadastro</div>} />

        {/* Rota PROTEGIDA: Home (Com Carteira) */}
        <Route
          path="/home"
          element={
            <RotaProtegida>
              {/* Usamos o Fragment (<>...</>) para agrupar o Jogo e a Carteira */}
              <>
                <SistemaDoJogo />
                <Carteira /> {/* <-- ADICIONADO AQUI */}
              </>
            </RotaProtegida>
          }
        />
      </Routes>
    </Router>
  );
}