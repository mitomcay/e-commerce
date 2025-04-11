import { AppDataSource } from "@configdata-source";
import Cart from "@entitiesCart";
import OrderItem from "@entitiesOrderItem";
import User, { UserRole } from "@entitiesUser";
import { Request, Response } from "express";
import moment from "moment";


class ReceiptService{ 

    static async getMoneyToday(req: Request, res: Response): Promise<any>{
        try {
            // Lấy thời gian bắt đầu và kết thúc ngày hiện tại
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            // Truy vấn tổng tiền hôm nay
            const totalMoneyToday = await AppDataSource.getRepository(OrderItem)
                .createQueryBuilder("orderItem") // Sử dụng alias đúng với entity
                .select("SUM(orderItem.totalAmount)", "total")
                .where("orderItem.createdAt BETWEEN :start AND :end", { start: startOfDay, end: endOfDay })
                .andWhere("orderItem.status = :status", { status: "Completed" })
                .getRawOne();

            res.status(200).json({ totalMoneyToday: totalMoneyToday?.total || 0 });

        } catch (e) {
            console.error("Error fetching order:", e);
            res.status(500).json({ message: "Error fetching order", error: e });
        }
    }

    static async getMoneybyWeek(req: Request, res: Response): Promise<any> {
        try {
            const startOfWeek = moment().startOf("isoWeek").toDate(); // Bắt đầu từ thứ 2
            const endOfWeek = moment().endOf("isoWeek").toDate(); // Kết thúc vào chủ nhật

            // Lấy tổng doanh thu theo từng ngày trong tuần
            const revenueByDay = await AppDataSource.getRepository(OrderItem)
                .createQueryBuilder("orderItem")
                .select([
                    "DATE(orderItem.createdAt) as date",
                    "SUM(orderItem.totalAmount) as total"
                ])
                .where("orderItem.createdAt BETWEEN :start AND :end", { start: startOfWeek, end: endOfWeek })
                .andWhere("orderItem.status = :status", { status: "Completed" })
                .groupBy("DATE(orderItem.createdAt)")
                .orderBy("DATE(orderItem.createdAt)", "ASC")
                .getRawMany();

            // Chuyển dữ liệu về format chuẩn JSON
            const formattedData = [];
            const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            
            for (let i = 0; i < daysOfWeek.length; i++) {
                const date = moment(startOfWeek).add(i, "days").format("YYYY-MM-DD");
                const revenue = revenueByDay.find((item) => moment(item.date).format("YYYY-MM-DD") === date);
                formattedData.push({
                    day: daysOfWeek[i], 
                    total: revenue ? Number(revenue.total) : 0
                });
            }

            res.status(200).json({ weekRevenue: formattedData });

        } catch (e) {
            console.error("Error fetching revenue by week:", e);
            res.status(500).json({ message: "Error fetching revenue by week", error: e });
        }
    }

    static async getUserbyWeek(req: Request, res: Response): Promise<any> {
        try {
            const startOfWeek = moment().startOf("isoWeek").toDate(); // Bắt đầu từ thứ 2
            const endOfWeek = moment().endOf("isoWeek").toDate(); // Kết thúc vào chủ nhật

            // Lấy tổng doanh thu theo từng ngày trong tuần
            const userByDay = await AppDataSource.getRepository(User)
                .createQueryBuilder("User")
                .select([
                    "DATE(User.createdAt) as date",
                    "COUNT(User.id) as total"
                ])
                .where("User.createdAt BETWEEN :start AND :end", { start: startOfWeek, end: endOfWeek })
                .groupBy("DATE(User.createdAt)")
                .orderBy("DATE(User.createdAt)", "ASC")
                .getRawMany();

            // Chuyển dữ liệu về format chuẩn JSON
            const formattedData = [];
            const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            
            for (let i = 0; i < daysOfWeek.length; i++) {
                const date = moment(startOfWeek).add(i, "days").format("YYYY-MM-DD");
                const user = userByDay.find((item) => moment(item.date).format("YYYY-MM-DD") === date);
                formattedData.push({
                    day: daysOfWeek[i], 
                    total: user ? Number(user.total) : 0
                });
            }

            res.status(200).json({ weekUser: formattedData });

        } catch (e) {
            console.error("Error fetching revenue by week:", e);
            res.status(500).json({ message: "Error fetching revenue by week", error: e });
        }
    }

