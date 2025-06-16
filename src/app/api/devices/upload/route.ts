import { NextRequest, NextResponse } from 'next/server';
import { resolve } from 'path';
import { writeFile } from 'fs/promises';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get('image');
  if (!image || !(image instanceof File)) {
    return NextResponse.json({
      message: 'Invalid form data',
    });
  }

  const fileId = uuid();
  writeFile(
    resolve(process.cwd(), 'public', fileId + image.name),
    await image.bytes(),
  );

  return NextResponse.json({
    filepath: fileId + image.name,
  });
}
