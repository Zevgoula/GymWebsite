import express from 'express'
const app = express()
const __dirname = path.resolve()
import path from 'path'

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
     res.locals.userId = 'επισκέπτης';
  }
  next();
});


import routes from './routes/router.mjs'

app.use('/', routes);


app.engine('hbs', exphbs.engine({ 
  extname: '.hbs',
  defaultLayout: 'main'
}));

app.set('view engine', 'hbs');


export {app as gymChainApp}