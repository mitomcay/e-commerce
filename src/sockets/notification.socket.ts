import { AppDataSource } from "@configdata-source";
import User, { UserRole } from "@entitiesUser";
import { Server } from "socket.io";

export let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        // Client lắng nghe sự kiện join room (User ID)
        socket.on("join", async (userId: number) => {
            const user = await AppDataSource.getRepository(User).findOne({
                where: { id: userId }
            })
            if(user?.Role == UserRole.User){
                socket.join('Role_User');
                console.log(`📢 User ${userId} joined room`);
            }
            
        });

        socket.on("disconnect", () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });
};
