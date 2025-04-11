import User from "@entitiesUser";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne } from "typeorm";

@Entity({ name: "Notification"})
export class Notification{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne( () => User , user => user.notifications)
    user: User;

    @Column({ type: 'text'})
    message: string;

    @Column({ default: false})
    isRead: boolean;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
} 

export default Notification;