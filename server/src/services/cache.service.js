import { createClient } from 'redis';
import { env } from '../config/env.js';

const EVENT_LIST_VERSION_KEY = 'event:list:version';
const EVENT_LIST_TTL_SECONDS = env.cacheTtlSeconds;
const EVENT_DETAIL_TTL_SECONDS = env.cacheTtlSeconds;
const EVENT_AVAILABILITY_TTL_SECONDS = env.cacheTtlSeconds;

let client;
let connectionPromise;

const getClient = async () => {
  if (!env.redisUrl) return null;

  if (!client) {
    client = createClient({ url: env.redisUrl });
    client.on('error', (error) => console.error('Redis cache error', error.message));
  }

  if (client.isOpen) return client;
  if (!connectionPromise) {
    connectionPromise = client.connect().catch((error) => {
      connectionPromise = null;
      console.error('Redis cache unavailable', error.message);
      return null;
    });
  }

  return connectionPromise;
};

const readJson = async (key) => {
  try {
    const redis = await getClient();
    if (!redis) return null;
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis cache read failed', error.message);
    return null;
  }
};

const writeJson = async (key, value, ttlSeconds) => {
  try {
    const redis = await getClient();
    if (redis) await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    console.error('Redis cache write failed', error.message);
  }
};

const deleteKey = async (key) => {
  try {
    const redis = await getClient();
    if (redis) await redis.del(key);
  } catch (error) {
    console.error('Redis cache delete failed', error.message);
  }
};

const increment = async (key) => {
  try {
    const redis = await getClient();
    return redis ? await redis.incr(key) : null;
  } catch (error) {
    console.error('Redis cache increment failed', error.message);
    return null;
  }
};

export const eventAvailabilityKey = (eventId) => `event:availability:${eventId}`;
export const eventDetailKey = (eventId) => `event:detail:${eventId}`;
export const eventListKey = (version, queryKey) => `event:list:${version}:${queryKey}`;

export const getEventListVersion = async () => (await readJson(EVENT_LIST_VERSION_KEY)) || 1;

export const cacheEventList = (key, value) => writeJson(key, value, EVENT_LIST_TTL_SECONDS);
export const getCachedEventList = (key) => readJson(key);

export const cacheEventDetail = (key, value) => writeJson(key, value, EVENT_DETAIL_TTL_SECONDS);
export const getCachedEventDetail = (key) => readJson(key);

export const cacheEventAvailability = (key, value) =>
  writeJson(key, value, EVENT_AVAILABILITY_TTL_SECONDS);
export const getCachedEventAvailability = (key) => readJson(key);

export const invalidateEventCaches = async (eventId) => {
  await Promise.all([
    deleteKey(eventDetailKey(eventId)),
    deleteKey(eventAvailabilityKey(eventId)),
    increment(EVENT_LIST_VERSION_KEY)
  ]);
};
