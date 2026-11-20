import React from 'react';

interface StoreLogoProps {
  storeId: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StoreLogo: React.FC<StoreLogoProps> = ({ storeId, name, size = 'md' }) => {
  const dimensions =
    size === 'sm'
      ? 'w-9 h-9 text-xs'
      : size === 'lg'
        ? 'w-14 h-14 text-lg'
        : 'w-11 h-11 text-sm';

  const getVisual = () => {
    switch (storeId) {
      case 'amazon':
        return (
          <div className={`${dimensions} rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 border border-zinc-800`}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
              <path
                d="M7.5 14.5C9.8 16.5 13.7 16.8 16.5 14.8"
                stroke="#FF9900"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M15.2 13.8L17.2 14.4L16.7 16.4"
                stroke="#FF9900"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 11.2L10.3 6.5H12L13.8 11.2M9.2 9.7H13.1"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      case 'amazon-uae':
        return (
          <div className={`${dimensions} rounded-xl bg-[#131921] text-white flex flex-col items-center justify-center shrink-0 border border-[#FF9900]/60`}>
            <span className="font-display font-black leading-none text-[11px] tracking-tight text-white">
              a<span className="text-[#FF9900]">.ae</span>
            </span>
          </div>
        );
      case 'amazon-eg':
        return (
          <div className={`${dimensions} rounded-xl bg-[#131921] text-white flex flex-col items-center justify-center shrink-0 border border-[#FF9900]/60`}>
            <span className="font-display font-black leading-none text-[11px] tracking-tight text-white">
              a<span className="text-[#FF9900]">.eg</span>
            </span>
          </div>
        );
      case 'amazon-jp':
        return (
          <div className={`${dimensions} rounded-xl bg-[#131921] text-white flex flex-col items-center justify-center shrink-0 border border-[#FF9900]/60`}>
            <span className="font-display font-black leading-none text-[11px] tracking-tight text-white">
              a<span className="text-[#FF9900]">.jp</span>
            </span>
          </div>
        );
      case 'aliexpress':
        return (
          <div className={`${dimensions} rounded-xl bg-[#E62E04] text-white flex items-center justify-center shrink-0 font-display font-bold tracking-tight`}>
            AE
          </div>
        );
      case 'alibaba':
        return (
          <div className={`${dimensions} rounded-xl bg-[#FF6A00] text-white flex items-center justify-center shrink-0 font-display font-extrabold tracking-tight`}>
            AB
          </div>
        );
      case 'lenovo-india':
        return (
          <div className={`${dimensions} rounded-xl bg-[#E2231A] text-white flex items-center justify-center shrink-0 font-display font-extrabold tracking-tight`}>
            LN
          </div>
        );
      case 'parallels-ww':
        return (
          <div className={`${dimensions} rounded-xl bg-[#D9272E] text-white flex items-center justify-center shrink-0 font-display font-black tracking-tight`}>
            ||
          </div>
        );
      case 'adguard-many-geos':
        return (
          <div className={`${dimensions} rounded-xl bg-[#006E4E] text-white flex items-center justify-center shrink-0 font-display font-extrabold tracking-tight`}>
            AG
          </div>
        );
      case 'canon-uae':
        return (
          <div className={`${dimensions} rounded-xl bg-[#CC0000] text-white flex items-center justify-center shrink-0 font-display font-extrabold tracking-tight`}>
            CN
          </div>
        );
      case 'huawei-ae':
        return (
          <div className={`${dimensions} rounded-xl bg-[#CF0A2C] text-white flex items-center justify-center shrink-0 font-display font-extrabold tracking-tight`}>
            HW
          </div>
        );
      case 'honor-uae':
        return (
          <div className={`${dimensions} rounded-xl bg-[#00453E] text-white flex items-center justify-center shrink-0 font-display font-extrabold tracking-tight`}>
            HN
          </div>
        );
      case 'admitad-shop':
        return (
          <div className={`${dimensions} rounded-xl bg-[#8521CE] text-white flex items-center justify-center shrink-0 font-display font-extrabold tracking-tight`}>
            AD
          </div>
        );
      default:
        return (
          <div className={`${dimensions} rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200 font-display font-bold`}>
            {name.slice(0, 2).toUpperCase()}
          </div>
        );
    }
  };

  return <div aria-hidden="true">{getVisual()}</div>;
};
