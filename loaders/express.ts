import * as express from 'express';
import bodyParser from 'body-parser';
const expressSession = require('express-session');

import routes from '../api';
const passport = require('passport');

const hbs = require('express-handlebars');

export default async ({ app } : { app: express.Application}) => {
    const esSession = expressSession({ 
        secret: 'keyboard cat', 
        resave: false, 
        saveUninitialized: false 
    });
    app.use(esSession); 
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    //app.set('views', 'views/');
    app.engine('.hbs', hbs({
        extname: '.hbs',
        //defaultLayout: 'index',
        //layoutsDir: __dirname + 'layouts/',
        //partialsDir: __dirname + 'partials/'
    }));
    app.set('view engine', '.hbs');
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/static', express.static('static'));
    app.use('/', routes());


    //app.get('/login', (req,res) => res.render('login', {part: "param", layout: false}));
    //app.get('/game', (req,res) => res.render('game'));

    return esSession
};