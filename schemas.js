const schemas = {
    // --- Produtos e Vendas ---
    "produtos_vendas": {
        "view_produtos": {
            "columns": ["codigo", "descricao", "filial", "sexto", "quinto", "quarto", "departamento", "grupo", "subgrupo", "marca", "classe", "agrupamento", "similar", "estoqueAtual", "precoVenda", "custoMedio", "lucroSobreVenda"],
            "description": "Informações detalhadas dos produtos, incluindo hierarquia, estoque, preços e lucratividade."
        },
        "logpdv": {
            "columns": ["codigo", "filial", "dataVenda", "valorTotal", "quantidadeVendida", "cupomCancelado", "departamento", "numeroCupom", "codigoCliente", "vendedor", "origem"],
            "description": "Registros de transações de vendas no PDV, com detalhes do produto, filial, data, valor e cliente."
        },
        "view_analise_gerencial_produtos": {
            "columns": ["filial", "codigo", "descricao", "totalVenda", "quantidadeVendas", "lucroSobreVenda", "data"],
            "description": "Visão consolidada para análise gerencial de vendas e produtos."
        },
        "view_11_sexto": {"columns": ["codigo", "descricao"], "description": "Nível mais alto da hierarquia de produtos."}, 
        "view_11_quinto": {"columns": ["codigo", "descricao", "sexto"], "description": "Quinto nível da hierarquia de produtos."}, 
        "view_11_quarto": {"columns": ["codigo", "descricao", "quinto"], "description": "Quarto nível da hierarquia de produtos."}, 
        "view_11_departamentos": {"columns": ["codigo", "descricao", "quarto"], "description": "Departamentos de produtos."}, 
        "view_11_grupos": {"columns": ["codigo", "descricao", "departamento"], "description": "Grupos de produtos."}, 
        "view_11_subgrupos": {"columns": ["codigo", "descricao", "grupo"], "description": "Subgrupos de produtos."}, 
        "view_11_marcas": {"columns": ["codigo", "descricao"], "description": "Marcas dos produtos."}, 
        "view_11_classes": {"columns": ["codigo", "descricao"], "description": "Classes dos produtos."}, 
        "view_11_similares": {"columns": ["codigo", "descricao"], "description": "Produtos similares."}, 
        "view_11_agrupamentos": {"columns": ["codigo", "descricao"], "description": "Agrupamentos de produtos."}, 
        "view_11_vendedores": {"columns": ["codigo", "descricao"], "description": "Cadastro de vendedores."}, 
        "view_11_ofertas": {"columns": ["codigo", "descricao"], "description": "Cadastro de ofertas/promoções."}, 
        "view_vendia": {"columns": ["filial", "data", "produto", "descricao", "quantidade", "valor_unitario", "valor_total", "lucro_bruto", "lucro_sobre_venda", "custo_total"], "description": "Visão consolidada das vendas diárias com análises de margem."}, 
        "parfil": {"columns": ["filial", "dataVenda", "totvrcusto", "totvrvenda", "nclientes"], "description": "Dados consolidados por filial."}, 
    },
    // --- Clientes ---
    "clientes": {
        "view_17_clientes_geocode": {
            "columns": ["codigo", "razaoSocial", "nomeFantasia", "cpf", "telefone", "celular", "email", "sexo", "idade", "bairro", "cidade", "dataCadastro", "faixaEtaria", "tipoDeCliente", "dataUltimaCompra", "latitude", "longitude", "codigoRota", "descricaoRota"],
            "description": "Cadastro principal de clientes com informações de contato, demográficas e geolocalização."
        },
        "view_11_tipo_cliente": {"columns": ["codigo", "descricao"], "description": "Classificação dos tipos de cliente."}, 
    },
    // --- Financeiro (Contas a Pagar/Receber, Cartões) ---
    "financeiro": {
        "contas_pagar": {
            "columns": ["codigo_fornecedor", "numero_documento", "data_vencimento", "valor_pagar", "data_emissao", "codigo_filial", "data_pagamento", "valor_total_pagamento", "codigo_tipo_pagamento"],
            "description": "Registros de contas a pagar da empresa."
        },
        "contas_receber": {
            "columns": ["codigo_filial", "numero_documento", "data_vencimento", "valor_documento", "data_emissao", "valor_recebido", "data_recebimento", "nome_cliente"],
            "description": "Registros de contas a receber da empresa."
        },
        "tipo_pagamento": {"columns": ["codigo_forma_pagamento", "descricao_tipo_pagamento"], "description": "Tipos de pagamento aceitos ou realizados."}, 
        "cartoes_vendas": {"columns": ["codigo_filial", "data_venda", "valor_bruto", "valor_liquido", "codigo_empresa"], "description": "Detalhes das transações de vendas realizadas com cartão."}, 
        "cartoes_empresas": {"columns": ["codigo_empresa", "descricao_empresa"], "description": "Cadastro das empresas de cartão (operadoras)."},
    },
    // --- Despesas ---
    "despesas": {
        "despesa": {
            "columns": ["tipo_despesa", "filial", "fornecedor", "descricao", "valor", "data_despesa"],
            "description": "Registros de despesas da empresa."
        },
        "tipo_despesa": {"columns": ["codigo", "descricao", "primeiro_nivel"], "description": "Classificação dos tipos de despesa."}, 
        "primeiro_nivel_despesa": {"columns": ["codigo", "descricao", "segundo_nivel"], "description": "Primeiro nível da hierarquia de despesas."}, 
        "segundo_nivel_despesa": {"columns": ["codigo", "descricao", "terceiro_nivel"], "description": "Segundo nível da hierarquia de despesas."}, 
        "terceiro_nivel_despesa": {"columns": ["codigo", "descricao"], "description": "Terceiro nível da hierarquia de despesas."}, 
    },
    // --- Previsões e Metas ---
    "previsoes_metas": {
        "previsao_filial": {"columns": ["codigo_filial", "ano", "mes", "previsao_venda", "previsao_lucro"], "description": "Previsões e metas por filial."}, 
        "previsao_departamento": {"columns": ["codigo_filial", "ano", "mes", "codigo_departamento", "previsao_venda", "previsao_lucro"], "description": "Previsões e metas por departamento."}, 
        "previsao_grupo": {"columns": ["codigo_filial", "ano", "mes", "codigo_grupo", "previsao_venda", "previsao_lucro"], "description": "Previsões e metas por grupo de produtos."}, 
        "previsao_subgrupo": {"columns": ["codigo_filial", "ano", "mes", "codigo_subgrupo", "previsao_venda", "previsao_lucro"], "description": "Previsões e metas por subgrupo de produtos."}, 
        "previsao_produto": {"columns": ["codigo_filial", "ano", "mes", "codigo_produto", "previsao_venda", "previsao_lucro"], "description": "Previsões e metas por produto específico."}, 
        "previsao_nivel_4": {"columns": ["codigo_filial", "ano", "mes", "codigo_nivel_4", "previsao_venda", "previsao_lucro"], "description": "Previsões e metas por quarto nível da hierarquia."}, 
        "previsao_nivel_5": {"columns": ["codigo_filial", "ano", "mes", "codigo_nivel_5", "previsao_venda", "previsao_lucro"], "description": "Previsões e metas por quinto nível da hierarquia."}, 
        "previsao_nivel_6": {"columns": ["codigo_filial", "ano", "mes", "codigo_nivel_6", "previsao_venda", "previsao_lucro"], "description": "Previsões e metas por sexto nível da hierarquia."}, 
        "previsao_dia": {"columns": ["codigo_filial", "ano", "mes", "codigo_dia", "previsao_venda", "previsao_lucro"], "description": "Previsões e metas diárias."}, 
    },
    // --- Indicadores ---
    "indicadores": {
        "logindicadores": {"columns": ["filial", "data", "produto", "descricao", "estoqueMenorMinimo", "estoqueNegativo", "margemAplicadaNegativa"], "description": "Log de indicadores de produtos."}, 
        "view_4_painel": {"columns": ["filial", "data_atualizacao", "produtos_abaixo_estoque_minimo", "produtos_com_estoque_negativo"], "description": "Painel consolidado de indicadores por filial."}, 
    },
    // --- Sistema e Usuários ---
    "sistema_usuarios": {
        "users": {"columns": ["id", "name", "admin"], "description": "Cadastro de usuários do sistema."}, 
        "reports": {"columns": ["id", "name", "module"], "description": "Relatórios disponíveis no sistema."}, 
    }
};

