import * as express from 'express';

const cons = require('consolidate');

export default async ({ app } : { app: express.Application}) => {
    app.use('/static', express.static('static'));
    app.engine('handlebars', cons.handlebars);
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/../views');

    app.get('/', (req,res) => res.render('index', {part: "param"}));
};