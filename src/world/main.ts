import { LocationPosition, World as WorldType } from './types';
import worldsData from './worlds.json';
import positionsData from './positions.json';
const worlds: WorldType[] = worldsData as unknown as WorldType[];
const positions: LocationPosition[] = positionsData as unknown as LocationPosition[];