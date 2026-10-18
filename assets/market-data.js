// كتالوج جاهز: الأقسام والمنتجات والخدمات المعروضة، ونسب العمولة الاسترشادية للشركاء المعتمدين.
// عدّل الأسعار والأقسام هنا فقط وسيتحدث الموقع كله (العربي والإنجليزي).
// كل قسم: {code, kind, icon, ar, en, about_ar, about_en, items}
//   kind: food (مواد غذائية) | goods (مواد ومستلزمات) | service (خدمات)
// كل بند: [الرمز، الاسم بالعربي، الاسم بالإنجليزي، السعر الاسترشادي بالريال، الوحدة بالعربي، الوحدة بالإنجليزي]
// الأسعار استرشادية «تبدأ من»، والسعر النهائي يؤكده الشريك المنفّذ قبل التنفيذ.
const MARKET = {
 KINDS: {
  food:    {ar: 'المواد الغذائية', en: 'Food & Groceries'},
  goods:   {ar: 'المواد والمستلزمات', en: 'Supplies & Goods'},
  service: {ar: 'الخدمات', en: 'Services'}
 },
 CATS: [
  // ---------- المواد الغذائية ----------
  {code: 'FV', kind: 'food', icon: '🥬', ar: 'خضار وفواكه طازجة', en: 'Fresh Fruit & Vegetables',
   about_ar: 'خضار وفواكه يومية من موردين معتمدين، محلية ومستوردة.', about_en: 'Daily produce from accredited suppliers, local and imported.',
   items: [
    ['FV-01', 'سلة خضار يومية مشكلة', 'Mixed daily vegetable box', 45, 'للسلة (5 كجم)', 'per box (5 kg)'],
    ['FV-02', 'سلة فواكه موسمية', 'Seasonal fruit box', 60, 'للسلة (5 كجم)', 'per box (5 kg)'],
    ['FV-03', 'طماطم وخيار وبصل', 'Tomatoes, cucumbers & onions', 8, 'للكيلو', 'per kg'],
    ['FV-04', 'ورقيات وأعشاب طازجة', 'Fresh leafy greens & herbs', 5, 'للربطة', 'per bunch'],
    ['FV-05', 'منتجات المزارع القطرية', 'Qatari farm produce', 35, 'للسلة', 'per box']
   ]},
  {code: 'MP', kind: 'food', icon: '🥩', ar: 'لحوم ودواجن وأسماك', en: 'Meat, Poultry & Fish',
   about_ar: 'لحوم ودواجن وأسماك طازجة ومجمدة من ملاحم ومسالخ ومورّدين مرخصين.', about_en: 'Fresh and frozen meat, poultry and fish from licensed butchers and suppliers.',
   items: [
    ['MP-01', 'لحم غنم طازج', 'Fresh lamb', 48, 'للكيلو', 'per kg'],
    ['MP-02', 'لحم عجل طازج', 'Fresh veal', 42, 'للكيلو', 'per kg'],
    ['MP-03', 'دجاج طازج كامل', 'Fresh whole chicken', 18, 'للحبة', 'each'],
    ['MP-04', 'أسماك الخليج الطازجة', 'Fresh Gulf fish', 35, 'للكيلو', 'per kg'],
    ['MP-05', 'روبيان', 'Shrimp', 55, 'للكيلو', 'per kg'],
    ['MP-06', 'ذبيحة كاملة مع التقطيع والتغليف', 'Whole sacrifice animal, cut and packed', 1200, 'للذبيحة', 'per animal']
   ]},
  {code: 'DE', kind: 'food', icon: '🥛', ar: 'ألبان وأجبان وبيض', en: 'Dairy, Cheese & Eggs',
   about_ar: 'حليب ولبن وأجبان وبيض طازج من مصانع ومزارع معتمدة.', about_en: 'Milk, laban, cheese and fresh eggs from accredited dairies and farms.',
   items: [
    ['DE-01', 'حليب طازج', 'Fresh milk', 7, 'للتر', 'per litre'],
    ['DE-02', 'لبن وزبادي', 'Laban & yoghurt', 6, 'للعبوة', 'per pack'],
    ['DE-03', 'تشكيلة أجبان', 'Cheese selection', 25, 'للتشكيلة', 'per selection'],
    ['DE-04', 'بيض طازج', 'Fresh eggs', 14, 'للكرتونة (30)', 'per tray (30)']
   ]},
  {code: 'BK', kind: 'food', icon: '🥖', ar: 'مخبوزات وحلويات', en: 'Bakery & Sweets',
   about_ar: 'خبز يومي ومعجنات وكيك وحلويات شرقية وغربية من مخابز معتمدة.', about_en: 'Daily bread, pastries, cakes and sweets from accredited bakeries.',
   items: [
    ['BK-01', 'خبز عربي يومي', 'Daily Arabic bread', 3, 'للربطة', 'per pack'],
    ['BK-02', 'معجنات وفطائر', 'Pastries & pies', 30, 'للصينية', 'per tray'],
    ['BK-03', 'كيك المناسبات حسب الطلب', 'Custom celebration cake', 150, 'للكيكة', 'per cake'],
    ['BK-04', 'حلويات شرقية', 'Arabic sweets', 60, 'للكيلو', 'per kg']
   ]},
  {code: 'GR', kind: 'food', icon: '🛒', ar: 'بقالة ومواد تموينية', en: 'Groceries & Pantry',
   about_ar: 'أرز وسكر وزيوت وبقوليات ومعلبات وتوابل بأحجام منزلية وبالجملة.', about_en: 'Rice, sugar, oils, pulses, canned food and spices, home and bulk sizes.',
   items: [
    ['GR-01', 'أرز بسمتي', 'Basmati rice', 45, 'للكيس (5 كجم)', 'per 5 kg bag'],
    ['GR-02', 'زيت طبخ', 'Cooking oil', 28, 'للعبوة (5 لتر)', 'per 5 L'],
    ['GR-03', 'سلة تموين شهرية للأسرة', 'Monthly family pantry basket', 350, 'للسلة', 'per basket'],
    ['GR-04', 'بقوليات وحبوب', 'Pulses & grains', 10, 'للكيلو', 'per kg'],
    ['GR-05', 'توابل وبهارات', 'Spices', 12, 'للعبوة', 'per pack'],
    ['GR-06', 'مواد تموينية بالجملة للمطاعم والشركات', 'Bulk supplies for restaurants & companies', 1000, 'للطلب', 'per order']
   ]},
  {code: 'BV', kind: 'food', icon: '🧃', ar: 'مشروبات وعصائر ومياه', en: 'Drinks, Juices & Water',
   about_ar: 'مياه شرب وعصائر طازجة ومشروبات وقهوة وشاي.', about_en: 'Drinking water, fresh juices, soft drinks, coffee and tea.',
   items: [
    ['BV-01', 'مياه شرب (كرتون)', 'Drinking water (carton)', 12, 'للكرتون', 'per carton'],
    ['BV-02', 'جالون مياه 5 جالون مع التوصيل', '5-gallon water bottle, delivered', 10, 'للجالون', 'per bottle'],
    ['BV-03', 'عصائر طازجة', 'Fresh juices', 15, 'للتر', 'per litre'],
    ['BV-04', 'قهوة عربية وشاي', 'Arabic coffee & tea', 35, 'للعبوة', 'per pack']
   ]},
  {code: 'HO', kind: 'food', icon: '🌿', ar: 'أغذية صحية وعضوية', en: 'Healthy & Organic',
   about_ar: 'منتجات عضوية وخالية من الجلوتين ووجبات صحية واشتراكات حمية.', about_en: 'Organic and gluten-free products, healthy meals and diet subscriptions.',
   items: [
    ['HO-01', 'منتجات عضوية', 'Organic products', 25, 'للعبوة', 'per pack'],
    ['HO-02', 'منتجات خالية من الجلوتين والسكر', 'Gluten-free & sugar-free products', 20, 'للعبوة', 'per pack'],
    ['HO-03', 'اشتراك وجبات صحية أسبوعي', 'Weekly healthy meal plan', 450, 'للأسبوع', 'per week']
   ]},
  {code: 'RM', kind: 'food', icon: '🍽️', ar: 'وجبات جاهزة ومطاعم', en: 'Ready Meals & Restaurants',
   about_ar: 'وجبات يومية وولائم ووجبات للشركات من مطاعم ومطابخ مرخصة.', about_en: 'Daily meals, feasts and corporate catering from licensed restaurants and kitchens.',
   items: [
    ['RM-01', 'وجبة يومية', 'Daily meal', 25, 'للوجبة', 'per meal'],
    ['RM-02', 'وليمة منزلية (مندي، كبسة، مضبي)', 'Home feast (mandi, kabsa)', 250, 'لـ 5 أشخاص', 'for 5 people'],
    ['RM-03', 'وجبات الموظفين للشركات', 'Staff meals for companies', 18, 'للشخص يومياً', 'per person/day'],
    ['RM-04', 'بوفيه مفتوح للمناسبات', 'Event buffet', 85, 'للشخص', 'per person']
   ]},
  {code: 'LP', kind: 'food', icon: '🍯', ar: 'تمور وعسل ومنتجات محلية', en: 'Dates, Honey & Local Products',
   about_ar: 'تمور فاخرة وعسل طبيعي ومنتجات الأسر المنتجة.', about_en: 'Premium dates, natural honey and home-business products.',
   items: [
    ['LP-01', 'تمور فاخرة', 'Premium dates', 40, 'للكيلو', 'per kg'],
    ['LP-02', 'عسل طبيعي', 'Natural honey', 120, 'للكيلو', 'per kg'],
    ['LP-03', 'منتجات الأسر المنتجة', 'Home-business products', 30, 'للعبوة', 'per pack'],
    ['LP-04', 'صناديق هدايا رمضان والعيد', 'Ramadan & Eid gift boxes', 150, 'للصندوق', 'per box']
   ]},
  // ---------- المواد والمستلزمات ----------
  {code: 'CL', kind: 'goods', icon: '🧴', ar: 'منظفات ومستلزمات منزلية', en: 'Cleaning & Household',
   about_ar: 'منظفات ومعقمات ومناديل وأكياس للمنازل والمكاتب، بالقطعة وبالجملة.', about_en: 'Detergents, disinfectants, tissues and bags for homes and offices.',
   items: [
    ['CL-01', 'سلة منظفات شهرية', 'Monthly cleaning basket', 120, 'للسلة', 'per basket'],
    ['CL-02', 'مناديل ومستلزمات ورقية', 'Tissues & paper goods', 25, 'للكرتون', 'per carton'],
    ['CL-03', 'معقمات ومطهرات', 'Sanitisers & disinfectants', 15, 'للعبوة', 'per bottle'],
    ['CL-04', 'مستلزمات نظافة للشركات بالجملة', 'Bulk cleaning supplies for companies', 500, 'للطلب', 'per order']
   ]},
  {code: 'KH', kind: 'goods', icon: '🍳', ar: 'أدوات منزلية ومطبخ', en: 'Home & Kitchen',
   about_ar: 'أواني وأدوات مطبخ وأجهزة منزلية صغيرة ومفروشات.', about_en: 'Cookware, kitchen tools, small appliances and home textiles.',
   items: [
    ['KH-01', 'أواني وأدوات مطبخ', 'Cookware & kitchen tools', 40, 'للقطعة', 'per item'],
    ['KH-02', 'أجهزة منزلية صغيرة', 'Small home appliances', 90, 'للجهاز', 'per appliance'],
    ['KH-03', 'مفروشات ومنسوجات منزلية', 'Home textiles', 60, 'للقطعة', 'per item']
   ]},
  {code: 'BC', kind: 'goods', icon: '🍼', ar: 'مستلزمات الأطفال', en: 'Baby & Kids',
   about_ar: 'حليب الأطفال والحفاضات وأغذية ومستلزمات العناية والألعاب.', about_en: 'Formula, diapers, baby food, care products and toys.',
   items: [
    ['BC-01', 'حفاضات أطفال', 'Diapers', 55, 'للعبوة', 'per pack'],
    ['BC-02', 'حليب وأغذية أطفال', 'Formula & baby food', 60, 'للعبوة', 'per pack'],
    ['BC-03', 'ألعاب تعليمية', 'Educational toys', 45, 'للقطعة', 'per item']
   ]},
  {code: 'PC', kind: 'goods', icon: '💄', ar: 'عناية شخصية وعطور', en: 'Personal Care & Perfume',
   about_ar: 'مستحضرات العناية والتجميل والعطور والبخور والعود.', about_en: 'Care and beauty products, perfumes, bakhoor and oud.',
   items: [
    ['PC-01', 'مستحضرات عناية شخصية', 'Personal care products', 25, 'للعبوة', 'per item'],
    ['PC-02', 'عطور', 'Perfumes', 150, 'للعبوة', 'per bottle'],
    ['PC-03', 'بخور وعود', 'Bakhoor & oud', 80, 'للعبوة', 'per pack']
   ]},
  {code: 'OS', kind: 'goods', icon: '📎', ar: 'قرطاسية ومستلزمات مكتبية', en: 'Stationery & Office',
   about_ar: 'قرطاسية مدرسية ومكتبية وأحبار وورق طباعة وأثاث مكتبي.', about_en: 'School and office stationery, ink, paper and office furniture.',
   items: [
    ['OS-01', 'حقيبة القرطاسية المدرسية', 'School stationery set', 75, 'للحقيبة', 'per set'],
    ['OS-02', 'ورق طباعة A4', 'A4 printing paper', 120, 'للكرتون (5 رزم)', 'per carton (5 reams)'],
    ['OS-03', 'أحبار وطابعات', 'Ink & printers', 60, 'للقطعة', 'per item'],
    ['OS-04', 'أثاث مكتبي', 'Office furniture', 400, 'للقطعة', 'per item']
   ]},
  {code: 'BM', kind: 'goods', icon: '🧱', ar: 'مواد بناء وصيانة', en: 'Building & Hardware',
   about_ar: 'مواد بناء وأدوات كهربائية وسباكة ودهانات وعدد يدوية.', about_en: 'Building materials, electrical and plumbing parts, paints and tools.',
   items: [
    ['BM-01', 'دهانات', 'Paints', 90, 'للجالون', 'per gallon'],
    ['BM-02', 'أدوات كهربائية', 'Electrical supplies', 20, 'للقطعة', 'per item'],
    ['BM-03', 'أدوات سباكة', 'Plumbing supplies', 20, 'للقطعة', 'per item'],
    ['BM-04', 'مواد بناء بالكميات (أسمنت، طابوق، حديد)', 'Bulk building materials', 1500, 'للطلب', 'per order']
   ]},
  {code: 'EL', kind: 'goods', icon: '📱', ar: 'إلكترونيات وإكسسوارات', en: 'Electronics & Accessories',
   about_ar: 'جوالات وإكسسوارات وشواحن وسماعات وأجهزة ذكية.', about_en: 'Phones, accessories, chargers, headphones and smart devices.',
   items: [
    ['EL-01', 'إكسسوارات جوال', 'Phone accessories', 30, 'للقطعة', 'per item'],
    ['EL-02', 'سماعات وشواحن', 'Headphones & chargers', 50, 'للقطعة', 'per item'],
    ['EL-03', 'أجهزة منزلية ذكية', 'Smart home devices', 150, 'للجهاز', 'per device']
   ]},
  {code: 'PT', kind: 'goods', icon: '🐾', ar: 'مستلزمات الحيوانات الأليفة', en: 'Pet Supplies',
   about_ar: 'أغذية ورمل ومستلزمات العناية بالقطط والكلاب والطيور.', about_en: 'Food, litter and care supplies for cats, dogs and birds.',
   items: [
    ['PT-01', 'أغذية الحيوانات الأليفة', 'Pet food', 45, 'للكيس', 'per bag'],
    ['PT-02', 'رمل ومستلزمات عناية', 'Litter & care supplies', 35, 'للعبوة', 'per pack']
   ]},
  {code: 'FG', kind: 'goods', icon: '💐', ar: 'زهور وهدايا', en: 'Flowers & Gifts',
   about_ar: 'باقات ورد وتنسيقات وهدايا مغلفة مع بطاقة إهداء.', about_en: 'Bouquets, arrangements and wrapped gifts with a card.',
   items: [
    ['FG-01', 'باقة ورد', 'Flower bouquet', 120, 'للباقة', 'per bouquet'],
    ['FG-02', 'تنسيق ورد للمناسبات', 'Event flower arrangement', 400, 'للتنسيق', 'per arrangement'],
    ['FG-03', 'هدية مغلفة مع بطاقة', 'Wrapped gift with a card', 100, 'للهدية', 'per gift']
   ]},
  // ---------- الخدمات ----------
  {code: 'DL', kind: 'service', icon: '🛵', ar: 'توصيل وشحن', en: 'Delivery & Courier',
   about_ar: 'توصيل الطلبات والطرود داخل قطر عبر شركات توصيل معتمدة.', about_en: 'Delivery of orders and parcels across Qatar by accredited couriers.',
   items: [
    ['DL-01', 'توصيل داخل الدوحة', 'Delivery within Doha', 15, 'للطلب', 'per order'],
    ['DL-02', 'توصيل خارج الدوحة', 'Delivery outside Doha', 30, 'للطلب', 'per order'],
    ['DL-03', 'توصيل سريع خلال ساعتين', 'Express delivery within 2 hours', 35, 'للطلب', 'per order'],
    ['DL-04', 'شحن طرود للشركات', 'Business parcel shipping', 20, 'للطرد', 'per parcel']
   ]},
  {code: 'HC', kind: 'service', icon: '🧽', ar: 'تنظيف منازل ومكاتب', en: 'Home & Office Cleaning',
   about_ar: 'عاملات وفرق تنظيف بالساعة وتنظيف عميق وتعقيم من شركات مرخصة.', about_en: 'Hourly cleaners, deep cleaning and sanitisation by licensed companies.',
   items: [
    ['HC-01', 'عاملة تنظيف بالساعة', 'Hourly cleaner', 35, 'للساعة', 'per hour'],
    ['HC-02', 'تنظيف عميق للشقة', 'Apartment deep clean', 450, 'للشقة', 'per apartment'],
    ['HC-03', 'تنظيف كنب وسجاد', 'Sofa & carpet cleaning', 150, 'للزيارة', 'per visit'],
    ['HC-04', 'تعقيم ومكافحة حشرات', 'Sanitisation & pest control', 250, 'للزيارة', 'per visit']
   ]},
  {code: 'MN', kind: 'service', icon: '🔧', ar: 'صيانة منزلية', en: 'Home Maintenance',
   about_ar: 'فنيون معتمدون للكهرباء والسباكة والتكييف والنجارة والدهان.', about_en: 'Accredited technicians for electrical, plumbing, AC, carpentry and painting.',
   items: [
    ['MN-01', 'فني كهرباء', 'Electrician visit', 100, 'للزيارة', 'per visit'],
    ['MN-02', 'فني سباكة', 'Plumber visit', 100, 'للزيارة', 'per visit'],
    ['MN-03', 'صيانة وتنظيف مكيفات', 'AC service & cleaning', 120, 'للمكيف', 'per unit'],
    ['MN-04', 'نجارة وتركيب أثاث', 'Carpentry & furniture assembly', 120, 'للزيارة', 'per visit'],
    ['MN-05', 'دهان غرف', 'Room painting', 400, 'للغرفة', 'per room']
   ]},
  {code: 'MV', kind: 'service', icon: '🚚', ar: 'نقل أثاث', en: 'Moving',
   about_ar: 'نقل وفك وتركيب الأثاث وتغليفه داخل قطر.', about_en: 'Moving, dismantling, assembly and packing within Qatar.',
   items: [
    ['MV-01', 'نقل أثاث شقة', 'Apartment move', 900, 'للنقلة', 'per move'],
    ['MV-02', 'نقل أثاث فيلا', 'Villa move', 2000, 'للنقلة', 'per move'],
    ['MV-03', 'نقل قطع محددة', 'Single-item moving', 150, 'للنقلة', 'per trip']
   ]},
  {code: 'EV', kind: 'service', icon: '🎉', ar: 'مناسبات وضيافة', en: 'Events & Hospitality',
   about_ar: 'تنظيم مناسبات وخيام وضيافة وقهوجية وتصوير.', about_en: 'Event planning, tents, hospitality, coffee servers and photography.',
   items: [
    ['EV-01', 'تنظيم مناسبة صغيرة', 'Small event planning', 1500, 'للمناسبة', 'per event'],
    ['EV-02', 'قهوجي وضيافة', 'Coffee server & hospitality', 400, 'للمناسبة', 'per event'],
    ['EV-03', 'تأجير خيام وكراسي وطاولات', 'Tents, chairs & tables rental', 800, 'للمناسبة', 'per event'],
    ['EV-04', 'تصوير فوتوغرافي وفيديو', 'Photo & video', 800, 'للمناسبة', 'per event']
   ]},
  {code: 'LD', kind: 'service', icon: '👔', ar: 'غسيل وكي', en: 'Laundry & Ironing',
   about_ar: 'غسيل وكي وتنظيف جاف مع الاستلام والتوصيل.', about_en: 'Washing, ironing and dry cleaning with pickup and delivery.',
   items: [
    ['LD-01', 'غسيل وكي ملابس', 'Wash & iron', 5, 'للقطعة', 'per item'],
    ['LD-02', 'تنظيف جاف', 'Dry cleaning', 12, 'للقطعة', 'per item'],
    ['LD-03', 'غسيل بطانيات وستائر', 'Blankets & curtains', 30, 'للقطعة', 'per item']
   ]},
  {code: 'CS', kind: 'service', icon: '🚗', ar: 'خدمات السيارات', en: 'Car Services',
   about_ar: 'غسيل سيارات متنقل وتبديل زيت وبطاريات وإطارات في موقعك.', about_en: 'Mobile car wash, oil change, batteries and tyres at your location.',
   items: [
    ['CS-01', 'غسيل سيارة متنقل', 'Mobile car wash', 50, 'للسيارة', 'per car'],
    ['CS-02', 'تبديل زيت في الموقع', 'On-site oil change', 150, 'للسيارة', 'per car'],
    ['CS-03', 'تبديل بطارية', 'Battery replacement', 300, 'للبطارية', 'per battery'],
    ['CS-04', 'سطحة ونقل سيارة', 'Tow truck', 200, 'للمشوار', 'per trip']
   ]},
  {code: 'DM', kind: 'service', icon: '📣', ar: 'تسويق وتصميم وطباعة', en: 'Marketing, Design & Print',
   about_ar: 'إدارة حسابات التواصل الاجتماعي وتصوير المنتجات والتصميم والطباعة لأصحاب المشاريع.', about_en: 'Social media management, product photography, design and printing for businesses.',
   items: [
    ['DM-01', 'إدارة حسابات التواصل الاجتماعي', 'Social media management', 1500, 'شهرياً', 'per month'],
    ['DM-02', 'تصوير منتجات احترافي', 'Product photography', 500, 'للجلسة', 'per session'],
    ['DM-03', 'تصميم شعار وهوية', 'Logo & brand identity', 800, 'للمشروع', 'per project'],
    ['DM-04', 'طباعة بطاقات ومنشورات', 'Cards & flyers printing', 150, 'للطلب', 'per order']
   ]},
  {code: 'ED', kind: 'service', icon: '📚', ar: 'تعليم ودروس', en: 'Tutoring & Courses',
   about_ar: 'مدرسون ومراكز تدريب معتمدة للدروس الخصوصية والدورات واللغات.', about_en: 'Accredited tutors and training centres for lessons, courses and languages.',
   items: [
    ['ED-01', 'درس خصوصي', 'Private lesson', 150, 'للساعة', 'per hour'],
    ['ED-02', 'دورة لغة', 'Language course', 800, 'للدورة', 'per course'],
    ['ED-03', 'تحفيظ قرآن', 'Quran memorisation', 400, 'شهرياً', 'per month']
   ]}
 ],
 // نسب العمولة الاسترشادية التي يحصل عليها جاهز من الشريك المعتمد عن كل طلب منفّذ، وتُحدَّد نهائياً في عقد الشراكة
 COMMISSION: [
  {ar: 'بقالة وخضار ومواد تموينية', en: 'Groceries, produce & pantry', min: 5, max: 10},
  {ar: 'لحوم وأسماك وألبان ومخبوزات', en: 'Meat, fish, dairy & bakery', min: 7, max: 12},
  {ar: 'مطاعم ووجبات جاهزة', en: 'Restaurants & ready meals', min: 12, max: 20},
  {ar: 'مواد ومستلزمات وإلكترونيات', en: 'Goods, supplies & electronics', min: 8, max: 15},
  {ar: 'خدمات منزلية وصيانة ونقل', en: 'Home services, maintenance & moving', min: 10, max: 20},
  {ar: 'مناسبات وتسويق وتعليم', en: 'Events, marketing & tutoring', min: 10, max: 15}
 ],
 // مستويات الشراكة للتجار ومقدمي الخدمات
 TIERS: [
  {key: 'basic', ar: 'شريك معتمد', en: 'Accredited Partner', fee: 0,
   feat_ar: ['بدون رسوم اشتراك، عمولة على الطلبات المنفّذة فقط', 'ظهور منتجاتك أو خدماتك في قسمها', 'تحويل الطلبات إليك مباشرة عبر واتساب', 'تسوية الحسابات شهرياً بكشف واضح'],
   feat_en: ['No subscription, commission on fulfilled orders only', 'Your products or services listed in their category', 'Orders forwarded to you directly on WhatsApp', 'Monthly settlement with a clear statement']},
  {key: 'plus', ar: 'شريك مميز', en: 'Featured Partner', fee: 500,
   feat_ar: ['كل مزايا الشريك المعتمد', 'خصم نقطتين من نسبة العمولة', 'ظهور مميز في الصفحة الرئيسية وحملات التواصل الاجتماعي', 'أولوية في توزيع الطلبات داخل منطقتك', 'تقرير شهري بالطلبات والتقييمات'],
   feat_en: ['Everything in Accredited Partner', '2 points off the commission rate', 'Featured on the home page and social campaigns', 'Priority for orders in your area', 'Monthly orders and ratings report']},
  {key: 'pro', ar: 'شريك استراتيجي', en: 'Strategic Partner', fee: null,
   feat_ar: ['للشركات الكبيرة وسلاسل التوريد', 'نسب عمولة وعقود خاصة حسب الحجم', 'ربط الطلبات بنظامك وتقارير أسبوعية', 'مدير حساب مخصص'],
   feat_en: ['For large companies and supply chains', 'Custom commission and contract by volume', 'Order integration and weekly reports', 'Dedicated account manager']}
 ]
};
