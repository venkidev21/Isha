import prisma from '../db/client.js';
import { AppError } from '../middleware/error.js';

export class AdminService {
  static async getDashboardMetrics() {
    const [
      totalOrders,
      paidOrders,
      allProducts,
      recentOrders,
      recentAdjustments,
      categoryStats,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        where: {
          status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
        },
        select: { grandTotal: true },
      }),
      prisma.product.findMany({
        select: { id: true, title: true, stock: true, lowStockThreshold: true, isActive: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
      prisma.inventoryAdjustment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { title: true, sku: true } } },
      }),
      prisma.category.findMany({
        select: {
          name: true,
          _count: { select: { products: true } },
        },
      }),
    ]);

    const totalRevenue = paidOrders.reduce((acc, o) => acc + o.grandTotal, 0);
    const lowStockProducts = allProducts.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
    const outOfStockProducts = allProducts.filter((p) => p.stock <= 0);

    return {
      summary: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalProducts: allProducts.length,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
      },
      lowStockProducts,
      recentOrders: recentOrders.map((o) => ({
        ...o,
        shippingAddress: JSON.parse(o.shippingAddress),
      })),
      recentAdjustments,
      categoryStats,
    };
  }

  static async getProductsAdmin(options: { search?: string; categoryId?: string; page?: number; limit?: number }) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(50, Math.max(1, options.limit || 15));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.search) {
      where.OR = [
        { title: { contains: options.search } },
        { sku: { contains: options.search } },
      ];
    }
    if (options.categoryId) {
      where.categoryId = options.categoryId;
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
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
    };
  }

  static async createProduct(data: {
    title: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    sku: string;
    categoryId: string;
    stock: number;
    lowStockThreshold?: number;
    isFeatured?: boolean;
    specifications?: Record<string, string>;
    highlights?: string;
    images?: Array<{ url: string; altText?: string; isPrimary?: boolean; sortOrder?: number }>;
    adminUserId?: string;
  }) {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existingSku) {
      throw new AppError(`SKU "${data.sku}" is already assigned to another product`, 409);
    }

    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          title: data.title,
          slug,
          description: data.description,
          price: data.price,
          compareAtPrice: data.compareAtPrice || null,
          sku: data.sku,
          categoryId: data.categoryId,
          stock: data.stock,
          lowStockThreshold: data.lowStockThreshold || 5,
          isFeatured: !!data.isFeatured,
          specifications: data.specifications ? JSON.stringify(data.specifications) : null,
          highlights: data.highlights || null,
        },
      });

      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          const img = data.images[i];
          await tx.productImage.create({
            data: {
              productId: product.id,
              url: img.url,
              altText: img.altText || product.title,
              isPrimary: img.isPrimary !== undefined ? img.isPrimary : i === 0,
              sortOrder: img.sortOrder || i + 1,
            },
          });
        }
      }

      await tx.inventoryAdjustment.create({
        data: {
          productId: product.id,
          changeQuantity: data.stock,
          previousStock: 0,
          newStock: data.stock,
          reason: 'ADMIN_CREATION',
          adminUserId: data.adminUserId || null,
        },
      });

      return tx.product.findUnique({
        where: { id: product.id },
        include: { images: true, category: true },
      });
    });
  }

  static async updateProduct(id: string, data: any, adminUserId?: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const { images, stock, specifications, ...updateFields } = data;

    return prisma.$transaction(async (tx) => {
      // Check stock difference
      if (stock !== undefined && stock !== product.stock) {
        const change = stock - product.stock;
        await tx.inventoryAdjustment.create({
          data: {
            productId: id,
            changeQuantity: change,
            previousStock: product.stock,
            newStock: stock,
            reason: 'ADMIN_MANUAL_UPDATE',
            adminUserId: adminUserId || null,
          },
        });
        updateFields.stock = stock;
      }

      if (specifications !== undefined) {
        updateFields.specifications = typeof specifications === 'object' ? JSON.stringify(specifications) : specifications;
      }

      const updated = await tx.product.update({
        where: { id },
        data: updateFields,
        include: { images: true, category: true },
      });

      if (images && Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          await tx.productImage.create({
            data: {
              productId: id,
              url: img.url,
              altText: img.altText || updated.title,
              isPrimary: img.isPrimary !== undefined ? img.isPrimary : i === 0,
              sortOrder: img.sortOrder || i + 1,
            },
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: { images: true, category: true },
      });
    });
  }

  static async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    await prisma.product.delete({ where: { id } });
    return { success: true };
  }

  static async adjustInventory(productId: string, changeQuantity: number, reason: string, adminUserId?: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const newStock = product.stock + changeQuantity;
    if (newStock < 0) {
      throw new AppError(`Cannot reduce inventory below 0. Current stock: ${product.stock}`, 400);
    }

    return prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      await tx.inventoryAdjustment.create({
        data: {
          productId,
          changeQuantity,
          previousStock: product.stock,
          newStock,
          reason: reason || 'MANUAL_RESTOCK',
          adminUserId: adminUserId || null,
        },
      });

      return updatedProduct;
    });
  }

  static async getOrdersAdmin(options: { status?: string; search?: string; page?: number; limit?: number }) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(50, Math.max(1, options.limit || 15));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.status) {
      where.status = options.status;
    }
    if (options.search) {
      where.OR = [
        { orderNumber: { contains: options.search } },
        { guestEmail: { contains: options.search } },
        { guestName: { contains: options.search } },
        { user: { email: { contains: options.search } } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
    ]);

    return {
      orders: orders.map((o) => ({
        ...o,
        shippingAddress: JSON.parse(o.shippingAddress),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async updateOrderStatus(orderId: string, status: string, adminUserId?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const validTransitions: Record<string, string[]> = {
      PENDING: ['PAID', 'CANCELLED'],
      PAID: ['PROCESSING', 'CANCELLED', 'REFUNDED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: ['REFUNDED'],
      CANCELLED: [],
      REFUNDED: [],
    };

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(status)) {
      throw new AppError(`Cannot transition order from status "${order.status}" to "${status}"`, 400);
    }

    return prisma.$transaction(async (tx) => {
      // If transition to CANCELLED, restore inventory
      if (status === 'CANCELLED') {
        for (const item of order.items) {
          if (item.productId) {
            const product = await tx.product.findUnique({ where: { id: item.productId } });
            if (product) {
              const restored = product.stock + item.quantity;
              await tx.product.update({
                where: { id: item.productId },
                data: { stock: restored },
              });
              await tx.inventoryAdjustment.create({
                data: {
                  productId: item.productId,
                  changeQuantity: item.quantity,
                  previousStock: product.stock,
                  newStock: restored,
                  reason: 'ORDER_STATUS_CANCELLED',
                  orderId: order.id,
                  adminUserId: adminUserId || null,
                },
              });
            }
          }
        }
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status,
          ...(status === 'DELIVERED' && { paymentStatus: 'COMPLETED' }),
          ...(status === 'CANCELLED' && { paymentStatus: order.paymentStatus === 'COMPLETED' ? 'REFUNDED' : 'FAILED' }),
        },
        include: { items: true },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: adminUserId || null,
          action: 'STATUS_CHANGE',
          entityType: 'ORDER',
          entityId: order.id,
          metadata: JSON.stringify({ from: order.status, to: status }),
        },
      });

      return updated;
    });
  }

  static async getInventoryHistory(productId?: string) {
    return prisma.inventoryAdjustment.findMany({
      where: productId ? { productId } : undefined,
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { title: true, sku: true } },
      },
    });
  }
}
