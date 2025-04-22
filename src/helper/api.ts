import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function loadSessions(): Promise<Record<string, string>> {
  try {
    const keys = await redis.keys('session:*');
    if (keys.length === 0) return {};

    const values = await Promise.all(keys.map((key) => redis.get(key)));

    const sessions: Record<string, string> = {};
    keys.forEach((key, index) => {
      const sessionId = key.replace('session:', '');
      if (values[index]) {
        sessions[sessionId] = values[index] as string;
      }
    });

    return sessions;
  } catch (error) {
    console.error('Error loading sessions:', error);
    return {};
  }
}

export async function saveSessions(sessions: Record<string, string>) {
  try {
    const pipeline = redis.pipeline();

    const existingKeys = await redis.keys('session:*');
    if (existingKeys.length > 0) {
      pipeline.del(...existingKeys);
    }

    const ttlSeconds = 24 * 60 * 60;
    for (const [sessionId, data] of Object.entries(sessions)) {
      pipeline.set(`session:${sessionId}`, data, { ex: ttlSeconds });
    }

    await pipeline.exec();
  } catch (error) {
    console.error('Error saving sessions:', error);
    throw error;
  }
}