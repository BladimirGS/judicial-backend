import { Response } from 'express';

export const ResponseUtil = {
    // Éxito estándar (200 OK)
    success: (res: Response, data: any, message: string = 'Operación exitosa') => {
        return res.status(200).json({
            status: 'success',
            message,
            data
        });
    },

    // Creación exitosa (201 Created)
    created: (res: Response, data: any, message: string = 'Recurso creado') => {
        return res.status(201).json({
            status: 'success',
            message,
            data
        });
    },

    // Error de cliente (400 Bad Request)
    badRequest: (res: Response, message: string = 'Datos inválidos') => {
        return res.status(400).json({
            status: 'error',
            message
        });
    },

    // No encontrado (404 Not Found)
    notFound: (res: Response, message: string = 'Recurso no encontrado') => {
        return res.status(404).json({
            status: 'error',
            message
        });
    },

    // Error de servidor (500 Internal Server Error)
    error: (res: Response, message: string = 'Error interno del servidor', error?: any) => {
        // En desarrollo incluimos el error real para debuguear
        const detail = process.env.NODE_ENV === 'development' ? error : undefined;
        return res.status(500).json({
            status: 'error',
            message,
            detail
        });
    }
};