import { Request, Response } from "express";
import OrderService from "@services/order.services";

// order.controller.ts
class OrderController {

    // Phương thức tĩnh getOrder
    static async getOrder(req: Request, res: Response): Promise<any> {
        await OrderService.getOrder(req, res);  // Gọi service để xử lý
    }

    static async getAllOrder(req: Request, res: Response): Promise<any> {
        await OrderService.getAllOrder(req, res);  // Gọi service để xử lý
    }

    static async updateOrder(req: Request, res: Response): Promise<any> {
        await OrderService.updateOrder(req, res);  // Gọi service để xử lý
    }

    static async ShipperCheckOrder(req: Request, res: Response): Promise<any> {
        await OrderService.ShipperCheckOrder(req, res);  // Gọi service để xử lý
    }

    static async OrderView(req: Request, res: Response): Promise<any> {
        await OrderService.OrderView(req, res);
    }

    static async AdminOrderView(req: Request, res: Response): Promise<any> {
        await OrderService.AdminOrderView(req, res);
    }

    static async CancelOrder(req: Request, res: Response){
        await OrderService.CancelOrder(req, res);
    }

    static async DeleteOrder(req: Request, res: Response){
        await OrderService.DeleteOrder(req, res);
    }

    static async AdminOrderPrint(req: Request, res: Response){
        await OrderService.AdminOrderPrint(req, res);
    }

    
}

export default OrderController;

