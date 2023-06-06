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
            * titulo: type String, received: ${product.titulo}
            * descripcion: type String, received: ${product.descripcion}
            * code: type String, received: ${product.code}
            * precio: type Number, received: ${product.precio}
            * stock: type Number, received: ${product.stock}
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