import EErrors from './errors-enum.js'

export default (error, req, res, next) => {
    
    req.logger.debug(`Error cause: ${error.cause}`);

    switch (error.code){

        case EErrors.INVALID_TYPES_ERROR:
            res.status(error.status).send({status: "Error", error: error.name || "A invalid type error has occurred", details: error.message, cause: error.cause? error.cause : "Not detailed"});
            break;

        case EErrors.DATABASE_ERROR:
            res.status(error.status).send({status: "Error", error: error.name || "A database error has occurred", details: error.message, cause: error.cause? error.cause : "Not detailed"});
            break;

        case EErrors.MISSING_DATA:
            res.status(error.status).send({status: "Error", error: error.name || "There are data that have not been sent", details: error.message, cause: error.cause? error.cause : "Not detailed"});
            break;

        case EErrors.RENDERING_ERROR:
            res.render('error');
            break;

        case EErrors.ROUTING_ERROR:
            res.render('Unauthorized');
            break;

        default:
            req.logger.fatal(error);
            res.status(500).send({status: "error", error: "Unhandled error"});
    }
}