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

## 🗺️ Endpoints da API (v1)

### Autenticação (`/api/v1/auth`)

Endpoints para registro, login e verificação de contas de usuário.

| Método HTTP | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Registra um novo usuário. | Pública |
| `POST` | `/login` | Autentica um usuário e retorna um token JWT. | Pública |
| `POST` | `/verify` | Valida uma conta de usuário com o código de verificação. | Pública |
| `POST` | `/resend-code` | Reenvia o código de verificação para o e-mail do usuário. | Pública |

---

### Usuários (`/api/v1/users`)

Endpoints para gerenciamento do perfil do usuário autenticado.

| Método HTTP | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `GET` | `/me` | Retorna os dados do perfil do usuário autenticado. | JWT (Usuário) |
| `PUT` | `/me/profile` | Atualiza as informações de perfil (ome, sobrenome, telefone, preferências de notificação). | JWT (Usuário) |
| `PUT` | `/me/password` | Altera a senha do usuário. | JWT (Usuário) |
| `DELETE` | `/me` | Exclui (desativa) a conta do usuário e todos os seus dados associados. | JWT (Usuário) |
| `POST` | `/me/change-email` | Inicia o processo de alteração de e-mail. | JWT (Usuário) |
| `POST` | `/me/verify-email-change` | Confirma a alteração de e-mail com um código de verificação. | JWT (Usuário) |
| `POST` | `/me/devices` | Regista um novo dispositivo (via push token) para notificações push. | JWT (Usuário) |

---

### Caixas D'Água (`/api/v1/caixas-dagua`)

Endpoints para gerenciar as caixas d'água associadas a um usuário.

| Método HTTP | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Lista todas as caixas d'água do usuário. | JWT (Usuário) |
| `GET` | `/{id}` | Retorna os detalhes completos de uma caixa d'água específica. | JWT (Usuário) |
| `GET` | `/{id}/analise` | Retorna uma análise de consumo para um período (`?inicio` e `?fim`). | JWT (Usuário) |
| `POST` | `/parear-dispositivo` | Associa (pareia) um novo dispositivo de hardware a uma conta de usuário. | JWT (Usuário) |
| `PUT` | `/{id}` | Atualiza as informações de uma caixa d'água (nome, capacidade, metas, frequência, limite de alerta). | JWT (Usuário) |
| `DELETE` | `/{id}` | Exclui (desativa) uma caixa d'água. | JWT (Usuário) |


---

### Provisionamento de Dispositivo (`/api/v1/provisionamento`)

Endpoint para o embarcado obter suas configurações iniciais.

| Método HTTP | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `GET` | `/configuracao/{serialNumber}` | Retorna a chave de API, a URL de report e tempo de intervalo de report". | Pública |

---

### Leituras do Dispositivo (`/api/v1/leituras`)

Endpoint para o embarcado enviar os dados de medição.

| Método HTTP | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Registra uma nova leitura de volume. | API Key (Dispositivo) |

## Autores

- **Gabriel Batista Monteiro** - *Desenvolvimento Backend* - [gabrielbmonteiro](https://github.com/gabrielbmonteiro)
- **Leonardo Alves Braz** - *Desenvolvimento do Sistema Embarcado* - [Leonardobrzz](https://github.com/Leonardobrzz)
