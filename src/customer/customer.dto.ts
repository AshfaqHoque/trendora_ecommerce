import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, Matches, IsIn, IsNotEmpty, IsString, MinLength, IsOptional, IsBoolean, IsNumber, MaxLength, IsDateString, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
  //@ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  //@ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  //@ApiProperty({ example: 'John' })
  @IsString()
  @MaxLength(50)
  firstName: string;

  //@ApiProperty({ example: 'Doe' })
  @IsString()
  @MaxLength(50)
  lastName: string;

  //@ApiPropertyOptional({ example: '+1234567890' })
  @IsPhoneNumber('BD')
  phoneNumber: string;

  //@ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  //@ApiPropertyOptional({ example: '123 Main St' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  //@ApiPropertyOptional({ example: 'New York' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  //@ApiPropertyOptional({ example: '10001' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  //@ApiPropertyOptional({ example: 'USA' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  country?: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}