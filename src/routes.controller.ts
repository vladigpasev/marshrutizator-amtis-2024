import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { findValidRoute, findShortestRoute, findMostEfficientRoute } from './lib/route-optimizer';
import { ValidRouteDto, OptimRouteDto } from './routes.dto';

@ApiTags('routes')
@Controller('routes')
export class RoutesController {
  @Post('valid')
  getValidRoute(@Body() body: ValidRouteDto) {
    const route = findValidRoute(body.packages, body.roads, body.capacity, body.startCity);
    return { route };
  }

  @Post('shortest')
  getShortestRoute(@Body() body: OptimRouteDto) {
    return findShortestRoute(body.packages, body.roads, body.capacity);
  }

  @Post('efficient')
  getEfficientRoute(@Body() body: OptimRouteDto) {
    return findMostEfficientRoute(body.packages, body.roads, body.capacity);
  }
}
