import prisma from '../db/client.js';
import { AppError } from '../middleware/error.js';
import { ENV } from '../config/env.js';

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  userId?: string;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  billingAddress?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  paymentMethod: string;
  idempotencyKey?: string;
  items: CreateOrderItemInput[];
  notes?: string;
}

export class OrderService {
  static async calculatePreview(items: CreateOrderItemInput[]) {
    if (!items || items.length === 0) {
      throw new AppError('Order must contain at least one item', 400);
    }

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const verifiedItems = items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new AppError(`Product with ID ${item.productId} is not available`, 404);
      }
      if (item.quantity <= 0) {
        throw new AppError(`Invalid quantity for ${product.title}`, 400);
      }
      if (item.quantity > product.stock) {
        throw new AppError(
          `Insufficient stock for "${product.title}". Requested: ${item.quantity}, Available: ${product.stock}`,
          400
        );
      }

      const totalAmount = product.price * item.quantity;
      subtotal += totalAmount;

      return {
        productId: product.id,
        title: product.title,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        totalAmount,
        image: product.images[0]?.url || null,
        stock: product.stock,
      };
    });

    const taxTotal = Math.round(subtotal * ENV.TAX_RATE * 100) / 100;
    const shippingFee = subtotal >= ENV.FREE_SHIPPING_THRESHOLD ? 0 : ENV.DEFAULT_SHIPPING_FEE;
    const grandTotal = Math.round((subtotal + taxTotal + shippingFee) * 100) / 100;

    return {
      items: verifiedItems,
      subtotal,
      taxTotal,
      shippingFee,
      grandTotal,
      currency: ENV.CURRENCY,
    };
  }

  static async createOrder(data: CreateOrderInput) {
    if (data.idempotencyKey) {
      const existing = await prisma.order.findUnique({
        where: { idempotencyKey: data.idempotencyKey },
        include: { items: true },
      });
      if (existing) {
        return existing;
      }
    }

    // Execute atomic order transaction
    return prisma.$transaction(async (tx) => {
      // 1. Re-fetch products with lock/fresh state and verify stock
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { images: { where: { isPrimary: true }, take: 1 } },
        });

        if (!product || !product.isActive) {
          throw new AppError(`Product is no longer available`, 404);
        }

        if (product.stock < item.quantity) {
          throw new AppError(
            `Insufficient stock for "${product.title}". Available: ${product.stock}, Requested: ${item.quantity}`,
            400
          );
        }

        // Decrement stock
        const newStock = product.stock - item.quantity;
        await tx.product.update({
          where: { id: product.id },
          data: { stock: newStock },
        });

        const lineTotal = product.price * item.quantity;
        subtotal += lineTotal;

        orderItemsData.push({
          productId: product.id,
          productTitle: product.title,
          productSku: product.sku,
          unitPrice: product.price,
          quantity: item.quantity,
          totalAmount: lineTotal,
          productImage: product.images[0]?.url || null,
          snapshotData: JSON.stringify({
            title: product.title,
            sku: product.sku,
            price: product.price,
            description: product.description,
          }),
        });
      }

      const taxTotal = Math.round(subtotal * ENV.TAX_RATE * 100) / 100;
      const shippingFee = subtotal >= ENV.FREE_SHIPPING_THRESHOLD ? 0 : ENV.DEFAULT_SHIPPING_FEE;
      const grandTotal = Math.round((subtotal + taxTotal + shippingFee) * 100) / 100;

      const orderNumber = `SHOPNEST-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

      const isCod = data.paymentMethod === 'COD';

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: data.userId || null,
          guestEmail: data.guestEmail || null,
          guestName: data.guestName || null,
          guestPhone: data.guestPhone || null,
          status: isCod ? 'PENDING' : 'PAID',
          paymentStatus: isCod ? 'PENDING' : 'COMPLETED',
          paymentMethod: data.paymentMethod || 'DEVELOPMENT_MOCK',
          subtotal,
          taxTotal,
          shippingFee,
          discountTotal: 0,
          grandTotal,
          currency: ENV.CURRENCY,
          shippingAddress: JSON.stringify(data.shippingAddress),
          billingAddress: data.billingAddress ? JSON.stringify(data.billingAddress) : JSON.stringify(data.shippingAddress),
          idempotencyKey: data.idempotencyKey || null,
          notes: data.notes || null,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Record inventory adjustments for audit
      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (product) {
          await tx.inventoryAdjustment.create({
            data: {
              productId: item.productId,
              changeQuantity: -item.quantity,
              previousStock: product.stock + item.quantity,
              newStock: product.stock,
              reason: 'ORDER_PLACED',
              orderId: order.id,
              adminUserId: null,
            },
          });
        }
      }

      // If registered user, empty their persistent cart
      if (data.userId) {
        const userCart = await tx.cart.findUnique({ where: { userId: data.userId } });
        if (userCart) {
          await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
        }
      }

      return order;
    });
  }

  static async getCustomerOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });

    return orders.map((o) => ({
      ...o,
      shippingAddress: JSON.parse(o.shippingAddress),
      billingAddress: o.billingAddress ? JSON.parse(o.billingAddress) : null,
    }));
  }

  static async getOrderById(orderIdOrNumber: string, userId?: string, isAdmin = false) {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderIdOrNumber }, { orderNumber: orderIdOrNumber }],
      },
      include: {
        items: true,
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Security ownership check
    if (!isAdmin) {
      if (!userId || order.userId !== userId) {
        throw new AppError('Unauthorized access to this order', 403);
      }
    }

    return {
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress),
      billingAddress: order.billingAddress ? JSON.parse(order.billingAddress) : null,
    };
  }

  static async cancelOrder(orderId: string, userId?: string, isAdmin = false) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (!isAdmin && order.userId !== userId) {
      throw new AppError('Unauthorized to cancel this order', 403);
    }

    if (['SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status)) {
      throw new AppError(`Cannot cancel order in "${order.status}" status`, 400);
    }

    return prisma.$transaction(async (tx) => {
      // Restore inventory
      for (const item of order.items) {
        if (item.productId) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (product) {
            const restoredStock = product.stock + item.quantity;
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: restoredStock },
            });

            await tx.inventoryAdjustment.create({
              data: {
                productId: item.productId,
                changeQuantity: item.quantity,
                previousStock: product.stock,
                newStock: restoredStock,
                reason: 'ORDER_CANCELLED',
                orderId: order.id,
              },
            });
          }
        }
      }

      return tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          paymentStatus: order.paymentStatus === 'COMPLETED' ? 'REFUNDED' : 'FAILED',
        },
        include: { items: true },
      });
    });
  }
}
