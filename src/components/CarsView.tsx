import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BatteryCharging,
  Car,
  Check,
  Copy,
  FileCheck2,
  Gauge,
  Info,
  Ruler,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react';
import {
  EV_VEHICLES,
  EvVehicleItem,
  FOB_DISCLAIMER,
} from '../data/evVehiclesCatalog';
import { LanguageCode, TranslationDict } from '../i18n/translations';
import { ShareButton } from './ShareButton';

const WHATSAPP_NUMBER = '201002477274';

interface CarsViewProps {
  lang: LanguageCode;
  t: TranslationDict;
  initialCarId?: string | null;
  onSelectCar: (carId?: string) => void;
  onBackHome: () => void;
}

type VehicleFilter = 'all' | 'micro-ev' | 'compact-hatchback' | 'compact-suv';

const SPEC_ICONS: Record<string, typeof Gauge> = {
  range: Gauge,
  battery: BatteryCharging,
  motor: Zap,
  topSpeed: Gauge,
  charging: BatteryCharging,
  seating: Users,
  dimensions: Ruler,
  features: ShieldCheck,
};

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2Zm5.8 14.08c-.24.68-1.42 1.3-1.97 1.38-.52.08-1.18.11-1.91-.12-.44-.14-1.01-.33-1.74-.64-3.05-1.32-5.04-4.41-5.19-4.61-.15-.2-1.24-1.65-1.24-3.15s.79-2.24 1.07-2.54c.28-.3.61-.38.82-.38.2 0 .41.01.59.01.19 0 .44-.07.69.53.24.59.84 2.04.91 2.19.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.53-.15.15-.31.31-.13.61.18.3.78 1.29 1.68 2.09 1.15 1.03 2.13 1.35 2.43 1.5.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.41-.25.68-.15.28.1 1.76.83 2.06.98.3.15.5.23.58.35.08.13.08.73-.16 1.41Z" />
  </svg>
);

