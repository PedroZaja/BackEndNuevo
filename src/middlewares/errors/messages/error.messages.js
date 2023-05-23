export const updateQuantityInCartErrorInfo = (cart, productId) => {
    return `One or more properties were sent incomplete or are invalid.
            List of required properties:
            * cartId: type String, received: ${cart}
            * productId: type String, received: ${productId}
            `;
};

export const createProductErrorInfo = (product) => {
    return `One or more properties were sent incomplete or are invalid.
            List of required properties:
            * title: type String, received: ${product.title}
            * description: type String, received: ${product.description}
            * code: type String, received: ${product.code}
            * price: type Number, received: ${product.price}
            * stock: type Number, received: ${product.stock}
            * category: type String, received: ${product.category}
            `;
};

export class generateErrorInfo {
    static getId(id) {
        return `ID was ${id} and is not valid`;
    }

    static idNotFound() {
        return 'The ID doesnt exist';
    }

    static getEmptyDatabase() {
        return "Data was {}";
    }

    static unauthorized() {
        return "The user was unauthorized";
    }

    static dbNotChanged() {
        return "Database didn't register the changes";
    }
}