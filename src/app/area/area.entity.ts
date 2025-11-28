import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../users/user.entity";
import { Sala } from "../sala/sala.entity";

@Entity()
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @OneToMany(() => Sala, sala => sala.area)
  salas: Sala[];

  @OneToMany(() => User, user => user.area)
  users: User[]; // colaboradores
}
