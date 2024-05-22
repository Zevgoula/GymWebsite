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

app.use(express.static('public'))


app.use((req, res, next) => {
  if (req.session) {
     res.locals.userId = req.session.loggedUserId;
  } else {
     res.locals.userId = 'visitor';
  }
  next();
});


import routes from './routes/router.mjs'

app.use('/', routes);

// Custom helper function if_eq
app.engine('hbs', exphbs.engine({ 
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    if_eq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  }
}));


app.set('view engine', 'hbs');

//Debugging middleware
app.use((err, req, res, next) => {

  console.error('ERROR: ' + err.message + err.stack);

})


export {app as gymChainApp}