import mongoose from "mongoose";

const ticketsCollection = "tickets";


const stringRequired = { type: String, required: true };
const dateNow = { type: Date, default: Date.now };
const numberRequired = { type: Number, required: true };


const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: function () {
            const randomNumber = Math.floor(Math.random() * 10000);
            const currentDate = new Date().toISOString().replace(/[-:.TZ]/g, '');
            return `${currentDate}${randomNumber}`;
        }
    },
    purchase_datetime: dateNow,
    amount: numberRequired,
    purchaser: stringRequired,
    products: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        }],
        default: []
    }
});

export const ticketModel = mongoose.model(ticketsCollection, ticketSchema);