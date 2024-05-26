import session from 'express-session';
import * as model from '../model/gym-chain-model-sqlite-async.mjs';

//Show the home page
export async function home(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const message = req.session.message;
        req.session.message = null; 

        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        res.render('home', { onlyWeightlifting: onlyWeightlifting, homeGym:homeGym, message: message, session: req.session});
    }
    catch (error) {
        next(error);
    }
}

//Show the Gym Services page
export async function showGymServices(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        //Get the customer ID, the home gym and check if the user has only a weightlifting membership
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        res.render('about_classes', { onlyWeightlifting: onlyWeightlifting, homeGym: homeGym, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

//Extend the membership
export async function extendMembership(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        //Extend the membership
        await model.extendMembership(req.params.customerID, req.params.selectedmembershipID);

        //Redirect to the message page
        const message = 'Membership extended successfully';
        console.log(message);
        req.session.message = message;
        res.redirect('/message');
    }
    catch (error) {
        next(error);
    }
}

//Select home gym
export async function selectGym(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        //Get all the gyms' information
        const gymInfo = await model.getGymsInfo();

        //Get the customer ID and check if the user has only a weightlifting membership
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        res.render('joinNow', { onlyWeightlifting: onlyWeightlifting, gyms: gymInfo, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

//Show the classes of the selected gym
export async function selectClass(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        //Get the selected gym
        const selectedgym = await model.getGymFromLocation(req.params.selectedgym);
        console.log('selected gym '+selectedgym.location);

        //Get the customer ID, the home gym and check if the user has only a weightlifting membership
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        if (!homeGym)
            {
                const gym_obj = await model.getGymFromLocation(selectedgym.location);
                await model.setHomeGym(customerID, gym_obj.gym_id);
            }
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        
        //Get all the classes' information
        const classInfo = await model.getClassesInfo();
        res.render('services', { onlyWeightlifting: onlyWeightlifting, homeGym: homeGym, gym: selectedgym, classes: classInfo, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

//Show the memberships of the selected class
export async function selectMembership(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        //Get the selected gym and class
        const selectedgym = req.params.selectedgym;
        const selectedclass = req.params.selectedclass;
        console.log('selected class ' + selectedclass);

        //Get the membership Information for the selected class (all classes have 3 memberships)
        const class_obj = await model.getClassFromName(selectedclass);
        const membershipsInfo = await model.getMembershipsInfofromClassID(class_obj.class_id);

        //Get the customer ID, the home gym and check if the user has only a weightlifting membership
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        
        res.render('memberships', { onlyWeightlifting: onlyWeightlifting, homeGym:homeGym, gym: selectedgym, class: selectedclass, membershipsInfo: membershipsInfo, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

//Show the personal info form
export async function showPersonalInfoForm(req, res, next) {
    try {
        // Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        // Get the selected gym, class and membership IDs
        const selectedgym = req.params.selectedgym;
        const selectedclass = req.params.selectedclass;

        const selectedmembershipID = req.params.selectedmembershipID;
        console.log('selected membership ' + selectedmembershipID);

        // Get the customer id from the username
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);

        // Get the active classes of the customer
        const activeClasses = await model.getActiveClassesIDsFromCustomerID(customerID);
        let m_flag = false;
        const class_obj = await model.getClassFromName(selectedclass);
        // Check if the selected class is already in the active classes
        for (let i = 0; i < activeClasses.length; i++) {
            if (activeClasses[i].class_id == class_obj.class_id) {
                m_flag = true;
                break;
            }
        }

        // Get name and expiration date of the membership that the customer already has
        
        const m_info = await model.getMembershipInfoFromCustomerIDAndClassID(customerID, class_obj.class_id);
        const selectedMembershipLength = await model.getMembershipLengthFromID(selectedmembershipID);

        
        const homeGym = await model.getHomeGym(customerID);

        // Render the correct page based on the flag
        if (m_flag) {
            res.render('extend_membership', { onlyWeightlifting: onlyWeightlifting, homeGym: homeGym, m_info: m_info, length: selectedMembershipLength, customerID: customerID, session: req.session });
        }
        else{
            res.render('personal_info', { onlyWeightlifting: onlyWeightlifting, homeGym: homeGym, gym: selectedgym, class: selectedclass, membership_id: selectedmembershipID, session: req.session });

        }
    }
    catch (error) {
        next(error);
    }
}

//Update the personal info of the user
export async function doPersonalInfo(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        // const customerInfo = await model.getCustomerInfo(req.session.loggedUserId);

        //Get the personal info from the form
        const phone_number = req.body.phone_number;
        const address  = req.body.address;
        const city = req.body.city;
        const state = req.body.state;
        const zip_code = req.body.zip_code;
        //Update the personal info of the user
        await model.updatePersonalInfo(req.session.loggedUserId, phone_number, address, city, state, zip_code);

        //Get the selected gym, class and membership ID
        const selectedgym = req.params.selectedgym;
        const selectedclass = req.params.selectedclass;
        const selectedmembershipID = req.params.selectedmembershipID;

        //Get the customer ID, the home gym and check if the user has only a weightlifting membership
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);

        res.render('payment_info', { onlyWeightlifting: onlyWeightlifting, homeGym: homeGym, gym: selectedgym, class: selectedclass, membership_id: selectedmembershipID, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

//Buy the membership
export async function doPaymentInfo(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;
        
        //Get the payment info from the form (NOT USED IN THE CURRENT IMPLEMENTATION)
        const ccn = req.body.ccn;
        const exp_date = req.body.exp_date;
        const cvv = req.body.cvv;
        //Store the payment info in the database (NOT USED IN THE CURRENT IMPLEMENTATION)
        // await model.addPaymentInfo(req.session.loggedUserId, ccn, cvv, exp_date);

        //Get the customer ID from the username
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);

        //Get the selected membership ID
        const selectedmembershipID = req.params.selectedmembershipID;
        // const selectedgym = req.params.selectedgym;
        console.log('selected membership ' + selectedmembershipID);
        
        //Buy the membership and redirect to the message page
        await model.buyMembership(customerID, selectedmembershipID);
        const message = 'Membership bought successfully';
        console.log(message);
        req.session.message = message;
        res.redirect('/message');
    }
    catch (error) {
        next(error);
    }
}

//Show the account page of the user
export async function showAccountPage(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        //Get the customer info and the memberships of the user
        const customerInfo = await model.getCustomerInfo(req.session.loggedUserId);
        const activeMemberships = await model.getAllActiveMembershipsFromCustomerID(customerInfo.customer_id);
        const inactiveMemberships = await model.getAllInactiveMembershipsFromCustomerID(customerInfo.customer_id);


        //BAD OLD METHOD WITHOUT JOIN IN SQL
        //Get the names of the classes of the memberships and combine them with the memberships
        // let active_names = [];
        // let active_combined;
        // if (activeMemberships != undefined){
        //     for (let i = 0; i < activeMemberships.length; i++) {
        //         active_names.push(await model.getClassNameFromMembershipID(activeMemberships[i].membership_id));
        //     }
        //      active_combined = activeMemberships.map((item, i) => {
        //         return {
        //             ...item,
        //             name: active_names[i]
        //         }
        //     });
        // }

        // let inactive_names = [];
        // let inactive_combined;
        // if (inactiveMemberships != undefined){
        //     for (let i = 0; i < inactiveMemberships.length; i++) {
        //         inactive_names.push(await model.getClassNameFromMembershipID(inactiveMemberships[i].membership_id));
        //     }
        //     inactive_combined = inactiveMemberships.map((item, i) => {
        //         return {
        //             ...item,
        //             name: inactive_names[i]
        //         }
        //     });
        // }
        
        //Get the home gym of the user and check if the user has only a weightlifting membership
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        res.render('account_page', {onlyWeightlifting: onlyWeightlifting, homeGym:homeGym, customerInfo: customerInfo, session: req.session, active_memberships: activeMemberships, inactive_memberships: inactiveMemberships});
    }
    catch (error) {
        next(error);    
    }
}

//Send the message of the contact form to the database
export async function doContact(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;
        //Send the message to the database
        await model.sendMessage(req.session.loggedUserId, req.body.email, req.body.subject, req.body.message_text);

        //Redirect to the home page with a message
        req.session.message = "Message sent successfully";
        res.redirect('/home/#contact_form');
    }
    catch (error) {
        next(error);
    }
}

export async function showBookSchedule(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;
        
        //Get the home gym and the memberships of the user
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const memberships = await model.getAllActiveMembershipsFromCustomerID(customerID);
        
        //If the user has memberships, show the schedule
        if (memberships) {
            // Setting every letter to lowercase and then capitalizing the first letter of each word
            let homeGymName = homeGym.location;
            homeGymName = homeGymName.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

            //Clear the schedule of the user
            await model.clearSchedule(customerID);

            //Get the bookable sessions of the user
            const schedule = await model.getBookableSessions(customerID, homeGymName);

            //Get the time slots and days
            const timeSlots = ['09:00', '10:00', '11:00','12:00', '13:00', '14:00', '15:00', '16:00', '17:00',  '18:00', '19:00', '20:00', '21:00']; 
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const message = req.session.message;
            req.session.message = null;
            
            res.render('schedule', { message: message, homeGym:homeGym, view: false, timeSlots:timeSlots, days: days, schedule: schedule, session: req.session });
        }
        //If the user has no memberships, show a message
        else {
            const message = 'You have no memberships. Please buy a membership to create a schedule.';
            console.log(message);
            req.session.message = message;
            res.redirect('/message');
        }
        

    }
    catch (error) {
        next(error);
    }
}

//Book the selected sessions
export async function doBookSchedule(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        //Get the selected sessions
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const sessionIDs = req.body.sessionIDs.split(',');
        console.log('selected sessionIDs: ' + sessionIDs);
        //If no sessions are selected, redirect to the schedule page with a message
        if (sessionIDs == null || sessionIDs == '') {
            req.session.message = 'You have to select at least one session';
            res.redirect('/schedule');

        }
        //Else book the selected sessions and show the schedule
        else {
            for (let i = 0; i < sessionIDs.length; i++) {
            
                await model.bookSession(customerID, parseInt(sessionIDs[i]));
                
            }
            res.redirect('/customer_schedule');
            
        }
        
    }
    catch (error) {
        next(error);
    }
}

//View the schedule of the user (bookings)
export async function viewSchedule(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        //Get the schedule of the user
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const schedule = await model.getBookings(customerID);

        //Get the time slots and days
        const timeSlots = ['09:00', '10:00', '11:00','12:00', '13:00', '14:00', '15:00', '16:00', '17:00',  '18:00', '19:00', '20:00', '21:00']; 
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        //Get the home gym of the user
        const homeGym = await model.getHomeGym(customerID);

        //Get the memberships of the user
        const memberships = await model.getAllActiveMembershipsFromCustomerID(customerID);
        res.render('schedule', { memberships: memberships, homeGym:homeGym, view: true, timeSlots:timeSlots, days: days, schedule: schedule, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

//Delete the memberships and the related sessions
export async function deleteMembership(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        //Get the customer ID from the username
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);

        //Delete the membership and the related sessions from the database
        await model.deleteMembership(customerID, req.params.membershipID);
        res.redirect('/account_page');
    }
    catch (error) {
        next(error);
    }
}

//Message page
export async function showMessage(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        //Store the message in a variable and clear the session message
        const message = req.session.message;
        req.session.message = null;

        //Get the home gym of the user and check if the user has only a weightlifting membership
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);

        res.render('message', {onlyWeightlifting: onlyWeightlifting, homeGym: homeGym,  message: message, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

//Show the general schedule of the gym
export async function showGeneralSchedule(req, res, next) {
    try {
        //Keep track of the previous page
        req.session.previousPage = req.originalUrl;

        //Get the home gym of the user
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);

        let schedule;
        //If the user has no home gym, show the schedule of the selected gym
        if (homeGym == undefined) {
            let location = req.params.selectedgym;
            location = location.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
            schedule = await model.getSchedule(location);
        }
        //If the user has a home gym, show the schedule of the home gym
        else {
            let location = homeGym.location;
            location = location.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
            schedule = await model.getSchedule(location);
        }
        //Get the time slots and days
        const timeSlots = ['09:00', '10:00', '11:00','12:00', '13:00', '14:00', '15:00', '16:00', '17:00',  '18:00', '19:00', '20:00', '21:00']; 
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        //Check if the user has only a weightlifting membership
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        res.render('gymLab_schedule', {selectedGym: req.params.selectedgym, onlyWeightlifting: onlyWeightlifting, homeGym: homeGym, timeSlots:timeSlots, days: days, schedule: schedule, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

//For testing error handling
export async function showError(req, res, next) {
    try {
        res.render('message', {message: "Oops something went wrong!", error: true, session: req.session});
    }
    catch (error) {
        next(error);
    }
}


