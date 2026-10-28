import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// DELETE ------------------------------------------ DELETE
// const ALLOWED_ORIGIN = 'https://admin.beyouond.com';

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, x-webhook-secret',
//     },
//   });
// }
// DELETE ------------------------------------------ DELETE

export async function POST(req: Request) {
  // const headers = new Headers(); // DELETE
  // headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN); // DELETE

  const secret = req.headers.get('x-webhook-secret');
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (secret !== expectedSecret) {
    console.error('[401] Invalid token:', {
      received: secret,
      expected: expectedSecret,
    });
    return NextResponse.json(
      { message: 'Invalid token' },
      {
        status: 401,
        // headers, // DELETE
      }
    );
  }

  const body = await req.json();
  const { category = '', subcategory = '', slug = '', id } = body;

  // ✅ category обязателен
  if (!category) {
    return NextResponse.json(
      { error: 'Missing required field: category' },
      {
        status: 400,
        // headers, // DELETE
      }
    );
  }

  // 🛠 Собираем путь динамически
  const segments = [category, subcategory, slug || id]
    .filter(Boolean)
    .map((segment) => segment.trim()); // <-- удаляем пробелы
  let path = '/' + segments.join('/');
  path = path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';

  try {
    await revalidatePath(path);
    console.log(`[200] Revalidated page: ${path}`);

    return NextResponse.json(
      {
        revalidated: true,
        path,
        timestamp: Date.now(),
      },
      {
        // headers, // DELETE
      }
    );
  } catch (err) {
    console.error('[500] Revalidation error:', err);
    return NextResponse.json(
      { error: 'Failed to revalidate', details: String(err) },
      {
        status: 500,
        // headers, // DELETE
      }
    );
  }
}
