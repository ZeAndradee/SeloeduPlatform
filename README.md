# Seloedu Angular

Este projeto é uma simulação de uma Plataforma Educacional desenvolvida em **Angular 18**. O objetivo é criar uma interface moderna, responsiva e funcional para administração de cursos e alunos, utilizando **IndexedDB** (via **Dexie.js**) para persistência de dados local.

## 🚀 Funcionalidades Atuais

O projeto atualmente conta com as seguintes funcionalidades implementadas:

- **Autenticação**: Sistema de login simulado com persistência de usuários em **IndexedDB**.
- **Gestão de Cursos (CRUD)**: Criação, leitura, atualização e remoção de cursos com persistência em **IndexedDB**.
- **Gestão de Alunos**: Cadastro, edição, remoção e matrícula de alunos em cursos.
- **Dashboard**: Painel principal com visualização diferenciada para **Administradores** e **Alunos**.
  - **Admin**: Visualiza estatísticas gerais e gerencia cursos.
  - **Aluno**: Visualiza seus cursos matriculados e progresso.
- **Design Premium & Responsivo**: Interface limpa e moderna utilizando CSS puro, variáveis CSS para cores, fonte **Google Sans** e ícones via `ng-icons`. Adaptável a diferentes tamanhos de tela.
- **Base de Dados Local**: Dados iniciais carregados de arquivos JSON (`src/app/database/`) e gerenciados via **Dexie.js**.

## 📂 Estrutura de Dados

A aplicação utiliza uma abordagem híbrida para dados:

1. **Seeding**: Na primeira execução, os dados são carregados de `src/app/database/users.json` e `courses.json`.
2. **Persistência**: Os dados são armazenados no **IndexedDB** do navegador usando a biblioteca **Dexie.js**, permitindo operações de CRUD completas que persistem entre recarregamentos (até que o cache do navegador seja limpo).

## 🔮 Próximos Passos (Roadmap)

- [x] **Gestão de Cursos**: Criação, edição e remoção de cursos.
- [x] **Gestão de Alunos**: Cadastro, edição, remoção e matrícula.
- [ ] **Gestão de Turmas**:
  - Visualizar todos os treinamentos ativos disponíveis no sistema.
  - Acessar ou criar turmas relacionadas a cada treinamento.
  - Listar os alunos disponíveis para vinculação em uma turma específica, possibilitando a gestão completa dos participantes.
- [x] **Recuperação de Senha**: Fluxo completo com envio de email via **EmailJS**, geração de token seguro e redefinição de senha.
  - Integração com serviço de email real para envio de links de recuperação.
  - Validação de tokens e expiração.

## 🛠️ Como Rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

3. Acesse `http://localhost:4200`.

## 🔑 Credenciais de Teste

Verifique o arquivo `src/app/database/users.json` para ver os usuários disponíveis. Exemplos:

- **Admin**: `admin@seloedu.com`
- **Aluno**: `student@seloedu.com`
