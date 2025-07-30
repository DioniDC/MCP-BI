const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Usa IA para extrair o nome do produto de uma pergunta.
 */
async function extractProductNameWithIA(question) {
  const prompt = `
Você receberá uma pergunta sobre vendas ou produtos. Extraia apenas o NOME DO PRODUTO mencionado.

Exemplos:
- Pergunta: "qual o produto que mais vendeu com a cerveja heineken 269ML?"
- Resposta: cerveja heineken 269ML

- Pergunta: "o que mais é comprado junto com arroz tipo 1 5kg?"
- Resposta: arroz tipo 1 5kg

- Pergunta: "qual o total de vendas?"
- Resposta: N/A

Pergunta: "${question}"
Responda apenas com o nome do produto ou "N/A".`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Você extrai nomes de produtos. Responda apenas com o nome do produto ou 'N/A'." },
        { role: "user", content: prompt }
      ],
      temperature: 0,
      max_tokens: 30,
    });

    const result = completion.choices[0].message.content.trim();
    return result.toUpperCase() === "N/A" ? null : result;
  } catch (e) {
    console.error("Erro ao extrair nome de produto com IA:", e);
    return null;
  }
}

/**
 * Resolve o código de um produto mencionado na pergunta, substituindo pelo formato "produto de código X".
 */
async function resolveProductNameInQuestion(question, pool) {
  const productName = await extractProductNameWithIA(question);

  if (!productName) {
    return { status: "not_needed", resolvedQuestion: question };
  }

  const like = `%${productName.replace(/\s/g, "%")}%`;

  try {
    const [rows] = await pool.query(
      `SELECT codigo, descricao FROM view_produtos WHERE descricao LIKE ? GROUP BY codigo, descricao LIMIT 21`,
      [like]
    );

    if (rows.length === 0) {
      return { status: "error", type: "not_found", message: `Nenhum produto parecido com "${productName}".` };
    }

    if (rows.length === 1) {
      const codigo = rows[0].codigo;
      const resolved = question.replace(productName, `produto de código ${codigo}`);
      console.log(`✅ Produto resolvido: ${productName} → ${codigo}`);
      return { status: "resolved", resolvedQuestion: resolved };
    }

    if (rows.length <= 20) {
      return {
        status: "ambiguous",
        type: "ambiguous",
        message: `Encontrei ${rows.length} produtos parecidos com "${productName}".`,
        options: rows.map(p => ({ nome: p.descricao, codigo: p.codigo })),
      };
    }

    return {
      status: "error",
      type: "too_many",
      message: `Mais de 20 produtos parecidos com "${productName}". Refine sua busca.`,
    };

  } catch (err) {
    console.error("Erro ao consultar produto:", err);
    return { status: "error", message: "Erro interno ao consultar produto." };
  }
}

module.exports = { resolveProductNameInQuestion };
