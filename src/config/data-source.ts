import { DataSource } from "typeorm";
import path from 'path';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mssql', 
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '1433'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [path.join(__dirname, '../database/entities/**/*.entity{.ts,.js}')],
    synchronize: false, 
    logging: false,
    extra: {
        trustServerCertificate: true,
    },
    options: {
        encrypt: true,
    }
});

export const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log(colors.cyan.bold('Conexión exitosa a la base de datos.'));
    } catch (error) {
        console.log(colors.red.bold('Error al conectar a la base de datos:'));
        console.error(error);
        process.exit(1);
    }
};