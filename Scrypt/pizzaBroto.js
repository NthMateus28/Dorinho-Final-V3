document.addEventListener("DOMContentLoaded", function () {
    var btnAdicionarList = document.querySelectorAll(".btnAdicionar");

    btnAdicionarList.forEach(function (btnAdicionar) {
        btnAdicionar.addEventListener("click", function () {
            var productElement = btnAdicionar.closest(".product");
            var unidadeElement = productElement.querySelector(".unidade");
            var unidadeValue = parseInt(unidadeElement.textContent);
            var resultadoFinalElement =
                document.querySelector(".resultadoFinal");
            var valorAtual = parseFloat(resultadoFinalElement.textContent);

            // Incrementa a unidade e o valor total
            unidadeValue += 1;
            unidadeElement.textContent = unidadeValue;
            valorAtual += 28.0; // Adiciona R$2,00 para cada unidade

            resultadoFinalElement.textContent = valorAtual.toFixed(2);

            atualizarLocalStorage();
        });
    });

    var btnRetirarList = document.querySelectorAll(".btnRetirar");

    btnRetirarList.forEach(function (btnRetirar) {
        btnRetirar.addEventListener("click", function () {
            var productElement = btnRetirar.closest(".product");
            var unidadeElement = productElement.querySelector(".unidade");
            var unidadeValue = parseInt(unidadeElement.textContent);
            var resultadoFinalElement =
                document.querySelector(".resultadoFinal");
            var valorAtual = parseFloat(resultadoFinalElement.textContent);

            if (unidadeValue > 0) {
                unidadeValue -= 1;
                unidadeElement.textContent = unidadeValue;
                valorAtual -= 2.0; // Subtrai R$2,00 para cada unidade
                valorAtual = Math.max(valorAtual, 0); // Garante que o valor não seja negativo

                resultadoFinalElement.textContent = valorAtual.toFixed(2);

                atualizarLocalStorage();
            }
        });
    });

    function atualizarLocalStorage() {
        var saboresSelecionados = [];
        var unidades = document.querySelectorAll(".unidade");
        unidades.forEach(function (unidade) {
            var quantidade = parseInt(unidade.textContent);
            if (quantidade > 0) {
                var sabor = unidade
                    .closest(".product")
                    .getAttribute("data-index");
                saboresSelecionados.push({
                    sabor: sabor,
                    quantidade: quantidade,
                });
            }
        });

        var valorTotal = parseFloat(
            document.querySelector(".resultadoFinal").textContent
        );
        localStorage.setItem(
            "saboresSelecionados",
            JSON.stringify(saboresSelecionados)
        );
        localStorage.setItem("valorTotal", valorTotal.toFixed(2));
    }
});
