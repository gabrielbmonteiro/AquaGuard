# 💧 AquaGuard: Monitoramento de Água Inteligente

<p align="center">
  <img src="https://github.com/gabrielbmonteiro/AquaGuard/blob/main/assests/aquaguard-logo.png" alt="AquaGuard Logo" width="500"/>
</p>

<p align="center">
  <strong>Monitoramento em tempo real, análise de consumo e alertas inteligentes para uma gestão de água mais consciente e econômica.</strong>
</p>

<p align="center">&nbsp;</p> <p align="center">
  <a href="https://www.figma.com/design/E1DOlAAqGxfsNUSdUMuM6L/Prot%C3%B3tipo---AquaGuard?node-id=0-1&p=f&t=808FO5iqxMpMaPWB-0">
    <img src="https://img.shields.io/badge/Acessar%20Protótipo-Figma-%23F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Link para o Protótipo no Figma"/>
  </a>
</p>

## O Problema

Em um mundo onde a água é um recurso cada vez mais valioso, a falta de visibilidade sobre o consumo diário leva a desperdícios significativos, vazamentos não detectados e contas de água inesperadamente altas. Muitas famílias e empresas não possuem as ferramentas para entender seus próprios padrões de uso, tornando a economia de água uma tarefa difícil e baseada em suposições.

## Nossa Solução

O **AquaGuard** ataca esse problema de frente, oferecendo um ecossistema completo que conecta um dispositivo de hardware a uma aplicação móvel intuitiva. Nossa missão é dar aos usuários o poder de controlar seu consumo de água através de dados precisos e insights acionáveis, transformando a maneira como interagem com este recurso vital.

- **Monitore em Tempo Real:** Saiba o nível exato da sua caixa d'água a qualquer hora, de qualquer lugar.
- **Analise e Entenda:** Com gráficos e relatórios detalhados, identifique picos de consumo e entenda seus hábitos.
- **Economize e Previna:** Defina metas, receba alertas sobre possíveis vazamentos e evite surpresas na sua fatura.

## ✨ Funcionalidades em Destaque

- **Dashboard Intuitivo:** Visualize o nível atual, a previsão de término e o status de consumo em relação às suas metas diárias, semanais e mensais.
- **Análise Histórica Avançada:** Explore gráficos interativos para analisar o consumo por diferentes períodos e identificar tendências e anomalias.
- **Metas Personalizadas:** Configure metas de consumo diário, semanal e mensal para se desafiar a economizar.
- **Gerenciamento de Conta e Dispositivos:** Uma experiência de usuário fluida para registrar, parear múltiplos dispositivos e gerenciar seus dados de forma segura e centralizada.
- **Segurança:** Autenticação robusta via JWT e um sistema de desativação (soft delete) que preserva a integridade dos dados históricos.

## 🔧 O Ecossistema AquaGuard

O AquaGuard é composto por dois projetos principais que trabalham em conjunto:

1.  **Backend API (Este Repositório):** A espinha dorsal do sistema, construída com Java e Spring Boot. É responsável por toda a lógica de negócio, segurança, persistência de dados e por servir as informações para a aplicação do usuário.
2.  **Sistema Embarcado:** O cérebro do hardware. Este projeto contém o firmware para o microcontrolador que realiza a medição do volume de água e se comunica de forma segura com a nossa API.
    - **Confira o repositório do sistema embarcado:** `(https://github.com/Leonardobrzz/Water-Level-Monitoring)`

## 🛠️ Tecnologias Utilizadas (Backend)

- **Linguagem:** Java 21
- **Framework:** Spring Boot 3
- **Segurança:** Spring Security com autenticação JWT
- **Banco de Dados:** Spring Data JPA / Hibernate com MySQL
- **Migrações de BD:** Flyway
- **Build:** Maven

## 🚀 Como Executar o Backend

Para executar a API localmente, você precisará ter o Java (JDK 21) e o Maven instalados.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/gabrielbmonteiro/AquaGuard.git](https://github.com/gabrielbmonteiro/AquaGuard.git)
    cd AquaGuard
    ```

2.  **Configure o Banco de Dados:**
    - Crie um banco de dados MySQL chamado `aquaguard_api`.
    - Atualize as credenciais do banco no arquivo `api/src/main/resources/application.yml`.

3.  **Execute a aplicação a partir da pasta `api`:**
    ```bash
    cd api
    mvn spring-boot:run
    ```

A API estará disponível em `http://localhost:8080`.

## 🗺️ Visão Geral da API

| Método | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registra um novo usuário. | Nenhuma |
| `POST` | `/api/auth/login` | Realiza o login e retorna um token JWT. | Nenhuma |
| `GET` | `/api/users/me` | Retorna os dados do usuário logado. | Usuário (JWT) |
| `PUT` | `/api/users/me` | Atualiza os dados do usuário logado. | Usuário (JWT) |
| `DELETE` | `/api/users/me` | Desativa a conta do usuário logado. | Usuário (JWT) |
| `POST` | `/caixas-dagua/parear-dispositivo` | Associa um novo dispositivo a uma caixa d'água. | Usuário (JWT) |
| `GET` | `/caixas-dagua` | Lista todas as caixas d'água do usuário. | Usuário (JWT) |
| `GET` | `/caixas-dagua/{id}` | Retorna os dados detalhados de uma caixa d'água. | Usuário (JWT)
| `GET` | `/caixas-dagua/{id}/analise` | Retorna os dados históricos e KPIs para análise. | Usuário (JWT) |
| `PUT` | `/caixas-dagua/{id}` | Atualiza as informações de uma caixa d'água. | Usuário (JWT) |
| `DELETE` | `/caixas-dagua/{id}` | Desativa uma caixa d'água. | Usuário (JWT) |
| `GET` | `/api/provisionamento/configuracao/{sn}` | Endpoint para o dispositivo obter sua API Key. | Nenhuma |
| `POST` | `/api/leituras` | Endpoint para o dispositivo enviar leituras de volume. | Dispositivo (API Key) |

## Autores

- **Gabriel Batista Monteiro** - *Desenvolvimento Backend* - [gabrielbmonteiro](https://github.com/gabrielbmonteiro)
- **Leonardo Alves Braz** - *Desenvolvimento do Sistema Embarcado* - [Leonardobrzz](https://github.com/Leonardobrzz)
