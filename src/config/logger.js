import winston, { transports } from "winston";
import config from "./config.js";

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

const devLogger = winston.createLogger({
    
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

class Logger {
    constructor() {
        if (config.environment === 'production') {
            this.logger = prodLogger;
        } else {
            this.logger = devLogger;
        }
    }

    addLogger = (req, res, next) => {
        req.logger = this.logger;
        
        req.logger.http(`${req.method} in ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);

        res.on('finish', () => {
            if (res.statusCode >= 400) {
                req.logger.warn(`Error ${res.statusCode}: ${res.statusMessage} at ${req.url} `);
            }
        });

        next();
    };
}


export default Logger;