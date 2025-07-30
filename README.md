# MCP - API de Processamento de Perguntas em Linguagem Natural

Esta é uma API Express + Node.js que interpreta perguntas em linguagem natural relacionadas ao seu banco de dados MySQL e retorna resultados estruturados. Ela integra inteligência artificial (OpenAI) para classificar domínios, resolver nomes de produtos, gerar SQL, validar segurança e executar a consulta.
## Como funciona

A API interpreta a pergunta em linguagem natural enviada pelo usuário e, com base na estrutura das tabelas informada (em `schemas.js`), gera automaticamente uma query SQL válida e segura. O sistema identifica o domínio do assunto (produtos, vendas, clientes, etc.), valida os nomes de tabelas, evita consultas perigosas e executa a query no banco de dados, retornando os dados prontos para o front-end.

## Endpoints

### POST /query

Recebe uma pergunta natural e retorna os dados consultados do banco MySQL.

**Body esperado:**

```
{
  "question": "qual o produto que mais vende com a heineken mes passado"
}
```

**Resposta bem-sucedida:**

```
{
  "data": [
    {
      "codigo": 456,
      "nomeProduto": "BATATA FRITA",
      "vezesCasado": 128,
      "venda": 987.65
    }
  ]
}
```

**Resposta com ambiguidade:**

```
{
  "type": "ambiguous",
  "message": "Encontrei 2 produtos parecidos com 'heineken 330'.",
  "options": [
    {
      "nome": "CERVEJA HEINEKEN 330ML ZERO",
      "codigo": 1579
    },
    {
      "nome": "CERVEJA HEINEKEN 330ML",
      "codigo": 49251
    }
  ]
}
```

## Recursos

- 🔍 Detecção automática de domínio com OpenAI
- 🧠 Resolução de nomes ambíguos de produtos via IA e consulta ao banco
- 🔐 Validação rigorosa das queries para evitar SQL perigosos
- 🧾 Geração de queries SQL otimizadas via OpenAI com contexto de schemas
- ⚡ Suporte à coocorrência de produtos ("venda casada")
- 🌐 Suporte a CORS (cross-origin) para integração com frontends externos
- 🧩 Estrutura extensível com modularização por domínio e schema

## Configuração

Crie um arquivo `.env`:

```
PORT=4000
OPENAI_API_KEY=sk-...
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=suasenha
DB_DATABASE=nomedobanco
```

Instale dependências:

```bash
npm install
```

Inicie a API:

```bash
node index.js
```

## Observações

- Esta API não possui memória de contexto entre requisições.

## Licença

MIT