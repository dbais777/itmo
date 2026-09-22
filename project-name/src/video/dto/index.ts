import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @MinLength(150)
  title: string;

  @IsNumber()
  duration: number;
}
