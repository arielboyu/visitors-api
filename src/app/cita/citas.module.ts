import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './cita.entity';
import { CitasController } from './dates.controller';
import { CitasService } from './dates.service';
import { QrService } from 'src/app/qr/qr.service';
import { AreaModule } from '../area/area.module';


@Module({
  imports: [TypeOrmModule.forFeature([Cita]), AreaModule],
  controllers: [CitasController],
  providers: [CitasService, QrService],
})
export class CitasModule {}
