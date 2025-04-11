import { Request, Response } from "express";
import { AppDataSource } from "@configdata-source"; 
import PaymentAccount from "@entitiesPaymentAccount";
import User from "@entities/User";

const paymentAccountRepository = AppDataSource.getRepository(PaymentAccount);

// API liên kết tài khoản
export const linkPaymentAccount = async (req: Request, res: Response) => {
    try {
        const { userId, provider, accountNumber } = req.body;

        const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User không tồn tại!" });
        }

        const existingAccount = await paymentAccountRepository.findOne({ where: { user, provider } });
        if (existingAccount) {
            return res.status(400).json({ success: false, message: "Tài khoản đã liên kết trước đó!" });
        }

        const newAccount = paymentAccountRepository.create({ user, provider, accountNumber });
        await paymentAccountRepository.save(newAccount);

        return res.status(200).json({ success: true, message: "Tài khoản đã liên kết thành công!" });
    } catch (error) {
        console.error("Lỗi liên kết tài khoản:", error);
        return res.status(500).json({ success: false, message: "Đã có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau." });
    }
};


export const linkZaloPayAccount = async (req: Request, res: Response) => {
    try {
        const { userId, zaloPayId } = req.body;

        const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "User không tồn tại" });

        const paymentAccount = paymentAccountRepository.create({
            provider: "ZaloPay",
            accountNumber: zaloPayId,
            user,
        });

        await paymentAccountRepository.save(paymentAccount);
        res.json({ message: "Liên kết ZaloPay thành công", data: paymentAccount });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};


export const getPaymentAccounts = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const accounts = await paymentAccountRepository.find({
            where: { user: { id: Number(userId) } },
            relations: ['user']
        });

        return res.status(200).json({ accounts });
    } catch (error) {
        console.error("Lỗi lấy danh sách tài khoản:", error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

export const updatePaymentAccount = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { provider, accountNumber } = req.body;

        const paymentAccount = await paymentAccountRepository.findOne({ where: { id: Number(id) } });
        if (!paymentAccount) return res.status(404).json({ message: "Không tìm thấy tài khoản" });

        paymentAccount.provider = provider;
        paymentAccount.accountNumber = accountNumber;
        await paymentAccountRepository.save(paymentAccount);

        res.json({ message: "Cập nhật thành công", data: paymentAccount });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

export const unlinkPaymentAccount = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if(!req.session._user){
            return res.status(401).json({ message: "Bạn cần đăng nhập để thực hiện tác vụ này!" });
        }
        const userId = req.session._user?.id;
        const paymentAccount = await paymentAccountRepository.findOne({
            where: { id: Number(id), user: { id: userId } },
            relations: ['user']
        })

        const deleted = await paymentAccountRepository.softDelete({ id: paymentAccount?.id  });

        if (!deleted.affected) return res.status(404).json({ message: "Không tìm thấy tài khoản!" });

        return res.status(200).json({ message: "Hủy liên kết thành công!" });
    } catch (error) {
        console.error("Lỗi hủy liên kết:", error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};
