import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { writeImg } from '~/server/api/utils';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const img = formData.get('img') as File | undefined;
    if (!img) {
      return NextResponse.json({
        success: false,
        message: "You didn't provide the image",
        details: "The image wasn't found in the img key of the formdata",
      });
    }

    const id = uuid();
    const ext = await writeImg(id, img);
    console.log(ext);
    return NextResponse.json({
      success: true,
      data: {
        id,
        ext,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: 'Error while write the file',
      details: (error as Error).message,
    });
  }
}
