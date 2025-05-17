export interface Package {
  name: string;
  from: string;
  to: string;
  weight: number;
}

export interface Road {
  from: string;
  to: string;
  distance: number;
}

interface CityGraph {
  [city: string]: { to: string; distance: number }[];
}

interface State {
  city: string;
  pickedMask: number; // bitmask of packages currently on board
  deliveredMask: number; // bitmask of delivered packages
  load: number;
  route: string[];
  cost: number;
}

function buildGraph(roads: Road[]): CityGraph {
  const graph: CityGraph = {};
  for (const { from, to, distance } of roads) {
    if (!graph[from]) graph[from] = [];
    if (!graph[to]) graph[to] = [];
    graph[from].push({ to, distance });
    graph[to].push({ to: from, distance });
  }
  return graph;
}

function loadAndUnload(
  state: State,
  packages: Package[],
  capacity: number,
): State | null {
  // Unload packages destined for this city
  for (let i = 0; i < packages.length; i++) {
    if (state.pickedMask & (1 << i)) {
      if (packages[i].to === state.city) {
        state.pickedMask &= ~(1 << i);
        state.deliveredMask |= 1 << i;
        state.load -= packages[i].weight;
      }
    }
  }
  // Pick up all packages located in this city and not yet picked/delivered
  let additionalWeight = 0;
  for (let i = 0; i < packages.length; i++) {
    if (
      !(state.deliveredMask & (1 << i)) &&
      !(state.pickedMask & (1 << i)) &&
      packages[i].from === state.city
    ) {
      additionalWeight += packages[i].weight;
      state.pickedMask |= 1 << i;
    }
  }
  state.load += additionalWeight;
  if (state.load > capacity) {
    return null;
  }
  return state;
}

function costForStep(
  distance: number,
  load: number,
  mode: 'distance' | 'fuel',
): number {
  if (mode === 'distance') return distance;
  // fuel mode
  return (distance * (10 + load / 100)) / 100;
}

function search(
  packages: Package[],
  roads: Road[],
  capacity: number,
  startCity: string,
  mode: 'distance' | 'fuel',
): { route: string[]; cost: number } | null {
  const graph = buildGraph(roads);
  const totalMask = (1 << packages.length) - 1;
  const initial: State = {
    city: startCity,
    pickedMask: 0,
    deliveredMask: 0,
    load: 0,
    route: [startCity],
    cost: 0,
  };
  const loaded = loadAndUnload({ ...initial }, packages, capacity);
  if (!loaded) return null;

  const queue: State[] = [loaded];
  const visited = new Map<string, number>();

  const key = (s: State) => `${s.city}-${s.pickedMask}-${s.deliveredMask}`;
  visited.set(key(loaded), 0);

  while (queue.length) {
    // pick state with smallest cost
    queue.sort((a, b) => a.cost - b.cost);
    const state = queue.shift()!;

    if (state.city === startCity && state.deliveredMask === totalMask) {
      return { route: state.route, cost: state.cost };
    }

    for (const edge of graph[state.city] || []) {
      const travelCost = costForStep(edge.distance, state.load, mode);
      const next: State = {
        city: edge.to,
        pickedMask: state.pickedMask,
        deliveredMask: state.deliveredMask,
        load: state.load,
        route: [...state.route, edge.to],
        cost: state.cost + travelCost,
      };
      const after = loadAndUnload(next, packages, capacity);
      if (!after) continue;
      const k = key(after);
      if (visited.has(k) && visited.get(k)! <= after.cost) continue;
      visited.set(k, after.cost);
      queue.push(after);
    }
  }
  return null;
}

export function findValidRoute(
  packages: Package[],
  roads: Road[],
  capacity: number,
  startCity: string,
): string[] | null {
  const result = search(packages, roads, capacity, startCity, 'distance');
  return result ? result.route : null;
}

export function findShortestRoute(
  packages: Package[],
  roads: Road[],
  capacity: number,
): { route: string[]; distance: number } | null {
  const cities = Array.from(
    new Set<string>([
      ...packages.map((p) => p.from),
      ...packages.map((p) => p.to),
    ]),
  );
  let best: { route: string[]; cost: number } | null = null;
  for (const city of cities) {
    const res = search(packages, roads, capacity, city, 'distance');
    if (res && (!best || res.cost < best.cost)) {
      best = res;
    }
  }
  return best ? { route: best.route, distance: best.cost } : null;
}

export function findMostEfficientRoute(
  packages: Package[],
  roads: Road[],
  capacity: number,
): { route: string[]; fuel: number } | null {
  const cities = Array.from(
    new Set<string>([
      ...packages.map((p) => p.from),
      ...packages.map((p) => p.to),
    ]),
  );
  let best: { route: string[]; cost: number } | null = null;
  for (const city of cities) {
    const res = search(packages, roads, capacity, city, 'fuel');
    if (res && (!best || res.cost < best.cost)) {
      best = res;
    }
  }
  return best ? { route: best.route, fuel: best.cost } : null;
}
