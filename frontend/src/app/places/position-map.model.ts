export interface IPositionMap {
  userId: string;
  eventDate: Date;
  healthSignals: string[];
  position: object;
}
export class PositionMap implements IPositionMap {
  constructor(
    public id: string,
    public userId: string,
    public eventDate: Date,
    public healthSignals: string[],
    public position: object
  ) {}
}
