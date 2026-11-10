import { categories, demoOrders, products } from './mock-data.js';
import { shawarmaApi } from './api-service.js';

const DELIVERY_FEE = 6.9;
const THEME_KEY = 'shawarmahero-theme';

const state = {
  route: 'inicio',
  products,
  cart: [],
  category: 'todos',
  search: '',
  sortByPopular: true,
  user: null
};

const elements = {
  pages: [...document.querySelectorAll('[data-page]')],
  navLinks: [...document.querySelectorAll('[data-route]')],
  productGrid: document.querySelector('#product-grid'),
  productCount: document.querySelector('#product-result-count'),
  categoryList: document.querySelector('.category-list'),
  productSearch: document.querySelector('#product-search'),
  cartItems: document.querySelector('#cart-items'),
  cartCount: document.querySelector('.cart-count'),
  cartSubtotal: document.querySelector('#cart-subtotal'),
  cartDelivery: document.querySelector('#cart-delivery'),
  cartTotal: document.querySelector('#cart-total'),
  ordersList: document.querySelector('#orders-list'),
  toast: document.querySelector('#toast'),
  menuToggle: document.querySelector('.menu-toggle'),
  mainNav: document.querySelector('.main-nav'),
  themeToggle: document.querySelector('.theme-toggle'),
  themeIcon: document.querySelector('.theme-icon')
};

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getRouteFromUrl() {
  const hashRoute = window.location.hash.replace('#', '').trim();
  if (hashRoute) return hashRoute;

  const pathRoute = window.location.pathname.replace(/^\//, '').split('/')[0];
  return pathRoute || 'inicio';
}

function navigate(route) {
  const validRoutes = elements.pages.map((page) => page.dataset.page);
  state.route = validRoutes.includes(route) ? route : 'inicio';

  elements.pages.forEach((page) => {
    page.hidden = page.dataset.page !== state.route;
  });

  elements.navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.route === state.route);
  });

  if (state.route === 'cardapio') renderProducts();
  if (state.route === 'carrinho') renderCart();
  if (state.route === 'pedidos') renderOrders();
  if (state.route === 'perfil') loadUserIntoProfile();

  elements.mainNav.classList.remove('open');
  elements.menuToggle.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  const isDark = theme === 'dark';
  elements.themeIcon.innerHTML = isDark
    ? '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3.4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
    : '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.6 8.6 0 1 0 20.5 15.2Z"/></svg>';
  elements.themeToggle.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
  elements.themeToggle.title = isDark ? 'Ativar modo claro' : 'Ativar modo escuro';
}

function createCategoryButtons() {
  elements.categoryList.innerHTML = categories.map((category) => `
    <button class="category-button ${category.id === state.category ? 'active' : ''}" type="button" data-category="${category.id}">
      ${category.label}
    </button>
  `).join('');
}

function getVisibleProducts() {
  const normalizedSearch = state.search.trim().toLocaleLowerCase('pt-BR');
  const filtered = state.products.filter((product) => {
    const matchesCategory = state.category === 'todos' || product.category === state.category;
    const searchableText = `${product.name} ${product.description} ${product.badge}`.toLocaleLowerCase('pt-BR');
    return matchesCategory && searchableText.includes(normalizedSearch);
  });

  if (state.sortByPopular) {
    return [...filtered].sort((first, second) => second.id - first.id);
  }
  return [...filtered].sort((first, second) => first.price - second.price);
}

