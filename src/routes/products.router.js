import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js"
import RoleMiddleware from "../middlewares/role/role.middleware.js";
import { passportCall } from "../util.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", passportCall('jwt'), RoleMiddleware.isAdminOrPremium, createProduct)    
router.put("/:pid", passportCall('jwt'), RoleMiddleware.isAdminOrPremium, updateProduct);
router.delete("/:pid", passportCall('jwt'), RoleMiddleware.isAdminOrPremium, deleteProduct);

export default router;