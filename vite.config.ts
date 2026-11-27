import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

interface ShareCatalogEntry {
  id: string;
  isVehicle?: boolean;
  storeId?: string;
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
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getLocalImageDimensions(imageRelPath: string): {width: number; height: number} | null {
  try {
    const cleanRel = imageRelPath.replace(/^https?:\/\/[^/]+/, '').replace(/^\/+/, '');
    const fullPath = path.resolve(__dirname, 'public', cleanRel);
    if (!fs.existsSync(fullPath)) return null;
    const buf = fs.readFileSync(fullPath);

    // PNG header
    if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
      return {width: buf.readUInt32BE(16), height: buf.readUInt32BE(20)};
    }
    // JPEG SOF marker
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
            return {height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7)};
          }
          const len = buf.readUInt16BE(i + 2);
          i += 2 + Math.max(2, len);
        } else {
          i++;
        }
      }
    }
  } catch {
    // Ignore image header parse failure
  }
  return null;
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
  const isVehicle = Boolean(item.isVehicle || item.storeId === 'cars');
  const titleParts = [
    item.title,
    item.price ? item.price : '',
    item.discount ? `(${item.discount})` : '',
  ].filter(Boolean);
  const fullTitle = `${titleParts.join(' — ')} | Dodx`;
  const ogTitle = `${item.title}${item.price ? ` — ${item.price}` : ''}${item.discount ? ` (${item.discount})` : ''}`;

  const descParts = isVehicle
    ? [
        item.price ? `Price: ${item.price}` : '',
        item.description,
      ].filter(Boolean)
    : [
        item.price ? `Price After Discount: ${item.price}` : '',
        item.oldPrice ? `Was: ${item.oldPrice}` : '',
        item.discount ? `Discount: ${item.discount}` : '',
        item.code ? `Code: ${item.code}` : '',
        item.description,
      ].filter(Boolean);
  const fullDesc = descParts.join(' · ');

  const absImage = item.image.startsWith('http')
    ? item.image
    : `${siteOrigin}${item.image.startsWith('/') ? '' : '/'}${item.image}`;
  const imgType = absImage.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const dims =
    item.imageWidth && item.imageHeight
      ? {width: item.imageWidth, height: item.imageHeight}
      : getLocalImageDimensions(item.image);
  const shareUrl = `${siteOrigin}/p/${encodeURIComponent(item.id)}`;
  const {amount, currency} = parsePriceAmount(item.price);
  const {amount: oldAmount} = parsePriceAmount(item.oldPrice);

  const metaTags = [
    `<title>${escapeAttr(fullTitle)}</title>`,
    `<meta name="description" content="${escapeAttr(fullDesc)}" />`,
    `<meta property="og:site_name" content="Dodx" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${escapeAttr(shareUrl)}" />`,
    `<meta property="og:title" content="${escapeAttr(ogTitle)}" />`,
    `<meta property="og:description" content="${escapeAttr(fullDesc)}" />`,
    `<meta property="og:image" content="${escapeAttr(absImage)}" />`,
    `<meta property="og:image:secure_url" content="${escapeAttr(absImage)}" />`,
    `<meta property="og:image:type" content="${imgType}" />`,
    dims ? `<meta property="og:image:width" content="${dims.width}" />` : '',
    dims ? `<meta property="og:image:height" content="${dims.height}" />` : '',
    `<meta property="og:image:alt" content="${escapeAttr(ogTitle)}" />`,
    amount ? `<meta property="product:price:amount" content="${escapeAttr(amount)}" />` : '',
    amount && currency ? `<meta property="product:price:currency" content="${escapeAttr(currency)}" />` : '',
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

  // Strip old title/description/OG/twitter tags and insert fresh ones right at the TOP of <head>
  const cleaned = templateHtml
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<meta\s+property="product:[^"]*"[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '');

  return cleaned.replace(/<head>/i, `<head>\n    ${metaTags}`);
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'copy-unbundled-src-assets-and-prerender-routes',
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
          if (!fs.existsSync(distIndexPath)) return;
          const templateHtml = fs.readFileSync(distIndexPath, 'utf8');

          // 1. Pre-render clean SPA entry files for top-level routes so static CDNs never 404
          const spaRoutes = ['products', 'deals', 'coupons', 'cars'];
          for (const routeName of spaRoutes) {
            const routeDir = path.resolve(distDir, routeName);
            fs.mkdirSync(routeDir, {recursive: true});
            fs.writeFileSync(path.resolve(routeDir, 'index.html'), templateHtml, 'utf8');
            fs.writeFileSync(path.resolve(distDir, `${routeName}.html`), templateHtml, 'utf8');
          }

          for (const staticLegal of ['privacy', 'disclosure']) {
            const legalIdx = path.resolve(distDir, staticLegal, 'index.html');
            if (fs.existsSync(legalIdx)) {
              fs.copyFileSync(legalIdx, path.resolve(distDir, `${staticLegal}.html`));
            }
          }

          // 2. Pre-render OpenGraph HTML for every product/deal in share-catalog.json
          const catalogPath = path.resolve(__dirname, 'public/api/share-catalog.json');
          if (fs.existsSync(catalogPath)) {
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
