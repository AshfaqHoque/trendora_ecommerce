import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductDto, CreateProductDto, CreateProductsDto } from './product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Like, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>){}
  
  findAll(): Promise<ProductEntity[]>{
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOneBy({id});
    if(!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  findByAdminId(adminId: number): Promise<ProductEntity[]> {
    return this.productRepository.find({ where:{ admin:{ id:adminId } } });
  }

  countAll():Promise<number> {
    return this.productRepository.count();
  }

  async create(adminId: number, createProductDto: CreateProductDto): Promise<{message: string; product: ProductEntity}> {
    const newProduct = this.productRepository.create({...createProductDto, admin: {id: adminId},});
    const savedProduct = await this.productRepository.save(newProduct);
    return { message: 'Product created successfully', product: savedProduct};
  }

  async createMany(adminId: number, createProductsDto: CreateProductsDto): Promise<{message: string; products: ProductEntity[]}> {
    const newProducts = this.productRepository.create(createProductsDto.products.map( product => ({...product, admin: {id: adminId}})));
    const savedProducts = await this.productRepository.save(newProducts);
    return { message: 'Products created successfully', products: savedProducts};
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<{ message: string; product: ProductEntity }> {
    const product = await this.findOne(id);
    await this.productRepository.update(id, updateProductDto);
    return { message: 'Product updated successfully', product: { ...product, ...updateProductDto } };
  }

  async remove(id: number): Promise<{ message: string; product: ProductEntity }> {
    const product = await this.findOne(id);
    await this.productRepository.delete(id);
    return { message: 'Product deleted successfully', product: product };
  }

  async searchByName(name: string): Promise<ProductEntity[]> {
    return this.productRepository.find({ where:{ name: ILike(`%${name}%`) } });
  }

  async findByPriceRange(min: number, max: number): Promise<ProductEntity[]> {
    return this.productRepository.find({ where:{ price: Between(min, max) } });
  }

  async findByCategory(category: string): Promise<ProductEntity[]> {
    return this.productRepository.find({ where: { category } });
  }

  async findTopExpensive(limit = 5): Promise<ProductEntity[]> {
    return this.productRepository.find({ order: { price: 'DESC' }, take: limit });
  }

  async countByCategory(): Promise<{ category: string; count: number }[]> {
    return this.productRepository.createQueryBuilder('product')
    .select('product.category', 'category')
    .addSelect('COUNT(product.id)', 'count')
    .groupBy('product.category')
    .getRawMany();
  }





}
