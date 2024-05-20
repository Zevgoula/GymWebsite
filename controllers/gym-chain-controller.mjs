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
        res.render('home', { session: req.session});
    }
    catch (error) {
        next(error);
    }
}

export async function accountPage(req, res) {
    try {
        res.render('account_page', {session: req.session });
    }
    catch (error) {
        next(error);    
    }
}

export async function about_classes(req, res) {
    try {
        res.render('about_classes', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function about_page(req, res) {
    try {
        res.render('about_page', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function services(req, res) {
    try {
        res.render('services', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function memberships(req, res) {
    try {
        res.render('memberships', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function personal_info(req, res) {
    try {
        res.render('personal_info', { session: req.session });
    }
    catch (error) {
        next(error);
    }
    
}

export async function payment_info(req, res) {
    try {
        res.render('payment_info', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function joinNow(req, res) {
    try {
        res.render('joinNow', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function contact(req, res) {
    try {
        res.render('contact', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}