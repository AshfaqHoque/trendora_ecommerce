import { IsString, IsNotEmpty, IsEmail, Matches, IsInt, IsPositive, IsEnum } from 'class-validator';

export class SellerDTO {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsInt()
  @IsPositive()
  age: number;

  @IsEnum(['active', 'inactive'])
  status: 'active' | 'inactive';
}

