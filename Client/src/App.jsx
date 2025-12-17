import "./App.css";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Importacoes dos seus componentes
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

  // Se nao tiver token, chuta o usuario para a tela de Login ("/")
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Se tiver token, renderiza o conteudo (Home + Carteira)
  return children;
};

function SistemaDoJogo() {
  const [tela, setTela] = useState("Introdução");
  const [documentAccepted, setDocumentAccepted] = useState(false);

  // Funcao para DESLOGAR
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const renderWrapper = (children) => (
    <div className="inner-wrapper">{children}</div>
  );

  if (tela === "Introducao") {
    //Se nao quiser a carteira na tela de "Clique para comecar", 
    // teríamos que mudar a logica, mas aqui ela aparecera conforme pedido.
    return <div className="intro" onClick={() => setTela("Início")}></div>;
  }

  if (tela === "Ini�cio") {
    return (
      <Inicio
        irParaQuiz={() => setTela("confirmar-quiz")}
        irParaAcompanhar={() => setTela("acompanhar")}
      />
    );
  }

  // TELA DE CONFIRMACAO DO QUIZ
  if (tela === "confirmar-quiz") {
    return renderWrapper(
      <>
        <h1>Quiz sobre ISTs</h1>
        <p>Você está prestes a iniciar o Quiz sobre ISTs. Deseja continuar?</p>

        <img
          src={QuizConfirmImage}
          alt="Ilustracao de confirmacao do Quiz"
          className="quiz-confirm-img"
        />

        <div className="button-row">
          <button onClick={() => setTela("quiz")}>Iniciar</button>
          <button onClick={() => setTela("Ini�cio")}>Voltar</button>
        </div>
      </>
    );
  }

  if (tela === "quiz") {
    return <Quiz voltarInicio={() => setTela("Ini�cio")} />;
  }
  
  // Acompanhar tratamento
  if (tela === "acompanhar") {
    return (
      <FollowTreatment
        onBack={() => setTela("Inicio")}
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

//APP PRINCIPAL
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Publica: Login (Sem Carteira) */}
        <Route path="/" element={<Login />} />

        {/* Rota Publica: Cadastro */}
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