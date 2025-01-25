import { Router } from 'express';
import { CartManager } from '../managers/CartManager.js';
import path from 'path';

const router = Router();
const cartManager = new CartManager(path.join(process.cwd(), 'src/data/carts.json'));

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(Number(req.params.cid));
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await cartManager.addProductToCart(
            Number(req.params.cid),
            Number(req.params.pid)
        );

        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

export default router;