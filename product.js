async function resolveProductName(question, pool) {
    const regex = /produto\s+([a-zA-Z0-9\s\-\/]+)/i;
    const match = question.match(regex);
    if (!match) return { resolvedQuestion: question }; // Nada a resolver

    const nomeProduto = match[1].trim();

    try {
        const [rowsExact] = await pool.query(
            "SELECT codigo, descricao FROM view_produtos WHERE descricao = ?",
            [nomeProduto]
        );

        if (rowsExact.length === 1) {
            const resolved = question.replace(nomeProduto, `código ${rowsExact[0].codigo}`);
            return { resolvedQuestion: resolved };
        }

        const [rowsLike] = await pool.query(
            "SELECT codigo, descricao FROM view_produtos WHERE descricao LIKE ?",
            [`%${nomeProduto}%`]
        );

        if (rowsLike.length === 1) {
            const resolved = question.replace(nomeProduto, `código ${rowsLike[0].codigo}`);
            return { resolvedQuestion: resolved };
        }

        if (rowsLike.length > 1 && rowsLike.length <= 20) {
            return {
                error: `Foram encontrados ${rowsLike.length} produtos similares a "${nomeProduto}". Por favor, selecione um:\n` +
                    rowsLike.map(p => `- ${p.descricao} (código ${p.codigo})`).join('\n')
            };
        }

        if (rowsLike.length > 20) {
            return {
                error: `Mais de 20 produtos encontrados para "${nomeProduto}". Seja mais específico.`
            };
        }

        return {
            error: `Nenhum produto encontrado com o nome "${nomeProduto}".`
        };

    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        return { error: "Erro interno ao buscar produto." };
    }
}

module.exports = { resolveProductName };
