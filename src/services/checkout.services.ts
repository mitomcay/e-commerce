import express, { Request, Response } from "express";
import { AppDataSource } from "@config/data-source";
import OrderItem from "@entities/OrderItem";
import { json } from "body-parser";
import { checkZaloPayStatus, createZaloPayOrder } from "@configzalopay";
import axios from "axios";
import crypto from 'crypto';
import Product from "@entitiesProduct";
const orderitemRepository = AppDataSource.getRepository(OrderItem);

interface Result {
    return_code: number;
    return_message: string;
}

class checkoutService {
    static async createPayment(req: any, res: Response): Promise<any> {
        try {
            let { products, total, billingInfo } = req.body;
            // console.log(products, total, billingInfo);
            // console.log("Type of Products:", typeof products);
            if (!req.session || !req.session._user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (typeof products === 'string') {
                try {
                    products = JSON.parse(products);  // Parse chuỗi thành mảng
                } catch (error) {
                    console.error("Invalid JSON format:", error);
                    return; // Xử lý lỗi nếu JSON không hợp lệ
                }
            }

            // Tạo đơn hàng mới
            const newOrder = new OrderItem();
            newOrder.user = req.session._user;

            // Sửa lỗi: Gán tất cả sản phẩm vào `items` thay vì chỉ lưu sản phẩm cuối cùng
            newOrder.items = products.map(( product: any )=> ({
                productId: product.id,
                name: product.ProductName,
                price: product.Price,
                color: product.Color,
                size: product.Size,
                quantity: product.ProductCount,
            }));

            // Gán địa chỉ giao hàng
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

            // Lưu vào database
            await orderitemRepository.save(newOrder);

            const orderId = `ORDER_${newOrder.id}`;
            // console.log(1); 
            const { response, app_trans_id } = await createZaloPayOrder(total, orderId);

            // Save app_trans_id for order in db
            newOrder.app_trans_id = app_trans_id;
            await orderitemRepository.save(newOrder);

            // console.log(2, response);
            res.status(200).json({ message:'payment-success', response: response, app_trans_id: app_trans_id  });

        } catch (error) {
            console.error("Error during checkout:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async createPaymentMoMo(req: Request, res: Response): Promise<any>{
        try {
            let { products, total, billingInfo } = req.body;
            // console.log(products, total, billingInfo);
            // console.log("Type of Products:", typeof products);
            if (!req.session || !req.session._user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (typeof products === 'string') {
                try {
                    products = JSON.parse(products);  // Parse chuỗi thành mảng
                } catch (error) {
                    console.error("Invalid JSON format:", error);
                    return; // Xử lý lỗi nếu JSON không hợp lệ
                }
            }

            // Tạo đơn hàng mới
            const newOrder = new OrderItem();
            newOrder.user = req.session._user;

            // Sửa lỗi: Gán tất cả sản phẩm vào `items` thay vì chỉ lưu sản phẩm cuối cùng
            newOrder.items = products.map(( product: any )=> ({
                productId: product.id,
                name: product.ProductName,
                price: product.Price,
                color: product.Color,
                size: product.Size,
                quantity: product.ProductCount,
            }));

            // Gán địa chỉ giao hàng
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

            // Lưu vào database
            await orderitemRepository.save(newOrder);
            res.status(200).json({ message: "Success" });
        } catch (e){
            console.error("Error during checking payment status:", e);
        }
    }

    static async checkPaymentStatus(req: Request, res: Response) {
        try {
            const app_trans_id = req.params.app_trans_id;
            console.log(app_trans_id);
            // console.log(2);
            const { response } = await checkZaloPayStatus(app_trans_id);
            // console.log(2, response.data);
            // console.log(3);
            console.log(typeof response.data.return_code);
            if(response.data.return_code == 1){
                // Update order's status = success where app_trans_id = app_trans_id
                await checkoutService.updateOrderStatus(app_trans_id, +(response.data.return_code));
                return res.status(200).json({ response: response.data });
            } else if(response.data.return_code == 2){
                await checkoutService.updateOrderStatus(app_trans_id, +(response.data.return_code));
                return res.status(200).json({ response: response.data });
            } else {
                await checkoutService.updateOrderStatus(app_trans_id, +(response.data.return_code));
                return res.status(200).json({ response: response.data });
            }
            
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Error in checkPaymentStatus:", err.message);
            return res.status(500).json({ error: err.message });
        }
        
    }

    static async paymentCallback(req: Request, res: Response){
        const config = {
            key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
        };
        
        let result: Result = {
            return_code: 0, // Default value for the return code
            return_message: "" // Default value for the return message
        };

        try {
            let dataStr = req.body.data;
            let reqMac = req.body.mac;

            let mac = crypto.createHmac('sha256', config.key2).update(dataStr).digest('hex');
            // console.log("mac =", mac);

            let app_trans_id;
            // console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

            if (reqMac !== mac) {
                result.return_code = -1;
                result.return_message = "failed";
            }
            else {
                let dataJson = JSON.parse(dataStr);

                if(dataJson["app_trans_id"]){
                    app_trans_id = dataJson["app_trans_id"];
                }
                result.return_code = 1;
                result.return_message = "success";
                // console.log(app_trans_id);
                await checkoutService.updateOrderStatus(app_trans_id, +(result.return_code));
            }

            // console.log(app_trans_id);
            // res.redirect(`/check/${app_trans_id}`);

        } catch (ex) {
            result.return_code = 0; 
            result.return_message = (ex instanceof Error ? ex.message : String(ex)) || "Lỗi không xác định";
        }
        res.status(200).json(result);
    }

    static async updateOrderStatus(app_trans_id: string, return_code: Number) {
        try {
            console.log(app_trans_id, return_code);
            const order = await AppDataSource.getRepository(OrderItem).findOne({
                where: {app_trans_id: app_trans_id }
            });

            if (!order) {
                console.error(`❌ Order not found with app_trans_id: ${app_trans_id}`);
                return; // Không tiếp tục nếu không tìm thấy đơn hàng
            }
            if(return_code === 1){
                order.status = "Shipping";
                order.items.forEach(async (item) => {
                    // console.log(item.productId);
                    const product = await AppDataSource.getRepository(Product).findOne({
                        where: {id: +(item.productId)}
                    });
                    if (product && product.ProductCount !== undefined) {
                        product.ProductCount -= item.quantity;
                        await AppDataSource.getRepository(Product).save(product);
                    } 
                });
            }
            else if(return_code === 2){
                order.status = 
                "Failed";
            }
            else{
                order.status = "Pending";
            }
    
            await AppDataSource.getRepository(OrderItem).save(order);
    
            // console.log(`Order ${order.id} status updated by ${order.status}`);
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    }
    
}

export default checkoutService;
