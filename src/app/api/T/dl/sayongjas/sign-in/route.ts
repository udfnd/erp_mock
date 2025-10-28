import { NextResponse } from 'next/server';

import { SignInRequestSchema } from '@/api/auth/auth.schema';
import { mockAccounts } from '@/app/api/_mock/data';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { id, password, gigwanNanoId } = SignInRequestSchema.parse(json);

    const normalizedGigwanId = gigwanNanoId.toUpperCase();
    const account = mockAccounts.find(
      (item) =>
        item.id === id && item.password === password && item.gigwanNanoId.toUpperCase() === normalizedGigwanId,
    );

    if (!account) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ accessToken: `${normalizedGigwanId}-${id}-token` });
  } catch (error) {
    console.error('Sign-in error', error);
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}

