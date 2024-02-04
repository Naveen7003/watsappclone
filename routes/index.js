var express = require('express');
var router = express.Router();
const userModel = require('./users');
const localStrategy = require('passport-local');
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()))

router.get('/', function(req,res, next){
  res.render('login');
})

router.get('/profile', isLoggedIn, async function (req, res, next) {
  res.render('profile', { title: 'Express', user: req.user });
});

router.post('/register', function (req, res) {
  const { username, email, contact } = req.body;
  const userData = new userModel({ username, email, contact });

  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      })
    })
});

router.get('/login', (req, res, next)=>{
  res.render('login');
})

router.post('/login', passport.authenticate('local',{
  successRedirect: "/profile",
  failureRedirect : "/login",
}))


router.get('/profile', (req, res, next)=>{
  res.render('profile')
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/');
}

router.get('/logout', (req, res , next)=>{
  res.redirect('/');
})

module.exports = router;
