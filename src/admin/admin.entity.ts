import { ProductEntity } from "src/product/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("admin")
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: ()=> 'CURRENT_TIMESTAMP'})
  joiningDate : Date;

  @Column({ type: 'varchar', length: 100})
  fullName: string;

  @Column()
  email: string;

  @Column({ type: 'int'})
  age: number;

  @Column()
  password: string;

  @Column()
  linkedInUrl : string;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active'})
  status: 'active' | 'inactive';

  @OneToMany(()=> ProductEntity, (product) => product.admin)
  products: ProductEntity[];
}