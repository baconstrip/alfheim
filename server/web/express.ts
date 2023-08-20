import * as express from 'express';
import bodyParser from 'body-parser';
const expressSession = require('express-session');

import routes from './routes';
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

    app.set('views', 'web/views/');
    app.engine('.hbs', hbs({
        extname: '.hbs',
    }));
    app.set('view engine', '.hbs');
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/static', express.static('../client/static/js'), express.static('../client/static/out'));
    app.use('/', routes());

    return esSession
};