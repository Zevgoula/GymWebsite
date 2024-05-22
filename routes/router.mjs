import express from 'express'
const router = express.Router();

import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
    dotenv.config();
}

import * as gymChainController from '../controllers/gym-chain-controller.mjs';

//Για την υποστήριξη σύνδεσης/αποσύνδεσης χρηστών
import * as logInController from '../controllers/login-controller-password.mjs';

router.route('/').get((req, res) => { 
    res.redirect('/home') 
});

router.get('/about_classes', gymChainController.about_classes);
router.get('/about_page', gymChainController.about_page);
router.get('/services', gymChainController.services);
router.get('/contact', gymChainController.contact);
router.get('/home', gymChainController.home);
router.get('/memberships', gymChainController.memberships);
router.get('/personal_info', gymChainController.personal_info);
router.get('/payment_info', gymChainController.payment_info);

router.get('/contact', gymChainController.contact);
router.get('/account_page', gymChainController.accountPage);

router.get('/joinNow', gymChainController.joinNow);



//Αιτήματα για σύνδεση
//Δείξε τη φόρμα σύνδεσης.
router.route('/login').get(logInController.checkAuthenticated, logInController.showLogInForm);

// // //Αυτή η διαδρομή καλείται όταν η φόρμα φτάσει στον εξυπηρετητή με POST στο /login. Διεκπεραιώνει τη σύνδεση (login) του χρήστη
router.route('/login').post(logInController.doLogin);

// //Αποσυνδέει το χρήστη
router.route('/logout').get(logInController.doLogout);

// //Εγγραφή νέου χρήστη
router.route('/createAccount').get(logInController.checkAuthenticated, logInController.showRegisterForm);

router.post('/createAccount', logInController.doRegister);





export default router;