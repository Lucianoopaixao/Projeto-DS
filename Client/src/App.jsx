import "./App.css";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Quiz from "./components/Quiz";
import FollowTreatment from "./components/FollowTreatment";
import RegisterAppointment from "./components/RegisterAppointment";
import Check from "./components/Check";
import Inicio from "./components/Inicio";

import QuizConfirmImage from "./assets/quiz.svg";


const RotaProtegida = ({ children }) => {
  const token = localStorage.getItem("token");

  // Se não tiver token, chuta o usuário para a tela de Login ("/")
  if (!token) {
    // Corrigindo caracteres especiais (era 'no')
    return <Navigate to="/" replace />;
  }

  // Se tiver token, renderiza o conteúdo (a Home)
  return children;
};

function SistemaDoJogo() {
  // Corrigindo caracteres especiais
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

  // TELA DE CONFIRMAÇÃO DO QUIZ (AJUSTADA PARA INCLUIR IMAGEM)
  if (tela === "confirmar-quiz") {
    return renderWrapper(
      <>
        <h1>Quiz sobre ISTs</h1>
        <p>Você está prestes a iniciar o Quiz sobre ISTs. Deseja continuar?</p>

        {/* INSERÇÃO DA IMAGEM */}
        <img
          src={QuizConfirmImage}
          alt="Ilustração de confirmação do Quiz"
          className="quiz-confirm-img"
        />

        <div className="button-row">
          <button onClick={() => setTela("quiz")}>Iniciar</button>
          {/* Corrigindo caracteres especiais */}
          <button onClick={() => setTela("Início")}>Voltar</button>
        </div>
      </>
    );
  }

  if (tela === "quiz") {
    // Corrigindo caracteres especiais
    return <Quiz voltarInicio={() => setTela("Início")} />;
  }
  //acompanhar tratamento
  if (tela === "acompanhar") {
    return (
      <FollowTreatment
        // Corrigindo caracteres especiais
        onBack={() => setTela("Início")}
        onFirstAction={() => setTela("registrar-consulta")}
        onSecondAction={() => setTela("check")}
      />
    );
  }
  //registrar consulta
  if (tela === "registrar-consulta") {
    return <RegisterAppointment onBack={() => setTela("acompanhar")} />;
  }
  //parte do check-in
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

//tela de login
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Pública: Login */}
        <Route path="/" element={<Login />} />

        {/* Rota Pública: Cadastro (se existir) */}
        <Route path="/cadastro" element={<div>Cadastro</div>} />

        {/* Rota PROTEGIDA: Home */}
        <Route
          path="/home"
          element={
            <RotaProtegida>
              <SistemaDoJogo />
            </RotaProtegida>
          }
        />
      </Routes>
    </Router>
  );
}
