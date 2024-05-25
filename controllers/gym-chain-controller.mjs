import session from 'express-session';
import * as model from '../model/gym-chain-model-sqlite-async.mjs';

export async function home(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const message = req.session.message;
        req.session.message = null; 

        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        // console.log(homeGym);
        res.render('home', { onlyWeightlifting: onlyWeightlifting, homeGym:homeGym, message: message, session: req.session});
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
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        res.render('about_classes', { onlyWeightlifting: onlyWeightlifting, homeGym: homeGym, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

// export async function showBookForm(req, res, next) {
//     try {
//         req.session.previousPage = req.originalUrl;
//         const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
//         const classes = await model.getClassesInfoOfCustomer(customerID);
//         const clubs = await model.getGymsInfo();
//         const homeGym = await model.getHomeGym(customerID);
//         res.render('book', { homeGym:homeGym, classes: classes, clubs: clubs, session: req.session});
//     }
//     catch (error) {
//         next(error);
//     }
// }

// export async function doBookForm(req, res, next) {
//     try {
//         req.session.previousPage = req.originalUrl;
//         const className = req.body.class_id
//         const classLocation = req.body.gym_id.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
//         const classDate = req.body.date_name;
//         const dayName = model.getdayNamefromDate(classDate);
//         const capitalDayName = dayName.toUpperCase();
//         const classID = await model.getClassIDFromName(className);
//         const hours = await model.getTimesFromClassClubDay(classID, classLocation, dayName);
//         //NEEDS CHECK TO SEE IF SESSIONID IS FULL OR THE CUSTOMER ALREADY HAS THIS SESSION BOOKED
//         res.render('available_hours', { className: className, classLocation: classLocation, classDate: classDate, dayName: capitalDayName, hours: hours, session: req.session});
//     }
//     catch (error) {
//         next(error);
//     }
// }

// export async function showTimesForm(req, res, next) {
//     try {
//         req.session.previousPage = req.originalUrl;
//         const className = req.body.class_id;
//         const classLocation = req.body.gym_id.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
//         const classDate = req.body.date_name;
//         const dayName = model.getdayNamefromDate(classDate);
//         const capitalDayName = dayName.toUpperCase();
//         console.log('1class: ' + className + ' date: ' + classDate + ' location: ' + classLocation);
//         const classID = await model.getClassIDFromName(className);
//         const hours = await model.getTimesFromClassClubDay(classID, className, classDate);

//         res.render('available_hours', { className: className, classLocation: classLocation, classDate: classDate, dayName: capitalDayName, hours: hours, session: req.session});
//     }
//     catch (error) {
//         next(error);
//     }
// }

// export async function doTimesForm(req, res, next) {
//     try {
//         req.session.previousPage = req.originalUrl;
//         const classDate = req.params.classDate;
//         const classLocation = req.params.classLocation;
//         const classTime = req.body.time;
//         const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
//         const sessionID = await model.getSessionIDfromLocationDayTime(classLocation, classDate, classTime);
//         //NEEDS CHECK TO SEE IF SESSIONID IS FULL OR THE CUSTOMER ALREADY HAS THIS SESSION BOOKED
//         await model.bookSession(customerID, sessionID);
//         res.render('home', { session: req.session});
//     }
//     catch (error) {
//         next(error);
//     }
// }

export async function extend_membership(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        await model.extendMembership(req.params.customerID, req.params.selectedmembershipID);
        res.redirect('/home');
    }
    catch (error) {
        next(error);
    }
}

export async function selectGym(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const gymInfo = await model.getGymsInfo();
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        res.render('joinNow', { onlyWeightlifting: onlyWeightlifting, gyms: gymInfo, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function selectClass(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const selectedgym = await model.getGymFromLocation(req.params.selectedgym);
        console.log('selected gym '+selectedgym.location);

        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        if (!homeGym)
            {
                const gym_obj = await model.getGymFromLocation(selectedgym.location);
                await model.setHomeGym(customerID, gym_obj.gym_id);
            }
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);

        const classInfo = await model.getClassesInfo();
        res.render('services', { onlyWeightlifting: onlyWeightlifting, homeGym: homeGym, gym: selectedgym, classes: classInfo, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function selectMembership(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const selectedgym = req.params.selectedgym;
        const selectedclass = req.params.selectedclass;
        console.log('selected class ' + selectedclass);

        //Get the membership Information for the selected class (all classes have 3 memberships)
        const class_obj = await model.getClassFromName(selectedclass);
        const membershipsInfo = await model.getMembershipsInfofromClassID(class_obj.class_id);

        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        
        res.render('memberships', { onlyWeightlifting: onlyWeightlifting, homeGym:homeGym, gym: selectedgym, class: selectedclass, membershipsInfo: membershipsInfo, session: req.session });
    }
    catch (error) {
        next(error);
    }
}


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
        // Check if the selected class is already in the active classes
        for (let i = 0; i < activeClasses.length; i++) {
            if (activeClasses[i].class_id == selectedclass) {
                m_flag = true;
                break;
            }
        }

        // Get name and expiration date of the membership that the customer already has
        const class_obj = await model.getClassFromName(selectedclass);
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

//Only loads the template, no connection to the database
// export async function showPaymentInfoForm(req, res, next) {
//     try {
//         req.session.previousPage = req.originalUrl;
//         const selectedgymID = req.params.selectedgymID;
//         const selectedclassID = req.params.selectedclassID;
//         const selectedmembershipID = req.params.selectedmembershipID;
//         res.render('payment_info', { gym_id: selectedgymID, class_id: selectedclassID, membership_id: selectedmembershipID, session: req.session });
//     }
//     catch (error) {
//         next(error);
//     }
// }

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

        const selectedgym = req.params.selectedgym;
        const selectedclass = req.params.selectedclass;
        const selectedmembershipID = req.params.selectedmembershipID;

        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);

        res.render('payment_info', { onlyWeightlifting: onlyWeightlifting, homeGym: homeGym, gym: selectedgym, class: selectedclass, membership_id: selectedmembershipID, session: req.session });
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
        const selectedgym = req.params.selectedgym;

        console.log('selected membership ' + selectedmembershipID);
        
            
        await model.buyMembership(customerID, selectedmembershipID);
        console.log('Membership bought');
        res.redirect('/home');
    }
    catch (error) {
        next(error);
    }
}

export async function showAccountPage(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const customerInfo = await model.getCustomerInfo(req.session.loggedUserId);
        const activeMemberships = await model.getAllActiveMembershipsFromCustomerID(customerInfo.customer_id);
        const inactiveMemberships = await model.getAllInactiveMembershipsFromCustomerID(customerInfo.customer_id);

        let active_names = [];
        let active_combined;
        if (activeMemberships != undefined){
            for (let i = 0; i < activeMemberships.length; i++) {
                active_names.push(await model.getClassNameFromMembershipID(activeMemberships[i].membership_id));
            }
             active_combined = activeMemberships.map((item, i) => {
                return {
                    ...item,
                    name: active_names[i]
                }
            });
        }
        let inactive_names = [];
        let inactive_combined;
        if (inactiveMemberships != undefined){
            for (let i = 0; i < inactiveMemberships.length; i++) {
                inactive_names.push(await model.getClassNameFromMembershipID(inactiveMemberships[i].membership_id));
            }
            const inactive_combined = inactiveMemberships.map((item, i) => {
                return {
                    ...item,
                    name: inactive_names[i]
                }
            });
        }
        // console.log('Combined: ', combined);
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        res.render('account_page', {onlyWeightlifting: onlyWeightlifting, homeGym:homeGym, customerInfo: customerInfo, session: req.session, active_memberships: active_combined, inactive_memberships: inactive_combined});
    }
    catch (error) {
        next(error);    
    }
}

//Has to be lead somewhere (mallon skip)
export async function showAboutPage(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        res.render('about_page', { session: req.session });
    }
    catch (error) {
        next(error);
    }
}

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

export async function showBookSchedule(req, res, next) {
    try {
        
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        const memberships = await model.getAllActiveMembershipsFromCustomerID(customerID);

        if (memberships) {
            // Setting every letter to lowercase and then capitalizing the first letter of each word
            let homeGymName = homeGym.location;
            homeGymName = homeGymName.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
            await model.clearSchedule(customerID);
            const schedule = await model.getBookableSessions(customerID, homeGymName);
            const timeSlots = ['09:00', '10:00', '11:00','12:00', '13:00', '14:00', '15:00', '16:00', '17:00',  '18:00', '19:00', '20:00', '21:00']; 
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const message = req.session.message;
            req.session.message = null;
            
            res.render('schedule', { message: message, homeGym:homeGym, view: false, timeSlots:timeSlots, days: days, schedule: schedule, session: req.session });
        }
        else {
            req.session.message = 'You have to buy a membership first';
            res.redirect('/message');
        }
        

    }
    catch (error) {
        next(error);
    }
}

export async function doBookSchedule(req, res, next) {
    try {
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const sessionIDs = req.body.sessionIDs.split(',');
        console.log('selected sessionIDs: ' + sessionIDs);
        if (sessionIDs == null || sessionIDs == '') {
            req.session.message = 'You have to select at least one session';
            res.redirect('/schedule');

        }
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

export async function viewSchedule(req, res, next) {
    try {
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const schedule = await model.getBookings(customerID);
        const timeSlots = ['09:00', '10:00', '11:00','12:00', '13:00', '14:00', '15:00', '16:00', '17:00',  '18:00', '19:00', '20:00', '21:00']; 
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const homeGym = await model.getHomeGym(customerID);
        const memberships = await model.getAllActiveMembershipsFromCustomerID(customerID);
        res.render('schedule', { memberships: memberships, homeGym:homeGym, view: true, timeSlots:timeSlots, days: days, schedule: schedule, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function deleteMembership(req, res, next) {
    try {
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        await model.deleteMembership(customerID, req.params.membershipID);
        // console.log(req.params.membershipID);
        // console.log('Membership deleted');
        res.redirect('/account_page');
    }
    catch (error) {
        next(error);
    }
}

export async function showMessage(req, res, next) {
    try {
        const message = req.session.message;
        req.session.message = null;
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        res.render('message', {homeGym: homeGym,  message: message, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function showGeneralSchedule(req, res, next) {
    try {
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);

        let schedule;
        if (homeGym == undefined) {
            let location = req.params.selectedgym;
            location = location.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

            schedule = await model.getSchedule(location);
        }
        else {
            let location = homeGym.location;
            location = location.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
            schedule = await model.getSchedule(location);
        }
        const timeSlots = ['09:00', '10:00', '11:00','12:00', '13:00', '14:00', '15:00', '16:00', '17:00',  '18:00', '19:00', '20:00', '21:00']; 
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const onlyWeightlifting = await model.checkIfUserHasWeightliftingOnly(customerID);
        res.render('gymLab_schedule', {onlyWeightlifting: onlyWeightlifting, homeGym: homeGym, timeSlots:timeSlots, days: days, schedule: schedule, session: req.session });
    }
    catch (error) {
        next(error);
    }
}


