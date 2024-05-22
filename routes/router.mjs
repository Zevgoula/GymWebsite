import express from 'express'
const router = express.Router();

import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
    dotenv.config();
}

import * as gymChainController from '../controllers/gym-chain-controller.mjs';
import * as logInController from '../controllers/login-controller-password.mjs';

router.route('/').get((req, res) => { 
    res.redirect('/home') 
});

//Home page
router.get('/home', gymChainController.home);

//Gym Benefits
router.get('/about_classes', gymChainController.about_classes);

//About page(Not implemented)
router.get('/about_page', gymChainController.about_page);

//Account page(Not implemented)
router.get('/account_page', gymChainController.accountPage);

//Select gym
router.get('/joinNow', gymChainController.selectGym);

//Select class
router.route('/services/:selectedgymID').get(gymChainController.selectClass);

//Select membership
router.route('/memberships/:selectedgymID/:selectedclassID').get(gymChainController.selectMembership);

//Personal info
router.get('/personal_info/:selectedgymID/:selectedclassID/:selectedmembershipID', gymChainController.personal_info);
//post request for personal info

//Payment info
router.get('/payment_info', gymChainController.payment_info);
//post request for payment info


//Show the login form
router.route('/login').get(logInController.checkAuthenticated, logInController.showLogInForm);
//Login the user
router.route('/login').post(logInController.doLogin);

//Logs out user
router.route('/logout').get(logInController.doLogout);

//Show the register form
router.route('/createAccount').get(logInController.checkAuthenticated, logInController.showRegisterForm);
//Register the user
router.post('/createAccount', logInController.doRegister);





export default router;