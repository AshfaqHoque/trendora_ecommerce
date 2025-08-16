import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsString()
    @IsOptional()
    category: string;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class CreateProductsDto {
    products: CreateProductDto[];
}
