export class CreateVehicleEvent {
  constructor(
    public readonly name: string,
    public readonly brand: string,
    public readonly type: string,
    public readonly licensePlate: string,
    public readonly ownerId: string,
  ) {}

  toString() {
    return JSON.stringify({
      name: this.name,
      brand: this.brand,
      type: this.type,
      licensePlate: this.licensePlate,
      ownerId: this.ownerId,
    });
  }
}
