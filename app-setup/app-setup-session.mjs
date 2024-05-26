import session from 'express-session'
import dotenv from 'dotenv'
dotenv.config()

let gymChainSession

// Set up session middleware
gymChainSession = session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        // To keep the session cookie for 30 days
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: true
    }
});

export default gymChainSession;