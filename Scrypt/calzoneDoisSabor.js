document.addEventListener("DOMContentLoaded", function () {
    var btnAdicionarList = document.querySelectorAll(".btnAdicionar");
    var valorAdicionado = false; // Controla se o valor já foi adicionado

    btnAdicionarList.forEach(function (btnAdicionar) {
        btnAdicionar.addEventListener("click", function () {
            var index = btnAdicionar
                .closest(".product")
                .getAttribute("data-index");
            var unidadeElement = document.querySelector(
                '.product[data-index="' + index + '"] .unidade'
            );
            var unidadeValue = parseInt(unidadeElement.textContent);
            var resultadoFinalElement =
                document.querySelector(".resultadoFinal");
            var valorAtual = parseFloat(resultadoFinalElement.textContent);

            // Incrementa a unidade
            unidadeValue += 1;
            unidadeElement.textContent = unidadeValue;

            // Adiciona 70 apenas na primeira vez que qualquer unidade é adicionada
            if (!valorAdicionado) {
                valorAtual += 30.0;
                valorAdicionado = true; // Atualiza o controle para não adicionar novamente
            }

            resultadoFinalElement.textContent = valorAtual.toFixed(2);

            atualizarLocalStorage();
            rolarParaProximoSubtitulo();
        });
    });

    function rolarParaProximoSubtitulo() {
        // Calcule quantas unidades foram selecionadas
        var unidadesSelecionadas = document.querySelectorAll(".unidade");
        var quantidadeSelecionada = 0;
        unidadesSelecionadas.forEach(function (unidade) {
            if (parseInt(unidade.textContent) > 0) {
                quantidadeSelecionada++;
            }
        });

        // Determine para qual subtítulo rolar com base na quantidade de unidades selecionadas
        var idParaRolar = ""; // Inicialmente, não temos um ID para rolar
        if (quantidadeSelecionada === 1) {
            idParaRolar = "segundoSabor";
        } else if (quantidadeSelecionada === 2) {
            idParaRolar = "terceiroSabor";
        } else if (quantidadeSelecionada === 3) {
            idParaRolar = "quartoSabor";
            // Se 4 ou mais sabores foram selecionados, role para o botão final
            // Aqui, supomos que não há um ID específico, então usamos a classe para selecionar
            document.querySelector(".botaoFinal").scrollIntoView({
                behavior: "smooth",
            });
            return; // Para evitar tentar rolar novamente depois de encontrar o botão final
        }

        // Rola para o subtítulo específico, se um ID foi definido
        if (idParaRolar) {
            document.getElementById(idParaRolar).scrollIntoView({
                behavior: "smooth",
            });
        }
    }

    // Adicione um ouvinte de evento para cada botão de retirar
    var btnRetirarList = document.querySelectorAll(".btnRetirar");

    btnRetirarList.forEach(function (btnRetirar) {
        btnRetirar.addEventListener("click", function () {
            // Obtenha o índice do produto
            var index = btnRetirar
                .closest(".product")
                .getAttribute("data-index");

            // Atualize a classe 'unidade'
            var unidadeElement = document.querySelector(
                '.product[data-index="' + index + '"] .unidade'
            );
            var unidadeValue = parseInt(unidadeElement.textContent);
            if (unidadeValue > 0) {
                unidadeValue -= 1;
                unidadeElement.textContent = unidadeValue;

                // Atualize o valor final
                var resultadoFinalElement =
                    document.querySelector(".resultadoFinal");
                var valorAtual = parseFloat(resultadoFinalElement.textContent);
                var novoValor = valorAtual - 70.0;
                resultadoFinalElement.textContent = novoValor.toFixed(2);

                // Armazene localmente os sabores selecionados e o valor total
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
                var saborElement = unidade
                    .closest(".product")
                    .getAttribute("data-index");
                // Captura apenas o nome do sabor, excluindo o hífen e o número
                var sabor = saborElement.split("-")[0].trim();
                saboresSelecionados.push({
                    sabor: sabor, // Utiliza apenas o nome do sabor
                    quantidade: quantidade,
                });
            }
        });

        var valorTotal = parseFloat(
            document.querySelector(".resultadoFinal").textContent
        );

        // Armazenar no localStorage
        localStorage.setItem(
            "saboresSelecionados",
            JSON.stringify(saboresSelecionados)
        );
        localStorage.setItem("valorTotal", valorTotal.toFixed(2));
    }
});
