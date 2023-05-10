import { productsModel } from "./models/products.model.js"

export default class ProductManager {

    async getProducts(filters, options) {

        const products = await productsModel.paginate(filters, options);

        if (products.totalDocs > 0) {
            let response = {
                status: "success",
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: "",
                nextLink: "",
            }

            return response;
            
        } else {
            return null
        }
    }

    async getProductById(productId) {
        return await productsModel.findById(productId);
    }

    async addProduct(newproduct) {
        return await productsModel.create(newproduct);
    }

    async deleteProduct(productId) {
        return await productsModel.deleteOne({ _id: productId });
    }

    async updateProduct(productId, productToReplace) {
        return await productsModel.updateOne({ _id: productId }, productToReplace);
    }
}
