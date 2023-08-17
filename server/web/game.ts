import { Router, Request, Response } from 'express';
import * as express from 'express';
import { userFromRequest } from '../services/userdb';
const loggedin = require('connect-ensure-login');

const gameRoute = Router();

export default (route: Router) => {
    route.use('/game', gameRoute);

    gameRoute.get('/', 
        loggedin.ensureLoggedIn(),
        express.static('../client/static/out/game.html')
    );
};