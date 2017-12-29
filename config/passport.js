const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user');

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })

})

passport.use('local-login', new LocalStrategy({
  usernameField: 'email', passwordField: 'password', passReqToCallback: true
}, async function (req, email, password, done) {
  try {
    let user = await User.findOne({ email: email })
    if (!user) return done(null, false, req.flash('loginMessage', 'No user found'))
    if (!user.comparedPassword(password)) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password!'))
    return done(null, user)
  } catch (error) {
    done(error)
  }
}))