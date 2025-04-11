import { AppDataSource } from '@configdata-source';
import Notification from '@entitiesNotification';
import { Request, Response } from 'express';
import NotificationService from '@servicesnotification.services';

class NotificationController{

    static async sendNotification(req: Request, res: Response) {
        try{
            if(req.session._user?.Role !== 'Admin'){
                return res.status(404).json({ message: 'you are not permission to create a notification'});
            }

            const userId = Number(req.session._user?.id);

            const {  message } = req.body;
            const notification = await NotificationService.createNotification(userId, message);

            if(!notification){
                return res.status(300).json({ message: 'notification created failure' })
            }
            return res.status(200).json({ message: 'notification created successfully' })

        } catch (e){
            console.error(e);
            return res.status(500).json({ message: 'Error occurred while creating notification.' });
        }
    }

    static async getAllNotification(req: Request, res: Response) {
        try{
            const notification = await AppDataSource.getRepository(Notification).find()

            res.status(200).json({ notification: notification})
        } catch(e){
            console.log(e);
            res.status(500).json({e});
        }
    }

    static async markAsRead(req: Request, res: Response) {

    }

    static async deleteNotification(req: Request, res: Response) {
        try{
            const id = Number(req.params.id);
            const notification = await AppDataSource.getRepository(Notification).findOne({
                where: { id: id}
            });

            if(notification){
                await AppDataSource.getRepository(Notification).delete(notification);
            }

            res.status(200).json({ message: "delete success"})
        } catch(e){
            console.log(e);
            res.status(500).json({e});
        }
    }

    static async getNotificationbyUser(){

    } 
}

export default NotificationController;