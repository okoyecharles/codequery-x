import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRouter from './routes/userRoutes';
import questionRouter from './routes/questionRoutes';
import cors from 'cors';

import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({ origin: process.env.ORIGIN!, credentials: true }));
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/users', userRouter);
app.use('/questions', questionRouter);

connectDB().then(() => {
  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World from CodeQuery!');
  });
  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});
