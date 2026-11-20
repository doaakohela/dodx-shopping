import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  savingsEn?: string;
  savingsAr?: string;
  image: string;
  storeId: string;
  storeName: string;
  affiliateUrl: string;
}

interface ShareCatalogPayload {
  items?: Record<string, ShareCatalogItem>;
}

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function loadShareCatalog(): Record<string, ShareCatalogItem> {
  const candidates = [
    path.resolve(__dirname, 'public/api/share-catalog.json'),
    path.resolve(__dirname, 'dist/api/share-catalog.json'),
  ];
  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw) as ShareCatalogPayload;
        if (parsed.items) return parsed.items;
      }
    } catch {
      // Ignore malformed file and try next candidate
    }
  }
  return {};
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

function injectOpenGraphHtml(
  html: string,
  productId: string | undefined,
  origin: string
): string {
  if (!productId) return html;
  const catalog = loadShareCatalog();
  const item = catalog[productId];
  if (!item) return html;

  const titleParts = [
    item.title,
    item.price ? item.price : '',
    item.discount ? `(${item.discount})` : '',
  ].filter(Boolean);
  const fullTitle = `${titleParts.join(' — ')} | Dodx`;
  const ogTitle = `${item.title}${item.price ? ` — ${item.price}` : ''}${item.discount ? ` (${item.discount})` : ''}`;

  const descParts = [
    item.price ? `Price After Discount: ${item.price}` : '',
    item.oldPrice ? `Was ${item.oldPrice}` : '',
    item.discount ? `Discount: ${item.discount}` : '',
    item.code ? `Code: ${item.code}` : '',
    item.description,
  ].filter(Boolean);
  const fullDesc = descParts.join(' · ');

  const absImage = item.image.startsWith('http')
    ? item.image
    : `${origin}${item.image.startsWith('/') ? '' : '/'}${item.image}`;
  const imgType = absImage.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const shareUrl = `${origin}/p/${encodeURIComponent(item.id)}`;
  const { amount, currency } = parsePriceAmount(item.price);
  const { amount: oldAmount } = parsePriceAmount(item.oldPrice);

  const metaTags = [
    `<meta property="og:site_name" content="Dodx" />`,
    `<meta property="og:title" content="${escapeHtmlAttr(ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtmlAttr(fullDesc)}" />`,
    `<meta property="og:image" content="${escapeHtmlAttr(absImage)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtmlAttr(absImage)}" />`,
    `<meta property="og:image:type" content="${imgType}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtmlAttr(ogTitle)}" />`,
    `<meta property="og:url" content="${escapeHtmlAttr(shareUrl)}" />`,
    `<meta property="og:type" content="product" />`,
    amount ? `<meta property="product:price:amount" content="${escapeHtmlAttr(amount)}" />` : '',
    amount && currency ? `<meta property="product:price:currency" content="${escapeHtmlAttr(currency)}" />` : '',
    amount ? `<meta property="product:sale_price:amount" content="${escapeHtmlAttr(amount)}" />` : '',
    amount && currency ? `<meta property="product:sale_price:currency" content="${escapeHtmlAttr(currency)}" />` : '',
    oldAmount ? `<meta property="product:original_price:amount" content="${escapeHtmlAttr(oldAmount)}" />` : '',
    oldAmount && currency ? `<meta property="product:original_price:currency" content="${escapeHtmlAttr(currency)}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtmlAttr(ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtmlAttr(fullDesc)}" />`,
    `<meta name="twitter:image" content="${escapeHtmlAttr(absImage)}" />`,
    `<link rel="canonical" href="${escapeHtmlAttr(shareUrl)}" />`,
  ]
    .filter(Boolean)
    .join('\n    ');

  let out = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttr(fullTitle)}</title>`)
    .replace(
      /<meta\s+name="description"[^>]*>/gi,
      `<meta name="description" content="${escapeHtmlAttr(fullDesc)}" />`
    )
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<meta\s+property="product:[^"]*"[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '');

  out = out.replace('</head>', `    ${metaTags}\n  </head>`);
  return out;
}

function getRequestOrigin(req: Request): string {
  const protoHeader = req.headers['x-forwarded-proto'];
  const proto = Array.isArray(protoHeader)
    ? protoHeader[0]
    : protoHeader?.split(',')[0]?.trim() || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.dodx.shop';
  return `${proto}://${host}`;
}

function extractProductId(req: Request): string | undefined {
  const rawParam = req.params.id;
  if (typeof rawParam === 'string' && rawParam.trim()) {
    try {
      return decodeURIComponent(rawParam.replace(/\/+$/, '').trim());
    } catch {
      return rawParam.replace(/\/+$/, '').trim();
    }
  }
  const queryProduct = req.query.product;
  if (typeof queryProduct === 'string' && queryProduct.trim()) {
    return queryProduct.trim();
  }
  return undefined;
}

async function startServer() {
  const app = express();
  app.set('trust proxy', true);

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'custom',
    });

    app.use('/privacy', express.static(path.resolve(__dirname, 'public/privacy')));
    app.use('/disclosure', express.static(path.resolve(__dirname, 'public/disclosure')));
    app.use(vite.middlewares);

    const serveDevHtml = async (req: Request, res: Response) => {
      try {
        const templatePath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        const productId = extractProductId(req);
        const html = injectOpenGraphHtml(template, productId, getRequestOrigin(req));
        res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').end(html);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        vite.ssrFixStacktrace(error);
        res.status(500).end(error.message);
      }
    };

    app.get('/p/:id', serveDevHtml);
    app.get('/p/:id/', serveDevHtml);
    app.get('*', serveDevHtml);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    const publicDir = path.resolve(__dirname, 'public');

    app.use(express.static(distDir, { index: false }));
    app.use(express.static(publicDir, { index: false }));
    app.use('/privacy', express.static(path.resolve(distDir, 'privacy')));
    app.use('/disclosure', express.static(path.resolve(distDir, 'disclosure')));

    const serveProdHtml = (req: Request, res: Response) => {
      const indexPath = path.resolve(distDir, 'index.html');
      if (!fs.existsSync(indexPath)) {
        res.status(404).send('Build output not found. Run npm run build first.');
        return;
      }
      const template = fs.readFileSync(indexPath, 'utf8');
      const productId = extractProductId(req);
      const html = injectOpenGraphHtml(template, productId, getRequestOrigin(req));
      res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').end(html);
    };

    app.get('/p/:id', serveProdHtml);
    app.get('/p/:id/', serveProdHtml);
    app.get('*', serveProdHtml);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dodx server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
