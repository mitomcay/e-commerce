import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne, JoinTable, Collection, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Product } from "@entitiesProduct";
import {User} from "@entitiesUser";
import { CartItem } from "@entitiesCartItem";

@Entity({ name: "Cart" })
export class Cart {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => User, (user) => user.cart)
    user: User;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart) // Một giỏ hàng có nhiều CartItem
    cartItems: CartItem[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;
}


export default Cart;