import ProductDao from "../dao/db/products.dao.js";

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

        const {title, description, code, price, stock, category, thumbnails } = parameters;

        if (!title) throw new Error('Title is required');
        if (!description) throw new Error('Description is required');
        if (!code) throw new Error('Code is required');
        if (!price) throw new Error('Price is required');
        if (!stock) throw new Error('Stock is required');
        if (!category) throw new Error('Category is required');

        const product = productDao.createProduct({ title, description, code, price, stock, category, thumbnails });
        
        console.log("Product Added: ");
        console.log(product);

        return product;
    }

    async updateProduct(id, { title, description, code, price, stock, category, thumbnails }) {
        if (!id) throw new Error('Product ID is required.');

        const product = await productDao.updateProduct(id, { title, description, code, price, stock, category, thumbnails });
        return product;
    }

    async deleteProduct(id) {
        if (!id) throw new Error('Product ID is required.');

        const product = await productDao.deleteProduct(id);
        return product;
    }
}