import session from 'express-session'
import dotenv from 'dotenv'
dotenv.config()

let gymChainSession

gymChainSession = session({
    name: 'gymChain-session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: true
    }
});

export default gymChainSession;