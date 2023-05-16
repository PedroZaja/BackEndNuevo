import CartsService from "../services/carts.service.js";

const cartService = new CartsService;

export const getCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const cart = await cartService.getCart(cartId);
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(400).json({error: "Error searching the cart. "+error.message});
    }
    
}

export const createCart = async (req, res) => {
    try {

        const cartCreated = await cartService.createCart();
        res.status(200).json(cartCreated);

    } catch (error) {
        console.error(error);
        res.status(400).json({error: "Error creating the cart. "+error.message});
    }
    
}

export const updateProductQuantityToCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;

        const cart = await cartService.updateQuantity(cartId, productId, quantity);

        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(400).json({error: "Error updating product quantity in cart. "+error.message});
    }
    
}
export const deleteProductFromCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await cartService.deleteProductFromCart(cartId, productId);
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(400).json({error: "Error deleting the product in the cart. "+error.message});
    }
}

export const emptyCart = async (req, res) => {
    try {

        const cartId = req.params.cid;

        const cartEmpty = await cartService.emptyCart(cartId);
        res.status(200).json(cartEmpty);

    } catch (error) {
        
        console.error(error);
        res.status(400).json({error: "Error emptying the cart. "+error.message});
    }
    
}

export const purchaseCart = async (req, res) => {
    try{
        console.log("REQ.USER");
        console.log(req.user);
        const cartId = req.params.cid;

        const cart = await cartService.purchaseCart(cartId, req.user);
        res.status(200).json(cart);

    } catch (error) {
        res.status(400).json({error: "Can't complete purchase "+error.message})
    }        
}

/* export const updateCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const newProducts = req.body.products;

        const cartUpdate = await cartService.updateCart(cartId, newProducts);

        res.status(201).json(cartUpdate);

    } catch (error) {
        console.error(error);
        res.status(400).json({error: "Error updating products in the cart. "+error.message});
    }
    
} */