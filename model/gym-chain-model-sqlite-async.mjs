'use strict';
import { Database } from 'sqlite-async';
import bcrypt from 'bcrypt';

let sql;

// Connect to the database
try {
    sql = await Database.open('data/gym_chain1.db');
    console.log('Connected to the gym-chain database.');
} 
catch (error) {
    throw Error('Error connecting to the database: ' + error);
}

//Get the memberships for the selected class (all classes have 3 memberships)
export let getMembershipsInfofromClassID = async function (classID) {
    // Get the membership IDs for the selected class
    const stmt = await sql.prepare("SELECT MEMBERSHIP.membership_id, MEMBERSHIP.cost, CLASS.class_id, CLASS.name, MEMBERSHIP.length FROM MEMBERSHIP JOIN CLASS JOIN INCLUDES ON MEMBERSHIP.membership_id = INCLUDES.membership_id AND INCLUDES.class_id = CLASS.class_id WHERE CLASS.class_id = ?");

    // Get the membership info for each membership ID
    // const stmt2 = await sql.prepare("SELECT * FROM Membership WHERE membership_id = ?");
    try {
        // const membershipsIDs = await stmt.all(classID);
        // let membershipsInfo = [];
        // for (let i = 0; i < membershipsIDs.length; i++) {
        //     const membershipInfo = await stmt2.get(membershipsIDs[i].membership_id);
        //     membershipsInfo[i] = membershipInfo;
        // }

        const membershipsInfo = await stmt.all(classID);
        return membershipsInfo;
    } 
    catch (err) {
        throw err;
    }
}

//Get all the purchaseIDS of the customer for a specific membershipID
export let getPurchaseIDs = async function (customerID, membershipID) {
    const stmt = await sql.prepare("SELECT purchase_id FROM BUYS WHERE customer_id = ? AND membership_id = ?");
    try {
        const purchaseID = await stmt.all(customerID, membershipID);

        // If the customer has no memberships
        if (purchaseID.length === 0) {
            return undefined;
        }
        // If the customer has only one membership
        else if (purchaseID.length === 1) {
            return purchaseID[0].purchase_id;
        }
        // If the customer has more than one membership
        else {
            return purchaseID;
        }
    } 
    catch (err) {
        throw err;
    }
}

//Return the first user found with the given username
export let getUserByUsername = async (username) => {
    
    const stmt = await sql.prepare("SELECT username, password, role FROM User WHERE username = ?");
    
    try {
        const user = await stmt.all(username);
        return user[0];
    } 
    catch (err) {
        throw err;
    }
}

//Create a new user
export let registerUser = async function (fname, lname, username, password, email) {
    // ελέγχουμε αν υπάρχει χρήστης με αυτό το username
    const userId = await getUserByUsername(username);

    //If the user already exists
    if (userId != undefined) {
        return { message: "Υπάρχει ήδη χρήστης με αυτό το όνομα" };
    } 
    //If the user does not exist
    else {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Add to Customer table
            const customerStmt = await sql.prepare('INSERT INTO Customer (username, fname, lname, email) VALUES (?, ?, ?, ?)');
            await customerStmt.run(username, fname, lname, email);
            
            // Add to User table
            const stmt = await sql.prepare('INSERT INTO user VALUES (?, ?, "customer")');
            const info = await stmt.run(username, hashedPassword);

            return info.lastID;
        } 
        catch (error) {
            throw error;
        }
    }
}

//Get all the information of the gyms
export let getGymsInfo = async function () {
    const stmt = await sql.prepare("SELECT * FROM Gym");
    try {
        const gyms = await stmt.all();
        return gyms;
    } 
    catch (err) {
        throw err;
    }
}

//Get all the information of the classes
export let getClassesInfo = async function () {
    const stmt = await sql.prepare("SELECT * FROM Class");
    try {
        const classes = await stmt.all();
        return classes;
    } 
    catch (err) {
        throw err;
    }
}

//Get all the information of the memberships
export let getMembershipsInfo = async function () {
    const stmt = await sql.prepare("SELECT * FROM Membership");
    try {
        const memberships = await stmt.all();
        return memberships;
    } 
    catch (err) {
        throw err;
    }
}

//Get the information of the membership with the given ID
export let getMembershipInfofromID = async function (membershipID) {
    const stmt = await sql.prepare("SELECT * FROM Membership WHERE membership_id = ?");
    try {
        const membership = await stmt.get(membershipID);

        return membership;
    }
    catch (err) {
        throw err;
    }
}

