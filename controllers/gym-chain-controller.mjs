import session from 'express-session';
import * as model from '../model/gym-chain-model-sqlite-async.mjs';

export async function home(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const message = req.session.message;
        req.session.message = null; 

        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        // console.log(homeGym);
        res.render('home', { homeGym:homeGym, message: message, session: req.session});
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
        res.render('about_classes', { homeGym: homeGym, session: req.session });
    }
    catch (error) {
        next(error);
    }
}

export async function showBookForm(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const classes = await model.getClassesInfoOfCustomer(customerID);
        const clubs = await model.getGymsInfo();
        const homeGym = await model.getHomeGym(customerID);
        res.render('book', { homeGym:homeGym, classes: classes, clubs: clubs, session: req.session});
    }
    catch (error) {
        next(error);
    }
}

export async function doBookForm(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const className = req.body.class_id
        const classLocation = req.body.gym_id.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        const classDate = req.body.date_name;
        const dayName = model.getdayNamefromDate(classDate);
        const capitalDayName = dayName.toUpperCase();
        const classID = await model.getClassIDFromName(className);
        const hours = await model.getTimesFromClassClubDay(classID, classLocation, dayName);
        //NEEDS CHECK TO SEE IF SESSIONID IS FULL OR THE CUSTOMER ALREADY HAS THIS SESSION BOOKED
        res.render('available_hours', { className: className, classLocation: classLocation, classDate: classDate, dayName: capitalDayName, hours: hours, session: req.session});
    }
    catch (error) {
        next(error);
    }
}

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

export async function doTimesForm(req, res, next) {
    try {
        req.session.previousPage = req.originalUrl;
        const classDate = req.params.classDate;
        const classLocation = req.params.classLocation;
        const classTime = req.body.time;
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const sessionID = await model.getSessionIDfromLocationDayTime(classLocation, classDate, classTime);
        //NEEDS CHECK TO SEE IF SESSIONID IS FULL OR THE CUSTOMER ALREADY HAS THIS SESSION BOOKED
        await model.bookSession(customerID, sessionID);
        res.render('home', { session: req.session});
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
        console.log('here')
        const selectedmembershipID = req.params.selectedmembershipID;
        const selectedgymID = req.params.selectedgymID;
        console.log('selected membership ' + selectedmembershipID);

        await model.setHomeGym(customerID, selectedgymID);
        await model.buyMembership(customerID, selectedmembershipID);
        console.log('Membership bought');
        res.redirect('/home');
    }
    catch (error) {
        next(error);
    }
}
// NEEDS BETTER CSS
export async function showAccountPage(req, res, next) {
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
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        res.render('account_page', {homeGym:homeGym, customerInfo: customerInfo, session: req.session, active_memberships: active_combined, inactive_memberships: inactive_combined});
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

export async function showSchedule(req, res, next) {
    try{
        
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const homeGym = await model.getHomeGym(customerID);
        // Setting every letter to lowercase and then capitalizing the first letter of each word
        let homeGymName = homeGym.location;
        homeGymName = homeGymName.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        const schedule = await model.getCustomerScheduleFromCustomerIDAndLocation(customerID, homeGymName);
        const timeSlots = ['09:00', '10:00', '11:00','12:00', '13:00', '14:00', '15:00', '16:00', '17:00',  '18:00', '19:00', '20:00']; 
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // const groupedData = schedule.reduce((acc, curr) => {
        //     const time = curr.time;
        //     const day = curr.day;
        //     if (!acc[time]) {
        //         acc[time] = {};
        //     }
        //     if (!acc[time][day]) {
        //         acc[time][day] = [];
        //     }
        //     acc[time][day].push(curr);
        //     return acc;
        // }, {});
        
        // // Convert the grouped data into an array format suitable for Handlebars
        // const timeSlots = Object.keys(groupedData);
        // const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // const preparedData = timeSlots.map(time => ({
        //     time,
        //     days: days.map(day => ({
        //         day,
        //         classes: groupedData[time][day] || []
        //     }))
        // }));
        

        
        
        res.render('schedule', { homeGym:homeGym, view: false, timeSlots:timeSlots, days: days, schedule: schedule, session: req.session });
        // res.render('schedule', { schedule: preparedData, session: req.session });
    }
    catch (error) {
        next(error);
    }
    
}

export async function viewSchedule(req, res, next) {
    try {
        const customerID = await model.getCustomerIDFromUsername(req.session.loggedUserId);
        const schedule = await model.getBookings(customerID);
        const timeSlots = ['09:00', '10:00', '11:00','12:00', '13:00', '14:00', '15:00', '16:00', '17:00',  '18:00', '19:00', '20:00']; 
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const homeGym = await model.getHomeGym(customerID);
        res.render('schedule', { homeGym:homeGym, view: true, timeSlots:timeSlots, days: days, schedule: schedule, session: req.session });
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


