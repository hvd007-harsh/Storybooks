const path =require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDb = require('./config/db')
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
//Handlebars helpers
const {formatDate,truncate,stripTags,editIcon,select} = require('./helpers/hbs')



//Load Config
dotenv.config({path:'./config/config.env'})
//Connect Db 
connectDb();
//Logging 
const app = express();
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}

//Body Parser 
app.use(express.urlencoded({extended: false}));
app.use(express.json())

// Method Override
  app.use(methodOverride(function(req,res){
      if(req.body && typeof req.body === 'object' && '_method' in req.body){
        let method = req.body._method
        delete req.body._method
        return method

      }
    })
  )
//Passport config
require('./config/passport')(passport)

// Handlebars
app.engine('.hbs', exphbs({helpers:
  { 
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
  }, defaultLayout:'main',extname: '.hbs',}));
app.set('view engine', '.hbs');
//static Folder
app.use(express.static(path.join(__dirname,'public')))
//Session 
app.use(session({
  secret:'keyboard Cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}))
// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Set global var 
app.use(function(req,res,next){
  res.locals.user = req.user || null
  next()
})

//Routes 
app.use('/',require('./routes/index'));
app.use('/auth', require('./routes/auth'))
app.use('/stories',require('./routes/stories'))
const PORT = process.env.PORT || 9000
app.listen(PORT,()=>{
 console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
})
