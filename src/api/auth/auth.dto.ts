import { Trim } from 'class-sanitizer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @Trim()
  @IsEmail()
  public readonly email: string;

  @ApiProperty()
  @IsString()
  public readonly password: string;
}

export class RegisterDto {
  @ApiProperty()
  @Trim()
  @IsEmail()
  public readonly email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  public readonly password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly name?: string;
}

export class LoginResponseDto {
  @ApiProperty()
  public access_token: string;
  @ApiProperty()
  public token_type: string;
  @ApiProperty()
  public scope: string;
  @ApiProperty()
  public created_at: number;
}
