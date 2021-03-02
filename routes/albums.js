const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const multer = require('multer');
const path = require('path');
const { authUser } = require('../basicAuth');

const storage = multer.diskStorage({
    destination: './static/products/',
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
}).any();

router.get('/', authUser, async (req, res) => {
    const albums = await Album.find( {owner: req.user.id} ).lean();

    res.render('album/albums', {
        albums: albums
    })
})

router.get('/newalbum', authUser, (req, res) => {
    res.render('album/newalbum')
})

router.post('/newalbum', (req, res) => {
    const { name } = req.body;

    let errors = [];

    if (!name) {
        errors.push('Please fill in all the fields!')
    }

    if (errors.length > 1) {
        errors.forEach(error => {
            req.flash('error_msg', error.toString())
        })
    } else {
        Album.findOne({ name: name })
        .then(album => {
            if (album) {
                if (album.owner === req.user.id) {
                    req.flash('error_msg', 'That album name is already in use!')
                    res.redirect('/albums/newalbum')
                } else {
                    const newAlbum = new Album({
                        name,
                        owner: req.user.id
                    })
    
                    newAlbum.save()
                    .then(album => {
                        req.flash('success_msg', 'New album created!')
                        res.redirect('/admin/products')
                    })
                    .catch(err => {
                        console.error(err);
                    })
                }
            } else {
                const newAlbum = new Album({
                    name,
                    owner: String(req.user.id)
                })

                newAlbum.save()
                .then(album => {
                    req.flash('success_msg', 'New album created!')
                    res.redirect('/albums/')
                })
                .catch(err => {
                    console.error(err);
                })
            }
        })
    }
})

module.exports = router