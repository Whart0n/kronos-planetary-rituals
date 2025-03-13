import { createNanoEvents } from 'nanoevents';

export const storeEvents = createNanoEvents<{
  'auth:login': () => void;
  'auth:logout': () => void;
  'auth:initialized': () => void;
}>();
