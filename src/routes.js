import { Router } from 'express';
import { libro } from './controller.js';

export const router = Router()

router.get('/libros', libro.getAll);
router.post('/libro', libro.add);
router.delete('/libro', libro.delete);
router.put('/libro', libro.update);