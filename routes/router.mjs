import express from 'express'
const router = express.Router();

import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

import * as gymChainController from '../controllers/gym-chain-controller.mjs';
import * as logInController from '../controllers/login-controller-password.mjs';

router.route('/').get((req, res) => { 
    res.redirect('/home') 
});

//Home page
router.get('/home', gymChainController.home);
//Post request for contact form
router.route('/home').post(gymChainController.doContact);

//Gym Services
router.get('/about_classes', gymChainController.showGymServices);

//Account page 
router.get('/account_page', gymChainController.showAccountPage);

//Delete Membership
router.get('/acount_page/:membershipID', gymChainController.deleteMembership);

//Select gym
router.get('/joinNow', gymChainController.selectGym);

//Select class
router.route('/services/:selectedgym').get(gymChainController.selectClass);

//Select membership
router.route('/memberships/:selectedgym/:selectedclass').get(gymChainController.selectMembership);

//Show personal info form
router.route('/personal_info/:selectedgym/:selectedclass/:selectedmembershipID').get(gymChainController.showPersonalInfoForm);
//Post request for personal info
router.route('/personal_info/:selectedgym/:selectedclass/:selectedmembershipID').post(gymChainController.doPersonalInfo);
//Post request for payment info
router.route('/payment_info/:selectedgym/:selectedclass/:selectedmembershipID').post(gymChainController.doPaymentInfo);


//Show message
router.route('/message').get(gymChainController.showMessage);

//Extend_membership
router.get('/membership_extended/:customerID/:selectedmembershipID', gymChainController.extendMembership);

//Booking Schedule
router.route('/schedule').get(gymChainController.showBookSchedule);
router.route('/schedule').post(gymChainController.doBookSchedule);
//General Schedule
router.route('/gymLab_schedule/:selectedgym').get(gymChainController.showGeneralSchedule);
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


//For testing error handling
router.get('/error', gymChainController.showError);







export default router;