import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne, JoinTable, Collection, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "@entitiesProduct";
import { Cart } from "@entitiesCart";

@Entity({ name: "CartItem" })
export class CartItem {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Cart, (cart) => cart.cartItems) // Mối quan hệ N-1 với Cart
    cart?: Cart;

    @ManyToOne(() => Product, (product) => product.cartItems) // Mối quan hệ N-1 với Product
    product?: Product;

    @Column({ type: 'text' }) // Số lượng sản phẩm
    color?: string;

    @Column({ type: 'text' }) // Số lượng sản phẩm
    size?: string;

    @Column({ type: 'int', default: 1 }) // Số lượng sản phẩm
    quantity?: number;

    @Column({ type: 'float', default: 0 }) // Giá của sản phẩm tại thời điểm thêm vào giỏ hàng (nếu cần)
    price?: number;
}
