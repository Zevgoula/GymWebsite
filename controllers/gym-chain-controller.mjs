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

export async function selectGym(req, res) {
    try {
        const gymInfo = await model.getGymsInfo();
        // console.log(gymInfo);
        const club1 = gymInfo[0];
        const club2 = gymInfo[1];
        const club3 = gymInfo[2];
        res.render('joinNow', { club1: club1, club2: club2, club3: club3, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function selectClass(req, res) {
    try {
        const selectedgymID = req.params.selectedgymID;
        console.log('selected gym '+selectedgymID);

        const classInfo = await model.getClassesInfo();
        const class1 = classInfo[0];
        const class2 = classInfo[1];
        const class3 = classInfo[2];
        const class4 = classInfo[3];
        
        res.render('services', { gym_id: selectedgymID, class1: class1, class2: class2, class3: class3, class4: class4, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function selectMembership(req, res) {
    try {
        const selectedgymID = req.params.selectedgymID;
        const selectedclassID = req.params.selectedclassID;
        console.log('selected class ' + selectedclassID);
        
        //Get the membership IDs for the selected class (all classes have 3 memberships)
        const membershipIDs = await model.getMembershipIDsfromClassID(selectedclassID);
        const membership1 = membershipIDs[0];
        const membership2 = membershipIDs[1];
        const membership3 = membershipIDs[2];
        res.render('memberships', { gym_id: selectedgymID, class_id: selectedclassID, membership1: membership1, membership2: membership2, membership3: membership3, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function personal_info(req, res) {
    try {
        console.log(req.params.selectedclassID);
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



export async function contact(req, res) {
    try {
        res.render('contact', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}


// export async function doJoinNow(req, res) {
//     try {
//         const customerId = await model.getCustomerIDFromUsername(req.session.loggedUserId);
//         const membership = await model.buyMembership(membershipId, customerId);
//         res.redirect('/services');
//     }
//     catch (error) {
//         next(error);
//     }
// }