    static async getRevenue(req: Request, res: Response): Promise<any> {
        try {
            const todayStart = moment().startOf("day").toDate(); // 00:00 hôm nay
            const tomorrowStart = moment().add(1, "days").startOf("day").toDate(); // 00:00 ngày mai
            const yesterdayStart = moment().subtract(1, "days").startOf("day").toDate(); // 00:00 hôm qua

            // Lấy doanh thu hôm qua
            const getRevenueYesterday = await AppDataSource.getRepository(OrderItem)
                .createQueryBuilder("orderItem")
                .select("SUM(orderItem.totalAmount)", "total")
                .where("orderItem.createdAt BETWEEN :start AND :end", { start: yesterdayStart, end: todayStart })
                .andWhere("orderItem.status = :status", { status: "Completed" })
                .getRawOne();

            // Lấy doanh thu hôm nay
            const getRevenueToday = await AppDataSource.getRepository(OrderItem)
                .createQueryBuilder("orderItem")
                .select("SUM(orderItem.totalAmount)", "total")
                .where("orderItem.createdAt BETWEEN :start AND :end", { start: todayStart, end: tomorrowStart })
                .andWhere("orderItem.status = :status", { status: "Completed" })
                .getRawOne();

            // Kiểm tra nếu doanh thu là null thì gán về 0
            const todayTotal = getRevenueToday?.total ? Number(getRevenueToday.total) : 0;
            const yesterdayTotal = getRevenueYesterday?.total ? Number(getRevenueYesterday.total) : 0;

            // Tính chênh lệch doanh thu
            const revenueDifference = todayTotal - yesterdayTotal;
            // console.log(revenueDifference);
            let percentChange = 0;
            if (yesterdayTotal > 0) {
                percentChange = (revenueDifference / yesterdayTotal) * 100;
            }

            res.status(200).json({
                revenueDifference: revenueDifference,
                percentChange: percentChange.toFixed(2) + "%",
                status: percentChange >= 0 ? "Tăng 📈" : "Giảm 📉",
            });

        } catch (e) {
            console.error("Error fetching order:", e);
            res.status(500).json({ message: "Error fetching order", error: e });
        }
    }

    static async getUserRevenue(req: Request, res: Response): Promise<any> {
        try {
            const todayStart = moment().startOf("day").toDate(); // 00:00 hôm nay
            const tomorrowStart = moment().add(1, "days").startOf("day").toDate(); // 00:00 ngày mai
            const yesterdayStart = moment().subtract(1, "days").startOf("day").toDate(); // 00:00 hôm qua

            // Lấy doanh thu hôm qua
            const getUserRevenueYesterday = await AppDataSource.getRepository(User)
                .createQueryBuilder("user")
                .select("COUNT(User.id)", "total")
                .where("User.createdAt BETWEEN :start AND :end", { start: yesterdayStart, end: todayStart })
                .getRawOne();

            // Lấy doanh thu hôm nay
            const getUserRevenueToday = await AppDataSource.getRepository(User)
                .createQueryBuilder("User")
                .select("COUNT(User.id)", "total")
                .where("User.createdAt BETWEEN :start AND :end", { start: todayStart, end: tomorrowStart })
                .getRawOne();

            // Kiểm tra nếu doanh thu là null thì gán về 0
            const todayUserTotal = getUserRevenueToday?.total ? Number(getUserRevenueToday.total) : 0;
            const yesterdayUserTotal = getUserRevenueYesterday?.total ? Number(getUserRevenueYesterday.total) : 0;

            // Tính chênh lệch doanh thu
            const UserDifference = todayUserTotal - yesterdayUserTotal;
            // console.log(revenueDifference);
            let percentChange = 0;
            if (yesterdayUserTotal > 0) {
                percentChange = (UserDifference / yesterdayUserTotal) * 100;
            }

            res.status(200).json({
                UserDifference: UserDifference,
                percentChange: percentChange.toFixed(2) + "%",
                status: percentChange >= 0 ? "Tăng 📈" : "Giảm 📉",
            });

        } catch (e) {
            console.error("Error fetching order:", e);
            res.status(500).json({ message: "Error fetching order", error: e });
        }
    }

    static async getMoneyTotal(req: Request, res: Response): Promise<any>{
        try {

            // Truy vấn tổng tiền hôm nay
            const totalMoney = await AppDataSource.getRepository(OrderItem)
                .createQueryBuilder("orderItem") // Sử dụng alias đúng với entity
                .select("SUM(orderItem.totalAmount)", "total")
                .where("orderItem.status = :status", { status: "Completed" })
                .getRawOne();

            res.status(200).json({ totalMoney: totalMoney?.total || 0 });

        } catch (e) {
            console.error("Error fetching order:", e);
            res.status(500).json({ message: "Error fetching order", error: e });
        }
    }

    static async getUserToday(req: Request, res: Response): Promise<any>{
        try {

            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            // Truy vấn tổng tiền hôm nay
            const UserToday = await AppDataSource.getRepository(User)
                .createQueryBuilder("User") // Sử dụng alias đúng với entity
                .select("COUNT(User.id)", "totalUser")
                .where("User.createdAt BETWEEN :start AND :end", { start: startOfDay, end: endOfDay })
                .getRawOne();

            res.status(200).json({ UserToday: UserToday?.totalUser || 0 });

        } catch (e) {
            console.error("Error fetching order:", e);
            res.status(500).json({ message: "Error fetching order", error: e });
        }
    }
}

export default ReceiptService;