import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js"
import { isAdminOrPremium } from "../middlewares/role/isAdminOrPremium.middleware.js";
import { passportCall } from "../util.js";

const router = Router();


router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", /* simulateUserMiddleware , */ passportCall('jwt'), isAdminOrPremium, createProduct)    
router.put("/:pid", passportCall('jwt'), isAdminOrPremium, updateProduct);
router.delete("/:pid", passportCall('jwt'), isAdminOrPremium, deleteProduct);

export default router;
