import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/api/user/user.entity';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';
import { LoginDto, LoginResponseDto, RegisterDto } from '@/api/auth/auth.dto';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async register(body: RegisterDto): Promise<User | never> {
    const { name, email, password }: RegisterDto = body;
    let user: User = await this.repository.findOne({ where: { email } });

    if (user) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }

    user = new User();

    user.name = name;
    user.email = email;
    user.password = this.helper.encodePassword(password);

    return this.repository.save(user);
  }

  public async login(body: LoginDto): Promise<LoginResponseDto> {
    const { email, password }: LoginDto = body;
    const user: User = await this.repository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = this.helper.isPasswordValid(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    await this.repository.update(user.id, { lastLoginAt: new Date() });

    return this.generateLoginResponseDto(user);
  }

  public async refresh(user: User): Promise<LoginResponseDto> {
    await this.repository.update(user.id, { lastLoginAt: new Date() });

    return this.generateLoginResponseDto(user);
  }

  private generateLoginResponseDto(user: User): LoginResponseDto {
    const loginResponseDto: LoginResponseDto = new LoginResponseDto();
    loginResponseDto.access_token = this.helper.generateToken(user);
    loginResponseDto.token_type = 'Bearer';
    loginResponseDto.scope = 'read write';

    return loginResponseDto;
  }
}
