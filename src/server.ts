import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mainRouter from './routes';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(morgan('dev')); 
app.use(express.json()); 

// Rutas de la API
app.use('/api', mainRouter);

// Manejador de rutas no encontradas (404)
app.use((_req, res) => {
    res.status(404).json({ msg: 'Ruta no encontrada' });
});

export default app;