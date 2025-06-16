import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '~/lib/auth/server/auth';
import {
  createDeviceSchema,
  updateDeviceSchema,
} from '~/server/api/schema/device';
import { db } from '~/server/db';
import { device } from '~/server/db/schema';

export async function GET(req: NextRequest) {
  const result = await db.select().from(device);
  return NextResponse.json({ data: result }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({
      message: 'Unauthorized',
    }, { status: 401 });
  }

  const body = await req.json();
  const { data, error } = createDeviceSchema.safeParse(body);
  console.log({ data });

  if (error) {
    console.error(error.message);
    return NextResponse.json({
      message: error.message,
    });
  }
  await db.insert(device).values({ ...data, createdAt: new Date() });
  return NextResponse.json({ message: 'Created' }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({
      message: 'Unauthorized',
    }, { status: 401 });
  }
  const { data, error } = z.object({
    deviceId: z.string({ message: 'Device id must be given' }),
  }).safeParse(
    await req.json(),
  );
  if (error) {
    return NextResponse.json({
      message: error.message,
    });
  }
  await db.delete(device).where(eq(device.id, data.deviceId));
  return NextResponse.json({
    message: 'Appareil supprimé',
  }, { status: 201 });
}
export async function PUT(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({
      message: 'Unauthorized',
    }, { status: 401 });
  }
  const { data, error } = updateDeviceSchema.safeParse(await req.json());
  console.log({ data });
  if (error) {
    console.error(error);
    return NextResponse.json({
      message: error.message,
    });
  }
  await db.update(device).set(data).where(eq(device.id, data.id));
  return NextResponse.json({
    message: 'updated',
  });
}
