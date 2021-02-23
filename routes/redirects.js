const express = require('express');
const router = express.Router();

router.get('/',(req, res) => {
    res.send('Home page')
})

router.get('/login', (req, res) => {
    res.redirect('/account/login')
})

module.exports = router;