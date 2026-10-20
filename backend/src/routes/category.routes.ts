import { Router } from 'express';
import { z } from 'zod';
import { CategoryController } from '../controllers/category.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

router.get('/', CategoryController.getCategories);
router.get('/:slug', CategoryController.getCategoryBySlug);

router.post('/', requireAuth, requireAdmin, validate({ body: categorySchema }), CategoryController.createCategory);
router.put('/:id', requireAuth, requireAdmin, validate({ body: categorySchema.partial() }), CategoryController.updateCategory);
router.delete('/:id', requireAuth, requireAdmin, CategoryController.deleteCategory);

export default router;
