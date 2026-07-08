const tokenKey = 'gestao-token';
const authPanel = document.getElementById('auth-panel');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const logoutBtn = document.getElementById('logout-btn');
const cancelEditBtn = document.getElementById('cancel-edit');

function isAuthenticated() {
    return Boolean(localStorage.getItem(tokenKey));
}

function setAuthenticated(value) {
    authPanel.classList.toggle('hidden', value);
    dashboard.classList.toggle('hidden', !value);
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
    renderProducts(products);
}

function renderProducts(products) {
    productList.innerHTML = '';
    products.forEach((product) => {
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
