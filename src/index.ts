import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import connectDB from '../config/database';
import Routes from './routes';

import { RetrunValidation } from './middleware/validation';
import { WHITE_LIST, PORT } from './config';

const app = express();

connectDB();

app.set('port', PORT);
app.use(
  cors({
    origin: JSON.parse(WHITE_LIST as string)
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', Routes);
app.use('/uploads', express.static('./uploads'));
app.use('/NFTAssets', express.static('./NFTAssets'));

app.use(RetrunValidation);

const http = require('http').createServer(app);
http.listen(PORT);
console.log('server listening on:', PORT);
