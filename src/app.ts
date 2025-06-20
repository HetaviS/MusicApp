/* eslint-disable semi */
/* eslint-disable indent */
import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import indexRoutes from './routes/index.routes';

const app: Application = express();

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser());

// Routes
app.use('/api', indexRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
    next();
});

export { app };
