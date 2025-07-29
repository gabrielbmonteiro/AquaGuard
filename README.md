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
    - **Confira o repositório do sistema embarcado:** [Water-Level-Monitoring](https://github.com/Leonardobrzz/Water-Level-Monitoring)

## 🛠️ Tecnologias Utilizadas

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
| `PUT` | `/me/profile` | Atualiza as informações de perfil (nome, sobrenome, telefone, preferências de notificação). | JWT (Usuário) |
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
| `PUT` | `/{id}` | Atualiza as informações de uma caixa d'água (nome, capacidade, metas, frequência de atualização, limite percentual para lançar alerta). | JWT (Usuário) |
| `DELETE` | `/{id}` | Exclui (desativa) uma caixa d'água. | JWT (Usuário) |


---

### Provisionamento de Dispositivo (`/api/v1/provisionamento`)

Endpoint para o embarcado obter suas configurações iniciais.

| Método HTTP | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `GET` | `/configuracao/{serialNumber}` | Retorna a frequência de report (em segundos) | HMAC (Dispositivo) |

---

### Leituras do Dispositivo (`/api/v1/leituras`)

Endpoint para o embarcado enviar os dados de medição.

| Método HTTP | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Registra uma nova leitura de volume. | HMAC (Dispositivo) |

### 🏠 Dashboard
- Visualização em tempo real do nível das caixas
- Cards informativos com status e alertas
- Gráficos de consumo rápido
- Acesso rápido às funcionalidades principais

### 🪣 Gerenciamento de Caixas
- Listagem de todas as caixas cadastradas
- Detalhes completos de cada caixa
- Configuração de metas e alertas
- Histórico de leituras

### 📊 Analytics
- Gráficos detalhados de consumo
- Análise por períodos (7d, 30d, 90d)
- Identificação de padrões e tendências
- Relatórios de economia

### 👤 Perfil do Usuário
- Gerenciamento de dados pessoais
- Configurações de notificação
- Alteração de senha e email
- Logout seguro

### 🔐 Autenticação
- Login e cadastro seguros
- Verificação por email
- Recuperação de senha
- Tokens JWT para segurança

## 🛠️ Tecnologias

- **React Native 0.79.5** - Framework mobile
- **Expo 53** - Plataforma de desenvolvimento
- **TypeScript 5.8.3** - Linguagem tipada
- **Expo Router 5.1.4** - Navegação baseada em arquivos
- **Axios 1.10.0** - Cliente HTTP
- **AsyncStorage** - Armazenamento local
- **Expo Vector Icons** - Ícones
- **Linear Gradient** - Gradientes visuais

## 🚀 Como Executar

### 📋 Pré-requisitos
- Node.js 18+ e npm/yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app no celular
- Backend API rodando

### 🏁 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/AquaGuard.git
   cd AquaGuard/aquaguard-mobile-new
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a API:**
   - Edite `services/apiConfig.ts`
   - Altere o IP no `BASE_URL` para o da sua máquina:
   ```typescript
   DEVELOPMENT: {
     BASE_URL: 'http://SEU_IP:8080/api/v1',
     TIMEOUT: 10000
   }
   ```

4. **Execute o aplicativo:**
   ```bash
   npx expo start
   ```

5. **Escaneie o QR Code** com o Expo Go no seu celular

## 📁 Estrutura do Projeto

```
aquaguard-mobile-new/
├── app/                    # Telas da aplicação (Expo Router)
│   ├── (auth)/            # Telas de autenticação
│   │   ├── login.tsx      # Tela de login
│   │   ├── register.tsx   # Tela de cadastro
│   │   └── verify.tsx     # Verificação de email
│   ├── (tabs)/            # Telas principais (tabs)
│   │   ├── index.tsx      # Dashboard
│   │   ├── tanks.tsx      # Caixas d'água
│   │   ├── analytics.tsx  # Análise/relatórios
│   │   └── profile.tsx    # Perfil do usuário
│   └── _layout.tsx        # Layout raiz
├── services/              # Serviços e APIs
│   ├── apiConfig.ts       # Configuração da API
│   ├── authService.ts     # Serviços de autenticação
│   └── tankService.ts     # Serviços das caixas
├── hooks/                 # Hooks personalizados
│   └── useAuthCheck.ts    # Hook de verificação de auth
├── components/            # Componentes reutilizáveis
└── assets/               # Imagens e recursos
```

## 🔧 Configuração

### Modos de Operação

O app possui 3 modos configuráveis em `services/apiConfig.ts`:

1. **DEVELOPMENT** - Conecta com backend local
2. **MOCK** - Usa dados fictícios (para testes)
3. **PRODUCTION** - Conecta com servidor de produção

### Configurações de API

```typescript
export const API_CONFIG = {
  DEVELOPMENT: {
    BASE_URL: 'http://192.168.1.9:8080/api/v1',
    TIMEOUT: 10000
  },
  MOCK: {
    BASE_URL: 'http://localhost:8080/api/v1',
    TIMEOUT: 10000
  },
  PRODUCTION: {
    BASE_URL: 'https://your-production-server.com/api/v1',
    TIMEOUT: 15000
  }
};
```

## 📱 Telas do App

### 🔐 Autenticação
- **Login** - Entrada com email e senha
- **Cadastro** - Registro de novo usuário
- **Verificação** - Confirmação por código de email

### 🏠 Área Logada
- **Dashboard** - Visão geral e acesso rápido
- **Caixas** - Listagem e detalhes das caixas
- **Analytics** - Gráficos e análises
- **Perfil** - Configurações do usuário

## 🔒 Segurança

- **JWT Tokens** - Autenticação segura
- **AsyncStorage** - Armazenamento local criptografado
- **Interceptors** - Renovação automática de tokens
- **Logout Automático** - Em caso de token expirado

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com API:**
   - Verifique se o backend está rodando
   - Confirme o IP correto no `apiConfig.ts`
   - Teste a conectividade de rede

2. **App não carrega após login:**
   - Limpe o AsyncStorage
   - Reinicie o Expo
   - Verifique os logs do console

3. **Problemas de navegação:**
   - Reinicie o Expo Dev Client
   - Limpe o cache: `npx expo r -c`

### Comandos Úteis

```bash
# Limpar cache
npx expo r -c

# Executar em modo desenvolvimento
npx expo start --dev-client

# Ver logs detalhados
npx expo start --verbose

# Executar diretamente no Android
npx expo run:android

# Executar diretamente no iOS
npx expo run:ios
```


## Autores

- **Gabriel Batista Monteiro** - *Backend e Prototipação* - [gabrielbmonteiro](https://github.com/gabrielbmonteiro)
- **Leonardo Alves Braz** - *Frontend e Embarcado* - [Leonardobrzz](https://github.com/Leonardobrzz)