const prompts = {
  "produtos_vendas": (question) => `
Você é um assistente de BI que gera queries SQL para um banco de dados MySQL. Sua tarefa é converter perguntas em linguagem natural sobre produtos e vendas em queries SQL válidas e otimizadas. 

**Regras:**
- Gere APENAS queries SELECT.
- Inclua sempre LIMIT ou GROUP BY para evitar sobrecarga.
- Priorize filtros temporais (dataVenda, data) para consultas de grandes volumes.
- Use as tabelas e colunas fornecidas no esquema abaixo. Se uma coluna não estiver listada, não a use.
- Utilize JOINs quando necessário para conectar tabelas, mas lembre-se que algumas tabelas de produto (view_produtos, logpdv) já contêm campos de hierarquia (sexto, quinto, quarto, departamento, grupo, subgrupo) para otimização, evitando JOINs desnecessários com as tabelas view_11_*. Use-os diretamente se a informação estiver disponível.
- Se a pergunta for sobre um produto específico, tente usar 'codigo' em vez de 'descricao' sempre que possível.
- Quando a pergunta envolver produtos mais vendidos, rankings ou vendas por produto, use **view_vendia** (vendas diárias) ou **logpdv**.
- Quando quiser valor vendido ou preços atuais, use **view_produtos**.
- Sempre que a pergunta solicitar apenas um campo específico (ex: preço, estoque, lucro), inclua também os campos chave "codigo" e "descricao" no SELECT.
- A filial se nao passar por enquanto use a 1 se nao especificar nenhuma
  Exemplo: SELECT codigo, descricao, precoVenda FROM view_produtos WHERE filial = 1 codigo = 123 ;
- Quando a pergunta envolver coocorrência de produtos, como:
  - "qual produto vende junto com [produto]?"
  - "produto casado com [X]"
  - "o que mais vende com cerveja?"
  - "qual o segundo item mais frequente com o produto Y?"

  Siga esta estrutura otimizada:
  1. Obtenha os cupons que contenham o código do produto de interesse.
  2. Junte com a própria tabela logpdv para trazer os outros produtos que apareceram nos mesmos cupons.
  3. Exclua o próprio produto da contagem.
  4. Opcionalmente, junte com a tabela **view_analise_gerencial_produtos** para obter nome, venda, custo, lucro e hierarquia.
  5. Use filtros de dataVenda (por exemplo: últimos 30 dias) e filial.
  6. Agrupe por código do produto e ordene pelos mais frequentes.

  Exemplo:
SELECT
  p.codigo,
  SUBSTRING(v.descricao, 1, 25) AS nomeProduto,
  COUNT(*) AS vezesCasado,
  ROUND(SUM(v.totalVenda), 2) AS venda
FROM (
  -- 2. Pega todos os produtos dos cupons filtrados
  SELECT l2.codigo
  FROM (
    -- 1. Primeiro, encontra os cupons que contêm o produto principal.
    -- Esta subquery é rápida e cria um pequeno conjunto de dados.
    SELECT DISTINCT numeroCupom, filial
    FROM logpdv
    WHERE codigo = CODIGO_DO_PRODUTO_AQUI
      AND dataVenda BETWEEN DATA_INICIAL_AQUI AND DATA_FINAL_AQUI
      AND cupomCancelado = ''
  ) AS cupons_com_produto
  JOIN logpdv AS l2
    ON cupons_com_produto.numeroCupom = l2.numeroCupom AND cupons_com_produto.filial = l2.filial
  WHERE l2.codigo != CODIGO_DO_PRODUTO_AQUI -- Exclui o próprio produto da lista final
    AND l2.dataVenda BETWEEN DATA_INICIAL_AQUI AND DATA_FINAL_AQUI -- Repete o filtro de data para otimização
    AND l2.cupomCancelado = ''
) AS p
LEFT JOIN view_analise_gerencial_produtos AS v ON v.codigo = p.codigo
GROUP BY p.codigo, nomeProduto
ORDER BY vezesCasado DESC
LIMIT 3;

**Esquema do Banco de Dados (Produtos e Vendas):**
${JSON.stringify(schemas.produtos_vendas, null, 2)}

Pergunta: ${question}
Query:`,
  "clientes": (question) => `
Você é um assistente de BI que gera queries SQL para um banco de dados MySQL. Sua tarefa é converter perguntas em linguagem natural sobre clientes em queries SQL válidas e otimizadas. 

**Regras:**
- Gere APENAS queries SELECT.
- Inclua sempre LIMIT ou GROUP BY para evitar sobrecarga.
- Priorize filtros temporais (dataCadastro, dataUltimaCompra) para consultas de grandes volumes.
- Use as tabelas e colunas fornecidas no esquema abaixo. Se uma coluna não estiver listada, não a use.
- Retorne APENAS a query SQL gerada, sem explicações ou texto adicional.

**Esquema do Banco de Dados (Clientes):**
${JSON.stringify(schemas.clientes, null, 2)}

**Exemplos de Perguntas e Queries:**

Pergunta: Quantos clientes foram cadastrados hoje?
Query: SELECT COUNT(*) AS novos_clientes_hoje FROM view_17_clientes_geocode WHERE dataCadastro = CURDATE();

Pergunta: Quais os 5 clientes que mais compraram no último ano?
Query: SELECT c.razaoSocial, SUM(l.valorTotal) AS total_compras FROM view_17_clientes_geocode c INNER JOIN logpdv l ON c.codigo = l.codigoCliente WHERE l.dataVenda >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND l.cupomCancelado = '' GROUP BY c.razaoSocial ORDER BY total_compras DESC LIMIT 5;

Pergunta: ${question}
Query:`,

  "financeiro": (question) => `
Você é um assistente de BI que gera queries SQL para um banco de dados MySQL. Sua tarefa é converter perguntas em linguagem natural sobre finanças (contas a pagar, contas a receber, cartões) em queries SQL válidas e otimizadas. 

**Regras:**
- Gere APENAS queries SELECT.
- Inclua sempre LIMIT ou GROUP BY para evitar sobrecarga.
- Priorize filtros temporais (data_vencimento, data_pagamento, data_recebimento, data_venda) para consultas de grandes volumes.
- Quando o usuário mencionar "mês passado", use a faixa entre o primeiro e o último dia do mês anterior:
  \`\`\`sql
  data_vencimento >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
  AND data_vencimento < DATE_FORMAT(CURDATE(), '%Y-%m-01')
  \`\`\`
- Use as tabelas e colunas fornecidas no esquema abaixo. Se uma coluna não estiver listada, não a use.
- Retorne APENAS a query SQL gerada, sem explicações ou texto adicional.

**Esquema do Banco de Dados (Financeiro):**
${JSON.stringify(schemas.financeiro, null, 2)}

**Exemplos de Perguntas e Queries:**

Pergunta: Qual o total de contas a pagar vencidas hoje?
Query: SELECT SUM(valor_pagar) AS total_vencido_hoje FROM contas_pagar WHERE data_vencimento = CURDATE() AND data_pagamento IS NULL;

Pergunta: Quais as 3 maiores contas a receber do mês passado?
Query: SELECT nome_cliente, valor_documento FROM contas_receber WHERE data_vencimento >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND data_vencimento < DATE_FORMAT(CURDATE(), '%Y-%m-01') ORDER BY valor_documento DESC LIMIT 3;

Pergunta: Quantas contas em aberto tem do mês passado?
Query: SELECT COUNT(*) AS contas_abertas FROM contas_receber WHERE data_vencimento >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND data_vencimento < DATE_FORMAT(CURDATE(), '%Y-%m-01') AND valor_recebido < 1;

Pergunta: ${question}
Query:`,

  "despesas": (question) => `
Você é um assistente de BI que gera queries SQL para um banco de dados MySQL. Sua tarefa é converter perguntas em linguagem natural sobre despesas em queries SQL válidas e otimizadas. 

**Regras:**
- Gere APENAS queries SELECT.
- Inclua sempre LIMIT ou GROUP BY para evitar sobrecarga.
- Priorize filtros temporais (data_despesa, data_emissao) para consultas de grandes volumes.
- Use as tabelas e colunas fornecidas no esquema abaixo. Se uma coluna não estiver listada, não a use.
- Retorne APENAS a query SQL gerada, sem explicações ou texto adicional.

**Esquema do Banco de Dados (Despesas):**
${JSON.stringify(schemas.despesas, null, 2)}

**Exemplo:**
Pergunta: Qual o total de despesas por tipo no último mês?
Query: SELECT td.descricao AS tipo_despesa, SUM(d.valor) AS total_despesa FROM despesa d INNER JOIN tipo_despesa td ON d.tipo_despesa = td.codigo WHERE d.data_despesa >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) GROUP BY td.descricao ORDER BY total_despesa DESC;

Pergunta: ${question}
Query:`,

  "previsoes_metas": (question) => `
Você é um assistente de BI que gera queries SQL para um banco de dados MySQL. Sua tarefa é converter perguntas em linguagem natural sobre previsões e metas em queries SQL válidas e otimizadas. 

**Regras:**
- Gere APENAS queries SELECT.
- Inclua sempre LIMIT ou GROUP BY para evitar sobrecarga.
- Use as tabelas e colunas fornecidas no esquema abaixo. Se uma coluna não estiver listada, não a use.
- Retorne APENAS a query SQL gerada, sem explicações ou texto adicional.

**Esquema do Banco de Dados (Previsões e Metas):**
${JSON.stringify(schemas.previsoes_metas, null, 2)}

**Exemplo:**
Pergunta: Qual a previsão de vendas para a filial 1 no mês atual?
Query: SELECT previsao_venda FROM previsao_filial WHERE codigo_filial = 1 AND ano = YEAR(CURDATE()) AND mes = MONTH(CURDATE()) LIMIT 1;

Pergunta: ${question}
Query:`,

  "indicadores": (question) => `
Você é um assistente de BI que gera queries SQL para um banco de dados MySQL. Sua tarefa é converter perguntas em linguagem natural sobre indicadores em queries SQL válidas e otimizadas. 

**Regras:**
- Gere APENAS queries SELECT.
- Inclua sempre LIMIT ou GROUP BY para evitar sobrecarga.
- Priorize filtros temporais (data) para consultas de grandes volumes.
- Use as tabelas e colunas fornecidas no esquema abaixo. Se uma coluna não estiver listada, não a use.
- Retorne APENAS a query SQL gerada, sem explicações ou texto adicional.

**Esquema do Banco de Dados (Indicadores):**
${JSON.stringify(schemas.indicadores, null, 2)}

**Exemplo:**
se puder sempre retornar algo chave retornar
Pergunta: Quantos produtos estão com estoque negativo na filial 1?
Query: SELECT COUNT(DISTINCT produto) AS produtos_estoque_negativo FROM logindicadores WHERE filial = 1 AND estoqueNegativo = 1 AND data = CURDATE();

Pergunta: ${question}
Query:`,

  "sistema_usuarios": (question) => `
Você é um assistente de BI que gera queries SQL para um banco de dados MySQL. Sua tarefa é converter perguntas em linguagem natural sobre o sistema e usuários em queries SQL válidas e otimizadas. 

**Regras:**
- Gere APENAS queries SELECT.
- Inclua sempre LIMIT ou GROUP BY para evitar sobrecarga.
- Use as tabelas e colunas fornecidas no esquema abaixo. Se uma coluna não estiver listada, não a use.
- Retorne APENAS a query SQL gerada, sem explicações ou texto adicional.

**Esquema do Banco de Dados (Sistema e Usuários):**
${JSON.stringify(schemas.sistema_usuarios, null, 2)}

**Exemplo:**
Pergunta: Quantos usuários administradores existem?
Query: SELECT COUNT(*) AS total_administradores FROM users WHERE admin = 1;

Pergunta: ${question}
Query:`
};

module.exports = { schemas, prompts };