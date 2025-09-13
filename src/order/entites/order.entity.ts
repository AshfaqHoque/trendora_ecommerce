import { CustomerEntity } from "src/customer/customer.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItemEntity } from "./order-item.entity";


@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CustomerEntity, { eager: true })
  customer: CustomerEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true, eager: true })
  items: OrderItemEntity[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;
}