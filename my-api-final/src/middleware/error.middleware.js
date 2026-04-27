// src/middleware/error.middleware.js

export const notFound = (req, res, next) => {
  res.status(404).json({
    error: true,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
};

export const handleHttpError = (res, message, status) => {
    res.status(status).json({
      error: message
    });
};