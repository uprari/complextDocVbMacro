import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session) {
    return NextResponse.json({ authenticated: true }, { status: 200 });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

//app/api/check-auth/route.ts
