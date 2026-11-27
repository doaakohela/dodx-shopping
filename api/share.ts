import fs from 'node:fs';
import path from 'node:path';

interface ShareCatalogItem {
  id: string;
  isVehicle?: boolean;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  price?: string;
  oldPrice?: string;
  discount?: string;
  code?: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
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

function getLocalImageDimensions(imageRelPath: string): { width: number; height: number } | null {
  try {
    const cleanRel = imageRelPath.replace(/^https?:\/\/[^/]+/, '').replace(/^\/+/, '');
    const candidates = [
      path.resolve(process.cwd(), 'public', cleanRel),
      path.resolve(process.cwd(), 'dist', cleanRel),
    ];
    for (const fullPath of candidates) {
      if (!fs.existsSync(fullPath)) continue;
      const buf = fs.readFileSync(fullPath);
      if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
        return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
      }
      if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
        let i = 2;
        while (i + 9 < buf.length) {
          if (buf[i] === 0xff) {
            const marker = buf[i + 1];
            if (
              marker >= 0xc0 &&
              marker <= 0xcf &&
              marker !== 0xc4 &&
              marker !== 0xc8 &&
              marker !== 0xcc
            ) {
              return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
            }
            const len = buf.readUInt16BE(i + 2);
            i += 2 + Math.max(2, len);
          } else {
            i++;
          }
        }
      }
    }
  } catch {
    // Ignore image parse error
  }
  return null;
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
      // Check next candidate
    }
  }
  return {};
}

function loadDistIndexHtml(): string | null {
  const candidates = [
    path.resolve(process.cwd(), 'dist/index.html'),
    path.resolve(process.cwd(), 'index.html'),
  ];
  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      }
    } catch {
      // Check next candidate
    }
  }
  return null;
}

