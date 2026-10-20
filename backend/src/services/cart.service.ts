import prisma from '../db/client.js';
import { AppError } from '../middleware/error.js';
import { ENV } from '../config/env.js';

export interface CartIdentifier {
  userId?: string;
  sessionId?: string;
}

export class CartService {
  private static async getOrCreateCart(identifier: CartIdentifier) {
    if (!identifier.userId && !identifier.sessionId) {
      throw new AppError('Cart requires a user account or guest session ID', 400);
    }

    let cart = await prisma.cart.findFirst({
      where: identifier.userId
        ? { userId: identifier.userId }
        : { sessionId: identifier.sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                category: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: identifier.userId || null,
          sessionId: identifier.userId ? null : identifier.sessionId || null,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  category: { select: { name: true } },
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  static async getCart(identifier: CartIdentifier) {
    const cart = await this.getOrCreateCart(identifier);

    // Calculate live verified server totals
    let subtotal = 0;
    const formattedItems = cart.items.map((item) => {
      const isAvailable = item.product.isActive && item.product.stock > 0;
      const actualStock = item.product.stock;
      const effectiveQuantity = Math.min(item.quantity, actualStock);
      const lineTotal = item.product.price * item.quantity;
      subtotal += lineTotal;

      return {
        id: item.id,
        productId: item.productId,
        title: item.product.title,
        slug: item.product.slug,
        sku: item.product.sku,
        price: item.product.price,
        compareAtPrice: item.product.compareAtPrice,
        image: item.product.images[0]?.url || null,
        categoryName: item.product.category.name,
        quantity: item.quantity,
        stock: item.product.stock,
        isAvailable,
        hasStockShortage: item.quantity > actualStock,
        lineTotal,
      };
    });

    const taxTotal = Math.round(subtotal * ENV.TAX_RATE * 100) / 100;
    const shippingFee = subtotal === 0 || subtotal >= ENV.FREE_SHIPPING_THRESHOLD ? 0 : ENV.DEFAULT_SHIPPING_FEE;
    const grandTotal = Math.round((subtotal + taxTotal + shippingFee) * 100) / 100;

    return {
      id: cart.id,
      items: formattedItems,
      itemCount: formattedItems.reduce((acc, i) => acc + i.quantity, 0),
      subtotal,
      taxTotal,
      shippingFee,
      freeShippingThreshold: ENV.FREE_SHIPPING_THRESHOLD,
      grandTotal,
      currency: ENV.CURRENCY,
    };
  }

  static async addToCart(identifier: CartIdentifier, productId: string, quantity = 1) {
    if (quantity <= 0) {
      throw new AppError('Quantity must be at least 1', 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new AppError('This product is currently unavailable', 404);
    }

    if (product.stock <= 0) {
      throw new AppError(`"${product.title}" is currently out of stock`, 400);
    }

    const cart = await this.getOrCreateCart(identifier);

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    const newQuantity = (existingItem?.quantity || 0) + quantity;

    if (newQuantity > product.stock) {
      throw new AppError(
        `Cannot add ${quantity} more. Only ${product.stock} available in stock (you have ${existingItem?.quantity || 0} in cart).`,
        400
      );
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(identifier);
  }

  static async updateQuantity(identifier: CartIdentifier, itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(identifier, itemId);
    }

    const cart = await this.getOrCreateCart(identifier);
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: true },
    });

    if (!item) {
      throw new AppError('Cart item not found', 404);
    }

    if (quantity > item.product.stock) {
      throw new AppError(
        `Only ${item.product.stock} units of "${item.product.title}" are available in stock.`,
        400
      );
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(identifier);
  }

  static async removeItem(identifier: CartIdentifier, itemId: string) {
    const cart = await this.getOrCreateCart(identifier);
    await prisma.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id },
    });
    return this.getCart(identifier);
  }

  static async clearCart(identifier: CartIdentifier) {
    const cart = await this.getOrCreateCart(identifier);
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    return this.getCart(identifier);
  }

  static async mergeGuestCart(userId: string, sessionId: string) {
    const guestCart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) return;

    let userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId },
      });
    }

    for (const gItem of guestCart.items) {
      const existing = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: userCart.id,
            productId: gItem.productId,
          },
        },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + gItem.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: gItem.productId,
            quantity: gItem.quantity,
          },
        });
      }
    }

    // Clean up guest cart
    await prisma.cart.delete({ where: { id: guestCart.id } });
  }
}
