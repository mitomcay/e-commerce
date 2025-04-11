import { 
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, 
    DeleteDateColumn, BeforeInsert 
} from "typeorm";
import { User } from "./User";
import QRCode from "qrcode"; 

@Entity({ name: "PaymentAccount" })
export class PaymentAccount {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.paymentAccounts)
    user!: User; // Liên kết với bảng User

    @Column()
    provider!: string; // "ZaloPay", "Momo", "VNPAY"

    @Column()
    accountNumber!: string; // Số tài khoản thanh toán

    @Column({ type: "boolean", default: true })
    isActive!: boolean;

    @Column({ type: "text", nullable: true })
    qrCodeUrl!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @BeforeInsert()
    async generateQRCode() {
        this.qrCodeUrl = await QRCode.toDataURL(this.accountNumber); // Tạo QR từ số tài khoản
    }
}

export default PaymentAccount;
