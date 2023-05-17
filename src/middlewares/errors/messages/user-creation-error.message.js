export const updateQuantityInCartErrorInfo = (cart, product) => {
    return `One or more properties were sent incomplete or are invalid.
            List of required properties:
            * cartId: type String, received: ${cart}
            * email: type String, received: ${productId}
            `;
};