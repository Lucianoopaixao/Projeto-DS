// FollowTreatment.jsx

import "./FollowTreatment.css";
// Certifique-se de que os caminhos para as imagens estão corretos!
import CheckInIcon from "../assets/check.svg"; // Imagem para Fazer Check-in
import ConsultaIcon from "../assets/consulta.svg"; // Imagem para Registrar consulta

export default function FollowTreatment({
  onBack,
  onFirstAction,
  onSecondAction,
}) {
  return (
    // Usa a classe do wrapper da tela 'Inicio'
    <div className="inicio-wrapper">
      <h1 className="inicio-title">Acompanhar Tratamento</h1>

      {/* Usa a classe da linha de imagens da tela 'Inicio' */}
      <div className="inicio-images-row">
        <img
          src={CheckInIcon}
          className="inicio-img"
          alt="Fazer Check-in de medicamentos"
        />
        <img
          src={ConsultaIcon}
          className="inicio-img"
          alt="Registrar consulta médica"
        />
      </div>

      {/* Usa a classe da linha de botões da tela 'Inicio' */}
      <div className="inicio-buttons-row">
        {/* Ordem dos botões corresponde à ordem das imagens acima */}
        <button className="btn-primary" onClick={onSecondAction}>
          Fazer Check-in
        </button>
        <button className="btn-primary" onClick={onFirstAction}>
          Registrar consulta
        </button>
      </div>

      {/* O botão Voltar pode ser mantido fora do layout principal ou ajustado */}
      <div className="ft-back">
        <button className="btn-secondary" onClick={onBack}>
          Voltar
        </button>
      </div>
    </div>
  );
}
