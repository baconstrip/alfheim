import { Router } from 'express';
import home from './home';
import auth from './authenticate'
import game from './game';


export default () => {
    const route = Router();
    auth(route);
    home(route);
    game(route);

    return route;
}