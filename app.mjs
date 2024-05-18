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

app.use(express.static('public'))


app.use((req, res, next) => {
    res.locals.userId = "mitsos";
    next();
})


import routes from './routes/router.mjs'

app.use('/', routes);


app.engine('hbs', exphbs.engine({ 
  extname: '.hbs',
  defaultLayout: 'main'
}));

app.set('view engine', 'hbs');


export {app as gymChainApp}