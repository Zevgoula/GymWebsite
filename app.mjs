import express from 'express'
const app = express()

import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

import exphbs from 'express-handlebars'

app.use(express.urlencoded({ extended: false }))


import gymChainSession from './app-setup/app-setup-session.mjs'

app.use(gymChainSession)

// Server static files
app.use(express.static('public'))

// Middleware to check if user is logged in
app.use((req, res, next) => {
  if (req.session) {
     res.locals.userId = req.session.loggedUserId;
     console.log("User is logged in as: " + res.locals.userId);
    
  } else {
     res.locals.userId = 'visitor';
      console.log("User is not logged in");
  }
  next();
});

// Import routes
import routes from './routes/router.mjs'

app.use('/', routes);

//Template engine
app.engine('hbs', exphbs.engine({ 
  extname: '.hbs',
  defaultLayout: 'main',
  // Custom helper function if_eq
  helpers: {
    if_eq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    eq: function (a, b) {
      return a === b;
    },
    and: function (a, b) {
        return a && b;
  }


  }
}));


app.set('view engine', 'hbs');

//Debugging middleware
app.use((err, req, res, next) => {

  console.error('ERROR: ' + err.message + '\n' + err.stack);
  res.render('message', {message: "Oops something went wrong!", error: true});

})


export {app as gymChainApp}