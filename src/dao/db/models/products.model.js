import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const stringRequired = {type: String, required: true};
const numberRequired = {type: Number, required: true};

const productsSchema = new mongoose.Schema({
    titulo: stringRequired,
    descripcion: stringRequired,
    code: stringRequired,
    precio: numberRequired,
    stock: numberRequired,
    img: {type: Array},
    owner: { type: String, default: 'admin', required: true}
});

productsSchema.plugin(mongoosePaginate);
export const productsModel = mongoose.model(productsCollection,productsSchema);