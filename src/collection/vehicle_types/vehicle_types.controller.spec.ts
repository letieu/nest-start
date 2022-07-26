import { Test, TestingModule } from '@nestjs/testing';
import { VehicleTypesController } from './vehicle_types.controller';
import { VehicleTypesService } from './vehicle_types.service';
import { CreateVehicleTypeDto } from './dto/create-vehicle_type.dto';

const mockVehicleTypesService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('VehicleTypesController', () => {
  let controller: VehicleTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleTypesController],
      providers: [VehicleTypesService],
    })
      .overrideProvider(VehicleTypesService)
      .useValue(mockVehicleTypesService)
      .compile();

    controller = module.get<VehicleTypesController>(VehicleTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    await controller.findAll();
    expect(mockVehicleTypesService.findAll).toHaveBeenCalled();
  });

  it('should call findOne', async () => {
    await controller.findOne('1');
    expect(mockVehicleTypesService.findOne).toHaveBeenCalledWith({ id: 1 });
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
    await controller.create(dto);
    expect(mockVehicleTypesService.create).toHaveBeenCalledWith(dto);
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
    await controller.update('1', dto);
    expect(mockVehicleTypesService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call remove', async () => {
    await controller.remove('1');
    expect(mockVehicleTypesService.remove).toHaveBeenCalledWith(1);
  });
});
