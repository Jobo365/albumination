const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const passport = require('passport');
const { authUser, authAdmin } = require('../basicAuth')
const { ensureAuthenticated } = require('../config/auth');

router.get('/', authUser, (req, res) => {
    res.render('account/account', {
        name: req.user.username
    })
})

router.get('/register', (req, res) => {
    res.render('account/register')
})

router.post('/register', (req, res) => {
    const { username, email, password, password2 } = req.body;
    var hasPassword = false;
    var hasEmail = false;
    var hasUsername = false;
    if (username.length >= 1) {
        hasUsername = true
    }
    if (email.length >= 1) {
        hasEmail = true
    }
    if (password.length >= 1) {
        hasPassword = true
    }
    let errors = [];

    if (!username || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields! '})
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match!' })
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password does not meet requirements!'})
    }

    if (errors.length > 0) {
        res.render('account/register', {
            errors,
            hasUsername,
            username,
            hasEmail,
            email,
            hasPassword,
            password,
        })
    } else {
        User.findOne({ email: email })
        .then(user => {
            if (user) {
                errors.push({msg: 'Email already in use!'})
                res.render('account/register', {
                    errors,
                    hasUsername,
                    username,
                    hasEmail,
                    email,
                    hasPassword,
                    password,
                })
            } else {
                const newUser = new User({
                    username,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        console.error(err);
                    }

                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'You can now log in!')
                        res.redirect('/account/login')
                    })
                    .catch(err => console.error(err))

                }))
            }
        })
    }
})

router.get('/login', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('account/login')
    } else {
        req.flash('error_msg', 'You are already logged in!')
        res.redirect('/account')
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/account',
        failureRedirect: '/account/login',
        failureFlash: true
    }) (req, res, next)
})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You have been logged out!')
    res.redirect('/account/login')
});

module.exports = router;
