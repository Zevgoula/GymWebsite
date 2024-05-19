import express from 'express'
const router = express.Router();

import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
    dotenv.config();
}

const gymChainController = await import(`../controllers/gym-chain-controller.mjs`)

router.route('/').get((req, res) => { res.redirect('/home') });

router.get('/about_classes', gymChainController.about_classes);
router.get('/about_page', gymChainController.about_page);
router.get('/services', gymChainController.services);
router.get('/contact', gymChainController.contact);
router.get('/home', gymChainController.home);
router.get('/memberships', gymChainController.memberships);
router.get('/personal_info', gymChainController.personal_info);
router.get('/payment_info', gymChainController.payment_info);
router.get('/login', gymChainController.login);
router.get('/createAccount', gymChainController.createAccount);
router.get('/joinNow', gymChainController.joinNow);
router.get('/contact', gymChainController.contact);





export default router;