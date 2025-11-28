import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from 'src/app/users/user.service';
import { Role } from './roles.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const existing = await this.usersService.findByUsername(dto.username);
    if (existing) return { error: 'Usuario ya existe' };
    const roles: Role[] =
    dto.roles && dto.roles.length
      ? dto.roles.map(r => r as Role)
      : [Role.USER];
    const user = await this.usersService.createUser(dto.username, dto.password, roles);
    const { password, currentHashedRefreshToken, ...rest } = user as any;
    return rest;
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const valid = await this.authService.validateUser(dto.username, dto.password);
    if (!valid) return { error: 'Credenciales inválidas' };
    return this.authService.login(valid);
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    const { userId, refreshToken } = body;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    const user = req.user;
    await this.authService.logout(user.userId);
    return { success: true };
  }
}
