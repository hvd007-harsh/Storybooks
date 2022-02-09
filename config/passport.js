const GoogleStrategy = require('passport-google-oauth20').Strategy;
const moongose = require('mongoose');
const user = require('../model/user');

module.exports = function(passport){
    passport.use(
      new GoogleStrategy(
        {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
        },
        async(accessToken,refreshToken,profile,done)=>{
        const newUser = {
          googleId : profile.id,
          displayName : profile.displayName,
          firstName : profile.name.givenName,
          lastName : profile.name.familyName,
          image : profile.photos[0].value,
        }
        try{
          let User = await user.findOne({ googleId: profile.id})

          if(User){
            done(null,User)
          }
          else{
            User = await user.create(newUser)
            done(null,User)
          }
        }
        catch(err){
          console.error(err)
        }
      }
    )
  )
    passport.serializeUser((user, done)=>{
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done)=>{
    user.findById(id, (err, user)=>{
      done(err, user);
    });
  });
}
