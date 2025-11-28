import { IsString, IsOptional, IsEmail, IsDateString } from 'class-validator';

export class CreateCitaDto {
  @IsString()
  dni: string;

  @IsDateString()
  fecha: Date;

  @IsString()
  horaCita: string; // formato: 'HH:mm'

  @IsString()
  horaFin: string; // OBLIGATORIO

  @IsOptional()
  @IsString()
  duracion?: number; // OPCIONAL

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  salaId?: string;

  @IsString()
  areaId: string;
}
