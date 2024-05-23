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


// let fa = await bcrypt.hash('aaa', 10);
// let a = await bcrypt.hash('snortiga', 10);
// let p = await bcrypt.hash('rodo1', 10);
// let b = await bcrypt.hash('pap2', 10);
// let c = await bcrypt.hash('kwdikos', 10);

// console.log('pap1', fa);
// console.log('snortiga', a);
// console.log('rodo1', p);
// console.log('pap2', b);
// console.log('kwdikos', c);

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


export let getCustomerIDFromUsername = async function (username) {
    const stmt = await sql.prepare("SELECT customer_id FROM Customer WHERE username = ?");
    try {
        const customerId = await stmt.get(username);
        return customerId.customer_id;
    } 
    catch (err) {
        throw err;
    }
}


const a = new Date();
console.log(a);