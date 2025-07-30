require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const allowedDomains = [
  "produtos_vendas",
  "clientes",
  "financeiro",
  "despesas",
  "previsoes_metas",
  "indicadores",
];

async function identifyDomainWithIA(question) {
  const domains = ["produtos_vendas", "clientes", "financeiro", "despesas", "previsoes_metas", "indicadores", "sistema_usuarios"];
  const prompt = `
  Você é um classificador de perguntas para um sistema de BI.

  Classifique a seguinte pergunta em um dos domínios abaixo:

  - produtos_vendas → Perguntas sobre produtos, vendas, estoque, preços, categorias, promoções, marcas, departamentos.
  - clientes → Perguntas sobre clientes, CPF, cadastro, localização, faixa etária, sexo.
  - financeiro → Perguntas sobre contas a pagar, contas a receber, pagamentos, recebimentos, cartões.
  - despesas → Perguntas sobre gastos, custos, fornecedores, categorias de despesa.
  - previsoes_metas → Perguntas sobre metas, previsões de vendas ou lucro, por período ou hierarquia.
  - indicadores → Perguntas sobre alertas, indicadores de estoque, margem, desempenho.
  - sistema_usuarios → Perguntas sobre usuários, permissões, relatórios, configurações do sistema.

  Pergunta: "${question}"

  Responda apenas com o nome do domínio, como: produtos_vendas, clientes, etc.
  Se não tiver certeza, retorne "indefinido".
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: "Você é um classificador de texto. Responda apenas com o nome do domínio." }, { role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 15
    });
    const domain = completion.choices[0].message.content.trim();
    return domains.includes(domain) ? domain : null;
  } catch (error) {
    console.error("Erro ao identificar domínio via IA:", error);
    return null;
  }
}

module.exports = { identifyDomainWithIA };
