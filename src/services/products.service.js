import { customLogger } from "../config/logger.js";
import ProductDao from "../dao/db/products.dao.js";
import CustomError from "../middlewares/errors/CustomError.js"
import { updateQuantityInCartErrorInfo, createProductErrorInfo } from "../middlewares/errors/messages/error.messages.js";

const productDao = new ProductDao();

export default class ProductsService {

    async getProducts(parameters) {

        const limit = parameters.limit ? parseInt(parameters.limit) : 10;
        const page = parameters.page ? parseInt(parameters.page) : 1;
        const category = parameters.category ? parameters.category.toLowerCase() : null;
        const status = parameters.status === 'true' ? true : parameters.status === 'false' ? false : undefined;
        const sort = parameters.sort ? (parameters.sort === "asc" ? 1 : parameters.sort === "desc" ? -1 : null) : null;

        const filters = {};
        const options = {};

        if (category || status !== undefined) {
            if (category) {
                filters.category = category;
            }
            if (status !== undefined) {
                filters.status = status;
            }
        }
        
        options.lean = true;
        options.limit = limit;
        options.page = page;
        if (sort !== null) {
            options.sort = { price: sort };
        }

        const products = await productDao.getProducts(filters, options);

        return products;
    }

    async getProductById(id) {
        if (!id) throw new Error('Product ID is required.');

        const product = await productDao.getProductById(id)
        return product;
    }

    async createProduct(parameters) {

        const {titulo, descripcion, code, precio, stock, img, owner } = parameters;

        if (!titulo || !descripcion || !code || !precio || !stock) {
            throw CustomError.createError({
                statusCode: 401,
                code: 3,
                message: "Some product info is missing",
                cause: createProductErrorInfo({titulo, descripcion, code, precio, stock})
            })
        }

        const product = await productDao.createProduct({ titulo, descripcion, code, precio, stock, img, owner });
        
        customLogger.info(`Product Added: ${product}`);

        return product;
    }

    async updateProduct(productId, productFields) {

        if (!productId) throw new Error('Product ID is required.');

        const product = await productDao.updateProduct(productId, productFields);
        return product;
    }

    async deleteProduct(id) {
        if (!id) throw new Error('Product ID is required.');

        const product = await productDao.deleteProduct(id);

        return product;
    }
}