import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service.js';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        search,
        category,
        categoryId,
        minPrice,
        maxPrice,
        inStock,
        featured,
        sortBy,
        page,
        limit,
      } = req.query as any;

      const result = await ProductService.getProducts({
        search: search ? String(search) : undefined,
        categorySlug: category ? String(category) : undefined,
        categoryId: categoryId ? String(categoryId) : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        inStock: inStock === 'true',
        isFeatured: featured === 'true' ? true : undefined,
        sortBy,
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 12,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductBySlug(req.params.slug as string);
      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
      const products = await ProductService.getFeaturedProducts(limit);
      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRelated(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, categoryId } = req.query as { productId: string; categoryId: string };
      const products = await ProductService.getRelatedProducts(productId, categoryId);
      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }
}
