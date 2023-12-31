import {Inject, Injectable} from '@nestjs/common';
import {ClientRedis} from '@nestjs/microservices';
import {CreateVehicleEvent} from './vehicle.event';
import {CreateVehicleDto} from './dto/createVehicleDto';

@Injectable()
export class VehicleService {
  constructor(
    @Inject('VEHICLE_SERVICE') private readonly vehicleService: ClientRedis,
  ) {}

  async createVehicle(createVehicleDto: CreateVehicleDto) {
    return await this.vehicleService.send(
        'create_vehicle',
        new CreateVehicleEvent(
            createVehicleDto.name,
            createVehicleDto.brand,
            createVehicleDto.type,
            createVehicleDto.licensePlate,
            createVehicleDto.ownerId,
        ),
    ).toPromise()
  }
}
