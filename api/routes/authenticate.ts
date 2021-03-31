import { Router, Request, Response, NextFunction } from 'express';
import { addUser, userFromRequest } from '../../services/userdb';
import { InternalEventBus } from '../../services/internalevents';
import { InternalEvent } from '../../types/internalevent';
const { body, validationResult } = require('express-validator');
const passport = require('passport');

const loginRoute = Router();

export default (route: Router) => {
    route.use('/login', loginRoute);

    loginRoute.get('/', (req: Request, res: Response) => {
        return res.render('login', { part: "param"});
    });

    loginRoute.get('/create', (req: Request, res: Response) => {
        return res.render('create', { part: "param"});
    });


    loginRoute.post('/ajax/auth', 
        [
            body('user').notEmpty().withMessage("No Username provided"),
            //body('pass').isLength({ min: 5 })
        ],
        passport.authenticate(
            'local'
        ),
        async (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors,
                })
            }
            console.log('got auth req with body ' + req.body.user);
            // Used to load player into live sessions.
            InternalEventBus.dispatch(InternalEvent.PLAYER_LOGIN, userFromRequest(req));

            return res.status(200).json(["hello"]);
        }
    );

    loginRoute.post('/ajax/create', 
        [
            body('user')
                .notEmpty().withMessage("Username must be provided")
                .isAlphanumeric().withMessage("Username must consist only of letters and numbers, no symbols, spaces, or punctuation"),
                //.isLength({ min: 4, max: 20}).withMessage("Username must be between 4 and 20 characters."),
            body('displayname')
                .notEmpty().withMessage("Display name must be provided")
                .isLength({ min: 4, max: 20}).withMessage("Display name must be between 4 and 20 characters.")
                .isAlpha().withMessage("Display name must only contain letters, and may not contain numbers, punctuation, symbols, or spaces."),
            body('discordname')
                .notEmpty().withMessage("Discord name must be provided")
                .matches(/^[a-z][a-z0-9]*\#[0-9]{4}$/i).withMessage('Provide your entire Discord name, including the four digits and #.')

            //body('pass').isLength({ min: 5 })
        ],
        async (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors,
                })
            }
            console.log('Creating user ' + req.body.user)

            try {
                const u = await addUser(req.body.user, req.body.pass, req.body.displayname, req.body.discordname);
                return res.status(200).json({
                    message: "Successfully registered " + u.displayname + " (" + u.username + ")."
                });
            } catch (e) {
                return res.status(400).json({
                    errors: e.message,
                });
            }

        }
    );
};