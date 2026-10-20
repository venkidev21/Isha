import { Router } from 'express';
import { z } from 'zod';
import { OrderController } from '../controllers/order.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const addressInputSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().optional().default('India'),
});

const previewSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1),
    })
  ).min(1, 'Order preview must contain at least one product'),
});

const createOrderSchema = z.object({
  guestEmail: z.string().email().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  shippingAddress: addressInputSchema,
  billingAddress: addressInputSchema.optional(),
  paymentMethod: z.string().default('DEVELOPMENT_MOCK'),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1),
    })
  ).min(1, 'Order must contain at least one product'),
});

router.post('/preview', validate({ body: previewSchema }), OrderController.calculatePreview);
router.post('/', optionalAuth, validate({ body: createOrderSchema }), OrderController.createOrder);
router.get('/', requireAuth, OrderController.getMyOrders);
router.get('/:id', optionalAuth, OrderController.getOrderById);
router.post('/:id/cancel', optionalAuth, OrderController.cancelOrder);

export default router;
