import session from 'express-session';
import * as model from '../model/gym-chain-model-sqlite-async.mjs';

export async function home(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const message = req.session.message;
        req.session.message = null; 
        console.log(req.body.b1);
        res.render('home', { message: message, session: req.session});
    }
    catch (error) {
        next(error);
    }
}

export async function admin_home(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const message = req.session.message;
        req.session.message = null; 
        res.render('admin_home', { message: message, session: req.session});
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

export async function book(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        res.render('book', { session: req.session});
    }
    catch (error) {
        next(error);
    }
}

export async function available_hours(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        res.render('available_hours', { session: req.session});
    }
    catch (error) {
        next(error);
    }
}

export async function extend_membership(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        await model.extendMembership(req.params.customerID, req.params.selectedmembershipID);
        res.render('home', { session: req.session});
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
export async function showPersonalInfoForm(req, res, next) {
    try {
        // Keep track of the previous page
        req.session.previousPage = req.originalUrl;
        // Get the selected gym, class and membership IDs
        const selectedgymID = req.params.selectedgymID;
        const selectedclassID = req.params.selectedclassID;
        const selectedmembershipID = req.params.selectedmembershipID;

        // Get the customer id from the username
        const customer_id = await model.getCustomerIDFromUsername(req.session.loggedUserId);

        // Get the active classes of the customer
        const activeClasses = await model.getActiveClassesIDsFromCustomerID(customer_id);
        let m_flag = false;
        // Check if the selected class is already in the active classes
        for (let i = 0; i < activeClasses.length; i++) {
            if (activeClasses[i].class_id == selectedclassID) {
                m_flag = true;
                break;
            }
        }

        // Get name and expiration date of the membership that the customer already has
        const m_info = await model.getMembershipInfoFromCustomerIDAndClassID(customer_id, selectedclassID);
        const selectedMembershipLength = await model.getMembershipLengthFromID(selectedmembershipID);

        // Render the correct page based on the flag
        if (m_flag) {
            res.render('extend_membership', { m_info: m_info, length: selectedMembershipLength, customerID: customer_id, session: req.session });
        }
        else{
            res.render('personal_info', { gym_id: selectedgymID, class_id: selectedclassID, membership_id: selectedmembershipID, session: req.session });

        }
    }
    catch (error) {
        next(error);
    }
}

//Only loads the template, no connection to the database
export async function showPaymentInfoForm(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const selectedgymID = req.params.selectedgymID;
        const selectedclassID = req.params.selectedclassID;
        const selectedmembershipID = req.params.selectedmembershipID;
        res.render('payment_info', { gym_id: selectedgymID, class_id: selectedclassID, membership_id: selectedmembershipID, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function doPersonalInfo(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;

        // const customerInfo = await model.getCustomerInfo(req.session.loggedUserId);

        const phone_number = req.body.phone_number;
        const address  = req.body.address;
        const city = req.body.city;
        const state = req.body.state;
        const zip_code = req.body.zip_code;
        await model.updatePersonalInfo(req.session.loggedUserId, phone_number, address, city, state, zip_code);

        const selectedgymID = req.params.selectedgymID;
        const selectedclassID = req.params.selectedclassID;
        const selectedmembershipID = req.params.selectedmembershipID;

        res.render('payment_info', { gym_id: selectedgymID, class_id: selectedclassID, membership_id: selectedmembershipID, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function doPaymentInfo(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        
        const ccn = req.body.ccn;
        const exp_date = req.body.exp_date;
        const cvv = req.body.cvv;
        // await model.addPaymentInfo(req.session.loggedUserId, ccn, cvv, exp_date);
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        
        const selectedmembershipID = req.params.selectedmembershipID;
        console.log('selected membership ' + selectedmembershipID);

        await model.buyMembership(customerID, selectedmembershipID);
        console.log('Membership bought');
        res.redirect('/home');
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
        const activeMemberships = await model.getAllActiveMembershipsFromCustomerID(customerInfo.customer_id);
        const inactiveMemberships = await model.getAllInactiveMembershipsFromCustomerID(customerInfo.customer_id);
        // console.log('Active memberships: ', activeMemberships);

        let active_names = [];
        for (let i = 0; i < activeMemberships.length; i++) {
            active_names.push(await model.getClassNameFromMembershipID(activeMemberships[i].membership_id));
        }
        const active_combined = activeMemberships.map((item, i) => {
            return {
                ...item,
                name: active_names[i]
            }
        });

        let inactive_names = [];
        for (let i = 0; i < inactiveMemberships.length; i++) {
            inactive_names.push(await model.getClassNameFromMembershipID(inactiveMemberships[i].membership_id));
        }
        const inactive_combined = inactiveMemberships.map((item, i) => {
            return {
                ...item,
                name: inactive_names[i]
            }
        });

        // console.log('Combined: ', combined);

        res.render('account_page', {customerInfo: customerInfo, session: req.session, active_memberships: active_combined, inactive_memberships: inactive_combined});
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
export async function doContact(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        await model.sendMessage(req.session.loggedUserId, req.body.email, req.body.subject, req.body.message_text);
        req.session.message = "Message sent successfully";
        res.redirect('/home/#contact_form');
    }
    catch (error) {
        next(error);
    }
}




