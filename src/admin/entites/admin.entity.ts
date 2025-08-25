import { Role } from "src/auth/enums/role.enum";
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

  @Column({unique: true})
  email: string;

  @Column({ type: 'int'})
  age: number;

  @Column()
  password: string;

  @Column()
  linkedInUrl : string;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active'})
  status: 'active' | 'inactive';

  @Column({ type: 'enum', enum: Role, default: Role.Admin })
  role: Role; 
}