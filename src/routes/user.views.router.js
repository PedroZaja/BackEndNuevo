import {Router} from 'express';
import {privateRouteMiddleware, publicRouteMiddleware, passportCall} from '../util.js'

const router = Router();

router.get('/login', publicRouteMiddleware, (req, res)=>{

    res.render('login');
})

router.get('/register', publicRouteMiddleware, (req, res)=>{

    res.render('register');
})


router.get('/restore', publicRouteMiddleware, (req, res)=>{

    res.render('restore');
})

router.get('/', passportCall('jwt'), (req, res)=>{

    res.render('products', {
        user: req.user,
    });
})

router.get("/error", (req, res)=>{
    res.render("error");
});

export default router;