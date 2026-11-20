import fs from 'node:fs';
import path from 'node:path';

interface ShareCatalogItem {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  price?: string;
  oldPrice?: string;
  discount?: string;
  code?: string;
  image: string;
  storeId: string;
  storeName: string;
  affiliateUrl: string;
}

interface ShareCatalogPayload {
  items?: Record<string, ShareCatalogItem>;
}

interface MinimalReq {
  query?: Record<string, string | string[] | undefined>;
  headers?: Record<string, string | string[] | undefined>;
}

interface MinimalRes {
  status: (code: number) => MinimalRes;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parsePriceAmount(price?: string): { amount?: string; currency?: string } {
  if (!price) return {};
  const numMatch = price.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  const amount = numMatch ? numMatch[1] : undefined;
  let currency = 'USD';
  if (/EGP|جنيه/i.test(price)) currency = 'EGP';
  else if (/AED|درهم/i.test(price)) currency = 'AED';
  else if (/JPY|¥/i.test(price)) currency = 'JPY';
  else if (/EUR|€/i.test(price)) currency = 'EUR';
  else if (/INR|₹/i.test(price)) currency = 'INR';
  return { amount, currency };
}

function loadCatalog(): Record<string, ShareCatalogItem> {
  const candidates = [
    path.resolve(process.cwd(), 'public/api/share-catalog.json'),
    path.resolve(process.cwd(), 'dist/api/share-catalog.json'),
  ];
  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as ShareCatalogPayload;
        if (parsed.items) return parsed.items;
      }
    } catch {
      // Ignore read failure and check next candidate
    }
  }
  return {};
}

export default function handler(req: MinimalReq, res: MinimalRes): void {
  const rawId = req.query?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const decodedId = id ? decodeURIComponent(id.replace(/\/+$/, '').trim()) : '';

  const protoRaw = req.headers?.['x-forwarded-proto'];
  const proto = Array.isArray(protoRaw) ? protoRaw[0] : protoRaw?.split(',')[0]?.trim() || 'https';
  const hostRaw = req.headers?.['x-forwarded-host'] || req.headers?.host;
  const host = (Array.isArray(hostRaw) ? hostRaw[0] : hostRaw) || 'www.dodx.shop';
  const origin = `${proto}://${host}`;

  const catalog = loadCatalog();
  const item = decodedId ? catalog[decodedId] : undefined;

  const title = item
    ? `${item.title}${item.price ? ` — ${item.price}` : ''}${item.discount ? ` (${item.discount})` : ''} | Dodx`
    : 'Dodx — Verified Coupons & Smart Shopping Deals | dodx.shop';

  const ogTitle = item
    ? `${item.title}${item.price ? ` — ${item.price}` : ''}${item.discount ? ` (${item.discount})` : ''}`
    : 'Dodx — Verified Coupons & Smart Shopping Deals';

  const description = item
    ? [
        item.price ? `Price After Discount: ${item.price}` : '',
        item.oldPrice ? `Was ${item.oldPrice}` : '',
        item.discount ? `Discount: ${item.discount}` : '',
        item.code ? `Code: ${item.code}` : '',
        item.description,
      ]
        .filter(Boolean)
        .join(' · ')
    : 'Save money automatically with verified coupons, promo codes, and smart shopping deals on dodx.shop.';

  const image = item?.image
    ? item.image.startsWith('http')
      ? item.image
      : `${origin}${item.image.startsWith('/') ? '' : '/'}${item.image}`
    : `${origin}/assets/images/hero_smart_shopping_1794810594006.jpg`;
  const imgType = image.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

  const shareUrl = item ? `${origin}/p/${encodeURIComponent(item.id)}` : origin;
  const { amount, currency } = parsePriceAmount(item?.price);
  const { amount: oldAmount } = parsePriceAmount(item?.oldPrice);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:site_name" content="Dodx" />
    <meta property="og:title" content="${escapeHtml(ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
    <meta property="og:image:type" content="${imgType}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(ogTitle)}" />
    <meta property="og:url" content="${escapeHtml(shareUrl)}" />
    <meta property="og:type" content="product" />
    ${amount ? `<meta property="product:price:amount" content="${escapeHtml(amount)}" />` : ''}
    ${amount && currency ? `<meta property="product:price:currency" content="${escapeHtml(currency)}" />` : ''}
    ${amount ? `<meta property="product:sale_price:amount" content="${escapeHtml(amount)}" />` : ''}
    ${amount && currency ? `<meta property="product:sale_price:currency" content="${escapeHtml(currency)}" />` : ''}
    ${oldAmount ? `<meta property="product:original_price:amount" content="${escapeHtml(oldAmount)}" />` : ''}
    ${oldAmount && currency ? `<meta property="product:original_price:currency" content="${escapeHtml(currency)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <link rel="canonical" href="${escapeHtml(shareUrl)}" />
  </head>
  <body>
    <script>window.location.replace(${JSON.stringify(shareUrl)});</script>
    <noscript>
      <a href="${escapeHtml(shareUrl)}">${escapeHtml(ogTitle)}</a>
    </noscript>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
}
