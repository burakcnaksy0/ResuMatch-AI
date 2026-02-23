import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateFeedbackDto {
    @IsString()
    @IsNotEmpty({ message: 'Description cannot be empty' })
    @MinLength(10, { message: 'Description must be at least 10 characters long' })
    description: string;
}
