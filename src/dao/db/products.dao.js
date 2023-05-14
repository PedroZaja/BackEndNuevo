import { productsModel } from "./models/products.model.js"

export default class ProductDao {

    async getProducts(filters, options) {

        const products = await productsModel.paginate(filters, options);
        return products;
    }

    async getProductById(productId) {
        return await productsModel.findById(productId);
    }

    async createProduct(newproduct) {
        return await productsModel.create(newproduct);
    }

    async deleteProduct(productId) {
        return await productsModel.deleteOne({ _id: productId });
    }

    async updateProduct(productId, productToReplace) {
        return await productsModel.updateOne({ _id: productId }, productToReplace);
    }
}