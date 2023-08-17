import { Router, Request, Response } from 'express';
import { userFromRequest } from '../services/userdb';
const loggedin = require('connect-ensure-login');

const homeRoute = Router();

export default (route: Router) => {
    route.use('/', homeRoute);

    homeRoute.get('/', 
        //loggedin.ensureLoggedIn(),
        (req: Request, res: Response) => {
            console.log((req as any).isAuthenticated())
            return res.render('index', { part: "param", username: userFromRequest(req)?.username });
        }
    );
};