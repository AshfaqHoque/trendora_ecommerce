import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class SellerDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name must only contain alphabets' })
  name: string;

  @IsEmail({}, { message: 'Email must be valid and contain @ character' })
  @Matches(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.xyz$/, { message: 'Email must end with .xyz domain' })
  email: string;

  @Matches(/^\d{10,17}$/, { message: 'NID must be a number with 10 to 17 digits' })
  nid: string;
}

