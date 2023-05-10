import ProductManager from "../dao/db/products.dao.js";

const productsService = new ProductManager();

export const getProducts = async (req, res) => {
    try {

        let limit = req.limit ? parseInt(req.limit) : 10;
        let page = req.page ? parseInt(req.page) : 1;
        let category = req.category ? req.category.toLowerCase() : null;
        let status = req.status ? (req.status.toLowerCase() === "true" ? true : req.status.toLowerCase() === "false" ? false : null) : null;
        let sort = req.sort ? (req.sort === "asc" ? 1 : req.sort === "desc" ? -1 : null) : null;
        
        const filters = {};
        const options = {};

        if (category || status) {
            category ? filters.category = category : {}
            status ? filters.status = status : {};
        }

        options.limit = limit;
        options.page = page;
        if (sort !== null) {
            options.sort = { price: sort };
        }

        const products = await productsService.getProducts(filters, options);
        
        res.status(200).send({message: "Success!", payload: products});

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error loading the products."});
    }
    
}

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productsService.getProductById(productId);

        if (!product) {
            res.status(404).send({ message: "Product not found" });
            return;
        }
        
        res.status(200).send(product);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Product could not be loaded"});
    }
    
}

export const addProduct = async (req, res) => {
    try {
        let newProduct = req.body;
        let productCreated = await productsService.addProduct(newProduct);

        res.status(201).send(productCreated);

    } catch (error) {
        console.error(error);   
        res.status(500).send({error: error, message: "Error saving product."});
    }
    
}

export const updateProduct = async (req, res) => {
    try {

        const productId = req.params.pid;
        const productFields = req.body;

        let productUpdated = await productsService.updateProduct(productId, productFields);

        res.send(productUpdated);
        
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error updating product."});
    }
    
}


export const deleteProduct = async (req, res) => {
    try {

        const productId = req.params.pid;

        let productDeleted = await productsService.deleteProduct(productId)

        res.status(201).send(productDeleted);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error deleting product."});
    }
    
}