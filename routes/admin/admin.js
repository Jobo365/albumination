const express = require('express');
const router = express.Router();
const { authUser, authAdmin } = require('../../basicAuth')
const User = require('../../models/User');
const Product = require('../../models/Album')


const app = express();

router.get('/', (req, res) => {
    res.send('Admin Page')
})

router.get('/users', authUser, authAdmin, async (req, res) => {
    users = await User.find().lean();
    res.render('admin/users', {
        title: 'Admin',
        users,
    })
})

router.post('/makeadmin/:id', authUser, authAdmin, async (req, res) => {
    user = await User.findById(req.params.id).lean();

    await User.findOneAndUpdate({_id: req.params.id}, {admin: true})

    req.flash('success_msg', 'Made ' + user.username + ' an admin!')
    res.redirect('/user/' + user._id)
})

router.post('/remadmin/:id', authUser, authAdmin, async (req, res) => {
    user = await User.findById(req.params.id).lean();

    await User.findOneAndUpdate({_id: req.params.id}, {admin: false})

    req.flash('success_msg', 'Removed admin from ' + user.username + '!')
    res.redirect('/user/' + user._id)
})

router.get('/albums', authUser, authAdmin, async (req, res) => {
    albums = await Product.find().lean();
    res.render('admin/albums', {
        albums
    })
})

module.exports = router