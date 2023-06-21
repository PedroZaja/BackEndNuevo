import { Router } from 'express';
import { register, login, gitHubCallback, getCurrent, logout, recoverPass, restorePass, swapUserClass } from '../controllers/session.controller.js';
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

router.post('/premium/:uid', passportCall('jwt'), swapUserClass);


export default router;
