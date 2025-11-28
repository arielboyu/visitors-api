// src/app/dates/cita.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Sala } from '../sala/sala.entity';
import { Area } from '../area/area.entity';

@Entity()
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fecha: Date;

  @Column()
  horaCita: string;

  @Column()
  horaFin: string;

  @Column('int')
  duracion: number;

  @Column({ nullable: true })
  dni?: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  redirect_invite: string;

  @ManyToOne(() => Sala, sala => sala.citas)
  sala: Sala;

  @ManyToOne(() => Area, area => area.salas)
  area: Area;
}