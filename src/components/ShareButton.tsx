import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Link2, Share2 } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  title: string;
  shareId?: string;
  price?: string;
  oldPrice?: string;
  discount?: string;
  isAr?: boolean;
  compact?: boolean;
  dropDirection?: 'up' | 'down';
  align?: 'start' | 'end';
  tone?: 'light' | 'dark';
  entityType?: 'product' | 'car';
  specsText?: string;
}

interface MenuPosition {
  left: number;
  top?: number;
  bottom?: number;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  shareId,
  price,
  oldPrice,
  discount,
  isAr = false,
  compact = false,
  dropDirection = 'up',
  align = 'end',
  tone = 'light',
  entityType = 'product',
  specsText,
}) => {
  const [open, setOpen] = useState(false);
  const [copiedMode, setCopiedMode] = useState<'link' | 'ig' | null>(null);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const computeMenuPosition = useCallback(() => {
    if (!buttonRef.current || typeof window === 'undefined') return;
    const rect = buttonRef.current.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      setOpen(false);
      return;
    }

    const menuWidth = 224;
    const estimatedMenuHeight = 235;
    const gap = 6;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldOpenUp =
      dropDirection === 'up'
        ? spaceAbove >= estimatedMenuHeight || spaceAbove >= spaceBelow
        : spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

    const isRtl =
      (typeof document !== 'undefined' && document.documentElement.dir === 'rtl') || isAr;
    const alignStart = align === 'start';
    const anchorRightEdge = isRtl ? alignStart : !alignStart;

    let left = anchorRightEdge ? rect.right - menuWidth : rect.left;
    left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));

    if (shouldOpenUp) {
      setMenuPos({
        left,
        bottom: Math.max(8, window.innerHeight - rect.top + gap),
      });
    } else {
      setMenuPos({
        left,
        top: Math.min(window.innerHeight - estimatedMenuHeight - 8, rect.bottom + gap),
      });
    }
  }, [align, dropDirection, isAr]);

  useLayoutEffect(() => {
    if (open) {
      computeMenuPosition();
    } else {
      setMenuPos(null);
    }
  }, [open, computeMenuPosition]);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        (!menuRef.current || !menuRef.current.contains(target))
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const handleReposition = () => computeMenuPosition();

    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open, computeMenuPosition]);

  const copyTextToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch {
      // Fallback below
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch {
      // Ignore copy failure
    }
  };

  // Always canonicalize to https://www.dodx.shop so Facebook / WhatsApp / X
  // crawlers fetch real OpenGraph product image, price after discount, and discount %
  // and open the product page directly on www.dodx.shop.
  const publicOrigin = 'https://www.dodx.shop';

  const resolvedShareUrl = shareId
    ? `${publicOrigin}/p/${encodeURIComponent(shareId)}`
    : url.startsWith('/')
      ? `${publicOrigin}${url}`
      : url;

  const summaryParts = [
    title,
    price
      ? entityType === 'car'
        ? isAr
          ? `السعر: ${price}`
          : `Price: ${price}`
        : isAr
          ? `السعر بعد الخصم: ${price}`
          : `Price After Discount: ${price}`
      : '',
    oldPrice ? (isAr ? `بدلاً من ${oldPrice}` : `Was ${oldPrice}`) : '',
    discount ? (isAr ? `الخصم: ${discount}` : `Discount: ${discount}`) : '',
    specsText || '',
  ]
    .filter(Boolean)
    .join(' · ');

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await copyTextToClipboard(resolvedShareUrl);
    setCopiedMode('link');
    window.setTimeout(() => setCopiedMode(null), 2000);
  };

  const handleInstagramShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await copyTextToClipboard(`${summaryParts}\n${resolvedShareUrl}`);
    setCopiedMode('ig');
    window.setTimeout(() => setCopiedMode(null), 2200);
  };

  const encodedUrl = encodeURIComponent(resolvedShareUrl);
  const encodedText = encodeURIComponent(summaryParts);
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
  const whatsappHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${summaryParts}\n${resolvedShareUrl}`)}`;
  const xShareHref = `https://x.com/intent/post?url=${encodedUrl}&text=${encodedText}`;

  const triggerClasses =
    tone === 'dark'
      ? 'bg-[#131921]/85 hover:bg-[#131921] text-white border-white/30'
      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300';

  const menuNode =
    open && menuPos && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            role="menu"
            dir={isAr ? 'rtl' : 'ltr'}
            style={{
              position: 'fixed',
              left: `${menuPos.left}px`,
              ...(menuPos.top !== undefined ? { top: `${menuPos.top}px` } : {}),
              ...(menuPos.bottom !== undefined ? { bottom: `${menuPos.bottom}px` } : {}),
            }}
            onClick={(e) => e.stopPropagation()}
            className="z-[9999] w-56 rounded-lg bg-white border border-zinc-200 shadow-2xl p-1.5 text-zinc-900"
          >
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100 mb-1">
              {entityType === 'car'
                ? isAr
                  ? 'مشاركة رابط السيارة من موقعي'
                  : 'Share Vehicle Page'
                : isAr
                  ? 'مشاركة رابط المنتج من موقعي'
                  : 'Share Product Page'}
            </div>

            <a
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-md text-xs font-semibold text-zinc-800 hover:bg-blue-50 hover:text-[#1877F2] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-[#1877F2]" aria-hidden="true">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              <span>{isAr ? 'فيسبوك' : 'Facebook'}</span>
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-md text-xs font-semibold text-zinc-800 hover:bg-emerald-50 hover:text-[#128C7E] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-[#25D366]" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2m5.79 14.12c-.24.68-1.41 1.3-1.95 1.38-.52.08-1.17.11-1.89-.12-.44-.14-1-.33-1.72-.64-3.03-1.31-5.01-4.37-5.16-4.57-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.6-.38.8-.38h.58c.19 0 .44-.07.69.53.25.6.85 2.09.93 2.24.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.17-.32.39-.45.52-.15.15-.31.31-.13.61.18.3.78 1.29 1.68 2.09 1.15 1.02 2.12 1.34 2.42 1.49.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.4-.25.67-.15.27.1 1.74.82 2.04.97.3.15.5.23.57.35.08.13.08.73-.16 1.41z" />
              </svg>
              <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
            </a>

            <a
              href={xShareHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-md text-xs font-semibold text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-zinc-950" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>{isAr ? 'إكس (X)' : 'X'}</span>
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleInstagramShare}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-md text-xs font-semibold text-zinc-800 hover:bg-pink-50 hover:text-[#E1306C] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-[#E1306C]" aria-hidden="true">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
              </svg>
              <span className="flex-1 text-start">
                {copiedMode === 'ig'
                  ? isAr
                    ? 'تم النسخ لإنستجرام!'
                    : 'Copied for Instagram!'
                  : isAr
                    ? 'إنستجرام'
                    : 'Instagram'}
              </span>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-md text-xs font-semibold text-zinc-800 hover:bg-emerald-50 hover:text-[#00453E] transition-colors cursor-pointer text-start"
            >
              {copiedMode === 'link' ? (
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <Link2 className="w-4 h-4 shrink-0 text-zinc-600" />
              )}
              <span className={copiedMode === 'link' ? 'text-emerald-700 font-bold' : ''}>
                {copiedMode === 'link'
                  ? entityType === 'car'
                    ? isAr
                      ? 'تم نسخ رابط السيارة!'
                      : 'Vehicle Link Copied!'
                    : isAr
                      ? 'تم نسخ رابط المنتج!'
                      : 'Product Link Copied!'
                  : entityType === 'car'
                    ? isAr
                      ? 'نسخ رابط السيارة'
                      : 'Copy Vehicle Link'
                    : isAr
                      ? 'نسخ رابط المنتج'
                      : 'Copy Product Link'}
              </span>
            </button>
          </div>,
          document.body
        )
      : null;

  return (
    <div
      ref={containerRef}
      className="relative inline-flex shrink-0"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        aria-expanded={open}
        aria-label={isAr ? `مشاركة ${title}` : `Share ${title}`}
        title={
          entityType === 'car'
            ? isAr
              ? 'مشاركة رابط السيارة على مواقع التواصل أو نسخ الرابط'
              : 'Share vehicle page'
            : isAr
              ? 'مشاركة المنتج بالصورة والسعر والخصم'
              : 'Share product page'
        }
        className={`inline-flex items-center justify-center gap-1.5 border rounded-full font-bold transition-colors cursor-pointer ${triggerClasses} ${
          compact ? 'h-8 w-8 p-0 text-xs' : 'px-3 py-1.5 text-xs whitespace-nowrap'
        }`}
      >
        <Share2 className="w-3.5 h-3.5 shrink-0" />
        {!compact && <span>{isAr ? 'مشاركة' : 'Share'}</span>}
      </button>

      {menuNode}
    </div>
  );
};