//Get the customer ID from the username
export let getCustomerIDFromUsername = async function (username) {
    
    const stmt = await sql.prepare("SELECT customer_id FROM Customer WHERE username = ?");
    try {
        // If the user is a visitor
        if (username === 'visitor') {
            return undefined;
        }
        else if (username === undefined) {
            return undefined;
        }
        const customerID = await stmt.get(username);
        return customerID.customer_id;
    } 
    catch (err) {
        throw err;
    }
}

//Get the information of the customer with the given username
export let getCustomerInfo = async function (username) {
    const stmt = await sql.prepare("SELECT * FROM Customer WHERE username = ?");
    try {
        const customerInfo = await stmt.get(username);
        return customerInfo;
    } 
    catch (err) {
        throw err;
    }
}

//Update the personal information of the customer
export let updatePersonalInfo = async function (username, phone_number, address, city, state, zip_code) {
    const stmt = await sql.prepare("UPDATE Customer SET phone_number = ?, address = ?, city = ?, state = ?, zip_code = ? WHERE username = ?");
    try {
        await stmt.run(phone_number, address, city, state, zip_code, username);
    } 
    catch (err) {
        throw err;
    }
}

//Buy a membership
export let buyMembership = async function (customerID, membershipID) {
    const membershipInfo = await getMembershipInfofromID(membershipID);
    const current_date = new Date();
    const start_date = current_date.toISOString().split('T')[0];

    let additional_days = 0;
    if (membershipInfo.length === 1) {
        additional_days = 30;
    }
    else if (membershipInfo.length === 2) {
        additional_days = 6 * 30;
    }
    else {
        additional_days = 12 * 30;
    }

    current_date.setDate(current_date.getDate() + additional_days);
    const exp_date = current_date.toISOString().split('T')[0];
    
    const stmt = await sql.prepare("INSERT INTO BUYS (membership_id, customer_id, start_date, exp_date) VALUES (?, ?, ?, ?)");
    try {
        await stmt.run(membershipID, customerID, start_date, exp_date);
    } 
    catch (err) {
        throw err;
    }
}

//Extend the membership
export let extendMembership = async function (customerID, membershipID) {

    try {

        const purchaseID = await getPurchaseIDs(customerID, membershipID);
        
        const exp_date = await getExpDate(customerID, membershipID, purchaseID);
        const oldExpDate = stringToDate(exp_date);
        
        const membershipLength = await getMembershipLengthFromID(membershipID);
        const length = membershipLength;
        console.log('Membership length: ', length);
        let additional_days = 0;
        if (length === 1) {
            additional_days = 30;
        }
        else if (length === 2) {
            additional_days = 6 * 30;
        }
        else {
            additional_days = 12 * 30;
        }

        oldExpDate.setDate(oldExpDate.getDate() + additional_days);
        const new_exp_date = DateToString(oldExpDate);
        // console.log('New exp date: ', new_exp_date);
        const stmt2 = await sql.prepare("UPDATE BUYS SET exp_date = ? WHERE customer_id = ? AND membership_id = ? AND purchase_id = ?");
        await stmt2.run(new_exp_date, customerID, membershipID, purchaseID);
    } 
    catch (err) {
        throw err;
    }
}

//Get expiration date of the membership
export let getExpDate = async function (customerID, membershipID, purchaseID) {
    const stmt = await sql.prepare("SELECT exp_date FROM BUYS WHERE customer_id = ? AND membership_id = ? AND purchase_id = ?");
    try {
        const exp_date_obj = await stmt.get(customerID, membershipID, purchaseID);
        return exp_date_obj.exp_date;
    } 
    catch (err) {
        throw err;
    }
}

//Convert the Date object to a string
export let DateToString = function (date) {
    return date.toISOString().split('T')[0];
}

//Convert the string to a Date object
export let stringToDate = function (dateString) {
    const listDate = dateString.split('-');
    const date = new Date(listDate[0], listDate[1]-1, listDate[2]);
    return date;
}

//Get the membership length with the given ID
export let getMembershipLengthFromID = async function (membershipID) {
    const stmt = await sql.prepare("SELECT length FROM Membership WHERE membership_id = ?");
    try {
        const length = await stmt.get(membershipID);
        return length.length;
    } 
    catch (err) {
        throw err;
    }
}

//Send the message to the database
export let sendMessage = async function (username, email, subject, message_text) {
    const stmt = await sql.prepare("INSERT INTO Message (customer_id, email, subject, message_text) VALUES (?, ?, ?, ?)");
    try {
        const customerID = await getCustomerIDFromUsername(username);
        //If the user is a visitor
        if (customerID === undefined) {
            await stmt.run(null, email, subject, message_text);
        }
        //If the user is a customer
        else {
            await stmt.run(customerID, email, subject, message_text);
        }
    } 
    catch (err) {
        throw err;
    }
}

