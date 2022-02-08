const express = require('express');
const router = express.Router();
const { ensureAuth,ensureGuest } = require('../middleware/auth')
const Story = require('../model/story')
//@desc Login/Landing
//@desc GET / 
router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{
        layout: 'login',
    })
})
//@desc /Dashboard
//@desc GET /dashboard
router.get('/dashboard',ensureAuth,async(req,res)=>{
    try{
        const stories = await Story.find({user : req.user._id}).populate('user').lean()
           console.log(stories)
            res.render('dashboard',{
                name: req.user.firstName,
                stories,
            });
    }catch(err){
    console.error(err);
    res.render('error/500')
    }
})

module.exports=router