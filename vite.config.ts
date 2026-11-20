import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

interface ShareCatalogEntry {
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
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parsePriceAmount(price?: string): {amount?: string; currency?: string} {
  if (!price) return {};
  const numMatch = price.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  const amount = numMatch ? numMatch[1] : undefined;
  let currency = 'USD';
  if (/EGP|جنيه/i.test(price)) currency = 'EGP';
  else if (/AED|درهم/i.test(price)) currency = 'AED';
  else if (/JPY|¥/i.test(price)) currency = 'JPY';
  else if (/EUR|€/i.test(price)) currency = 'EUR';
  else if (/INR|₹/i.test(price)) currency = 'INR';
  return {amount, currency};
}

function buildStaticProductHtml(
  templateHtml: string,
  item: ShareCatalogEntry,
  siteOrigin: string
): string {
  const titleParts = [
    item.title,
    item.price ? item.price : '',
    item.discount ? `(${item.discount})` : '',
  ].filter(Boolean);
  const fullTitle = `${titleParts.join(' — ')} | Dodx`;
  const ogTitle = `${item.title}${item.price ? ` — ${item.price}` : ''}${item.discount ? ` (${item.discount})` : ''}`;

  const descParts = [
    item.price ? `Price After Discount: ${item.price}` : '',
    item.oldPrice ? `Original Price: ${item.oldPrice}` : '',
    item.discount ? `Discount: ${item.discount}` : '',
    item.code ? `Code: ${item.code}` : '',
    item.description,
  ].filter(Boolean);
  const fullDesc = descParts.join(' · ');

  const absImage = item.image.startsWith('http')
    ? item.image
    : `${siteOrigin}${item.image.startsWith('/') ? '' : '/'}${item.image}`;
  const imgType = absImage.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const shareUrl = `${siteOrigin}/p/${encodeURIComponent(item.id)}`;
  const {amount, currency} = parsePriceAmount(item.price);
  const {amount: oldAmount} = parsePriceAmount(item.oldPrice);

  const metaTags = [
    `<meta property="og:site_name" content="Dodx" />`,
    `<meta property="og:title" content="${escapeAttr(ogTitle)}" />`,
    `<meta property="og:description" content="${escapeAttr(fullDesc)}" />`,
    `<meta property="og:image" content="${escapeAttr(absImage)}" />`,
    `<meta property="og:image:secure_url" content="${escapeAttr(absImage)}" />`,
    `<meta property="og:image:type" content="${imgType}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeAttr(ogTitle)}" />`,
    `<meta property="og:url" content="${escapeAttr(shareUrl)}" />`,
    `<meta property="og:type" content="product" />`,
    amount ? `<meta property="product:price:amount" content="${escapeAttr(amount)}" />` : '',
    amount && currency ? `<meta property="product:price:currency" content="${escapeAttr(currency)}" />` : '',
    amount ? `<meta property="product:sale_price:amount" content="${escapeAttr(amount)}" />` : '',
    amount && currency ? `<meta property="product:sale_price:currency" content="${escapeAttr(currency)}" />` : '',
    oldAmount ? `<meta property="product:original_price:amount" content="${escapeAttr(oldAmount)}" />` : '',
    oldAmount && currency ? `<meta property="product:original_price:currency" content="${escapeAttr(currency)}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(fullDesc)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(absImage)}" />`,
    `<link rel="canonical" href="${escapeAttr(shareUrl)}" />`,
  ]
    .filter(Boolean)
    .join('\n    ');

  const cleaned = templateHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(fullTitle)}</title>`)
    .replace(
      /<meta\s+name="description"[^>]*>/gi,
      `<meta name="description" content="${escapeAttr(fullDesc)}" />`
    )
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<meta\s+property="product:[^"]*"[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '');

  return cleaned.replace('</head>', `    ${metaTags}\n  </head>`);
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ and generates static OpenGraph product pages
      // at dist/p/<id>.html + dist/p/<id>/index.html so Facebook, WhatsApp, and X
      // crawlers always receive product image, discounted price, and discount amount
      // even on purely static CDN deployments (e.g. Vercel static output).
      {
        name: 'copy-unbundled-src-assets-and-prerender-share-pages',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }

          const distIndexPath = path.resolve(distDir, 'index.html');
          const catalogPath = path.resolve(__dirname, 'public/api/share-catalog.json');
          if (fs.existsSync(distIndexPath) && fs.existsSync(catalogPath)) {
            const templateHtml = fs.readFileSync(distIndexPath, 'utf8');
            const parsed = JSON.parse(fs.readFileSync(catalogPath, 'utf8')) as {
              items?: Record<string, ShareCatalogEntry>;
            };
            const items = parsed.items || {};
            const pRoot = path.resolve(distDir, 'p');
            fs.mkdirSync(pRoot, {recursive: true});

            for (const item of Object.values(items)) {
              if (!item?.id || item.id.includes('/') || item.id.includes('..')) continue;
              const html = buildStaticProductHtml(templateHtml, item, 'https://www.dodx.shop');
              fs.writeFileSync(path.resolve(pRoot, `${item.id}.html`), html, 'utf8');
              const itemDir = path.resolve(pRoot, item.id);
              fs.mkdirSync(itemDir, {recursive: true});
              fs.writeFileSync(path.resolve(itemDir, 'index.html'), html, 'utf8');
            }
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
