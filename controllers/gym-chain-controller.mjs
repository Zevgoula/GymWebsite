import { Anhkei as MyAnhkei } from '../model/gym.js';
import { Books as MyBooks } from '../model/gym.js';
import { Gym as MyGym } from '../model/gym.js';
import { Customer as MyCustomer } from '../model/gym.js';
import { Membership as MyMembership } from '../model/gym.js';
import { Offers as MyOffers } from '../model/gym.js';
import { Selects as MySelects } from '../model/gym.js';
import { Includes as MyIncludes } from '../model/gym.js';
import { Trainer as MyTrainer } from '../model/gym.js';
import { Supervises as MySupervises } from '../model/gym.js';
import { Class as MyClass } from '../model/gym.js';
import { User as MyUser } from '../model/gym.js';

import * as model from '../model/gym-chain-model-sqlite-async.mjs';


export async function home(req, res) {

    let isAdmin = await model.isAdmin(req.session.loggedUserId);
    console.log('isAdmin', isAdmin);
    try {
        res.render('home', { layout: 'main', session: req.session});
    }
    catch (error) {
        console.error('home error: ' + error);
        res.render('home', { layout: 'main', session: req.session });
    }
}

export async function accountPage(req, res) {
    res.render('account_page', { layout: 'main', session: req.session });
}

export async function about_classes(req, res) {
    res.render('about_classes', { layout: 'main' , session: req.session});
}

export async function about_page(req, res) {
    res.render('about_page', { layout: 'main' , session: req.session});
}

export async function services(req, res) {
    
    res.render('services', { layout: 'main' , session: req.session});
}



export async function memberships(req, res) {
    res.render('memberships', { layout: 'main', session: req.session });
}

export async function personal_info(req, res) {
    res.render('personal_info', { layout: 'main', session: req.session});
}

export async function payment_info(req, res) {
    res.render('payment_info', { layout: 'main' , session: req.session});
}

export async function joinNow(req, res) {
    res.render('joinNow', { layout: 'main' , session: req.session});
}

export async function contact(req, res) {
    res.render('contact', { layout: 'main' , session: req.session});
}