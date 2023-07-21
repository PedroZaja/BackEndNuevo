export default class ProductsRepository{
    constructor(dao){
        this.dao = dao;
    }

    getProducts(filters, options){
        return this.dao.getProducts(filters, options);
    }

    async getProductById(productId){
        return this.dao.getProductById(productId);
    }

    createProduct(newproduct){
        return this.dao.createProduct(newproduct);
    }

    updateProduct(productId, productToReplace){
        return this.dao.updateProduct(productId, productToReplace);
    }

    deleteProduct(productId){
        return this.dao.deleteProduct(productId);
    }
}