function productCardTemplate(product) {
  return `
    <article class="product-card">
      <div class="product-visual ${product.accent} ${product.image ? 'has-photo' : ''}">
        <span class="product-badge">${product.badge}</span>
        ${product.image
          ? `<img class="product-photo" src="${product.image}" alt="Foto de ${product.name}" style="object-position: ${product.imagePosition || 'center'}" />`
          : `<span class="product-initials" aria-hidden="true">${product.initials}</span>`}
      </div>
      <div class="product-content">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-buy">
          <span class="product-price">${formatCurrency(product.price)} <small>/ un.</small></span>
          <button class="add-product" type="button" data-add-product="${product.id}">+ Adicionar</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  elements.productCount.textContent = visibleProducts.length;

  if (!visibleProducts.length) {
    elements.productGrid.innerHTML = `
      <div class="empty-state">
        <h3>Nenhum sabor encontrado.</h3>
        <p>Tente outra palavra ou volte para a lista completa de missões.</p>
        <button class="button button-outline" type="button" data-clear-search>Limpar busca</button>
      </div>
    `;
    return;
  }

  elements.productGrid.innerHTML = visibleProducts.map(productCardTemplate).join('');
}

function getCartDetailedItems() {
  return state.cart.map((cartItem) => {
    const product = state.products.find((item) => item.id === cartItem.productId);
    return product ? { ...product, quantity: cartItem.quantity } : null;
  }).filter(Boolean);
}

function getCartSubtotal() {
  return getCartDetailedItems().reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderCart() {
  const items = getCartDetailedItems();
  const itemCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = getCartSubtotal();

  elements.cartCount.textContent = itemCount;
  elements.cartSubtotal.textContent = formatCurrency(subtotal);
  elements.cartDelivery.textContent = items.length ? formatCurrency(DELIVERY_FEE) : formatCurrency(0);
  elements.cartTotal.textContent = formatCurrency(items.length ? subtotal + DELIVERY_FEE : 0);

  if (!items.length) {
    elements.cartItems.innerHTML = `
      <div class="empty-state">
        <h3>Seu carrinho está esperando uma missão.</h3>
        <p>Escolha um shawarma e deixe o resto com a nossa equipe.</p>
        <a class="button button-primary" href="#cardapio">Explorar cardápio <span aria-hidden="true">↗</span></a>
      </div>
    `;
    return;
  }

  elements.cartItems.innerHTML = items.map((item) => `
    <article class="cart-item">
      <div class="cart-item-visual" aria-hidden="true"><span>${item.initials}</span></div>
      <div class="cart-item-copy">
        <h3>${item.name}</h3>
        <p>${item.badge} · ${formatCurrency(item.price)} cada</p>
        <div class="quantity-control" aria-label="Quantidade de ${item.name}">
          <button type="button" data-decrease="${item.id}" aria-label="Diminuir quantidade">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-increase="${item.id}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <strong class="cart-item-price">${formatCurrency(item.price * item.quantity)}</strong>
      <button class="remove-item" type="button" data-remove="${item.id}" aria-label="Remover ${item.name}">×</button>
    </article>
  `).join('');
}

async function saveCart() {
  await shawarmaApi.saveCart(state.cart);
  renderCart();
}

async function addToCart(productId) {
  const existing = state.cart.find((item) => item.productId === productId);
  if (existing) existing.quantity += 1;
  else state.cart.push({ productId, quantity: 1 });

  const product = state.products.find((item) => item.id === productId);
  await saveCart();
  showToast(`${product.name} entrou no carrinho.`);
}

async function changeQuantity(productId, change) {
  const item = state.cart.find((cartItem) => cartItem.productId === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) state.cart = state.cart.filter((cartItem) => cartItem.productId !== productId);
  await saveCart();
}

async function removeFromCart(productId) {
  const item = getCartDetailedItems().find((cartItem) => cartItem.id === productId);
  state.cart = state.cart.filter((cartItem) => cartItem.productId !== productId);
  await saveCart();
  if (item) showToast(`${item.name} foi removido do carrinho.`);
}

function orderTemplate(order) {
  const isDelivered = order.status === 'Entregue';
  const steps = ['Recebido', 'Na chapa', 'A caminho', 'Entregue'];
  return `
    <article class="order-card">
      <div class="order-card-top">
        <div><h2>${order.id}</h2><p class="order-date">${order.date}</p></div>
        <span class="status-chip ${isDelivered ? 'delivered' : ''}">${order.status}</span>
      </div>
      <div class="order-card-bottom"><p class="order-items">${order.items}</p><div class="order-total"><span>Total do pedido</span><strong>${formatCurrency(order.total)}</strong></div></div>
      <div class="progress" aria-label="Etapas do pedido">
        ${steps.map((step, index) => `<div class="progress-step ${index < order.step ? 'done' : ''}">${step}</div>`).join('')}
      </div>
    </article>
  `;
}

async function renderOrders() {
  const savedOrders = await shawarmaApi.getOrders();
  const orders = savedOrders.length ? savedOrders : demoOrders;
  elements.ordersList.innerHTML = orders.map(orderTemplate).join('');
}

function setFieldError(form, fieldName, message) {
  const input = form.elements[fieldName];
  const error = form.querySelector(`[data-error-for="${fieldName}"]`);
  if (input) input.classList.toggle('invalid', Boolean(message));
  if (error) error.textContent = message || '';
}

function clearFormErrors(form) {
  form.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
  form.querySelectorAll('input').forEach((input) => input.classList.remove('invalid'));
}

function digits(value) {
  return value.replace(/\D/g, '');
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidCpf(value) {
  const cpf = digits(value);
  if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;

  let firstDigit = 0;
  let secondDigit = 0;
  for (let index = 0; index < 9; index += 1) {
    firstDigit += Number(cpf[index]) * (10 - index);
    secondDigit += Number(cpf[index]) * (11 - index);
  }

  const calculatedFirst = (firstDigit * 10) % 11 === 10 ? 0 : (firstDigit * 10) % 11;
  secondDigit += calculatedFirst * 2;
  const calculatedSecond = (secondDigit * 10) % 11 === 10 ? 0 : (secondDigit * 10) % 11;
  return calculatedFirst === Number(cpf[9]) && calculatedSecond === Number(cpf[10]);
}

function validateUserForm(form, includePassword = false) {
  const data = Object.fromEntries(new FormData(form).entries());
  const errors = {};
  const cpfDigits = digits(data.cpf || '');
  const phoneDigits = digits(data.phone || '');
  const cepDigits = digits(data.cep || '');

  if (!data.name || data.name.trim().length < 3) errors.name = 'Digite seu nome completo.';
  if (!validateEmail(data.email || '')) errors.email = 'Digite um e-mail válido.';
  if (phoneDigits.length < 10 || phoneDigits.length > 11) errors.phone = 'Informe um telefone válido.';
  if (!isValidCpf(cpfDigits)) errors.cpf = 'Digite um CPF válido com 11 números.';
  if (cepDigits.length !== 8) errors.cep = 'O CEP deve ter 8 números.';
  if (!data.address || data.address.trim().length < 4) errors.address = 'Informe seu endereço.';
  if (!data.number || !/^\d+$/.test(data.number)) errors.number = 'Use apenas números.';

  if (includePassword) {
    if (!data.password || data.password.length < 8) errors.password = 'Use pelo menos 8 caracteres.';
    if (data.confirmPassword !== data.password) errors.confirmPassword = 'As senhas precisam ser iguais.';
    if (!form.elements.consent.checked) errors.consent = 'Você precisa aceitar o uso acadêmico dos dados.';
  }

  Object.entries(errors).forEach(([fieldName, message]) => setFieldError(form, fieldName, message));
  if (errors.consent) form.elements.consent.focus();
  return { valid: Object.keys(errors).length === 0, data };
}

function validateLogin(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const errors = {};
  if (!validateEmail(data.email || '')) errors.email = 'Digite um e-mail válido.';
  if (!data.password || data.password.length < 8) errors.password = 'A senha precisa ter 8 caracteres.';
  Object.entries(errors).forEach(([fieldName, message]) => setFieldError(form, fieldName, message));
  return { valid: Object.keys(errors).length === 0, data };
}

async function handleSignup(event) {
  event.preventDefault();
  const form = event.currentTarget;
  clearFormErrors(form);
  const result = validateUserForm(form, true);
  if (!result.valid) return;

  const { data } = result;
  await shawarmaApi.saveUser({ ...data, cpf: data.cpf, phone: data.phone, cep: data.cep });
  showToast('Conta criada. Sua próxima missão já pode começar.');
  window.location.hash = 'cardapio';
}

async function handleProfileSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  clearFormErrors(form);
  const result = validateUserForm(form);
  if (!result.valid) return;
  await shawarmaApi.saveUser(result.data);
  state.user = result.data;
  document.querySelector('#profile-name-card').textContent = result.data.name;
  document.querySelector('#profile-email-card').textContent = result.data.email;
  document.querySelector('#profile-status').textContent = 'Dados salvos';
  showToast('Perfil atualizado com sucesso.');
}

function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  clearFormErrors(form);
  const result = validateLogin(form);
  if (!result.valid) return;
  showToast('Login demonstrativo realizado. Bem-vindo de volta!');
  window.location.hash = 'inicio';
}

async function loadUserIntoProfile() {
  state.user = state.user || await shawarmaApi.getUser();
  const form = document.querySelector('#profile-form');
  if (!form || form.dataset.loaded === 'true') return;
  Object.entries(state.user).forEach(([name, value]) => {
    if (form.elements[name]) form.elements[name].value = value || '';
  });
  document.querySelector('#profile-name-card').textContent = state.user.name;
  document.querySelector('#profile-email-card').textContent = state.user.email;
  form.dataset.loaded = 'true';
}

function onlyNumbers(event) {
  event.target.value = event.target.value.replace(/\D/g, '');
}

function applyCpfMask(event) {
  const value = digits(event.target.value).slice(0, 11);
  event.target.value = value
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function applyPhoneMask(event) {
  const value = digits(event.target.value).slice(0, 11);
  event.target.value = value
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

function applyCepMask(event) {
  const value = digits(event.target.value).slice(0, 8);
  event.target.value = value.replace(/(\d{5})(\d)/, '$1-$2');
}

function togglePassword(event) {
  const button = event.currentTarget;
  const input = button.parentElement.querySelector('input');
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  button.textContent = isPassword ? 'ocultar' : 'ver';
  button.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove('visible'), 3200);
}

async function finalizeOrder() {
  const items = getCartDetailedItems();
  if (!items.length) {
    showToast('Adicione pelo menos um item antes de finalizar.');
    return;
  }

  const order = {
    id: `SH-${Math.floor(1000 + Math.random() * 8999)}`,
    date: 'Agora',
    items: items.map((item) => `${item.quantity}× ${item.name}`).join(' · '),
    total: getCartSubtotal() + DELIVERY_FEE,
    status: 'Recebido',
    step: 1
  };
  await shawarmaApi.createOrder(order);
  state.cart = [];
  await shawarmaApi.saveCart(state.cart);
  showToast('Pedido enviado! A cozinha já recebeu sua missão.');
  window.location.hash = 'pedidos';
}

function attachEvents() {
  window.addEventListener('hashchange', () => navigate(getRouteFromUrl()));
  elements.themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme || 'light';
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  });
  elements.menuToggle.addEventListener('click', () => {
    const isOpen = elements.mainNav.classList.toggle('open');
    elements.menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  elements.productSearch.addEventListener('input', (event) => {
    state.search = event.target.value;
    renderProducts();
  });

  elements.categoryList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    createCategoryButtons();
    renderProducts();
  });

  document.addEventListener('click', async (event) => {
    const addButton = event.target.closest('[data-add-product]');
    if (addButton) await addToCart(Number(addButton.dataset.addProduct));

    const increaseButton = event.target.closest('[data-increase]');
    if (increaseButton) await changeQuantity(Number(increaseButton.dataset.increase), 1);

    const decreaseButton = event.target.closest('[data-decrease]');
    if (decreaseButton) await changeQuantity(Number(decreaseButton.dataset.decrease), -1);

    const removeButton = event.target.closest('[data-remove]');
    if (removeButton) await removeFromCart(Number(removeButton.dataset.remove));

    const clearButton = event.target.closest('[data-clear-search]');
    if (clearButton) {
      state.search = '';
      elements.productSearch.value = '';
      renderProducts();
    }

    if (event.target.closest('.checkout-button')) await finalizeOrder();
    if (event.target.closest('.sort-button')) {
      state.sortByPopular = !state.sortByPopular;
      event.target.closest('.sort-button').innerHTML = state.sortByPopular ? 'Mais pedidos <span aria-hidden="true">↕</span>' : 'Menor preço <span aria-hidden="true">↕</span>';
      renderProducts();
    }
  });

  document.querySelector('#signup-form').addEventListener('submit', handleSignup);
  document.querySelector('#login-form').addEventListener('submit', handleLogin);
  document.querySelector('#profile-form').addEventListener('submit', handleProfileSubmit);
  document.querySelectorAll('.numbers-only').forEach((input) => input.addEventListener('input', onlyNumbers));
  document.querySelectorAll('.cpf-mask').forEach((input) => input.addEventListener('input', applyCpfMask));
  document.querySelectorAll('.phone-mask').forEach((input) => input.addEventListener('input', applyPhoneMask));
  document.querySelectorAll('.cep-mask').forEach((input) => input.addEventListener('input', applyCepMask));
  document.querySelectorAll('.password-toggle').forEach((button) => button.addEventListener('click', togglePassword));
}

async function init() {
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');
  createCategoryButtons();
  state.products = await shawarmaApi.getProducts(products);
  state.cart = await shawarmaApi.getCart();
  renderCart();
  attachEvents();
  navigate(getRouteFromUrl());
}

init();
