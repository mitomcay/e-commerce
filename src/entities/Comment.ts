import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, Check } from "typeorm";
import { User } from "@entitiesUser";
import { Product } from "@entitiesProduct";

@Entity({ name: "Comment" })
@Check("rating >= 0 AND rating <= 5") // Đảm bảo rating từ 0 - 5
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text", nullable: false })
    comment?: string;

    @Column({ type: "float", nullable: true })
    rating!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null;

    @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE", nullable: false })
    user!: User;

    @ManyToOne(() => Product, (product) => product.comments, { onDelete: "CASCADE", nullable: false })
    product!: Product;
}

export default Comment;
