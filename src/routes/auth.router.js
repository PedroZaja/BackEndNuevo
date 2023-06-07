import { Router } from 'express';
import { register, login, gitHubCallback, getCurrent, logout, recoverPass, restorePass } from '../controllers/auth.controller.js';
import { passportCall } from '../util.js';

const router = Router();

router.post("/register", passportCall('register'), register);
router.post("/login", passportCall('login'), login);
router.get("/github", passportCall('github', { scope: ['user:email'] }));
router.get("/githubcallback", passportCall('github', { failureRedirect: '/github/error' }), gitHubCallback);

router.get("/current", passportCall('jwt'), getCurrent)  
router.post("/logout", logout);
router.post("/recover", recoverPass);
router.post("/restorePass", restorePass);

// router.post('/premium/:uid', passportCall('jwt', {session: false}), postSwapUserClass);

// // VER
// router.post('/recover', recoverUser, sc.postRecover);
// router.post('/recoverPassword', recoverPassword, sc.postRecoverPassword);
/* 
recoverUser:
req.logger.debug("Estoy en el middleware del recover");
const {email} = req.body;
req.logger.debug(email)

try {
    const user = await um.getOne({email});
    console.log(user)
    if (!user) {
        req.logger.info("El usuario no existe");
        return res.send({status: "error", message: "El usuario no existe"});
    }

    req.user = user;
    next();
} catch(error) {
    next(error);
}

*********

req.logger.debug("EMPIEZA EL RECOVERPASSWORD");

let token = req.body.token;
let password = req.body.password;

if (password.trim() == 0) return res.send({status: "error", message: "La contraseña no puede estar vacia"});

let result;

console.log("Verificacion");
jwt.verify(token, config.jwtKey, function(error, decoded) {
    req.logger.debug("El token es");
    req.logger.debug(token)
    if (error) {
        if (error instanceof jwt.TokenExpiredError) {
            result = "EXPIRED";
            req.logger.debug("Expiro");
        }
    } else {
        req.logger.debug("No expiro");
        result = decoded;
    }
});

if (result == "EXPIRED") return res.send({status: "error", message: "El token expiro"});

let email = result.email;

let account = await um.getOne({email});

if (!account) return res.send({status: "error", message: "La cuenta ya no existe"});

if (isValidPassword(account, password)) return res.send({status: "error", message: "La contraseña es la misma"});

req.account = account;
req.password = password;

next(); */

export default router;