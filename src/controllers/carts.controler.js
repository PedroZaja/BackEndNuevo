import CartManager from "../dao/db/carts.dao.js";

const cartManager = new CartManager();

export const addCart = async (req, res) => {
    try {

        const cartCreated = await cartManager.addCart();
        res.status(201).send(cartCreated);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error creating the cart."});
    }
    
}

export const addProductToCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cartUpdate = await cartManager.addProductToCart(cartId, productId);

        res.status(201).send(cartUpdate);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error adding the product to the cart"});
    }
    
}
export const getCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const result = await cartManager.getCart(cartId);

        res.status(201).send(result);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error error searching the cart."});
    }
    
}
export const deleteProductFromCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cartUpdate = await cartManager.deleteProductFromCart(cartId, productId);

        res.status(201).send(cartUpdate);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error deleting the product in the cart"});
    }
    
}
export const updateCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const newProducts = req.body.products;

        const cartUpdate = await cartManager.updateCart(cartId, newProducts);

        res.status(201).send(cartUpdate);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error updating products in the cart"});
    }
    
}
export const updateProductQuantityInCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;

        const cartUpdate = await cartManager.updateProductQuantityInCart(cartId, productId, quantity);

        res.status(201).send(cartUpdate);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error updating quantity in the cart"});
    }
    
}
export const emptyCart = async (req, res) => {
    try {

        const cartId = req.params.cid;

        const cartUpdate = await cartManager.emptyCart(cartId);

        res.status(201).send(cartUpdate);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error emptying the cart"});
    }
    
}