import { cartsModel } from "./models/carts.model.js";
import ProductManager from "./products.dao.js";


export default class CartManager {

    async addCart() {
        return await cartsModel.create({});
    }

    async addProductToCart(cartId, productId) {

        const productManager = new ProductManager();
        const checkProduct = await productManager.getProductById(productId);

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

    async deleteCart(cartId) {
        const cart = await cartsModel.findById(cartId);

        if (!cart) {
            return null
        } else {
            return await cart.delete();
        }
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await cartsModel.findById(cartId);

        if (!cart) {
            return null;
        } else {
            const index = cart.products.findIndex(p => p.productId.equals(productId));
            if (index === -1) {
                return null
            }
            cart.products.splice(index, 1);
            return await cart.save();
        }
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        const cart = await cartsModel.findById(cartId);
        if (!cart) {
            return null;
        } else {
            const existingProduct = cart.products.find(p => p.productId.equals(productId));
            if (!existingProduct) {
                return null;
            }
            existingProduct.quantity = quantity;
            return await cart.save();
        }
    }

    async emptyCart(cartId) {
        const cart = await cartsModel.findById(cartId);

        if (!cart) {
            return null;
        }

        cart.products = [];
        return await cart.save();
    }

    async getCart(cartId) {
        const cart = await cartsModel.findById(cartId);
        if (!cart) {
            return null;
        } else {
            return cart;
        }
    }
}
