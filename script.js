
/*
    URL principal da API.
    Essa URL permite buscar os produtos disponíveis.
*/
const API_URL = "https://dummyjson.com/products";

/*
    Define a quantidade máxima de produtos
    disponíveis no catálogo.
*/
const LIMITE_PRODUTOS = 20;


// ==================================================
// FUNÇÃO PARA CARREGAR OS PRODUTOS
// ==================================================

/*
    async permite utilizar await dentro da função.
    Essa função será responsável por buscar os produtos
    e mostrar os resultados na página.
*/
async function carregaProdutos() {

    // Localiza a área onde os cards serão exibidos
    const container = document.getElementById("lista-produtos");

    // Exibe uma mensagem enquanto os produtos são carregados
    container.innerHTML = '<p class="mensagem">Carregando produtos...</p>';

    try {

        /*
            fetch realiza uma requisição HTTP para a API.
            O parâmetro limit=20 determina que serão buscados
            somente 20 produtos.
        */
        const resposta = await fetch(`${API_URL}?limit=${LIMITE_PRODUTOS}`);

        // Verifica se a requisição foi realizada corretamente
        if (!resposta.ok) {
            throw new Error("Erro ao buscar os produtos.");
        }

        /*
            Converte a resposta da API para o formato JSON.
            Assim conseguimos acessar os dados utilizando JavaScript.
        */
        const dados = await resposta.json();

        // Limpa a mensagem de carregamento
        container.innerHTML = "";

        /*
            Percorre a lista de produtos recebida da API.
            Para cada produto, cria um card HTML.
        */
        dados.products.forEach(produto => {

            // Cria o conteúdo HTML do card
            const cardHTML = `
                <div class="product-card">

                    <img
                        src="${produto.thumbnail}"
                        alt="${produto.title}"
                        class="product-image"
                    >

                    <div class="product-info">

                        <h3 class="product-title">
                            ${produto.title}
                        </h3>

                        <p class="product-description">
                            ${produto.description}
                        </p>

                        <div class="product-price">
                            R$ ${produto.price.toFixed(2)}
                        </div>

                        <button class="btn-buy">
                            Comprar agora
                        </button>

                    </div>

                </div>
            `;

            // Insere o card dentro da lista de produtos
            container.innerHTML += cardHTML;

        });

    } catch (erro) {

        // Exibe uma mensagem caso aconteça algum problema
        container.innerHTML = `
            <p class="mensagem">
                Não foi possível carregar os produtos.
            </p>
        `;

        // Mostra o erro no console do navegador
        console.error(erro);

    }
}


// ==================================================
// FUNÇÃO PARA CONSULTAR UM PRODUTO PELO ID
// ==================================================

/*
    Essa função permite buscar um produto específico.
    Ela utiliza o ID digitado pelo usuário para consultar
    diretamente o endereço /products/{id} da API.
*/
async function consultaProduto() {

    // Captura o campo onde o usuário digita o ID
    const campoId = document.getElementById("produto-id");

    // Captura a área onde o resultado será exibido
    const resultado = document.getElementById("resultado-consulta");

    // Obtém o valor digitado pelo usuário
    const id = campoId.value.trim();

    // Verifica se o ID está dentro do intervalo permitido
if (id === "" || Number(id) < 1 || Number(id) > LIMITE_PRODUTOS || !Number.isInteger(Number(id))) {

        resultado.innerHTML = `
            <p class="mensagem">
                Digite um ID válido entre 1 e ${LIMITE_PRODUTOS}.
            </p>
        `;

        return;
    }

    // Mostra uma mensagem enquanto a consulta é realizada
    resultado.innerHTML = `
        <p class="mensagem">Buscando produto...</p>
    `;

    try {

        /*
            Busca um produto específico utilizando seu ID.
            Exemplo: /products/1 retorna o produto de ID 1.
        */
        const resposta = await fetch(`${API_URL}/${id}`);

        // Verifica se o produto foi encontrado
        if (!resposta.ok) {
            throw new Error("Produto não encontrado.");
        }

        // Converte os dados recebidos para JSON
        const produto = await resposta.json();

        // Cria um card com as informações do produto encontrado
        resultado.innerHTML = `
            <div class="product-card">

                <img
                    src="${produto.thumbnail}"
                    alt="${produto.title}"
                    class="product-image"
                >

                <div class="product-info">

                    <h3 class="product-title">
                        ${produto.title}
                    </h3>

                    <p class="product-description">
                        ${produto.description}
                    </p>

                    <div class="product-price">
                        R$ ${produto.price.toFixed(2)}
                    </div>

                    <p>
                        ID: ${produto.id}
                    </p>

                </div>

            </div>
        `;

    } catch (erro) {

        // Informa ao usuário que o produto não foi encontrado
        resultado.innerHTML = `
            <p class="mensagem">
                Produto não encontrado. Verifique o ID.
            </p>
        `;

        // Exibe detalhes do erro no console
        console.error(erro);

    }

}


// ==================================================
// EVENTOS DOS BOTÕES
// ==================================================

/*
    addEventListener identifica quando o usuário clica
    no botão de consulta e executa a função correspondente.
*/
document.getElementById("btn-consultar").addEventListener("click", consultaProduto);

/*
    Permite consultar um produto pressionando
    a tecla Enter no campo de ID.
*/
document.getElementById("produto-id").addEventListener("keydown", function(evento) {

    if (evento.key === "Enter") {

        evento.preventDefault();

        consultaProduto();

    }

});


// ==================================================
// INICIALIZAÇÃO DO PROJETO
// ==================================================

/*
    Executa a função de carregamento assim que
    o JavaScript chega ao final do arquivo.
*/
carregaProdutos();
