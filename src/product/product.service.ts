import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductDto, CreateProductDto, CreateProductsDto } from './product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Like, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { Role } from 'src/auth/enums/role.enum';
import { VendorEntity } from 'src/vendor/vendor.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(VendorEntity) private vendorRepository: Repository<VendorEntity>,
  ){}
  
  findAll(): Promise<ProductEntity[]>{
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOneBy({id});
    if(!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async findByVendor(id: number | undefined, user: any): Promise<ProductEntity[]> {
    if (user.roles.includes(Role.Admin)) {
      if(id && !(await this.vendorRepository.findOne({where: {id}}))) {
        throw new NotFoundException(`Vendor with ID ${id} not found`);
      }
      const condition = id ? { vendor: { id } } : {};
      return await this.productRepository.find({
        where: condition,
        relations: ['vendor'],
      });
    }
    if (user.roles.includes(Role.Vendor)) {
      return await this.productRepository.find({
        where: { vendor: { id: user.id } },
        relations: ['vendor'],
      });
    }
    throw new ForbiddenException('Access denied');
  }

  async countByVendor(id: number | undefined, user: any): Promise<number> {
    if (user.roles.includes(Role.Admin)) {
      if(id && !(await this.vendorRepository.findOne({where: {id}}))) {
        throw new NotFoundException(`Vendor with ID ${id} not found`);
      }
      const condition = id ? { vendor: { id } } : {};
      return await this.productRepository.count({
        where: condition,
      });
    }
    if (user.roles.includes(Role.Vendor)) {
      return await this.productRepository.count({
        where: { vendor: { id: user.id } },
      });
    }
    throw new ForbiddenException('Access denied');
  }

  // async findVendor(productId: number) {
  //   const product = await this.productRepository.findOne({
  //     where: { id: productId },
  //     relations: ['vendor'], 
  //   });
  //   if (!product) throw new NotFoundException(`Product with ID ${productId} not found`);
  //   if (!product.vendor) throw new NotFoundException(`No vendor found for this product`);
  //   const { name, email } = product.vendor;
  //   return { name, email }; 
  // }

  // countAll():Promise<number> {
  //   return this.productRepository.count();
  // }

  async create(createProductDto: CreateProductDto, user: any): Promise<{message: string; product: ProductEntity}> {
    const newProduct = this.productRepository.create({...createProductDto, vendor: {id: user.id},});
    const savedProduct = await this.productRepository.save(newProduct);
    return { message: 'Product created successfully', product: savedProduct};
  }

  async createMany(createProductsDto: CreateProductsDto, user: any): Promise<{message: string; products: ProductEntity[]}> {
    const newProducts = this.productRepository.create(createProductsDto.products.map( product => ({...product, vendor: {id: user.id}})));
    const savedProducts = await this.productRepository.save(newProducts);
    return { message: 'Products created successfully', products: savedProducts};
  }

  // // async update(id: number, vendorId: number, updateProductDto: UpdateProductDto): Promise<{ message: string; product: ProductEntity }> {
  // //   const product = await this.findOne(id);
    
  // //   if (product.vendor?.id !== vendorId) {
  // //     throw new ForbiddenException('You do not have permission to update this product');
  // //   }

  // //   await this.productRepository.update(id, updateProductDto);
  // //   return { message: 'Product updated successfully', product: { ...product, ...updateProductDto } };
  // // }

  // // async remove(id: number, vendorId: number): Promise<{ message: string; product: ProductEntity }> {
  // //   const product = await this.findOne(id);

  // //   if (product.vendor?.id !== vendorId) {
  // //     throw new ForbiddenException('You do not have permission to delete this product');
  // //   }

  // //   await this.productRepository.delete(id);
  // //   return { message: 'Product deleted successfully', product: product };
  // // }

  // async searchByName(name: string): Promise<ProductEntity[]> {
  //   return this.productRepository.find({ where:{ name: ILike(`%${name}%`) } });
  // }

  // async findByPriceRange(min: number, max: number): Promise<ProductEntity[]> {
  //   return this.productRepository.find({ where:{ price: Between(min, max) } });
  // }

  // async findByCategory(category: string): Promise<ProductEntity[]> {
  //   return this.productRepository.find({ where: { category } });
  // }

  // async findTopExpensive(limit = 5): Promise<ProductEntity[]> {
  //   return this.productRepository.find({ order: { price: 'DESC' }, take: limit });
  // }









}
