import {Router} from 'express';
import {privateRouteMiddleware, publicRouteMiddleware, passportCall} from '../util.js'

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

// router.get('/recoverLanding/:token', getRecoverLanding);
router.get('/recoverLanding/:token', (req, res)=>{


    /* getRecoverLanding = (req, res) => {
        
    try {
        let token = req.params.token;
        req.logger.debug(token);
        
        let result;

        jwt.verify(token, config.jwtKey, function(error, decoded) {
            if (error) {
                if (error instanceof jwt.TokenExpiredError) {
                    result = "EXPIRED";
                }
            } else {
                result = decoded;
            }
        });
        
        if (result == "EXPIRED") {
            req.logger.debug("Expiró")
            let hasExpired = true;
            return res.render('recoverLanding', {hasExpired});
        }
        
        res.render('recoverLanding', {token});
    } catch (error) {
        req.logger.error(error);
        res.render('error');
    }
} */
});


router.get('/', passportCall('jwt'), (req, res)=>{

    res.redirect("/products");
})

router.get("/error", (req, res)=>{
    res.render("error");
});

export default router;