import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js"
import { isAdmin } from "../middlewares/role/isAdmin.middleware.js";
import { passportCall } from "../util.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", passportCall('jwt'), isAdmin, createProduct)    
router.put("/:pid", passportCall('jwt'), isAdmin, updateProduct);
router.delete("/:pid", passportCall('jwt'), isAdmin, deleteProduct);

export default router;

