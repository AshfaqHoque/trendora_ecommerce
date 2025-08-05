import { Injectable } from '@nestjs/common';
import { UpdateProductDto, CreateProductDto} from './product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>){}
  
  async create(adminId: number, createProductDto: CreateProductDto): Promise<{message: string; product: ProductEntity}> {
    const newProduct = this.productRepository.create({...createProductDto, admin: {id: adminId},});
    const savedProduct = await this.productRepository.save(newProduct);
    return { message: 'Product created successfully', product: savedProduct};
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
