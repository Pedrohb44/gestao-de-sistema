const tokenKey = 'gestao-token';
const authPanel = document.getElementById('auth-panel');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const logoutBtn = document.getElementById('logout-btn');
const cancelEditBtn = document.getElementById('cancel-edit');
const searchInput = document.getElementById('search-input');
const metricProducts = document.getElementById('metric-products');
const metricStock = document.getElementById('metric-stock');
const metricCategories = document.getElementById('metric-categories');
const metricValue = document.getElementById('metric-value');
const focusFormBtn = document.querySelector('[data-focus-form]');
const refreshBtn = document.querySelector('[data-refresh]');
let currentProducts = [];

function isAuthenticated() {
    return Boolean(localStorage.getItem(tokenKey));
}

function setAuthenticated(value) {
    authPanel.classList.toggle('hidden', value);
    dashboard.classList.toggle('hidden', !value);
    logoutBtn.classList.toggle('hidden', !value);
}

function saveToken(token) {
    localStorage.setItem(tokenKey, token);
}

function clearToken() {
    localStorage.removeItem(tokenKey);
}

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
    };
}

async function login(username, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Falha ao entrar');
    }
    saveToken(data.token);
    setAuthenticated(true);
    await loadProducts();
}

async function register(username, password) {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Falha ao cadastrar');
    }
    saveToken(data.token);
    setAuthenticated(true);
    await loadProducts();
}

async function loadProducts() {
    const response = await fetch('/api/products', { headers: getHeaders() });
    const products = await response.json();
    currentProducts = Array.isArray(products) ? products : [];
    renderProducts(currentProducts);
    updateMetrics(currentProducts);
}

function renderProducts(products) {
    productList.innerHTML = '';
    const term = searchInput.value.trim().toLowerCase();
    const filteredProducts = products.filter((product) => {
        const searchable = `${product.name} ${product.description || ''} ${product.category}`.toLowerCase();
        return searchable.includes(term);
    });

    if (filteredProducts.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td class="empty-row" colspan="6">Nenhum produto encontrado</td>';
        productList.appendChild(row);
        return;
    }

    filteredProducts.forEach((product) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.description || '-'}</td>
            <td>${product.quantity}</td>
            <td>R$ ${Number(product.price).toFixed(2)}</td>
            <td>${product.category}</td>
            <td>
                <button class="secondary" data-edit="${product.id}">Editar</button>
                <button data-delete="${product.id}">Excluir</button>
            </td>`;
        productList.appendChild(row);
    });
}

function updateMetrics(products) {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + Number(product.quantity || 0), 0);
    const categories = new Set(products.map((product) => product.category).filter(Boolean));
    const totalValue = products.reduce((sum, product) => {
        return sum + Number(product.price || 0) * Number(product.quantity || 0);
    }, 0);

    metricProducts.textContent = totalProducts;
    metricStock.textContent = totalStock;
    metricCategories.textContent = categories.size;
    metricValue.textContent = totalValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

async function saveProduct(event) {
    event.preventDefault();
    const id = document.getElementById('product-id').value;
    const payload = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        quantity: Number(document.getElementById('product-quantity').value),
        price: Number(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value
    };

    const url = id ? `/api/products/${id}` : '/api/products';
    const method = id ? 'PUT' : 'POST';
    const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        productForm.reset();
        document.getElementById('product-id').value = '';
        await loadProducts();
    }
}

async function deleteProduct(id) {
    await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    await loadProducts();
}

async function editProduct(id) {
    const response = await fetch(`/api/products`, { headers: getHeaders() });
    const products = await response.json();
    const product = products.find((item) => item.id === Number(id));
    if (!product) return;

    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-quantity').value = product.quantity;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    await login(username, password);
});

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    await register(username, password);
});

productForm.addEventListener('submit', saveProduct);

logoutBtn.addEventListener('click', () => {
    clearToken();
    setAuthenticated(false);
});

cancelEditBtn.addEventListener('click', () => {
    productForm.reset();
    document.getElementById('product-id').value = '';
});

searchInput.addEventListener('input', () => {
    renderProducts(currentProducts);
});

focusFormBtn.addEventListener('click', () => {
    document.getElementById('product-name').focus();
    document.getElementById('products-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

refreshBtn.addEventListener('click', loadProducts);

productList.addEventListener('click', async (event) => {
    const editButton = event.target.closest('[data-edit]');
    const deleteButton = event.target.closest('[data-delete]');
    if (editButton) {
        await editProduct(editButton.getAttribute('data-edit'));
    }
    if (deleteButton) {
        await deleteProduct(deleteButton.getAttribute('data-delete'));
    }
});

if (isAuthenticated()) {
    setAuthenticated(true);
    loadProducts();
} else {
    setAuthenticated(false);
}
