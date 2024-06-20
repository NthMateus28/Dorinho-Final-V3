document.addEventListener("DOMContentLoaded", function () {
    let saboresSelecionados =
        JSON.parse(localStorage.getItem("saboresSelecionados")) || [];
    let adicoesSelecionadas =
        JSON.parse(localStorage.getItem("adicoesSelecionadas")) || {};
    let observacoes = localStorage.getItem("observacoes") || "";
    let valorTotal = parseFloat(localStorage.getItem("valorTotal")) || 0.0;

    const resultadoFinalElement = document.querySelector(".resultadoFinal");
    const obsInput = document.getElementById("obs");
    const pizzaSelecionadaDiv = document.querySelector(".pizzaSelecionada");

    // Atualizando a interface com os dados do localStorage
    resultadoFinalElement.textContent = valorTotal.toFixed(2);
    obsInput.value = observacoes;

    // Atualiza a lista de sabores na página
    if (saboresSelecionados.length > 0) {
        pizzaSelecionadaDiv.innerHTML = `${saboresSelecionados
            .map((s) => `<p>${s.sabor}</p>`)
            .join("")}`;
    } else {
        pizzaSelecionadaDiv.innerHTML =
            "<p>Sabor 1: Nenhum sabor selecionado</p>";
    }

    // Código existente para manipulação dos botões
    document
        .querySelectorAll(".btnAdicionar, .btnRetirar")
        .forEach((button) => {
            button.addEventListener("click", function () {
                const productElement = button.closest(".product");
                const unidadeElement = productElement.querySelector(".unidade");
                let quantidade = parseInt(unidadeElement.textContent);

                const isAdding = button.classList.contains("btnAdicionar");
                quantidade = isAdding
                    ? quantidade + 1
                    : Math.max(quantidade - 1, 0);
                unidadeElement.textContent = quantidade;

                const titleProductText =
                    productElement.querySelector(".titleProduct").innerText;
                const nomeProduto = titleProductText.split("\n")[0].trim();
                const precoString = titleProductText
                    .match(/R\$([\d,]+)/)[1]
                    .replace(",", ".");
                const preco = parseFloat(precoString);

                valorTotal = isAdding
                    ? valorTotal + preco
                    : Math.max(valorTotal - preco, 0);
                resultadoFinalElement.textContent = valorTotal.toFixed(2);

                const chaveProduto = nomeProduto;
                if (quantidade > 0) {
                    adicoesSelecionadas[chaveProduto] = { quantidade, preco };
                } else {
                    delete adicoesSelecionadas[chaveProduto];
                }

                localStorage.setItem("valorTotal", valorTotal.toString());
                localStorage.setItem(
                    "adicoesSelecionadas",
                    JSON.stringify(adicoesSelecionadas)
                );
            });
        });

    obsInput.addEventListener("input", () =>
        localStorage.setItem("observacoes", obsInput.value)
    );

    // Botão para salvar todos os dados atualizados no localStorage
    document
        .getElementById("saveButton")
        ?.addEventListener("click", function () {
            localStorage.setItem("observacoes", obsInput.value);
            localStorage.setItem("addLoc", addLocInput.value);
            localStorage.setItem("valorTotal", valorTotal.toString());
            localStorage.setItem(
                "adicoesSelecionadas",
                JSON.stringify(adicoesSelecionadas)
            );
            alert("Pedido salvo com sucesso!");
        });
});
