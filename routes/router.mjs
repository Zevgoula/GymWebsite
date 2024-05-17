import express from 'express'
const router = express.Router();

import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
    dotenv.config();
}

const gymChainController = await import(`../controllers/gym-chain-controller.mjs`)

router.route('/').get((req, res) => { res.redirect('/home') });

router.route('/about_classes').get((req, res) => { res.render('about_classes') });
router.route('/about_page').get((req, res) => { res.render('about_page') });
router.route('/services').get((req, res) => { res.render('services') });
router.route('/contact').get((req, res) => { res.render('contact') });
router.route('/home').get((req, res) => { res.render('home', {layout : "main"}) });
router.route('/memberships').get((req, res) => { res.render('memberships') });




export default router;