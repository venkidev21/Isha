import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

const googleAuthSchema = z.object({
  credential: z.string().min(1, 'Google credential token is required'),
});

const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2, 'Recipient full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().optional(),
  isDefault: z.boolean().optional(),
});

router.post('/register', validate({ body: registerSchema }), AuthController.register);
router.post('/login', validate({ body: loginSchema }), AuthController.login);
router.post('/google', validate({ body: googleAuthSchema }), AuthController.loginWithGoogle);
router.get('/me', requireAuth, AuthController.getProfile);
router.put('/me', requireAuth, AuthController.updateProfile);
router.get('/addresses', requireAuth, AuthController.getAddresses);
router.post('/addresses', requireAuth, validate({ body: addressSchema }), AuthController.addAddress);
router.delete('/addresses/:id', requireAuth, AuthController.deleteAddress);

export default router;
