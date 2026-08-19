import noteRoutes from './routes/noteRoutes';
import loginRoutes from './routes/loginRoutes';
import userRoutes from './routes/userRoutes';
import cors from 'cors';
import { logger } from './middlewares/logger';
import express from 'express';
import aiRoutes from "./routes/aiRoutes";


const app = express();

app.use(cors({exposedHeaders: ['X-Total-Count']}));

app.use(express.json());

app.use(logger);

app.use('/', noteRoutes);
app.use('/', loginRoutes);
app.use('/', userRoutes);

app.use("/ai", aiRoutes);

export default app;