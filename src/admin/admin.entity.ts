import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}