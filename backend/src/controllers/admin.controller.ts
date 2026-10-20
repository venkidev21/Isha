import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';

export class AdminController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getDashboardMetrics();
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, categoryId, page, limit } = req.query as any;
      const data = await AdminService.getProductsAdmin({
        search,
        categoryId,
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 15,
      });
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await AdminService.createProduct({
        ...req.body,
        adminUserId: req.user?.id,
      });
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await AdminService.updateProduct(
        req.params.id as string,
        req.body,
        req.user?.id
      );
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteProduct(req.params.id as string);
      res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async adjustInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { changeQuantity, reason } = req.body;
      const product = await AdminService.adjustInventory(
        req.params.id as string,
        parseInt(changeQuantity, 10),
        reason,
        req.user?.id
      );
      res.json({
        success: true,
        message: 'Inventory updated successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, search, page, limit } = req.query as any;
      const data = await AdminService.getOrdersAdmin({
        status,
        search,
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 15,
      });
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const order = await AdminService.updateOrderStatus(
        req.params.id as string,
        status,
        req.user?.id
      );
      res.json({
        success: true,
        message: `Order status updated to ${status}`,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getInventoryHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.query.productId as string;
      const logs = await AdminService.getInventoryHistory(productId);
      res.json({
        success: true,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  }
}
