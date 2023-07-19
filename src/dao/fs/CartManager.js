import fs from "fs";
import path, { resolve } from "path";
import __dirname from '../../util.js';
import ProductManager from "./ProductManager.js";

class CartManager {
    constructor(filePath) {
        this.filePath = path.join(__dirname, 'files', 'carts.json');
        this.carts = [];
        this.nextId = 0;
    }

    async addCart() {
        try {

            const newCart = {
                id: 0,
                products: []
            }

            this.carts = await this.readCarts();

            this.nextId++;
            while (this.carts.some(p => p.id === this.nextId)) {
                this.nextId++;
            }
            newCart.id = this.nextId;

            this.carts.push(newCart);

            console.log("Creating Cart:");
            console.log(newCart);

            await this.saveCarts();
            return {
                success: true
            };

        } catch (error) {
            console.error(error.message);
            throw Error(`Error creating new Cart: ${JSON.stringify(newCart)}, error detail: ${error}`);
        }
    }

    async addProductToCart(cartId, newProduct) {
        try {

            const { product, quantity } = newProduct;

            const productManager = new ProductManager();

            const checkProduct = await productManager.getProductById(product);
            if (!checkProduct.success) {
                return {
                    success: false,
                    message: `Product with id ${product} not found.`,
                  };
            }

            this.carts = await this.readCarts();
            const cart = this.carts.find(c => c.id === cartId);

            if (!cart) {
                return {
                    success: false,
                    message: "Cart with the provided id doesn't exist"
                };
            } else {
                
                const existingProduct = cart.products.find(p => p.product === product);

                if (existingProduct) {
                   
                    existingProduct.quantity++;

                    await this.saveCarts();

                    return {
                        success: true,
                        message: `${quantity} product with id ${product} added to cart ${cartId}`
                    };

                } else {
                    
                    cart.products.push({ product, quantity: 1 });
                    await this.saveCarts();
                    return {
                        success: true,
                        message: `${quantity} product with id ${product} added to cart ${cartId}`
                    };
                }
            }
        } catch (error) {
            console.error(error.message);
            throw Error(`Error while trying to add the product id ${newProduct.product}, error: ${error}`);
        }

    }

    async getCarts() {
        this.carts = await this.readCarts();
        return this.carts;
    }

    // Read the carts JSON
    async readCarts() {
        try {
            const directory = path.dirname(this.filePath);
            await fs.promises.mkdir(directory, { recursive: true });

            const data = await fs.promises.readFile(this.filePath, 'utf8');
            return JSON.parse(data);

        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.promises.writeFile(this.filePath, JSON.stringify([]));
                return [];
            }
            throw Error(`Error reading the carts, error detail: ${error}`);
        }
    }

    async saveCarts() {
        try {

            await fs.promises.writeFile(this.filePath, JSON.stringify(this.carts), 'utf8');

        } catch (error) {
            console.error(error.message);
            throw Error(`Error saving the file, error detail: ${error}`);
        }
    }

}

export default CartManager;