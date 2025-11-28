// src/app/dates/dates.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CitasService } from './dates.service';
import { CreateCitaDto } from './create-cita.dto';


@Controller('citas')
export class CitasController {
  constructor(private readonly service: CitasService) {}

  @Post()
  create(@Body() dto: CreateCitaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
