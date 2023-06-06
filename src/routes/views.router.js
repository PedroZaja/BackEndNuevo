import { Router } from "express";
import { passportCall } from "../util.js";
import { isUser } from "../middlewares/role/isUser.middleware.js"
import { get, getChat, getProducts, getPaginatedCart, getRealTimeProducts, createRealTimeProduct, updateRealTimeProduct, deleteRealTimeProduct } from "../controllers/views.controller.js";

const router = Router();

router.get('/', get);
router.get('/chat', passportCall('jwt'), isUser, getChat);
router.get('/products', passportCall('jwt'), getProducts);
router.get('/carts/:cid', getPaginatedCart);
router.get('/realtimeproducts', getRealTimeProducts);
router.post('/realtimeproducts', createRealTimeProduct);
router.put('/realtimeproducts/:pid', updateRealTimeProduct);
router.delete('/realtimeproducts/:pid', deleteRealTimeProduct);

export default router;