import prisma from '../db/client.js';
import { AppError } from '../middleware/error.js';

export interface ProductQueryOptions {
  search?: string;
  categorySlug?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  sortBy?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  page?: number;
  limit?: number;
}

export class ProductService {
  static async getProducts(options: ProductQueryOptions) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(50, Math.max(1, options.limit || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (options.search) {
      const q = options.search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { highlights: { contains: q } },
      ];
    }

    if (options.categoryId) {
      where.categoryId = options.categoryId;
    } else if (options.categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: options.categorySlug },
      });
      if (category) {
        where.categoryId = category.id;
      } else {
        return {
          products: [],
          total: 0,
          page,
          totalPages: 0,
          limit,
        };
      }
    }

    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      where.price = {};
      if (options.minPrice !== undefined) where.price.gte = options.minPrice;
      if (options.maxPrice !== undefined) where.price.lte = options.maxPrice;
    }

    if (options.inStock) {
      where.stock = { gt: 0 };
    }

    if (options.isFeatured !== undefined) {
      where.isFeatured = options.isFeatured;
    }

    let orderBy: any = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    if (options.sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (options.sortBy === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (options.sortBy === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (options.sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' } },
        },
      }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    };
  }

  static async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!product || !product.isActive) {
      throw new AppError('Product not found or unavailable', 404);
    }

    return product;
  }

  static async getFeaturedProducts(limit = 4) {
    return prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  static async getRelatedProducts(productId: string, categoryId: string, limit = 4) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        categoryId,
        id: { not: productId },
      },
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }
}
