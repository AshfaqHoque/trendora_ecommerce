import { randomUUID } from 'crypto';
import { BeforeInsert, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('customer')
export class CustomerEntity {
  @PrimaryColumn()
  id: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  fullName: string | null;

  @Column({ type: 'bigint', unsigned: true })
  phone: number;

  @BeforeInsert()
  generateId() {
    this.id = 'CUS-' + randomUUID().slice(0, 8).toUpperCase();
  }
}
