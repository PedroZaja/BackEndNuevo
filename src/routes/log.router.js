import { Router } from "express";

const router = new Router()

router.get("/", (req, res) => {
    req.logger.fatal("Catastrophic error, something went very wrong");
    req.logger.warn("Test of warning log");
    req.logger.info(`This is a info log. Your username is ${req.user}`);
    req.logger.http("Http Log");
    req.logger.debug("This is a Developer info log");
    res.send({ message: "Test the logger" });
})

export default router