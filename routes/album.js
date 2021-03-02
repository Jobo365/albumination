const express = require('express');
const { authUser } = require('../basicAuth');
const router = express.Router();
const Album = require('../models/Album')

router.get('/:id', authUser, async (req, res) => {
    const album = await Album.findById(req.params.id).lean();
    res.render('album/album', {
        album
    })
})

module.exports = router