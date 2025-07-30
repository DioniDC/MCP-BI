require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const { generateSqlQuery } = require("./mcp_openai");
const { identifyDomainWithIA } = require("./domain_ai");
const { schemas } = require("./schemas");
const { resolveProductNameInQuestion } = require("./product_resolver");
const cors = require("cors");

// --- Início da Classe MCPNode (Core do MCP) ---
class MCPNode {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
        this.pool = null;
        // Usar as tabelas definidas no schemas.js para validação
        this.acceptableTables = Object.keys(schemas.produtos_vendas)
                                .concat(Object.keys(schemas.clientes))
                                .concat(Object.keys(schemas.financeiro))
                                .concat(Object.keys(schemas.despesas))
                                .concat(Object.keys(schemas.previsoes_metas))
                                .concat(Object.keys(schemas.indicadores))
                                .concat(Object.keys(schemas.sistema_usuarios));
    }

    async connect() {
        try {
            this.pool = mysql.createPool(this.dbConfig);
            console.log(`Conectado ao banco de dados MySQL: ${this.dbConfig.database}`);
        } catch (error) {
            console.error(`Erro ao conectar ao MySQL: ${error.message}`);
            throw error;
        }
    }

    async disconnect() {
        if (this.pool) {
            await this.pool.end();
            console.log("Conexão MySQL encerrada.");
        }
    }

    validateQuery(query) {
        const lowerQuery = query.toLowerCase().trim();

        // 1. Apenas SELECTs são permitidos
        if (!lowerQuery.startsWith("select")) {
            return { valid: false, message: "Erro de segurança: Apenas consultas SELECT são permitidas." };
        }

        // 2. Proibir comandos de modificação ou DDL dentro da query
        const forbiddenKeywords = ["insert", "update", "delete", "drop", "alter", "create", "truncate", "union all", "union"];
        for (const keyword of forbiddenKeywords) {
            if (lowerQuery.includes(keyword)) {
                return { valid: false, message: `Erro de segurança: Comando \'${keyword}\' não permitido na query.` };
            }
        }

        // 3. Validar tabelas usadas na query
        const regex = /(?:from|join)\s+([a-zA-Z0-9_]+)/g;
        let match;
        const tablesInQuery = new Set();
        while ((match = regex.exec(lowerQuery)) !== null) {
            tablesInQuery.add(match[1]);
        }

        for (const table of tablesInQuery) {
            if (!this.acceptableTables.includes(table)) {
                return { valid: false, message: `Erro: Tabela \'${table}\' não é uma tabela aceitável para consulta.` };
            }
        }

        // 4. Limitação de resultados (LIMIT) e filtros temporais (WHERE com data)
        // Esta é uma validação mais heurística e pode ser refinada.
        // Para consultas de BI, geralmente queremos resumos ou top N.
        const hasLimitOrGroupBy = lowerQuery.includes("limit") || lowerQuery.includes("group by");
        const isAggregation = /(count|avg|sum|min|max)\s*\(/.test(lowerQuery);
        const hasWhere = lowerQuery.includes("where");

        // Permitir se for agregação OU tiver filtro, mesmo sem limit/group by
        if (!hasLimitOrGroupBy && !isAggregation && !hasWhere) {
            return { valid: false, message: "Consultas devem incluir LIMIT, GROUP BY, agregação ou filtro para evitar sobrecarga." };
        }

        return { valid: true, message: "Query validada com sucesso." };
    }

    async executeQuery(query) {
        const validation = this.validateQuery(query);
        if (!validation.valid) {
            console.error(validation.message);
            return { error: validation.message };
        }

        let connection;
        try {
            connection = await this.pool.getConnection();
            const [rows, fields] = await connection.execute(query);
            return { data: rows };
        } catch (error) {
            console.error(`Erro ao executar a query: ${error.message}`);
            return { error: error.message };
        } finally {
            if (connection) connection.release();
        }
    }
}
// --- Fim da Classe MCPNode ---

// --- Configurações do Servidor Express ---
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: "*",
  credentials: false
}));

// Configurações do banco de dados do .env
const DB_CONFIG = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const mcp = new MCPNode(DB_CONFIG);

// Middleware para parsear JSON no corpo da requisição
app.use(bodyParser.json());

// --- Única Rota da API ---

app.post("/query", async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "A pergunta em linguagem natural é obrigatória." });
    }

    console.log(`[1/6] Pergunta recebida: "${question}"`);

    try {
        // ETAPA 1: Identificar o domínio
        const domain = await identifyDomainWithIA(question);
        if (!domain) {
            return res.status(400).json({ error: "Não foi possível identificar o domínio da pergunta." });
        }
        console.log(`[2/6] Domínio identificado: "${domain}"`);

        let processedQuestion = question;

        // ETAPA 2: NOVA - Resolver nome do produto, se o domínio for relevante
        if (domain === "produtos_vendas") {
            console.log("[3/6] Domínio de produtos, tentando resolver nome do produto...");
            const resolveResult = await resolveProductNameInQuestion(question, mcp.pool);

            if (resolveResult.status === 'resolved' || resolveResult.status === 'not_needed') {
                processedQuestion = resolveResult.resolvedQuestion;
                console.log(`[4/6] Pergunta processada: "${processedQuestion}"`);
            } else {
                // Se for 'ambiguous' ou 'error', retorna a mensagem para o usuário e encerra o fluxo.
                console.warn(`[AVISO] Resolução do produto falhou: ${resolveResult.message}`);
                return res.status(400).json({
                    type: resolveResult.type,
                    message: resolveResult.message,
                    options: resolveResult.options || []
                });
            }
        } else {
            console.log("[3/6] Resolução de produto não aplicável para este domínio.");
            console.log("[4/6] Usando pergunta original.");
        }

        // ETAPA 3: Gerar a query SQL com a pergunta já tratada
        const sqlQuery = await generateSqlQuery(processedQuestion, domain, schemas);
        console.log(`[5/6] Query SQL gerada: ${sqlQuery}`);

        // ETAPA 4: Executar a query final (não precisa mais de refinamento aqui)
        console.log(`[6/6] Executando a query final...`);
        const result = await mcp.executeQuery(sqlQuery);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        } else {
            return res.json({ data: result.data });
        }

    } catch (error) {
        console.error("Erro crítico no processamento da requisição:", error);
        return res.status(500).json({ error: `Erro interno do servidor: ${error.message}` });
    }
});

// --- Inicialização do Servidor ---
app.listen(port, "0.0.0.0", async () => {
    try {
        await mcp.connect(); 
        console.log(`MCP rodando em http://localhost:${port}`);
    } catch (error) {
        console.error("Erro ao conectar no banco:", error.message);
    }
});

// Exportar para testes ou uso em outros módulos (se necessário)
module.exports = { app, mcp };




