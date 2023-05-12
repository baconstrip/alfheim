import { Router, Request, Response } from 'express';
import { userFromRequest } from '../../services/userdb';
const loggedin = require('connect-ensure-login');

const gameRoute = Router();

export default (route: Router) => {
    route.use('/game', gameRoute);

    gameRoute.get('/', 
        loggedin.ensureLoggedIn(),
        (req: Request, res: Response) => {
            res.render('game', { 
                part: "param", 
                username: userFromRequest(req).username,
                gamejs: true
            });
        }
    );
};