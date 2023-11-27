if(process.env.NODE_ENV !== 'production' ){
    require('dotenv').config()
}


const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const {campgroundSchema, reviewSchema} = require('./schemas')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/expressError')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const mongoSnitize = require('express-mongo-sanitize')
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/Yelp-Camp'

// const dbUrl = 'mongodb://127.0.0.1:27017/Yelp-Camp'

const MongoDBStore = require("connect-mongo")(session);

// const helmet = require('helmet')

//password 
const passport = require('passport')
const LocalStrateqy = require('passport-local')
const User = require('./models/user.js')


const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews');
const usersRout = require('./routes/user');

mongoose.set('strictQuery', false) //bob    

// mongoose.connect( dbUrl, {
//     useNewUrlParser: true,
//     // useCreateIndex: true,
//     useUnifiedTopology: true,
//     // useFindAndModify: false
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });
mongoose.connect(dbUrl)
    .then(() => {
        console.log('mongo connection open')
    })
    .catch(err => {
        console.log('OH NOO mongo connection error')
        console.log(err)
    })

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSnitize())

const store = new MongoDBStore({
    url: dbUrl,
    secret :  'thisshouldbeabettersecret!',
    touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})


const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized :  true,
    cookie : {
        httpOnly: true,
        expires: Date.now() + 100 * 60 * 60 * 24 * 7,
        maxAge: 100 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())
// app.use(helmet({contentSecurityPolicy : false}))

//password 
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrateqy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    // console.log( req.session )
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


const validateCampground = (req, res , next)=>{
    const result =  campgroundSchema.validate(req.body)
    if(result.error){
        throw new ExpressError(result.error.details, 400)
    }else {
        next()
    }

}


const validateReview = (req, res , next)=>{
    const {error} =  campgroundSchema.validate(req.body)
    if(result.error){
        throw new ExpressError(result.error.details, 400)
    }else {
        next()
    }
}
app.use('/', usersRout )
app.use('/campgrounds', campgrounds )
app.use('/campgrounds/:id/reviews', reviews )

app.get('/', (req, res) => {
    res.render('home.ejs')
})





app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'something went wrong'
    res.status(statusCode).render('error.ejs', { err })
})

app.listen(process.env.PORT || 2000, () => {
    console.log('listen on port 2000')
})