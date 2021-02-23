const User = require('../models/User')

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash('error_msg', 'You must be logged in to see this!')
        res.redirect('/account/login')
    },

    isAdmin: function(req, res, next) {
        User.findById(req.user._id, function(err, user) {
            if (user.admin == false) {
                return next(req.isAdmin = false)
            }
            return next(req.isAdmin = true)
        })
    },
}