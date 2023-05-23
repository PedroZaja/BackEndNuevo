import ProductsService from "../services/products.service.js";

const productsService = new ProductsService();

export const getProducts = async (req, res) => {
    try {

        const products = await productsService.getProducts(req.query);        
        res.status(200).json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error loading the products. "+error.message});
    }
    
}

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productsService.getProductById(productId);

        res.status(200).json(product);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error searching the product. "+error.message });
    }
    
}

export const createProduct = async (req, res, next) => {
    try {
        let newProduct = req.body;
        let productCreated = await productsService.createProduct(newProduct);

        res.status(200).json(productCreated);

    } catch (error) {
        next(error);
    }
    
}

export const updateProduct = async (req, res) => {
    try {

        const productId = req.params.pid;
        const productFields = req.body;

        let productUpdated = await productsService.updateProduct(productId, productFields);

        res.status(200).json(productUpdated);
        
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error updating product. "+error.message });
    }
    
}


export const deleteProduct = async (req, res) => {
    try {

        const productId = req.params.pid;

        let productDeleted = await productsService.deleteProduct(productId);
        res.status(200).json(productDeleted);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error deleting product. "+error.message });
    }
    
}