import { Request, Response, NextFunction } from "express";

const BlockIP = (req: Request, res: Response, next: NextFunction): void => {
    const Ip = req.ip as string;

    console.log(`Client IP: ${Ip}`);

    // Thêm logic chặn IP nếu cần
    const blockedIPs = ["192.168.1.1", "203.0.113.0", "::1"]; // Danh sách IP bị chặn
    if (blockedIPs.includes(Ip)) {
        res.status(403).json({ message: "Tao ghet nen tao block" });
        return;
    }

    return next();
};

export default BlockIP;