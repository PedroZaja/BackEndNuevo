import ProductsService from "../services/products.service.js";

const productsService = new ProductsService();

export const getProducts = async (req, res) => {
    try {

        const products = await productsService.getProducts(req.query);
        res.status(200).json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error cargando los productos. " + error.message });
    }

}

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productsService.getProductById(productId);

        res.status(200).json(product);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error buscando los productos. " + error.message });
    }

}

export const createProduct = async (req, res, next) => {
    try {
        let newProduct = req.body;
        if (req.user.role === "premium") {
            newProduct.owner = req.user.email;
        }
        let productCreated = await productsService.createProduct(newProduct);

        res.status(201).json(productCreated);

    } catch (error) {
        next(error);
    }

}

export const updateProduct = async (req, res) => {
    try {

        const productId = req.params.pid;
        const newProduct = req.body;

        const existProduct = await productsService.getProductById(productId)

        if (!existProduct) {
            return res.status(401).json({ status: "error", message: "El producto no existe" });
        }

        if (req.user.role === "premium" && req.user.email !== existProduct.owner) {
            return res.status(403).json({ status: "error", message: "Se requiere rol Owner o Admin!" });
        }

        let productUpdated = await productsService.updateProduct(productId, newProduct);

        res.status(200).json(productUpdated);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error actualizando el producto. " + error.message });
    }

}


export const deleteProduct = async (req, res) => {
    try {

        const productId = req.params.pid;

        const existProduct = await productsService.getProductById(productId)

        if (!existProduct) {
            return res.status(401).json({ status: "error", message: "El producto no existe!" });
        }

        if (req.user.role === "premium" && req.user.email !== existProduct.owner) {
            return res.status(403).json({ status: "error", message: "Se requiere rol Owner o Admin!" });
        }

        let productDeleted = await productsService.deleteProduct(productId);
        res.status(200).json(productDeleted);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error eliminando el producto. " + error.message });
    }

}