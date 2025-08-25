import { VendorEntity } from "src/vendor/vendor.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('product')
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'text', nullable: true })
    description?: string;


    @Column({ type: 'int', default: 0 })
    stock: number;


    @Column({ nullable: true })
    category: string;

    @ManyToOne(() => VendorEntity, (vendor) => vendor.products, { onDelete: 'SET NULL' })
    vendor: VendorEntity;
}
