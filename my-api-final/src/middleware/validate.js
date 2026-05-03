// src/middleware/validate.js
import { ZodError } from 'zod';

export const validate = (schema) => async (req, res, next) => {
  try {
    console.log(req.body)
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json({
        error: 'Validation error',
        details: errors
      });
    }
    next(error);
  }
};