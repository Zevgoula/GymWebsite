import bcrypt from 'bcrypt';

import * as userModel from '../model/gym-chain-model-sqlite-async.mjs';


export let showLogInForm = function (req, res) {
    res.render('login', {layout: 'main'});

}

export let showRegisterForm = function (req, res) {
    res.render('createAccount', {layout: 'main'});

}

export let doRegister = async function (req, res) {
    try {
        const registrationResult = await userModel.registerUser(req.body.username, req.body.password);
        if (registrationResult.message) {
            //FIXME
            res.render('createAcount', {layout: 'main'})
        }
        else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('registration error: ' + error);

        res.render('createAcount', {layout: 'main'})
    }
}

export let doLogin = async function (req, res) {
    //Ελέγχει αν το username και το password είναι σωστά και εκτελεί την
    //συνάρτηση επιστροφής authenticated
    console.log("doLogin", req.body.username, req.body.password);
    const user = await userModel.getUserByUsername(req.body.username);
    if (user == undefined || !user.password || !user.id) {
        //FIXME
        res.render('login');
    }
    else {
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            //Θέτουμε τη μεταβλητή συνεδρίας "loggedUserId"
            req.session.loggedUserId = user.id;
            //Αν έχει τιμή η μεταβλητή req.session.originalUrl, αλλιώς όρισέ τη σε "/" 
            // res.redirect("/");            
            const redirectTo = req.session.originalUrl || "/home";
            console.log("redirecting to " + redirectTo);
            res.redirect(redirectTo);
        }
        else {
            //FIXME πρεπει να λεει οτι ο κωδικος ειναι λαθος
            res.render("login", { message: 'Ο κωδικός πρόσβασης είναι λάθος' })
        }
    }
}

export let doLogout = (req, res) => {
    //Σημειώνουμε πως ο χρήστης δεν είναι πια συνδεδεμένος
    req.session.destroy();
    res.redirect('/');
}

//Τη χρησιμοποιούμε για να ανακατευθύνουμε στη σελίδα /login όλα τα αιτήματα από μη συνδεδεμένους χρήστες
export let checkAuthenticated = function (req, res, next) {
    //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
    if (req.session.loggedUserId) {
        console.log("user is authenticated", req.originalUrl);
        //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
        next();
    }
    else {
        //Ο χρήστης δεν έχει ταυτοποιηθεί, αν απλά ζητάει το /login ή το register δίνουμε τον
        //έλεγχο στο επόμενο middleware που έχει οριστεί στον router
        if ((req.originalUrl === "/login") || (req.originalUrl === "/createAcount")) {
            next()
        }
        else {
            //Στείλε το χρήστη στη "/login" 
            console.log("not authenticated, redirecting to /login")
            res.redirect('/login');
        }
    }
}