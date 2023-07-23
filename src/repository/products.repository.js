export default class ProductsRepository{
    constructor(dao){
        this.dao = dao;
    }

    async getProducts(filters, options){
        return await this.dao.getProducts(filters, options);
    }

    async getProductById(productId){
        return await this.dao.getProductById(productId);
    }

    async createProduct(newproduct){
        return await this.dao.createProduct(newproduct);
    }

    async updateProduct(productId, productToReplace){
        return await this.dao.updateProduct(productId, productToReplace);
    }

    async deleteProduct(productId){
        return await this.dao.deleteProduct(productId);
    }
}