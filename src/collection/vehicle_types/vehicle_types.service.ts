import { Injectable } from '@nestjs/common';
import { CreateVehicleTypeDto } from './dto/create-vehicle_type.dto';
import { VehicleType } from './entities/vehicle_type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../database/base.service';

@Injectable()
export class VehicleTypesService extends BaseService<VehicleType> {
  constructor(
    @InjectRepository(VehicleType)
    private vehicleTypeRepository: Repository<VehicleType>,
  ) {
    super(vehicleTypeRepository);
  }

  async create(createVehicleTypeDto: CreateVehicleTypeDto) {
    return this.vehicleTypeRepository.save(createVehicleTypeDto);
  }
}
