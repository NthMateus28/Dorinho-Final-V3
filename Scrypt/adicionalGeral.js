document.addEventListener("DOMContentLoaded", function () {
    // Carregamento dos dados do localStorage
    let saboresSelecionados = JSON.parse(localStorage.getItem("saboresSelecionados")) || [];
    let adicoesSelecionadas = JSON.parse(localStorage.getItem("adicoesSelecionadas")) || {};
    let observacoes = localStorage.getItem("observacoes") || "";
    let addLoc = localStorage.getItem("addLoc") || "";
    let valorTotal = parseFloat(localStorage.getItem("valorTotal")) || 0.0;

    // Acesso aos elementos da interface
    const pizzaSelecionadaDiv = document.querySelector(".pizzaSelecionada");
    const resultadoFinalElement = document.querySelector(".resultadoFinal");
    const obsInput = document.getElementById("obs");
    const addLocInput = document.getElementById("addLoc");

    // Atualização da interface com os dados carregados
    pizzaSelecionadaDiv.innerHTML = saboresSelecionados.map((sabor, index) => 
        `<p>Sabor ${index + 1}: ${sabor.sabor.split("-")[0]}</p>`
    ).join("");
    resultadoFinalElement.textContent = valorTotal.toFixed(2);
    obsInput.value = observacoes;
    addLocInput.value = addLoc;

    // Eventos para atualizar observações e localização adicional
    obsInput.addEventListener("input", () => localStorage.setItem("observacoes", obsInput.value));
    addLocInput.addEventListener("input", () => localStorage.setItem("addLoc", addLocInput.value));

    // Manipulação dos botões de adicionar e retirar produtos
    document.querySelectorAll(".btnAdicionar, .btnRetirar").forEach(button => {
        button.addEventListener("click", function () {
            const isAdding = button.classList.contains("btnAdicionar");
            const productElement = button.closest(".product");
            const unidadeElement = productElement.querySelector(".unidade");
            const saborAdicionalInput = productElement.querySelector("input[type='text']");
            let quantidade = parseInt(unidadeElement.textContent);

            quantidade = isAdding ? quantidade + 1 : Math.max(quantidade - 1, 0);
            unidadeElement.textContent = quantidade;

            const nomeProduto = productElement.querySelector(".titleProduct").textContent.split("\n")[0].trim();
            const preco = parseFloat(productElement.querySelector(".titleProduct").textContent.match(/\d+,\d+/)[0].replace(",", "."));
            const saborAdicional = saborAdicionalInput ? saborAdicionalInput.value : "";

            valorTotal = isAdding ? valorTotal + preco : Math.max(valorTotal - preco, 0);
            resultadoFinalElement.textContent = valorTotal.toFixed(2);

            const chaveProduto = `${nomeProduto}-${saborAdicional}`;
            if (quantidade > 0) {
                adicoesSelecionadas[chaveProduto] = {
                    quantidade: quantidade,
                    preco: preco,
                    saborAdicional: saborAdicional
                };
            } else {
                delete adicoesSelecionadas[chaveProduto];
            }

            localStorage.setItem("valorTotal", valorTotal.toString());
            localStorage.setItem("adicoesSelecionadas", JSON.stringify(adicoesSelecionadas));
        });
    });

    // Botão para salvar todos os dados atualizados no localStorage
    document.getElementById("saveButton")?.addEventListener("click", function () {
        localStorage.setItem("observacoes", obsInput.value);
        localStorage.setItem("addLoc", addLocInput.value);
        localStorage.setItem("valorTotal", valorTotal.toString());
        localStorage.setItem("adicoesSelecionadas", JSON.stringify(adicoesSelecionadas));
        alert("Pedido salvo com sucesso!");
    });
});
