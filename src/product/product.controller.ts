import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, Query, UseGuards, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, CreateProductsDto, UpdateProductDto } from './product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(AuthGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get() 
  getAllProducts() {
    return this.productService.findAll();
  }

  // @Get('search')
  // searchProductByName(@Query('name') name: string) {
  //   return this.productService.searchByName(name);
  // }

  // @Get('price-range')
  // findProductsByPriceRange(@Query('min', ParseIntPipe) min: number, @Query('max', ParseIntPipe) max:number) {
  //   return this.productService.findByPriceRange(min,max);
  // }

  // @Get('top-expensive')
  // findTopExpensive(@Query('limit') limit?: string) {
  //   const lim = limit ? parseInt(limit, 10) : 5;
  //   return this.productService.findTopExpensive(lim);
  // }

  @Get('my-products') 
  @Roles(Role.Vendor)
  getMyProducts(@Request() req) {
  return this.productService.findByVendor(undefined, req.user);
  }

  @Get('by-vendor')
  @Roles(Role.Admin)
  getProductsByVendor(@Query('id') id: number | undefined, @Request() req) {
    return this.productService.findByVendor(id, req.user);
  }

  @Get('my-product-counts')
  @Roles(Role.Vendor)
  getMyProductCounts(@Request() req) {
    return this.productService.countByVendor(undefined, req.user);
  }

  @Get('counts-by-vendor')
  @Roles(Role.Admin)
  getProductCountsByVendor(@Query('id') id: number | undefined, @Request() req) {
    return this.productService.countByVendor(id, req.user);
  }

  // @Get('category/:category')
  // findProductsByCategory(@Param('category') category: string) {
  //   return this.productService.findByCategory(category);
  // }

  @Get(':id') 
  getOneProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  // @Get(':id/vendor')
  // async findVendorByProduct(@Param('id', ParseIntPipe) id: number) {
  //   return await this.productService.findVendor(id);
  // }

  @Post('create')
  @Roles(Role.Vendor)
  createProduct(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.productService.create(createProductDto, req.user);
  }

  @Post('createmany')
  createManyProducts(@Body() createProductsDto: CreateProductsDto, @Request() req) {
    return this.productService.createMany(createProductsDto, req.user);
  }

  // @Put('update')
  // updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto, @Request() req) {
  //   const vendorId = req.user.id;
  //   return this.productService.update(id, updateProductDto);
  // }

  // @Delete(':id')
  // removeProduct(@Param('id') id: string) {
  //   return this.productService.remove(+id);
  // }



  
}
