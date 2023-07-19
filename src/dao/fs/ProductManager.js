import fs from "fs";
import path from "path";
import __dirname from '../../util.js'

class ProductManager {
    constructor(filePath) {
        this.filePath = path.join(__dirname, 'files', 'products.json');
        this.products = [];
        this.nextId = 0;
    }

    async createProduct(newProduct) {
        try {

            if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail || !newProduct.code || !newProduct.stock || !newProduct.status || !newProduct.category) {
                console.error("Hey! All fields are required");
                return {
                    success: false,
                    message: "Hey! All fields are required"
                };
            }

            this.products = await this.readProducts();
            if (this.products.some(p => p.code === newProduct.code)) {
                console.error("Code id already exists");
                return {
                    success: false,
                    message: "Code id already exists"
                };
            }

            this.nextId++;
            while (this.products.some(p => p.id === this.nextId)) {
                this.nextId++;
            }
            newProduct.id = this.nextId;

            this.products.push(newProduct);

            console.log("Creating Product:");
            console.log(newProduct);

            await this.saveProducts();
            return {
                success: true,
                message: `Product ${JSON.stringify(newProduct)} added successfully`
            };

        } catch (error) {
            console.error(error.message);
            return{
                success: false,
                message: `${error.message} - Product ${JSON.stringify(newProduct)} could not be added`
            }
        }
    }

    async getProducts() {
        this.products = await this.readProducts();
        return this.products;
    }

    async getProductById(id) {
        try {

            this.products = await this.readProducts();
            const product = this.products.find(p => p.id === id);
            if (!product) {
                return {
                    success: false,
                    message: "Not found - Try again"
                };
            }
            return {
                success: true,
                product
            };

        } catch (error) {
            console.error(error.message);
            throw Error(`Error while trying to get the product ${id}, error: ${error}`);
        }
    }

    async updateProduct(id, product) {
        try {
            
            const { id: ignoredId, ...updatedProduct } = product;

            this.products = await this.readProducts();
            const index = this.products.findIndex(p => p.id === id);

            if (index === -1) {
                return {
                    success: false,
                    message: "Product with the provided id doesn't exist"
                };
            }

            this.products[index] = { ...this.products[index], ...updatedProduct };
            await this.saveProducts();
            
            return {
                success: true,
                message: `Product ${id} updated`
            };

        } catch (error) {
            console.error(error.message);
            throw Error(`Error updating product with code ${id}: ${error}`);
        }
    }

    async deleteProduct(id) {
        try {

            this.products = await this.readProducts();
            const index = this.products.findIndex(p => p.id === id);
            if (index === -1) {
                return {
                    success: false,
                    message: "Product with the provided code doesn't exist"
                };
            }
            this.products.splice(index, 1);
            await this.saveProducts();
            return {
                success: true,
                message: "Product deleted"
            };

        } catch (error) {
            console.error(error.message);
            throw Error(`Error deleting the product, error detail: ${error}`);
        }
    }

    async readProducts() {
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
            throw Error(`Error reading the products, error detail: ${error}`);
        }
    }

    async saveProducts() {
        try {

            await fs.promises.writeFile(this.filePath, JSON.stringify(this.products), 'utf8');

        } catch (error) {
            console.error(error.message);
            throw Error(`Error saving the file, error detail: ${error}`);
        }
    }
}

export default ProductManager;