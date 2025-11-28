  import { Injectable, NotFoundException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { v4 as uuidv4 } from 'uuid';
  import { CreateCitaDto } from './create-cita.dto';
  import { Cita } from './cita.entity';
  import { QrService } from 'src/app/qr/qr.service';
import { AreaService } from '../area/area.service';

  @Injectable()
  export class CitasService {
    constructor(
      @InjectRepository(Cita)
      private citaRepository: Repository<Cita>,
      private qrService: QrService,
      private areaService: AreaService,
    ) {}

      async create(createDto: CreateCitaDto): Promise<any> {
        console.log("createDto: ", createDto);

        const id = uuidv4();
        const redirect_invite = `www.hackaton-cita-${id}.com`;

        // Si no vino duración -> calcular
        let duracionFinal = createDto.duracion;

        if (!duracionFinal) {
          duracionFinal = this.calcularDuracion(createDto.horaCita, createDto.horaFin);
        }

        const cita = this.citaRepository.create({
          id,
          redirect_invite,
          duracion: duracionFinal,
          ...createDto,
        });


        const savedCita = await this.citaRepository.save(cita);
        const area = await this.areaService.findOne(createDto.areaId);

        let qrBase64: string | null = null;

        if (createDto.email) {
          const fecha = new Date(createDto.fecha);

          const mensajeQr = `
            Hola ${createDto.dni || 'Usuario'},
            Usted tiene una cita el día ${fecha.toLocaleDateString()} a las ${createDto.horaCita} en el Área ${area?.nombre}.
            Duración: ${duracionFinal}
            Link de la cita: ${redirect_invite}
          `;

          qrBase64 = await this.qrService.generateQr(mensajeQr);
          console.log(mensajeQr);
        }

        return { ...savedCita, qrBase64 };
      }

    async findAll(): Promise<any> {
      return await this.citaRepository.find();
    }

    async findOne(id: string): Promise<Cita> {
      const cita = await this.citaRepository.findOne({ where: { id } });

      if (!cita) {
        throw new NotFoundException('Cita no encontrada');
      }

      return cita;
    }

    private calcularDuracion(horaInicio: string, horaFin: string): number {
      const [h1, m1] = horaInicio.split(':').map(Number);
      const [h2, m2] = horaFin.split(':').map(Number);

      const inicio = h1 * 60 + m1;
      const fin = h2 * 60 + m2;

      let diff = fin - inicio;
      if (diff < 0) diff += 24 * 60; // por si pasa la medianoche

      const horas = Math.floor(diff / 60);
      const minutos = diff % 60;

      return horas;
    }

  }
