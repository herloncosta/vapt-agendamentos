import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router } from './shared/infra/http/routes/index.js';
import { globalErrorHandler } from './shared/infra/http/middlewares/globalErrorHandler.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', router);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export { app };
