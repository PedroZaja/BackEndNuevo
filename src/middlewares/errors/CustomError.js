export default class CustomError {
    static createError({statusCode=500, name="Error", cause, message, code=1}) {
        const error = new Error(message, {cause: new Error(cause)});
        error.status = statusCode;
        error.name= name;
        error.code= code;
        throw error;
    };
}