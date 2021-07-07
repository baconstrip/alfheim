import dialogmanager from '../services/dialogmanager';
import players from '../services/players';
import worlds from '../services/worlds';

export default async ({}) => {
    await worlds({});
    console.log('Loaded worlds from definitions');
    await players({});
    await dialogmanager();
}