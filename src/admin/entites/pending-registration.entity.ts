import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("pending_reigstration")
export class PendingAdminEntity {
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

    @Column()
    otp: string;

    @Column()
    expiresAt: Date;
}