export default function handler(req: MinimalReq, res: MinimalRes): void {
  const rawId = req.query?.id ?? req.query?.model;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const decodedId = id ? decodeURIComponent(id.replace(/\/+$/, '').trim()) : '';
  const isCarsOverview = !decodedId && (req.query?.cars === '1' || req.query?.cars === 'true');

  const protoRaw = req.headers?.['x-forwarded-proto'];
  const proto = Array.isArray(protoRaw) ? protoRaw[0] : protoRaw?.split(',')[0]?.trim() || 'https';
  const hostRaw = req.headers?.['x-forwarded-host'] || req.headers?.host;
  const host = (Array.isArray(hostRaw) ? hostRaw[0] : hostRaw) || 'www.dodx.shop';
  const origin = `${proto}://${host}`;

  const catalog = loadCatalog();
  const item = decodedId ? catalog[decodedId] : undefined;
  const isVehicle = Boolean(item && (item.isVehicle || item.storeId === 'cars'));

  const title = item
    ? `${item.title}${item.price ? ` — ${item.price}` : ''}${item.discount ? ` (${item.discount})` : ''} | Dodx`
    : isCarsOverview
      ? 'Electric Vehicles — Wuling, Changan Lumin, BYD Seagull & Geely | Dodx'
      : 'Dodx — Verified Coupons & Smart Shopping Deals | dodx.shop';

  const ogTitle = item
    ? `${item.title}${item.price ? ` — ${item.price}` : ''}${item.discount ? ` (${item.discount})` : ''}`
    : isCarsOverview
      ? 'Drive Your New Electric Car Today — Smart Value & Proven Range'
      : 'Dodx — Verified Coupons & Smart Shopping Deals';

  const description = item
    ? isVehicle
      ? [
          item.price ? `Price: ${item.price}` : '',
          item.description,
        ]
          .filter(Boolean)
          .join(' · ')
      : [
          item.price ? `Price After Discount: ${item.price}` : '',
          item.oldPrice ? `Was: ${item.oldPrice}` : '',
          item.discount ? `Discount: ${item.discount}` : '',
          item.code ? `Code: ${item.code}` : '',
          item.description,
        ]
          .filter(Boolean)
          .join(' · ')
    : isCarsOverview
      ? 'Discover 6 electric vehicle models with up to 305 km range, 30-minute fast charging, and smart safety features starting from $7,250.'
      : 'Save money automatically with verified coupons, promo codes, and smart shopping deals on dodx.shop.';

  const image = item?.image
    ? item.image.startsWith('http')
      ? item.image
      : `${origin}${item.image.startsWith('/') ? '' : '/'}${item.image}`
    : isCarsOverview
      ? `${origin}/assets/aistudio/image_9cb04596.png`
      : `${origin}/assets/images/hero_smart_shopping_1794810594006.jpg`;
  const imgType = image.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const dims =
    item?.imageWidth && item?.imageHeight
      ? { width: item.imageWidth, height: item.imageHeight }
      : item?.image
        ? getLocalImageDimensions(item.image)
        : isCarsOverview
          ? { width: 708, height: 478 }
          : null;

  const shareUrl = item
    ? `${origin}/p/${encodeURIComponent(item.id)}`
    : isCarsOverview
      ? `${origin}/cars`
      : origin;
  const { amount, currency } = parsePriceAmount(item?.price);
  const { amount: oldAmount } = parsePriceAmount(item?.oldPrice);

  const metaTags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:site_name" content="Dodx" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${escapeHtml(shareUrl)}" />`,
    `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:type" content="${imgType}" />`,
    dims ? `<meta property="og:image:width" content="${dims.width}" />` : '',
    dims ? `<meta property="og:image:height" content="${dims.height}" />` : '',
    `<meta property="og:image:alt" content="${escapeHtml(ogTitle)}" />`,
    amount ? `<meta property="product:price:amount" content="${escapeHtml(amount)}" />` : '',
    amount && currency ? `<meta property="product:price:currency" content="${escapeHtml(currency)}" />` : '',
    oldAmount ? `<meta property="product:original_price:amount" content="${escapeHtml(oldAmount)}" />` : '',
    oldAmount && currency ? `<meta property="product:original_price:currency" content="${escapeHtml(currency)}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    `<link rel="canonical" href="${escapeHtml(shareUrl)}" />`,
  ]
    .filter(Boolean)
    .join('\n    ');

  const spaTemplate = loadDistIndexHtml();
  let html: string;
  if (spaTemplate && !spaTemplate.includes('/src/main.tsx')) {
    html = spaTemplate
      .replace(/<title>[\s\S]*?<\/title>/gi, '')
      .replace(/<meta\s+name="description"[^>]*>/gi, '')
      .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
      .replace(/<meta\s+property="product:[^"]*"[^>]*>/gi, '')
      .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '')
      .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
      .replace(/<head>/i, `<head>\n    ${metaTags}`);
  } else {
    html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${metaTags}
  </head>
  <body style="font-family:system-ui,sans-serif;background:#eaeded;margin:0;padding:24px;">
    <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;padding:24px;border:1px solid #e4e4e7;">
      <p style="font-size:12px;font-weight:700;color:#00453e;margin:0 0 8px;">dodx.shop Verified Deal</p>
      <img src="${escapeHtml(image)}" alt="${escapeHtml(ogTitle)}" style="max-width:100%;max-height:280px;object-fit:contain;display:block;margin:0 auto 16px;" />
      <h1 style="font-size:20px;margin:0 0 8px;color:#09090b;">${escapeHtml(ogTitle)}</h1>
      <p style="font-size:14px;color:#52525b;margin:0 0 18px;">${escapeHtml(description)}</p>
      ${
        item?.affiliateUrl
          ? `<a href="${escapeHtml(item.affiliateUrl)}" rel="nofollow noopener noreferrer" style="display:inline-block;background:#ffd814;color:#09090b;font-weight:800;padding:12px 24px;border-radius:999px;text-decoration:none;border:1px solid #fcd200;">Buy Now / اشترِ الآن</a>`
          : `<a href="${escapeHtml(origin)}" style="display:inline-block;background:#ffd814;color:#09090b;font-weight:800;padding:12px 24px;border-radius:999px;text-decoration:none;">Browse Dodx Deals</a>`
      }
    </div>
  </body>
</html>`;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
}
