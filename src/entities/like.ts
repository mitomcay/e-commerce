import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Collection, OneToOne, OneToMany, ManyToOne } from "typeorm";
import { Product } from "@entitiesProduct";
import User from "@entitiesUser";


@Entity({ name: "Like" })
export class Like {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Product, (product) => product.likes)
    product: Product;

    @ManyToOne(() => User, (user) => user.likes)
    user: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;
}


export default Like;