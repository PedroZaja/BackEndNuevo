import {Router} from 'express';
import {privateRouteMiddleware, publicRouteMiddleware, passportCall} from '../util.js'
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const router = Router();

router.get('/login', publicRouteMiddleware, (req, res)=>{

    res.render('login');
})

router.get('/register', publicRouteMiddleware, (req, res)=>{

    res.render('register');
})


router.get('/recover', publicRouteMiddleware, (req, res)=>{

    res.render('recover');
})

router.get('/recoverLanding/:token', (req, res)=>{

    try {
        const token = req.params.token;
        req.logger.debug(token);
        
        let result;
        
        jwt.verify(token, config.jwtPrivateKey, function(error, decoded) {
            if (error) {
                if (error instanceof jwt.TokenExpiredError) {
                    result = "EXPIRED";
                }
            } else {
                result = decoded;
            }
        });
        
        if (result == "EXPIRED") {
            req.logger.debug("Expired Token")
            let hasExpired = true;
            return res.render('recoverLanding', {hasExpired});
        }
/* 
        const email = result.email;
        const account = await um.getOne({email});

        if (!account) return res.send({status: "error", message: "La cuenta ya no existe"});
        
        if (isValidPassword(account, password)) return res.send({status: "error", message: "La contraseña es la misma"});
    
        req.account = account;
        req.password = password;
 */
        res.render('recoverLanding', {token});

    } catch (error) {
        req.logger.error(error);
        res.render('error');
    }
});


router.get('/', passportCall('jwt'), (req, res)=>{

    res.redirect("/products");
})

router.get("/error", (req, res)=>{
    res.render("error");
});

export default router;