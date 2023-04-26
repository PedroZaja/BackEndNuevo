import { Router} from "express";
//import of the service for Carts. (You can change to file system by swapping the commented line)
// import CartManager from "../dao/services/fs/CartManager.js";
import CartManager from "../dao/services/db/carts.service.js";


const router = Router();

// Product manager initalizing
const cartManager = new CartManager();

router.post('/', async (request, response) => {
    
    try {

        let cartCreated = await cartManager.addCart();

        if (cartCreated.success) {            
            response.status(201).send({message: "Cart created successfully!"});
        } else {
            response.status(400).send({message: "Error: Something went wrong creating the cart."});
        }
        
    } catch (error) {
        response.status(500).send({error: "Error creating the cart.", message: error});
    }
});

router.post('/:cid/product/:pid', async (request, response) => {
    
    try {
        const cartId = request.params.cid;
        const productId = request.params.pid;

        let cartUpdate = await cartManager.addProductToCart(cartId, productId);

        if (cartUpdate.success) {            
            response.status(201).send(cartUpdate.message);
        } else {
            response.status(400).send(cartUpdate.message);
        }
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({error: "Error adding the product to the cart"});
    }
});

router.get('/:cid', async (request, response) => {

    try {
        const cartId = request.params.cid;
        let result = await cartManager.getCart(cartId);

        if (result.success) {            
            response.status(200).send(result);
        } else {
            response.status(404).send(result);
        }
        
    } catch (error) {
        response.status(500).send({error: "Error error searching the cart.", message: error});
    }
});

router.delete('/:cid/products/:pid', async (request, response) => {

    try {
        const cartId = request.params.cid;
        const productId = request.params.pid;

        let cartUpdate = await cartManager.deleteProductFromCart(cartId, productId);

        if (cartUpdate.success) {            
            response.status(201).send(cartUpdate.message);
        } else {
            response.status(400).send(cartUpdate.message);
        }
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({error: "Error deleting the product in the cart"});
    }

});

router.put('/:cid', async (request, response) => {

    try {
        const cartId = request.params.cid;
        let newProducts = request.body.products;

        let cartUpdate = await cartManager.updateCart(cartId, newProducts);

        if (cartUpdate.success) {            
            response.status(201).send(cartUpdate.message);
        } else {
            response.status(400).send(cartUpdate.message);
        }
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({error: "Error updating products in the cart"});
    }

});

router.put('/:cid/products/:pid', async (request, response) => {

    try {
        const cartId = request.params.cid;
        const productId = request.params.pid;
        const quantity = request.body.quantity;

        let cartUpdate = await cartManager.updateProductQuantityInCart(cartId, productId, quantity);

        if (cartUpdate.success) {            
            response.status(201).send(cartUpdate.message);
        } else {
            response.status(400).send(cartUpdate.message);
        }
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({error: "Error updating quantity in the cart"});
    }

});

router.delete('/:cid', async (request, response) => {

    try {
        const cartId = request.params.cid;

        let cartUpdate = await cartManager.emptyCart(cartId);

        if (cartUpdate.success) {            
            response.status(201).send(cartUpdate.message);
        } else {
            response.status(400).send(cartUpdate.message);
        }
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({error: "Error emptying the cart"});
    }

});


export default router;