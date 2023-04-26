import {messagesModel} from "../../models/messages.model.js"

export default class MessageService {

    async addMessage(newMessage) {
        try {
            let message = await messagesModel.create(newMessage);
            console.log(message);

            console.log("Message Added");
            return {
                success: true,
                message: `Message ${message.message} added successfully`
            };
        } catch (error) {
            return error;
        }
    };
};