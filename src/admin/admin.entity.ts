import { ProductEntity } from "src/product/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("admin")
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  joiningDate : string;

  @Column()
  linkedInUrl : string;

  @OneToMany(()=> ProductEntity, (product) => product.admin)
  products: ProductEntity[];
}