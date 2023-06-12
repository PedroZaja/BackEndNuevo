import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const stringRequired = {type: String, required: true};
const numberRequired = {type: Number, required: true};

const productsSchema = new mongoose.Schema({
    title: stringRequired,
    description: stringRequired,
    code: stringRequired,
    price: numberRequired,
    status: { type: Boolean, default: true, required: false},
    stock: numberRequired,
    category: stringRequired,
    thumbnail: {type: Array},
    owner: { type: String, default: 'admin'}
});

productsSchema.plugin(mongoosePaginate);
export const productsModel = mongoose.model(productsCollection,productsSchema);