'use strict';
import { Database } from 'sqlite-async';
import bcrypt from 'bcrypt'

let sql;

try{
    sql = await Database.open('data/gym_chain.db');
    console.log('Connected to the gym-chain database.');
} catch (error) {
    throw Error('Error connecting to the database: ' + error);
}



export let findUserByUsernamePassword = async (username, password) => {
    //Φέρε μόνο μια εγγραφή (το LIMIT 0, 1) που να έχει username και password ίσο με username και password 
    const stmt = await sql.prepare("SELECT username, password FROM User WHERE username = ? AND password = ? LIMIT 0, 1");
    try {
        const user = await stmt.all(username, password);
    } catch (err) {
        throw err;
    }
}

//Η συνάρτηση δημιουργεί έναν νέο χρήστη
export let registerUserNoPass = async function (username) {
    // ελέγχουμε αν υπάρχει χρήστης με αυτό το username
    const userId = getUserByUsername(username);
    if (userId != undefined) {
        return { message: "Υπάρχει ήδη χρήστης με αυτό το όνομα" };
    } else {
        try {
            const stmt = await sql.prepare('INSERT INTO user VALUES (?, ?, "customer")');
            const info = await stmt.run(username, username);
            return info.lastInsertRowid;
        } catch (err) {
            throw err;
        }
    }
}

/**
 * Επιστρέφει τον χρήστη με όνομα 'username'
 */
export let getUserByUsername = async (username) => {
    
    const stmt = await sql.prepare("SELECT username, password, role FROM User WHERE username = ?");
    
    try {
        const user = await stmt.all(username);
        console.log('user', user);
        return user[0];
    } catch (err) {
        throw err;
    }
}

//Η συνάρτηση δημιουργεί έναν νέο χρήστη με password
export let registerUser = async function (fname, lname, username, password, email) {
    // ελέγχουμε αν υπάρχει χρήστης με αυτό το username
    const userId = await getUserByUsername(username);
    console.log('userId', userId);
    if (userId != undefined) {
        return { message: "Υπάρχει ήδη χρήστης με αυτό το όνομα" };
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Add to Customer table
            const customerStmt = await sql.prepare('INSERT INTO Customer (username, fname, lname, email) VALUES (?, ?, ?, ?)');
            const customerInfo = await customerStmt.run(username, fname, lname, email);
            
            // Add to User table
            const stmt = await sql.prepare('INSERT INTO user VALUES (?, ?, "customer")');
            const info = await stmt.run(username, hashedPassword);
            console.log('info', info.lastID);
            return info.lastID;
        } catch (error) {
            throw error;
        }
    }
}