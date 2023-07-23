export default class CartsRepository{
    constructor(dao){
        this.dao = dao;
    }

    async createCart(){
        return await this.dao.createCart({});
    }

    async getCart(cartId){
        return await this.dao.getCart(cartId);
    }

    async findProduct(cartId, productId){
        return await this.dao.findProduct(cartId, productId);
    }

    async addProduct(cartId, productId, quantity){
        return await this.dao.addProduct(cartId, productId, quantity);
    }

    async updateQuantity(cartId, productId, quantity){
        return await this.dao.updateQuantity(cartId, productId, quantity);
    }

    async deleteProduct(cartId, productId){
        return await this.dao.deleteProduct(cartId, productId)
    }

    async emptyCart(cartId){
        return await this.dao.emptyCart(cartId);
    }

    async getPaginatedCart(cartId){
        return await this.dao.getPaginatedCart(cartId);
    }
}