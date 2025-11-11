# Blog Escolar – Plataforma de Postagens Educacionais

Uma aplicação completa que permite professores e alunos interagirem em um blog escolar.
O sistema é dividido em backend (Node.js + Express + Prisma) e frontend (React Native + Expo), com autenticação JWT e persistência de dados em banco relacional.

## Funcionalidades Principais:

Autenticação de usuários (login e registro)

Controle de acesso — professores podem criar, editar e excluir posts

Listagem e busca de postagens

Visualização detalhada de cada post

Design responsivo e tema coerente em todas as telas

Persistência segura via Prisma ORM

## ⚙️ Setup Inicial
### 🔧 Backend
1. Acesse o diretório: ```cd backend```
2. Instale as dependências: ```npm install```
3. Configure o banco de dados e gere as tabelas: ```npx prisma migrate dev```
4. Inicie o servidor: ```npm run dev```

### 📱 Frontend (Expo)
1. Acesse o diretório: ```cd frontend```
2. Instale as dependências: ```npm install```
3. Execute o app: ```npx expo start```
4. Escaneie o QR code no seu celular (via Expo Go) ou rode na web (http://localhost:8081/).

## 📘 Fluxo de Uso

Login / Registro:
O usuário realiza login e recebe um token JWT armazenado no AsyncStorage.

Home:
Lista todas as postagens disponíveis (públicas).

Professores:
Podem criar, editar e excluir postagens (ícones de ação aparecem apenas para eles).

Visualização:
Qualquer usuário pode abrir uma postagem e ver seus detalhes.

Logout:
Remove o token e redireciona para a tela de login.

## 🧱 Tecnologias Utilizadas
### Backend

Node.js

Express

Prisma ORM

SQLite / PostgreSQL

JWT (Json Web Token)

CORS

### Frontend

React Native (Expo)

React Native Paper

Expo Router

AsyncStorage

TypeScript
