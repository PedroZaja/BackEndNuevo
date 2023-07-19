import { Router } from "express";
import { getCart, createCart, updateProductQuantityToCart, deleteProductFromCart, emptyCart, purchaseCart } from '../controllers/carts.controller.js'

const router = Router();

const simulateUserMiddleware = (req, res, next) => {
    
    req.user = {
        first_name: 'Pedro',
        last_name: 'Zaja',
        email: 'pedrodavid21@gmail.com',
        age: 25,
        role: 'premium',
        cart: "648813092e1f7c47f5418791"
    };

    next();
};

router.get('/:cid', getCart);
router.post('/', createCart);
router.put('/:cid/products/:pid',simulateUserMiddleware, updateProductQuantityToCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.delete('/:cid', emptyCart);
router.get('/:cid/purchase', simulateUserMiddleware, purchaseCart);


export default router;