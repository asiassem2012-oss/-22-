import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingBag,
  Phone,
  MapPin,
  Clock,
  Star,
  Plus,
  Minus,
  Trash2,
  Check,
  Search,
  SlidersHorizontal,
  Car,
  Truck,
  Utensils,
  ExternalLink,
  Copy,
  MessageCircle,
  X,
  Flame,
  Navigation,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Language,
  CategoryId,
  MenuItem,
  CATEGORIES,
  MENU_ITEMS,
  ADDON_CATALOG,
  CUSTOMER_REVIEWS,
  RESTAURANT_INFO,
  MANSOURA_AREAS,
  IMAGES,
} from './data/menuData';

export type FulfillmentType = 'delivery' | 'car_service' | 'dine_in';

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  variantId: string;
  variantLabelAr: string;
  variantLabelEn: string;
  unitBasePrice: number;
  spiceLevel: 'regular' | 'spicy';
  selectedAddonIds: string[];
  notes: string;
  quantity: number;
}

const SCHEDULE_SLOTS = [
  { id: 'asap', ar: 'الآن (تحضير فوري · 20–30 دقيقة)', en: 'ASAP (Immediate Prep · 20–30 mins)' },
  { id: '21:00', ar: 'مجدول — 09:00 مساءً', en: 'Scheduled — 09:00 PM' },
  { id: '22:30', ar: 'مجدول — 10:30 مساءً', en: 'Scheduled — 10:30 PM' },
  { id: '00:00', ar: 'مجدول — 12:00 منتصف الليل', en: 'Scheduled — 12:00 Midnight' },
  { id: '01:30', ar: 'مجدول — 01:30 بعد منتصف الليل', en: 'Scheduled — 01:30 AM' },
  { id: '02:30', ar: 'مجدول — 02:30 فجراً (سهرة شامي)', en: 'Scheduled — 02:30 AM (Late Night)' },
  { id: '03:30', ar: 'مجدول — 03:30 فجراً (قبل الإغلاق)', en: 'Scheduled — 03:30 AM (Last Call)' },
];

const LANDMARK_DISTANCES = [
  {
    id: 'civil_defense',
    nameAr: 'إدارة الدفاع المدني بشارع الترعة',
    nameEn: 'Civil Defense Dept. (El-Teraa St.)',
    timeAr: 'دقيقة واحدة مشياً (أمام الفرع مباشرة)',
    timeEn: '1 min walk (Directly opposite branch)',
    distanceAr: '25 متر',
    distanceEn: '25 m',
  },
  {
    id: 'mansoura_uni',
    nameAr: 'جامعة المنصورة (بوابة توشكى / جيهان)',
    nameEn: 'Mansoura University (Toshka / Jehan Gate)',
    timeAr: '6 دقائق بالسيارة أو الدليفري',
    timeEn: '6 mins by car or delivery',
    distanceAr: '2.1 كم',
    distanceEn: '2.1 km',
  },
  {
    id: 'governorate_sq',
    nameAr: 'ميدان المحافظة وشارع الجيش',
    nameEn: 'Governorate Square & El-Geish St.',
    timeAr: '8 دقائق بالسيارة أو الدليفري',
    timeEn: '8 mins by car or delivery',
    distanceAr: '2.8 كم',
    distanceEn: '2.8 km',
  },
  {
    id: 'mashaya',
    nameAr: 'المشاية السفلية ونادي الجزيرة',
    nameEn: 'Lower Mashaya & Gezira Club',
    timeAr: '9 دقائق بالسيارة أو الدليفري',
    timeEn: '9 mins by car or delivery',
    distanceAr: '3.2 كم',
    distanceEn: '3.2 km',
  },
];

function ResilientImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#261D18] via-[#1C1512] to-[#120E0C] text-[#D4A853] p-6 text-center ${className}`}
      >
        <Utensils className="w-8 h-8 mb-2 opacity-80" />
        <span className="text-xs text-[#F7F3EB]/80 font-medium line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const isAr = lang === 'ar';

  // Menu filters
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);

  // Active customization modal state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedSpice, setSelectedSpice] = useState<'regular' | 'spicy'>('regular');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [itemNotes, setItemNotes] = useState<string>('');
  const [modalQty, setModalQty] = useState<number>(1);

  // Cart & Checkout Drawer state
  const [cart, setCart] = useState<CartItem[]>([
    {
      cartItemId: 'initial-arabic-chicken',
      menuItem: MENU_ITEMS[0],
      variantId: 'single',
      variantLabelAr: 'وجبة عادي (8 قطع)',
      variantLabelEn: 'Regular (8 Bites)',
      unitBasePrice: 135,
      spiceLevel: 'regular',
      selectedAddonIds: ['extra_toum'],
      notes: '',
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('delivery');
  const [scheduleSlot, setScheduleSlot] = useState<string>('asap');

  // Customer checkout details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryArea, setDeliveryArea] = useState(MANSOURA_AREAS[0].ar);
  const [streetAddress, setStreetAddress] = useState('');
  const [carDetails, setCarDetails] = useState('');
  const [orderGeneralNotes, setOrderGeneralNotes] = useState('');

  // Feedback & Post-order receipt state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [confirmedOrderCode, setConfirmedOrderCode] = useState<string | null>(null);
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>('civil_defense');

  // Sync HTML direction and language
  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Open dish customization modal
  const openCustomizeModal = (item: MenuItem) => {
    setCustomizingItem(item);
    const defaultVar = item.variants && item.variants.length > 0 ? item.variants[0].id : 'std';
    setSelectedVariantId(defaultVar);
    setSelectedSpice('regular');
    setSelectedAddons([]);
    setItemNotes('');
    setModalQty(1);
  };

  // Quick 1-click add to cart with default options
  const handleQuickAdd = (item: MenuItem) => {
    const defaultVar = item.variants?.[0];
    const variantId = defaultVar ? defaultVar.id : 'std';
    const variantLabelAr = defaultVar ? defaultVar.labelAr : 'حجم أساسي';
    const variantLabelEn = defaultVar ? defaultVar.labelEn : 'Standard Size';
    const unitBasePrice = defaultVar ? defaultVar.price : item.basePrice;
    const cartItemId = `${item.id}-${variantId}-regular-none`;

    setCart((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItem: item,
          variantId,
          variantLabelAr,
          variantLabelEn,
          unitBasePrice,
          spiceLevel: 'regular',
          selectedAddonIds: [],
          notes: '',
          quantity: 1,
        },
      ];
    });

    showToast(
      isAr
        ? `تمت إضافة "${item.nameAr}" إلى سلة طلبك`
        : `Added "${item.nameEn}" to your order bag`
    );
  };

  // Confirm customized item into cart
  const handleConfirmCustomizedAdd = () => {
    if (!customizingItem) return;
    const chosenVariant = customizingItem.variants?.find((v) => v.id === selectedVariantId);
    const variantId = chosenVariant ? chosenVariant.id : 'std';
    const variantLabelAr = chosenVariant ? chosenVariant.labelAr : 'حجم أساسي';
    const variantLabelEn = chosenVariant ? chosenVariant.labelEn : 'Standard Size';
    const unitBasePrice = chosenVariant ? chosenVariant.price : customizingItem.basePrice;

    const sortedAddons = [...selectedAddons].sort().join(',');
    const cartItemId = `${customizingItem.id}-${variantId}-${selectedSpice}-${sortedAddons}-${itemNotes.trim()}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + modalQty } : i
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItem: customizingItem,
          variantId,
          variantLabelAr,
          variantLabelEn,
          unitBasePrice,
          spiceLevel: selectedSpice,
          selectedAddonIds: [...selectedAddons],
          notes: itemNotes.trim(),
          quantity: modalQty,
        },
      ];
    });

    const addedName = isAr ? customizingItem.nameAr : customizingItem.nameEn;
    setCustomizingItem(null);
    showToast(
      isAr
        ? `تمت إضافة ${modalQty} × "${addedName}" بالتخصيص المختار`
        : `Added ${modalQty} × "${addedName}" with your customizations`
    );
  };

  const updateCartQty = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getCartItemUnitTotal = (item: CartItem) => {
    const addonsSum = item.selectedAddonIds.reduce((sum, id) => {
      const found = ADDON_CATALOG.find((a) => a.id === id);
      return sum + (found ? found.price : 0);
    }, 0);
    return item.unitBasePrice + addonsSum;
  };

  const cartTotalCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + getCartItemUnitTotal(item) * item.quantity, 0),
    [cart]
  );

  const deliveryFee = fulfillment === 'delivery' ? (cartSubtotal >= 300 ? 0 : 20) : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  // Filtered menu items
  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
      const matchesBestseller = !onlyBestsellers || Boolean(item.signatureTagAr);
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.nameAr.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.descriptionAr.toLowerCase().includes(q) ||
        item.descriptionEn.toLowerCase().includes(q);
      return matchesCategory && matchesBestseller && matchesQuery;
    });
  }, [activeCategory, searchQuery, onlyBestsellers]);

  // Calculate current modal total price
  const currentModalUnitTotal = useMemo(() => {
    if (!customizingItem) return 0;
    const chosenVariant = customizingItem.variants?.find((v) => v.id === selectedVariantId);
    const base = chosenVariant ? chosenVariant.price : customizingItem.basePrice;
    const addonsSum = selectedAddons.reduce((sum, id) => {
      const found = ADDON_CATALOG.find((a) => a.id === id);
      return sum + (found ? found.price : 0);
    }, 0);
    return base + addonsSum;
  }, [customizingItem, selectedVariantId, selectedAddons]);

  // Build formatted WhatsApp Order Text for 01070283060
  const whatsappMessageText = useMemo(() => {
    const slotObj = SCHEDULE_SLOTS.find((s) => s.id === scheduleSlot) || SCHEDULE_SLOTS[0];
    const fulfillmentLabel =
      fulfillment === 'delivery'
        ? 'توصيل بدون تلامس للمنزل (Home Delivery)'
        : fulfillment === 'car_service'
        ? 'توصيل إلى السيارة أمام الدفاع المدني (Car Curbside Service)'
        : 'استلام من الفرع / جلوس بالمطعم (Dine-in / Takeaway)';

    const lines: string[] = [
      `🔥 *طلب جديد — مطعم روح دمشق (Rooh Damascus)*`,
      `────────────────────`,
      `📍 *طريقة الاستلام:* ${fulfillmentLabel}`,
      `⏰ *موعد الطلب:* ${slotObj.ar}`,
    ];

    if (customerName.trim()) {
      lines.push(`👤 *العميل:* ${customerName.trim()}`);
    }
    if (customerPhone.trim()) {
      lines.push(`📞 *رقم الهاتف:* ${customerPhone.trim()}`);
    }

    if (fulfillment === 'delivery') {
      lines.push(`🏙️ *المنطقة بالمنصورة:* ${deliveryArea}`);
      if (streetAddress.trim()) {
        lines.push(`🏠 *العنوان التفصيلي:* ${streetAddress.trim()}`);
      }
    } else if (fulfillment === 'car_service') {
      lines.push(
        `🚗 *بيانات السيارة (أمام الدفاع المدني - شارع الترعة):* ${
          carDetails.trim() || 'سيتم التوضيح عند الوصول'
        }`
      );
    }

    lines.push(`────────────────────`);
    lines.push(`🥙 *تفاصيل الوجبات:*`);

    cart.forEach((item, idx) => {
      const unitPrice = getCartItemUnitTotal(item);
      const lineTotal = unitPrice * item.quantity;
      const spiceText = item.menuItem.supportsSpice
        ? item.spiceLevel === 'spicy'
          ? 'حار 🌶️'
          : 'عادي'
        : '';
      const addonsNames = item.selectedAddonIds
        .map((id) => ADDON_CATALOG.find((a) => a.id === id)?.nameAr)
        .filter(Boolean)
        .join(' + ');

      lines.push(
        `${idx + 1}. *${item.quantity} × ${item.menuItem.nameAr}* (${item.variantLabelAr}${
          spiceText ? ` · ${spiceText}` : ''
        }) = ${lineTotal} ج.م`
      );
      if (addonsNames) {
        lines.push(`   + إضافات: ${addonsNames}`);
      }
      if (item.notes) {
        lines.push(`   + ملاحظة: ${item.notes}`);
      }
    });

    lines.push(`────────────────────`);
    lines.push(`💵 مجموع الأصناف: ${cartSubtotal} ج.م`);
    if (fulfillment === 'delivery') {
      lines.push(
        `🛵 خدمة التوصيل: ${deliveryFee === 0 ? 'مجاناً (طلب فوق 300 ج.م)' : `${deliveryFee} ج.م`}`
      );
    }
    lines.push(`✨ *الإجمالي المطلوب:* ${grandTotal} ج.م`);

    if (orderGeneralNotes.trim()) {
      lines.push(`📝 *ملاحظات إضافية:* ${orderGeneralNotes.trim()}`);
    }

    return lines.join('\n');
  }, [
    cart,
    fulfillment,
    scheduleSlot,
    customerName,
    customerPhone,
    deliveryArea,
    streetAddress,
    carDetails,
    orderGeneralNotes,
    cartSubtotal,
    deliveryFee,
    grandTotal,
  ]);

  const whatsappHref = `https://wa.me/${RESTAURANT_INFO.whatsappIntl}?text=${encodeURIComponent(
    whatsappMessageText
  )}`;

  const handleCopyAndConfirmOrder = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessageText);
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 3000);
    } catch {
      // Fallback if clipboard permission denied in iframe
    }
    const randomOrderNum = `RD-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrderCode(randomOrderNum);
  };

  const activeLandmark =
    LANDMARK_DISTANCES.find((l) => l.id === selectedLandmarkId) || LANDMARK_DISTANCES[0];

  return (
    <div className="min-h-screen bg-[#120F0D] text-[#F7F3EB] flex flex-col selection:bg-[#D4A853]/30">
      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1F1915] border border-[#D4A853]/40 text-[#F7F3EB] px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-sm whitespace-nowrap transition-opacity duration-150"
        >
          <Check className="w-4 h-4 text-[#D4A853] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR CONTRACT: Strictly 3 Zones, Single Row, h-16 */}
      <header className="sticky top-0 z-40 h-16 bg-[#120F0D]/95 backdrop-blur-md border-b border-[#D4A853]/15 px-4 sm:px-8">
        <div className="max-w-[1360px] mx-auto h-full flex items-center justify-between gap-4">
          {/* Zone 1: Single Text Element Wordmark */}
          <a
            href="#top"
            className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#D4A853] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D4A853]"
          >
            {isAr ? 'روح دمشق' : 'Rooh Damascus'}
          </a>

          {/* Zone 2: 4 Clean Text Navigation Links */}
          <nav
            aria-label={isAr ? 'التنقل الرئيسي' : 'Main Navigation'}
            className="hidden md:flex items-center gap-8 text-sm font-medium text-[#D6CEC2]"
          >
            <a
              href="#menu"
              className="hover:text-[#D4A853] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              {isAr ? 'المنيو الرقمي' : 'Digital Menu'}
            </a>
            <a
              href="#fulfillment-modes"
              className="hover:text-[#D4A853] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              {isAr ? 'خدمات الاستلام' : 'Order Services'}
            </a>
            <a
              href="#reviews"
              className="hover:text-[#D4A853] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              {isAr ? 'آراء العملاء' : 'Guest Reviews'}
            </a>
            <a
              href="#branch"
              className="hover:text-[#D4A853] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              {isAr ? 'موقع الفرع' : 'Branch & Hours'}
            </a>
          </nav>

          {/* Zone 3: 2 Primary Actions (Language Toggle + Order Bag Trigger) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="px-3 py-2 text-xs font-semibold text-[#F7F3EB] bg-[#1E1915] hover:bg-[#2A221D] border border-[#D4A853]/25 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              aria-label={isAr ? 'Switch to English' : 'التحويل للعربية'}
            >
              {isAr ? 'EN' : 'عربي'}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#120F0D] bg-[#D4A853] hover:bg-[#E2B866] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'سلة الطلب' : 'Order Bag'}</span>
              <span className="font-mono-num font-bold">
                ({cartTotalCount} · {grandTotal} {isAr ? 'ج.م' : 'EGP'})
              </span>
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* SECTION 1: HERO & SERVICE ORCHESTRATION */}
        <section className="relative border-b border-[#D4A853]/12 overflow-hidden">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Hero Editorial Copy */}
              <div className="lg:col-span-6 space-y-6">
                {/* Clean Unboxed Metadata (Zero-Pill Rule) */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-[#D4A853] font-medium">
                  <span>{isAr ? 'مأكولات سورية وشامية أصيلة' : 'Authentic Damascus Cuisine'}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num text-[#F7F3EB]">
                    4.2 ★ ({RESTAURANT_INFO.reviewCount}+ {isAr ? 'تقييم Google' : 'Google Reviews'})
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{isAr ? 'مفتوح يومياً حتى 4:00 فجراً' : 'Open Daily Until 4:00 AM'}</span>
                </div>

                <h1
                  className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#F7F3EB] leading-[1.18] tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  {isAr
                    ? 'نَفَس الشام الأصيل في قلب المنصورة، ساخن وطازج حتى الفجر.'
                    : 'Authentic Damascus Flavors in Mansoura, Fresh off the Flame Until 4 AM.'}
                </h1>

                <p className="text-base sm:text-lg text-[#C4B9AC] leading-relaxed max-w-[62ch]">
                  {isAr
                    ? 'شاورما سورية على السيخ بتتبيلة دمشقية عريقة، فتة شاورما بالعيش المحمص، ووجبات كريسبي ذهبية تُحضّر لحظة بلحظة في فرعنا بشارع الترعة أمام الدفاع المدني.'
                    : 'Flame-roasted Syrian chicken & beef shawarma wrapped in toasted saj bread, layered shawarma fatteh, and golden crispy platters prepared fresh on El-Teraa Street opposite Civil Defense.'}
                </p>

                {/* Unboxed Key Facts Line */}
                <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-[#A89D91]">
                  <span>
                    {isAr ? 'شارع الترعة (أمام الدفاع المدني)، أول المنصورة' : 'El-Teraa St. (Opposite Civil Defense), Mansoura'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">
                    {isAr ? `متوسط الفرد ${RESTAURANT_INFO.priceRangeAr}` : `Avg. ${RESTAURANT_INFO.priceRangeEn}`}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num text-[#D4A853]">
                    {isAr ? 'توصيل وخدمة سيارات: 01070283060' : 'Order Line: 01070283060'}
                  </span>
                </div>

                {/* Single Primary Focal CTA + Quiet Secondary Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                  <a
                    href="#menu"
                    className="px-6 py-3.5 bg-[#9E2A2B] hover:bg-[#B43233] text-[#F7F3EB] font-semibold text-sm sm:text-base rounded-lg transition-colors flex items-center gap-2.5 whitespace-nowrap shadow-lg"
                  >
                    <span>{isAr ? 'تصفح المنيو واطلب الآن' : 'Explore Menu & Order Online'}</span>
                    {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setFulfillment('car_service');
                      setIsCartOpen(true);
                    }}
                    className="px-5 py-3.5 bg-[#1C1714] hover:bg-[#261F1B] text-[#F7F3EB] border border-[#D4A853]/30 font-medium text-sm sm:text-base rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <Car className="w-4 h-4 text-[#D4A853]" />
                    <span>{isAr ? 'طلب توصيل للسيارة' : 'Curbside Car Order'}</span>
                  </button>

                  <a
                    href={`tel:${RESTAURANT_INFO.phoneDisplay}`}
                    className="px-4 py-3.5 text-sm font-mono-num text-[#D6CEC2] hover:text-[#D4A853] transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4 text-[#D4A853]" />
                    <span>{RESTAURANT_INFO.phoneDisplay}</span>
                  </a>
                </div>
              </div>

              {/* Hero Visual Showcase */}
              <div className="lg:col-span-6">
                <div className="relative rounded-xl overflow-hidden border border-[#D4A853]/20 bg-[#1A1512] shadow-2xl aspect-video">
                  <ResilientImage
                    src={IMAGES.heroFeast}
                    alt={
                      isAr
                        ? 'وليمة شاورما عربي دجاج ولحم من مطعم روح دمشق بالمنصورة'
                        : 'Rooh Damascus Arabic Shawarma Platter Feast'
                    }
                    className="w-full h-full object-cover"
                  />
                  {/* Measured contrast scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-7">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div>
                        <p className="text-xs text-[#D4A853] font-medium mb-1">
                          {isAr
                            ? 'وجبة شاورما عربي روح دمشق · تحضير طازج على الصاج'
                            : 'Signature Damascus Arabic Shawarma · Griddle Toasted'}
                        </p>
                        <p className="text-lg sm:text-xl font-display font-bold text-[#F7F3EB]">
                          {isAr
                            ? 'شاورما عربي دجاج ولحم مع الثومية الشامية ودبس الرمان'
                            : 'Arabic Chicken & Beef Bites with Garlic Toum & Pomegranate'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openCustomizeModal(MENU_ITEMS[0])}
                        className="px-4 py-2 bg-[#D4A853] hover:bg-[#E2B866] text-[#120F0D] font-semibold text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
                      >
                        {isAr ? 'اطلب الوجبة · 135 ج.م' : 'Order Platter · 135 EGP'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Fulfillment Mode Selector Bar */}
            <div
              id="fulfillment-modes"
              className="mt-10 pt-8 border-t border-[#D4A853]/12 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <button
                type="button"
                onClick={() => {
                  setFulfillment('delivery');
                  showToast(
                    isAr
                      ? 'تم تفعيل وضع: التوصيل بدون تلامس للمنزل'
                      : 'Selected mode: Contactless Home Delivery'
                  );
                }}
                className={`p-4 rounded-xl text-start transition-colors border cursor-pointer flex items-start gap-3.5 ${
                  fulfillment === 'delivery'
                    ? 'bg-[#1F1814] border-[#D4A853]'
                    : 'bg-[#171310] border-[#D4A853]/15 hover:border-[#D4A853]/40'
                }`}
              >
                <Truck className="w-5 h-5 text-[#D4A853] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-[#F7F3EB]">
                      {isAr ? 'توصيل سريع بدون تلامس' : 'Contactless Home Delivery'}
                    </span>
                    <span className="text-xs font-mono-num text-[#D4A853]">
                      {isAr ? 'حتى 4:00 ص' : 'Until 4:00 AM'}
                    </span>
                  </div>
                  <p className="text-xs text-[#A89D91] mt-1">
                    {isAr
                      ? 'يغطي شارع الترعة، حي الجامعة، المشاية، توريل وكافة أحياء المنصورة بتغليف حراري محكم.'
                      : 'Covers Teraa St., University District, Mashaya, Torell, and all Mansoura neighborhoods.'}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFulfillment('car_service');
                  showToast(
                    isAr
                      ? 'تم تفعيل وضع: الإيصال إلى السيارة أمام الدفاع المدني'
                      : 'Selected mode: Curbside Car Service'
                  );
                }}
                className={`p-4 rounded-xl text-start transition-colors border cursor-pointer flex items-start gap-3.5 ${
                  fulfillment === 'car_service'
                    ? 'bg-[#1F1814] border-[#D4A853]'
                    : 'bg-[#171310] border-[#D4A853]/15 hover:border-[#D4A853]/40'
                }`}
              >
                <Car className="w-5 h-5 text-[#D4A853] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-[#F7F3EB]">
                      {isAr ? 'الإيصال إلى السيارة (Car Service)' : 'Curbside Car Service'}
                    </span>
                    <span className="text-xs font-mono-num text-[#D4A853]">
                      {isAr ? 'بدون رسوم' : '0 EGP Fee'}
                    </span>
                  </div>
                  <p className="text-xs text-[#A89D91] mt-1">
                    {isAr
                      ? 'أرسل طلبك ورقم/لون سيارتك عبر الواتساب واستلم طلبك ساخناً أمام الدفاع المدني بشارع الترعة.'
                      : 'Send your order & car details via WhatsApp and receive it hot right outside our Teraa St. branch.'}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFulfillment('dine_in');
                  showToast(
                    isAr
                      ? 'تم تفعيل وضع: الجلوس داخل المطعم أو التيك أوي السريع'
                      : 'Selected mode: Dine-In / Express Takeaway'
                  );
                }}
                className={`p-4 rounded-xl text-start transition-colors border cursor-pointer flex items-start gap-3.5 ${
                  fulfillment === 'dine_in'
                    ? 'bg-[#1F1814] border-[#D4A853]'
                    : 'bg-[#171310] border-[#D4A853]/15 hover:border-[#D4A853]/40'
                }`}
              >
                <Utensils className="w-5 h-5 text-[#D4A853] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-[#F7F3EB]">
                      {isAr ? 'الجلوس داخل المكان / تيك أوي' : 'Dine-In & Express Pickup'}
                    </span>
                    <span className="text-xs font-mono-num text-[#D4A853]">
                      {isAr ? 'تحضير مسبق' : 'Pre-Order'}
                    </span>
                  </div>
                  <p className="text-xs text-[#A89D91] mt-1">
                    {isAr
                      ? 'صالة جلوس بأجواء دمشقية دافئة أو تجهيز مسبق للطلب لتستلمه فور وصولك للفرع دون انتظار.'
                      : 'Warm Syrian dining hall or pre-scheduled takeaway ready the moment you arrive.'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE DIGITAL MENU */}
        <section id="menu" className="py-12 lg:py-16 border-b border-[#D4A853]/12">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <p className="text-xs sm:text-sm text-[#D4A853] font-medium mb-1.5">
                  {isAr
                    ? '01. المنيو الرقمي التفاعلي · أسعار تناسب الجميع (35 – 195 ج.م)'
                    : '01. Interactive Digital Menu · Honest Pricing (35 – 195 EGP)'}
                </p>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#F7F3EB]">
                  {isAr ? 'أشهى الأطباق الدمشقية والغربية' : 'Damascus Specialties & Crispy Platters'}
                </h2>
              </div>

              {/* Search & Bestseller Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative min-w-[240px] sm:min-w-[280px]">
                  <Search className="w-4 h-4 text-[#A89D91] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isAr
                        ? 'ابحث عن شاورما، فتة، كريسبي، كبة...'
                        : 'Search shawarma, fatteh, crispy...'
                    }
                    className="w-full ps-10 pe-4 py-2.5 text-sm bg-[#1A1512] border border-[#D4A853]/20 rounded-lg text-[#F7F3EB] placeholder-[#8A7E72] focus:outline-none focus:border-[#D4A853]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setOnlyBestsellers((prev) => !prev)}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-center gap-2 ${
                    onlyBestsellers
                      ? 'bg-[#D4A853] text-[#120F0D] border-[#D4A853] font-semibold'
                      : 'bg-[#1A1512] text-[#D6CEC2] border-[#D4A853]/20 hover:border-[#D4A853]/50'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{isAr ? 'الأكثر طلباً فقط' : 'Bestsellers Only'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Category Filter Bar (Segmented Functional Buttons) */}
            <div
              role="tablist"
              aria-label={isAr ? 'تصنيفات المنيو' : 'Menu Categories'}
              className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-[#D4A853]/12 no-scrollbar"
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#9E2A2B] text-[#F7F3EB] font-semibold shadow-sm'
                        : 'bg-[#1A1512] text-[#C4B9AC] hover:text-[#F7F3EB] hover:bg-[#241D19]'
                    }`}
                  >
                    <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                    <span className="font-mono-num text-xs opacity-75">({cat.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Menu Grid: 3 Columns Desktop, 2 Tablet, 1 Mobile */}
            {filteredMenu.length === 0 ? (
              <div className="bg-[#181310] border border-[#D4A853]/15 rounded-xl p-12 text-center space-y-4">
                <p className="text-base text-[#C4B9AC]">
                  {isAr
                    ? 'لا توجد أطباق مطابقة لبحثك الحالي.'
                    : 'No dishes match your current filter criteria.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                    setOnlyBestsellers(false);
                  }}
                  className="px-4 py-2 bg-[#D4A853] text-[#120F0D] text-xs font-semibold rounded-lg cursor-pointer"
                >
                  {isAr ? 'عرض كل الأصناف' : 'Reset Menu Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredMenu.map((item) => (
                  <article
                    key={item.id}
                    className="group bg-[#181310] border border-[#D4A853]/15 hover:border-[#D4A853]/40 rounded-xl overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5"
                  >
                    {/* Card Imagery (4:3 ratio, clean backdrop) */}
                    <div
                      onClick={() => openCustomizeModal(item)}
                      className="relative aspect-[4/3] w-full bg-[#120E0C] overflow-hidden cursor-pointer"
                    >
                      <ResilientImage
                        src={item.image}
                        alt={isAr ? item.nameAr : item.nameEn}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#181310] via-transparent to-transparent opacity-65" />
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        {/* Unboxed Quiet Metadata Line (Zero-Pill Discipline) */}
                        <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#A89D91]">
                          <span className="text-[#D4A853] font-medium">
                            {isAr ? item.categoryLabelAr : item.categoryLabelEn}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{isAr ? item.servingMetaAr : item.servingMetaEn}</span>
                          {item.signatureTagAr && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#E6B85C] font-medium">
                                {isAr ? item.signatureTagAr : item.signatureTagEn}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Dish Name & Tabular Price */}
                        <div className="flex items-baseline justify-between gap-3 pt-0.5">
                          <h3
                            onClick={() => openCustomizeModal(item)}
                            className="text-base sm:text-lg font-semibold text-[#F7F3EB] group-hover:text-[#D4A853] transition-colors cursor-pointer"
                          >
                            {isAr ? item.nameAr : item.nameEn}
                          </h3>
                          <span className="font-mono-num text-base sm:text-lg font-bold text-[#D4A853] whitespace-nowrap shrink-0">
                            {item.basePrice} {isAr ? 'ج.م' : 'EGP'}
                          </span>
                        </div>

                        {/* Dish Description */}
                        <p className="text-xs sm:text-sm text-[#B8ADA0] leading-relaxed line-clamp-2">
                          {isAr ? item.descriptionAr : item.descriptionEn}
                        </p>
                      </div>

                      {/* Customization hint & Action Buttons */}
                      <div className="pt-3 border-t border-[#D4A853]/10 flex items-center justify-between gap-2.5">
                        <button
                          type="button"
                          onClick={() => openCustomizeModal(item)}
                          className="flex-1 py-2.5 px-3.5 bg-[#231C18] hover:bg-[#2E2520] text-[#F7F3EB] border border-[#D4A853]/25 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4A853] shrink-0" />
                          <span>
                            {isAr ? 'تخصيص وإضافة للسلة' : 'Customize & Add'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item)}
                          title={isAr ? 'إضافة سريعة للسلة' : 'Quick add to bag'}
                          aria-label={isAr ? `إضافة سريعة ${item.nameAr}` : `Quick add ${item.nameEn}`}
                          className="p-2.5 bg-[#9E2A2B] hover:bg-[#B83334] text-[#F7F3EB] rounded-lg transition-colors shrink-0 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: GUEST REVIEWS & QUANTITATIVE PROOF (4.2 ★ / 834 REVIEWS) */}
        <section id="reviews" className="py-12 lg:py-16 border-b border-[#D4A853]/12 bg-[#15110E]">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Quantitative Rating Breakdown */}
              <div className="lg:col-span-4 space-y-5 bg-[#1B1612] border border-[#D4A853]/15 rounded-xl p-6">
                <div className="space-y-1">
                  <p className="text-xs text-[#D4A853] font-medium">
                    {isAr ? '02. ثقة عملاء المنصورة' : '02. Verified Local Trust'}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F7F3EB]">
                    {isAr ? 'تقييمات خرائط جوجل' : 'Google Maps Ratings'}
                  </h2>
                </div>

                <div className="flex items-baseline gap-4 pt-1">
                  <span className="font-mono-num text-5xl font-bold text-[#D4A853]">
                    {RESTAURANT_INFO.rating}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[#D4A853]">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 opacity-40 fill-current" />
                    </div>
                    <p className="text-xs text-[#A89D91] font-mono-num">
                      {isAr
                        ? `بناءً على أكثر من ${RESTAURANT_INFO.reviewCount} تقييم موثق`
                        : `Based on ${RESTAURANT_INFO.reviewCount}+ verified Google reviews`}
                    </p>
                  </div>
                </div>

                {/* Tabular Rating Distribution Bars */}
                <div className="space-y-2.5 pt-2 border-t border-[#D4A853]/10 text-xs font-mono-num">
                  {[
                    { stars: 5, pct: 64 },
                    { stars: 4, pct: 21 },
                    { stars: 3, pct: 9 },
                    { stars: 2, pct: 4 },
                    { stars: 1, pct: 2 },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <span className="w-8 text-[#C4B9AC]">{row.stars} ★</span>
                      <div className="flex-1 h-2 bg-[#120F0D] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D4A853] rounded-full"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="w-9 text-end text-[#A89D91]">{row.pct}%</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-xs text-[#B8ADA0] space-y-1">
                  <p>
                    {isAr
                      ? 'أبرز نقاط الإشادة: تتبيلة الشاورما الشامية الأصيلة · الثومية الكريمية · سرعة خدمة السيارات أمام الدفاع المدني · العمل حتى 4:00 فجراً.'
                      : 'Top Praised Highlights: Authentic Damascus shawarma spice · Creamy garlic toum · Fast Teraa St. car service · Open until 4:00 AM.'}
                  </p>
                </div>
              </div>

              {/* Attributable Customer Testimonials */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {CUSTOMER_REVIEWS.map((rev) => (
                  <blockquote
                    key={rev.id}
                    className="bg-[#1B1612] border border-[#D4A853]/15 rounded-xl p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs text-[#D4A853] font-mono-num">
                        <span>{'★'.repeat(rev.rating)}</span>
                        <span className="text-[#A89D91] font-sans">
                          {isAr ? rev.dateAr : rev.dateEn}
                        </span>
                      </div>

                      <p className="text-sm text-[#F7F3EB] leading-relaxed">
                        "{isAr ? rev.commentAr : rev.commentEn}"
                      </p>
                    </div>

                    <footer className="pt-3 border-t border-[#D4A853]/10 space-y-1">
                      <div className="font-semibold text-sm text-[#D4A853]">
                        {isAr ? rev.authorAr : rev.authorEn}
                      </div>
                      <div className="text-xs text-[#A89D91]">
                        {isAr ? rev.roleAr : rev.roleEn}
                      </div>
                      <div className="text-[11px] text-[#8E8275] pt-0.5">
                        {isAr ? rev.OrderContextAr : rev.OrderContextEn}
                      </div>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: BRANCH LOCATION, HOURS & INTERACTIVE ACCESS GUIDE */}
        <section id="branch" className="py-12 lg:py-16">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Branch Info & Direct Actions */}
              <div className="lg:col-span-6 bg-[#181310] border border-[#D4A853]/15 rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-[#D4A853] font-medium mb-1">
                      {isAr ? '03. الفرع والوصول المباشر' : '03. Branch Location & Access'}
                    </p>
                    <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#F7F3EB]">
                      {isAr
                        ? 'فرع شارع الترعة — أمام الدفاع المدني'
                        : 'El-Teraa Street Branch — Opposite Civil Defense'}
                    </h2>
                  </div>

                  <div className="space-y-4 text-sm text-[#D6CEC2]">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#D4A853] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-[#F7F3EB]">
                          {isAr ? 'العنوان التفصيلي:' : 'Detailed Address:'}
                        </div>
                        <p className="text-[#B8ADA0] mt-0.5">
                          {isAr ? RESTAURANT_INFO.addressAr : RESTAURANT_INFO.addressEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#D4A853] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-[#F7F3EB]">
                          {isAr ? 'ساعات العمل اليومية:' : 'Daily Operating Hours:'}
                        </div>
                        <p className="text-[#B8ADA0] mt-0.5">
                          {isAr
                            ? 'نعمل يومياً طوال الأسبوع حتى الساعة 4:00 صباحاً (شامل طلبات السهر والفجر).'
                            : 'Open 7 days a week until 4:00 AM (including late-night dining and delivery).'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#D4A853] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-[#F7F3EB]">
                          {isAr ? 'الخط المباشر للطلبات والواتساب:' : 'Direct Order & WhatsApp Line:'}
                        </div>
                        <p className="font-mono-num text-[#D4A853] text-base font-bold mt-0.5">
                          {RESTAURANT_INFO.phoneDisplay}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch CTA Buttons */}
                <div className="pt-4 border-t border-[#D4A853]/12 flex flex-wrap items-center gap-3">
                  <a
                    href={RESTAURANT_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-[#D4A853] hover:bg-[#E2B866] text-[#120F0D] font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{isAr ? 'افتح الموقع على خرائط جوجل' : 'Open in Google Maps'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`tel:${RESTAURANT_INFO.phoneDisplay}`}
                    className="px-5 py-3 bg-[#241E1A] hover:bg-[#2F2722] text-[#F7F3EB] border border-[#D4A853]/25 font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4 text-[#D4A853]" />
                    <span>{isAr ? 'اتصال مباشر بالفرع' : 'Call Branch Directly'}</span>
                  </a>
                </div>
              </div>

              {/* Interactive Mansoura Landmarks & Distance Estimator */}
              <div className="lg:col-span-6 bg-[#181310] border border-[#D4A853]/15 rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F7F3EB]">
                      {isAr
                        ? 'دليل الوصول السريع وزمن التوصيل بالمنصورة'
                        : 'Mansoura Landmark Distance & ETA Guide'}
                    </h3>
                    <span className="text-xs font-mono-num text-[#D4A853]">
                      {isAr ? 'أول المنصورة' : 'Awal El-Mansoura'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#A89D91]">
                    {isAr
                      ? 'اختر أقرب معلم إليك في المنصورة لمعرفة المسافة والوقت التقديري للوصول أو التوصيل:'
                      : 'Select a nearby Mansoura landmark to check estimated distance and delivery/drive time:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {LANDMARK_DISTANCES.map((item) => {
                      const active = item.id === selectedLandmarkId;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedLandmarkId(item.id)}
                          className={`p-3.5 rounded-lg text-start border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#251D18] border-[#D4A853] text-[#F7F3EB]'
                              : 'bg-[#130F0D] border-[#D4A853]/12 text-[#B8ADA0] hover:border-[#D4A853]/35'
                          }`}
                        >
                          <div className="text-xs sm:text-sm font-semibold line-clamp-1">
                            {isAr ? item.nameAr : item.nameEn}
                          </div>
                          <div className="text-xs text-[#D4A853] font-mono-num mt-1">
                            {isAr ? item.distanceAr : item.distanceEn}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Landmark Live Readout */}
                <div className="p-4 rounded-lg bg-[#120F0D] border border-[#D4A853]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-[#A89D91]">
                      {isAr ? 'المسار المختار إلى روح دمشق:' : 'Selected Route to Rooh Damascus:'}
                    </div>
                    <div className="text-sm font-semibold text-[#F7F3EB]">
                      {isAr ? activeLandmark.nameAr : activeLandmark.nameEn}
                    </div>
                    <div className="text-xs text-[#D4A853]">
                      {isAr ? activeLandmark.timeAr : activeLandmark.timeEn}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="px-4 py-2.5 bg-[#9E2A2B] hover:bg-[#B83334] text-[#F7F3EB] text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isAr ? 'نسّق طلبك الآن' : 'Start Your Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* CLEAN EDITORIAL FOOTER */}
      <footer className="bg-[#0E0B09] border-t border-[#D4A853]/15 py-10 px-4 sm:px-8">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="font-display text-2xl font-bold text-[#D4A853]">
              {isAr ? 'مطعم روح دمشق — Rooh Damascus' : 'Rooh Damascus Syrian Restaurant'}
            </div>
            <p className="text-xs text-[#A89D91]">
              {isAr
                ? 'شارع الترعة (أمام الدفاع المدني)، أول المنصورة، محافظة الدقهلية · يعمل يومياً حتى 4:00 صباحاً'
                : 'El-Teraa St. (Opposite Civil Defense), Awal El-Mansoura, Dakahlia · Open Daily Until 4:00 AM'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#C4B9AC]">
            <a href="#menu" className="hover:text-[#D4A853] transition-colors">
              {isAr ? 'المنيو الرقمي' : 'Digital Menu'}
            </a>
            <a href="#reviews" className="hover:text-[#D4A853] transition-colors">
              {isAr ? 'تقييمات جوجل (4.2 ★)' : 'Google Reviews (4.2 ★)'}
            </a>
            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4A853] transition-colors"
            >
              {isAr ? 'خرائط جوجل' : 'Google Maps'}
            </a>
            <a
              href={`tel:${RESTAURANT_INFO.phoneDisplay}`}
              className="font-mono-num text-[#D4A853] font-semibold hover:underline"
            >
              {RESTAURANT_INFO.phoneDisplay}
            </a>
          </div>

          <div className="text-xs text-[#7D7267]">
            © {new Date().getFullYear()} {isAr ? 'روح دمشق بالمنصورة. جميع الحقوق محفوظة.' : 'Rooh Damascus Mansoura. All rights reserved.'}
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY BOTTOM CHECKOUT BAR (Strictly ≤ 15% viewport height combined with header) */}
      {cartTotalCount > 0 && !isCartOpen && (
        <div className="md:hidden sticky bottom-0 z-30 h-14 bg-[#1A1411]/95 backdrop-blur-md border-t border-[#D4A853]/30 px-4 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-[#A89D91]">{isAr ? 'سلة طلبك:' : 'Your Bag:'} </span>
            <span className="font-mono-num font-bold text-[#F7F3EB]">
              {cartTotalCount} {isAr ? 'أصناف' : 'items'} · {grandTotal} {isAr ? 'ج.م' : 'EGP'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 bg-[#D4A853] text-[#120F0D] font-semibold text-xs rounded-lg whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAr ? 'إتمام الطلب عبر واتساب' : 'Checkout via WhatsApp'}</span>
          </button>
        </div>
      )}

      {/* DISH CUSTOMIZATION MODAL */}
      {customizingItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="customize-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div className="bg-[#181310] border border-[#D4A853]/30 rounded-t-2xl sm:rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="relative h-44 sm:h-52 bg-[#120E0C] shrink-0">
              <ResilientImage
                src={customizingItem.image}
                alt={isAr ? customizingItem.nameAr : customizingItem.nameEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181310] via-[#181310]/40 to-transparent" />
              <button
                type="button"
                onClick={() => setCustomizingItem(null)}
                aria-label={isAr ? 'إغلاق' : 'Close'}
                className="absolute top-4 end-4 w-9 h-9 rounded-full bg-black/65 text-[#F7F3EB] hover:bg-black flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 start-5 end-5">
                <p className="text-xs text-[#D4A853] font-medium">
                  {isAr ? customizingItem.categoryLabelAr : customizingItem.categoryLabelEn}
                </p>
                <h3
                  id="customize-modal-title"
                  className="font-display text-xl sm:text-2xl font-bold text-[#F7F3EB]"
                >
                  {isAr ? customizingItem.nameAr : customizingItem.nameEn}
                </h3>
              </div>
            </div>

            {/* Modal Scrollable Options */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              <p className="text-xs sm:text-sm text-[#B8ADA0]">
                {isAr ? customizingItem.descriptionAr : customizingItem.descriptionEn}
              </p>

              {/* 1. Size / Variant Selection */}
              {customizingItem.variants && customizingItem.variants.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#D4A853]">
                    <span>{isAr ? 'اختر الحجم أو نوع الوجبة:' : 'Select Portion / Variant:'}</span>
                    <span>{isAr ? 'مطلوب' : 'Required'}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {customizingItem.variants.map((v) => {
                      const active = selectedVariantId === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`p-3 rounded-lg border text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#261E19] border-[#D4A853] text-[#F7F3EB] font-semibold'
                              : 'bg-[#130F0D] border-[#D4A853]/15 text-[#C4B9AC] hover:border-[#D4A853]/40'
                          }`}
                        >
                          <span>{isAr ? v.labelAr : v.labelEn}</span>
                          <span className="font-mono-num text-[#D4A853]">
                            {v.price} {isAr ? 'ج.م' : 'EGP'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Spice Preference (Normal / Spicy) */}
              {customizingItem.supportsSpice && (
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-[#D4A853]">
                    {isAr ? 'درجة الحرارة والتتبيلة:' : 'Spice Preference:'}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedSpice('regular')}
                      className={`py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                        selectedSpice === 'regular'
                          ? 'bg-[#261E19] border-[#D4A853] text-[#F7F3EB]'
                          : 'bg-[#130F0D] border-[#D4A853]/15 text-[#A89D91]'
                      }`}
                    >
                      <span>{isAr ? 'عادي (تتبيلة شامية متوازنة)' : 'Regular (Mild Damascus)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSpice('spicy')}
                      className={`py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                        selectedSpice === 'spicy'
                          ? 'bg-[#9E2A2B]/30 border-[#E05353] text-[#F7F3EB]'
                          : 'bg-[#130F0D] border-[#D4A853]/15 text-[#A89D91]'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 text-[#E05353]" />
                      <span>{isAr ? 'حار سبايسي (محمرة / شطة)' : 'Spicy (Hot Chili / Muhammara)'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Extra Syrian Add-ons */}
              {customizingItem.availableAddons.length > 0 && (
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-[#D4A853]">
                    {isAr ? 'إضافات شامية اختيارية:' : 'Optional Syrian Add-ons:'}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {customizingItem.availableAddons.map((addonId) => {
                      const addon = ADDON_CATALOG.find((a) => a.id === addonId);
                      if (!addon) return null;
                      const isChecked = selectedAddons.includes(addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() =>
                            setSelectedAddons((prev) =>
                              prev.includes(addon.id)
                                ? prev.filter((id) => id !== addon.id)
                                : [...prev, addon.id]
                            )
                          }
                          className={`p-2.5 rounded-lg border text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                            isChecked
                              ? 'bg-[#261E19] border-[#D4A853] text-[#F7F3EB]'
                              : 'bg-[#130F0D] border-[#D4A853]/12 text-[#B8ADA0]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border ${
                                isChecked
                                  ? 'bg-[#D4A853] border-[#D4A853] text-[#120F0D]'
                                  : 'border-[#A89D91]/50'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>{isAr ? addon.nameAr : addon.nameEn}</span>
                          </div>
                          <span className="font-mono-num text-xs text-[#D4A853]">
                            +{addon.price} {isAr ? 'ج.م' : 'EGP'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Special Dish Note */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#A89D91]">
                  {isAr ? 'ملاحظات خاصة على الطبق (اختياري):' : 'Special Instructions (Optional):'}
                </label>
                <input
                  type="text"
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مثال: تحميص زيادة للعيش الصاج، بدون مخلل...'
                      : 'e.g., Extra toasted saj bread, no pickles...'
                  }
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#120F0D] border border-[#D4A853]/20 rounded-lg text-[#F7F3EB] placeholder-[#7D7267] focus:outline-none focus:border-[#D4A853]"
                />
              </div>
            </div>

            {/* Modal Contiguous Purchase Footer */}
            <div className="p-4 bg-[#120F0D] border-t border-[#D4A853]/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-[#1C1714] border border-[#D4A853]/25 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded flex items-center justify-center text-[#F7F3EB] hover:bg-[#2A221D] cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-mono-num text-sm font-bold">{modalQty}</span>
                <button
                  type="button"
                  onClick={() => setModalQty((q) => q + 1)}
                  className="w-8 h-8 rounded flex items-center justify-center text-[#F7F3EB] hover:bg-[#2A221D] cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleConfirmCustomizedAdd}
                className="flex-1 py-3 px-5 bg-[#D4A853] hover:bg-[#E2B866] text-[#120F0D] font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{isAr ? 'إضافة إلى سلة الطلب' : 'Add to Order Bag'}</span>
                <span className="font-mono-num">
                  {currentModalUnitTotal * modalQty} {isAr ? 'ج.م' : 'EGP'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER CART & WHATSAPP DISPATCH DRAWER */}
      {isCartOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? 'سلة الطلبات وتنسيق التوصيل' : 'Order Bag & Delivery Coordination'}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
        >
          <div className="bg-[#16120F] border-s border-[#D4A853]/25 w-full max-w-lg h-full flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#D4A853]/15 flex items-center justify-between bg-[#120F0D]">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#D4A853]">
                  {isAr ? 'سلة طلبات روح دمشق' : 'Rooh Damascus Order Bag'}
                </h2>
                <p className="text-xs text-[#A89D91]">
                  {isAr
                    ? 'نسّق طلبك وأرسله مباشرة عبر الواتساب إلى 01070283060'
                    : 'Coordinate your order & dispatch directly via WhatsApp to 01070283060'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-lg bg-[#1F1915] text-[#F7F3EB] hover:bg-[#2B231E] flex items-center justify-center cursor-pointer"
                aria-label={isAr ? 'إغلاق السلة' : 'Close Bag'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Cart Items & Fulfillment Coordination Form */}
            <div className="p-5 overflow-y-auto flex-1 space-y-6">
              {confirmedOrderCode && (
                <div className="p-4 rounded-xl bg-[#1A261E] border border-[#4CAF50]/40 text-[#E8F5E9] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#81C784]">
                      {isAr
                        ? `تم تجهيز الفاتورة رقم #${confirmedOrderCode}`
                        : `Order Receipt #${confirmedOrderCode} Ready`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setConfirmedOrderCode(null)}
                      className="text-xs underline opacity-75 hover:opacity-100 cursor-pointer"
                    >
                      {isAr ? 'إخفاء' : 'Dismiss'}
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {isAr
                      ? 'تم نسخ تفاصيل طلبك المجدول! اضغط على زر "إرسال عبر واتساب الآن" بالأسفل لإرساله مباشرة لفرع شارع الترعة (01070283060).'
                      : 'Your formatted order has been copied! Click "Send via WhatsApp Now" below to dispatch directly to 01070283060.'}
                  </p>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <ShoppingBag className="w-10 h-10 text-[#D4A853]/50 mx-auto" />
                  <p className="text-sm text-[#A89D91]">
                    {isAr ? 'سلة طلباتك فارغة حالياً.' : 'Your order bag is currently empty.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 bg-[#D4A853] text-[#120F0D] text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    {isAr ? 'تصفح الأصناف الشامية' : 'Browse Syrian Menu'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Itemized List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-[#D4A853]">
                        {isAr ? 'الأصناف المختارة:' : 'Selected Dishes:'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCart([])}
                        className="text-xs text-[#E05353] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{isAr ? 'إفراغ السلة' : 'Clear All'}</span>
                      </button>
                    </div>

                    {cart.map((item) => {
                      const unitTotal = getCartItemUnitTotal(item);
                      const addonsText = item.selectedAddonIds
                        .map((id) => {
                          const found = ADDON_CATALOG.find((a) => a.id === id);
                          return found ? (isAr ? found.nameAr : found.nameEn) : null;
                        })
                        .filter(Boolean)
                        .join(' · ');

                      return (
                        <div
                          key={item.cartItemId}
                          className="p-3.5 rounded-xl bg-[#1E1814] border border-[#D4A853]/15 flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="text-sm font-semibold text-[#F7F3EB]">
                              {isAr ? item.menuItem.nameAr : item.menuItem.nameEn}
                            </div>
                            <div className="text-xs text-[#A89D91]">
                              {isAr ? item.variantLabelAr : item.variantLabelEn}
                              {item.menuItem.supportsSpice && (
                                <>
                                  {' · '}
                                  <span
                                    className={
                                      item.spiceLevel === 'spicy' ? 'text-[#E05353]' : 'text-[#D4A853]'
                                    }
                                  >
                                    {item.spiceLevel === 'spicy'
                                      ? isAr
                                        ? 'حار سبايسي'
                                        : 'Spicy'
                                      : isAr
                                      ? 'عادي'
                                      : 'Regular'}
                                  </span>
                                </>
                              )}
                            </div>
                            {addonsText && (
                              <div className="text-[11px] text-[#D4A853]">+ {addonsText}</div>
                            )}
                            {item.notes && (
                              <div className="text-[11px] text-[#8E8275]">"{item.notes}"</div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="font-mono-num text-sm font-bold text-[#D4A853]">
                              {unitTotal * item.quantity} {isAr ? 'ج.م' : 'EGP'}
                            </span>
                            <div className="flex items-center gap-1.5 bg-[#120F0D] border border-[#D4A853]/20 rounded-lg px-1.5 py-0.5">
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.cartItemId, -1)}
                                className="w-6 h-6 flex items-center justify-center text-[#C4B9AC] hover:text-[#F7F3EB] cursor-pointer"
                                aria-label="Decrease"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono-num text-xs font-bold w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.cartItemId, 1)}
                                className="w-6 h-6 flex items-center justify-center text-[#C4B9AC] hover:text-[#F7F3EB] cursor-pointer"
                                aria-label="Increase"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Step 2: Fulfillment Mode Selection */}
                  <div className="space-y-3 pt-2 border-t border-[#D4A853]/15">
                    <label className="block text-xs font-semibold text-[#D4A853]">
                      {isAr ? 'طريقة استلام الطلب:' : 'Fulfillment Method:'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFulfillment('delivery')}
                        className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 cursor-pointer ${
                          fulfillment === 'delivery'
                            ? 'bg-[#261E19] border-[#D4A853] text-[#F7F3EB]'
                            : 'bg-[#120F0D] border-[#D4A853]/15 text-[#A89D91]'
                        }`}
                      >
                        <Truck className="w-4 h-4 text-[#D4A853]" />
                        <span>{isAr ? 'توصيل للمنزل' : 'Delivery'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFulfillment('car_service')}
                        className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 cursor-pointer ${
                          fulfillment === 'car_service'
                            ? 'bg-[#261E19] border-[#D4A853] text-[#F7F3EB]'
                            : 'bg-[#120F0D] border-[#D4A853]/15 text-[#A89D91]'
                        }`}
                      >
                        <Car className="w-4 h-4 text-[#D4A853]" />
                        <span>{isAr ? 'توصيل للسيارة' : 'Car Service'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFulfillment('dine_in')}
                        className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 cursor-pointer ${
                          fulfillment === 'dine_in'
                            ? 'bg-[#261E19] border-[#D4A853] text-[#F7F3EB]'
                            : 'bg-[#120F0D] border-[#D4A853]/15 text-[#A89D91]'
                        }`}
                      >
                        <Utensils className="w-4 h-4 text-[#D4A853]" />
                        <span>{isAr ? 'تيك أوي / صالة' : 'Takeaway'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 3: Schedule Time Slot (Up to 4:00 AM) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#D4A853]">
                      {isAr ? 'توقيت تحضير / جدولة الطلب:' : 'Order Timing / Schedule:'}
                    </label>
                    <select
                      value={scheduleSlot}
                      onChange={(e) => setScheduleSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#120F0D] border border-[#D4A853]/25 rounded-lg text-[#F7F3EB] focus:outline-none focus:border-[#D4A853]"
                    >
                      {SCHEDULE_SLOTS.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {isAr ? slot.ar : slot.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Step 4: Customer & Location Details */}
                  <div className="space-y-3 pt-2 border-t border-[#D4A853]/15">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-[#A89D91] mb-1">
                          {isAr ? 'الاسم:' : 'Your Name:'}
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder={isAr ? 'مثال: محمد طارق' : 'e.g. Mohamed Tarek'}
                          className="w-full px-3 py-2 text-xs bg-[#120F0D] border border-[#D4A853]/20 rounded-lg text-[#F7F3EB]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#A89D91] mb-1">
                          {isAr ? 'رقم الموبايل:' : 'Phone Number:'}
                        </label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="010xxxxxxxx"
                          className="w-full px-3 py-2 text-xs font-mono-num bg-[#120F0D] border border-[#D4A853]/20 rounded-lg text-[#F7F3EB]"
                        />
                      </div>
                    </div>

                    {fulfillment === 'delivery' && (
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[11px] text-[#A89D91] mb-1">
                            {isAr ? 'المنطقة بالمنصورة:' : 'Mansoura Area:'}
                          </label>
                          <select
                            value={deliveryArea}
                            onChange={(e) => setDeliveryArea(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-[#120F0D] border border-[#D4A853]/20 rounded-lg text-[#F7F3EB]"
                          >
                            {MANSOURA_AREAS.map((area) => (
                              <option key={area.ar} value={area.ar}>
                                {isAr ? area.ar : area.en}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#A89D91] mb-1">
                            {isAr ? 'العنوان التفصيلي (الشارع / البرج / الدور):' : 'Street, Building & Floor:'}
                          </label>
                          <input
                            type="text"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            placeholder={
                              isAr
                                ? 'مثال: شارع الترعة، برج النور، الدور الرابع'
                                : 'e.g. El-Teraa St., Al-Noor Tower, 4th Floor'
                            }
                            className="w-full px-3 py-2 text-xs bg-[#120F0D] border border-[#D4A853]/20 rounded-lg text-[#F7F3EB]"
                          />
                        </div>
                      </div>
                    )}

                    {fulfillment === 'car_service' && (
                      <div>
                        <label className="block text-[11px] text-[#A89D91] mb-1">
                          {isAr
                            ? 'نوع ولون السيارة (أمام الدفاع المدني بشارع الترعة):'
                            : 'Car Model & Color (Opposite Civil Defense, Teraa St.):'}
                        </label>
                        <input
                          type="text"
                          value={carDetails}
                          onChange={(e) => setCarDetails(e.target.value)}
                          placeholder={
                            isAr ? 'مثال: هيونداي إلنترا فضي - د ق هـ 4512' : 'e.g. Silver Elantra - Plate 4512'
                          }
                          className="w-full px-3 py-2 text-xs bg-[#120F0D] border border-[#D4A853]/20 rounded-lg text-[#F7F3EB]"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] text-[#A89D91] mb-1">
                        {isAr ? 'ملاحظات عامة على الطلب:' : 'General Order Notes:'}
                      </label>
                      <input
                        type="text"
                        value={orderGeneralNotes}
                        onChange={(e) => setOrderGeneralNotes(e.target.value)}
                        placeholder={
                          isAr ? 'مثال: كثر المناديل والكاتشب...' : 'e.g. Extra napkins, ring bell gently...'
                        }
                        className="w-full px-3 py-2 text-xs bg-[#120F0D] border border-[#D4A853]/20 rounded-lg text-[#F7F3EB]"
                      />
                    </div>
                  </div>

                  {/* Live Scheduled WhatsApp Text Preview */}
                  <div className="p-3.5 rounded-xl bg-[#110E0C] border border-[#D4A853]/20 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#D4A853]">
                      <span>
                        {isAr
                          ? 'معاينة نص الرسالة المجدولة للواتساب (01070283060):'
                          : 'Scheduled WhatsApp Message Preview (01070283060):'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAndConfirmOrder}
                        className="underline hover:text-[#F7F3EB] flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedWhatsApp ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ النص' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-[11px] text-[#C4B9AC] whitespace-pre-wrap font-sans leading-relaxed max-h-32 overflow-y-auto">
                      {whatsappMessageText}
                    </pre>
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer: Subtotal & Direct WhatsApp Dispatch */}
            {cart.length > 0 && (
              <div className="p-5 bg-[#120F0D] border-t border-[#D4A853]/20 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#A89D91]">
                    <span>{isAr ? 'مجموع الوجبات:' : 'Subtotal:'}</span>
                    <span className="font-mono-num">
                      {cartSubtotal} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                  {fulfillment === 'delivery' && (
                    <div className="flex justify-between text-[#A89D91]">
                      <span>
                        {isAr
                          ? 'رسوم التوصيل (مجاناً للطلبات فوق 300 ج.م):'
                          : 'Delivery Fee (Free over 300 EGP):'}
                      </span>
                      <span className="font-mono-num text-[#D4A853]">
                        {deliveryFee === 0
                          ? isAr
                            ? 'مجاناً'
                            : 'FREE'
                          : `${deliveryFee} ${isAr ? 'ج.م' : 'EGP'}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#F7F3EB] pt-1 border-t border-[#D4A853]/10">
                    <span>{isAr ? 'الإجمالي النهائي:' : 'Total Amount:'}</span>
                    <span className="font-mono-num text-base text-[#D4A853]">
                      {grandTotal} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      const randomOrderNum = `RD-${Math.floor(1000 + Math.random() * 9000)}`;
                      setConfirmedOrderCode(randomOrderNum);
                    }}
                    className="py-3 px-4 bg-[#25D366] hover:bg-[#22BF5B] text-[#0B140E] font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{isAr ? 'إرسال عبر واتساب الآن' : 'Send via WhatsApp Now'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyAndConfirmOrder}
                    className="py-3 px-4 bg-[#D4A853] hover:bg-[#E2B866] text-[#120F0D] font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>
                      {copiedWhatsApp
                        ? isAr
                          ? 'تم نسخ الطلب وتأكيده!'
                          : 'Order Copied & Confirmed!'
                        : isAr
                        ? 'نسخ الرسالة وتأكيد الفاتورة'
                        : 'Copy & Confirm Receipt'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
