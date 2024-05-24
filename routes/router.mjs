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

//Admin home
router.get('/admin_home', gymChainController.admin_home);

//Gym Benefits
router.get('/about_classes', gymChainController.about_classes);

//About page (Not implemented)
router.get('/about_page', gymChainController.about_page);

//Account page (Not implemented)
router.get('/account_page', gymChainController.accountPage);

//Select gym
router.get('/joinNow', gymChainController.selectGym);

//Select class
router.route('/services/:selectedgymID').get(gymChainController.selectClass);

//Select membership
router.route('/memberships/:selectedgymID/:selectedclassID').get(gymChainController.selectMembership);

//Show personal info form
router.route('/personal_info/:selectedgymID/:selectedclassID/:selectedmembershipID').get(gymChainController.showPersonalInfoForm);
//Post request for personal info
router.route('/personal_info/:selectedgymID/:selectedclassID/:selectedmembershipID').post(gymChainController.doPersonalInfo);


//Show payment info form
router.route('/payment_info/:selectedgymID/:selectedclassID/:selectedmembershipID').get(gymChainController.showPaymentInfoForm);
//Post request for payment info
router.route('/payment_info/:selectedgymID/:selectedclassID/:selectedmembershipID').post(gymChainController.doPaymentInfo);

//Post request for contact form
router.route('/home').post(gymChainController.doContact);


//Show book form
router.route('/book').get(gymChainController.showBookForm);
//Post request for book form
router.route('/book').post(gymChainController.doBookForm);

//Available hours
router.route('/available_hours/:classDate/:classLocation').get(gymChainController.showTimesForm);
//Post request for available hours form
router.route('/available_hours/:classDate/:classLocation').post(gymChainController.doTimesForm);

//Extend_membership
router.get('/membership_extended/:customerID/:selectedmembershipID', gymChainController.extend_membership);

//Bookin Schedule
router.get('/schedule', gymChainController.showSchedule);

//Customer Schedule
router.get('/customer_schedule', gymChainController.viewSchedule);

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