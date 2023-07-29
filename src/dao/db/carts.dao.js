import { cartsModel } from "./models/carts.model.js";


export default class CartDao {
    
    async getCart(cartId) {

        const cart = await cartsModel.findOne({_id: cartId}).populate("products.productId").lean();
        return cart;
    }

    async createCart() {
        const newCart = await cartsModel.create({});
        return newCart;
    }
    
    async findProduct(cartId, productId) {
        const cart = await cartsModel.findOne({_id: cartId}).populate("products.productId").lean();
        return cart;
    }

    async addProduct(cartId, productId, quantity) {

        const updatedCart = await cartsModel.findByIdAndUpdate(cartId, {$addToSet: {products: {productId: productId, quantity: quantity}}}, {new: true});
        return updatedCart;
    }

    async updateQuantity(cartId, productId, quantity) {

        const updateCartQ = await cartsModel.findOneAndUpdate({_id: cartId, "products.productId": productId}, {$inc: {"products.$.quantity": quantity}}, {new: true});
        return updateCartQ;
    }

    async deleteProduct(cartId, productId) {

        const deletedProduct = await cartsModel.findOneAndUpdate({_id: cartId}, {$pull: {products: {productId: productId}}})
        return deletedProduct;
    }

    async emptyCart(cartId) {
        const cart = await cartsModel.findOneAndReplace({_id: cartId}, {products: []});
        return cart;
    }

    async getPaginatedCart(cartId) {
        const cart = await cartsModel.findById({_id: cartId}, { lean: true });
        return cart;
    }

}