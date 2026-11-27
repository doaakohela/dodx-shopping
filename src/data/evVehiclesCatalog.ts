import warriorPandaFrontImg from '../assets/images/warrior_panda_front_1795785995868.jpg';
import warriorPandaSideImg from '../assets/images/warrior_panda_side_1795785996742.jpg';

export interface EvVehicleTrim {
  id: string;
  labelEn: string;
  labelAr: string;
  rangeEn: string;
  rangeAr: string;
  fobPriceUsd: number;
  noteEn?: string;
  noteAr?: string;
}

export interface EvVehicleSpecRow {
  key:
    | 'range'
    | 'battery'
    | 'motor'
    | 'topSpeed'
    | 'charging'
    | 'seating'
    | 'dimensions'
    | 'features';
  labelEn: string;
  labelAr: string;
  valueEn: string;
  valueAr: string;
}

export interface EvVehicleImage {
  src: string;
  angleEn: string;
  angleAr: string;
}

export interface EvVehicleItem {
  id: string;
  brand: string;
  modelEn: string;
  modelAr: string;
  trimEn: string;
  trimAr: string;
  categoryTag: 'micro-ev' | 'compact-hatchback' | 'compact-suv';
  categoryLabelEn: string;
  categoryLabelAr: string;
  overviewEn: string;
  overviewAr: string;
  trims: EvVehicleTrim[];
  startingPriceUsd: number;
  highlightRangeEn: string;
  highlightRangeAr: string;
  highlightBatteryEn: string;
  highlightBatteryAr: string;
  highlightSeatsEn: string;
  highlightSeatsAr: string;
  highlightPowerEn: string;
  highlightPowerAr: string;
  specs: EvVehicleSpecRow[];
  images: EvVehicleImage[];
  isPhotoMissing?: boolean;
  photoNoteEn: string;
  photoNoteAr: string;
}

export const FOB_DISCLAIMER = {
  titleEn: 'FOB Export Pricing Notice (Excludes Shipping & Taxes)',
  titleAr: 'تنبيه مهم بخصوص السعر (لا يشمل الشحن والجمارك والضرائب)',
  en: 'Note: Listed prices are FOB China (Free On Board) export prices. They do NOT include international sea shipping, marine insurance, customs duties, local taxes, port clearance, or registration fees in the destination country. Final landed cost depends on destination port, shipping rates at the time of order, and local import regulations.',
  ar: 'ملاحظة: الأسعار المعروضة هي أسعار تصدير FOB الصين (التسليم على ظهر السفينة في الميناء الصيني). وهي لا تشمل الشحن البحري الدولي، أو التأمين البحري، أو الرسوم الجمركية، أو الضرائب المحلية، أو التخليص الجمركي، أو رسوم الترخيص والتسجيل في بلد الوجهة. وتعتمد التكلفة النهائية عند الوصول على ميناء الوجهة، وأسعار الشحن وقت الطلب، ولوائح الاستيراد المحلية.',
};

