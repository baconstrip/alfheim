import express from 'express';

const app = express();

const PORT = 8054;

app.get('/', (req,res) => res.send('test page'));
app.listen(PORT, () => {
    console.log('Server is up...')
});