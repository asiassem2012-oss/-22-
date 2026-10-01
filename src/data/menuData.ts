export type Language = 'ar' | 'en';

export type CategoryId = 'all' | 'shawarma' | 'western' | 'appetizers' | 'sweets_drinks';

export interface AddonOption {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
}

export interface SizeVariant {
  id: string;
  labelAr: string;
  labelEn: string;
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: Exclude<CategoryId, 'all'>;
  categoryLabelAr: string;
  categoryLabelEn: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  basePrice: number;
  servingMetaAr: string;
  servingMetaEn: string;
  image: string;
  signatureTagAr?: string;
  signatureTagEn?: string;
  supportsSpice: boolean;
  variants?: SizeVariant[];
  availableAddons: string[];
}

export interface CustomerReview {
  id: string;
  authorAr: string;
  authorEn: string;
  roleAr: string;
  roleEn: string;
  rating: number;
  dateAr: string;
  dateEn: string;
  OrderContextAr: string;
  OrderContextEn: string;
  commentAr: string;
  commentEn: string;
}

export const IMAGES = {
  heroFeast: '/src/assets/images/hero_shawarma_feast_1790851966655.jpg',
  arabicShawarma: '/src/assets/images/arabic_shawarma_platter_1790851978503.jpg',
  fattahBowl: '/src/assets/images/fattah_shawarma_bowl_1790851988517.jpg',
  crispyZinger: '/src/assets/images/crispy_zinger_meal_1790851999605.jpg',
  kibbehMeze: '/src/assets/images/syrian_kibbeh_meze_1790852009420.jpg',
};

export const RESTAURANT_INFO = {
  phoneDisplay: '01070283060',
  whatsappIntl: '201070283060',
  rating: 4.2,
  reviewCount: 834,
  priceRangeAr: '1 – 200 ج.م للشخص',
  priceRangeEn: '1 – 200 EGP / person',
  hoursAr: 'يومياً من 12:00 ظهراً حتى 4:00 فجراً',
  hoursEn: 'Daily 12:00 PM – 4:00 AM',
  addressAr: 'شارع الترعة (أمام الدفاع المدني)، أول المنصورة، محافظة الدقهلية',
  addressEn: 'El-Teraa St. (In front of Civil Defense), Awal El-Mansoura, Dakahlia',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%D9%85%D8%B7%D8%B9%D9%85+%D8%B1%D9%88%D8%AD+%D8%AF%D9%85%D8%B4%D9%82+%D8%B4%D8%A7%D8%B1%D8%B9+%D8%A7%D9%84%D8%AA%D8%B1%D8%B9%D8%A9+%D8%A7%D9%84%D9%85%D9%86%D8%B5%D9%88%D8%B1%D8%A9',
};

export const ADDON_CATALOG: AddonOption[] = [
  { id: 'extra_toum', nameAr: 'علبة ثومية شامية إضافية', nameEn: 'Extra Damascus Garlic Toum', price: 15 },
  { id: 'spicy_toum', nameAr: 'ثومية حارة (محمرة شامية)', nameEn: 'Spicy Muhammara Garlic Dip', price: 18 },
  { id: 'cheddar_sauce', nameAr: 'صوص جبنة شيدر ذائبة', nameEn: 'Melted Cheddar Cheese Sauce', price: 25 },
  { id: 'pomegranate_molasses', nameAr: 'إضافة دبس رمان أصلي', nameEn: 'Pomegranate Molasses Drizzle', price: 12 },
  { id: 'pickles_pack', nameAr: 'مخلل خيار ولفت سوري إضافي', nameEn: 'Extra Syrian Pickles & Turnips', price: 10 },
  { id: 'extra_saj', nameAr: 'خبز صاج محمص إضافي (قطعتين)', nameEn: 'Extra Toasted Saj Bread (2 pcs)', price: 12 },
  { id: 'fries_side', nameAr: 'باكيت بطاطس محمرة مقرمشة', nameEn: 'Crispy Seasoned Fries Portion', price: 30 },
];

