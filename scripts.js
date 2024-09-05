document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'products.json'; // URL do arquivo JSON local

    // Função para carregar produtos do arquivo JSON
    async function loadProducts() {
        try {
            const response = await fetch(API_URL);
            const products = await response.json();
            displayProducts(products);
            populateCategoryFilters(products);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

  // Função para exibir produtos
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4';
        productCard.innerHTML = `
            <div class="card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">R$${product.price.toFixed(2)}</p>
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });

    // Adicionar eventos aos botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            addToCart(productId);
        });
    });
}



    // Função para adicionar ao carrinho
    function addToCart(productId) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = {
            id: productId,
            quantity: 1
        };
        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    // Função para atualizar a UI do carrinho
    function updateCartUI() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartList = document.getElementById('cart');
        cartList.innerHTML = '';
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                Produto ${item.id} - Quantidade: ${item.quantity}
                <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item.id}">Remover</button>
            `;
            cartList.appendChild(listItem);
        });

        // Adicionar eventos aos botões de remover do carrinho
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeFromCart(productId);
            });
        });
    }

    // Função para remover do carrinho
    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    // Função de checkout
    document.getElementById('checkout').addEventListener('click', function() {
        alert('Compra finalizada com sucesso!');
        localStorage.removeItem('cart');
        updateCartUI();
    });

    // Função para aplicar filtros
    function applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const priceFilter = document.getElementById('priceFilter').value;
        const priceValue = document.getElementById('priceValue');
        priceValue.textContent = priceFilter;

        fetch(API_URL)
            .then(response => response.json())
            .then(products => {
                const filteredProducts = products.filter(product => {
                    return (categoryFilter === '' || product.category === categoryFilter) &&
                           product.price <= priceFilter;
                });
                displayProducts(filteredProducts);
            });
    }

    // Função para popular os filtros de categoria
    function populateCategoryFilters(products) {
        const categories = [...new Set(products.map(product => product.category))];
        const categoryFilter = document.getElementById('categoryFilter');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        categoryFilter.addEventListener('change', applyFilters);
    }

    // Adicionar eventos de filtro
    document.getElementById('priceFilter').addEventListener('input', applyFilters);

    // Inicializar o carrinho e produtos
    loadProducts();
    updateCartUI();
});
