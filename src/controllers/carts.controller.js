import CartsService from "../services/carts.service.js";
import ProductsService from "../services/products.service.js";

const cartService = new CartsService;
const productService = new ProductsService();

export const getCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const cart = await cartService.getCart(cartId);
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(400).json({error: "Error buscando el carrito. "+error.message});
    }
    
}

export const createCart = async (req, res) => {
    try {

        const cartCreated = await cartService.createCart();
        res.status(200).json(cartCreated);

    } catch (error) {
        console.error(error);
        res.status(400).json({error: "Error creando el carrito. "+error.message});
    }
    
}

export const updateProductQuantityToCart = async (req, res, next) => {
    try {

        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;

        const productToAdd = await productService.getProductById(productId)

        if (!productToAdd) {
            return res.status(401).json({ status: "error", message: "El producto no existe" });
        }
        if (productToAdd.owner === req.user.email) {
            throw new Error('No puedes agregar tu propio producto');
        }

        const cart = await cartService.updateQuantity(cartId, productId, quantity);

        res.status(200).json(cart);

    } catch (error) {
        next(error)
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
        res.status(400).json({error: "Error eliminando el producto. "+error.message});
    }
}

export const emptyCart = async (req, res) => {
    try {

        const cartId = req.params.cid;

        const cartEmpty = await cartService.emptyCart(cartId);
        res.status(200).json(cartEmpty);

    } catch (error) {
        
        console.error(error);
        res.status(400).json({error: "Error vaciando el carrito. "+error.message});
    }
    
}

export const purchaseCart = async (req, res) => {
    try{

        req.logger.info(`User: ${req.user} quieres finalizar la compra?`);
        const cartId = req.params.cid;

        const cart = await cartService.purchaseCart(cartId, req.user);
        res.status(200).json(cart);

    } catch (error) {
        res.status(400).json({error: "Se produjo un error al finalizar la compra "+error.message})
    }        
}