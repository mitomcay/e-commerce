import { AppDataSource } from "@configdata-source";
import Cart from "@entitiesCart";
import OrderItem from "@entitiesOrderItem";
import User, { UserRole } from "@entitiesUser";
import { Request, Response } from "express";
import axios from "axios";


class OrderService{ 

    static async getOrder(req: Request, res: Response): Promise<any>{
        try{    
            const userId = req.session._user?.id;
            if(!userId){
                return res.status(401).json({ message: "User is not authenticated" });
            }
            
            const  order = await AppDataSource.getRepository(OrderItem).find({
                where: {user: {id: userId}},
            })
            if(!order){
                return res.status(404).json({ message: "Order not found" });
            }

            res.status(200).json({order: order});
        } catch(e) {
            console.error("Error fetching order:", e);
            res.status(500).json({ message: 'Error fetching order', error: e });
        }
    }

    static async ShipperCheckOrder(req: Request, res: Response): Promise<any>{
        try{    
            // check order by scan QR Code
        } catch (e) {
            console.error("Error fetching order:", e);
            res.status(500).json({ message: 'Error fetching order', error: e });
        }
    }

    static async getAllOrder(req: Request, res: Response): Promise<any>{
        try{    
            const userId = req.session._user?.id;
            if(!userId){
                return res.status(401).json({ message: "User is not authenticated" });
            }
            if(req.session._user?.Role !== UserRole.Admin){
                return res.status(403).json({ message: "User is not authorized" });
            }
            
            const  order = await AppDataSource.getRepository(OrderItem).find({
                relations: ['user']
            })
            if(!order){
                return res.status(404).json({ message: "Order not found" });
            }

            res.status(200).json({order: order});
        } catch(e) {
            console.error("Error fetching order:", e);
            res.status(500).json({ message: 'Error fetching order', error: e });
        }
    }

    static async updateOrder(req: Request, res: Response): Promise<any>{
        try{
            const {orderid, status } = req.body;
            const order = await AppDataSource.getRepository(OrderItem).findOne({
                where: {id: orderid},
            }); 

            if(!order){
                return res.status(404).json({ message: 'Order not found' });
            }

            order.status = status;
            
            await AppDataSource.getRepository(OrderItem).save(order);
        }catch(e){
            console.error("Error updating order:", e);
            res.status(500).json({ message: 'Error updating order', error: e });
        }
    }

    static async OrderView(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            // console.log(id);
            if(!req.session._user){
                res.redirect('/login');
            }

            const order = await AppDataSource.getRepository(OrderItem).findOne({
                where: {id: id, user: { id: req.session._user?.id}},
                relations: ['user']
            });

            if(!order) {
                res.status(404).json({message: 'Error fetching order'})
            }
            const location = await OrderService.getLocationName(
                order?.shippingAddress?.ward || '',
                order?.shippingAddress?.district || '',
                order?.shippingAddress?.city || ''
            );

            res.render('./shop/orderdetail', { order, location });
        } catch(e) {
            console.error("Error fetching order view:", e);
            res.status(500).json({ message: 'Error fetching order view', error: e });
        }
    }

    static async AdminOrderView(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            // console.log(id);
            if(!req.session._user){
                res.redirect('/login');
            }

            if(req.session._user?.Role != UserRole.Admin){
                return res.status(403).json({ message: 'User is not authorized' });
            }

            const order = await AppDataSource.getRepository(OrderItem).findOne({
                where: {id: id},
                relations: ['user']
            });

            if(!order) {
                res.status(404).json({message: 'Error fetching order'})
            }

            const location = await OrderService.getLocationName(
                order?.shippingAddress?.ward || '',
                order?.shippingAddress?.district || '',
                order?.shippingAddress?.city || ''
            );

            res.render('./shop/orderdetail', { order, location });
        } catch(e) {
            console.error("Error fetching order view:", e);
            res.status(500).json({ message: 'Error fetching order view', error: e });
        }
    }

    static async AdminOrderPrint(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid order ID' });
            }
    
            if (!req.session._user) {
                return res.redirect('/login');
            }
    
            if (req.session._user?.Role !== UserRole.Admin) {
                return res.status(403).json({ message: 'User is not authorized' });
            }
    
            const order = await AppDataSource.getRepository(OrderItem).findOne({
                where: { id: id },
                relations: ['user']
            });
    
            if (!order) {
                return res.status(404).json({ message: 'Error fetching order' });
            }
    
            const location = await OrderService.getLocationName(
                order.shippingAddress?.ward || '',
                order.shippingAddress?.district || '',
                order.shippingAddress?.city || ''
            );
    
            res.render('./pages/manager/orderprint', { order, location });
        } catch (e) {
            console.error("Error fetching order view:", e);
            res.status(500).json({ message: 'Error fetching order view', error: e });
        }
    }    

    static async DeleteOrder(req: Request, res: Response){
        try{
            let { orderid } = req.body;
            orderid = Number(orderid);
            // console.log(orderid);
            const order = await AppDataSource.getRepository(OrderItem).findOne({
                where: {id: orderid, user: {id: req.session._user?.id}},
            });
            
            if(!order){
                return res.status(404).json({ message: 'Order not found' });
            } 

            await AppDataSource.getRepository(OrderItem).delete({ id: order.id, user: {id: req.session._user?.id}});
            res.status(200).json({ message: 'Order canceled successfully' });
        }catch(e){
            console.error("Error cancelling order:", e);
            res.status(500).json({ message: 'Error cancelling order', error: e });
        }
    }

    static async CancelOrder(req: Request, res: Response){
        try{
            let { orderid } = req.body;
            orderid = Number(orderid);
            // console.log(orderid);
            const order = await AppDataSource.getRepository(OrderItem).findOne({
                where: {id: orderid, user: {id: req.session._user?.id}},
            });
            
            if(!order){
                return res.status(404).json({ message: 'Order not found' });
            } 

            order.status = 'Canceled';

            await AppDataSource.getRepository(OrderItem).save(order);
            res.status(200).json({ message: 'Order canceled successfully' });
        }catch(e){
            console.error("Error cancelling order:", e);
            res.status(500).json({ message: 'Error cancelling order', error: e });
        }
    }

    static async getLocationName(ward: string, district: string, city: string) {
        try {
            const { data: provinces } = await axios.get('https://provinces.open-api.vn/api/');
            const cityName = provinces.find((p: any) => p.code == city)?.name || 'Unknown City';

            const { data: districts } = await axios.get(`https://provinces.open-api.vn/api/p/${city}?depth=2`);
            const districtName = districts.districts.find((d: any) => d.code == district)?.name || 'Unknown District';

            const { data: wards } = await axios.get(`https://provinces.open-api.vn/api/d/${district}?depth=2`);
            const wardName = wards.wards.find((w: any) => w.code == ward)?.name || 'Unknown Ward';

            return { wardName, districtName, cityName };
        } catch (error) {
            console.error('Lỗi lấy địa danh:', error);
            return { wardName: 'Unknown', districtName: 'Unknown', cityName: 'Unknown' };
        }
    }

}

export default OrderService;