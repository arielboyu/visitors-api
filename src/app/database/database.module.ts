import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from '../../../datasource';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSource.options,   // ahora sí
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
