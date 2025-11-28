import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/app/auth/jwt-auth.guard';
import { Roles } from 'src/app/auth/roles.decorator';
import { RolesGuard } from 'src/app/auth/roles.guard';
import { QrService } from './qr.service';


@Controller('qr')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Roles('user', 'admin')
  @Get()
  async getQr(@Query('text') text: string) {
    if (!text) {
      return { error: 'Debe enviar ?text=algo' };
    }
    const qrBase64 = await this.qrService.generateQr(text);
    return { text, qrBase64 };
  }

  @Roles('admin')
  @Get('admin-only')
  getAdminOnly() {
    return { msg: 'Solo admin' };
  }
}
