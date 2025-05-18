import { findValidRoute, findShortestRoute, findMostEfficientRoute, Package, Road } from './route-optimizer';

describe('Route Optimizer', () => {
  const packages: Package[] = [
    { name: 'Furna', from: 'Sofia', to: 'Plovdiv', weight: 100 },
    { name: 'Hladilnik', from: 'Sofia', to: 'Veliko Tarnovo', weight: 100 },
    { name: 'Ciment', from: 'Plovdiv', to: 'Veliko Tarnovo', weight: 200 },
    { name: 'Pens', from: 'Veliko Tarnovo', to: 'Sofia', weight: 2 },
  ];

  const roads: Road[] = [
    { from: 'Sofia', to: 'Plovdiv', distance: 146 },
    { from: 'Sofia', to: 'Veliko Tarnovo', distance: 219 },
    { from: 'Plovdiv', to: 'Veliko Tarnovo', distance: 213 },
  ];

  it('finds a valid route starting from Sofia', () => {
    const route = findValidRoute(packages, roads, 250, 'Sofia');
    expect(route).toEqual([
      'Sofia',
      'Veliko Tarnovo',
      'Plovdiv',
      'Veliko Tarnovo',
      'Sofia',
    ]);
  });

  it('finds the shortest route', () => {
    const res = findShortestRoute(packages, roads, 250);
    expect(res?.route).toEqual([
      'Sofia',
      'Veliko Tarnovo',
      'Plovdiv',
      'Veliko Tarnovo',
      'Sofia',
    ]);
    expect(res?.distance).toBeGreaterThan(0);
  });

  it('finds the most fuel efficient route', () => {
    const res = findMostEfficientRoute(packages, roads, 250);
    expect(res?.route[0]).toEqual(res?.route[res.route.length - 1]);
    expect(res?.fuel).toBeGreaterThan(0);
  });
});
