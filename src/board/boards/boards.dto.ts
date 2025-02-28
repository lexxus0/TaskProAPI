import { IsString, MaxLength, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25, { message: 'The name must not exceed 25 characters.' })
  name: string;

  @IsString()
  @IsOptional()
  background?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}

export class UpdateBoardDto {
  @IsString()
  @IsOptional()
  @MaxLength(25, { message: 'The name must not exceed 25 characters.' })
  name?: string;

  @IsString()
  @IsOptional()
  background?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
