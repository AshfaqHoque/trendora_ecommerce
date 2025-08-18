import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, CreateProductsDto, UpdateProductDto } from './product.dto';
import { SessionGuard } from 'src/admin/session.guard';

@UseGuards(SessionGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get() 
  getAllProducts() {
    return this.productService.findAll();
  }

  @Get('search')
  searchProductByName(@Query('name') name: string) {
    return this.productService.searchByName(name);
  }

  @Get('price-range')
  findProductsByPriceRange(@Query('min', ParseIntPipe) min: number, @Query('max', ParseIntPipe) max:number) {
    return this.productService.findByPriceRange(min,max);
  }

  @Get('top-expensive')
  findTopExpensive(@Query('limit') limit?: string) {
    const lim = limit ? parseInt(limit, 10) : 5;
    return this.productService.findTopExpensive(lim);
  }

  @Get('count-by-category')
  countByCategory() {
    return this.productService.countByCategory();
  }

  @Get('admin/:adminId')
  getProducts(@Param('adminId', ParseIntPipe) adminId: number) {
    return this.productService.findByAdminId(adminId);
  }

  @Get('category/:category')
  findProductsByCategory(@Param('category') category: string) {
    return this.productService.findByCategory(category);
  }

  @Get(':id') 
  getOneProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Post(':adminId')
  createProduct(@Param('adminId', ParseIntPipe) adminId: number, @Body() createProductDto: CreateProductDto) {
    return this.productService.create(adminId, createProductDto);
  }

  @Post('many/:adminId')
  createManyProducts(@Param('adminId', ParseIntPipe) adminId: number, @Body() createProductsDto: CreateProductsDto) {
    return this.productService.createMany(adminId, createProductsDto);
  }

  @Put(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto,) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
