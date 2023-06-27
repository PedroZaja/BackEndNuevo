import winston, { transports } from "winston";
import config from "./config.js";

//Custom logger options:
const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warn: 'yellow',
        info: 'blue',
        http: 'cyan',
        debug: 'white'
    }
};

//Custom Logger:
const devLogger = winston.createLogger({
    //Levels:
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelsOptions.colors }),
                    winston.format.simple()
                )
            }
        )
    ]
});

//Creating our logger:
const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelsOptions.colors }),
                    winston.format.simple()
                )
            }
        ),
        new winston.transports.File(
            {
                filename: './errors.log',
                level: "error",
                format: winston.format.simple()
            }
        )
    ]
});

//Declare a middleware:
const addLogger = (req, res, next) => {
    if (config.environment === 'production') {
        req.logger = prodLogger;
    } else {
        req.logger = devLogger;
    }
    req.logger.info(`${req.method} in ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);

    res.on('finish', () => {
        if (res.statusCode >= 400) {
            req.logger.warn(`Error ${res.statusCode}: ${res.statusMessage}`);
        }
    });

    next();
};

let customLogger;

if (config.environment === 'production') {
    customLogger = prodLogger;
} else {
    customLogger = devLogger;
};

export { customLogger, addLogger }