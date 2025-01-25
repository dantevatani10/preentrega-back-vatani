import fs from 'fs/promises';
import path from 'path';

export class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async addProduct(productData) {
        const products = await this.getProducts();
        const newProduct = {
            ...productData,
            id: this.#generateId(products),
            status: true
        };

        products.push(newProduct);
        await this.#saveProducts(products);
        return newProduct;
    }

    async updateProduct(id, updateData) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);

        if (index === -1) return null;

        const updatedProduct = {
            ...products[index],
            ...updateData,
            id: products[index].id // Aseguramos que el ID no se modifique
        };

        products[index] = updatedProduct;
        await this.#saveProducts(products);
        return updatedProduct;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(product => product.id !== id);

        if (filteredProducts.length === products.length) return false;

        await this.#saveProducts(filteredProducts);
        return true;
    }

    #generateId(products) {
        const maxId = products.reduce((max, product) => product.id > max ? product.id : max, 0);
        return maxId + 1;
    }

    async #saveProducts(products) {
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }
}