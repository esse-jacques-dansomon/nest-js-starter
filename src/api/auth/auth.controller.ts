import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@/api/user/user.entity';
import { JwtAuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto, RegisterDto } from '@/api/auth/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  private register(@Body() body: RegisterDto): Promise<User | never> {
    return this.service.register(body);
  }

  @Post('login')
  private async login(
    @Body() body: LoginDto,
  ): Promise<LoginResponseDto | never> {
    return await this.service.login(body);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  private refresh(@Req() { user }: Request): Promise<LoginResponseDto | never> {
    return this.service.refresh(<User>user);
  }
}
