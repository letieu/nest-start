import { Module } from '@nestjs/common';
import { VehicleTypesService } from './vehicle_types.service';
import { VehicleTypesController } from './vehicle_types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleType } from './entities/vehicle_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleType])],
  controllers: [VehicleTypesController],
  providers: [VehicleTypesService],
})
export class VehicleTypesModule {}
