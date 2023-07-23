import mongoose from 'mongoose';

const collection = 'users';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        require: true
    },
    age: Number,
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'premium'],
    },
    cart: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    orders: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "tickets"       
            }   
        ]
    },
    documents: {
        type: [
            {
                name: {
                    type: String,
                    unique: true
                },
                reference: String
            }
        ]
    },
    last_connection: String
})

userSchema.pre(/^find/, function (next) {
    this.populate("cart.cartId");
    next();
});

export const usersModel = mongoose.model(collection, userSchema);