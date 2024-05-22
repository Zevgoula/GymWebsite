import session from 'express-session';
import * as model from '../model/gym-chain-model-sqlite-async.mjs';

export async function home(req, res, next) {

    let isAdmin = await model.isAdmin(req.session.loggedUserId);
    console.log('isAdmin', isAdmin);
    try {
        req.session.previousPage = req.originalUrl;
        res.render('home', { session: req.session});
    }
    catch (error) {
        next(error);
    }
}

export async function about_classes(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        res.render('about_classes', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function selectGym(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const gymInfo = await model.getGymsInfo();
        res.render('joinNow', { gyms: gymInfo, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function selectClass(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const selectedgymID = req.params.selectedgymID;
        console.log('selected gym '+selectedgymID);

        const classInfo = await model.getClassesInfo();
        res.render('services', { gym_id: selectedgymID, classes: classInfo, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function selectMembership(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const selectedgymID = req.params.selectedgymID;
        const selectedclassID = req.params.selectedclassID;
        console.log('selected class ' + selectedclassID);

        //Get the membership Information for the selected class (all classes have 3 memberships)
        const membershipsInfo = await model.getMembershipsInfofromClassID(selectedclassID);
        res.render('memberships', { gym_id: selectedgymID, class_id: selectedclassID, membershipsInfo: membershipsInfo, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

//Only loads the template, no connection to the database
export async function personal_info(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        console.log('selected membership' + req.params.selectedmembershipID);
        console.log('user is ' + req.session.loggedUserId);
        res.render('personal_info', { session: req.session });
    }
    catch (error) {
        next(error);
    }
    
}

//Only loads the template, no connection to the database
export async function payment_info(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        res.render('payment_info', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}

//Need to implement the following functions
export async function accountPage(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const customerInfo = await model.getCustomerInfo(req.session.loggedUserId);

        res.render('account_page', {customerInfo: customerInfo, session: req.session });
    }
    catch (error) {
        next(error);    
    }
}

//Has to be lead somewhere (mallon skip)
export async function about_page(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        res.render('about_page', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}

//Only loads the template, no connection to the database
export async function contact(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        res.render('contact', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}


