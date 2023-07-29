import { Router } from "express";
import { passportCall } from "../util.js";
import RoleMiddleware from "../middlewares/role/role.middleware.js";
import { get, getChat, getProducts, getCart, getPaginatedCart, getRealTimeProducts, createRealTimeProduct, updateRealTimeProduct, deleteRealTimeProduct, uploads } from "../controllers/views.controller.js";

const router = Router();

router.get('/', get);
router.get('/chat', passportCall('jwt'), RoleMiddleware.isUser, getChat);
router.get('/products', passportCall('jwt'), getProducts);
router.get('/cart', passportCall('jwt'), getCart);
router.get('/carts/:cid', getPaginatedCart);
router.get('/realtimeproducts', getRealTimeProducts);
router.post('/realtimeproducts', createRealTimeProduct);
router.put('/realtimeproducts/:pid', updateRealTimeProduct);
router.delete('/realtimeproducts/:pid', deleteRealTimeProduct);
router.get('/uploads', passportCall('jwt'), uploads);

export default router;