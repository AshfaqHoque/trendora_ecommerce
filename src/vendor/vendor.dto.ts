import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Matches, MinLength } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class CreateVendorDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password field is required' })
  @Matches(/[@#$&]/, { message: 'Password must contain at least one special character (@, #, $, &)' })
  password : string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role; 
}
