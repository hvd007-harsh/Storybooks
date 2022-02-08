const express = require('express');

const passport = require('passport');

const passportHttp = require('passport-http');

const logout = require('express-passport-logout');

const router = express.Router();

//@desc Auth with Google
//@desc GET /auth/google

router.get('/google',passport.authenticate('google',{ scope: ['profile'] }))

//@desc Google auth callback
//@desc GET /auth/google/callback

router.get('/google/callback',
passport.authenticate('google',{
 failureRedirect:'/'}),

  (req,res)=>{
        res.redirect('/dashboard')
    }
)
//@desc logout 
//@desc GET /auth/logout
router.get('/logout',(req,res)=>{
    res.logout();
    res.redirect('/');
})
module.exports=router