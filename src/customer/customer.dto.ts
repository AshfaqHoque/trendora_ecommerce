import { IsEmail, Matches, IsIn, IsNotEmpty, IsString, MinLength, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateCustomerDto {
  // @IsEmail({}, { message: 'Email must be valid' })
  // @Matches(/@aiub\.edu$/, { message: 'Email must be from aiub.edu domain' })
  // email: string;

  // @IsString()
  // @MinLength(6, { message: 'Password must be at least 6 characters' })
  // @Matches(/[A-Z]/, { message: 'Password must have at least one uppercase letter' })
  // password: string;

  // @IsIn(['male', 'female','others'], { message: 'Gender must be male or female' })
  // gender: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsNumber()
  phone: number;

  

  // @IsOptional()
  // @IsBoolean()
  // isActive?: boolean;
}
