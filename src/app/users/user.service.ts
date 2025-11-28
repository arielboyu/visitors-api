import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findByUsername(username: string) {
    return this.usersRepo.findOne({ where: { username } });
  }

  async findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async createUser(username: string, password: string, roles: Role[] = [Role.USER]) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = this.usersRepo.create({
        username,
        password: hashed,
        roles, // ahora es Role[]
    });

    return this.usersRepo.save(user);
  }


  async setCurrentRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.usersRepo.update(userId, { currentHashedRefreshToken: hashed });
  }

  async removeRefreshToken(userId: string) {
    await this.usersRepo.update(userId, { currentHashedRefreshToken: null });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.findById(userId);
    if (!user || !user.currentHashedRefreshToken) return null;
    const isMatch = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
    return isMatch ? user : null;
  }
}
