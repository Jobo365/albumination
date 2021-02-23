const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const { authUser, authAdmin } = require('../../basicAuth')

router.get('/:id', authUser, authAdmin, async (req, res) => {
    user = await User.findById(req.params.id).lean();

    res.render('admin/user', {
        user
    })

})

module.exports = router;