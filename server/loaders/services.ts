import dialogmanager from '../services/dialogmanager';
import notebook from '../game/player/notebook';
import players from '../game/player/players';
import worlds from '../services/worlds';

export default async ({}) => {
    await worlds({});
    console.log('Loaded worlds from definitions');
    await players({});
    await dialogmanager();
    await notebook({});
}