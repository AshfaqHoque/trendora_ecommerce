import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductEntity } from 'src/product/product.entity';
import { Role } from 'src/auth/enums/role.enum';

@Entity('vendor')
export class VendorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.Vendor })
  role: Role;

  @OneToMany(() => ProductEntity, (product) => product.vendor)
  products: ProductEntity[];
}
