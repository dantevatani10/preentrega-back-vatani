import { Router } from 'express';
import { ProductManager } from '../managers/ProductManager.js';
import path from 'path';

const router = Router();
const productManager = new ProductManager(path.join(process.cwd(), 'src/data/products.json'));

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(Number(req.params.pid));
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const newProduct = await productManager.addProduct({
            title, description, code, price, stock, category,
            thumbnails: thumbnails || []
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        const updatedProduct = await productManager.updateProduct(Number(req.params.pid), updateData);
        
        if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const result = await productManager.deleteProduct(Number(req.params.pid));
        if (!result) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router; 