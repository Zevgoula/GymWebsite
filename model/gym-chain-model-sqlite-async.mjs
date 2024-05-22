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

// Not used anywhere for now
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

// Return the first user found with the given username
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
export let registerUser = async function (fname, lname, username, password) {
    // ελέγχουμε αν υπάρχει χρήστης με αυτό το username
    const userId = await getUserByUsername(username);
    if (userId != undefined) {
        return { message: "Υπάρχει ήδη χρήστης με αυτό το όνομα" };
    } 
    else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Add to Customer table
            const customerStmt = await sql.prepare('INSERT INTO Customer (username, fname, lname) VALUES (?, ?, ?)');
            await customerStmt.run(username, fname, lname);
            
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
        const customerId = await stmt.get(username);
        return customerId;
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

//   OLD

// export let getActiveMemberships = async function (username) {
//     const stmt = await sql.prepare("");
//     try {    
//         return memberships;
//     } 
//     catch (err) {
//         throw err;
//     }
// }

// export let selectsMembership = async function (customer_id, membership_id) {
//     const stmt = await sql.prepare("INSERT INTO Selects_membership VALUES (?, ?)");
//     try {
//         await stmt.run(customer_id, membership_id);
//     } 
//     catch (err) {
//         throw err;
//     }
// }

// export let getAvailableClassesforMembership = async function (membershipId) {
//     const classIds = await sql.prepare("SELECT classId FROM Offers_class WHERE membership_id = ?");

//     const stmt = await sql.prepare("SELECT * FROM Class WHERE class_id = ?");
//     try {
//         let classes = await stmt.all(classIds);
//         return classes;
//     } 
//     catch (err) {
//         throw err;
//     }
// }

// export let checkCustomersInClass = async function (classId) {
//     const stmt = await sql.prepare("SELECT COUNT(*) FROM Books_class WHERE class_id = ?");

//     try {
//         const count = await stmt.get(classId);
//         return count;
//     }
//     catch (err) {
//         throw err;
//     }
// }

// export let checkIfClassIsBookable = async function (class_id) {
//     const stmt = await sql.prepare("SELECT room_capacity FROM Class WHERE class_id = ?");
//     const stmt2 = await sql.prepare("UPDATE Class SET bookability = ? WHERE class_id = ?");
//     try {
//         const capacity = await stmt.get(class_id);
//         const count = await checkCustomersInClass(class_id);

//         if (count >= capacity) {
//             await stmt2.run(0, class_id);
//             return false;
//         }
//         else {
//             await stmt2.run(1, class_id);
//             return True;
//         }
//     } 
//     catch (err) {
//         throw err;
//     }
// }

// export let getClassInfo = async function (class_id) {
//     const stmt = await sql.prepare("SELECT * FROM Class WHERE class_id = ?");
//     try {
//         const classInfo = await stmt.get(class_id);
//         return classInfo;
//     } 
//     catch (err) {
//         throw err;
//     }
// }

// export let bookClass = async function (customerId, class_id) {
//     const stmt = await sql.prepare("INSERT INTO Books_class(day, time, class_id, customer_id) VALUES (?, ?, ?, ?)");
//     try {
//         let classInfo = await getClassInfo(class_id);
//         if (classInfo.bookability === 1) {
//             await stmt.run(classInfo.day, classInfo.time, class_id, customerId);
//             return true;
//         }
//         else {
//             return false;
//         }
//     } 
//     catch (err) {
//         throw err;
//     }
// }