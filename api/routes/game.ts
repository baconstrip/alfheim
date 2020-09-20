import { Router, Request, Response } from 'express';
import { userFromRequest } from '../../services/userdb';
import { AlfInternalEvent } from '../../types/events';
import { InternalEventBus } from '../../services/internalevents';
const loggedin = require('connect-ensure-login');

const gameRoute = Router();

export default (route: Router) => {
    route.use('/game', gameRoute);

    gameRoute.get('/', 
        loggedin.ensureLoggedIn(),
        (req: Request, res: Response) => {
            console.log((req as any).isAuthenticated())
            res.render('game', { 
                part: "param", 
                username: userFromRequest(req).username,
                gamejs: true
            });
        }
    );
};