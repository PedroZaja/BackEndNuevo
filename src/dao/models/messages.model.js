
import mongoose from "mongoose";

const messagesCollection = "messages";

const stringRequired = {type: String, required: true};

const messagesSchema = new mongoose.Schema({
    user: stringRequired,
    message: stringRequired
});

export const messagesModel = mongoose.model(messagesCollection,messagesSchema);