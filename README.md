# CorpUniformes — Controle de Estoque

Sistema web para controle de estoque e distribuição de uniformes corporativos, desenvolvido a partir de uma necessidade real de operação empresarial.

[![React](https://img.shields.io/badge/React-Interface-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-Qualidade-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)

## Sobre o projeto

O **CorpUniformes** centraliza o acompanhamento de uniformes recebidos de fornecedores e entregues aos colaboradores. A solução substitui controles manuais por uma visão consolidada das movimentações, dos saldos disponíveis e dos itens que precisam de reposição.

O projeto foi construído para atender um cenário real da empresa, transformando regras do processo de almoxarifado em uma interface simples, responsiva e segura contra saídas maiores que o estoque disponível.

## Principais funcionalidades

- Dashboard com saldo total, itens ativos, peças entregues e alertas de reposição
- Registro de entrada por tipo de uniforme, tamanho, quantidade e fornecedor
- Registro de saída vinculado ao funcionário, matrícula e setor
- Validação de saldo antes da entrega de uma peça
- Cálculo automático do estoque a partir das movimentações
- Identificação de itens com estoque baixo ou esgotado
- Consulta consolidada por produto e tamanho
- Busca por produto ou fornecedor
- Filtros por tipo, tamanho e situação do estoque
- Histórico das movimentações mais recentes
- Persistência automática dos dados no navegador

## Decisões técnicas

- **React** para componentização da interface e gerenciamento do estado
- **TypeScript** para tipagem das entidades, formulários e regras de estoque
- **Hook personalizado** para concentrar movimentações e cálculos de inventário
- **LocalStorage** como persistência local, permitindo uso sem servidor
- **Validação de negócio** para impedir saídas superiores ao saldo disponível
- **CSS responsivo** para adaptação a diferentes tamanhos de tela
- **Lucide React** para uma linguagem visual consistente

## Tecnologias

| Categoria | Tecnologias |
| --- | --- |
| Interface | React e CSS3 |
| Linguagem | TypeScript |
| Build e desenvolvimento | Vite |
| Ícones | Lucide React |
| Qualidade de código | ESLint |
| Persistência | Web Storage API (`localStorage`) |

## Como executar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- Git

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/GabrielTeixeira01/estoque.git
   cd estoque
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o ambiente de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Abra no navegador o endereço exibido pelo Vite, normalmente [http://localhost:5173](http://localhost:5173).

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Valida o TypeScript e gera a versão de produção |
| `npm run lint` | Executa a análise estática do código |
| `npm run preview` | Exibe localmente a versão de produção |

## Estrutura do projeto

```text
estoque/
├── public/                  # Arquivos públicos e identidade visual
├── src/
│   ├── components/         # Componentes de interface e layout
│   ├── data/               # Tipos de uniformes e configurações
│   ├── hooks/              # Estado e regras do inventário
│   ├── pages/              # Dashboard, movimentações e estoque
│   ├── services/           # Persistência local das movimentações
│   ├── styles/             # Estilos globais e responsividade
│   ├── types/              # Tipos e contratos TypeScript
│   └── utils/              # Formatação e funções auxiliares
├── package.json
└── vite.config.ts
```

## Fluxo da aplicação

```text
Entrada de uniformes
        ↓
Registro da movimentação
        ↓
Cálculo do saldo por produto e tamanho
        ↓
Dashboard e consulta consolidada
        ↓
Entrega ao funcionário com validação de estoque
```

## Persistência dos dados

Esta versão armazena as movimentações no `localStorage` do navegador. Por isso, os registros ficam disponíveis apenas no mesmo navegador e dispositivo e podem ser removidos ao limpar os dados do site.

Como evolução para um ambiente com múltiplos usuários, o projeto pode receber uma API, autenticação e banco de dados centralizado.

## Aprendizados aplicados

- Modelagem de entradas, saídas e saldo de inventário
- Tradução de uma necessidade empresarial em regras de software
- Componentização e gerenciamento de estado com React
- Tipagem de formulários e entidades com TypeScript
- Validação de dados e tratamento de estados vazios
- Construção de uma interface voltada à rotina operacional

## Autor

Desenvolvido por [Gabriel Teixeira](https://github.com/GabrielTeixeira01).
