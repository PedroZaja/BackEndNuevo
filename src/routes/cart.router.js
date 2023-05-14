import { Router} from "express";
import {addCart, addProductToCart, getCart, deleteProductFromCart, updateCart, updateProductQuantityInCart, emptyCart} from '../controllers/carts.controler.js';

const router = Router();


router.post('/', addCart);
router.post('/:cid/product/:pid', addProductToCart);
router.get('/:cid', getCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantityInCart);
router.delete('/:cid', emptyCart);
// router.post('/:cid/purchase', purchaseCart);

export default router;