export const EV_VEHICLES: EvVehicleItem[] = [
  {
    id: 'wuling-hongguang-miniev',
    brand: 'Wuling',
    modelEn: 'Wuling Hongguang MINIEV',
    modelAr: 'وولينج هونغقوانغ ميني EV',
    trimEn: '2026 Fifth Generation · 205 km & 305 km Trims',
    trimAr: 'الجيل الخامس 2026 · فئتي 205 كم و 305 كم',
    categoryTag: 'micro-ev',
    categoryLabelEn: '5-Door City Micro EV',
    categoryLabelAr: 'سيارة مدينة كهربائية 5 أبواب',
    overviewEn:
      'Ideal for daily urban commuting, fleet delivery, and budget-friendly EV entry. The fifth-generation 5-door 4-seat layout offers easier rear passenger access, fast DC charging, and proven LFP battery safety.',
    overviewAr:
      'مثالية للتنقل اليومي داخل المدن وأساطيل التوصيل والدخول الاقتصادي لعالم السيارات الكهربائية. يتميز الجيل الخامس بتصميم 5 أبواب و4 مقاعد لسهولة الركوب مع شحن سريع وبطارية LFP موثوقة.',
    trims: [
      {
        id: 'wuling-205',
        labelEn: '205 km Range Trim',
        labelAr: 'فئة مدى 205 كم',
        rangeEn: '205 km',
        rangeAr: '205 كم',
        fobPriceUsd: 8500,
        noteEn: 'Full 205 km detailed trim sheet available upon quote request',
        noteAr: 'المواصفات التفصيلية الكاملة لفئة 205 كم متوفرة عند طلب عرض السعر',
      },
      {
        id: 'wuling-305',
        labelEn: '305 km Trim (301 km Advanced PDF Spec)',
        labelAr: 'فئة مدى 305 كم (مواصفات 301 كم المتقدمة)',
        rangeEn: '301–305 km',
        rangeAr: '301–305 كم',
        fobPriceUsd: 9050,
      },
    ],
    startingPriceUsd: 8500,
    highlightRangeEn: '205 / 301 km CLTC',
    highlightRangeAr: '205 / 301 كم CLTC',
    highlightBatteryEn: '25.1 kWh LFP',
    highlightBatteryAr: '25.1 ك.و.س LFP',
    highlightSeatsEn: '5 Doors · 4 Seats',
    highlightSeatsAr: '5 أبواب · 4 مقاعد',
    highlightPowerEn: '30 kW (85 N·m) RWD',
    highlightPowerAr: '30 كيلوواط دفع خلفي',
    specs: [
      {
        key: 'range',
        labelEn: 'Driving Range (CLTC)',
        labelAr: 'مدى القيادة (CLTC)',
        valueEn: '301 km (305 km Trim PDF); 205 km Trim specs: Available upon quote request',
        valueAr: '301 كم (ملف فئة 305 كم)؛ تفاصيل فئة 205 كم: متوفر عند طلب عرض السعر',
      },
      {
        key: 'battery',
        labelEn: 'Battery Capacity & Type',
        labelAr: 'سعة ونوع البطارية',
        valueEn: '25.1 kWh Lithium Iron Phosphate (LFP, Ruipu Energy), 9.2 kWh/100km, battery preheating & energy recovery',
        valueAr: '25.1 كيلوواط ساعة فوسفات الحديد الليثيوم (LFP)، استهلاك 9.2 ك.و.س/100 كم، تسخين مسبق واسترداد طاقة',
      },
      {
        key: 'motor',
        labelEn: 'Motor Power & Drivetrain',
        labelAr: 'قوة المحرك ونظام الدفع',
        valueEn: '30 kW / 85 N·m Rear-mounted Permanent Magnet Synchronous Motor (RWD)',
        valueAr: '30 كيلوواط / عزم 85 نيوتن·متر، محرك متزامن مغناطيسي دائم خلفي (دفع خلفي)',
      },
      {
        key: 'topSpeed',
        labelEn: 'Top Speed',
        labelAr: 'السرعة القصوى',
        valueEn: '101 km/h',
        valueAr: '101 كم/ساعة',
      },
      {
        key: 'charging',
        labelEn: 'Charging Time',
        labelAr: 'مدة الشحن',
        valueEn: 'Fast DC (30%–80%): 0.58 h (~35 min) | Slow AC: 7.2 h',
        valueAr: 'شحن سريع (30%–80%): 0.58 ساعة (~35 دقيقة) | شحن بطيء: 7.2 ساعة',
      },
      {
        key: 'seating',
        labelEn: 'Body & Seating Capacity',
        labelAr: 'الهيكل وعدد المقاعد',
        valueEn: '5-Door, 4-Seat Mini Hatchback',
        valueAr: 'هاتشباك صغيرة 5 أبواب · 4 مقاعد',
      },
      {
        key: 'dimensions',
        labelEn: 'Dimensions & Weight',
        labelAr: 'الأبعاد والوزن والتخزين',
        valueEn: '3268 × 1520 × 1575 mm | Wheelbase: 2190 mm | Curb Weight: 860 kg | Cargo: 170–838 L | 155/70 R13 steel wheels',
        valueAr: '3268 × 1520 × 1575 مم | قاعدة العجلات: 2190 مم | الوزن الفارغ: 860 كجم | الصندوق: 170–838 لتر | جنوط فولاذية 13 بوصة',
      },
      {
        key: 'features',
        labelEn: 'Interior, Safety & Tech',
        labelAr: 'الأمان والتجهيزات الداخلية',
        valueEn: 'Dual front airbags, ABS+EBD/CBC, TPMS, ISOFIX, 2 rear parking radars, 7" LCD cluster, electronic column shifter, LED headlights, manual A/C, Bluetooth, 3 front USB ports, mobile app remote control',
        valueAr: 'وسادتان هوائيتان أماميتان، ABS+EBD/CBC، مراقبة ضغط الإطارات، ISOFIX، حساسات ركن خلفية (2)، شاشة عدادات 7 بوصة، ناقل إلكتروني، مصابيح LED، تكييف، بلوتوث، 3 منافذ USB، تحكم عن بُعد بالتطبيق',
      },
    ],
    images: [
      {
        src: '/assets/aistudio/image_1fb3be1f.png',
        angleEn: 'Front 3/4 Studio View',
        angleAr: 'واجهة أمامية جانبية',
      },
      {
        src: '/assets/aistudio/image_77aec892.png',
        angleEn: 'Side Profile Studio View',
        angleAr: 'منظر جانبي كامل',
      },
    ],
    photoNoteEn: 'Cream two-tone 5-door hatchback with black roof and silver Wuling badge on white studio backdrop.',
    photoNoteAr: 'سيارة هاتشباك كريمي 5 أبواب بسقف أسود وشعار Wuling في استوديو أبيض.',
  },
  {
    id: 'changan-lumin',
    brand: 'Changan',
    modelEn: 'Changan Lumin',
    modelAr: 'شانجان لومين',
    trimEn: '2026 · 205 km Edition',
    trimAr: 'إصدار 2026 · مدى 205 كم',
    categoryTag: 'micro-ev',
    categoryLabelEn: 'Budget City Hatchback',
    categoryLabelAr: 'سيارة مدينة اقتصادية 3 أبواب',
    overviewEn:
      'The most affordable EV entry in our lineup, built for compact urban parking, student and daily short-range commuting, and low operating costs. Combines playful styling with fast charging and smart 4G remote control.',
    overviewAr:
      'الخيار الأقل تكلفة في قائمة التصدير للقيادة اليومية داخل المدن وسهولة الاصطفاف في الأماكن الضيقة مع تكاليف تشغيل منخفضة، ودعم الشحن السريع والتحكم عن بُعد عبر التطبيق.',
    trims: [
      {
        id: 'lumin-205',
        labelEn: '205 km Standard Export Trim',
        labelAr: 'فئة مدى 205 كم القياسية للتصدير',
        rangeEn: '205 km',
        rangeAr: '205 كم',
        fobPriceUsd: 7250,
      },
    ],
    startingPriceUsd: 7250,
    highlightRangeEn: '205 km CLTC',
    highlightRangeAr: '205 كم CLTC',
    highlightBatteryEn: '17.65 kWh LFP',
    highlightBatteryAr: '17.65 ك.و.س LFP',
    highlightSeatsEn: '3 Doors · 4 Seats',
    highlightSeatsAr: '3 أبواب · 4 مقاعد',
    highlightPowerEn: '35 kW (85 N·m) FWD',
    highlightPowerAr: '35 كيلوواط دفع أمامي',
    specs: [
      {
        key: 'range',
        labelEn: 'Driving Range (CLTC)',
        labelAr: 'مدى القيادة (CLTC)',
        valueEn: '205 km',
        valueAr: '205 كم',
      },
      {
        key: 'battery',
        labelEn: 'Battery Capacity & Type',
        labelAr: 'سعة ونوع البطارية',
        valueEn: '17.65 kWh LFP (Guoxuan High-Tech), air-cooled, 125 Wh/kg, 9.6 kWh/100km',
        valueAr: '17.65 كيلوواط ساعة LFP تبريد هوائي، كثافة 125 واط·ساعة/كجم، استهلاك 9.6 ك.و.س/100 كم',
      },
      {
        key: 'motor',
        labelEn: 'Motor Power & Drivetrain',
        labelAr: 'قوة المحرك ونظام الدفع',
        valueEn: '35 kW / 85 N·m Front-mounted PMSM (FWD), 0–50 km/h in 6.1 s',
        valueAr: '35 كيلوواط / عزم 85 نيوتن·متر دفع أمامي، تسارع 0–50 كم/س خلال 6.1 ثانية',
      },
      {
        key: 'topSpeed',
        labelEn: 'Top Speed',
        labelAr: 'السرعة القصوى',
        valueEn: '101 km/h',
        valueAr: '101 كم/ساعة',
      },
      {
        key: 'charging',
        labelEn: 'Charging Time',
        labelAr: 'مدة الشحن',
        valueEn: 'Fast DC (30%–80%): 0.58 h (~35 min) | Slow AC: 6.5 h',
        valueAr: 'شحن سريع (30%–80%): 0.58 ساعة (~35 دقيقة) | شحن بطيء: 6.5 ساعة',
      },
      {
        key: 'seating',
        labelEn: 'Body & Seating Capacity',
        labelAr: 'الهيكل وعدد المقاعد',
        valueEn: '3-Door, 4-Seat Mini Hatchback',
        valueAr: 'هاتشباك صغيرة 3 أبواب · 4 مقاعد',
      },
      {
        key: 'dimensions',
        labelEn: 'Dimensions & Weight',
        labelAr: 'الأبعاد والوزن والتخزين',
        valueEn: '3293 × 1700 × 1545 mm | Wheelbase: 1980 mm | Ground clearance: 150 mm | Curb Weight: 855 kg | Cargo: 104–804 L | 165/70 R14 steel wheels',
        valueAr: '3293 × 1700 × 1545 مم | قاعدة العجلات: 1980 مم | الخلوص الأرضي: 150 مم | الوزن: 855 كجم | التخزين: 104–804 لتر | إطارات 14 بوصة',
      },
      {
        key: 'features',
        labelEn: 'Interior, Safety & Tech',
        labelAr: 'الأمان والتجهيزات الداخلية',
        valueEn: 'Driver airbag, ABS+EBD/CBC, TPMS, ISOFIX, 2 rear parking radars, Sports/Eco modes, 7" LCD display, rotary gear selector, 4G app remote control, 2 front USB ports, halogen headlights, remote key, manual A/C',
        valueAr: 'وسادة هوائية للسائق، ABS+EBD/CBC، مراقبة ضغط الإطارات، ISOFIX، حساسات ركن خلفية (2)، أوضاع قيادة رياضية واقتصادية، شاشة 7 بوصة، تحكم 4G بالتطبيق، منفذي USB، مفتاح عن بُعد وتكييف',
      },
    ],
    images: [
      {
        src: '/assets/aistudio/image_f76e9939.png',
        angleEn: 'Front 3/4 Exterior View',
        angleAr: 'منظر أمامي جانبي',
      },
      {
        src: '/assets/aistudio/image_22a78ca9.png',
        angleEn: 'Side Profile Exterior View',
        angleAr: 'منظر جانبي كامل',
      },
    ],
    photoNoteEn: 'Champagne-silver 3-door hatchback with circular headlamps and LUMIN front emblem.',
    photoNoteAr: 'هاتشباك فضي-شامبين 3 أبواب بمصابيح أمامية دائرية وشعار LUMIN.',
  },
  {
    id: 'byd-seagull-freedom',
    brand: 'BYD',
    modelEn: 'BYD Seagull',
    modelAr: 'بي واي دي سيجول (BYD Seagull)',
    trimEn: '2026 · 305 km "Freedom" Edition',
    trimAr: 'إصدار الحرية 2026 (Freedom) · مدى 305 كم',
    categoryTag: 'compact-hatchback',
    categoryLabelEn: 'Advanced L2 ADAS Hatchback',
    categoryLabelAr: 'هاتشباك متطورة مع قيادة ذكية L2',
    overviewEn:
      'Designed for buyers seeking highway capability, flagship safety, and advanced smart driving tech in a compact hatchback. Features a 55 kW motor, 6 airbags, DiPilot 100 L2 driver assistance, and a 12.8" rotating DiLink display.',
    overviewAr:
      'موجهة للمشترين الباحثين عن أداء طرق سريعة وأعلى معايير الأمان والتقنيات الذكية في سيارة مدمجة. تتميز بمحرك 55 كيلوواط و6 وسائد هوائية ونظام مساعدة السائق L2 مع شاشة 12.8 بوصة و360 درجة.',
    trims: [
      {
        id: 'seagull-freedom-305',
        labelEn: '305 km "Freedom" Edition',
        labelAr: 'إصدار الحرية 305 كم (Freedom)',
        rangeEn: '305 km',
        rangeAr: '305 كم',
        fobPriceUsd: 11900,
      },
    ],
    startingPriceUsd: 11900,
    highlightRangeEn: '305 km CLTC',
    highlightRangeAr: '305 كم CLTC',
    highlightBatteryEn: '30.08 kWh Blade LFP',
    highlightBatteryAr: '30.08 ك.و.س بليد LFP',
    highlightSeatsEn: '5 Doors · 4 Seats',
    highlightSeatsAr: '5 أبواب · 4 مقاعد',
    highlightPowerEn: '55 kW (135 N·m) · 130 km/h',
    highlightPowerAr: '55 كيلوواط · 130 كم/س',
    specs: [
      {
        key: 'range',
        labelEn: 'Driving Range (CLTC)',
        labelAr: 'مدى القيادة (CLTC)',
        valueEn: '305 km',
        valueAr: '305 كم',
      },
      {
        key: 'battery',
        labelEn: 'Battery Capacity & Type',
        labelAr: 'سعة ونوع البطارية',
        valueEn: '30.08 kWh FinDreams LFP Battery, air-cooled, 9.9 kWh/100km, battery preheating, energy recovery & VTOL external power discharge',
        valueAr: '30.08 كيلوواط ساعة بطارية FinDreams LFP، استهلاك 9.9 ك.و.س/100 كم، تسخين مسبق وتفريغ طاقة خارجي VTOL',
      },
      {
        key: 'motor',
        labelEn: 'Motor Power & Drivetrain',
        labelAr: 'قوة المحرك ونظام الدفع',
        valueEn: '55 kW / 135 N·m Front-mounted PMSM (FWD), 0–50 km/h in 4.9 s',
        valueAr: '55 كيلوواط / عزم 135 نيوتن·متر دفع أمامي، تسارع 0–50 كم/س خلال 4.9 ثانية',
      },
      {
        key: 'topSpeed',
        labelEn: 'Top Speed',
        labelAr: 'السرعة القصوى',
        valueEn: '130 km/h',
        valueAr: '130 كم/ساعة',
      },
      {
        key: 'charging',
        labelEn: 'Charging Time',
        labelAr: 'مدة الشحن',
        valueEn: 'Fast DC (30%–80% at 30 kW): 0.5 h (30 min) | Slow AC: Available upon quote request',
        valueAr: 'شحن سريع (30%–80% بقدرة 30 كيلوواط): 30 دقيقة | الشحن البطيء: متوفر عند طلب عرض السعر',
      },
      {
        key: 'seating',
        labelEn: 'Body & Seating Capacity',
        labelAr: 'الهيكل وعدد المقاعد',
        valueEn: '5-Door, 4-Seat Small Hatchback',
        valueAr: 'هاتشباك مدمجة 5 أبواب · 4 مقاعد',
      },
      {
        key: 'dimensions',
        labelEn: 'Dimensions & Weight',
        labelAr: 'الأبعاد والوزن والتخزين',
        valueEn: '3780 × 1715 × 1540 mm | Wheelbase: 2500 mm | Curb Weight: 1160 kg | Max Cargo: 930 L | 175/55 R16 alloy wheels, EPB',
        valueAr: '3780 × 1715 × 1540 مم | قاعدة العجلات: 2500 مم | الوزن: 1160 كجم | صندوق حتى 930 لتر | جنوط ألمنيوم 16 بوصة، فرامل EPB',
      },
      {
        key: 'features',
        labelEn: 'Interior, Safety & Tech',
        labelAr: 'الأمان والتجهيزات الداخلية',
        valueEn: '6 airbags, ABS/EBD/BA/TCS/ESC/AEB, DiPilot 100 L2 ADAS (Nvidia Orin-N 84 TOPS, 11 cameras, 12 ultrasonic + 3 mmWave radars), full-speed ACC, LKA/LCC/LCA, 360° camera, auto/remote parking, 12.8" 5G DiLink screen, 8.8" cluster, heated leatherette sport seats (electric driver), NFC/Bluetooth keyless, dashcam, 60W Type-C, auto LED headlights & auto A/C',
        valueAr: '6 وسائد هوائية، ثبات إلكتروني وفرملة طوارئ AEB، حزمة قيادة ذكية DiPilot 100 L2 (شريحة Orin-N، 11 كاميرا، 12 حساس، 3 رادارات)، مثبت سرعة ذكي، كاميرا 360°، ركن آلي وعن بُعد، شاشة 12.8 بوصة 5G، مقاعد رياضية مدفأة وكهربائية للسائق، تشغيل NFC، داش كام مدمجة، شحن Type-C 60W وتكييف أوتوماتيكي',
      },
    ],
    images: [
      {
        src: '/assets/aistudio/image_9cb04596.png',
        angleEn: 'Front 3/4 Exterior View',
        angleAr: 'منظر أمامي جانبي',
      },
      {
        src: '/assets/aistudio/image_ce7ba150.png',
        angleEn: 'Side Profile Exterior View',
        angleAr: 'منظر جانبي كامل',
      },
    ],
    photoNoteEn: 'Pearl-pink 5-door hatchback with sporty gunmetal alloy wheels and BYD nose badge.',
    photoNoteAr: 'هاتشباك وردي لؤلؤي 5 أبواب بجنوط رياضية وشعار BYD.',
  },
  {
    id: 'geely-geometry-e',
    brand: 'Geely',
    modelEn: 'Geely Geometry E',
    modelAr: 'جيلي جيومتري E (Geometry E)',
    trimEn: '2024 · 301 km Compact SUV',
    trimAr: 'إصدار 2024 · مدى 301 كم (كروس أوفر SUV)',
    categoryTag: 'compact-suv',
    categoryLabelEn: '5-Seat Compact Electric SUV',
    categoryLabelAr: 'سيارة SUV كهربائية مدمجة 5 مقاعد',
    overviewEn:
      'Built for families and drivers needing true 5-passenger seating, elevated 165 mm SUV ground clearance, and up to 1,000 L cargo space. Pairs a 60 kW motor and external V2L power discharge with fast 30-minute DC charging.',
    overviewAr:
      'مصممة للعائلات والباحثين عن سيارة 5 مقاعد حقيقية مع ارتفاع SUV عملي (165 مم) ومساحة تخزين تصل إلى 1000 لتر، مع محرك قوي 60 كيلوواط ودعم تفريغ الطاقة الخارجي وشحن سريع خلال 30 دقيقة.',
    trims: [
      {
        id: 'geometry-e-301',
        labelEn: '301 km Export Trim',
        labelAr: 'فئة مدى 301 كم للتصدير',
        rangeEn: '301 km',
        rangeAr: '301 كم',
        fobPriceUsd: 9200,
      },
    ],
    startingPriceUsd: 9200,
    highlightRangeEn: '301 km CLTC',
    highlightRangeAr: '301 كم CLTC',
    highlightBatteryEn: '29.67 kWh LFP',
    highlightBatteryAr: '29.67 ك.و.س LFP',
    highlightSeatsEn: '5 Doors · 5 Seats (SUV)',
    highlightSeatsAr: '5 أبواب · 5 مقاعد (SUV)',
    highlightPowerEn: '60 kW (130 N·m) FWD',
    highlightPowerAr: '60 كيلوواط دفع أمامي',
    specs: [
      {
        key: 'range',
        labelEn: 'Driving Range (CLTC)',
        labelAr: 'مدى القيادة (CLTC)',
        valueEn: '301 km',
        valueAr: '301 كم',
      },
      {
        key: 'battery',
        labelEn: 'Battery Capacity & Type',
        labelAr: 'سعة ونوع البطارية',
        valueEn: '29.67 kWh LFP (Guoxuan High-Tech), air-cooled, 11.4 kWh/100km, battery preheating, energy recovery & external discharge',
        valueAr: '29.67 كيلوواط ساعة LFP، استهلاك 11.4 ك.و.س/100 كم، تسخين مسبق وتفريغ طاقة خارجي',
      },
      {
        key: 'motor',
        labelEn: 'Motor Power & Drivetrain',
        labelAr: 'قوة المحرك ونظام الدفع',
        valueEn: '60 kW / 130 N·m Front-mounted PMSM (FWD)',
        valueAr: '60 كيلوواط / عزم 130 نيوتن·متر محرك أمامي (دفع أمامي)',
      },
      {
        key: 'topSpeed',
        labelEn: 'Top Speed',
        labelAr: 'السرعة القصوى',
        valueEn: '102 km/h',
        valueAr: '102 كم/ساعة',
      },
      {
        key: 'charging',
        labelEn: 'Charging Time',
        labelAr: 'مدة الشحن',
        valueEn: 'Fast DC (30%–80%): 0.5 h (30 min) | Slow AC: 4.5 h',
        valueAr: 'شحن سريع (30%–80%): 30 دقيقة | شحن بطيء: 4.5 ساعة',
      },
      {
        key: 'seating',
        labelEn: 'Body & Seating Capacity',
        labelAr: 'الهيكل وعدد المقاعد',
        valueEn: '5-Door, 5-Seat Small Crossover SUV',
        valueAr: 'كروس أوفر SUV مدمجة · 5 أبواب · 5 مقاعد',
      },
      {
        key: 'dimensions',
        labelEn: 'Dimensions & Weight',
        labelAr: 'الأبعاد والوزن والتخزين',
        valueEn: '4006 × 1765 × 1550 mm | Wheelbase: 2485 mm | Ground clearance: 165 mm | Curb Weight: 1240 kg | Cargo: 356–1000 L | 205/60 R16 wheels',
        valueAr: '4006 × 1765 × 1550 مم | قاعدة العجلات: 2485 مم | الخلوص الأرضي: 165 مم | الوزن: 1240 كجم | الصندوق: 356–1000 لتر | إطارات 16 بوصة',
      },
      {
        key: 'features',
        labelEn: 'Interior, Safety & Tech',
        labelAr: 'الأمان والتجهيزات الداخلية',
        valueEn: 'Dual front airbags, ABS+EBD/CBC, TPMS display, ISOFIX, reversing camera, 9.8" LCD cluster, 8" touchscreen (10.25" opt), 4 speakers, 3 USB/Type-C ports, app remote control, rotary shifter, roof rack, keyless start, heated power mirrors, PM2.5 filtration, manual A/C',
        valueAr: 'وسادتان هوائيتان، ABS+EBD/CBC، مراقبة ضغط الإطارات، كاميرا خلفية، شاشة عدادات 9.8 بوصة وشاشة لمس 8 بوصة، 3 منافذ USB/Type-C، تشغيل بدون مفتاح، مرايا مدفأة، قضبان سقف، فلتر PM2.5 وتكييف',
      },
    ],
    images: [
      {
        src: '/assets/aistudio/image_4a88eaa4.png',
        angleEn: 'Front 3/4 Exterior View',
        angleAr: 'منظر أمامي جانبي',
      },
      {
        src: '/assets/aistudio/image_79c6a3c4.png',
        angleEn: 'Side Profile Exterior View',
        angleAr: 'منظر جانبي كامل',
      },
    ],
    photoNoteEn: 'White 5-door compact electric SUV with full-width front LED bar and black roof rails.',
    photoNoteAr: 'سيارة SUV كهربائية بيضاء 5 أبواب بشريط إضاءة أمامي وقضبان سقف.',
  },
  {
    id: 'geely-energetic-panda',
    brand: 'Geely',
    modelEn: 'Geely Energetic Panda (Yuanqi Panda)',
    modelAr: 'جيلي إنيرجيتيك باندا (Panda Mini Energetic Bear)',
    trimEn: '2025 Panda Mini · 210 km Energetic Bear',
    trimAr: 'باندا ميني 2025 · مدى 210 كم',
    categoryTag: 'micro-ev',
    categoryLabelEn: 'Agile City Micro EV',
    categoryLabelAr: 'سيارة مدينة ذكية عالية المناورة',
    overviewEn:
      'Tailored for tight city streets and daily commuting with a 4.0 m turning radius and generous 170 mm ground clearance. Stands out with fast 30-minute DC charging, reversing camera, voice control, and keyless Bluetooth phone entry.',
    overviewAr:
      'مصممة للشوارع المزدحمة بفضل نصف قطر دوران 4 أمتار فقط وخلوص أرضي مرتفع 170 مم. تتميز بشحن سريع خلال 30 دقيقة، وكاميرا خلفية مع حساسات، وتحكم صوتي، ومفتاح بلوتوث عبر الهاتف.',
    trims: [
      {
        id: 'panda-energetic-210',
        labelEn: '210 km Energetic Panda Trim',
        labelAr: 'فئة مدى 210 كم (Energetic Panda)',
        rangeEn: '210 km',
        rangeAr: '210 كم',
        fobPriceUsd: 8000,
      },
    ],
    startingPriceUsd: 8000,
    highlightRangeEn: '210 km CLTC',
    highlightRangeAr: '210 كم CLTC',
    highlightBatteryEn: '17.03 kWh LFP',
    highlightBatteryAr: '17.03 ك.و.س LFP',
    highlightSeatsEn: '3 Doors · 4 Seats',
    highlightSeatsAr: '3 أبواب · 4 مقاعد',
    highlightPowerEn: '30 kW (110 N·m) RWD',
    highlightPowerAr: '30 كيلوواط دفع خلفي',
    specs: [
      {
        key: 'range',
        labelEn: 'Driving Range (CLTC)',
        labelAr: 'مدى القيادة (CLTC)',
        valueEn: '210 km',
        valueAr: '210 كم',
      },
      {
        key: 'battery',
        labelEn: 'Battery Capacity & Type',
        labelAr: 'سعة ونوع البطارية',
        valueEn: '17.03 kWh LFP (Guoxuan High-Tech), 125.78 Wh/kg, 9.1 kWh/100km, battery preheating & energy recovery',
        valueAr: '17.03 كيلوواط ساعة LFP، كثافة 125.78 واط·ساعة/كجم، استهلاك 9.1 ك.و.س/100 كم، تسخين مسبق واسترداد طاقة',
      },
      {
        key: 'motor',
        labelEn: 'Motor Power & Drivetrain',
        labelAr: 'قوة المحرك ونظام الدفع',
        valueEn: '30 kW / 110 N·m Rear-mounted PMSM (RWD)',
        valueAr: '30 كيلوواط / عزم 110 نيوتن·متر محرك خلفي (دفع خلفي)',
      },
      {
        key: 'topSpeed',
        labelEn: 'Top Speed',
        labelAr: 'السرعة القصوى',
        valueEn: '100 km/h',
        valueAr: '100 كم/ساعة',
      },
      {
        key: 'charging',
        labelEn: 'Charging Time',
        labelAr: 'مدة الشحن',
        valueEn: 'Fast DC (30%–80% at 22 kW): 0.5 h (30 min) | Slow AC: 4.5 h',
        valueAr: 'شحن سريع (30%–80% بقدرة 22 كيلوواط): 30 دقيقة | شحن بطيء: 4.5 ساعة',
      },
      {
        key: 'seating',
        labelEn: 'Body & Seating Capacity',
        labelAr: 'الهيكل وعدد المقاعد',
        valueEn: '3-Door, 4-Seat Mini Hatchback',
        valueAr: 'هاتشباك صغيرة 3 أبواب · 4 مقاعد',
      },
      {
        key: 'dimensions',
        labelEn: 'Dimensions & Weight',
        labelAr: 'الأبعاد والوزن والتخزين',
        valueEn: '3085 × 1522 × 1600 mm | Wheelbase: 2015 mm | Ground clearance: 170 mm | Curb Weight: 815 kg | Cargo: 69–800 L | Min turning radius: 4.0 m | 155/70 R13 steel wheels',
        valueAr: '3085 × 1522 × 1600 مم | قاعدة العجلات: 2015 مم | الخلوص الأرضي: 170 مم | الوزن: 815 كجم | الصندوق: 69–800 لتر | قطر دوران 4.0 م',
      },
      {
        key: 'features',
        labelEn: 'Interior, Safety & Tech',
        labelAr: 'الأمان والتجهيزات الداخلية',
        valueEn: 'Dual front airbags, ABS+EBD/CBC, TPMS alarm, ISOFIX, Hill Start Assist, 2 rear parking radars + reversing camera, 9.2" LCD cluster + 8" central touchscreen, Bluetooth & phone mapping, voice control, app remote control, Bluetooth key + keyless/remote start, LED headlights, 2 USB ports, manual A/C',
        valueAr: 'وسادتان هوائيتان، ABS+EBD/CBC، تثبيت على المرتفعات، حساسات ركن خلفية (2) + كاميرا خلفية، شاشة عدادات 9.2 بوصة + شاشة 8 بوصة، ربط الهاتف، تحكم صوتي، مفتاح بلوتوث، مصابيح LED وتكييف',
      },
    ],
    images: [
      {
        src: '/assets/aistudio/image_1508e73a.png',
        angleEn: 'Front 3/4 Exterior View',
        angleAr: 'منظر أمامي جانبي',
      },
      {
        src: '/assets/aistudio/image_180da0c4.png',
        angleEn: 'Side Profile Exterior View',
        angleAr: 'منظر جانبي كامل',
      },
    ],
    photoNoteEn: 'Cream 3-door micro EV with round headlights, GEOME front badge, and 3-spoke tri-tone wheel covers.',
    photoNoteAr: 'سيارة كريمي 3 أبواب بمصابيح دائرية وشعار GEOME الأمامي.',
  },
  {
    id: 'geely-warrior-panda',
    brand: 'Geely',
    modelEn: 'Geely Warrior Panda (Panda Warrior)',
    modelAr: 'جيلي واريور باندا (Panda Warrior)',
    trimEn: 'Export Edition',
    trimAr: 'إصدار التصدير الخاص',
    categoryTag: 'micro-ev',
    categoryLabelEn: 'Rugged Micro EV',
    categoryLabelAr: 'نسخة مدمجة بطابع مغامر',
    overviewEn:
      'Rugged-styled urban micro EV tailored for international dealers and buyers seeking Panda agility with Warrior styling cues. Confirmed export allocation is active — request an export quote for full spec sheet and photos.',
    overviewAr:
      'نسخة مدمجة بطابع جريء للمدن والاستيراد المباشر بتكلفة اقتصادية تنافسية. التخصيص للتصدير متاح حالياً — اطلب عرض السعر للحصول على ملف المواصفات الفنية والصور التفصيلية.',
    trims: [
      {
        id: 'panda-warrior-export',
        labelEn: 'Panda Warrior Export Trim',
        labelAr: 'فئة Panda Warrior للتصدير',
        rangeEn: 'Available upon quote request',
        rangeAr: 'متوفر عند طلب عرض السعر',
        fobPriceUsd: 8450,
      },
    ],
    startingPriceUsd: 8450,
    highlightRangeEn: 'Available upon quote request',
    highlightRangeAr: 'متوفر عند طلب عرض السعر',
    highlightBatteryEn: 'Available upon quote request',
    highlightBatteryAr: 'متوفر عند طلب عرض السعر',
    highlightSeatsEn: 'Available upon quote request',
    highlightSeatsAr: 'متوفر عند طلب عرض السعر',
    highlightPowerEn: 'Available upon quote request',
    highlightPowerAr: 'متوفر عند طلب عرض السعر',
    specs: [
      {
        key: 'range',
        labelEn: 'Driving Range (CLTC)',
        labelAr: 'مدى القيادة (CLTC)',
        valueEn: 'Available upon quote request',
        valueAr: 'متوفر عند طلب عرض السعر',
      },
      {
        key: 'battery',
        labelEn: 'Battery Capacity & Type',
        labelAr: 'سعة ونوع البطارية',
        valueEn: 'Available upon quote request',
        valueAr: 'متوفر عند طلب عرض السعر',
      },
      {
        key: 'motor',
        labelEn: 'Motor Power & Drivetrain',
        labelAr: 'قوة المحرك ونظام الدفع',
        valueEn: 'Available upon quote request',
        valueAr: 'متوفر عند طلب عرض السعر',
      },
      {
        key: 'topSpeed',
        labelEn: 'Top Speed',
        labelAr: 'السرعة القصوى',
        valueEn: 'Available upon quote request',
        valueAr: 'متوفر عند طلب عرض السعر',
      },
      {
        key: 'charging',
        labelEn: 'Charging Time',
        labelAr: 'مدة الشحن',
        valueEn: 'Available upon quote request',
        valueAr: 'متوفر عند طلب عرض السعر',
      },
      {
        key: 'seating',
        labelEn: 'Body & Seating Capacity',
        labelAr: 'الهيكل وعدد المقاعد',
        valueEn: 'Available upon quote request',
        valueAr: 'متوفر عند طلب عرض السعر',
      },
      {
        key: 'dimensions',
        labelEn: 'Dimensions & Weight',
        labelAr: 'الأبعاد والوزن والتخزين',
        valueEn: 'Available upon quote request',
        valueAr: 'متوفر عند طلب عرض السعر',
      },
      {
        key: 'features',
        labelEn: 'Interior, Safety & Tech',
        labelAr: 'الأمان والتجهيزات الداخلية',
        valueEn: 'Available upon quote request',
        valueAr: 'متوفر عند طلب عرض السعر',
      },
    ],
    images: [
      {
        src: warriorPandaFrontImg,
        angleEn: 'Front 3/4 Exterior View',
        angleAr: 'منظر أمامي جانبي',
      },
      {
        src: warriorPandaSideImg,
        angleEn: 'Side Profile Exterior View',
        angleAr: 'منظر جانبي كامل',
      },
    ],
    isPhotoMissing: false,
    photoNoteEn:
      'Sage-khaki 3-door rugged micro EV with matte black fender flares, front tow hooks, roof rack rails, and alloy wheels.',
    photoNoteAr:
      'سيارة كهربائية مدمجة 3 أبواب بلون أخضر كاكي مطفي مع أقواس عجلات سوداء وحامل سقف علوي وجنوط رياضية.',
  },
];
