const express = require('express')
const router = express.Router();
const User = require('../models/user')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const { storeReturnTo } = require('../middleware')

router.get('/register', (req, res) => {
    res.render('users/register.ejs')
})
router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ username, email })
        const register = await User.register(user, password)
        req.login(register, err =>{
            if(err) return next(err)
            console.log(register)
        req.flash('success', 'Welcome to YelpCamp')
        res.redirect('/campgrounds')
        })
    
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}))
router.get('/login', (req, res) => {
    res.render('users/login.ejs')
})
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back')
   const redirectUrl= res.locals.returnTo || '/campgrounds'
   delete res.locals.returnTo 
    res.redirect(redirectUrl)
})


router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 

module.exports = router