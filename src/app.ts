import 'reflect-metadata'; 
import dotenv from 'dotenv';
import colors from 'colors';
import app from './server';
import { connectDB } from './config/data-source';

dotenv.config();

const port = process.env.PORT || 4000;

async function startApp() {
    // Conectar a Base de Datos primero
    await connectDB();

    // Iniciar Servidor
    app.listen(port, () => {
        console.log(colors.magenta.bold('Servidor iniciado correctamente'));
    });
}

startApp();