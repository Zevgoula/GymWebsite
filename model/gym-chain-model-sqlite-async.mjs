'use strict';
import { Database } from 'sqlite-async';
import bcrypt from 'bcrypt';

let sql;

try {
    sql = await Database.open('data/gym_chain_new.db');
    console.log('Connected to the gym-chain database.');
} 
catch (error) {
    throw Error('Error connecting to the database: ' + error);
}

//Not used anywhere for now
export let findUserByUsernamePassword = async (username, password) => {
    //Φέρε μόνο μια εγγραφή (το LIMIT 0, 1) που να έχει username και password ίσο με username και password 
    const stmt = await sql.prepare("SELECT username, password FROM User WHERE username = ? AND password = ? LIMIT 0, 1");
    try {
        const user = await stmt.all(username, password);
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
    if (userId != undefined) {
        return { message: "Υπάρχει ήδη χρήστης με αυτό το όνομα" };
    } 
    else {
        try {
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

//Check if the user is an admin
export let isAdmin = async function (username) {
    if (username === undefined) {
        console.log('user is visitor');
        return false;
    }
    else {
        const stmt = await sql.prepare("SELECT role FROM User WHERE username = ?");
        try {
            const role = await stmt.get(username);
            return role.role === 'admin';
        } 
        catch (err) {
            throw err;
        }
    }
}

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

export let getMembershipInfofromID = async function (membershipId) {
    const stmt = await sql.prepare("SELECT * FROM Membership WHERE membership_id = ?");
    try {
        const membership = await stmt.get(membershipId);

        return membership;
    }
    catch (err) {
        throw err;
    }
}

//Get the membership IDs for the selected class (all classes have 3 memberships)
export let getMembershipsInfofromClassID = async function (classId) {
    // Get the membership IDs for the selected class
    const stmt = await sql.prepare("SELECT membership_id FROM INCLUDES WHERE class_id = ?");
    // Get the membership info for each membership ID
    const stmt2 = await sql.prepare("SELECT * FROM Membership WHERE membership_id = ?");
    try {
        const membershipsIDs = await stmt.all(classId);
        let membershipsInfo = [];
        for (let i = 0; i < membershipsIDs.length; i++) {
            const membershipInfo = await stmt2.get(membershipsIDs[i].membership_id);
            membershipsInfo[i] = membershipInfo;
        }
        return membershipsInfo;
    } 
    catch (err) {
        throw err;
    }
}

//Get the customer ID from the username
export let getCustomerIDFromUsername = async function (username) {
    
    const stmt = await sql.prepare("SELECT customer_id FROM Customer WHERE username = ?");
    try {
        if (username === 'visitor') {
            return undefined;
        }
        else if (username === undefined) {
            return undefined;
        }
        const customerId = await stmt.get(username);
        return customerId.customer_id;
    } 
    catch (err) {
        throw err;
    }
}

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

export let updatePersonalInfo = async function (username, phone_number, address, city, state, zip_code) {
    const stmt = await sql.prepare("UPDATE Customer SET phone_number = ?, address = ?, city = ?, state = ?, zip_code = ? WHERE username = ?");
    try {
        await stmt.run(phone_number, address, city, state, zip_code, username);
    } 
    catch (err) {
        throw err;
    }
}

export let addPaymentInfo = async function (username, ccn, cvv,  exp_date) {
    const stmt = await sql.prepare("INSERT INTO Payment_info (username, ccn, cvv, exp_date) VALUES (?, ?, ?, ?)");
    try {
        await stmt.run(username, ccn, cvv,  exp_date);
    } 
    catch (err) {
        throw err;
    }
}

export let buyMembership = async function (customerId, membershipId) {
    const membershipInfo = await getMembershipInfofromID(membershipId);
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
        await stmt.run(membershipId, customerId, start_date, exp_date);
    } 
    catch (err) {
        throw err;
    }
}

export let checkIfCustomerHasMembership = async function (customerId, membershipId) {
    const purchaseId = await getPurchaseIDs(customerId, membershipId);
    // console.log('Purchase ID: ', purchaseId);
    if (purchaseId === undefined) {
        return false;
    }
    else{
        for (let i = 0; i < purchaseId.length; i++) {
            if (await checkIfMembershipIsActive(customerId, membershipId, purchaseId[i].purchase_id)) {
                return true;
            }
        }               
    }
}

export let checkIfMembershipIsActive = async function (customerId, membershipId, purchaseId) {
    const stmt = await sql.prepare("SELECT exp_date FROM BUYS WHERE customer_id = ? AND membership_id = ? AND purchase_id = ?");
    try {
        const exp_date_obj = await stmt.get(customerId, membershipId, purchaseId);
        const currentDate = new Date();

        const expirationDate = stringToDate(exp_date_obj.exp_date);
        // console.log('Current date: ', currentDate);
        // console.log('Expiration date: ', expirationDate);

        if (currentDate > expirationDate) {
            return false;
        } else {
            return true;
}
    } 
    catch (err) {
        throw err;
    }
}

export let getPurchaseIDs = async function (customerId, membershipId) {
    const stmt = await sql.prepare("SELECT purchase_id FROM BUYS WHERE customer_id = ? AND membership_id = ?");
    try {
        const purchaseId = await stmt.all(customerId, membershipId);
        if (purchaseId.length === 0) {
            return undefined;
        }
        else if (purchaseId.length === 1) {
            return purchaseId[0].purchase_id;
        }
        else {
            return purchaseId;
        }
    } 
    catch (err) {
        throw err;
    }
}

export let checkIfCustomerHasAnyMembershipFromClassID = async function (customerId, classId) {
    try{
        const membershipsInfo = await getMembershipsInfofromClassID(classId);
        // console.log('Memberships Info: ', membershipsInfo);
        // const a  = await checkIfCustomerHasMembership(customerId, membershipsInfo[0].membership_id);
        // const b = await checkIfCustomerHasMembership(customerId, membershipsInfo[1].membership_id);
        // const c = await checkIfCustomerHasMembership(customerId, membershipsInfo[2].membership_id);

        // console.log('a: ', a);
        // console.log('b: ', b);
        // console.log('c: ', c);

        if (await checkIfCustomerHasMembership(customerId, membershipsInfo[0].membership_id) || await checkIfCustomerHasMembership(customerId, membershipsInfo[1].membership_id) || await checkIfCustomerHasMembership(customerId, membershipsInfo[2].membership_id)) {
            return true;
        }
        else {
            return false;
        }
    }
    catch(err){
        throw err;
    }
}

export let extendMembership = async function (customerId, membershipId, purchaseId) {

    try {
        const exp_date = await getExpDate(customerId, membershipId, purchaseId);
        const oldExpDate = stringToDate(exp_date);
        // const expirationDate = stringToDate(exp_date);
        const membershipInfo = await getMembershipInfofromID(membershipId);
        const length = membershipInfo.length;
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
        const stmt2 = await sql.prepare("UPDATE BUYS SET exp_date = ? WHERE customer_id = ? AND membership_id = ? AND purchase_id = ?");
        await stmt2.run(new_exp_date, customerId, membershipId, purchaseId);
    } 
    catch (err) {
        throw err;
    }
}

export let getExpDate = async function (customerId, membershipId, purchaseId) {
    const stmt = await sql.prepare("SELECT exp_date FROM BUYS WHERE customer_id = ? AND membership_id = ? AND purchase_id = ?");
    try {
        const exp_date_obj = await stmt.get(customerId, membershipId, purchaseId);
        return exp_date_obj.exp_date;
    } 
    catch (err) {
        throw err;
    }
}

export let DateToString = function (date) {
    return date.toISOString().split('T')[0];
}

export let stringToDate = function (dateString) {
    const listDate = dateString.split('-');
    const date = new Date(listDate[0], listDate[1]-1, listDate[2]);
    return date;
}

export let getMembershipLengthFromID = async function (membershipId) {
    const stmt = await sql.prepare("SELECT length FROM Membership WHERE membership_id = ?");
    try {
        const length = await stmt.get(membershipId);
        return length.length;
    } 
    catch (err) {
        throw err;
    }
}

export let sendMessage = async function (username, subject, message_text) {
    const stmt = await sql.prepare("INSERT INTO Message (customer_id, subject, message_text) VALUES (?, ?, ?)");
    try {
        const customerId = await getCustomerIDFromUsername(username);
        if (customerId === undefined) {
            await stmt.run(null, subject, message_text);
        }
        else {
            await stmt.run(customerId, subject, message_text);
        }
    } 
    catch (err) {
        throw err;
    }
}

export let getMessages = async function () {
    const stmt = await sql.prepare("SELECT * FROM Message");
    try {
        const messages = await stmt.all();
        return messages;
    } 
    catch (err) {
        throw err;
    }
}

export let getClassNameFromMembershipID = async function (membershipId) {
    const stmt = await sql.prepare("SELECT class_id FROM INCLUDES WHERE membership_id = ?");
    const stmt2 = await sql.prepare("SELECT name FROM Class WHERE class_id = ?");
    try {
        const classId_obj = await stmt.get(membershipId);
        const class_id = classId_obj.class_id;
        const className = await stmt2.get(class_id);
        return className.name;

        
    } 
    catch (err) {
        throw err;
    }
}

export let getClassIDFromMembershipID = async function (membershipId) {
    const stmt = await sql.prepare("SELECT class_id FROM INCLUDES WHERE membership_id = ?");
    try {
        const classId_obj = await stmt.get(membershipId);
        return classId_obj.class_id;
    } 
    catch (err) {
        throw err;
    }
}

//OLD
// export let getActiveMemberships = async function (customerId) {
//     const stmt = await sql.prepare("SELECT * FROM BUYS WHERE customer_id = ?");
//     try {
//         const memberships = await stmt.all(customerId);
//         let activeMemberships = [];
//         for (let i = 0; i < memberships.length; i++) {
//             if (await checkIfMembershipIsActive(customerId, memberships[i].membership_id, memberships[i].purchase_id)) {
//                 activeMemberships.push(memberships[i]);
//             }
//         }
//         return activeMemberships;
//     } 
//     catch (err) {
//         throw err;
//     }
// }

// export let getInactiveMemberships = async function (customerId) {
//     const stmt = await sql.prepare("SELECT * FROM BUYS WHERE customer_id = ?");
//     try {
//         const memberships = await stmt.all(customerId);
//         let inactiveMemberships = [];
//         for (let i = 0; i < memberships.length; i++) {
//             if (!await checkIfMembershipIsActive(customerId, memberships[i].membership_id, memberships[i].purchase_id)) {
//                 inactiveMemberships.push(memberships[i]);
//             }
//         }
//         return inactiveMemberships;
//     }
//     catch (err) {
//         throw err;
//     }
// }

// export let getAllMemberships = async function (customerId) {
//     const active_memberships = await getActiveMemberships(customerId);
//     const inactive_memberships = await getInactiveMemberships(customerId);
//     const combined = active_memberships.concat(inactive_memberships);
//     return combined;
// }


//NEW
export let getAllActiveMemberships = async function () {
    const stmt = await sql.prepare("SELECT * FROM BUYS WHERE exp_date > date('now')");
    try {
        const memberships = await stmt.all();
        return memberships;
    } 
    catch (err) {
        throw err;
    }
}

export let getAllActiveMembershipsFromCustomerID = async function (customerId) {
    const stmt = await sql.prepare("SELECT * FROM BUYS WHERE customer_id = ? AND exp_date > date('now')");
    try {
        const memberships = await stmt.all(customerId);
        return memberships;
    } 
    catch (err) {
        throw err;
    }
}

export let getAllInactiveMemberships = async function () {
    const stmt = await sql.prepare("SELECT * FROM BUYS WHERE exp_date < date('now')");
    try {
        const memberships = await stmt.all();
        return memberships;
    } 
    catch (err) {
        throw err;
    }
}

export let getAllInactiveMembershipsFromCustomerID = async function (customerId) {
    const stmt = await sql.prepare("SELECT * FROM BUYS WHERE customer_id = ? AND exp_date < date('now')");
    try {
        const memberships = await stmt.all(customerId);
        return memberships;
    } 
    catch (err) {
        throw err;
    }
}

export let getActiveClassesIDsFromCustomerID = async function (customerId) {
    const stmt  = await sql.prepare("SELECT INCLUDES.class_id FROM BUYS INNER JOIN INCLUDES ON BUYS.membership_id=INCLUDES.membership_id WHERE customer_id = ? and BUYS.exp_date > date('now')");
    try {
        const classes = await stmt.all(customerId);
        return classes;
    } 
    catch (err) {
        throw err;
    }
}

