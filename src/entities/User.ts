import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Collection, JoinColumn, OneToMany } from "typeorm";
import Cart from "@entitiesCart";
import { Comment } from '@entitiesComment'; 
import OrderItem from "@entitiesOrderItem";
import Like from "@entitieslike";
import PaymentAccount from "@entitiesPaymentAccount";
import Notification from "@entitiesNotification";

export enum UserRole {
    Admin = 'Admin',
    User = 'User',
    Customer = 'Customer',
}

export enum UserGender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
}

@Entity({name: "User"})
export class User {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    firstName?: string

    @Column()
    lastName?: string

    @Column()
    age?: number

    @Column({ unique: true })
    email?: string

    @Column()
    password?: string

    @Column({ nullable: true })
    ImageUrl?: string;

    @Column({ unique: true })
    phone?: string
    
    @Column({ default: false })
    isActive?: boolean
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
    Role?: UserRole;

    @Column({ type: 'enum', enum: UserGender, default: UserGender.Other})
    Gender?: UserGender;

    @Column()
    province?: string;
    
    @Column()
    district?: string;
    
    @Column()
    ward?: string;
    
    @OneToMany(() => Cart, (cart) => cart.user)
    @JoinColumn()
    cart: Cart;

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments!: Comment[];

    @OneToMany(() => OrderItem, (orderitem) => orderitem.user)
    orderitem: OrderItem;
    
    @OneToMany(() => PaymentAccount, (paymentAccounts) => paymentAccounts.user)
    paymentAccounts: PaymentAccount;

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];
}

export default User;