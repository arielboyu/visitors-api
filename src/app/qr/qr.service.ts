import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  async generateQr(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        scale: 6,
      });
    } catch (error) {
      throw new Error('Error generando el QR');
    }
  }
}
