// src/app/area/area.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from './area.entity';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepo: Repository<Area>,
  ) {}

  create(nombre: string) {
    const area = this.areaRepo.create({ nombre });
    return this.areaRepo.save(area);
  }

  findAll() {
    return this.areaRepo.find({ relations: ['salas'] });
  }

  async findOne(id: string){
    return this.areaRepo.findOne({
        where: { id },
        relations: ['salas', 'users'], // opcional
    });
  }
}
