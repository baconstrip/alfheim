import { Router, Request, Response, NextFunction } from 'express';
import { addUser } from '../../services/user';
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

            return res.status(200).json(["hello"]);
        }
    );

    loginRoute.post('/ajax/create', 
        [
            body('user')
                .notEmpty().withMessage("Username must be provided")
                //.isLength({ min: 4, max: 20}).withMessage("Username must be between 4 and 20 characters."),
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
                const u = await addUser(req.body.user, req.body.pass, req.body.displayname);
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