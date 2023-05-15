import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/api/user/user.entity';
import { Repository } from 'typeorm';
import { UpdateNameDto } from '@/api/user/user.dto';
import e from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  public async findOne(id: number): Promise<User | never> {
    const user: User = await this.repository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('No user found');
    }

    return user;
  }

  public async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  public async updateName(body: UpdateNameDto, req: e.Request): Promise<User> {
    const user: User = <User>req.user;

    user.name = body.name;

    return this.repository.save(user);
  }
}
