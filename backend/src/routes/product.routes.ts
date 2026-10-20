import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/featured', ProductController.getFeatured);
router.get('/related', ProductController.getRelated);
router.get('/:slug', ProductController.getProductBySlug);

export default router;
