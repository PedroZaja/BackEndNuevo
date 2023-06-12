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

router.get('/recoverLanding/:token', (req, res)=>{

    try {
        const token = req.params.token;
        req.logger.debug(token);

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