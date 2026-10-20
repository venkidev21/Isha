import { Router } from 'express';
import { z } from 'zod';
import { CartController } from '../controllers/cart.controller.js';
import { optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const addItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

router.use(optionalAuth);

router.get('/', CartController.getCart);
router.post('/items', validate({ body: addItemSchema }), CartController.addToCart);
router.put('/items/:itemId', validate({ body: updateItemSchema }), CartController.updateQuantity);
router.delete('/items/:itemId', CartController.removeItem);
router.delete('/', CartController.clearCart);
router.post('/sync', CartController.mergeGuestCart);

export default router;