export let getAllActiveMembershipsFromCustomerID = async function (customerID) {
    const stmt = await sql.prepare("SELECT BUYS.membership_id, BUYS.customer_id, BUYS.purchase_id, BUYS.start_date, BUYS.exp_date, CLASS.class_id, CLASS.name FROM BUYS JOIN CLASS JOIN INCLUDES ON CLASS.class_id = INCLUDES.class_id and BUYS.membership_id = INCLUDES.membership_id WHERE customer_id = ? AND exp_date > date('now')");
    try {
        const memberships = await stmt.all(customerID);

        //If the customer has no active memberships
        if (memberships.length === 0) {
            return undefined;
        }
        else {
            return memberships;
        }
    } 
    catch (err) {
        throw err;
    }
}

export let getAllInactiveMembershipsFromCustomerID = async function (customerID) {
    const stmt = await sql.prepare("SELECT BUYS.membership_id, BUYS.customer_id, BUYS.purchase_id, BUYS.start_date, BUYS.exp_date, CLASS.class_id, CLASS.name FROM BUYS JOIN CLASS JOIN INCLUDES ON CLASS.class_id = INCLUDES.class_id and BUYS.membership_id = INCLUDES.membership_id WHERE customer_id = ? AND exp_date < date('now')");
    try {
        const memberships = await stmt.all(customerID);
        if (memberships.length === 0) {
            return undefined;
        }
        else {
            return memberships;
        }
    } 
    catch (err) {
        throw err;
    }
}

//Get the class IDs of the active memberships of the customer
export let getActiveClassesIDsFromCustomerID = async function (customerID) {
    const stmt  = await sql.prepare("SELECT INCLUDES.class_id FROM BUYS INNER JOIN INCLUDES ON BUYS.membership_id=INCLUDES.membership_id WHERE customer_id = ? and BUYS.exp_date > date('now')");
    try {
        const classes = await stmt.all(customerID);
        return classes;
    } 
    catch (err) {
        throw err;
    }
}

export let getMembershipInfoFromCustomerIDAndClassID = async function (customerID, classID) {
    const stmt = await sql.prepare("SELECT CLASS.name, BUYS.exp_date, MEMBERSHIP.length, MEMBERSHIP.membership_id FROM MEMBERSHIP JOIN CLASS JOIN INCLUDES JOIN BUYS ON MEMBERSHIP.membership_id = INCLUDES.membership_id AND CLASS.class_id = INCLUDES.class_id AND MEMBERSHIP.membership_id = BUYS.membership_id WHERE customer_id = ? AND CLASS.class_id = ?");
    try {
        const info = await stmt.get(customerID, classID);
        return info;
    }
    catch (err) {
        throw err;
    }
}

//Get the schedule of a specific location
export let getSchedule = async function (location) {
    const stmt = await sql.prepare("SELECT REPRESENTS.session_id, SESSION.day, SESSION.time, REPRESENTS.class_id, CLASS.name, SESSION.location FROM SESSION JOIN REPRESENTS JOIN CLASS ON SESSION.session_id = REPRESENTS.session_id AND CLASS.class_id = REPRESENTS.class_id WHERE location = ?");
    
    try {
        const schedule = await stmt.all(location);
        return schedule;
    }
    catch (err) {
        throw err;
    }

}

//Get the booked sessions for the customer
export let getBookings = async function (customerID) {
    const stmt = await sql.prepare("SELECT CLASS.name, SESSION.location, SESSION.session_id, SESSION.day, SESSION.time, BOOKS.customer_id FROM BOOKS JOIN SESSION JOIN CLASS JOIN REPRESENTS ON SESSION.session_id = BOOKS.session_id AND CLASS.class_id = REPRESENTS.class_id AND REPRESENTS.session_id = SESSION.session_id WHERE BOOKS.customer_id = ?");
    try {
        const bookings = await stmt.all(customerID);
        return bookings;
    }
    catch (err) {
        throw err;
    }
}

//Book a session
export let bookSession = async function (customerID, sessionId) {
    const stmt = await sql.prepare("INSERT INTO BOOKS (customer_id, session_id) VALUES (?, ?)");
    try {
        await stmt.run(customerID, sessionId);
    }
    catch (err) {
        throw err;
    }
}

//Get the day name from the date
export let getDayNamefromDate = function (date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = new Date(date).getDay();
    return days[day];
}

