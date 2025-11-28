import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/app/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      // omit password
      const { password, currentHashedRefreshToken, ...result } = user as any;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // user should be the full user entity or at least { id, username, roles }
    const payload = { sub: user.id, username: user.username, roles: user.roles };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '180s') as any,
    });

    const refreshToken = this.jwtService.sign({ sub: user.id }, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });

    // store hashed refresh token (rotation)
    await this.usersService.setCurrentRefreshToken(user.id, refreshToken);

    return { 
      accessToken, 
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles,
      },
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUserIfRefreshTokenMatches(refreshToken, userId);
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    // issue new tokens
    const payload = { sub: user.id, username: user.username, roles: user.roles };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '900s') as any,
    });

    const newRefreshToken = this.jwtService.sign({ sub: user.id }, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });

    // rotate refresh token
    await this.usersService.setCurrentRefreshToken(user.id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string) {
    await this.usersService.removeRefreshToken(userId);
  }
}
