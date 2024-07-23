import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  let responseText = 'Hello World'

  return new Response(responseText)
}