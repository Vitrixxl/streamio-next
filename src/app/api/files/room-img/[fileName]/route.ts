import { existsSync } from 'fs';
import mime from 'mime-types';
import { readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ fileName: string }> },
) {
  const { fileName } = await params;
  const filePath = path.join(process.cwd(), '/images/room', fileName);
  const exist = existsSync(filePath);
  if (!exist) return new NextResponse('File not found', { status: 404 });
  const fileBuffer = await readFile(filePath);
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': mimeType,
    },
  });
}
