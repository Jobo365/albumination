const express = require('express');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const flash = require('connect-flash')
const session = require('express-session')

const app = express();

const adminRouter = require('./routes/admin/admin');
const accountRouter = require('./routes/account');
const redirectsRouter = require('./routes/redirects')
const userRouter = require('./routes/admin/user')
const albumsRouter = require('./routes/albums')
const albumRouter = require('./routes/album')

require('./config/passport')(passport);

mongoose.connect('mongodb://localhost:27017/site', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(console.log("MongoDB connected..."))
.catch(err => console.error(err));

app.use(express.static(path.join(__dirname, 'static')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(session({
    secret: 'Ksnakes123',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session())
app.use(flash());
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
})
app.use((req, res, next) => {
    res.locals.user = req.user;
    req.user ? res.locals.userername = req.user.username : res.locals.username = 'No User'
    res.locals.user = req.user
    next()
})
app.use('/admin', adminRouter)
app.use('/account', accountRouter)
app.use('/user', userRouter)
app.use('/albums', albumsRouter)
app.use('/album', albumRouter)
app.use('/', redirectsRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})