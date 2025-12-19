# SAÚDE EM JOGO

> **Parceria:** Solução desenvolvida em colaboração acadêmica com a **Prefeitura do Recife**.

![Badge Status](http://img.shields.io/static/v1?label=STATUS&message=CONCLUÍDO&color=SUCCESS&style=for-the-badge)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Testing Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)

## Sobre o Projeto:

Este projeto consiste em uma plataforma web voltada para a saúde pública, com foco no monitoramento e prevenção de **Infecções Sexualmente Transmissíveis (IST)**.

O objetivo foi amenizar a exposição, implementando também um sistema de **Gamificação**. A plataforma incentiva o autocuidado: ao realizar exames e enviar comprovantes de saúde, o usuário acumula pontos (moedas virtuais), promovendo o engajamento na saúde preventiva.

---

## Galeria do Projeto:

<h3 align="center"> Tela de Login:</h3>
<div align="center">
  <img width="1890" alt="login png" src="https://github.com/user-attachments/assets/795cd3f4-c893-4dfd-89bd-4365c12dac36" />
</div>

<br>

<h3 align="center"> Tela de Início:</h3>
<div align="center">
  <img width="1434" alt="telainicial png" src="https://github.com/user-attachments/assets/bf89be14-28f2-4699-b10c-9e8249df067d" />
</div>

<br>

<h3 align="center"> Quiz:</h3>
<div align="center">
  <img width="1433" alt="quiz png" src="https://github.com/user-attachments/assets/2c05f200-693c-4613-9c29-a839e02c1e89" />
</div>

<br>

<h3 align="center"> Tela Acompanhar Tratamento:</h3>
<div align="center">
  <img width="1413" alt="acompanhartratamento png" src="https://github.com/user-attachments/assets/f1f7404e-6e29-4fe1-be46-67f3580deacb" />
</div>

<br>

<h3 align="center"> Tela de Check-in:</h3>
<div align="center">
  <img width="1414" alt="checkin png" src="https://github.com/user-attachments/assets/608a8ae6-5ca5-4a60-8d0c-5de914b920c7" />
</div>

<br>

<h3 align="center"> Tela de Consultas:</h3>
<div align="center">
  <img width="1439" alt="consulta png" src="https://github.com/user-attachments/assets/18076053-5a6d-4b6d-9d6c-829b01134198" />
</div>

## Funcionalidades:

* **Autenticação Segura:** Proteção de dados sensíveis de pacientes.
* **Quiz Educativo:** Perguntas focadas no combate à desinformação sobre ISTs.
* **Sistema de Gamificação:** Lógica de negócio que converte ações de saúde (uploads) em saldo de pontos.
* **Upload de Comprovantes:** Envio de arquivos com validação de segurança.
* **Dashboard Interativo:** Painel do usuário com histórico de medicamentos e pontuação atualizada.

---

## Estratégia de QA e Testes:

A qualidade de software foi o pilar central deste desenvolvimento. Utilizamos uma abordagem híbrida de testes automatizados para garantir a estabilidade do sistema.

### 1. Frontend (Component Testing & UI)
Utilizamos **Vitest** e **React Testing Library** rodando em ambiente simulado (JSDOM/Headless) para garantir performance e isolamento.

* **Mocking de Rede (Axios):** Implementamos interceptadores de requisições para simular cenários de:
    * *Sucesso:* Carregamento correto do dashboard.
    * *Falha de Segurança:* Tentativas de login inválido.
    * *Resiliência:* Comportamento da UI quando há queda de internet ("Erro de Conexão").
* **Testes de Usabilidade (Black Box):** Validação de estados condicionais. Exemplo: O botão de "Enviar" permanece bloqueado (`disabled`) até que o usuário anexe um arquivo válido.

### 2. Backend (API & Lógica)
Utilizamos **Jest** com foco em integridade e segurança.

* **Validação de Segurança (Status Codes):** Testes automatizados verificam se rotas protegidas retornam estritamente `401 Unauthorized` para acessos indevidos.
* **Regras de Negócio (Integração):** Automação do fluxo "Saúde vira Pontos". O teste simula o envio de um comprovante e verifica no banco se o saldo foi incrementado.
* **Cobertura de Código (White Box):** Análise estática para garantir que tratamentos de erro (`try/catch`) sejam exercitados, enviando payloads corrompidos para testar a robustez do servidor.

---

## Tecnologias Utilizadas:

**Frontend:**
* React.js (Hooks e Context API)
* Axios (Requisições HTTP)
* CSS Modules / Styled Components

**Backend:**
* Framework Web 
* Jest & React Testing Library
* Pytest & Pytest-cov
* Postman (Testes manuais de API)

---
## Integrantes da Equipe
 
- Clarissa Honório  
- Jaiane Evilásio  
- Lavinya Souza  
- Luciano Paixão  
- Marcos Silva
- Mateus Barbosa

---
