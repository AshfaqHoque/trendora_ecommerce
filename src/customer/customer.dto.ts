import { IsEmail, Matches, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsEmail({}, { message: 'Email must be valid' })
  @Matches(/@aiub\.edu$/, { message: 'Email must be from aiub.edu domain' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/[A-Z]/, { message: 'Password must have at least one uppercase letter' })
  password: string;

  @IsIn(['male', 'female','others'], { message: 'Gender must be male or female' })
  gender: string;

  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  phone: string;
}
