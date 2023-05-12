import dialogmanager from '../services/dialogmanager';
import notebook from '../services/player/notebook';
import players from '../services/players';
import worlds from '../services/worlds';

export default async ({}) => {
    await worlds({});
    console.log('Loaded worlds from definitions');
    await players({});
    await dialogmanager();
    await notebook({});
}