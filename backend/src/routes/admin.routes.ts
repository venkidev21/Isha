import { Router } from 'express';
import { z } from 'zod';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth, requireAdmin);

const productAdminSchema = z.object({
  title: z.string().min(3, 'Product title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional().nullable(),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  lowStockThreshold: z.number().int().min(1).optional(),
  isFeatured: z.boolean().optional(),
  specifications: z.record(z.string(), z.string()).optional(),
  highlights: z.string().optional(),
  images: z.array(
    z.object({
      url: z.string().url(),
      altText: z.string().optional(),
      isPrimary: z.boolean().optional(),
      sortOrder: z.number().optional(),
    })
  ).optional(),
});

const inventoryAdjustSchema = z.object({
  changeQuantity: z.number().int(),
  reason: z.string().min(3, 'Adjustment reason is required'),
});

const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
});

router.get('/dashboard', AdminController.getDashboard);
router.get('/products', AdminController.getProducts);
router.post('/products', validate({ body: productAdminSchema }), AdminController.createProduct);
router.put('/products/:id', validate({ body: productAdminSchema.partial() }), AdminController.updateProduct);
router.delete('/products/:id', AdminController.deleteProduct);
router.post('/products/:id/inventory', validate({ body: inventoryAdjustSchema }), AdminController.adjustInventory);
router.get('/orders', AdminController.getOrders);
router.put('/orders/:id/status', validate({ body: orderStatusSchema }), AdminController.updateOrderStatus);
router.get('/inventory/history', AdminController.getInventoryHistory);

export default router;
