import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { authRoutes } from './modules/auth/auth.route';
import { issueRoutes } from './modules/issues/issues.route';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('DevPulse API is running');
});

// Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
