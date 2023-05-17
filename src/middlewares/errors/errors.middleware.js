import EErrors from './errors-enum.js'

const errorHandler = (error, req, res, next) => {
    
    console.log("Error detected entering the Error Handler:");
    console.log(error.cause);

    switch (error.code){

        case EErrors.INVALID_TYPES_ERROR:
            res.status(error.statusCode).send({status: "error", error: error.name, details: error.message});
            break;

        case EErrors.DATABASE_ERROR:
            res.status(error.statusCode).send({status: "error", error: error.name || "A database error has occurred", details: error.message});
            break;

        case EErrors.MISSING_DATA:
            res.status(error.statusCode).send({status: "error", error: error.name || "There are data that have not been sent", details: error.message});
            break;

        case EErrors.RENDERING_ERROR:
            res.render('error');
            break;

        case EErrors.ROUTING_ERROR:
            res.render('Unauthorized');
            break;

        default:
            res.status(500).send({status: "error", error: "Unhandled error"});
    }
}

export default errorHandler;