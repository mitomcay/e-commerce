import { 
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, 
    DeleteDateColumn, BeforeInsert 
} from "typeorm";
import { User } from "./User";
import QRCode from "qrcode"; // Import thư viện QR code

@Entity({ name: "OrderItem" })
export class OrderItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.orderitem)
    user!: User;

    @Column("json")
    items!: {
        productId: string;
        name: string;
        size: string;
        color: string;
        price: number;
        quantity: number;
    }[];

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalAmount!: number;

    @Column({ type: "text", nullable: true })
    qrcode?: string; // Lưu QR code dưới dạng base64

    @Column({ type: "text", nullable: false })
    app_trans_id?: string;

    @Column("json")
    shippingAddress!: {
        firstName: string;
        lastName: string;
        phone: string;
        address1: string;
        address2?: string;
        ward: string;
        city: string;
        district: string;
        zip: string;
    };

    @Column({
        type: "enum",
        enum: ["Pending", "Shipping", "Completed", "Failed", "Canceled"],
        default: "Pending",
    })
    status!: "Pending" | "Shipping" | "Completed" | "Failed" | "Canceled";

    @CreateDateColumn()
    createdAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null;

    // 🔹 Trước khi insert vào DB, tự động tạo QR code cho đơn hàng
    @BeforeInsert()
    async generateQRCode() {
        const orderData = `Order ID: ${this.id}\nTotal: $${this.totalAmount}\nStatus: ${this.status}`;
        this.qrcode = await QRCode.toDataURL(orderData);
    }
}

export default OrderItem;
