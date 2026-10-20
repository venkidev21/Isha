import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service.js';

export class OrderController {
  static async calculatePreview(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;
      const preview = await OrderService.calculatePreview(items);
      res.json({
        success: true,
        data: preview,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const idempotencyKey = req.headers['idempotency-key'] as string;
      const order = await OrderService.createOrder({
        ...req.body,
        userId: req.user?.id,
        idempotencyKey,
      });

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrderService.getCustomerOrders(req.user!.id);
      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getOrderById(
        req.params.id as string,
        req.user?.id,
        req.user?.role === 'ADMIN'
      );
      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.cancelOrder(
        req.params.id as string,
        req.user?.id,
        req.user?.role === 'ADMIN'
      );
      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}
