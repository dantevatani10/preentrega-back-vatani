import fs from 'fs/promises';

export class CartManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: this.#generateId(carts),
            products: []
        };

        carts.push(newCart);
        await this.#saveCarts(carts);
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) return null;

        const productIndex = carts[cartIndex].products.findIndex(
            item => item.product === productId
        );

        if (productIndex === -1) {
            carts[cartIndex].products.push({
                product: productId,
                quantity: 1
            });
        } else {
            carts[cartIndex].products[productIndex].quantity++;
        }

        await this.#saveCarts(carts);
        return carts[cartIndex];
    }

    #generateId(carts) {
        const maxId = carts.reduce((max, cart) => cart.id > max ? cart.id : max, 0);
        return maxId + 1;
    }

    async #saveCarts(carts) {
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }
} 