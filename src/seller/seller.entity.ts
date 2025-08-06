// src/seller/seller.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('sellers')//table name
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  @Column({ type: 'int', unsigned: true })
  age: number;

  @Column({
    type: 'varchar',
    default: 'active',  // Default value set to 'active'
    enum: ['active', 'inactive'],  // Restrict the values to 'active' or 'inactive'
  })
  status: 'active' | 'inactive';  // TypeScript type to ensure only 'active' or 'inactive' values
}
