import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service.js';

function getCartIdentifier(req: Request) {
  const userId = req.user?.id;
  const sessionId = (req.headers['x-session-id'] as string) || (req.query.sessionId as string);
  return { userId, sessionId };
}

export class CartController {
  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = getCartIdentifier(req);
      const cart = await CartService.getCart(identifier);
      res.json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = getCartIdentifier(req);
      const { productId, quantity } = req.body;
      const cart = await CartService.addToCart(identifier, productId, quantity || 1);
      res.json({
        success: true,
        message: 'Product added to cart',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = getCartIdentifier(req);
      const { quantity } = req.body;
      const cart = await CartService.updateQuantity(identifier, req.params.itemId as string, quantity);
      res.json({
        success: true,
        message: 'Cart updated',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = getCartIdentifier(req);
      const cart = await CartService.removeItem(identifier, req.params.itemId as string);
      res.json({
        success: true,
        message: 'Item removed from cart',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = getCartIdentifier(req);
      const cart = await CartService.clearCart(identifier);
      res.json({
        success: true,
        message: 'Cart cleared',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async mergeGuestCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.body;
      if (req.user && sessionId) {
        await CartService.mergeGuestCart(req.user.id, sessionId);
      }
      res.json({ success: true, message: 'Cart synchronized' });
    } catch (error) {
      next(error);
    }
  }
}
