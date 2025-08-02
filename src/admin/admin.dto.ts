import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[^0-9]*$/, { message: 'Name should not contain numbers' })
    name : string;
    @IsNotEmpty({ message: 'Email field is required' })
    @IsEmail({}, { message: 'Please enter a valid email address (e.g., john@example.com)' })
    email : string;
    @IsNotEmpty({ message: 'Password field is required' })
    @Matches(/[@#$&]/, { message: 'Password must contain at least one special character (@, #, $, &)' })
    password : string;
    @IsDateString({}, {message: 'Date must be in (YYYY-MM-DD) format'})
    joiningDate : string;
    @Matches(/^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_%]+\/?$/,{message: 'invalid url'})
    linkedInUrl : string;
}

export class UpdateAdminDto {
    @IsString()
    @IsOptional()
    @Matches(/^[^0-9]*$/, { message: 'Name should not contain numbers' })
    name?: string;
    @IsEmail()
    @IsOptional()
    email?: string;
    @Matches(/[@#$&]/, { message: 'Password must contain at least one special character (@, #, $, &)' })
    @IsOptional()
    password?: string;
    @IsDateString({}, {message: 'Date must be in (YYYY-MM-DD) format'})
    @IsOptional()
    joiningDate?: string;
    @Matches(/^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_%]+\/?$/,{message: 'LinkedIn URL must be a valid profile link (e.g., https://www.linkedin.com/in/username/)'})
    @IsOptional()
    linkedInUrl?: string;
}