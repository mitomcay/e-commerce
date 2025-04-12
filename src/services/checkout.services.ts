import express, { Request, Response } from "express";
import { AppDataSource } from "@config/data-source";
import OrderItem from "@entities/OrderItem";
import { checkZaloPayStatus, createZaloPayOrder } from "@config/zalopay";
import crypto from 'crypto';
import Product from "@entities/Product";

const orderitemRepository = AppDataSource.getRepository(OrderItem);

interface Result {
    return_code: number;
    return_message: string;
}

class checkoutService {
    static async createPayment(req: any, res: Response): Promise<any> {
        try {
            let { products, total, billingInfo } = req.body;

            if (!req.session || !req.session._user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (typeof products === 'string') {
                try {
                    products = JSON.parse(products);
                } catch (error) {
                    console.error("Invalid JSON format:", error);
                    return res.status(400).json({ message: "Invalid product data format" });
                }
            }

            const newOrder = new OrderItem();
            newOrder.user = req.session._user;

            newOrder.items = products.map((product: any) => ({
                productId: product.id,
                name: product.ProductName,
                price: product.Price,
                color: product.Color,
                size: product.Size,
                quantity: product.ProductCount,
            }));

            newOrder.shippingAddress = {
                firstName: billingInfo.firstName,
                lastName: billingInfo.lastName,
                phone: billingInfo.phone,
                address1: billingInfo.address1,
                address2: billingInfo.address2 || "",
                ward: billingInfo.ward,
                city: billingInfo.city,
                district: billingInfo.district,
                zip: billingInfo.zip,
            };

            newOrder.totalAmount = total;
            newOrder.status = "Pending";
            newOrder.app_trans_id = '';

            await orderitemRepository.save(newOrder);

            const orderId = `ORDER_${newOrder.id}`;
            const { response, app_trans_id } = await createZaloPayOrder(total, orderId);

            newOrder.app_trans_id = app_trans_id;
            await orderitemRepository.save(newOrder);

            return res.status(200).json({ message: 'payment-success', response, app_trans_id });

        } catch (error) {
            console.error("Error during checkout:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async createPaymentMoMo(req: Request, res: Response): Promise<any> {
        try {
            let { products, total, billingInfo } = req.body;

            if (!req.session || !req.session._user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (typeof products === 'string') {
                try {
                    products = JSON.parse(products);
                } catch (error) {
                    console.error("Invalid JSON format:", error);
                    return res.status(400).json({ message: "Invalid product data format" });
                }
            }

            const newOrder = new OrderItem();
            newOrder.user = req.session._user;

            newOrder.items = products.map((product: any) => ({
                productId: product.id,
                name: product.ProductName,
                price: product.Price,
                color: product.Color,
                size: product.Size,
                quantity: product.ProductCount,
            }));

            newOrder.shippingAddress = {
                firstName: billingInfo.firstName,
                lastName: billingInfo.lastName,
                phone: billingInfo.phone,
                address1: billingInfo.address1,
                address2: billingInfo.address2 || "",
                ward: billingInfo.ward,
                city: billingInfo.city,
                district: billingInfo.district,
                zip: billingInfo.zip,
            };

            newOrder.totalAmount = total;
            newOrder.status = "Shipping";
            newOrder.app_trans_id = 'MoMo_123';

            await orderitemRepository.save(newOrder);

            return res.status(200).json({ message: "Success" });

        } catch (e) {
            console.error("Error during MoMo payment creation:", e);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async checkPaymentStatus(req: Request, res: Response) {
        try {
            const app_trans_id = req.params.app_trans_id;
            const { response } = await checkZaloPayStatus(app_trans_id);

            const return_code = Number(response.data.return_code);
            await checkoutService.updateOrderStatus(app_trans_id, return_code);

            return res.status(200).json({ response: response.data });
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Error in checkPaymentStatus:", err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    static async paymentCallback(req: Request, res: Response) {
        const config = {
            key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
        };

        let result: Result = {
            return_code: 0,
            return_message: ""
        };

        try {
            const dataStr = req.body.data;
            const reqMac = req.body.mac;

            const mac = crypto.createHmac('sha256', config.key2).update(dataStr).digest('hex');

            if (reqMac !== mac) {
                result.return_code = -1;
                result.return_message = "failed";
                return res.status(400).json(result);
            }

            const dataJson = JSON.parse(dataStr);
            const app_trans_id = dataJson["app_trans_id"];

            await checkoutService.updateOrderStatus(app_trans_id, 1);
            result.return_code = 1;
            result.return_message = "success";

            return res.status(200).json(result);

        } catch (ex) {
            result.return_code = 0;
            result.return_message = (ex instanceof Error ? ex.message : String(ex)) || "Unknown error";
            return res.status(500).json(result);
        }
    }

    static async updateOrderStatus(app_trans_id: string, return_code: number) {
        try {
            const order = await AppDataSource.getRepository(OrderItem).findOne({
                where: { app_trans_id }
            });

            if (!order) {
                console.error(`❌ Order not found with app_trans_id: ${app_trans_id}`);
                return;
            }

            if (return_code === 1) {
                order.status = "Shipping";

                for (const item of order.items) {
                    const product = await AppDataSource.getRepository(Product).findOne({
                        where: { id: +(item.productId) }
                    });

                    if (product && product.ProductCount !== undefined) {
                        product.ProductCount -= item.quantity;
                        await AppDataSource.getRepository(Product).save(product);
                    }
                }

            } else if (return_code === 2) {
                order.status = "Failed";
            } else {
                order.status = "Pending";
            }

            await AppDataSource.getRepository(OrderItem).save(order);

        } catch (error) {
            console.error("Error updating order status:", error);
        }
    }
}

export default checkoutService;
