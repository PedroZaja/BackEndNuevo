import { cartsModel } from "../../models/carts.model.js";
import ProductManager from "./products.dao.js";


export default class CartManager {
    constructor() {
        this.carts = cartsModel;
    }

    //Adds a new empty cart array and saves it to the JSON file.
    async addCart() {
        try {

            const result = await this.carts.create({});

            console.log("Creating Cart:");
            console.log(result);

            return {
                success: true,
                data: result
            };

        } catch (error) {
            console.error(error.message);
            throw Error(`Error creating new Cart: ${JSON.stringify(newCart)}, error detail: ${error}`);
        }
    }

    async addProductToCart(cartId, productId) {
        try {

            const productManager = new ProductManager();
            // Check if the product exist
            const checkProduct = await productManager.getProductById(productId);

            if (!checkProduct.success) {
                return {
                    success: false,
                    message: `Product with id ${productId} not found.`,
                };
            }

            const cart = await this.carts.findById(cartId);

            if (!cart) {
                return {
                    success: false,
                    message: "Cart with the provided id doesn't exist"
                };

            } else {
                // Check if product already exists in cart

                let existingProduct = cart.products.find(p => p.productId.equals(productId));

                if (existingProduct) {
                    // Add 1
                    existingProduct.quantity++;
                    const result = await cart.save();

                    console.log("Adding 1 more product "+productId+" to Cart: "+cartId);
                
                    return {
                        success: true,
                        data: result,
                        message: `1 more product with id ${productId} added to cart ${cartId}`
                    };

                } else {
                    const newProduct = { productId: productId, quantity: 1 };
                    cart.products.push(newProduct);
                    const result = await cart.save();
                
                    console.log("Adding 1 product "+productId+" to Cart: "+cartId);
                
                    return {
                        success: true,
                        data: result,
                        message: `1 product with id ${productId} added to cart ${cartId}`
                    };
                }
            }

        } catch (error) {
            console.error(error.message);
            throw Error(`Error while trying to add the product id ${productId.product}, error: ${error}`);
        }
    }

    async updateCart(cartId, products) {
        try {
            console.log("PRODUCTS "+JSON.stringify(products));
            console.log("TYPE PRODUCTS "+typeof(products));

            const cart = await this.carts.findById(cartId);
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
        } catch (error) {
            console.error(error.message);
            throw Error(`Error while trying to update the cart with id ${cartId}, error: ${error}`);
        }
    }

    async deleteCart(cartId) {
        try {
            const cart = await this.carts.findById(cartId);
            if (!cart) {
                return {
                    success: false,
                    message: "Cart with the provided id doesn't exist"
                };
            } else {
                await cart.delete();
                return {
                    success: true,
                    message: `Cart with id ${cartId} deleted successfully`
                };
            }
        } catch (error) {
            console.error(error.message);
            throw Error(`Error while trying to delete the cart with id ${cartId}, error: ${error}`);
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await this.carts.findById(cartId);
            if (!cart) {
                return {
                    success: false,
                    message: "Cart with the provided id doesn't exist"
                };
            } else {
                const index = cart.products.findIndex(p => p.productId.equals(productId));
                if (index === -1) {
                    return {
                        success: false,
                        message: `Product with id ${productId} not found in cart ${cartId}`
                    };
                }
                cart.products.splice(index, 1);
                const result = await cart.save();
                return {
                    success: true,
                    data: result,
                    message: `Product with id ${productId} removed from cart ${cartId}`
                };
            }
        } catch (error) {
            console.error(error.message);
            throw Error(`Error while trying to remove the product id ${productId} from cart ${cartId}, error: ${error}`);
        }
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        try {
            const cart = await this.carts.findById(cartId);
            if (!cart) {
                return {
                    success: false,
                    message: "Cart with the provided id doesn't exist"
                };
            } else {
                const existingProduct = cart.products.find(p => p.productId.equals(productId));
                if (!existingProduct) {
                    return {
                        success: false,
                        message: `Product with id ${productId} not found in cart ${cartId}`
                    };
                }
                existingProduct.quantity = quantity;
                const result = await cart.save();
                return {
                    success: true,
                    data: result,
                    message: `Quantity of product with id ${productId} updated to ${quantity} in cart ${cartId}`
                };
            }
        } catch (error) {
            console.error(error.message);
            throw Error(`Error while trying to update the quantity of the product id ${productId} in cart ${cartId}, error: ${error}`);
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await this.carts.findById(cartId);

            if (!cart) {
                return {
                    success: false,
                    message: "Cart with the provided id doesn't exist",
                };
            }

            cart.products = [];
            const result = await cart.save();

            return {
                success: true,
                data: result,
                message: "Cart has been emptied",
            };
            
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "Error while emptying the cart",
            };
        }
    }

    async getCart(cartId) {
        try {
            const cart = await this.carts.findById(cartId);
            if (!cart) {
                return {
                    success: false,
                    message: "Cart with the provided id doesn't exist"
                };
            } else {
                return {
                    success: true,
                    message: `Cart with id ${cartId} found`,
                    data: cart
                };
            }
        } catch (error) {
            console.error(error.message);
            throw Error(`Error while trying to get the cart with id ${cartId}, error: ${error}`);
        }
    }
}
