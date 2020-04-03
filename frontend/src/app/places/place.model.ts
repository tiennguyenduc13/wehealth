export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string
  ) {}
}
export interface IHealthChange {
  userId: string;
  eventDate: Date;
  healthSignals: string[];
}
export class HealthChange implements IHealthChange {
  constructor(
    public id: string,
    public userId: string,
    public eventDate: Date,
    public healthSignals: string[]
  ) {}
}
