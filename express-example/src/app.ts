import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
require('dotenv').config();

import * as middlewares from './middlewares';
import api from './api';

import path from 'path';



const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// serving static frontend files


app.use('/', express.static(path.join(__dirname, '..', 'frontend', 'dist')));

app.use('/api', api);


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
