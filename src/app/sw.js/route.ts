import { NextResponse } from 'next/server';

export async function GET() {
  // 返回 204 No Content 來停止 404 錯誤
  return new NextResponse(null, { status: 204 });
}

