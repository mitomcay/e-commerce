
import { AppDataSource } from "@configdata-source";
import User, { UserRole } from "@entitiesUser";
import Notification from "@entitiesNotification"
import { io } from "@sockets/notification.socket";

class NotificationService {

    static async createNotification(userId: number, message: string) {
        const user = await AppDataSource.getRepository(User).findOne({ where: {id: userId} });
        if (!user) throw new Error("User not found");

        const notification = new Notification();
        notification.user = user;
        notification.message = message;
        notification.isRead = false;
        await AppDataSource.getRepository(Notification).save(notification);

        io.to('Role_User').emit("new_notification", { message });

        return notification;
    }
}

export default NotificationService;
