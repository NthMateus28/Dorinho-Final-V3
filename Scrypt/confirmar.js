document.addEventListener("DOMContentLoaded", () => {
    const telefoneInput = document.getElementById("telefone");
    const formaPagamentoSelect = document.getElementById("formaPagamento");
    const divTroco = document.getElementById("divTroco");
    const trocoInput = document.getElementById("troco");

    telefoneInput.addEventListener("input", function (event) {
        const input = event.target;
        const inputLength = input.value.length;
        if (isNaN(input.value[inputLength - 1])) {
            input.value = input.value.substring(0, inputLength - 1);
            return;
        }
        if (inputLength === 1) {
            input.value = `(${input.value}`;
        } else if (inputLength === 3) {
            input.value = `${input.value}) `;
        } else if (inputLength === 10) {
            input.value = `${input.value}-`;
        } else if (inputLength > 15) {
            input.value = input.value.substring(0, 15);
        }
    });

    trocoInput.addEventListener('input', formatCurrency);

    const table = document.querySelector("table");
    let finalPrice = document.getElementById("finalPrice");
    let finalFrete = document.getElementById("finalFrete");
    let finalTotal = document.getElementById("finalTotal");
    const teleEntregaRadio = document.getElementById("teleEntrega");
    const tirarBalcaoRadio = document.getElementById("tirarBalcao");
    const bairrosLabel = document.querySelector('label[for="bairros"]');
    const bairrosSelect = document.getElementById("bairros");
    const enderecoLabel = document.querySelector('label[for="endereco"]');
    const enderecoInput = document.getElementById("endereco");
    const formaPagamentoLabel = document.querySelector(
        'label[for="formaPagamento"]'
    );
    
    function formatCurrency(event) {
        let value = event.target.value;
        value = value.replace(/\D/g, ''); // Remove tudo o que não é dígito
        value = (parseInt(value) / 100).toFixed(2); // Divide por 100 e fixa duas casas decimais
        value = value.replace('.', ','); // Troca ponto por vírgula
        value = value.replace(/(\d)(?=(\d{3})+\,)/g, '$1.'); // Adiciona ponto como separador de milhares
        event.target.value = `R$ ${value}`;
    }

    formaPagamentoSelect.addEventListener("change", () => {
        const formaPagamento = formaPagamentoSelect.value;
        if (formaPagamento === "Dinheiro") {
            divTroco.style.display = "block";
        } else {
            divTroco.style.display = "none";
            trocoInput.value = '';
        }
    });
    
    function mostrarOcultarCamposTeleEntrega() {
        if (teleEntregaRadio.checked) {
            // Se Tele-Entrega estiver selecionado, mostra os elementos
            bairrosLabel.style.display = "block";
            bairrosSelect.style.display = "block";
            enderecoLabel.style.display = "block";
            enderecoInput.style.display = "block";
            formaPagamentoLabel.style.display = "block";
            formaPagamentoSelect.style.display = "block";
        } else {
            // Caso contrário, esconde os elementos
            bairrosLabel.style.display = "none";
            bairrosSelect.style.display = "none";
            enderecoLabel.style.display = "none";
            enderecoInput.style.display = "none";
            formaPagamentoLabel.style.display = "none";
            formaPagamentoSelect.style.display = "none";
        }
    }

    function calcularFrete() {
        const valorBairro =
            bairrosSelect.options[bairrosSelect.selectedIndex].getAttribute(
                "data-frete"
            );
        finalFrete.textContent = `R$${valorBairro}`;
        calcularTotal();
    }

    function calcularTotal() {
        const valorProdutos = parseFloat(
            finalPrice.textContent.replace("R$", "")
        );
        const valorFrete = parseFloat(finalFrete.textContent.replace("R$", ""));
        const total = valorProdutos + valorFrete;
        finalTotal.textContent = `R$${total.toFixed(2)}`;
    }

    function salvarPedidoLocal() {
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const tipoRetirada = document.querySelector(
            'input[name="retirada"]:checked'
        ).value;
        const bairro = document.getElementById("bairros").value;
        const endereco = document.getElementById("endereco").value;
        const formaPagamento = document.getElementById("formaPagamento").value;
        const somaProdutos = document.getElementById("finalPrice").textContent;
        const frete = document.getElementById("finalFrete").textContent;
        const total = document.getElementById("finalTotal").textContent;

        const pedido = {
            nome,
            telefone,
            tipoRetirada,
            bairro,
            endereco,
            formaPagamento,
            somaProdutos,
            frete,
            total,
        };

        localStorage.setItem("pedido", JSON.stringify(pedido));
    }

    function enviarPedidoWhatsApp() {
        const pedido = JSON.parse(localStorage.getItem("pedido"));
        const addLoc = localStorage.getItem("addLoc") || "Nenhuma instrução adicional";
        const observacoes = localStorage.getItem("observacoes") || "Sem observações";
        const troco = trocoInput.value;
        const saboresSelecionados = JSON.parse(localStorage.getItem("saboresSelecionados")) || [];
        const bordasSelecionadas = JSON.parse(localStorage.getItem("bordasSelecionadas")) || {};
    
        let mensagem = `Quero realizar meu pedido! Segue os dados do meu Pedido:\n\n`;
        mensagem += `*Nome:* ${pedido.nome}\n\n`;
        mensagem += `*Telefone:* ${pedido.telefone}\n\n`;
        mensagem += `*Tipo de retirada:* ${pedido.tipoRetirada}\n\n`;
        if (pedido.tipoRetirada === "Tele Entrega") {
            mensagem += `*Bairro:* ${pedido.bairro}\n\n`;
            mensagem += `*Endereço:* ${pedido.endereco}\n\n`;
        }
        mensagem += `*Forma de pagamento:* ${pedido.formaPagamento}\n\n`;
        if (pedido.formaPagamento === "Dinheiro" && troco) {
            mensagem += `*Troco para:* ${troco}\n\n`;
        }
        // Adicionando os sabores selecionados à mensagem
        if (saboresSelecionados.length > 0) {
            mensagem += `*Sabores Selecionados:*\n`;
            saboresSelecionados.forEach((sabor, index) => {
                mensagem += `${index + 1}. ${sabor.sabor}\n`;
            });
            mensagem += `\n`;
        }
        // Adicionando as bordas selecionadas à mensagem
        mensagem += `*Borda Selecionada:*\n`;
        for (const borda in bordasSelecionadas) {
            if (bordasSelecionadas[borda] > 0) {
                mensagem += `${borda}: ${bordasSelecionadas[borda]}x\n`;
            }
        }
        // Incluir addLoc e observacoes
        mensagem += `*Instruções Adicionais:* ${addLoc}\n\n`;
        mensagem += `*Observações:* ${observacoes}\n\n`;
    
        mensagem += `*Soma dos produtos:* ${pedido.somaProdutos}\n\n`;
        mensagem += `*Frete:* ${pedido.frete}\n\n`;
        mensagem += `*Total:* ${pedido.total}\n\n\n`;
    
        const linkWhatsApp = `https://api.whatsapp.com/send?phone=5551995694663&text=${encodeURIComponent(mensagem)}`;
        window.open(linkWhatsApp, "_blank");
    }    

    function atualizarTotal() {
        const valorProdutos = parseFloat(localStorage.getItem("valorTotal")) || 0.0;
        document.getElementById("finalPrice").textContent = `R$${valorProdutos.toFixed(2)}`;
        const valorFrete = parseFloat(document.getElementById("finalFrete").textContent.replace("R$", "")) || 0.0;
        const total = valorProdutos + valorFrete;
        document.getElementById("finalTotal").textContent = `R$${total.toFixed(2)}`;
    }
    
    const salvarPedidoButton = document.getElementById("enviarPedidoButton");
    salvarPedidoButton.addEventListener("click", () => {
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const tipoRetirada = document.querySelector('input[name="retirada"]:checked').value;
        const bairro = document.getElementById("bairros").value;
        const endereco = document.getElementById("endereco").value;
        const formaPagamento = formaPagamentoSelect.value;
        const troco = trocoInput.value;
        const somaProdutos = document.getElementById("finalPrice").textContent;
        const frete = document.getElementById("finalFrete").textContent;
        const total = document.getElementById("finalTotal").textContent;

        const pedido = {
            nome,
            telefone,
            tipoRetirada,
            bairro,
            endereco,
            formaPagamento,
            troco,
            somaProdutos,
            frete,
            total
        };

        localStorage.setItem("pedido", JSON.stringify(pedido));
        enviarPedidoWhatsApp();
        enviarDadosParaSheetmonkey();
        
    });


    teleEntregaRadio.addEventListener("change", () => {
        mostrarOcultarCamposTeleEntrega();
        calcularFrete();
    });

    tirarBalcaoRadio.addEventListener("change", () => {
        mostrarOcultarCamposTeleEntrega();
        calcularFrete();
    });

    bairrosSelect.addEventListener("change", calcularFrete);

    mostrarOcultarCamposTeleEntrega();

    window.onload = () => {
        const saboresSelecionados = JSON.parse(localStorage.getItem("saboresSelecionados")) || [];
        saboresSelecionados.forEach((sabor) => {
            let newRow = document.createElement("tr");
            let nameCell = document.createElement("td");
            nameCell.textContent = sabor.sabor;
            newRow.appendChild(nameCell);
            table.appendChild(newRow);
        });

        const adicoesSelecionadas = JSON.parse(localStorage.getItem("adicoesSelecionadas")) || {};
        Object.entries(adicoesSelecionadas).forEach(([chave, detalhes]) => {
            let newRow = document.createElement("tr");
            let productCell = document.createElement("td");
            productCell.textContent = chave.split('-')[0]; // Nome do produto
            newRow.appendChild(productCell);
            table.appendChild(newRow);
        });

        const addLoc = localStorage.getItem("addLoc") || "";
        if (addLoc) {
            const newRow = document.createElement("tr");
            const locCell = document.createElement("td");
            locCell.textContent = `Instrução do adicional: ${addLoc}`;
            newRow.appendChild(locCell);
            table.appendChild(newRow);
        }

        const observacoes = localStorage.getItem("observacoes") || "Sem observações";
        const obsRow = document.createElement("tr");
        const obsCell = document.createElement("td");
        obsCell.textContent = `Observações: ${observacoes}`;
        obsRow.appendChild(obsCell);
        table.appendChild(obsRow);

        atualizarTotal();
    };
    
    

    const enviarPedidoButton = document.getElementById("enviarPedidoButton");
    enviarPedidoButton.addEventListener("click", enviarPedidoWhatsApp);

    function enviarDadosParaSheetmonkey() {
        const url = "https://api.sheetmonkey.io/form/hLxooDBhCHFYaBi5N2BcLi";

        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const tipoRetirada = document.querySelector(
            'input[name="retirada"]:checked'
        ).value;
        const bairro = document.getElementById("bairros").value;
        const endereco = document.getElementById("endereco").value;
        const formaPagamento = document.getElementById("formaPagamento").value;
        const troco = document.getElementById("troco").value;
        const somaProdutos = document.getElementById("finalPrice").textContent;
        const frete = document.getElementById("finalFrete").textContent;
        const total = document.getElementById("finalTotal").textContent;
        const addLoc = localStorage.getItem("addLoc") || "Nenhuma instrução adicional";
        const observacoes = localStorage.getItem("observacoes") || "Sem observações";

        // Obter produtos do localStorage
        const sabores = JSON.parse(localStorage.getItem("saboresSelecionados"));
        const bordas = JSON.parse(localStorage.getItem("bordasSelecionadas")); // Carrega as bordas selecionadas
        let produtosString = ""; // String formatada para representar os produtos

        // Montar string de produtos
        sabores.forEach((produto) => {
            produtosString += `Sabor: ${produto.sabor}\nQuantidade: ${produto.quantidade}\n`;
            if (bordas && Object.keys(bordas).length > 0) {
                // Verifica se há bordas e adiciona à string
                for (const [borda, quantidade] of Object.entries(bordas)) {
                    if (quantidade > 0) {
                        // Apenas adiciona se houver pelo menos uma borda do tipo
                        produtosString += `Borda: ${borda}\nQuantidade de Borda: ${quantidade}\n`;
                    }
                }
            }
            produtosString += "\n"; // Adiciona uma linha em branco entre os produtos
        });

        const data = {
            Nome: nome,
            Telefone: telefone,
            "Tipo de retirada": tipoRetirada,
            Bairro: bairro,
            Endereco: endereco,
            "Forma de pagamento": formaPagamento,
            Troco: troco,
            "Soma dos produtos": somaProdutos,
            Frete: frete,
            Total: total,
            Produtos: produtosString,
            "Instruções Adicionais": addLoc,
            Observacoes: observacoes
        };
        

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    console.log(
                        "Dados enviados com sucesso para o Sheetmonkey!"
                    );
                    localStorage.removeItem("pedido"); // Pode querer remover outros itens relacionados aqui também
                } else {
                    console.error(
                        "Erro ao enviar dados para o Sheetmonkey:",
                        response.status
                    );
                }
            })
            .catch((error) => {
                console.error(
                    "Erro ao enviar dados para o Sheetmonkey:",
                    error
                );
            });
    }
});