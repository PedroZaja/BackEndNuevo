import mongoose from 'mongoose';

const collection = 'users';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
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
    }
})

userSchema.pre(/^find/, function (next) {
    this.populate("cart.cartId");
    next();
});

export const userModel = mongoose.model(collection, userSchema);