function buildWhatsAppHref(vehicle: EvVehicleItem, trimLabel: string, priceUsd: number, isAr: boolean): string {
  const message = isAr
    ? `مرحباً، أرغب في معرفة السعر الشامل وتفاصيل الشحن للسيارة: ${vehicle.modelAr} (${trimLabel}) - سعر FOB المعلن $${priceUsd.toLocaleString()}`
    : `Hello, I would like the total landed price and shipping details for: ${vehicle.modelEn} (${trimLabel}) - Listed FOB $${priceUsd.toLocaleString()}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const CarsView: React.FC<CarsViewProps> = ({
  lang,
  t,
  initialCarId,
  onSelectCar,
  onBackHome,
}) => {
  const isAr = lang === 'ar';
  const [filter, setFilter] = useState<VehicleFilter>('all');
  const [selectedTrims, setSelectedTrims] = useState<Record<string, string>>({
    'wuling-hongguang-miniev': 'wuling-305',
  });
  const [activeImgIndices, setActiveImgIndices] = useState<Record<string, number>>({});
  const [copiedCarId, setCopiedCarId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const selectedVehicle = useMemo(
    () => (initialCarId ? EV_VEHICLES.find((v) => v.id === initialCarId) ?? null : null),
    [initialCarId]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialCarId]);

  useEffect(() => {
    const setMeta = (attr: 'property' | 'name', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const origin = window.location.origin;
    if (!selectedVehicle) {
      document.title = isAr
        ? 'السيارات الكهربائية — مواصفات وأسعار شاملة | Dodx'
        : 'Electric Vehicles — Full Specs & Prices | Dodx';
      return;
    }

    const activeTrimId = selectedTrims[selectedVehicle.id] || selectedVehicle.trims[0]?.id;
    const activeTrim =
      selectedVehicle.trims.find((tr) => tr.id === activeTrimId) || selectedVehicle.trims[0];
    const modelName = isAr ? selectedVehicle.modelAr : selectedVehicle.modelEn;
    const priceLabel = `$${activeTrim.fobPriceUsd.toLocaleString()}`;
    const specsLine = isAr
      ? `${selectedVehicle.highlightRangeAr} · ${selectedVehicle.highlightBatteryAr} · ${selectedVehicle.highlightSeatsAr} · ${selectedVehicle.highlightPowerAr}`
      : `${selectedVehicle.highlightRangeEn} · ${selectedVehicle.highlightBatteryEn} · ${selectedVehicle.highlightSeatsEn} · ${selectedVehicle.highlightPowerEn}`;
    const ogImgRaw = selectedVehicle.images[0]?.src || '/assets/aistudio/image_9cb04596.png';
    const absImage = ogImgRaw.startsWith('http') ? ogImgRaw : `${origin}${ogImgRaw}`;

    document.title = `${modelName} — ${priceLabel} | Dodx`;
    setMeta('property', 'og:title', `${modelName} — ${priceLabel}`);
    setMeta('property', 'og:description', `${priceLabel} · ${specsLine}`);
    setMeta('property', 'og:image', absImage);
    setMeta('property', 'og:url', `${origin}/p/${encodeURIComponent(selectedVehicle.id)}`);
    setMeta('name', 'twitter:title', `${modelName} — ${priceLabel}`);
    setMeta('name', 'twitter:description', `${priceLabel} · ${specsLine}`);
    setMeta('name', 'twitter:image', absImage);
  }, [selectedVehicle, selectedTrims, isAr]);

  const filteredVehicles = useMemo(() => {
    if (filter === 'all') return EV_VEHICLES;
    return EV_VEHICLES.filter((v) => v.categoryTag === filter);
  }, [filter]);

  const handleCopySpecs = async (vehicle: EvVehicleItem) => {
    const activeTrimId = selectedTrims[vehicle.id] || vehicle.trims[0]?.id;
    const trim =
      vehicle.trims.find((tr) => tr.id === activeTrimId) || vehicle.trims[0];
    const trimList = vehicle.trims
      .map(
        (tr) =>
          `${isAr ? tr.labelAr : tr.labelEn}: $${tr.fobPriceUsd.toLocaleString()} FOB`
      )
      .join(' | ');

    const lines = [
      `${isAr ? vehicle.modelAr : vehicle.modelEn} — ${
        isAr ? vehicle.trimAr : vehicle.trimEn
      }`,
      `${isAr ? 'السعر (FOB الصين)' : 'FOB Export Price'}: ${
        vehicle.trims.length > 1
          ? trimList
          : `$${trim.fobPriceUsd.toLocaleString()} FOB`
      }`,
      '',
      ...(isAr
        ? [vehicle.overviewAr, '', 'المواصفات الفنية:']
        : [vehicle.overviewEn, '', 'Key Specifications:']),
      ...vehicle.specs.map(
        (s) =>
          `- ${isAr ? s.labelAr : s.labelEn}: ${isAr ? s.valueAr : s.valueEn}`
      ),
      '',
      isAr ? FOB_DISCLAIMER.ar : FOB_DISCLAIMER.en,
      isAr
        ? 'لطلب السعر الشامل تواصل واتساب'
        : 'For total price, contact via WhatsApp',
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedCarId(vehicle.id);
      window.setTimeout(() => setCopiedCarId(null), 2400);
    } catch {
      // Clipboard may be blocked
    }
  };

  /* =========================================================================
   * DEDICATED SINGLE VEHICLE DETAIL VIEW (/cars?model=<id>)
   * Shows ONE Shipping/Taxes disclaimer + prominent WhatsApp CTA inside page
   * ========================================================================= */
  if (selectedVehicle) {
    const activeTrimId =
      selectedTrims[selectedVehicle.id] || selectedVehicle.trims[0]?.id;
    const activeTrim =
      selectedVehicle.trims.find((tr) => tr.id === activeTrimId) ||
      selectedVehicle.trims[0];
    const imgIndex = activeImgIndices[selectedVehicle.id] || 0;
    const currentImg = selectedVehicle.images[imgIndex];
    const imgFailed = currentImg
      ? Boolean(failedImages[`${selectedVehicle.id}-${imgIndex}`])
      : true;
    const whatsappHref = buildWhatsAppHref(
      selectedVehicle,
      isAr ? activeTrim.labelAr : activeTrim.labelEn,
      activeTrim.fobPriceUsd,
      isAr
    );

    return (
      <div className="bg-[#EAEDED] min-h-screen pb-14">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 pt-4 space-y-5">
          {/* Top Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectCar()}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#00453E] hover:bg-[#00342E] rounded-lg text-xs sm:text-sm font-bold text-white cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180 shrink-0" />
                <span>
                  {isAr ? 'جميع السيارات الكهربائية' : 'All Electric Cars'}
                </span>
              </button>

              <button
                type="button"
                onClick={onBackHome}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-zinc-50 border border-zinc-300 rounded-lg text-xs sm:text-sm font-bold text-zinc-900 cursor-pointer transition-colors"
              >
                <span>{t.backToDodx}</span>
              </button>
            </div>

            {/* Quick Model Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {EV_VEHICLES.map((v) => {
                const isCurrent = v.id === selectedVehicle.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onSelectCar(v.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-[#FFD814] border-[#FCD200] text-zinc-950'
                        : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {isAr ? v.modelAr.split(' (')[0] : v.modelEn.split(' (')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dedicated Car Detail Card */}
          <article className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Multi-Angle Photos + Key Highlights */}
              <div className="lg:col-span-5 bg-zinc-50 border-b lg:border-b-0 lg:border-e border-zinc-200 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] w-full bg-zinc-100 overflow-hidden">
                    {!selectedVehicle.isPhotoMissing && currentImg && !imgFailed ? (
                      <img
                        src={currentImg.src}
                        alt={`${
                          isAr
                            ? selectedVehicle.modelAr
                            : selectedVehicle.modelEn
                        } - ${isAr ? currentImg.angleAr : currentImg.angleEn}`}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({
                            ...prev,
                            [`${selectedVehicle.id}-${imgIndex}`]: true,
                          }))
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#00453E] via-[#007E7B] to-[#0A8B8E] text-white flex flex-col items-center justify-center p-6 text-center">
                        <Car className="w-12 h-12 text-[#FFD814] mb-2" />
                        <p className="font-display text-base font-extrabold">
                          {isAr
                            ? selectedVehicle.modelAr
                            : selectedVehicle.modelEn}
                        </p>
                      </div>
                    )}

                    <span className="absolute top-3 start-3 px-2.5 py-1 rounded bg-[#00453E]/90 text-white text-[11px] font-bold">
                      {isAr
                        ? selectedVehicle.categoryLabelAr
                        : selectedVehicle.categoryLabelEn}
                    </span>
                  </div>

                  {selectedVehicle.images.length > 1 && (
                    <div className="p-3 flex items-center gap-2 border-t border-zinc-200 bg-white">
                      {selectedVehicle.images.map((img, idx) => {
                        const selected = imgIndex === idx;
                        return (
                          <button
                            key={`${selectedVehicle.id}-thumb-${idx}`}
                            type="button"
                            onClick={() =>
                              setActiveImgIndices((prev) => ({
                                ...prev,
                                [selectedVehicle.id]: idx,
                              }))
                            }
                            className={`flex-1 flex items-center gap-2 p-1.5 rounded-lg border text-start cursor-pointer transition-colors ${
                              selected
                                ? 'border-[#00453E] bg-emerald-50/70'
                                : 'border-zinc-200 hover:border-zinc-300 bg-white'
                            }`}
                          >
                            <img
                              src={img.src}
                              alt={isAr ? img.angleAr : img.angleEn}
                              referrerPolicy="no-referrer"
                              className="w-14 h-10 object-cover rounded shrink-0 bg-zinc-100"
                            />
                            <span className="text-[11px] font-bold text-zinc-800 line-clamp-2">
                              {isAr ? img.angleAr : img.angleEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Buyer Quick Highlights */}
                <div className="p-4 space-y-3 border-t border-zinc-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white border border-zinc-200 rounded-lg p-2.5">
                      <span className="block text-[10px] font-bold uppercase text-zinc-500">
                        {isAr ? 'المدى الكهربائي' : 'Range'}
                      </span>
                      <span className="mt-0.5 block text-xs sm:text-sm font-extrabold text-[#00453E] tabular-nums">
                        {isAr
                          ? selectedVehicle.highlightRangeAr
                          : selectedVehicle.highlightRangeEn}
                      </span>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-lg p-2.5">
                      <span className="block text-[10px] font-bold uppercase text-zinc-500">
                        {isAr ? 'البطارية' : 'Battery'}
                      </span>
                      <span className="mt-0.5 block text-xs sm:text-sm font-extrabold text-zinc-900 tabular-nums">
                        {isAr
                          ? selectedVehicle.highlightBatteryAr
                          : selectedVehicle.highlightBatteryEn}
                      </span>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-lg p-2.5">
                      <span className="block text-[10px] font-bold uppercase text-zinc-500">
                        {isAr ? 'الأبواب والمقاعد' : 'Body & Seats'}
                      </span>
                      <span className="mt-0.5 block text-xs sm:text-sm font-extrabold text-zinc-900">
                        {isAr
                          ? selectedVehicle.highlightSeatsAr
                          : selectedVehicle.highlightSeatsEn}
                      </span>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-lg p-2.5">
                      <span className="block text-[10px] font-bold uppercase text-zinc-500">
                        {isAr ? 'المحرك والدفع' : 'Powertrain'}
                      </span>
                      <span className="mt-0.5 block text-xs sm:text-sm font-extrabold text-zinc-900">
                        {isAr
                          ? selectedVehicle.highlightPowerAr
                          : selectedVehicle.highlightPowerEn}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-600 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#007E7B] shrink-0 mt-0.5" />
                    <span>
                      {isAr
                        ? selectedVehicle.photoNoteAr
                        : selectedVehicle.photoNoteEn}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Column: Title, Pricing, ONE Shipping/Tax Disclaimer, WhatsApp CTA, Specs */}
              <div className="lg:col-span-7 p-4 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#007E7B]">
                      {selectedVehicle.brand} ·{' '}
                      {isAr ? selectedVehicle.trimAr : selectedVehicle.trimEn}
                    </span>
                    <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-zinc-950">
                      {isAr ? selectedVehicle.modelAr : selectedVehicle.modelEn}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start">
                    <ShareButton
                      url={`/cars?model=${selectedVehicle.id}`}
                      shareId={selectedVehicle.id}
                      title={isAr ? selectedVehicle.modelAr : selectedVehicle.modelEn}
                      price={`$${activeTrim.fobPriceUsd.toLocaleString()}`}
                      specsText={
                        isAr
                          ? `${selectedVehicle.highlightRangeAr} · ${selectedVehicle.highlightBatteryAr} · ${selectedVehicle.highlightSeatsAr} · ${selectedVehicle.highlightPowerAr}`
                          : `${selectedVehicle.highlightRangeEn} · ${selectedVehicle.highlightBatteryEn} · ${selectedVehicle.highlightSeatsEn} · ${selectedVehicle.highlightPowerEn}`
                      }
                      isAr={isAr}
                      dropDirection="down"
                      entityType="car"
                    />

                    <button
                      type="button"
                      onClick={() => handleCopySpecs(selectedVehicle)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-800 cursor-pointer transition-colors shrink-0"
                    >
                      {copiedCarId === selectedVehicle.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#007600]" />
                          <span>{isAr ? 'تم نسخ المواصفات' : 'Specs Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isAr ? 'نسخ المواصفات' : 'Copy Listing'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                  {isAr
                    ? selectedVehicle.overviewAr
                    : selectedVehicle.overviewEn}
                </p>

                {/* Price + Multi-Trim Selector + Single Shipping Disclaimer + WhatsApp Direct CTA */}
                <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wide text-amber-900">
                        {isAr
                          ? 'السعر المعتمد (FOB الصين)'
                          : 'Confirmed Price (FOB China)'}
                      </span>
                      <div className="mt-0.5 flex items-baseline gap-2">
                        <span
                          className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-950 tabular-nums"
                          dir="ltr"
                        >
                          ${activeTrim.fobPriceUsd.toLocaleString()}
                        </span>
                        <span className="text-xs font-extrabold text-[#00453E] bg-emerald-100 px-2 py-0.5 rounded">
                          FOB China
                        </span>
                      </div>
                    </div>

                    {/* Plain text above + green WhatsApp icon button without visible phone number */}
                    <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                      <p className="text-xs font-semibold text-zinc-800">
                        {isAr
                          ? 'لطلب السعر الشامل تواصل واتساب'
                          : 'For total price, contact via WhatsApp'}
                      </p>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={isAr ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#128C4A] hover:bg-[#0D723B] text-white text-xs sm:text-sm font-extrabold shadow-xs transition-colors"
                      >
                        <WhatsAppIcon className="w-5 h-5 shrink-0" />
                        <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                      </a>
                    </div>
                  </div>

                  {selectedVehicle.trims.length > 1 && (
                    <div className="pt-2 border-t border-amber-200/80">
                      <p className="text-[11px] font-bold text-zinc-800 mb-1.5">
                        {isAr
                          ? 'اختر الفئة المتوفرة لعرض السعر:'
                          : 'Select Confirmed Trim Price:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedVehicle.trims.map((trimOption) => {
                          const isTrimSelected =
                            activeTrim.id === trimOption.id;
                          return (
                            <button
                              key={trimOption.id}
                              type="button"
                              onClick={() =>
                                setSelectedTrims((prev) => ({
                                  ...prev,
                                  [selectedVehicle.id]: trimOption.id,
                                }))
                              }
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                                isTrimSelected
                                  ? 'bg-[#00453E] text-white border-[#00453E]'
                                  : 'bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-50'
                              }`}
                            >
                              {isAr ? trimOption.labelAr : trimOption.labelEn} —{' '}
                              <span className="tabular-nums" dir="ltr">
                                ${trimOption.fobPriceUsd.toLocaleString()} FOB
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {activeTrim.noteEn && (
                        <p className="mt-1.5 text-[11px] text-amber-950 font-medium">
                          * {isAr ? activeTrim.noteAr : activeTrim.noteEn}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ONE single Shipping & Taxes Notice inside this car's dedicated page */}
                  <div className="rounded-lg bg-white border border-amber-200 p-3 text-xs text-zinc-800 leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-950 mb-0.5">
                        {isAr ? FOB_DISCLAIMER.titleAr : FOB_DISCLAIMER.titleEn}
                      </strong>
                      <span>{isAr ? FOB_DISCLAIMER.ar : FOB_DISCLAIMER.en}</span>
                    </div>
                  </div>
                </div>

                {/* Full Key Specifications Grid */}
                <div>
                  <h2 className="font-display text-sm sm:text-base font-extrabold text-zinc-950 flex items-center gap-1.5 mb-3">
                    <FileCheck2 className="w-4 h-4 text-[#007E7B]" />
                    <span>
                      {isAr
                        ? 'المواصفات الأساسية التي تهم المشتري'
                        : 'Key Specifications Buyers Care About'}
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedVehicle.specs.map((spec) => {
                      const Icon = SPEC_ICONS[spec.key] || Info;
                      const isFullRow =
                        spec.key === 'features' || spec.key === 'dimensions';
                      return (
                        <div
                          key={spec.key}
                          className={`rounded-lg border border-zinc-200 bg-zinc-50/70 p-3 ${
                            isFullRow ? 'sm:col-span-2' : ''
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#00453E]">
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span>{isAr ? spec.labelAr : spec.labelEn}</span>
                          </div>
                          <p className="mt-1 text-xs text-zinc-800 leading-relaxed">
                            {isAr ? spec.valueAr : spec.valueEn}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * ALL ELECTRIC CARS CATALOG VIEW (/cars)
   * Shows ONE shipping & taxes disclaimer at page level + WhatsApp CTA per car
   * ========================================================================= */
  return (
    <div className="bg-[#EAEDED] min-h-screen pb-14">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 pt-4 space-y-5">
        {/* Top Navigation Back Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-zinc-50 border border-zinc-300 rounded-lg text-xs sm:text-sm font-bold text-zinc-900 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180 shrink-0" />
            <span>{t.backToDodx}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-zinc-800">
              {isAr
                ? 'لطلب السعر الشامل تواصل واتساب'
                : 'For total price, contact via WhatsApp'}
            </span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isAr ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
              className="inline-flex items-center gap-1.5 bg-[#128C4A] hover:bg-[#0D723B] text-white px-3.5 py-2 rounded-lg text-xs font-extrabold transition-colors shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
            </a>
          </div>
        </div>

        {/* Page Hero Header in Turquoise Gradient Matching Site Theme */}
        <section className="rounded-xl overflow-hidden border border-[#149492]/55 bg-gradient-to-br from-[#00453E] via-[#007E7B] to-[#0A8B8E] text-white p-5 sm:p-7 shadow-sm">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#99F6E4]">
              <Zap className="w-4 h-4 text-[#FFD814] shrink-0" />
              <span>{t.vehiclesBannerKicker}</span>
            </p>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {t.vehiclesBannerTitle}
            </h1>
            <p className="mt-2.5 text-xs sm:text-sm text-teal-50/95 leading-relaxed max-w-3xl">
              {t.vehiclesBannerSub}
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <div className="bg-white border border-zinc-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                id: 'all' as const,
                en: `All Available Models (${EV_VEHICLES.length})`,
                ar: `جميع السيارات المتاحة (${EV_VEHICLES.length})`,
              },
              {
                id: 'micro-ev' as const,
                en: 'City Micro EVs (4)',
                ar: 'سيارات المدينة الصغيرة (4)',
              },
              {
                id: 'compact-hatchback' as const,
                en: '305 km ADAS Hatchback (1)',
                ar: 'هاتشباك متطورة 305 كم (1)',
              },
              {
                id: 'compact-suv' as const,
                en: '5-Seat Compact SUV (1)',
                ar: 'سيارة SUV عائلية 5 مقاعد (1)',
              },
            ].map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#00453E] text-white border-[#00453E]'
                      : 'bg-zinc-50 text-zinc-800 border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  {isAr ? item.ar : item.en}
                </button>
              );
            })}
          </div>

          <span className="text-xs text-zinc-600 font-medium">
            {isAr
              ? 'اضغط على أي سيارة لفتح صفحتها ومواصفاتها الكاملة'
              : 'Click any car to view its dedicated specs page'}
          </span>
        </div>

        {/* All Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredVehicles.map((vehicle) => {
            const activeTrimId =
              selectedTrims[vehicle.id] || vehicle.trims[0]?.id;
            const activeTrim =
              vehicle.trims.find((tr) => tr.id === activeTrimId) ||
              vehicle.trims[0];
            const primaryImage = vehicle.images[0];
            const imgFailed =
              !primaryImage || Boolean(failedImages[`${vehicle.id}-0`]);
            const whatsappHref = buildWhatsAppHref(
              vehicle,
              isAr ? activeTrim.labelAr : activeTrim.labelEn,
              activeTrim.fobPriceUsd,
              isAr
            );

            return (
              <article
                key={vehicle.id}
                id={`ev-card-${vehicle.id}`}
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#007E7B] transition-colors"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => onSelectCar(vehicle.id)}
                    className="relative aspect-[16/10] w-full bg-zinc-100 overflow-hidden block cursor-pointer group"
                  >
                    {!vehicle.isPhotoMissing && primaryImage && !imgFailed ? (
                      <img
                        src={primaryImage.src}
                        alt={isAr ? vehicle.modelAr : vehicle.modelEn}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({
                            ...prev,
                            [`${vehicle.id}-0`]: true,
                          }))
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#00453E] via-[#007E7B] to-[#0A8B8E] text-white flex flex-col items-center justify-center p-6 text-center">
                        <Car className="w-12 h-12 text-[#FFD814] mb-2" />
                        <p className="font-display text-base font-extrabold">
                          {isAr ? vehicle.modelAr : vehicle.modelEn}
                        </p>
                      </div>
                    )}
                    <span className="absolute top-3 start-3 px-2.5 py-1 rounded bg-[#00453E]/90 text-white text-[11px] font-bold">
                      {isAr
                        ? vehicle.categoryLabelAr
                        : vehicle.categoryLabelEn}
                    </span>
                  </button>

                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[11px] font-extrabold text-[#007E7B] line-clamp-1">
                        {isAr ? vehicle.trimAr : vehicle.trimEn}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectCar(vehicle.id)}
                        className="mt-0.5 font-display text-lg font-extrabold text-zinc-950 hover:text-[#00453E] transition-colors text-start cursor-pointer"
                      >
                        {isAr ? vehicle.modelAr : vehicle.modelEn}
                      </button>
                      <p className="mt-1 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {isAr ? vehicle.overviewAr : vehicle.overviewEn}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
                        <span className="block text-[10px] font-bold text-zinc-500">
                          {isAr ? 'المدى' : 'Range'}
                        </span>
                        <span className="font-extrabold text-[#00453E]">
                          {isAr
                            ? vehicle.highlightRangeAr
                            : vehicle.highlightRangeEn}
                        </span>
                      </div>
                      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
                        <span className="block text-[10px] font-bold text-zinc-500">
                          {isAr ? 'البطارية' : 'Battery'}
                        </span>
                        <span className="font-extrabold text-zinc-900">
                          {isAr
                            ? vehicle.highlightBatteryAr
                            : vehicle.highlightBatteryEn}
                        </span>
                      </div>
                      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
                        <span className="block text-[10px] font-bold text-zinc-500">
                          {isAr ? 'المقاعد' : 'Body & Seats'}
                        </span>
                        <span className="font-extrabold text-zinc-900">
                          {isAr
                            ? vehicle.highlightSeatsAr
                            : vehicle.highlightSeatsEn}
                        </span>
                      </div>
                      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
                        <span className="block text-[10px] font-bold text-zinc-500">
                          {isAr ? 'المحرك' : 'Motor'}
                        </span>
                        <span className="font-extrabold text-zinc-900">
                          {isAr
                            ? vehicle.highlightPowerAr
                            : vehicle.highlightPowerEn}
                        </span>
                      </div>
                    </div>

                    {vehicle.trims.length > 1 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {vehicle.trims.map((tr) => (
                          <button
                            key={tr.id}
                            type="button"
                            onClick={() =>
                              setSelectedTrims((prev) => ({
                                ...prev,
                                [vehicle.id]: tr.id,
                              }))
                            }
                            className={`px-2.5 py-1 rounded text-[11px] font-bold border cursor-pointer transition-colors ${
                              activeTrim.id === tr.id
                                ? 'bg-[#00453E] text-white border-[#00453E]'
                                : 'bg-zinc-50 text-zinc-800 border-zinc-300'
                            }`}
                          >
                            {isAr ? tr.rangeAr : tr.rangeEn}: $
                            {tr.fobPriceUsd.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price + Direct Specs Page CTA + WhatsApp CTA */}
                <div className="p-4 pt-3 border-t border-zinc-200 bg-zinc-50/70 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-500">
                        {isAr ? 'السعر (FOB الصين)' : 'FOB China Price'}
                      </span>
                      <span
                        className="font-display text-xl font-extrabold text-zinc-950 tabular-nums"
                        dir="ltr"
                      >
                        ${activeTrim.fobPriceUsd.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectCar(vehicle.id)}
                        className="px-3.5 py-2 rounded-lg bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-zinc-950 text-xs font-extrabold cursor-pointer transition-colors"
                      >
                        {isAr ? 'المواصفات الكاملة' : 'Full Specs'}
                      </button>
                      <ShareButton
                        url={`/cars?model=${vehicle.id}`}
                        shareId={vehicle.id}
                        title={isAr ? vehicle.modelAr : vehicle.modelEn}
                        price={`$${activeTrim.fobPriceUsd.toLocaleString()}`}
                        specsText={
                          isAr
                            ? `${vehicle.highlightRangeAr} · ${vehicle.highlightBatteryAr} · ${vehicle.highlightSeatsAr} · ${vehicle.highlightPowerAr}`
                            : `${vehicle.highlightRangeEn} · ${vehicle.highlightBatteryEn} · ${vehicle.highlightSeatsEn} · ${vehicle.highlightPowerEn}`
                        }
                        isAr={isAr}
                        dropDirection="up"
                        entityType="car"
                      />
                    </div>
                  </div>

                  <div className="pt-1 space-y-1.5">
                    <p className="text-[11px] font-semibold text-zinc-700 text-center">
                      {isAr
                        ? 'لطلب السعر الشامل تواصل واتساب'
                        : 'For total price, contact via WhatsApp'}
                    </p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={isAr ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#128C4A] hover:bg-[#0D723B] text-white text-xs font-extrabold transition-colors"
                    >
                      <WhatsAppIcon className="w-4 h-4 shrink-0" />
                      <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ONE Single Shipping & Taxes Disclaimer Banner on /cars Page */}
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 flex items-start gap-3 text-xs sm:text-sm text-zinc-800 leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-amber-950 mb-1">
              {isAr ? FOB_DISCLAIMER.titleAr : FOB_DISCLAIMER.titleEn}
            </strong>
            <p>{isAr ? FOB_DISCLAIMER.ar : FOB_DISCLAIMER.en}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
