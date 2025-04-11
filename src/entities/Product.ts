import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Collection, DeleteDateColumn, OneToMany } from "typeorm";
import { Category } from '@entitiesCategory';
import { Cart } from '@entitiesCart';
import { Comment } from '@entitiesComment';
import { CartItem } from "@entitiesCartItem";
import Like from "@entitieslike";
// export enum UserRole {
//     Admin = 'Admin',
//     User = 'User',
// }

// export enum UserGender {
//     Male = 'Male',
//     Female = 'Female',
//     Other = 'Other',
// }


@Entity({name: "Product"})
export class Product {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    ProductName?: string;

    @ManyToMany(() => Category, (category) => category.products, { cascade: true })
    categories?: Category[];

    @Column({ default: 0 })
    ProductCount?: number

    @Column({ nullable: true })
    ImageUrl?: string;

    @Column("simple-array", { nullable: true })
    Size?: string[];

    @Column("simple-array", { nullable: true })
    Color?: string[];

    @Column({ type: 'float', nullable: true })
    Weight?: number;

    @Column({ nullable: true })
    Dimensions?: string;

    @Column({ type: 'text', nullable: true })
    Description?: string;

    @Column({ type: 'float', default: 0 })
    Price?: number

    @Column({ type: 'float', default: 0 })
    Discount?: number;

    @Column()
    Producer?: string;

    @Column({ type: 'float', default: 0 })
    Rating?: number;
    
    @Column({ default: true })
    isActive?: boolean
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedAt?: Date;

    @Column("simple-array", { nullable: true })
    Tags?: string[];

    @Column({ default: "Available" })
    Status?: string;

    @DeleteDateColumn()
    deletedAt?: Date | null;

    @OneToMany(() => CartItem, (cartItem) => cartItem.product) // Một sản phẩm có thể xuất hiện trong nhiều giỏ hàng
    cartItems: CartItem[];

    @OneToMany(() => Like, (like) => like.product)
    likes: Like[];

    @OneToMany(() => Comment, (comment) => comment.product)
    comments!: Comment[];

}

export default Product;