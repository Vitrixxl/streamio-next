'use server';
import { crendentialRegisterSchema } from '~/server/api/schema/auth';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
// import { users } from '~/server/db/schema';

export async function authRegister(registerValue: {}) {
  const { data, error } = crendentialRegisterSchema.safeParse(registerValue);
  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  const [exist] = await db.select().from(users).where(
    eq(users.email, data.email),
  ).limit(1);
  if (exist) {
    return {
      success: false,
      message: 'An user already exists with this email',
    };
  }
  const passwordHash = await hash(data.password, 10);
  const [user] = await db.insert(users).values({
    email: data.email,
    password: passwordHash,
    name: data.name,
  }).returning();
  if (!user) {
    return {
      success: false,
      message: 'Error while inserting user',
    };
  }

  return {
    success: true,
    data: user,
  };
}
