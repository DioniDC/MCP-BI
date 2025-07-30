require("dotenv").config();
const OpenAI = require("openai");
const { schemas, prompts } = require("./schemas");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateSqlQuery(question, domain, schemas) {
    // Acessa o prompt correto para o domínio, passando a pergunta.
    // Seus prompts detalhados são a chave aqui.
    const prompt = prompts[domain](question);

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                // O system prompt já instrui a IA a retornar APENAS a query.
                { "role": "system", "content": "Você é um assistente de BI que gera queries SQL para um banco de dados MySQL. Retorne APENAS a query SQL gerada, sem explicações, markdown ou texto adicional." },
                { "role": "user", "content": prompt }
            ],
            temperature: 0.0, // Temperatura 0 para máxima previsibilidade
            max_tokens: 500,
        });

        let sqlQuery = completion.choices[0].message.content.trim();

        // --- NOVA LÓGICA DE EXTRAÇÃO ---
        // 1. Tenta extrair de um bloco de código SQL.
        const sqlBlockMatch = sqlQuery.match(/```sql\s*([\s\S]*?)\s*```/);
        if (sqlBlockMatch) {
            sqlQuery = sqlBlockMatch[1].trim();
        } else {
            // 2. Se não houver bloco, remove qualquer texto antes do "SELECT".
            // Isso lida com casos onde a IA adiciona uma introdução.
            const selectIndex = sqlQuery.toUpperCase().indexOf("SELECT");
            if (selectIndex > -1) {
                sqlQuery = sqlQuery.substring(selectIndex);
            }
        }

        // 3. Remove o ponto e vírgula final, que às vezes causa problemas.
        if (sqlQuery.endsWith(';')) {
            sqlQuery = sqlQuery.slice(0, -1);
        }

        return sqlQuery;

    } catch (error) {
        console.error("Erro ao chamar a API da OpenAI:", error);
        throw new Error("Falha ao gerar a query SQL via IA.");
    }
}


// Função para tentar identificar o domínio da pergunta
// Em um cenário real, isso poderia ser mais sofisticado (e.g., outro LLM, classificação de texto)
function identifyDomain(question) {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("produto") || lowerQuestion.includes("venda") || lowerQuestion.includes("estoque") || lowerQuestion.includes("marca") || lowerQuestion.includes("departamento") || lowerQuestion.includes("grupo") || lowerQuestion.includes("subgrupo")) {
        return "produtos_vendas";
    } else if (lowerQuestion.includes("cliente") || lowerQuestion.includes("cpf") || lowerQuestion.includes("cadastro")) {
        return "clientes";
    } else if (lowerQuestion.includes("pagar") || lowerQuestion.includes("receber") || lowerQuestion.includes("cartao") || lowerQuestion.includes("financeiro")) {
        return "financeiro";
    } else if (lowerQuestion.includes("despesa") || lowerQuestion.includes("custo")) {
        return "despesas";
    } else if (lowerQuestion.includes("previsao") || lowerQuestion.includes("meta")) {
        return "previsoes_metas";
    } else if (lowerQuestion.includes("indicador") || lowerQuestion.includes("painel") || lowerQuestion.includes("estoque negativo")) {
        return "indicadores";
    } else if (lowerQuestion.includes("usuario") || lowerQuestion.includes("sistema") || lowerQuestion.includes("relatorio")) {
        return "sistema_usuarios";
    }
    return null; // Domínio não identificado
}

module.exports = { generateSqlQuery, identifyDomain };


