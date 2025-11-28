
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Area } from '../area/area.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column("text", { array: true, default: ['user'] })
  roles: string[];

  @Column({ type: 'text', nullable: true })
  currentHashedRefreshToken?: string | null;

  @ManyToOne(() => Area, area => area.users, { nullable: true })
  area: Area; // <-- NECESARIO!
}
