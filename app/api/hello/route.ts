import type { NextRequest } from 'next/server'
import { redisClient } from '@/app/databases/redis/redis'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  let responseText = 'Hello World'

  const data = await redisClient.get('foo');
  if (data) {
    responseText = data.toString();
  }

  return new Response(responseText)
}
