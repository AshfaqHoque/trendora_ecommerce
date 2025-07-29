import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    name : string;
    @IsEmail()
    email : string;
    @IsString()
    @IsNotEmpty()
    password : string;
}

export class UpdateAdminDto {
    @IsString()
    @IsOptional()
    name?: string;
    @IsEmail()
    @IsOptional()
    email?: string;
    @IsString()
    @IsOptional()
    password?: string;
}