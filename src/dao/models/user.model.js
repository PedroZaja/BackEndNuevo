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
        enum: ['user', 'admin'],
    },
    cart: {
        type: [{
                cartId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "carts"
                }
            }],
        default:[]
    }
})

userSchema.pre(/^find/, function (next) {
    this.populate("cart.cartId");
    next();
});

const userModel = mongoose.model(collection, userSchema);

export default userModel;