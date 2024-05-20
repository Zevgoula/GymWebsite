import session from 'express-session'
import dotenv from 'dotenv'
dotenv.config()

let gymChainSession

gymChainSession = session({
    name: 'gymChain-session',
    secret: process.env.SESSION_SECRET,
    // secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 60000,
        sameSite: true
    }
});

export default gymChainSession;