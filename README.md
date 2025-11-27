# Plataforma Seloedu

Este projeto é uma simulação de uma Plataforma Educacional desenvolvida em **Angular 18**. O objetivo é criar uma interface moderna, responsiva e funcional para administração de cursos, turmas e alunos, utilizando **IndexedDB** (via **Dexie.js**) para persistência de dados local, simulando um backend real.

## Funcionalidades Principais

### Autenticação e Segurança

- **Login**: Sistema de autenticação via email e senha.
- **Recuperação de Senha**: Fluxo funcional completo.
  - O usuário solicita a recuperação via email.
  - Um token seguro é gerado e salvo no banco de dados local.
  - Um email é enviado (via integração com **EmailJS**) contendo o link para redefinição.
  - O usuário define uma nova senha na página de reset.
- **Proteção de Rotas**: `AuthGuard` e `AdminGuard` permitem que apenas usuários autenticados e com permissões adequadas acessem determinadas páginas.

### Dashboard

- **Visão do Administrador**:
  - Cards com estatísticas gerais (Total de Alunos, Cursos Ativos, Turmas).
  - Acesso rápido para gerenciamento.
- **Visão do Aluno**:
  - Visualização dos cursos em que está matriculado.
  - Acompanhamento de progresso (mockado).

### Gestão de Cursos

- **CRUD Completo**: Criação, Leitura, Atualização e Remoção de cursos.
- **Listagem**: Visualização em grid com cards modernos.
- **Detalhes**: Página dedicada para gerenciar o conteúdo e as turmas de um curso.

### Gestão de Alunos

- **Cadastro e Edição**: Formulários completos para gestão de dados dos alunos.
- **Listagem**: Tabela com busca e ações rápidas.

### Gestão de Turmas

- **Organização**: As turmas são vinculadas a cursos específicos.
- **Matrícula**: Interface para adicionar e remover alunos de turmas.
- **Visualização**: Página de detalhes da turma mostrando os alunos matriculados.

## Estrutura de Páginas e Rotas

A aplicação está estruturada nas seguintes rotas principais:

| Rota                                | Descrição                           | Acesso      |
| ----------------------------------- | ----------------------------------- | ----------- |
| `/login`                            | Página de login                     | Público     |
| `/forgot-password`                  | Solicitação de recuperação de senha | Público     |
| `/reset-password`                   | Redefinição de senha (requer token) | Público     |
| `/dashboard`                        | Painel principal                    | Autenticado |
| `/courses`                          | Listagem de cursos                  | Autenticado |
| `/courses/new`                      | Criar novo curso                    | **Admin**   |
| `/courses/edit/:id`                 | Editar curso existente              | **Admin**   |
| `/students`                         | Listagem de alunos                  | Autenticado |
| `/students/new`                     | Cadastrar novo aluno                | **Admin**   |
| `/classes`                          | Visão geral de todas as turmas      | Autenticado |
| `/courses/:id/classes`              | Turmas de um curso específico       | Autenticado |
| `/courses/:id/classes/:id/students` | Detalhes da turma e alunos          | Autenticado |

## Arquitetura Técnica

- **Frontend**: Angular 18.
- **Estilização**: CSS Puro.
- **Persistência de Dados**:
  - **Dexie.js**: Wrapper para IndexedDB, permitindo consultas e relacionamentos no navegador.
  - **Seeding**: Dados iniciais são carregados de arquivos JSON (`src/app/database/`) na primeira execução.
- **Serviços**:
  - `AuthService`: Gerencia estado do usuário e lógica de login/logout/recuperação.
  - `UserService`, `CourseService`, `ClassService`: Serviços dedicados para lógica de negócios de cada entidade.

## Etapas Concluidas (Roadmap)

- [x] **Gestão de Cursos**: CRUD completo.
- [x] **Gestão de Alunos**: CRUD completo.
- [x] **Gestão de Turmas**: Implementação da lógica de turmas e matrículas.
- [x] **Recuperação de Senha**: Fluxo funcional com envio de email.

## Possíveis Próximas Etapas

- [ ] **Conteúdo do Curso**: Adicionar suporte a aulas, vídeos e materiais dentro dos cursos.
- [ ] **Avaliações**: Sistema de provas e notas para os alunos.

## Como Rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

3. Acesse `http://localhost:4200`.

## Credenciais de Teste

Os dados são reiniciados se você limpar o armazenamento do navegador (Application > Clear Site Data).

- **Admin**: `admin@seloedu.com` (Senha: `12345678`)
- **Aluno**: `student@seloedu.com` (Senha: `12345678`)
