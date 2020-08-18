import { Router } from 'express';
import home from './routes/home';
import auth from './routes/authenticate'
import game from './routes/game';


export default () => {
    const route = Router();
    auth(route);
    home(route);
    game(route);

    return route;
}