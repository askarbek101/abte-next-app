import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import RedisService from '@/services/redis-service';

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 });
  }

  try {
    const data = await RedisService.getInstance().read(key);
    if (data) {
      return NextResponse.json({ data }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Key not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'cannot get key' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    //@ts-ignore
  const { key, value } = await request.json();

  if (!key || value === undefined) {
    return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
  }

  try {
    await RedisService.getInstance().create(key, value);
    return NextResponse.json({ message: 'Key created successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'key was not created' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
    //@ts-ignore
  const { key, value } = await request.json();

  if (!key || value === undefined) {
    return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
  }

  try {
    await RedisService.getInstance().update(key, value);
    return NextResponse.json({ message: 'Key updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Key was not updated' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
    //@ts-ignore
  const { key } = await request.json();

  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 });
  }

  try {
    await RedisService.getInstance().delete(key);
    return NextResponse.json({ message: 'Key deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'key was not deleted' }, { status: 500 });
  }
}
