// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET!;

// Verify webhook signature
function verifySignature(body: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  return `sha256=${expectedSignature}` === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('sanity-webhook-signature');

    // Verify webhook signature
    if (!signature || !verifySignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const documentType = payload._type;

    console.log('Webhook received:', { type: documentType, id: payload._id });

    // Revalidate based on document type
    if (documentType === 'product') {
      // Revalidate all product-related caches
      revalidateTag('products');
      revalidateTag('homepage');
      console.log('Revalidated: products, homepage');
    } else if (documentType === 'category') {
      // Revalidate category-related caches
      revalidateTag('categories');
      revalidateTag('products'); // Products also need refresh as they reference categories
      console.log('Revalidated: categories, products');
    }

    return NextResponse.json({ 
      message: 'Cache revalidated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' }, 
      { status: 500 }
    );
  }
}