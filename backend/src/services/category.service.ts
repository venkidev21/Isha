import prisma from '../db/client.js';
import { AppError } from '../middleware/error.js';

export class CategoryService {
  static async getCategories(includeCount = true) {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: includeCount
        ? {
            _count: {
              select: { products: { where: { isActive: true } } },
            },
          }
        : undefined,
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      sortOrder: cat.sortOrder,
      productCount: (cat as any)._count?.products ?? 0,
    }));
  }

  static async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return {
      ...category,
      productCount: category._count.products,
    };
  }

  static async createCategory(data: {
    name: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    sortOrder?: number;
  }) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await prisma.category.findFirst({
      where: { OR: [{ slug }, { name: data.name }] },
    });

    if (existing) {
      throw new AppError('A category with this name or slug already exists', 409);
    }

    return prisma.category.create({
      data: {
        name: data.name.trim(),
        slug,
        description: data.description?.trim(),
        imageUrl: data.imageUrl,
        sortOrder: data.sortOrder || 0,
      },
    });
  }

  static async updateCategory(id: string, data: Partial<{
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    sortOrder: number;
    isActive: boolean;
  }>) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      throw new AppError(`Cannot delete category with ${count} active products. Reassign products first.`, 400);
    }
    return prisma.category.delete({ where: { id } });
  }
}
