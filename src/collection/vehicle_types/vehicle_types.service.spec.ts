import { Test, TestingModule } from '@nestjs/testing';
import { VehicleTypesService } from './vehicle_types.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleType } from './entities/vehicle_type.entity';
import { CreateVehicleTypeDto } from './dto/create-vehicle_type.dto';

const mockVehicleTypeRepository = {
  save: jest
    .fn()
    .mockImplementation((dto) => Promise.resolve({ ...dto, id: Date.now() })),
  update: jest.fn().mockImplementation((id, dto) => Promise.resolve(dto)),
  remove: jest.fn().mockImplementation((id) => Promise.resolve(id)),
};

describe('VehicleTypesService', () => {
  let service: VehicleTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleTypesService,
        {
          provide: getRepositoryToken(VehicleType),
          useValue: mockVehicleTypeRepository,
        },
      ],
    }).compile();

    service = module.get<VehicleTypesService>(VehicleTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call create', async () => {
    const dto: CreateVehicleTypeDto = {
      name: 'name',
      description: 'description',
      image: 'image',
      initPriceEth: 1,
      initPriceBsc: 1,
      initQuantityEth: 1,
      initQuantityBsc: 1,
    };
    const vehicle = await service.create(dto);
    expect(mockVehicleTypeRepository.save).toHaveBeenCalledWith(dto);
    expect(vehicle).toEqual({ ...dto, id: vehicle.id });
  });

  it('should call update', async () => {
    const dto: CreateVehicleTypeDto = {
      name: 'name',
      description: 'description',
      image: 'image',
      initPriceEth: 1,
      initPriceBsc: 1,
      initQuantityEth: 1,
      initQuantityBsc: 1,
    };
    const vehicle = await service.update(1, dto);
    expect(mockVehicleTypeRepository.update).toHaveBeenCalledWith(1, dto);
  });
});
