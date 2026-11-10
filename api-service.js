

const STORAGE_KEYS = {
  cart: 'shawarmahero-cart',
  orders: 'shawarmahero-orders',
  user: 'shawarmahero-user'
};

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.warn(`Não foi possível ler ${key}.`, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const shawarmaApi = {
  getProducts(products) {
    return Promise.resolve(products);
  },

  getCart() {
    return Promise.resolve(readStorage(STORAGE_KEYS.cart, []));
  },

  saveCart(cart) {
    writeStorage(STORAGE_KEYS.cart, cart);
    return Promise.resolve(cart);
  },

  
  createOrder(order) {
    const orders = readStorage(STORAGE_KEYS.orders, []);
    const updatedOrders = [order, ...orders];
    writeStorage(STORAGE_KEYS.orders, updatedOrders);
    return Promise.resolve(order);
  },


  getOrders() {
    return Promise.resolve(readStorage(STORAGE_KEYS.orders, []));
  },

  
  getUser() {
    return Promise.resolve(readStorage(STORAGE_KEYS.user, {
      name: 'Maria Oliveira',
      email: 'maria@email.com',
      cpf: '123.456.789-00',
      phone: '(11) 98888-7766',
      cep: '01310-100',
      address: 'Avenida Paulista',
      number: '1578',
      complement: 'Apto 42'
    }));
  },

  saveUser(user) {
    writeStorage(STORAGE_KEYS.user, user);
    return Promise.resolve(user);
  }
};
