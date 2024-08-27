import express from 'express';
import morgan from 'morgan';
import {router} from './routes.js';

const app = express();

app.set('port', 3000);

app.use(morgan('dev'));
app.use(express.json());
app.use(router);

app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
})