import { NextResponse } from 'next/server';

import { mockGigwans } from '@/app/api/_mock/data';

type RouteContext = {
  params: { nanoId: string };
};

export async function GET(_request: Request, context: RouteContext) {
  const { nanoId } = context.params;
  const targetId = nanoId?.toUpperCase();

  const gigwan = mockGigwans.find((item) => item.nanoId.toUpperCase() === targetId);

  if (!gigwan) {
    return NextResponse.json({ message: 'Gigwan not found' }, { status: 404 });
  }

  return NextResponse.json(gigwan);
}
