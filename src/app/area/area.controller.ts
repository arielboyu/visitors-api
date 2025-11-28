// src/app/area/area.controller.ts
import { Controller, Post, Body, Get, NotFoundException, Param } from '@nestjs/common';
import { AreaService } from './area.service';


@Controller('areas')
export class AreaController {
  constructor(private readonly service: AreaService) {}

  @Post()
  create(@Body('nombre') nombre: string) {
    return this.service.create(nombre);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const area = await this.service.findOne(id);
    if (!area) {
      throw new NotFoundException('Área no encontrada');
    }
    return area;
  }
}
