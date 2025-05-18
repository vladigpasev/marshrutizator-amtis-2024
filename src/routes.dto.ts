import { ApiProperty } from '@nestjs/swagger';

export class PackageDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  from: string;
  @ApiProperty()
  to: string;
  @ApiProperty()
  weight: number;
}

export class RoadDto {
  @ApiProperty()
  from: string;
  @ApiProperty()
  to: string;
  @ApiProperty()
  distance: number;
}

export class ValidRouteDto {
  @ApiProperty({ type: [PackageDto] })
  packages: PackageDto[];
  @ApiProperty({ type: [RoadDto] })
  roads: RoadDto[];
  @ApiProperty()
  capacity: number;
  @ApiProperty()
  startCity: string;
}

export class OptimRouteDto {
  @ApiProperty({ type: [PackageDto] })
  packages: PackageDto[];
  @ApiProperty({ type: [RoadDto] })
  roads: RoadDto[];
  @ApiProperty()
  capacity: number;
}
