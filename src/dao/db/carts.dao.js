import { cartsModel } from "./models/carts.model.js";


export default class CartDao {
    
    async getCart(cartId) {

        const cart = await cartsModel.findOne({_id: cartId}).populate("products._id");
        return cart;
    }

    async createCart() {
        const newCart = await cartsModel.create({});
        return newCart;
    }
    
    async findProduct(cartId, productId) {
        const cart = await cartsModel.findOne({_id: cartId, "products.product": productId});
        return cart;
    }

    async addProduct(cartId, productId, quantity) {

        const updatedCart = await cartsModel.findByIdAndUpdate(cartId, {$addToSet: {products: {productId: productId, quantity: quantity}}}, {new: true});
        return updatedCart;
    }

    async updateQuantity(cartId, productId, quantity) {

        const updateCartQ = await cartsModel.findOneAndUpdate({_id: cartId, "products.product": productId}, {$inc: {"products.$.quantity": quantity}}, {new: true});
        return updateCartQ;
    }

    async deleteProduct(cartId, productId) {

        const deletedProduct = cartsModel.findOneAndUpdate({_id: cartId}, {$pull: {products: {product: productId}}})
        return deletedProduct;
    }

    async emptyCart(cartId) {
        const cart = await cartsModel.findOneAndReplace({_id: cartId}, {products: []});
        return cart;
    }

}

/* async addProductToCart(cartId, productId) {

    const productDao = new ProductDao();
    const checkProduct = await productDao.getProductById(productId);

    if (!checkProduct) return null;
    
    const cart = await cartsModel.findById(cartId);

    if (!cart) {
        return null;
    } else {
        let existingProduct = cart.products.find(p => p.productId.equals(productId));

        if (existingProduct) {
            existingProduct.quantity++;
            return await cart.save();
        } else {
            const newProduct = { productId: productId, quantity: 1 };
            cart.products.push(newProduct);
            const result = await cart.save();
        }
    }
}

    async updateCart(cartId, products) {

        const cart = await cartsModel.findById(cartId);
        if (!cart) {
            return {
                success: false,
                message: "Cart with the provided id doesn't exist"
            };
        } else {
            const updatedProducts = products.map(p => ({
                productId: p.productId,
                quantity: p.quantity || 1
            }));
            cart.products = updatedProducts;
            const result = await cart.save();
            return {
                success: true,
                data: result,
                message: `Cart with id ${cartId} updated successfully`
            };
        }
    }
*/
