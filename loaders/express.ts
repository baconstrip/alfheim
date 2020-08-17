import * as express from 'express';

const hbs = require('express-handlebars');

export default async ({ app } : { app: express.Application}) => {
    app.use('/static', express.static('static'));
    app.engine('.hbs', hbs({
        extname: '.hbs',
        defaultLayout: 'index',
        layoutsDir: __dirname + '/../views/',
        partialsDir: __dirname + '/../views/partials/'
    }));
    app.set('view engine', '.hbs');

    app.get('/', (req,res) => res.render('index', {part: "param"}));
    app.get('/game', (req,res) => res.render('game'));
};