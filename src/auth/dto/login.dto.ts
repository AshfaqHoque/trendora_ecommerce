import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: 'Email field is required' })
    @IsEmail({}, { message: 'Please enter a valid email address (e.g., john@example.com)' })
    email : string;

    @IsNotEmpty({ message: 'Password field is required' })
    @Matches(/[@#$&]/, { message: 'Password must contain at least one special character (@, #, $, &)' })
    password : string;
}