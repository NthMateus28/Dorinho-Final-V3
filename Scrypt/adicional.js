document.addEventListener("DOMContentLoaded", function () {
    let saboresSelecionados =
        JSON.parse(localStorage.getItem("saboresSelecionados")) || [];

    // Reinicializa bordasSelecionadas ao carregar a página
    let bordasSelecionadas = {};
    localStorage.setItem(
        "bordasSelecionadas",
        JSON.stringify(bordasSelecionadas)
    );

    let valorTotal = parseFloat(localStorage.getItem("valorTotal")) || 0.0;

    const pizzaSelecionadaDiv = document.querySelector(".pizzaSelecionada");
    pizzaSelecionadaDiv.innerHTML = "";

    saboresSelecionados.forEach(function (sabor, index) {
        const nomeSabor = sabor.sabor.split("-")[0];
        const pizzaParagrafo = document.createElement("p");
        pizzaParagrafo.textContent = `Sabor ${index + 1}: ${nomeSabor}`;
        pizzaSelecionadaDiv.appendChild(pizzaParagrafo);
    });

    const resultadoFinalElement = document.querySelector(".resultadoFinal");
    resultadoFinalElement.textContent = valorTotal.toFixed(2);

    // Funcionalidade para o botão adicionar
    document.querySelectorAll(".btnAdicionar").forEach(function (button) {
        button.addEventListener("click", function () {
            const productElement = button.closest(".product");
            const unidadeElement = productElement.querySelector(".unidade");
            let quantidade = parseInt(unidadeElement.textContent);
            quantidade++;
            unidadeElement.textContent = quantidade;

            const nomeBorda = productElement
                .querySelector(".titleProduct")
                .textContent.split("\n")[0]
                .trim();
            const preco = parseFloat(
                productElement
                    .querySelector(".titleProduct")
                    .textContent.match(/\d+,\d+/)[0]
                    .replace(",", ".")
            );

            valorTotal += preco;
            resultadoFinalElement.textContent = valorTotal.toFixed(2);

            bordasSelecionadas = {}; // Reinicia as bordas selecionadas a cada clique
            bordasSelecionadas[nomeBorda] = quantidade;

            localStorage.setItem("valorTotal", valorTotal.toString());
            localStorage.setItem(
                "bordasSelecionadas",
                JSON.stringify(bordasSelecionadas)
            );
        });
    });

    // Funcionalidade para o botão remover
    document.querySelectorAll(".btnRetirar").forEach(function (button) {
        button.addEventListener("click", function () {
            const productElement = button.closest(".product");
            const unidadeElement = productElement.querySelector(".unidade");
            let quantidade = parseInt(unidadeElement.textContent);
            if (quantidade > 0) {
                quantidade--;
                unidadeElement.textContent = quantidade;

                const nomeBorda = productElement
                    .querySelector(".titleProduct")
                    .textContent.split("\n")[0]
                    .trim();
                const preco = parseFloat(
                    productElement
                        .querySelector(".titleProduct")
                        .textContent.match(/\d+,\d+/)[0]
                        .replace(",", ".")
                );

                valorTotal -= preco;
                valorTotal = valorTotal < 0 ? 0 : valorTotal;
                resultadoFinalElement.textContent = valorTotal.toFixed(2);

                bordasSelecionadas = {}; // Reinicia as bordas selecionadas a cada clique
                if (quantidade > 0) {
                    bordasSelecionadas[nomeBorda] = quantidade;
                }

                localStorage.setItem("valorTotal", valorTotal.toString());
                localStorage.setItem(
                    "bordasSelecionadas",
                    JSON.stringify(bordasSelecionadas)
                );
            }
        });
    });
});