//Get the bookable sessions for the customer
export let getBookableSessions = async function (customerID, location) {
    const stmt = await sql.prepare("WITH BookableSessions AS (SELECT SESSION.session_id FROM SESSION LEFT JOIN BOOKS ON SESSION.session_id = BOOKS.session_id GROUP BY SESSION.session_id, SESSION.capacity HAVING COUNT(BOOKS.session_id) < SESSION.capacity )SELECT SESSION.session_id, CUSTOMER.customer_id, SESSION.day, SESSION.time, CLASS.name, SESSION.location FROM CUSTOMER JOIN BUYS ON CUSTOMER.customer_id = BUYS.customer_id JOIN INCLUDES ON INCLUDES.membership_id = BUYS.membership_id JOIN REPRESENTS ON INCLUDES.class_id = REPRESENTS.class_id JOIN CLASS ON CLASS.class_id = REPRESENTS.class_id JOIN SESSION ON SESSION.session_id = REPRESENTS.session_id JOIN BookableSessions ON SESSION.session_id = BookableSessions.session_id WHERE CUSTOMER.customer_id = ? AND SESSION.location = ? AND BUYS.exp_date > date('now');")
    try {
        const schedule = await stmt.all(customerID, location);
        return schedule;
    }
    catch (err) {
        throw err;
    }
}

//Set the home gym of the customer
export let setHomeGym = async function (customerID, gymId) {
    const stmt = await sql.prepare("INSERT INTO BELONGS (customer_id, gym_id) VALUES (?, ?)");
    try {
        await stmt.run(customerID, gymId);
    }
    catch (err) {
        throw err;
    }
}

//Get the home gym of the customer
export let getHomeGym = async function (customerID) {
    const stmt = await sql.prepare("SELECT BELONGS.gym_id, GYM.location FROM BELONGS JOIN GYM ON BELONGS.gym_id = GYM.gym_id WHERE customer_id = ?");
    try {
        const gym = await stmt.get(customerID);
        if (gym === undefined) {
            return undefined;
        }
        else {
            return gym;
        }
    }
    catch (err) {
        throw err;
    }
}

//Delete a membership of a customer
export let deleteMembership = async function (customerID, membershipID) {
    const stmt = await sql.prepare("DELETE FROM BUYS WHERE customer_id = ? AND membership_id = ? AND exp_date > date('now')");
    const stmt2 = await sql.prepare("DELETE FROM BOOKS WHERE customer_id = ? AND session_id IN (SELECT session_id FROM REPRESENTS WHERE class_id IN (SELECT class_id FROM INCLUDES WHERE membership_id = ?))");
    try {
        await stmt.run(customerID, membershipID);
        await stmt2.run(customerID, membershipID);
    }
    catch (err) {
        throw err;
    }
}

//Clear the schedule of the customer
export let clearSchedule = async function (customerID) {
    const stmt = await sql.prepare("DELETE FROM BOOKS WHERE customer_id = ?");
    try {
        await stmt.run(customerID);
    }
    catch (err) {
        throw err;
    }
}

//Get gym info from the location
export let getGymFromLocation = async function (location) {
    const stmt = await sql.prepare("SELECT * FROM GYM WHERE location = ?");
    try {
        const gym = await stmt.get(location);
        return gym;
    }
    catch (err) {
        throw err;
    }
}

//Get the class info from the name
export let getClassFromName = async function (name) {
    const stmt = await sql.prepare("SELECT * FROM CLASS WHERE name = ?");
    try {
        const classInfo = await stmt.get(name);
        return classInfo;
    }
    catch (err) {
        throw err;
    }
}

//Get the membership info from the id
export let getMembershipFromMembershipID = async function (membershipID) {
    const stmt = await sql.prepare("SELECT * FROM MEMBERSHIP WHERE membership_id = ?");
    try {
        const membership = await stmt.get(membershipID);
        return membership;
    }
    catch (err) {
        throw err;
    }
}

//Check if the user has only a weightlifting membership
export let checkIfUserHasWeightliftingOnly = async function (customerID) {
    
    try {
        const memberships = await getAllActiveMembershipsFromCustomerID(customerID);
        if(memberships === undefined || memberships.length === 0 || memberships === null || !memberships) {
            return true;
        }
        else if (memberships.length === 1) {
            const membershipInfo = await getMembershipInfofromID(memberships[0].membership_id);
            return (membershipInfo.membership_id === 4 || membershipInfo.membership_id === 8 || membershipInfo.membership_id === 12) 
        }   
        else {
            return false;
        }
    }
    catch (err) {
        throw err;
    }
}

