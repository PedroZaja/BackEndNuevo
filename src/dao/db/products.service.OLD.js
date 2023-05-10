import { productsModel } from "./models/products.model.js"

export default class ProductManager {

    async getProducts(parameters) {
        try {

            let limit = parameters.limit ? parseInt(parameters.limit) : 10;
            let page = parameters.page ? parseInt(parameters.page) : 1;
            let category = parameters.category ? parameters.category.toLowerCase() : null;
            let status = parameters.status ? (parameters.status.toLowerCase() === "true" ? true : parameters.status.toLowerCase() === "false" ? false : null) : null;
            let sort = parameters.sort ? (parameters.sort === "asc" ? 1 : parameters.sort === "desc" ? -1 : null) : null;


            const filters = {};
            const options = {};

            if (category || status) {
                category ? filters.category = category : {}
                status ? filters.status = status : {};
            }

            options.limit = limit;
            options.page = page;
            if (sort !== null) {
                options.sort = { price: sort };
            }

            const products = await productsModel.paginate(filters, options);
            console.log(products);

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
                return {
                    success: false,
                    message: "Product not found - Try again"
                }
            }

        } catch (error) {
            return error;
        }
    }

    async getProductById(productId) {
        try {
            const product = await productsModel.findById(productId);

            if (!product) {
                return {
                    success: false,
                    message: "Product not found - Try again"
                };
            }

            return {
                success: true,
                product
            };
        } catch (error) {
            return error.message;
        }
    }

    async addProduct(newproduct) {
        try {
            let product = await productsModel.create(newproduct);
            console.log(product);

            console.log("Product Added");
            return {
                success: true,
                message: `Product ${product.title} added successfully`
            };
        } catch (error) {
            return error;
        }
    }

    async deleteProduct(productId) {
        try {
            let result = await productsModel.deleteOne({ _id: productId });
            console.log("Product Removed");
            return {
                success: true,
                message: `Product ID ${productId} deleted successfully`
            };
        } catch (error) {
            return error;
        }
    }

    async updateProduct(productId, productToReplace) {
        try {
            let product = await productsModel.updateOne({ _id: productId }, productToReplace);
            console.log("Product Modified");
            return {
                success: true,
                message: `Product ${productToReplace.title} edited successfully`
            };

        } catch (error) {
            console.log(error);
        }
    }
}
