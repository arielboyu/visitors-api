import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Area } from "../area/area.entity";
import { Cita } from "../cita/cita.entity";

@Entity()
export class Sala {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @ManyToOne(() => Area, area => area.salas)
  area: Area;

  @OneToMany(() => Cita, cita => cita.sala)
  citas: Cita[];
}
