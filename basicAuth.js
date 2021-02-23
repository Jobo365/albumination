function authUser(req, res, next) {
    if (req.user == null) {
        res.status(403)
        return res.send('You must sign in!')
    }
    next()
}

function authAdmin(req, res, next) {
        if (req.user.admin !== true) {
            res.status(401);
            return res.send('Only admins can access this page!')
        }
        next()
}

module.exports = {authUser, authAdmin}