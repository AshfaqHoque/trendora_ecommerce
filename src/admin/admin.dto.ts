import { IsDateString, IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, Min } from "class-validator";

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Matches(/^[^0-9]*$/, { message: 'Name should not contain numbers' })
    fullName : string;

    @IsNotEmpty({ message: 'Email field is required' })
    @IsEmail({}, { message: 'Please enter a valid email address (e.g., john@example.com)' })
    email : string;

    @IsNotEmpty({ message: 'Age field is required' })
    @IsInt()
    @Min(20)
    age: number;

    @IsNotEmpty({ message: 'Password field is required' })
    @Matches(/[@#$&]/, { message: 'Password must contain at least one special character (@, #, $, &)' })
    password : string;

    // @IsDateString({}, {message: 'Date must be in (YYYY-MM-DD) format'})
    // joiningDate : string;

    @Matches(/^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_%]+\/?$/,{message: 'invalid url'})
    linkedInUrl : string;
}

export class UpdateAdminDto {
    @IsString()
    @IsOptional()
    @MaxLength(100)
    @Matches(/^[^0-9]*$/, { message: 'Name should not contain numbers' })
    fullName?: string;

    @IsEmail({}, { message: 'Please enter a valid email address (e.g., john@example.com)' })
    @IsOptional()
    email?: string;

    @IsInt()
    @Min(20)
    @IsOptional()
    age?: number;

    // @IsDateString({}, { message: 'Date must be in (YYYY-MM-DD) format' })
    // @IsOptional()
    // joiningDate?: string;

    @Matches(/^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_%]+\/?$/, {message: 'LinkedIn URL must be a valid profile link (e.g., https://www.linkedin.com/in/username/)',})
    @IsOptional()
    linkedInUrl?: string;

    @IsIn(['active', 'inactive'],{ message: 'status must be either active or inactive'})
    status: 'active' | 'inactive';
}

export class UpdateStatusDto {
    @IsIn(['active', 'inactive'],{ message: 'status must be either active or inactive'})
    status: 'active' | 'inactive';
}

export class LoginAdminDto {
    @IsNotEmpty({ message: 'Email field is required' })
    @IsEmail({}, { message: 'Please enter a valid email address (e.g., john@example.com)' })
    email : string;

    @IsNotEmpty({ message: 'Password field is required' })
    @Matches(/[@#$&]/, { message: 'Password must contain at least one special character (@, #, $, &)' })
    password : string;
}

export class UpdatePasswordDto {
    @IsString()
    oldPassword: string;

    @Matches(/[@#$&]/, { message: 'Password must contain at least one special character (@, #, $, &)' })
    newPassword: string;
}