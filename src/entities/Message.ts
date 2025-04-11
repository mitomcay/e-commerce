import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';  // Import model User

@Entity({ name: 'Message' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;  // ID của tin nhắn

  @Column('text')
  content: string;  // Nội dung tin nhắn

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;  // Người gửi (tham chiếu đến bảng User)

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;  // Người nhận (tham chiếu đến bảng User)

  @CreateDateColumn()
  createdAt: Date;  // Thời gian gửi tin nhắn

  @Column({
    type: 'enum',
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  })
  status: 'sent' | 'delivered' | 'read';  // Trạng thái tin nhắn
}

export default Message;