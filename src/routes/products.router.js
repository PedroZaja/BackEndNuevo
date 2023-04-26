import { Router } from "express";
//import of the service for Products. (You can change to file system by swapping the commented line)
// import ProductManager from "../dao/services/fs/ProductManager.js";
import ProductManager from "../dao/services/db/products.service.js";

const router = Router();

// Product manager initalizing
const productManager = new ProductManager();

router.get('/', async (request, response) => {
    try {

        let products = await productManager.getProducts(request.query);
        response.status(200).send(products);

    } catch (error) {
        response.status(500).send({ error: "Error loading the products.", message: error });
    }
});


router.get('/:pid', async (request, response) => {
    try {
        const productId = request.params.pid;
        const product = await productManager.getProductById(productId);

            if (!product) {
                response.status(404).send({ message: "Product not found" });
                return;
            }
            
            response.send(`<html><body><h1>Producto: ${request.params.pid}</h1><ul><li>${JSON.stringify(product)}</li></ul></body></html>`);
        

    } catch (error) {
        response.status(500).send({ error: "Error searching the product", message: error });
    }
});

router.post('/', async (request, response) => {
    try {

        let newProduct = request.body;
        let productCreated = await productManager.addProduct(newProduct);

        if (productCreated.success) {

            response.status(201).send(productCreated.message);
        } else {
            response.status(400).send(productCreated.message);
        }

    } catch (error) {
        response.status(500).send({ error: "Error saving product.", message: error });
    }
});

router.put('/:pid', async (request, response) => {
    try {

        const productId = request.params.pid;
        const productFields = request.body;

        let productUpdated = await productManager.updateProduct(productId, productFields);

        if (productUpdated.success) {
            response.status(201).send(productUpdated.message);
        } else {
            response.status(400).send(productUpdated.message);
        }

    } catch (error) {
        response.status(500).send({ error: "Error updating product.", message: error });
    }
});

router.delete('/:pid', async (request, response) => {
    try {

        const productId = request.params.pid;

        let productDeleted = await productManager.deleteProduct(productId)

        if (productDeleted.success) {
            response.status(201).send(productDeleted.message);
        } else {
            response.status(400).send(productDeleted.message);
        }

    } catch (error) {
        response.status(500).send({ error: "Error deleting product.", message: error });
    }
});


export default router;