export const CATEGORIES: { id: CategoryId; labelAr: string; labelEn: string; count: number }[] = [
  { id: 'all', labelAr: 'كل الأصناف', labelEn: 'All Dishes', count: 12 },
  { id: 'shawarma', labelAr: 'الشاورما السورية', labelEn: 'Syrian Shawarma', count: 4 },
  { id: 'western', labelAr: 'الوجبات الغربية والريسبي', labelEn: 'Western & Crispy', count: 3 },
  { id: 'appetizers', labelAr: 'المقبلات والأصناف الجانبية', labelEn: 'Appetizers & Meze', count: 3 },
  { id: 'sweets_drinks', labelAr: 'المشروبات والحلويات الشامية', labelEn: 'Drinks & Sweets', count: 2 },
];

export const MENU_ITEMS: MenuItem[] = [
  // 1. Syrian Shawarma
  {
    id: 'shawarma-arabic-chicken',
    categoryId: 'shawarma',
    categoryLabelAr: 'الشاورما السورية',
    categoryLabelEn: 'Syrian Shawarma',
    nameAr: 'وجبة شاورما عربي دجاج',
    nameEn: 'Arabic Chicken Shawarma Platter',
    descriptionAr: 'شرائح شاورما الدجاج المتبلة على الطريقة الدمشقية ملفوفة بخبز الصاج المحمص على الجريل، تُقدم مع بطاطس مقرمشة، ثومية شامية، ومخلل خيار.',
    descriptionEn: 'Damascus-spiced chicken shawarma rolled in flame-toasted saj bread, sliced into bites and served with golden fries, creamy garlic toum, and pickles.',
    basePrice: 135,
    servingMetaAr: '8 قطع عربي · بطاطس · ثومية ومخلل',
    servingMetaEn: '8 Saj Bites · Fries · Toum & Pickles',
    image: IMAGES.arabicShawarma,
    signatureTagAr: 'الأكثر طلباً',
    signatureTagEn: 'Bestseller',
    supportsSpice: true,
    variants: [
      { id: 'single', labelAr: 'وجبة عادي (8 قطع)', labelEn: 'Regular (8 Bites)', price: 135 },
      { id: 'double', labelAr: 'وجبة دبل سوبر (14 قطعة)', labelEn: 'Double Super (14 Bites)', price: 185 },
    ],
    availableAddons: ['extra_toum', 'spicy_toum', 'cheddar_sauce', 'pickles_pack', 'extra_saj'],
  },
  {
    id: 'shawarma-arabic-beef',
    categoryId: 'shawarma',
    categoryLabelAr: 'الشاورما السورية',
    categoryLabelEn: 'Syrian Shawarma',
    nameAr: 'وجبة شاورما عربي لحم شامي',
    nameEn: 'Arabic Beef Shawarma Platter',
    descriptionAr: 'شاورما لحم بلدي متبلة بالبهارات السبعة والطحينة والبصل والسماق ودبس الرمان، محمصة بخبز الصاج مع البطاطس والطحينة الشامية.',
    descriptionEn: 'Tender beef shawarma marinated in seven Levantine spices, sumac, onion, and tahini sauce, toasted in saj bread with fries and pickles.',
    basePrice: 155,
    servingMetaAr: '8 قطع لحم · صوص طحينة ودبس رمان',
    servingMetaEn: '8 Beef Bites · Tahini & Pomegranate',
    image: IMAGES.heroFeast,
    signatureTagAr: 'تتبيلة دمشقية',
    signatureTagEn: 'Damascus Cut',
    supportsSpice: true,
    variants: [
      { id: 'single', labelAr: 'وجبة عادي (8 قطع)', labelEn: 'Regular (8 Bites)', price: 155 },
      { id: 'mix', labelAr: 'وجبة ميكس فراخ ولحم (12 قطعة)', labelEn: 'Mix Chicken & Beef (12 Bites)', price: 190 },
    ],
    availableAddons: ['pomegranate_molasses', 'extra_toum', 'cheddar_sauce', 'pickles_pack', 'fries_side'],
  },
  {
    id: 'fattah-shawarma-syrian',
    categoryId: 'shawarma',
    categoryLabelAr: 'الشاورما السورية',
    categoryLabelEn: 'Syrian Shawarma',
    nameAr: 'فتة شاورما روح دمشق',
    nameEn: 'Rooh Damascus Shawarma Fatteh',
    descriptionAr: 'طبقات من الخبز الشامي المحمص والأرز البسمتي الأصفر المبهر مع شرائح الشاورما المشوية وصوص الثومية والزبادي الطازج على الوجه.',
    descriptionEn: 'Layered toasted Syrian pita crisps, spiced yellow basmati rice, and flame-seared shawarma strips topped with warm garlic-yogurt sauce.',
    basePrice: 125,
    servingMetaAr: 'أرز بسمتي · عيش محمص · صوص فتة شامي',
    servingMetaEn: 'Basmati Rice · Toasted Pita · Garlic Cream',
    image: IMAGES.fattahBowl,
    signatureTagAr: 'طعم أصيل',
    signatureTagEn: 'House Special',
    supportsSpice: true,
    variants: [
      { id: 'chicken', labelAr: 'فتة شاورما دجاج', labelEn: 'Chicken Shawarma Fatteh', price: 125 },
      { id: 'beef', labelAr: 'فتة شاورما لحم', labelEn: 'Beef Shawarma Fatteh', price: 145 },
      { id: 'mix', labelAr: 'فتة شاورما ميكس بالمكسرات', labelEn: 'Mix Fatteh with Roasted Nuts', price: 165 },
    ],
    availableAddons: ['extra_toum', 'spicy_toum', 'pomegranate_molasses', 'cheddar_sauce', 'pickles_pack'],
  },
  {
    id: 'shawarma-saj-roll',
    categoryId: 'shawarma',
    categoryLabelAr: 'الشاورما السورية',
    categoryLabelEn: 'Syrian Shawarma',
    nameAr: 'سندوتش شاورما صاج دمشقي جامبو',
    nameEn: 'Jumbo Damascus Saj Shawarma Roll',
    descriptionAr: 'سندوتش شاورما ملفوف في خبز صاج رقيق ومقرمش على الصاج الحامي مع الثومية الكثيفة ومخلل الخيار الشامي، مثالي للطلب السريع.',
    descriptionEn: 'Loaded shawarma wrapped in thin griddle-pressed saj bread with rich garlic toum and crunchy Syrian pickled cucumbers.',
    basePrice: 80,
    servingMetaAr: 'خبز صاج دبل · ثومية ومخلل',
    servingMetaEn: 'Double Saj Wrap · Toum & Pickles',
    image: IMAGES.arabicShawarma,
    supportsSpice: true,
    variants: [
      { id: 'chicken_roll', labelAr: 'صاج شاورما دجاج جامبو', labelEn: 'Jumbo Chicken Saj Roll', price: 80 },
      { id: 'beef_roll', labelAr: 'صاج شاورما لحم جامبو', labelEn: 'Jumbo Beef Saj Roll', price: 95 },
    ],
    availableAddons: ['extra_toum', 'cheddar_sauce', 'pomegranate_molasses', 'fries_side'],
  },

  // 2. Western & Crispy
  {
    id: 'syrian-crispy-meal',
    categoryId: 'western',
    categoryLabelAr: 'الوجبات الغربية والريسبي',
    categoryLabelEn: 'Western & Crispy',
    nameAr: 'وجبة كريسبي سوري مقرمش (4 قطع)',
    nameEn: 'Syrian Golden Crispy Meal (4 Pcs)',
    descriptionAr: 'صدور دجاج كاملة متبلة بخلطة الأعشاب الشامية السرية ومقلية حتى القرمشة الذهبية، تُقدم مع بطاطس، كول سلو، ثومية، وخبز سوري.',
    descriptionEn: 'Whole chicken breast fillets marinated in Levantine herbs and fried to a golden crunch, served with fries, coleslaw, garlic dip, and bread.',
    basePrice: 160,
    servingMetaAr: '4 قطع كبيرة · بطاطس · كول سلو وثومية',
    servingMetaEn: '4 Large Strips · Fries · Coleslaw & Toum',
    image: IMAGES.crispyZinger,
    signatureTagAr: 'قرمشة ذهبية',
    signatureTagEn: 'Extra Crispy',
    supportsSpice: true,
    variants: [
      { id: '4pcs', labelAr: 'وجبة 4 قطع كريسبي', labelEn: '4 Pcs Crispy Meal', price: 160 },
      { id: '6pcs', labelAr: 'وجبة 6 قطع سوبر كريسبي', labelEn: '6 Pcs Super Crispy Meal', price: 195 },
    ],
    availableAddons: ['cheddar_sauce', 'extra_toum', 'spicy_toum', 'fries_side', 'extra_saj'],
  },
  {
    id: 'zinger-crepe-roll',
    categoryId: 'western',
    categoryLabelAr: 'الوجبات الغربية والريسبي',
    categoryLabelEn: 'Western & Crispy',
    nameAr: 'كريب زنجر وشيدر سوري',
    nameEn: 'Spicy Zinger & Cheddar Syrian Crepe',
    descriptionAr: 'عجينة كريب طازجة محشوة بقطع الزنجر الحار المقرمش، جبنة موزاريلا وشيدر ذائبة، فلفل ألوان، وصوص الريزو والثومية.',
    descriptionEn: 'Fresh golden crepe folded with crunchy spicy zinger fillets, melted cheddar and mozzarella, bell peppers, and house signature sauce.',
    basePrice: 115,
    servingMetaAr: 'حجم كبير · جبنة شيدر وموزاريلا',
    servingMetaEn: 'Large Fold · Cheddar & Mozzarella',
    image: IMAGES.crispyZinger,
    supportsSpice: true,
    variants: [
      { id: 'zinger', labelAr: 'كريب زنجر كريسبي', labelEn: 'Crispy Zinger Crepe', price: 115 },
      { id: 'mix_shawarma_crepe', labelAr: 'كريب ميكس شاورما وكريسبي', labelEn: 'Shawarma & Crispy Mix Crepe', price: 135 },
    ],
    availableAddons: ['cheddar_sauce', 'extra_toum', 'fries_side', 'pickles_pack'],
  },
  {
    id: 'damascus-charcoal-burger',
    categoryId: 'western',
    categoryLabelAr: 'الوجبات الغربية والريسبي',
    categoryLabelEn: 'Western & Crispy',
    nameAr: 'برجر روح دمشق المدخن بالجبنة',
    nameEn: 'Rooh Damascus Double Cheese Burger',
    descriptionAr: 'قطعة برجر لحم صافي مشوية على الجريل مع شرائح الجبنة الشيدر الذائبة، حلقات البصل المكرمل، خس طازج، وصوص روح دمشق المدخن مع البطاطس.',
    descriptionEn: 'Flame-grilled pure beef patty topped with melted American cheddar, caramelized onions, crisp lettuce, and smoky house sauce with fries.',
    basePrice: 130,
    servingMetaAr: 'شامل بطاطس محمرة · خبز بريوش محمص',
    servingMetaEn: 'Includes Fries · Toasted Brioche Bun',
    image: IMAGES.heroFeast,
    supportsSpice: true,
    variants: [
      { id: 'single_burger', labelAr: 'سنجل برجر كلاسيك (150 جم)', labelEn: 'Single Burger (150g)', price: 130 },
      { id: 'double_burger', labelAr: 'دبل برجر شيدر (300 جم)', labelEn: 'Double Smash Cheese (300g)', price: 175 },
    ],
    availableAddons: ['cheddar_sauce', 'fries_side', 'pickles_pack', 'extra_toum'],
  },

  // 3. Appetizers & Meze
  {
    id: 'syrian-fried-kibbeh',
    categoryId: 'appetizers',
    categoryLabelAr: 'المقبلات والأصناف الجانبية',
    categoryLabelEn: 'Appetizers & Meze',
    nameAr: 'كبة سورية مقلية محشوة باللحم والمكسرات',
    nameEn: 'Stuffed Syrian Fried Kibbeh',
    descriptionAr: 'أقراص الكبة الدمشقية الأصيلة من البرغل الناعم المحشوة باللحم المفروم المتبل بالسماق ودبس الرمان والمكسرات المحمصة.',
    descriptionEn: 'Authentic golden bulgur shells stuffed with spiced minced beef, caramelized onions, sumac, pomegranate molasses, and toasted nuts.',
    basePrice: 65,
    servingMetaAr: 'تُقدم ساخنة مع شرائح الليمون ودبس الرمان',
    servingMetaEn: 'Served Hot with Lemon & Pomegranate',
    image: IMAGES.kibbehMeze,
    signatureTagAr: 'وصفة شامية',
    signatureTagEn: 'Traditional',
    supportsSpice: false,
    variants: [
      { id: '2pcs_kibbeh', labelAr: 'طلب قطعتين كبة شامي', labelEn: '2 Pieces Order', price: 65 },
      { id: '4pcs_kibbeh', labelAr: 'طلب 4 قطع كبة شامي', labelEn: '4 Pieces Family Order', price: 120 },
    ],
    availableAddons: ['pomegranate_molasses', 'extra_toum', 'spicy_toum'],
  },
  {
    id: 'cheddar-loaded-fries',
    categoryId: 'appetizers',
    categoryLabelAr: 'المقبلات والأصناف الجانبية',
    categoryLabelEn: 'Appetizers & Meze',
    nameAr: 'بوكس بطاطس شيدر وهالبينو سوري',
    nameEn: 'Cheddar & Jalapeño Loaded Fries Box',
    descriptionAr: 'بطاطس ذهبية مقرمشة متبلة ببهارات الشاورما ومغطاة بصوص الجبنة الشيدر الساخن، الثومية الشامية، وقطع الهالبينو.',
    descriptionEn: 'Crispy golden fries tossed in shawarma spice blend and generously topped with warm cheddar cheese sauce, garlic toum, and jalapeños.',
    basePrice: 60,
    servingMetaAr: 'حجم عائلي مشاركة · صوص شيدر غني',
    servingMetaEn: 'Sharing Box · Rich Cheddar Drizzle',
    image: IMAGES.kibbehMeze,
    supportsSpice: true,
    variants: [
      { id: 'cheddar_fries', labelAr: 'بطاطس بصوص الشيدر والثومية', labelEn: 'Cheddar & Toum Fries', price: 60 },
      { id: 'shawarma_fries', labelAr: 'بطاطس شيدر بقطع الشاورما', labelEn: 'Shawarma Loaded Cheddar Fries', price: 95 },
    ],
    availableAddons: ['cheddar_sauce', 'extra_toum', 'spicy_toum'],
  },
  {
    id: 'tabbouleh-and-toum-pack',
    categoryId: 'appetizers',
    categoryLabelAr: 'المقبلات والأصناف الجانبية',
    categoryLabelEn: 'Appetizers & Meze',
    nameAr: 'تبولة شامية طازجة وثومية أصلية',
    nameEn: 'Fresh Levantine Tabbouleh & Garlic Toum',
    descriptionAr: 'سلطة التبولة الشامية بالبقدونس المفروم، البرغل الناعم، الطماطم، عصير الليمون وزيت الزيتون البكر مع علبة ثومية روح دمشق الكريمية.',
    descriptionEn: 'Finely chopped parsley, fine bulgur, vine tomatoes, fresh lemon juice, and extra-virgin olive oil paired with house garlic toum.',
    basePrice: 45,
    servingMetaAr: 'تحضير يومي طازج · زيت زيتون وليمون',
    servingMetaEn: 'Fresh Daily · Olive Oil & Lemon',
    image: IMAGES.kibbehMeze,
    supportsSpice: false,
    variants: [
      { id: 'toum_box', labelAr: 'علبة ثومية شامية جامبو', labelEn: 'Jumbo Garlic Toum Tub', price: 35 },
      { id: 'tabbouleh_salad', labelAr: 'طبق تبولة شامية بزيت الزيتون', labelEn: 'Fresh Levantine Tabbouleh', price: 45 },
      { id: 'meze_combo', labelAr: 'كومبو تبولة + ثومية + حمص بيروتي', labelEn: 'Tabbouleh + Toum + Hummus Trio', price: 85 },
    ],
    availableAddons: ['extra_saj', 'pomegranate_molasses', 'pickles_pack'],
  },

  // 4. Drinks & Syrian Sweets
  {
    id: 'nabulsi-cheese-kunafa',
    categoryId: 'sweets_drinks',
    categoryLabelAr: 'المشروبات والحلويات الشامية',
    categoryLabelEn: 'Drinks & Sweets',
    nameAr: 'كنافة نابلسية شامية بالجبنة السائحة',
    nameEn: 'Warm Nabulsi Cheese Kunafa',
    descriptionAr: 'كنافة شامية خشنة/ناعمة مخبوزة بالسمن البلدي ومحشوة بالجبنة العكاوي النابلسية المطاطية ومزينة بالفستق الحلبي والقطر الدافئ.',
    descriptionEn: 'Baked golden kunafa crust layered over stretchy Nabulsi sweet cheese, drizzled with rose-water simple syrup and crushed Aleppo pistachios.',
    basePrice: 75,
    servingMetaAr: 'تُحضر ساخنة عند الطلب · فستق حلبي',
    servingMetaEn: 'Baked to Order · Aleppo Pistachios',
    image: IMAGES.fattahBowl,
    signatureTagAr: 'حلوى دمشقية',
    signatureTagEn: 'Served Warm',
    supportsSpice: false,
    variants: [
      { id: 'individual', labelAr: 'طبق كنافة نابلسية فردي', labelEn: 'Single Warm Portion', price: 75 },
      { id: 'double_kunafa', labelAr: 'طبق كنافة نابلسية دبل بالفستق', labelEn: 'Double Sharing Portion', price: 135 },
    ],
    availableAddons: [],
  },
  {
    id: 'syrian-ayran-and-drinks',
    categoryId: 'sweets_drinks',
    categoryLabelAr: 'المشروبات والحلويات الشامية',
    categoryLabelEn: 'Drinks & Sweets',
    nameAr: 'لبن عيران شامي مثلج بالنعناع',
    nameEn: 'Chilled Frothy Syrian Mint Ayran',
    descriptionAr: 'مشروب اللبن العيران السوري الأصلي المخفوق بالرغوة الغنية مع رشة النعناع البري، الرفيق المثالي للشاورما السورية والمشويات.',
    descriptionEn: 'Traditional whipped savory yogurt drink topped with rich foam and dried wild mint — the classic pairing for Syrian shawarma.',
    basePrice: 35,
    servingMetaAr: 'طبيعي 100% · يُقدم مثلجاً',
    servingMetaEn: '100% Natural Dairy · Ice Chilled',
    image: IMAGES.arabicShawarma,
    supportsSpice: false,
    variants: [
      { id: 'ayran_cup', labelAr: 'كوب عيران شامي مثلج (400 مل)', labelEn: 'Chilled Syrian Ayran (400ml)', price: 35 },
      { id: 'cola_can', labelAr: 'مشروب غازي مثلج (330 مل)', labelEn: 'Chilled Soft Drink (330ml)', price: 25 },
      { id: 'ayran_liter', labelAr: 'زجاجة عيران عائلي (1 لتر)', labelEn: 'Family Ayran Bottle (1 Liter)', price: 75 },
    ],
    availableAddons: [],
  },
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    authorAr: 'د. أحمد عبد الرحمن',
    authorEn: 'Dr. Ahmed Abdelrahman',
    roleAr: 'عميل دائم · حي الجامعة، المنصورة',
    roleEn: 'Regular Guest · University District, Mansoura',
    rating: 5,
    dateAr: 'منذ يومين على خرائط جوجل',
    dateEn: '2 days ago on Google Maps',
    OrderContextAr: 'وجبة شاورما عربي دجاج + فتة شاورما · توصيل 2:30 ص',
    OrderContextEn: 'Arabic Chicken Shawarma + Fatteh · 2:30 AM Delivery',
    commentAr: 'أفضل شاورما سوري في شارع الترعة بدون مبالغة. طلبنا الساعة 2 ونص الفجر بعد النبطشية، الأكل وصل سخن جداً والعيش الصاج مقرمش والثومية طعمها شامي أصلي مش مجرد مايونيز.',
    commentEn: 'Hands down the best authentic Syrian shawarma on Teraa Street. Ordered at 2:30 AM after a hospital shift; arrived piping hot with crispy saj bread and genuine Damascus garlic toum.',
  },
  {
    id: 'rev-2',
    authorAr: 'م. سارة الشناوي',
    authorEn: 'Eng. Sara El-Shenawy',
    roleAr: 'مرشد محلي على Google · توريل، المنصورة',
    roleEn: 'Google Local Guide · Torell, Mansoura',
    rating: 5,
    dateAr: 'منذ أسبوع على خرائط جوجل',
    dateEn: '1 week ago on Google Maps',
    OrderContextAr: 'وجبة شاورما عربي لحم + كبة سورية · خدمة السيارة',
    OrderContextEn: 'Arabic Beef Shawarma + Stuffed Kibbeh · Car Service',
    commentAr: 'خدمة التوصيل للسيارة قدام الدفاع المدني ممتازة وسريعة جداً! بعتنا الطلب واللوحة على الواتساب واستلمنا في أقل من 15 دقيقة. الكبة المقلية والفتة طعمهم يرجعك لأجواء الشام.',
    commentEn: 'Curbside car service right opposite Civil Defense is super fast! Sent our order and plate details via WhatsApp and received it in under 15 minutes. The fried kibbeh is perfection.',
  },
  {
    id: 'rev-3',
    authorAr: 'محمود العدل',
    authorEn: 'Mahmoud El-Adl',
    roleAr: 'عميل موثق · أول المنصورة',
    roleEn: 'Verified Diner · Awal El-Mansoura',
    rating: 4,
    dateAr: 'منذ أسبوعين على خرائط جوجل',
    dateEn: '2 weeks ago on Google Maps',
    OrderContextAr: 'وجبة كريسبي سوري + كريب زنجر · جلوس بالمطعم',
    OrderContextEn: 'Syrian Crispy Meal + Zinger Crepe · Dine-In',
    commentAr: 'الأسعار ممتازة جداً مقارنة بالكمية والجودة (أغلب الوجبات المشبعة بين 115 و185 جنيه). الكريسبي السوري مقرمش من برة ومستوي صح من جوة، والمكان نظيف وتعامل الشباب محترم.',
    commentEn: 'Unbeatable value for portion size and quality in Mansoura. The Syrian crispy strips are golden outside and juicy inside, and the staff hospitality is genuinely warm.',
  },
];

export const MANSOURA_AREAS = [
  { ar: 'شارع الترعة (أمام الدفاع المدني / المحيط)', en: 'El-Teraa St. (Civil Defense Area)' },
  { ar: 'حي الجامعة / بوابة توشكى / جيهان', en: 'University District / Jehan / Toshka' },
  { ar: 'المشاية السفلية والعلوية', en: 'El-Mashaya (Lower & Upper)' },
  { ar: 'شارع قناة السويس وتوريل', en: 'Suez Canal St. & Torell' },
  { ar: 'شارع الجمهورية وميدان المحافظة', en: 'El-Gomhoria St. & Governorate Sq.' },
  { ar: 'شارع الجلاء / كلية آداب / سندوب', en: 'El-Galaa St. / Arts / Sandoub' },
  { ar: 'طلخا / تقسيم بهاء', en: 'Talkha / التقسيم' },
];
