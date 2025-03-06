import { redirect } from 'next/navigation';
import { env } from '~/env';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { metadataCheckoutSchema } from '~/server/api/schema/booking';
import { db } from '~/server/db';
import { booking, bookingDevice } from '~/server/db/schema';

export async function GET(req: NextRequest, {}) {
  const stripe = new Stripe(env.STRIPE_API_KEY);
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    console.error('no sesId');
    return NextResponse.redirect('/');
  }
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const { data, error } = metadataCheckoutSchema.safeParse(session.metadata);
  if (error) {
    console.error(error);
    return NextResponse.redirect('/');
  }
  const { price, guestCount, userId, roomId, slot, date, devices } = data;
  console.log(data);
  const [newBooking] = await db.insert(booking).values({
    date,
    guestCount,
    slot,
    roomId,
    userId,
    price,
    paymentIntent: session.payment_intent,
  }).returning();
  if (!newBooking) redirect('/');
  console.log(newBooking.id);
  if (devices.length > 0) {
    await db.insert(bookingDevice).values(devices.map((d) => ({
      bookingId: newBooking.id,
      ...d,
    })));
  }
  return redirect('/');
}
