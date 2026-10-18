// بيانات الخدمات والأسعار والباقات. عدّل الأسعار هنا فقط وسيتحدث الموقع كله.
// كل خدمة: [الرمز، الاسم، ما تشمله، السعر بالريال، هل هي ضمن الخدمات الرئيسية]
// الباقة التي فيها scope: "all" تغطي كل الخدمات عدا باقات التأسيس.
const DATA = {
 "G": [
  [
   "MC",
   "وزارة التجارة والصناعة (النافذة الواحدة)",
   [
    [
     "MC-01",
     "حجز اسم تجاري",
     "البحث عن الاسم، تقديم الطلب، متابعة الاعتماد",
     200,
     true
    ],
    [
     "MC-02",
     "إصدار سجل تجاري جديد",
     "تجهيز النموذج والمرفقات، التقديم، متابعة الإصدار وتسليم نسخة",
     600,
     false
    ],
    [
     "MC-03",
     "تجديد سجل تجاري",
     "مراجعة الصلاحية والمخالفات، التقديم، سداد الرسم كعهدة، تسليم المستخرج",
     350,
     true
    ],
    [
     "MC-04",
     "تعديل سجل: إضافة أو حذف نشاط",
     "دراسة رمز النشاط وشروطه، التقديم، متابعة الموافقات المرتبطة",
     450,
     true
    ],
    [
     "MC-05",
     "تعديل سجل: العنوان أو رأس المال أو الاسم",
     "تجهيز المستندات، التقديم، تحديث البيانات لدى الجهات الأخرى عند الطلب",
     450,
     true
    ],
    [
     "MC-06",
     "تعديل المفوضين بالتوقيع أو المدير",
     "تجهيز قرار التعيين، التقديم، تحديث السجل",
     400,
     true
    ],
    [
     "MC-07",
     "إصدار أو تجديد الرخصة التجارية",
     "تجهيز عقد الإيجار والمرفقات، التقديم، متابعة الفحص إن وُجد",
     400,
     true
    ],
    [
     "MC-08",
     "مستخرج سجل أو شهادة قيد أو شهادة بيانات",
     "طلب المستخرج إلكترونياً وتسليمه",
     150,
     true
    ],
    [
     "MC-09",
     "فتح فرع جديد للمنشأة",
     "سجل الفرع والرخصة وتحديث بطاقة المنشأة",
     750,
     false
    ],
    [
     "MC-10",
     "ترخيص عمل منزلي",
     "دراسة النشاط المسموح، التقديم، المتابعة حتى الإصدار",
     600,
     false
    ],
    [
     "MC-11",
     "شطب سجل وإغلاق منشأة",
     "تسلسل الإغلاق لدى التجارة والداخلية والعمل والضرائب",
     1500,
     false
    ],
    [
     "MC-12",
     "ترقية سجل فرع إلى سجل رئيسي",
     "دراسة الشروط، تجهيز الطلب، متابعة إصدار السجل الرئيسي",
     450,
     false
    ],
    [
     "MC-13",
     "شطب سجل فرع",
     "تسوية الالتزامات المرتبطة بالفرع، تقديم طلب الشطب، تحديث السجل الرئيسي",
     400,
     false
    ],
    [
     "MC-14",
     "بيع المحل التجاري أو التنازل عنه",
     "تجهيز عقد التنازل، نقل ملكية سجل المؤسسة الفردية، تحديث الرخصة وبطاقة المنشأة",
     900,
     false
    ],
    [
     "MC-15",
     "قيد رهن المحل التجاري أو فكه",
     "تجهيز مستندات جهة التمويل، قيد الرهن في السجل، شطبه عند السداد",
     1200,
     false
    ],
    [
     "MC-16",
     "الإفصاح عن المستفيد الحقيقي",
     "تجهيز بيانات المالك المستفيد، تقديمها في السجل الاقتصادي الموحد، تحديثها عند التغيير",
     350,
     true
    ],
    [
     "MC-17",
     "رخصة التجارة الإلكترونية",
     "التحقق من النشاط المسموح، ربط الموقع أو المتجر، التقديم حتى الإصدار (رسم الوزارة 500 ر.ق)",
     500,
     false
    ],
    [
     "MC-18",
     "ترخيص التخفيضات والعروض الترويجية",
     "تجهيز قائمة الأصناف والأسعار قبل وبعد الخصم، التقديم، تسليم الترخيص",
     300,
     true
    ],
    [
     "MC-19",
     "ترخيص المسابقات والسحوبات الترويجية",
     "تجهيز شروط المسابقة والجوائز، التقديم، تنسيق حضور مندوب الوزارة للسحب",
     600,
     false
    ],
    [
     "MC-20",
     "ترخيص تنظيم معرض استهلاكي",
     "تجهيز ملف المعرض والمشاركين، التقديم، متابعة الموافقة",
     2500,
     false
    ],
    [
     "MC-21",
     "تسجيل أسعار السلع لأول مرة (حتى 25 صنفاً)",
     "إدخال الأصناف والباركود والأسعار في المنصة الرقمية للأسعار حتى الاعتماد",
     400,
     true
    ],
    [
     "MC-22",
     "إضافة سلع بدون بيان جمركي (حتى 50 صنفاً)",
     "رفع بيانات الأصناف غير المسجلة دفعة واحدة، ثم استكمال تسجيل أسعارها",
     600,
     false
    ],
    [
     "MC-23",
     "تسجيل المنتجات بعد التخليص الجمركي",
     "تسجيل أصناف الشحنة المرتبطة بالبيان الجمركي في منصة الوزارة",
     350,
     true
    ],
    [
     "MC-24",
     "تحديث بيانات أو أسعار منتجات مسجلة",
     "تعديل الوصف أو الباركود أو خفض السعر في المنصة",
     250,
     true
    ],
    [
     "MC-25",
     "طلب زيادة سعر سلعة أو خدمة",
     "للسلع والخدمات الخاضعة لموافقة لجنة الأسعار: ملف التكلفة والفواتير، التقديم، متابعة القرار",
     1500,
     false
    ],
    [
     "MC-26",
     "تسجيل كتالوج منتجات كامل (حتى 300 صنف)",
     "تنظيم الكتالوج، مطابقة الباركود والفئات، الرفع والتسجيل حتى الاعتماد",
     2500,
     false
    ],
    [
     "MC-27",
     "الرد على شكوى مستهلك ومتابعتها",
     "إعداد رد المنشأة ومستنداتها، تقديمه، متابعة الشكوى حتى إغلاقها",
     600,
     false
    ],
    [
     "MC-28",
     "التظلم من مخالفة أو غرامة أو إغلاق",
     "مراجعة المخالفة، صياغة التظلم، تقديمه ومتابعة البت فيه",
     900,
     false
    ],
    [
     "MC-29",
     "استدعاء منتج معيب",
     "إبلاغ الوزارة، إعداد خطة السحب، تقارير المتابعة حتى إغلاق الحملة",
     3500,
     false
    ],
    [
     "MC-30",
     "الاعتراض على علامة منشورة أو الرد عليه",
     "صياغة الاعتراض أو الرد خلال المدة النظامية ومتابعته",
     2500,
     false
    ],
    [
     "MC-31",
     "التسجيل الدولي للعلامة عبر نظام مدريد",
     "تجهيز الطلب الدولي واختيار الدول، التقديم، متابعة القبول",
     3500,
     false
    ],
    [
     "MC-32",
     "تسجيل براءة اختراع وإدارتها",
     "التنسيق مع وكيل براءات معتمد حتى المنح، ومتابعة الرسوم السنوية",
     6000,
     false
    ],
    [
     "MC-33",
     "تسجيل رسم أو نموذج صناعي",
     "تجهيز الرسومات والوصف، الإيداع، متابعة الإصدار",
     2500,
     false
    ],
    [
     "MC-34",
     "حماية مصنف أدبي أو فني",
     "إيداع المصنف وإثبات حق المؤلف",
     900,
     false
    ],
    [
     "MC-35",
     "تعديل الترخيص الصناعي أو تجديده",
     "توسعة الطاقة أو إضافة منتج أو خط إنتاج، التقديم في منصة الخدمات الصناعية",
     4500,
     false
    ],
    [
     "MC-36",
     "شهادة المنتج الوطني",
     "تجهيز ملف المنتج والمصنع، التقديم، متابعة إصدار الشهادة",
     3000,
     false
    ],
    [
     "MC-37",
     "إصدار بطاقة تموين أو بدل فاقد",
     "تقديم الطلب للأسرة وتسليم البطاقة (رسم الوزارة 50 ر.ق)",
     100,
     true
    ],
    [
     "MC-38",
     "بطاقة الأعلاف لمربي الماشية",
     "إصدار البطاقة أو تحديث أعداد الماشية",
     200,
     true
    ],
    [
     "MC-39",
     "التسجيل في رقابة مكافحة غسل الأموال",
     "للأعمال غير المالية الخاضعة كوسطاء العقار وتجار الذهب: التسجيل وتقارير الامتثال السنوية",
     3500,
     false
    ]
   ]
  ],
  [
   "MI",
   "وزارة الداخلية (الجوازات ومطراش2)",
   [
    [
     "MI-01",
     "إصدار بطاقة المنشأة (قيد منشأة)",
     "تجهيز المستندات، التقديم، استلام البطاقة",
     450,
     true
    ],
    [
     "MI-02",
     "تجديد أو تعديل بطاقة المنشأة",
     "تحديث المفوضين والبيانات والتجديد السنوي",
     350,
     true
    ],
    [
     "MI-03",
     "طلب تأشيرة عمل (استقدام)",
     "تقديم الطلب على الحصة المعتمدة ومتابعة الصدور",
     400,
     true
    ],
    [
     "MI-04",
     "إصدار إقامة لموظف جديد",
     "تنسيق الفحص الطبي والبصمة، تقديم الإقامة، استلام البطاقة",
     500,
     true
    ],
    [
     "MI-05",
     "تجديد إقامة موظف",
     "التحقق من الجواز والمخالفات، التجديد، الطباعة والتسليم",
     250,
     true
    ],
    [
     "MI-06",
     "إلغاء إقامة أو مغادرة نهائية",
     "تسوية الملف، الإلغاء، إصدار ما يثبت المغادرة",
     250,
     true
    ],
    [
     "MI-07",
     "نقل كفالة أو تغيير جهة عمل",
     "تجهيز الموافقات المطلوبة، التقديم، المتابعة حتى النقل",
     500,
     true
    ],
    [
     "MI-08",
     "تأشيرة زيارة عمل أو زيارة تجارية",
     "طلب التأشيرة للضيف ومتابعة الصدور",
     300,
     true
    ],
    [
     "MI-09",
     "نقل بيانات جواز جديد إلى الإقامة",
     "تحديث البيانات بعد تجديد الجواز",
     200,
     true
    ],
    [
     "MI-10",
     "بدل فاقد أو تالف لبطاقة الإقامة",
     "الإبلاغ، الطلب، الاستلام",
     250,
     true
    ],
    [
     "MI-11",
     "تأشيرة زيارة عائلية",
     "تجهيز المستندات والراتب والسكن، التقديم، المتابعة",
     300,
     false
    ],
    [
     "MI-12",
     "إقامة عائلية (لمّ شمل)",
     "طلب الاستقدام، الفحص الطبي والبصمة، إصدار الإقامات",
     600,
     false
    ],
    [
     "MI-13",
     "تجديد إقامة فرد من العائلة",
     "التجديد والطباعة",
     250,
     false
    ],
    [
     "MI-14",
     "إقامة لعامل منزلي",
     "الاستقدام أو النقل، الفحص، إصدار الإقامة",
     600,
     false
    ]
   ]
  ],
  [
   "ML",
   "وزارة العمل",
   [
    [
     "ML-01",
     "طلب موافقة استقدام عمالة (حصة)",
     "دراسة الاحتياج، تقديم الطلب بالمهن والجنسيات، متابعة الموافقة",
     500,
     true
    ],
    [
     "ML-02",
     "توثيق عقد عمل إلكترونياً",
     "إدخال العقد واعتماده للموظف",
     200,
     true
    ],
    [
     "ML-03",
     "تغيير مهنة موظف",
     "تجهيز الطلب ومتابعة الاعتماد",
     350,
     true
    ],
    [
     "ML-04",
     "تصريح عمل لمرافق (زوج أو زوجة على كفالة العائل)",
     "التقديم ومتابعة التصريح",
     400,
     false
    ],
    [
     "ML-05",
     "تسجيل المنشأة في نظام حماية الأجور (WPS)",
     "تنسيق البنك والوزارة وأول ملف رواتب",
     500,
     true
    ],
    [
     "ML-06",
     "تحديث بيانات المنشأة لدى وزارة العمل",
     "تحديث المفوضين والعنوان والنشاط",
     250,
     true
    ]
   ]
  ],
  [
   "MH",
   "الصحة والفحص الطبي",
   [
    [
     "MH-01",
     "حجز ومتابعة الفحص الطبي للإقامة",
     "الحجز، تنسيق الحضور، استلام النتيجة",
     150,
     true
    ],
    [
     "MH-02",
     "إصدار أو تجديد البطاقة الصحية",
     "التقديم والاستلام",
     100,
     true
    ],
    [
     "MH-03",
     "الشهادة الصحية للعاملين في الأغذية",
     "الحجز والفحص والاستلام لكل عامل",
     200,
     true
    ],
    [
     "MH-04",
     "تنسيق ترخيص مزاولة مهنة صحية",
     "تجهيز ملف المهني ومتابعة التقييم والتسجيل",
     1000,
     false
    ]
   ]
  ],
  [
   "MB",
   "وزارة البلدية",
   [
    [
     "MB-01",
     "توثيق عقد إيجار تجاري أو سكني",
     "تسجيل العقد لدى مكتب تسجيل الإيجارات",
     300,
     true
    ],
    [
     "MB-02",
     "ترخيص لوحة إعلانية للمحل",
     "تجهيز التصميم والمقاسات، التقديم، المتابعة",
     500,
     true
    ],
    [
     "MB-03",
     "موافقات بلدية للنشاط (اشتراطات الموقع)",
     "تحديد الاشتراطات، التقديم، متابعة الكشف",
     600,
     false
    ],
    [
     "MB-04",
     "ترخيص منشأة غذائية",
     "تنسيق الاشتراطات الصحية والبلدية حتى الترخيص",
     1500,
     false
    ]
   ]
  ],
  [
   "CD",
   "الدفاع المدني",
   [
    [
     "CD-01",
     "شهادة دفاع مدني لمحل أو مكتب",
     "قائمة الاشتراطات، تنسيق المورّد عند الحاجة، طلب الكشف، الإصدار",
     700,
     false
    ],
    [
     "CD-02",
     "تجديد شهادة الدفاع المدني",
     "التأكد من صيانة الأنظمة، التقديم، المتابعة",
     400,
     true
    ]
   ]
  ],
  [
   "TX",
   "الهيئة العامة للضرائب (منصة ضريبة)",
   [
    [
     "TX-01",
     "التسجيل الضريبي وإصدار البطاقة الضريبية",
     "فتح الحساب، تسجيل المنشأة، استلام البطاقة",
     600,
     true
    ],
    [
     "TX-02",
     "تحديث بيانات ضريبية",
     "تحديث المفوضين والعنوان والنشاط",
     250,
     true
    ],
    [
     "TX-03",
     "شهادة براءة ذمة ضريبية",
     "التقديم ومتابعة الإصدار",
     300,
     true
    ],
    [
     "TX-04",
     "تقديم الإقرار الضريبي السنوي",
     "تنسيق مع محاسب مرخص، الرفع والمتابعة",
     500,
     false
    ]
   ]
  ],
  [
   "QC",
   "غرفة قطر",
   [
    [
     "QC-01",
     "تسجيل أو تجديد عضوية الغرفة",
     "التقديم وسداد الاشتراك كعهدة",
     250,
     true
    ],
    [
     "QC-02",
     "تصديق مستند تجاري (فاتورة، عقد، خطاب)",
     "التقديم والاستلام لكل مستند",
     150,
     true
    ],
    [
     "QC-03",
     "شهادة منشأ",
     "تجهيز الطلب والمستندات، الإصدار",
     250,
     false
    ]
   ]
  ],
  [
   "JS",
   "وزارة العدل والتصديقات",
   [
    [
     "JS-01",
     "تحرير وتوثيق توكيل",
     "تنسيق الصيغة، الموعد، الحضور، الاستلام",
     300,
     true
    ],
    [
     "JS-02",
     "توثيق إقرار أو عقد",
     "تنسيق الموعد والتوثيق",
     300,
     true
    ],
    [
     "JS-03",
     "تصديق شهادة أو مستند من وزارة الخارجية",
     "التقديم والاستلام لكل مستند",
     150,
     true
    ],
    [
     "JS-04",
     "معادلة شهادة دراسية",
     "تجهيز الملف والتقديم والمتابعة",
     500,
     false
    ],
    [
     "JS-05",
     "ترجمة معتمدة",
     "عبر مكتب مرخص؛ الأتعاب حسب الصفحات",
     100,
     false
    ]
   ]
  ],
  [
   "TR",
   "الإدارة العامة للمرور",
   [
    [
     "TR-01",
     "تجديد استمارة مركبة",
     "تنسيق الفحص الفني والتأمين والتجديد",
     200,
     true
    ],
    [
     "TR-02",
     "نقل ملكية مركبة",
     "تنسيق البائع والمشتري والتأمين والنقل",
     300,
     true
    ],
    [
     "TR-03",
     "تجديد رخصة قيادة",
     "التجديد والطباعة",
     150,
     true
    ],
    [
     "TR-04",
     "سداد مخالفات واستخراج شهادة خلو",
     "الاستعلام والسداد كعهدة والاستلام",
     100,
     true
    ]
   ]
  ],
  [
   "UT",
   "كهرماء والخدمات والبنوك",
   [
    [
     "UT-01",
     "فتح أو نقل اشتراك كهرباء وماء",
     "تجهيز المستندات، التقديم، المتابعة",
     300,
     true
    ],
    [
     "UT-02",
     "براءة ذمة كهرماء",
     "الاستعلام والسداد والإصدار",
     150,
     true
    ],
    [
     "UT-03",
     "تجهيز ملف فتح حساب بنكي للشركة",
     "جمع المستندات، الحجز، مرافقة المفوض",
     600,
     false
    ],
    [
     "UT-04",
     "تحديث بيانات الشركة أو المفوضين لدى البنك",
     "تجهيز المستندات والمتابعة",
     300,
     true
    ],
    [
     "UT-05",
     "طلب خطوط اتصال وإنترنت للشركة",
     "تجهيز المستندات والطلب",
     150,
     true
    ]
   ]
  ],
  [
   "AU",
   "المزادات (المحاكم والجمارك واللوحات والبلدية)",
   [
    [
     "AU-01",
     "التسجيل في منصة مزادات وتجهيز التأمين",
     "فتح الحساب عبر توثيق أو مطراش، شرح شروط المزاد، تجهيز مبلغ التأمين وطريقة سداده",
     300,
     false
    ],
    [
     "AU-02",
     "المتابعة الكاملة للمشاركة في مزاد",
     "متابعة مواعيد المزاد، معاينة الشروط والصنف، تجهيز التأمين، مرافقتك أثناء المزايدة، وتبقى المزايدة وقرارها بيدك",
     600,
     false
    ],
    [
     "AU-03",
     "إجراءات ما بعد الفوز في المزاد",
     "سداد القيمة والرسوم للجهة المنظمة، النقل والتسجيل باسمك (سيارة أو لوحة أو صنف)، استرداد التأمين عند عدم الفوز",
     450,
     false
    ]
   ]
  ]
 ],
 "SETUP": [
  [
   "ST-01",
   "باقة تأسيس مؤسسة فردية",
   "حجز الاسم، السجل، الرخصة التجارية، بطاقة المنشأة، التسجيل الضريبي، غرفة قطر، توثيق الإيجار",
   2500
  ],
  [
   "ST-02",
   "باقة تأسيس شركة ذ.م.م",
   "البنود السابقة + تنسيق عقد التأسيس مع الجهة الموثقة + ملف الحساب البنكي",
   3500
  ],
  [
   "ST-03",
   "باقة تأسيس لمستثمر غير قطري",
   "تأسيس ذ.م.م + ترخيص الاستثمار + إقامة المستثمر + ملف البنك",
   5000
  ],
  [
   "ST-04",
   "باقة تشغيل منشأة جديدة",
   "بعد التأسيس: حصة استقدام + تأشيرات + إقامات أول 3 موظفين + WPS",
   3000
  ]
 ],
 "PLANS": [
  {
   "key": "basic",
   "name": "أساس",
   "n": 6,
   "m": 1500,
   "y": 15000,
   "extra": 15,
   "staff": "حتى 10 موظفين",
   "feat": [
    "6 خدمات شهرياً من الخدمات الرئيسية",
    "ملف حكومي رقمي للمنشأة",
    "تنبيهات التجديد قبل 30 يوماً",
    "تقرير شهري بحالة المعاملات",
    "خصم 15% على أي خدمة إضافية"
   ]
  },
  {
   "key": "full",
   "name": "شامل",
   "n": 15,
   "m": 3500,
   "y": 35000,
   "extra": 25,
   "staff": "حتى 30 موظفاً",
   "feat": [
    "15 خدمة شهرياً من الخدمات الرئيسية",
    "مندوب مخصص ورقم تواصل مباشر",
    "التقديم في نفس يوم اكتمال المستندات",
    "اجتماع شهري وتقويم امتثال سنوي",
    "خصم 25% على الخدمات الإضافية وباقات التأسيس"
   ]
  },
  {
   "key": "elite",
   "name": "نخبة",
   "n": 30,
   "m": 5900,
   "y": 59000,
   "extra": 30,
   "staff": "حتى 75 موظفاً وحتى 3 سجلات تجارية",
   "scope": "all",
   "feat": [
    "30 خدمة شهرياً من كل الخدمات الـ90، وليس الرئيسية فقط",
    "مدير علاقات حكومية مخصص ومندوب ميداني للزيارات",
    "التقديم في نفس اليوم وأولوية في المتابعة",
    "تغطية حتى 3 سجلات تجارية أو فروع",
    "مراجعة امتثال ربع سنوية وتقرير للإدارة",
    "خصم 30% على الخدمات الإضافية وباقات التأسيس"
   ]
  },
  {
   "key": "gold",
   "name": "الذهبية",
   "n": 50,
   "m": 9500,
   "y": 95000,
   "extra": 35,
   "staff": "حتى 150 موظفاً وحتى 10 سجلات تجارية",
   "scope": "all",
   "feat": [
    "50 خدمة شهرياً من كل الخدمات الـ90",
    "فريق مخصص: مدير علاقات حكومية ومندوبان",
    "باقة تأسيس مجانية كل سنة (شركة أو مؤسسة أو فرع)",
    "استلام وتسليم المستندات من مقر العميل",
    "رد خلال ساعة عمل واجتماع شهري في مقر العميل",
    "تغطية حتى 10 سجلات تجارية وفروع",
    "خصم 35% على الخدمات الإضافية"
   ]
  }
 ]
};

// الدراسات والاستشارات: كل نوع وخدماته. p السعر بالريال، from=true يعني «يبدأ من». هذه الخدمات خارج عدد الباقات.
DATA.CONSULT = [
 {
  "code": "CA",
  "ar": "الاستشارات الإدارية والتنظيمية",
  "en": "Management & Organizational Consulting",
  "about_ar": "نساعد المنشآت على بناء هيكل واضح وإجراءات موثقة وحوكمة فعالة ترفع كفاءة الإدارة وتدعم النمو.",
  "about_en": "We help organizations build a clear structure, documented procedures and effective governance that improve management and support growth.",
  "items": [
   {
    "c": "CA-01",
    "p": 7000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "تصميم الهيكل التنظيمي",
     "inc": "تحليل الوضع الحالي، تصميم الهيكل والمستويات الإدارية، خطوط السلطة والمسؤولية، مصفوفة الصلاحيات، ورشة اعتماد مع الإدارة",
     "about": "نصمم هيكلاً تنظيمياً يناسب حجم المنشأة وطبيعة نشاطها ويوضح الأدوار والتبعيات الإدارية.",
     "docs": [
      "السجل التجاري",
      "قائمة الموظفين الحالية ومسمياتهم",
      "الهيكل الحالي إن وجد",
      "خطط التوسع المتوقعة"
     ],
     "time": "3 إلى 4 أسابيع",
     "out": "خريطة الهيكل التنظيمي، دليل التنظيم، مصفوفة الصلاحيات"
    },
    "en": {
     "n": "Organizational Structure Design",
     "inc": "Current-state review, structure and management levels, lines of authority, delegation of authority matrix, sign-off workshop with management",
     "about": "We design an organizational structure that fits the size and activity of your business and clarifies roles and reporting lines.",
     "docs": [
      "Commercial registration",
      "Current staff list and titles",
      "Existing structure if any",
      "Expected expansion plans"
     ],
     "time": "3 to 4 weeks",
     "out": "Organization chart, organization manual, delegation of authority matrix"
    }
   },
   {
    "c": "CA-02",
    "p": 9000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "دليل السياسات والإجراءات",
     "inc": "حصر العمليات، توثيق السياسات، كتابة الإجراءات التشغيلية القياسية، النماذج والمخططات الانسيابية، تدريب الفريق على التطبيق",
     "about": "نوثق طريقة العمل في الإدارات الرئيسية في دليل معتمد يضمن توحيد الأداء وتقليل الأخطاء.",
     "docs": [
      "الهيكل التنظيمي",
      "النماذج والمستندات المستخدمة حالياً",
      "تحديد الإدارات المشمولة",
      "منسق من طرف المنشأة"
     ],
     "time": "4 إلى 6 أسابيع",
     "out": "دليل السياسات والإجراءات، نماذج العمل، مخططات انسيابية للعمليات"
    },
    "en": {
     "n": "Policies & Procedures Manual (SOPs)",
     "inc": "Process inventory, policy documentation, standard operating procedures, forms and flowcharts, team training on rollout",
     "about": "We document how your main departments work in an approved manual that standardizes performance and reduces errors.",
     "docs": [
      "Organization chart",
      "Forms and documents currently in use",
      "List of departments in scope",
      "A coordinator from your side"
     ],
     "time": "4 to 6 weeks",
     "out": "Policies and procedures manual, work forms, process flowcharts"
    }
   },
   {
    "c": "CA-03",
    "p": 12000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "حوكمة الشركات العائلية",
     "inc": "تقييم وضع الحوكمة، ميثاق العائلة، فصل الملكية عن الإدارة، تشكيل مجلس الإدارة واللجان، سياسة تعارض المصالح، خطة التعاقب",
     "about": "نضع إطار حوكمة يحمي استمرارية الشركة العائلية وينظم العلاقة بين الشركاء والإدارة والأجيال القادمة.",
     "docs": [
      "عقد التأسيس والنظام الأساسي",
      "قائمة الشركاء والحصص",
      "الهيكل الإداري الحالي",
      "مقابلات مع الشركاء الرئيسيين"
     ],
     "time": "6 إلى 8 أسابيع",
     "out": "ميثاق العائلة، دليل الحوكمة، لائحة مجلس الإدارة، خطة التعاقب"
    },
    "en": {
     "n": "Family Business Governance",
     "inc": "Governance assessment, family charter, separation of ownership and management, board and committees setup, conflict of interest policy, succession plan",
     "about": "We set up a governance framework that protects the continuity of the family business and organizes the relationship between partners, management and the next generation.",
     "docs": [
      "Memorandum and articles of association",
      "List of partners and shares",
      "Current management structure",
      "Interviews with key partners"
     ],
     "time": "6 to 8 weeks",
     "out": "Family charter, governance manual, board charter, succession plan"
    }
   },
   {
    "c": "CA-04",
    "p": 15000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "إعادة الهيكلة",
     "inc": "تشخيص الأداء الإداري والمالي، تحديد مواطن الهدر والازدواجية، بدائل إعادة الهيكلة، خطة التنفيذ المرحلية، متابعة التطبيق",
     "about": "نساعد المنشآت التي تواجه تراجعاً أو توسعاً سريعاً على إعادة ترتيب إداراتها ومواردها بما يحقق الكفاءة.",
     "docs": [
      "القوائم المالية لآخر سنتين",
      "الهيكل التنظيمي الحالي",
      "بيانات الموظفين والتكاليف",
      "أهداف الإدارة من إعادة الهيكلة"
     ],
     "time": "6 إلى 10 أسابيع",
     "out": "تقرير التشخيص، نموذج الهيكل الجديد، خطة تنفيذ زمنية"
    },
    "en": {
     "n": "Business Restructuring",
     "inc": "Management and financial diagnosis, identification of waste and overlap, restructuring options, phased implementation plan, rollout follow-up",
     "about": "We help businesses facing decline or rapid growth reorganize their departments and resources for better efficiency.",
     "docs": [
      "Financial statements for the last two years",
      "Current organization chart",
      "Staff and cost data",
      "Management objectives for the restructuring"
     ],
     "time": "6 to 10 weeks",
     "out": "Diagnostic report, new structure model, timed implementation plan"
    }
   },
   {
    "c": "CA-05",
    "p": 8000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "نظام إدارة الأداء ومؤشرات الأداء الرئيسية",
     "inc": "تحديد الأهداف المؤسسية، بناء مؤشرات الأداء لكل إدارة، بطاقات الأداء المتوازن، آلية القياس والتقارير، لوحة متابعة",
     "about": "نبني نظاماً لقياس الأداء يربط أهداف المنشأة بعمل الإدارات والأفراد بمؤشرات واضحة قابلة للقياس.",
     "docs": [
      "الخطة أو الأهداف السنوية",
      "الهيكل التنظيمي",
      "التقارير الدورية الحالية"
     ],
     "time": "4 إلى 5 أسابيع",
     "out": "دليل مؤشرات الأداء، بطاقات الأداء، نموذج لوحة متابعة"
    },
    "en": {
     "n": "Performance Management & KPIs",
     "inc": "Corporate objectives, KPIs per department, balanced scorecards, measurement and reporting method, monitoring dashboard",
     "about": "We build a performance measurement system that links company goals to departments and individuals through clear, measurable indicators.",
     "docs": [
      "Annual plan or objectives",
      "Organization chart",
      "Current periodic reports"
     ],
     "time": "4 to 5 weeks",
     "out": "KPI manual, scorecards, dashboard template"
    }
   },
   {
    "c": "CA-06",
    "p": 14000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "إعداد الخطة الاستراتيجية",
     "inc": "تحليل البيئة الداخلية والخارجية، الرؤية والرسالة والقيم، الأهداف الاستراتيجية، المبادرات والمشاريع، الخطة التنفيذية والموازنة التقديرية",
     "about": "نقود مع الإدارة إعداد خطة استراتيجية لثلاث إلى خمس سنوات مدعومة بخطة تنفيذية واضحة.",
     "docs": [
      "القوائم المالية لآخر ثلاث سنوات",
      "معلومات عن المنتجات والعملاء",
      "مشاركة الإدارة العليا في ورش العمل"
     ],
     "time": "6 إلى 8 أسابيع",
     "out": "وثيقة الخطة الاستراتيجية، الخطة التنفيذية، مؤشرات المتابعة"
    },
    "en": {
     "n": "Strategic Plan",
     "inc": "Internal and external analysis, vision, mission and values, strategic objectives, initiatives and projects, action plan and indicative budget",
     "about": "We work with management to prepare a three to five year strategic plan backed by a clear action plan.",
     "docs": [
      "Financial statements for the last three years",
      "Information on products and customers",
      "Senior management participation in workshops"
     ],
     "time": "6 to 8 weeks",
     "out": "Strategic plan document, action plan, tracking indicators"
    }
   },
   {
    "c": "CA-07",
    "p": 10000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "إعادة هندسة العمليات",
     "inc": "رسم العمليات الحالية، تحليل الفجوات ونقاط الاختناق، تصميم العمليات المحسنة، فرص الأتمتة، خطة التطبيق",
     "about": "نعيد تصميم العمليات الرئيسية لتقليل الوقت والتكلفة وتحسين تجربة العميل.",
     "docs": [
      "وصف العمليات المستهدفة",
      "بيانات الأوقات والأحجام إن توفرت",
      "إتاحة مقابلات مع المنفذين"
     ],
     "time": "4 إلى 6 أسابيع",
     "out": "خرائط العمليات الحالية والمستهدفة، تقرير التحسينات، خطة التطبيق"
    },
    "en": {
     "n": "Business Process Re-engineering",
     "inc": "Current process mapping, gap and bottleneck analysis, improved process design, automation opportunities, implementation plan",
     "about": "We redesign key processes to cut time and cost and improve the customer experience.",
     "docs": [
      "Description of target processes",
      "Time and volume data if available",
      "Access to staff for interviews"
     ],
     "time": "4 to 6 weeks",
     "out": "Current and future process maps, improvement report, implementation plan"
    }
   }
  ]
 },
 {
  "code": "CS",
  "ar": "الدراسات",
  "en": "Studies",
  "about_ar": "نعد دراسات جدوى وسوق وخطط عمل مبنية على بيانات السوق القطري ومقبولة لدى البنوك والمستثمرين والجهات الحكومية.",
  "about_en": "We prepare feasibility studies, market studies and business plans based on Qatar market data and suitable for banks, investors and government bodies.",
  "items": [
   {
    "c": "CS-01",
    "p": 8000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "دراسة جدوى لمشروع صغير",
     "inc": "الدراسة السوقية المختصرة، الدراسة الفنية، التكاليف الاستثمارية والتشغيلية، الإيرادات المتوقعة، فترة الاسترداد ونقطة التعادل",
     "about": "دراسة جدوى متكاملة للمشاريع الصغيرة مثل المطاعم والمحلات والخدمات، تساعدك على اتخاذ قرار الاستثمار.",
     "docs": [
      "فكرة المشروع ووصفه",
      "الموقع المقترح إن وجد",
      "رأس المال المتاح",
      "عروض أسعار المعدات إن توفرت"
     ],
     "time": "2 إلى 3 أسابيع",
     "out": "تقرير دراسة الجدوى، نموذج مالي على إكسل"
    },
    "en": {
     "n": "Feasibility Study (Small Project)",
     "inc": "Brief market study, technical study, investment and operating costs, revenue forecast, payback period and break-even",
     "about": "A complete feasibility study for small projects such as restaurants, shops and services that supports your investment decision.",
     "docs": [
      "Project idea and description",
      "Proposed location if any",
      "Available capital",
      "Equipment quotations if available"
     ],
     "time": "2 to 3 weeks",
     "out": "Feasibility study report, Excel financial model"
    }
   },
   {
    "c": "CS-02",
    "p": 15000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "دراسة جدوى لمشروع متوسط",
     "inc": "دراسة سوق تفصيلية، الدراسة الفنية والتشغيلية، الهيكل الإداري والعمالة، القوائم المالية التقديرية لخمس سنوات، صافي القيمة الحالية ومعدل العائد الداخلي، تحليل الحساسية والمخاطر",
     "about": "دراسة جدوى معمقة للمشاريع المتوسطة والصناعية الخفيفة، بمستوى يناسب البنوك وجهات التمويل.",
     "docs": [
      "وصف المشروع وطاقته الإنتاجية",
      "الموقع والمساحة",
      "هيكل التمويل المقترح",
      "عروض أسعار المعدات والمقاولين"
     ],
     "time": "4 إلى 6 أسابيع",
     "out": "تقرير دراسة الجدوى، نموذج مالي تفصيلي، ملخص تنفيذي للممول"
    },
    "en": {
     "n": "Feasibility Study (Medium Project)",
     "inc": "Detailed market study, technical and operational study, staffing and management structure, five-year projected financial statements, NPV and IRR, sensitivity and risk analysis",
     "about": "An in-depth feasibility study for medium and light industrial projects, at a level suitable for banks and funding bodies.",
     "docs": [
      "Project description and capacity",
      "Location and area",
      "Proposed financing structure",
      "Equipment and contractor quotations"
     ],
     "time": "4 to 6 weeks",
     "out": "Feasibility study report, detailed financial model, executive summary for funders"
    }
   },
   {
    "c": "CS-03",
    "p": 10000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "دراسة سوق",
     "inc": "حجم السوق ونموه، شرائح العملاء، تحليل الطلب والعرض، الأسعار السائدة، قنوات التوزيع، بحث ميداني ومقابلات",
     "about": "نقدم صورة واضحة عن السوق القطري لمنتجك أو خدمتك قبل الدخول أو التوسع.",
     "docs": [
      "وصف المنتج أو الخدمة",
      "الشريحة المستهدفة",
      "أي بيانات مبيعات سابقة"
     ],
     "time": "3 إلى 5 أسابيع",
     "out": "تقرير دراسة السوق مع التوصيات"
    },
    "en": {
     "n": "Market Study",
     "inc": "Market size and growth, customer segments, demand and supply analysis, prevailing prices, distribution channels, field research and interviews",
     "about": "We give you a clear picture of the Qatar market for your product or service before you enter or expand.",
     "docs": [
      "Product or service description",
      "Target segment",
      "Any past sales data"
     ],
     "time": "3 to 5 weeks",
     "out": "Market study report with recommendations"
    }
   },
   {
    "c": "CS-04",
    "p": 6000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "خطة عمل للبنك أو المستثمر",
     "inc": "الملخص التنفيذي، نموذج العمل، خطة التسويق والتشغيل، الفريق الإداري، التوقعات المالية، متطلبات التمويل واستخداماته",
     "about": "نعد خطة عمل احترافية بالصيغة التي تطلبها البنوك وبنك قطر للتنمية والمستثمرون.",
     "docs": [
      "السجل التجاري",
      "القوائم المالية إن وجدت",
      "مبلغ التمويل المطلوب والغرض منه",
      "السيرة الذاتية للمؤسسين"
     ],
     "time": "2 إلى 3 أسابيع",
     "out": "خطة العمل، عرض تقديمي للمستثمر، نموذج مالي"
    },
    "en": {
     "n": "Business Plan for Bank or Investor",
     "inc": "Executive summary, business model, marketing and operations plan, management team, financial forecasts, funding needs and use of funds",
     "about": "We prepare a professional business plan in the format expected by banks, Qatar Development Bank and investors.",
     "docs": [
      "Commercial registration",
      "Financial statements if any",
      "Funding amount required and purpose",
      "Founders' CVs"
     ],
     "time": "2 to 3 weeks",
     "out": "Business plan, investor pitch deck, financial model"
    }
   },
   {
    "c": "CS-05",
    "p": 9000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "دراسة اقتصادية ومالية",
     "inc": "تحليل الجدوى الاقتصادية، تقدير التكاليف والعوائد، التدفقات النقدية المخصومة، سيناريوهات التمويل، تحليل الحساسية",
     "about": "دراسة تركز على الجانب الاقتصادي والمالي لقرار استثماري أو توسع أو مشروع جديد داخل منشأة قائمة.",
     "docs": [
      "القوائم المالية لآخر سنتين",
      "تفاصيل القرار أو المشروع المقترح",
      "افتراضات الإدارة"
     ],
     "time": "3 إلى 4 أسابيع",
     "out": "تقرير الدراسة، نموذج مالي بالسيناريوهات"
    },
    "en": {
     "n": "Economic & Financial Study",
     "inc": "Economic viability analysis, cost and return estimates, discounted cash flows, financing scenarios, sensitivity analysis",
     "about": "A study focused on the economic and financial side of an investment, expansion or new project within an existing business.",
     "docs": [
      "Financial statements for the last two years",
      "Details of the proposed decision or project",
      "Management assumptions"
     ],
     "time": "3 to 4 weeks",
     "out": "Study report, scenario-based financial model"
    }
   },
   {
    "c": "CS-06",
    "p": 5000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "دراسة المنافسين",
     "inc": "تحديد المنافسين الرئيسيين، مقارنة المنتجات والأسعار، نقاط القوة والضعف، الحصص السوقية التقديرية، فرص التميز",
     "about": "نحلل المنافسين المباشرين وغير المباشرين لتحديد موقعك في السوق وفرص التفوق.",
     "docs": [
      "قائمة المنافسين المعروفين",
      "وصف منتجاتك وأسعارك"
     ],
     "time": "2 إلى 3 أسابيع",
     "out": "تقرير تحليل المنافسين، مصفوفة مقارنة"
    },
    "en": {
     "n": "Competitor Study",
     "inc": "Identification of key competitors, product and price comparison, strengths and weaknesses, estimated market shares, differentiation opportunities",
     "about": "We analyze direct and indirect competitors to define your market position and opportunities to stand out.",
     "docs": [
      "List of known competitors",
      "Description of your products and prices"
     ],
     "time": "2 to 3 weeks",
     "out": "Competitor analysis report, comparison matrix"
    }
   },
   {
    "c": "CS-07",
    "p": 4500,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "استبيان رضا العملاء",
     "inc": "تصميم الاستبيان، تحديد العينة، الجمع الإلكتروني أو الهاتفي، تحليل النتائج، توصيات التحسين",
     "about": "نقيس رضا عملائك بطريقة منهجية ونحول النتائج إلى إجراءات تحسين عملية.",
     "docs": [
      "قائمة بيانات تواصل العملاء",
      "الخدمات المراد تقييمها"
     ],
     "time": "3 إلى 4 أسابيع",
     "out": "تقرير نتائج الاستبيان، مؤشر الرضا، خطة تحسين"
    },
    "en": {
     "n": "Customer Satisfaction Survey",
     "inc": "Survey design, sampling, online or phone data collection, results analysis, improvement recommendations",
     "about": "We measure customer satisfaction methodically and turn the results into practical improvement actions.",
     "docs": [
      "Customer contact list",
      "Services to be evaluated"
     ],
     "time": "3 to 4 weeks",
     "out": "Survey results report, satisfaction index, improvement plan"
    }
   },
   {
    "c": "CS-08",
    "p": 7000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "تقييم مشروع قائم",
     "inc": "مراجعة الأداء التشغيلي والمالي، مقارنة النتائج بالدراسة الأصلية، تحديد أسباب الانحراف، توصيات الاستمرار أو التطوير أو التخارج",
     "about": "نقيم مشروعاً قائماً لمعرفة مدى تحقيقه لأهدافه وتحديد الخطوات التالية المناسبة.",
     "docs": [
      "القوائم المالية منذ بدء التشغيل",
      "دراسة الجدوى الأصلية إن وجدت",
      "تقارير المبيعات والتشغيل"
     ],
     "time": "3 إلى 4 أسابيع",
     "out": "تقرير التقييم مع التوصيات"
    },
    "en": {
     "n": "Project Evaluation",
     "inc": "Operational and financial performance review, comparison with original study, causes of variance, recommendations to continue, develop or exit",
     "about": "We evaluate an operating project to see how far it met its goals and to define the right next steps.",
     "docs": [
      "Financial statements since start of operations",
      "Original feasibility study if any",
      "Sales and operations reports"
     ],
     "time": "3 to 4 weeks",
     "out": "Evaluation report with recommendations"
    }
   }
  ]
 },
 {
  "code": "CH",
  "ar": "استشارات الموارد البشرية",
  "en": "Human Resources Consulting",
  "about_ar": "نبني أنظمة الموارد البشرية للمنشآت بما يتوافق مع قانون العمل القطري رقم 14 لسنة 2004 وتعديلاته.",
  "about_en": "We build HR systems for businesses in line with Qatar Labour Law No. 14 of 2004 and its amendments.",
  "items": [
   {
    "c": "CH-01",
    "p": 350,
    "from": false,
    "unit_ar": "للوظيفة",
    "unit_en": "per job",
    "ar": {
     "n": "إعداد وصف وظيفي",
     "inc": "الغرض من الوظيفة، المهام والمسؤوليات، التبعية الإدارية، المؤهلات والخبرات، الكفاءات المطلوبة، مؤشرات الأداء",
     "about": "نعد وصفاً وظيفياً احترافياً لوظيفة واحدة، مناسباً لأغراض التوظيف والتقييم.",
     "docs": [
      "المسمى الوظيفي",
      "المهام الحالية للوظيفة",
      "الهيكل التنظيمي"
     ],
     "time": "2 إلى 3 أيام عمل",
     "out": "بطاقة وصف وظيفي معتمدة بالعربية والإنجليزية"
    },
    "en": {
     "n": "Job Description",
     "inc": "Job purpose, duties and responsibilities, reporting line, qualifications and experience, required competencies, performance indicators",
     "about": "We prepare a professional description for a single job, ready for recruitment and appraisal.",
     "docs": [
      "Job title",
      "Current job duties",
      "Organization chart"
     ],
     "time": "2 to 3 working days",
     "out": "Approved job description card in Arabic and English"
    }
   },
   {
    "c": "CH-02",
    "p": 3000,
    "from": false,
    "unit_ar": "للباقة",
    "unit_en": "per package",
    "ar": {
     "n": "باقة الأوصاف الوظيفية (10 وظائف)",
     "inc": "إعداد 10 أوصاف وظيفية، توحيد الصيغة والمسميات، ربطها بالهيكل التنظيمي، مراجعة مع الإدارة",
     "about": "باقة موفرة للمنشآت التي تحتاج أوصافاً وظيفية لعدة وظائف دفعة واحدة.",
     "docs": [
      "قائمة الوظائف العشر",
      "الهيكل التنظيمي",
      "المهام الحالية لكل وظيفة"
     ],
     "time": "2 إلى 3 أسابيع",
     "out": "10 بطاقات وصف وظيفي بالعربية والإنجليزية، دليل المسميات الوظيفية"
    },
    "en": {
     "n": "Job Descriptions Package (10 Jobs)",
     "inc": "10 job descriptions, unified format and titles, alignment with the organization chart, review with management",
     "about": "A cost-saving package for businesses that need descriptions for several jobs at once.",
     "docs": [
      "List of the ten jobs",
      "Organization chart",
      "Current duties for each job"
     ],
     "time": "2 to 3 weeks",
     "out": "10 job description cards in Arabic and English, job titles guide"
    }
   },
   {
    "c": "CH-03",
    "p": 6000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "سياسات الموارد البشرية ولائحة تنظيم العمل الداخلية",
     "inc": "التوظيف والتعيين، ساعات العمل والإجازات، الرواتب والبدلات، الجزاءات والتأديب، نهاية الخدمة، التظلمات، المطابقة مع قانون العمل رقم 14 لسنة 2004",
     "about": "نعد لائحة داخلية وسياسات موارد بشرية متوافقة مع قانون العمل القطري وجاهزة للاعتماد لدى وزارة العمل.",
     "docs": [
      "السجل التجاري",
      "عدد الموظفين وفئاتهم",
      "عقود العمل الحالية",
      "الممارسات المعمول بها حالياً"
     ],
     "time": "3 إلى 4 أسابيع",
     "out": "دليل سياسات الموارد البشرية، لائحة تنظيم العمل الداخلية، النماذج المرفقة"
    },
    "en": {
     "n": "HR Policies & Internal Work Regulations",
     "inc": "Recruitment and hiring, working hours and leave, salaries and allowances, discipline and penalties, end of service, grievances, compliance with Labour Law No. 14 of 2004",
     "about": "We prepare internal regulations and HR policies that comply with Qatar Labour Law and are ready for approval by the Ministry of Labour.",
     "docs": [
      "Commercial registration",
      "Number and categories of employees",
      "Current employment contracts",
      "Current practices"
     ],
     "time": "3 to 4 weeks",
     "out": "HR policies manual, internal work regulations, attached forms"
    }
   },
   {
    "c": "CH-04",
    "p": 5000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "سلم الرواتب والدرجات الوظيفية",
     "inc": "تقييم الوظائف، تحديد الدرجات، مقارنة بالسوق القطري، هيكل الرواتب والبدلات، قواعد الترقية والزيادات",
     "about": "نبني سلم رواتب عادلاً ومنافساً يربط الأجر بقيمة الوظيفة ويضبط تكلفة الرواتب.",
     "docs": [
      "كشف الرواتب الحالي",
      "الأوصاف الوظيفية",
      "الهيكل التنظيمي"
     ],
     "time": "3 إلى 4 أسابيع",
     "out": "سلم الرواتب، جدول الدرجات، سياسة الأجور والبدلات"
    },
    "en": {
     "n": "Salary Scale & Job Grading",
     "inc": "Job evaluation, grade definition, Qatar market benchmarking, pay and allowance structure, promotion and increment rules",
     "about": "We build a fair and competitive salary scale that links pay to job value and controls payroll cost.",
     "docs": [
      "Current payroll",
      "Job descriptions",
      "Organization chart"
     ],
     "time": "3 to 4 weeks",
     "out": "Salary scale, grading table, pay and allowances policy"
    }
   },
   {
    "c": "CH-05",
    "p": 4500,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "نظام تقييم الأداء الوظيفي",
     "inc": "معايير التقييم، نماذج التقييم لكل فئة، دورة التقييم السنوية، ربط النتائج بالحوافز والتطوير، تدريب المديرين",
     "about": "نصمم نظاماً عملياً لتقييم أداء الموظفين يدعم قرارات المكافآت والترقية والتدريب.",
     "docs": [
      "الأوصاف الوظيفية",
      "نماذج التقييم الحالية إن وجدت",
      "سياسة الحوافز"
     ],
     "time": "2 إلى 3 أسابيع",
     "out": "دليل تقييم الأداء، نماذج التقييم، دليل المقيِّم"
    },
    "en": {
     "n": "Performance Appraisal System",
     "inc": "Appraisal criteria, forms for each staff category, annual review cycle, link to incentives and development, manager training",
     "about": "We design a practical staff appraisal system that supports reward, promotion and training decisions.",
     "docs": [
      "Job descriptions",
      "Current appraisal forms if any",
      "Incentive policy"
     ],
     "time": "2 to 3 weeks",
     "out": "Appraisal manual, appraisal forms, appraiser guide"
    }
   },
   {
    "c": "CH-06",
    "p": 5000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "خطة التقطير",
     "inc": "تحليل القوى العاملة الحالية، تحديد الوظائف المستهدفة للتقطير، خطط الاستقطاب والتدريب والإحلال، المؤشرات والجدول الزمني",
     "about": "نعد خطة واقعية لزيادة نسبة الكوادر القطرية بما يتماشى مع توجهات الدولة ومتطلبات الجهات المعنية.",
     "docs": [
      "بيانات الموظفين وجنسياتهم",
      "الهيكل التنظيمي",
      "أهداف المنشأة من التقطير"
     ],
     "time": "3 إلى 4 أسابيع",
     "out": "خطة التقطير، جدول الإحلال، مؤشرات المتابعة"
    },
    "en": {
     "n": "Qatarization Plan",
     "inc": "Current workforce analysis, target roles for Qatarization, attraction, training and replacement plans, indicators and timeline",
     "about": "We prepare a realistic plan to increase the share of Qatari staff in line with national direction and authority requirements.",
     "docs": [
      "Staff data and nationalities",
      "Organization chart",
      "Company Qatarization goals"
     ],
     "time": "3 to 4 weeks",
     "out": "Qatarization plan, replacement schedule, tracking indicators"
    }
   },
   {
    "c": "CH-07",
    "p": 2500,
    "from": true,
    "unit_ar": "للوظيفة",
    "unit_en": "per job",
    "ar": {
     "n": "دعم التوظيف",
     "inc": "تحديد متطلبات الوظيفة، إعداد الإعلان، فرز السير الذاتية، تصميم أسئلة المقابلة، المشاركة في المقابلات، توصية بالمرشحين",
     "about": "ندعمك في اختيار المرشح المناسب من خلال عملية توظيف منظمة وموضوعية.",
     "docs": [
      "الوصف الوظيفي",
      "نطاق الراتب",
      "السير الذاتية المستلمة إن وجدت"
     ],
     "time": "2 إلى 4 أسابيع",
     "out": "قائمة مختصرة بالمرشحين، تقييم المقابلات، توصية نهائية"
    },
    "en": {
     "n": "Recruitment Support",
     "inc": "Job requirements, job advert, CV screening, interview question design, participation in interviews, candidate recommendation",
     "about": "We help you select the right candidate through an organized and objective hiring process.",
     "docs": [
      "Job description",
      "Salary range",
      "CVs received if any"
     ],
     "time": "2 to 4 weeks",
     "out": "Candidate shortlist, interview assessments, final recommendation"
    }
   }
  ]
 },
 {
  "code": "CF",
  "ar": "الاستشارات المالية والمحاسبية",
  "en": "Financial & Accounting Consulting",
  "about_ar": "نؤسس الأنظمة المالية والمحاسبية ونجهز ملفات التمويل والامتثال الضريبي، ولا تشمل خدماتنا التدقيق القانوني الذي يتولاه مدققو حسابات مرخصون.",
  "about_en": "We set up financial and accounting systems and prepare financing and tax compliance files; statutory audit is excluded and is carried out by licensed auditors.",
  "items": [
   {
    "c": "CF-01",
    "p": 7000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "دليل الحسابات وتأسيس النظام المحاسبي",
     "inc": "تصميم دليل الحسابات، مراكز التكلفة، الدورة المستندية، إعداد البرنامج المحاسبي، الأرصدة الافتتاحية، تدريب المحاسب",
     "about": "نؤسس نظاماً محاسبياً سليماً يناسب نشاطك ويوفر تقارير مالية موثوقة.",
     "docs": [
      "السجل التجاري",
      "طبيعة النشاط والفروع",
      "البرنامج المحاسبي المستخدم أو المقترح",
      "الأرصدة الحالية"
     ],
     "time": "3 إلى 4 أسابيع",
     "out": "دليل الحسابات، دليل الدورة المستندية، نظام محاسبي جاهز للتشغيل"
    },
    "en": {
     "n": "Chart of Accounts & Accounting System Setup",
     "inc": "Chart of accounts design, cost centres, document cycle, accounting software setup, opening balances, accountant training",
     "about": "We set up a sound accounting system that fits your activity and produces reliable financial reports.",
     "docs": [
      "Commercial registration",
      "Nature of activity and branches",
      "Current or proposed accounting software",
      "Current balances"
     ],
     "time": "3 to 4 weeks",
     "out": "Chart of accounts, document cycle manual, accounting system ready to run"
    }
   },
   {
    "c": "CF-02",
    "p": 6000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "السياسات والإجراءات المالية",
     "inc": "صلاحيات الصرف والاعتماد، المشتريات، الخزينة والبنوك، المخزون، الأصول الثابتة، الرقابة الداخلية، إقفال الفترات",
     "about": "نوثق السياسات المالية التي تحمي أموال المنشأة وتضبط الصرف والرقابة.",
     "docs": [
      "الهيكل التنظيمي",
      "الإجراءات المالية الحالية",
      "مصفوفة الصلاحيات إن وجدت"
     ],
     "time": "3 إلى 4 أسابيع",
     "out": "دليل السياسات والإجراءات المالية، النماذج المالية"
    },
    "en": {
     "n": "Financial Policies & Procedures",
     "inc": "Spending and approval authority, procurement, treasury and banking, inventory, fixed assets, internal control, period closing",
     "about": "We document the financial policies that protect company funds and control spending and oversight.",
     "docs": [
      "Organization chart",
      "Current financial procedures",
      "Delegation of authority matrix if any"
     ],
     "time": "3 to 4 weeks",
     "out": "Financial policies and procedures manual, financial forms"
    }
   },
   {
    "c": "CF-03",
    "p": 5000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "الموازنة التقديرية وخطة التدفقات النقدية",
     "inc": "موازنة الإيرادات والمصروفات، موازنة الرواتب، الموازنة الرأسمالية، خطة التدفقات النقدية الشهرية، آلية متابعة الانحرافات",
     "about": "نعد موازنة سنوية وخطة تدفقات نقدية تساعدك على التخطيط وتجنب أزمات السيولة.",
     "docs": [
      "القوائم المالية لآخر سنة",
      "خطط المبيعات والتوسع",
      "الالتزامات والقروض القائمة"
     ],
     "time": "2 إلى 3 أسابيع",
     "out": "الموازنة التقديرية، خطة التدفقات النقدية، نموذج متابعة على إكسل"
    },
    "en": {
     "n": "Budgeting & Cash-Flow Plan",
     "inc": "Revenue and expense budget, payroll budget, capital budget, monthly cash-flow plan, variance tracking method",
     "about": "We prepare an annual budget and cash-flow plan that helps you plan ahead and avoid liquidity problems.",
     "docs": [
      "Last year's financial statements",
      "Sales and expansion plans",
      "Existing commitments and loans"
     ],
     "time": "2 to 3 weeks",
     "out": "Budget, cash-flow plan, Excel tracking model"
    }
   },
   {
    "c": "CF-04",
    "p": 6000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "دراسة التكاليف والتسعير",
     "inc": "تحليل عناصر التكلفة، توزيع التكاليف غير المباشرة، تكلفة المنتج أو الخدمة، هامش الربح، نقطة التعادل، توصيات التسعير",
     "about": "نحدد التكلفة الحقيقية لكل منتج أو خدمة ونقترح أسعاراً تحقق الربحية وتبقى منافسة.",
     "docs": [
      "قائمة المنتجات أو الخدمات",
      "بيانات المصروفات والمشتريات",
      "الأسعار الحالية"
     ],
     "time": "2 إلى 4 أسابيع",
     "out": "تقرير التكاليف، نموذج حساب التكلفة، جدول الأسعار المقترحة"
    },
    "en": {
     "n": "Costing & Pricing Study",
     "inc": "Cost element analysis, overhead allocation, product or service cost, profit margin, break-even, pricing recommendations",
     "about": "We find the true cost of each product or service and propose prices that are profitable and competitive.",
     "docs": [
      "List of products or services",
      "Expense and purchase data",
      "Current prices"
     ],
     "time": "2 to 4 weeks",
     "out": "Costing report, costing model, proposed price list"
    }
   },
   {
    "c": "CF-05",
    "p": 4000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "مراجعة الجاهزية الضريبية والامتثال على بوابة ضريبة",
     "inc": "مراجعة التسجيل في بوابة ضريبة، متطلبات قانون ضريبة الدخل رقم 24 لسنة 2018، الاستقطاع من المنبع، مواعيد الإقرارات، السجلات المطلوبة، خطة معالجة الملاحظات",
     "about": "نراجع وضع منشأتك أمام الهيئة العامة للضرائب ونحدد ما يلزم للامتثال وتجنب الغرامات.",
     "docs": [
      "السجل التجاري",
      "بيانات الدخول إلى بوابة ضريبة أو حالة التسجيل",
      "القوائم المالية",
      "عقود الموردين غير المقيمين إن وجدت"
     ],
     "time": "1 إلى 2 أسبوع",
     "out": "تقرير الجاهزية الضريبية، قائمة الملاحظات، تقويم المواعيد الضريبية"
    },
    "en": {
     "n": "Tax Readiness & Dhareeba Compliance Review",
     "inc": "Dhareeba portal registration review, Income Tax Law No. 24 of 2018 requirements, withholding tax, filing deadlines, required records, remediation plan",
     "about": "We review your position with the General Tax Authority and define what is needed to comply and avoid penalties.",
     "docs": [
      "Commercial registration",
      "Dhareeba login or registration status",
      "Financial statements",
      "Contracts with non-resident suppliers if any"
     ],
     "time": "1 to 2 weeks",
     "out": "Tax readiness report, findings list, tax deadlines calendar"
    }
   },
   {
    "c": "CF-06",
    "p": 4500,
    "from": true,
    "unit_ar": "للملف",
    "unit_en": "per file",
    "ar": {
     "n": "إعداد ملف التمويل البنكي",
     "inc": "تحديد احتياج التمويل، تجهيز المستندات المطلوبة، التوقعات المالية وخطة السداد، مذكرة طلب التمويل، المتابعة مع البنك أو بنك قطر للتنمية",
     "about": "نجهز ملف تمويل متكاملاً يرفع فرص قبول طلبك لدى البنوك وجهات التمويل.",
     "docs": [
      "السجل التجاري والرخصة التجارية",
      "القوائم المالية المدققة",
      "كشوف الحسابات البنكية لآخر 6 أشهر",
      "مبلغ التمويل والغرض منه"
     ],
     "time": "2 إلى 3 أسابيع",
     "out": "ملف التمويل الكامل، مذكرة الطلب، جدول السداد التقديري"
    },
    "en": {
     "n": "Bank Financing File Preparation",
     "inc": "Funding need assessment, required documents, financial forecasts and repayment plan, financing request memo, follow-up with the bank or Qatar Development Bank",
     "about": "We prepare a complete financing file that improves your chances of approval by banks and funding bodies.",
     "docs": [
      "Commercial registration and trade licence",
      "Audited financial statements",
      "Bank statements for the last 6 months",
      "Funding amount and purpose"
     ],
     "time": "2 to 3 weeks",
     "out": "Complete financing file, request memo, indicative repayment schedule"
    }
   }
  ]
 },
 {
  "code": "CT",
  "ar": "الاستشارات الفنية والهندسية",
  "en": "Technical & Engineering Consulting",
  "about_ar": "نجهز المتطلبات الفنية لترخيص الأنشطة والمنشآت ونطابقها مع اشتراطات البلدية والدفاع المدني والجهات المختصة في قطر.",
  "about_en": "We prepare the technical requirements for licensing activities and premises and align them with municipality, Civil Defence and other Qatari authority requirements.",
  "items": [
   {
    "c": "CT-01",
    "p": 2500,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "المتطلبات الفنية لترخيص النشاط",
     "inc": "تحديد اشتراطات النشاط، مراجعة ملاءمة الموقع، قائمة المتطلبات الفنية والموافقات، خطة استيفاء الملاحظات",
     "about": "نحدد بدقة ما يحتاجه نشاطك من متطلبات فنية قبل التقديم على الترخيص لتجنب الرفض والتأخير.",
     "docs": [
      "السجل التجاري أو النشاط المقترح",
      "عقد الإيجار وموقع المحل",
      "مخطط المحل إن وجد"
     ],
     "time": "3 إلى 5 أيام عمل",
     "out": "تقرير المتطلبات الفنية، قائمة تحقق للترخيص"
    },
    "en": {
     "n": "Technical Requirements for Activity Licensing",
     "inc": "Activity requirements, site suitability review, list of technical requirements and approvals, plan to close observations",
     "about": "We identify exactly what technical requirements your activity needs before applying for the licence to avoid rejection and delay.",
     "docs": [
      "Commercial registration or proposed activity",
      "Lease and shop location",
      "Shop layout if available"
     ],
     "time": "3 to 5 working days",
     "out": "Technical requirements report, licensing checklist"
    }
   },
   {
    "c": "CT-02",
    "p": 4000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "مطابقة التجهيزات والمخطط مع اشتراطات البلدية والدفاع المدني",
     "inc": "مراجعة مخطط المكتب أو المحل، توزيع المساحات، متطلبات السلامة من الحريق ومخارج الطوارئ، اللوحات الإرشادية، قائمة ملاحظات للمقاول",
     "about": "نراجع تصميم وتجهيز موقعك قبل التنفيذ أو التفتيش لضمان المطابقة مع اشتراطات البلدية والدفاع المدني.",
     "docs": [
      "مخطط الموقع",
      "عقد الإيجار",
      "صور الموقع الحالية",
      "عرض المقاول إن وجد"
     ],
     "time": "1 إلى 2 أسبوع",
     "out": "تقرير المطابقة، مخطط مقترح معدل، قائمة أعمال للمقاول"
    },
    "en": {
     "n": "Fit-out & Layout Compliance (Municipality and Civil Defence)",
     "inc": "Office or shop layout review, space planning, fire safety and emergency exit requirements, signage, list of observations for the contractor",
     "about": "We review the design and fit-out of your premises before works or inspection to ensure compliance with municipality and Civil Defence requirements.",
     "docs": [
      "Site layout",
      "Lease contract",
      "Current site photos",
      "Contractor quotation if any"
     ],
     "time": "1 to 2 weeks",
     "out": "Compliance report, revised layout proposal, contractor work list"
    }
   },
   {
    "c": "CT-03",
    "p": 5000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "الصحة والسلامة المهنية",
     "inc": "تقييم المخاطر في موقع العمل، خطة الطوارئ والإخلاء، سياسة السلامة، سجلات الحوادث، متطلبات معدات الوقاية، توعية الموظفين",
     "about": "نضع نظاماً للصحة والسلامة يحمي العاملين ويلبي متطلبات قانون العمل والجهات الرقابية.",
     "docs": [
      "وصف النشاط والمعدات",
      "مخطط الموقع",
      "عدد العاملين وطبيعة أعمالهم"
     ],
     "time": "2 إلى 3 أسابيع",
     "out": "دليل الصحة والسلامة، سجل تقييم المخاطر، خطة الطوارئ والإخلاء"
    },
    "en": {
     "n": "Health & Safety",
     "inc": "Workplace risk assessment, emergency and evacuation plan, safety policy, incident records, PPE requirements, staff awareness",
     "about": "We set up a health and safety system that protects workers and meets Labour Law and regulator requirements.",
     "docs": [
      "Description of activity and equipment",
      "Site layout",
      "Number of workers and type of work"
     ],
     "time": "2 to 3 weeks",
     "out": "Health and safety manual, risk assessment register, emergency and evacuation plan"
    }
   },
   {
    "c": "CT-04",
    "p": 9000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "الملف الفني للترخيص الصناعي",
     "inc": "وصف العملية الإنتاجية، الطاقة الإنتاجية، قائمة الآلات والمعدات، المواد الخام، احتياجات المرافق والعمالة، الاشتراطات البيئية، تجهيز ملف التقديم لوزارة التجارة والصناعة",
     "about": "نعد الملف الفني المطلوب للحصول على الترخيص الصناعي المبدئي أو النهائي.",
     "docs": [
      "السجل التجاري",
      "وصف المنتج والعملية",
      "عروض الآلات والمعدات",
      "موقع المصنع ومساحته"
     ],
     "time": "3 إلى 5 أسابيع",
     "out": "الملف الفني الكامل، مخطط تدفق الإنتاج، قائمة المتطلبات البيئية"
    },
    "en": {
     "n": "Industrial Licence Technical File",
     "inc": "Production process description, capacity, machinery and equipment list, raw materials, utility and labour needs, environmental requirements, application file for the Ministry of Commerce and Industry",
     "about": "We prepare the technical file required to obtain an initial or final industrial licence.",
     "docs": [
      "Commercial registration",
      "Product and process description",
      "Machinery and equipment quotations",
      "Factory location and area"
     ],
     "time": "3 to 5 weeks",
     "out": "Complete technical file, production flow chart, environmental requirements list"
    }
   },
   {
    "c": "CT-05",
    "p": 4000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "إعداد المواصفات الفنية للمناقصات",
     "inc": "تحديد الاحتياج، كتابة المواصفات الفنية ونطاق العمل، معايير التقييم الفني، جدول الكميات، دعم تقييم العروض",
     "about": "نكتب مواصفات فنية واضحة تساعدك على طرح مناقصة أو طلب عروض والحصول على عروض قابلة للمقارنة.",
     "docs": [
      "وصف المشروع أو التوريد",
      "الميزانية التقديرية",
      "أي مواصفات سابقة"
     ],
     "time": "1 إلى 3 أسابيع",
     "out": "وثيقة المواصفات الفنية، نطاق العمل، معايير التقييم"
    },
    "en": {
     "n": "Technical Specifications for Tenders",
     "inc": "Needs definition, technical specifications and scope of work, technical evaluation criteria, bill of quantities, bid evaluation support",
     "about": "We write clear technical specifications that help you issue a tender or request for proposals and receive comparable bids.",
     "docs": [
      "Project or supply description",
      "Estimated budget",
      "Any previous specifications"
     ],
     "time": "1 to 3 weeks",
     "out": "Technical specifications document, scope of work, evaluation criteria"
    }
   },
   {
    "c": "CT-06",
    "p": 1500,
    "from": false,
    "unit_ar": "للزيارة",
    "unit_en": "per visit",
    "ar": {
     "n": "زيارة معاينة فنية وتقرير",
     "inc": "زيارة ميدانية للموقع، فحص المطابقة الظاهرية، توثيق الملاحظات بالصور، تقرير مختصر بالإجراءات المطلوبة",
     "about": "زيارة ميدانية سريعة قبل التفتيش الرسمي أو بعد ملاحظات الجهات المختصة لتحديد المطلوب بدقة.",
     "docs": [
      "عنوان الموقع",
      "ملاحظات الجهة المختصة إن وجدت"
     ],
     "time": "يوم واحد للزيارة، والتقرير خلال 3 أيام عمل",
     "out": "تقرير المعاينة مع الصور والتوصيات"
    },
    "en": {
     "n": "Technical Site Visit & Report",
     "inc": "On-site visit, visual compliance check, photo documentation of observations, short report of required actions",
     "about": "A quick site visit before an official inspection or after authority observations to pinpoint what is needed.",
     "docs": [
      "Site address",
      "Authority observations if any"
     ],
     "time": "One day for the visit, report within 3 working days",
     "out": "Inspection report with photos and recommendations"
    }
   }
  ]
 },
 {
  "code": "CQ",
  "ar": "الجودة والآيزو والامتثال",
  "en": "Quality, ISO & Compliance",
  "about_ar": "نجهز المنشآت للحصول على شهادات الآيزو ونبني برامج الامتثال التنظيمي وفق التشريعات القطرية، ويتم منح الشهادات من جهات إصدار معتمدة مستقلة.",
  "about_en": "We prepare businesses for ISO certification and build regulatory compliance programmes under Qatari legislation; certificates are issued by independent accredited certification bodies.",
  "items": [
   {
    "c": "CQ-01",
    "p": 18000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "تطبيق نظام إدارة الجودة ISO 9001",
     "inc": "تحليل الفجوات، توثيق نظام الجودة، الإجراءات والنماذج، تدريب الفريق، التدقيق الداخلي، مراجعة الإدارة، مرافقة تدقيق جهة الإصدار",
     "about": "نرافقك من البداية حتى الحصول على شهادة ISO 9001، مع نظام جودة عملي يناسب حجم منشأتك.",
     "docs": [
      "السجل التجاري",
      "الهيكل التنظيمي",
      "وصف الخدمات والعمليات",
      "منسق جودة من طرف المنشأة"
     ],
     "time": "3 إلى 5 أشهر",
     "out": "نظام إدارة جودة موثق، تقرير التدقيق الداخلي، جاهزية كاملة لتدقيق الشهادة"
    },
    "en": {
     "n": "ISO 9001 Implementation",
     "inc": "Gap analysis, quality system documentation, procedures and forms, team training, internal audit, management review, support during certification audit",
     "about": "We guide you from start to ISO 9001 certification with a practical quality system that suits your size.",
     "docs": [
      "Commercial registration",
      "Organization chart",
      "Description of services and processes",
      "A quality coordinator from your side"
     ],
     "time": "3 to 5 months",
     "out": "Documented quality management system, internal audit report, full readiness for certification audit"
    }
   },
   {
    "c": "CQ-02",
    "p": 15000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "جاهزية ISO 45001 أو ISO 14001",
     "inc": "تحليل الفجوات، تقييم المخاطر أو الجوانب البيئية، المتطلبات القانونية، توثيق النظام، التدريب، التدقيق الداخلي",
     "about": "نجهز منشأتك لشهادة نظام السلامة والصحة المهنية أو نظام الإدارة البيئية، ويمكن دمجهما مع ISO 9001.",
     "docs": [
      "وصف النشاط والمواقع",
      "سجلات السلامة أو البيئة الحالية",
      "الهيكل التنظيمي"
     ],
     "time": "3 إلى 4 أشهر",
     "out": "نظام موثق، سجل المخاطر أو الجوانب البيئية، تقرير الجاهزية"
    },
    "en": {
     "n": "ISO 45001 or ISO 14001 Readiness",
     "inc": "Gap analysis, risk or environmental aspects assessment, legal requirements, system documentation, training, internal audit",
     "about": "We prepare your business for occupational health and safety or environmental management certification, which can be integrated with ISO 9001.",
     "docs": [
      "Description of activity and sites",
      "Current safety or environmental records",
      "Organization chart"
     ],
     "time": "3 to 4 months",
     "out": "Documented system, risk or aspects register, readiness report"
    }
   },
   {
    "c": "CQ-03",
    "p": 5000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "التدقيق الداخلي على الأنظمة",
     "inc": "خطة التدقيق، فحص تطبيق الإجراءات والسجلات، تحديد عدم المطابقات، الإجراءات التصحيحية المقترحة",
     "about": "تدقيق داخلي مستقل على نظام الجودة أو الإجراءات الداخلية لاكتشاف الثغرات قبل التدقيق الخارجي.",
     "docs": [
      "الدليل والإجراءات المعتمدة",
      "السجلات ذات العلاقة",
      "تقارير التدقيق السابقة"
     ],
     "time": "1 إلى 2 أسبوع",
     "out": "تقرير التدقيق الداخلي، سجل عدم المطابقات، خطة الإجراءات التصحيحية"
    },
    "en": {
     "n": "Internal Audit of Management Systems",
     "inc": "Audit plan, review of procedures and records, nonconformity identification, proposed corrective actions",
     "about": "An independent internal audit of your quality system or internal procedures to find gaps before an external audit.",
     "docs": [
      "Approved manual and procedures",
      "Related records",
      "Previous audit reports"
     ],
     "time": "1 to 2 weeks",
     "out": "Internal audit report, nonconformity log, corrective action plan"
    }
   },
   {
    "c": "CQ-04",
    "p": 10000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "برنامج امتثال مكافحة غسل الأموال وتمويل الإرهاب للأعمال والمهن غير المالية المحددة",
     "inc": "تقييم المخاطر، سياسة اعرف عميلك والعناية الواجبة، تعيين مسؤول الامتثال، إجراءات الإبلاغ عن المعاملات المشبوهة، حفظ السجلات، التدريب، وفق القانون رقم 20 لسنة 2019",
     "about": "نبني برنامج امتثال متكاملاً للوسطاء العقاريين وتجار المعادن الثمينة ومقدمي خدمات الشركات وغيرهم ممن تشملهم الرقابة.",
     "docs": [
      "السجل التجاري",
      "وصف النشاط وأنواع العملاء",
      "حجم المعاملات التقديري",
      "أي ملاحظات رقابية سابقة"
     ],
     "time": "4 إلى 6 أسابيع",
     "out": "تقييم مخاطر المنشأة، دليل سياسات وإجراءات الامتثال، نماذج العناية الواجبة، تدريب الموظفين"
    },
    "en": {
     "n": "AML/CFT Compliance Programme for DNFBPs",
     "inc": "Risk assessment, KYC and due diligence policy, compliance officer appointment, suspicious transaction reporting procedures, record keeping, training, under Law No. 20 of 2019",
     "about": "We build a complete compliance programme for real estate brokers, precious metals dealers, corporate service providers and other supervised businesses.",
     "docs": [
      "Commercial registration",
      "Activity and customer types",
      "Estimated transaction volumes",
      "Any previous supervisory findings"
     ],
     "time": "4 to 6 weeks",
     "out": "Business risk assessment, compliance policies and procedures manual, due diligence forms, staff training"
    }
   },
   {
    "c": "CQ-05",
    "p": 7000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "مراجعة الامتثال لقانون حماية خصوصية البيانات الشخصية",
     "inc": "حصر البيانات الشخصية المعالجة، مراجعة الموافقات والإشعارات، تقييم الضوابط الأمنية، عقود المعالجين، فجوات الامتثال وفق القانون رقم 13 لسنة 2016",
     "about": "نراجع طريقة جمع ومعالجة البيانات الشخصية في منشأتك ونحدد خطوات الامتثال المطلوبة.",
     "docs": [
      "قائمة الأنظمة وقواعد البيانات",
      "النماذج والسياسات الحالية",
      "عقود مزودي الخدمات التقنية"
     ],
     "time": "2 إلى 4 أسابيع",
     "out": "تقرير الامتثال، سجل أنشطة المعالجة، سياسة خصوصية مقترحة، خطة معالجة"
    },
    "en": {
     "n": "Personal Data Protection (PDPPL) Compliance Review",
     "inc": "Inventory of personal data processed, consent and notice review, security controls assessment, processor contracts, compliance gaps under Law No. 13 of 2016",
     "about": "We review how your business collects and processes personal data and define the steps needed to comply.",
     "docs": [
      "List of systems and databases",
      "Current forms and policies",
      "IT service provider contracts"
     ],
     "time": "2 to 4 weeks",
     "out": "Compliance report, record of processing activities, draft privacy policy, remediation plan"
    }
   },
   {
    "c": "CQ-06",
    "p": 2500,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "تقويم الامتثال والتجديدات",
     "inc": "حصر التراخيص والسجلات والشهادات، مواعيد التجديد والإقرارات، الجهات المعنية، نظام تنبيهات مسبقة",
     "about": "نعد تقويماً شاملاً بكل الالتزامات النظامية لمنشأتك حتى لا تفوتك أي مهلة أو تجديد.",
     "docs": [
      "السجل التجاري والرخص",
      "بطاقة المنشأة وتصاريح العمال",
      "الشهادات والعقود السارية"
     ],
     "time": "3 إلى 5 أيام عمل",
     "out": "تقويم الامتثال السنوي، جدول تنبيهات قابل للتحديث"
    },
    "en": {
     "n": "Compliance & Renewals Calendar",
     "inc": "Inventory of licences, registrations and certificates, renewal and filing dates, relevant authorities, advance reminder system",
     "about": "We prepare a full calendar of your regulatory obligations so you never miss a deadline or renewal.",
     "docs": [
      "Commercial registration and licences",
      "Establishment card and work permits",
      "Valid certificates and contracts"
     ],
     "time": "3 to 5 working days",
     "out": "Annual compliance calendar, updatable reminder schedule"
    }
   }
  ]
 },
 {
  "code": "CM",
  "ar": "استشارات التسويق والمبيعات",
  "en": "Marketing & Sales Consulting",
  "about_ar": "نساعدك على الوصول إلى عملائك في السوق القطري بخطط تسويق ومبيعات عملية قابلة للقياس.",
  "about_en": "We help you reach customers in the Qatar market with practical, measurable marketing and sales plans.",
  "items": [
   {
    "c": "CM-01",
    "p": 6000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "الخطة التسويقية",
     "inc": "تحليل الوضع الحالي، الشرائح المستهدفة، التموضع والرسائل، المزيج التسويقي، القنوات والميزانية، خطة زمنية ومؤشرات قياس",
     "about": "نعد خطة تسويقية سنوية واضحة تربط أهداف المبيعات بالأنشطة والميزانية.",
     "docs": [
      "وصف المنتجات والخدمات",
      "بيانات المبيعات السابقة",
      "الميزانية التسويقية المتاحة"
     ],
     "time": "2 إلى 3 أسابيع",
     "out": "الخطة التسويقية، خطة الأنشطة الزمنية، مؤشرات الأداء التسويقي"
    },
    "en": {
     "n": "Marketing Plan",
     "inc": "Situation analysis, target segments, positioning and messages, marketing mix, channels and budget, timeline and metrics",
     "about": "We prepare a clear annual marketing plan that links sales goals to activities and budget.",
     "docs": [
      "Description of products and services",
      "Past sales data",
      "Available marketing budget"
     ],
     "time": "2 to 3 weeks",
     "out": "Marketing plan, activity timeline, marketing KPIs"
    }
   },
   {
    "c": "CM-02",
    "p": 3500,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "موجز الهوية التجارية",
     "inc": "تحليل العلامة والمنافسين، الشخصية والقيم، الرسائل الأساسية، توجهات الألوان والخطوط، موجز للمصمم",
     "about": "نعد موجزاً استراتيجياً للهوية التجارية يوجه المصمم لإنتاج هوية تعبر عن منشأتك. لا يشمل التصميم الجرافيكي.",
     "docs": [
      "اسم المنشأة ونشاطها",
      "الشريحة المستهدفة",
      "أمثلة لهويات تعجبك"
     ],
     "time": "1 إلى 2 أسبوع",
     "out": "وثيقة موجز الهوية التجارية"
    },
    "en": {
     "n": "Brand Identity Brief",
     "inc": "Brand and competitor analysis, personality and values, key messages, colour and typography direction, designer brief",
     "about": "We prepare a strategic brand brief that guides a designer to create an identity that reflects your business. Graphic design is not included.",
     "docs": [
      "Business name and activity",
      "Target segment",
      "Examples of identities you like"
     ],
     "time": "1 to 2 weeks",
     "out": "Brand identity brief document"
    }
   },
   {
    "c": "CM-03",
    "p": 8000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "استراتيجية دخول السوق",
     "inc": "اختيار السوق والشريحة، عرض القيمة، نموذج التسعير، قنوات البيع والتوزيع، خطة الإطلاق، الشراكات المقترحة",
     "about": "نضع خطة متكاملة لإطلاق منتج جديد أو دخول الشركة إلى السوق القطري بأقل مخاطرة.",
     "docs": [
      "وصف المنتج أو الخدمة",
      "دراسة سوق إن وجدت",
      "الموارد المتاحة للإطلاق"
     ],
     "time": "3 إلى 4 أسابيع",
     "out": "وثيقة استراتيجية دخول السوق، خطة الإطلاق"
    },
    "en": {
     "n": "Go-to-Market Strategy",
     "inc": "Market and segment selection, value proposition, pricing model, sales and distribution channels, launch plan, proposed partnerships",
     "about": "We set out a complete plan to launch a new product or enter the Qatar market with minimum risk.",
     "docs": [
      "Product or service description",
      "Market study if any",
      "Resources available for launch"
     ],
     "time": "3 to 4 weeks",
     "out": "Go-to-market strategy document, launch plan"
    }
   },
   {
    "c": "CM-04",
    "p": 5000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "تصميم عملية المبيعات",
     "inc": "مراحل البيع من العميل المحتمل إلى الإغلاق، نصوص التواصل، إدارة العملاء المحتملين، أهداف وحوافز فريق المبيعات، التقارير",
     "about": "نبني عملية مبيعات منظمة تزيد معدلات الإغلاق وتسهل متابعة أداء الفريق.",
     "docs": [
      "وصف عملية البيع الحالية",
      "حجم فريق المبيعات",
      "بيانات المبيعات السابقة"
     ],
     "time": "2 إلى 3 أسابيع",
     "out": "دليل عملية المبيعات، نصوص البيع، نموذج تقارير المبيعات"
    },
    "en": {
     "n": "Sales Process Design",
     "inc": "Sales stages from lead to close, contact scripts, lead management, sales team targets and incentives, reporting",
     "about": "We build an organized sales process that raises close rates and makes team performance easy to track.",
     "docs": [
      "Current sales process",
      "Sales team size",
      "Past sales data"
     ],
     "time": "2 to 3 weeks",
     "out": "Sales process manual, sales scripts, sales reporting template"
    }
   },
   {
    "c": "CM-05",
    "p": 4000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "استراتيجية التواصل الاجتماعي",
     "inc": "تحليل الحسابات الحالية والمنافسين، اختيار المنصات، محاور المحتوى، تقويم محتوى لثلاثة أشهر، ميزانية الإعلانات الممولة، مؤشرات القياس",
     "about": "نضع استراتيجية لحضورك على منصات التواصل الاجتماعي تناسب جمهورك في قطر.",
     "docs": [
      "روابط الحسابات الحالية",
      "الشريحة المستهدفة",
      "الميزانية الشهرية المتاحة"
     ],
     "time": "1 إلى 2 أسبوع",
     "out": "وثيقة الاستراتيجية، تقويم المحتوى، دليل النبرة والأسلوب"
    },
    "en": {
     "n": "Social Media Strategy",
     "inc": "Review of current accounts and competitors, platform selection, content pillars, three-month content calendar, paid ads budget, metrics",
     "about": "We create a social media strategy that fits your audience in Qatar.",
     "docs": [
      "Links to current accounts",
      "Target segment",
      "Available monthly budget"
     ],
     "time": "1 to 2 weeks",
     "out": "Strategy document, content calendar, tone of voice guide"
    }
   },
   {
    "c": "CM-06",
    "p": 5000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "استراتيجية التسعير",
     "inc": "تحليل التكاليف وأسعار المنافسين، القيمة المدركة لدى العملاء، نماذج التسعير والباقات، سياسة الخصومات، اختبار الأسعار",
     "about": "نساعدك على اختيار نموذج تسعير يحقق التوازن بين الربحية والقدرة التنافسية.",
     "docs": [
      "قائمة المنتجات وأسعارها الحالية",
      "بيانات التكلفة",
      "أسعار المنافسين المعروفة"
     ],
     "time": "2 إلى 3 أسابيع",
     "out": "تقرير استراتيجية التسعير، هيكل الأسعار والباقات، سياسة الخصومات"
    },
    "en": {
     "n": "Pricing Strategy",
     "inc": "Cost and competitor price analysis, customer perceived value, pricing models and bundles, discount policy, price testing",
     "about": "We help you choose a pricing model that balances profitability and competitiveness.",
     "docs": [
      "Product list and current prices",
      "Cost data",
      "Known competitor prices"
     ],
     "time": "2 to 3 weeks",
     "out": "Pricing strategy report, price and bundle structure, discount policy"
    }
   }
  ]
 },
 {
  "code": "CI",
  "ar": "التحول الرقمي وتقنية المعلومات",
  "en": "Digital Transformation & IT",
  "about_ar": "نساعد المنشآت على اختيار الأنظمة المناسبة وأتمتة أعمالها والبيع إلكترونياً بأمان وبتكلفة مدروسة.",
  "about_en": "We help businesses choose the right systems, automate their work and sell online securely and cost-effectively.",
  "items": [
   {
    "c": "CI-01",
    "p": 7000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "تقييم الجاهزية للتحول الرقمي",
     "inc": "تقييم الأنظمة والعمليات الحالية، مستوى المهارات الرقمية، تحديد الأولويات، خارطة طريق رقمية، تقدير التكاليف",
     "about": "نقيس مستوى النضج الرقمي لمنشأتك ونضع خارطة طريق مرحلية للتحول بأولويات واضحة.",
     "docs": [
      "قائمة الأنظمة والبرامج المستخدمة",
      "الهيكل التنظيمي",
      "أهداف الإدارة"
     ],
     "time": "3 إلى 4 أسابيع",
     "out": "تقرير التقييم، خارطة طريق التحول الرقمي، تقدير الميزانية"
    },
    "en": {
     "n": "Digital Transformation Assessment",
     "inc": "Review of current systems and processes, digital skills level, priority setting, digital roadmap, cost estimate",
     "about": "We measure your digital maturity and set a phased transformation roadmap with clear priorities.",
     "docs": [
      "List of systems and software in use",
      "Organization chart",
      "Management goals"
     ],
     "time": "3 to 4 weeks",
     "out": "Assessment report, digital transformation roadmap, budget estimate"
    }
   },
   {
    "c": "CI-02",
    "p": 6000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "اختيار نظام ERP أو CRM",
     "inc": "تحديد المتطلبات، إعداد كراسة طلب العروض، تقييم الموردين والعروض، العروض التجريبية، توصية الاختيار، خطة التطبيق",
     "about": "نساعدك على اختيار نظام تخطيط الموارد أو إدارة العملاء الأنسب لاحتياجك وميزانيتك دون تحيز لمورد.",
     "docs": [
      "وصف العمليات الحالية",
      "عدد المستخدمين",
      "الميزانية التقديرية"
     ],
     "time": "3 إلى 5 أسابيع",
     "out": "وثيقة المتطلبات، مصفوفة تقييم الموردين، تقرير التوصية"
    },
    "en": {
     "n": "ERP or CRM Selection",
     "inc": "Requirements definition, RFP preparation, vendor and proposal evaluation, demos, selection recommendation, implementation plan",
     "about": "We help you choose the ERP or CRM system that best fits your needs and budget, with no vendor bias.",
     "docs": [
      "Current process description",
      "Number of users",
      "Estimated budget"
     ],
     "time": "3 to 5 weeks",
     "out": "Requirements document, vendor evaluation matrix, recommendation report"
    }
   },
   {
    "c": "CI-03",
    "p": 6500,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "إطلاق التجارة الإلكترونية وجاهزية الترخيص",
     "inc": "متطلبات إضافة نشاط التجارة الإلكترونية إلى السجل التجاري، اختيار المنصة، بوابات الدفع والشحن، سياسات الموقع والشروط والأحكام، خطة الإطلاق",
     "about": "نجهزك للبيع عبر الإنترنت بشكل نظامي من الترخيص حتى إطلاق المتجر.",
     "docs": [
      "السجل التجاري",
      "قائمة المنتجات",
      "الشعار والهوية",
      "حساب بنكي تجاري"
     ],
     "time": "3 إلى 5 أسابيع",
     "out": "قائمة متطلبات الترخيص، توصية المنصة وبوابة الدفع، سياسات المتجر، خطة الإطلاق"
    },
    "en": {
     "n": "E-commerce Launch & Licence Readiness",
     "inc": "Requirements to add e-commerce activity to the commercial registration, platform selection, payment and shipping gateways, website policies and terms, launch plan",
     "about": "We get you ready to sell online legally, from licensing to store launch.",
     "docs": [
      "Commercial registration",
      "Product list",
      "Logo and brand identity",
      "Business bank account"
     ],
     "time": "3 to 5 weeks",
     "out": "Licensing requirements list, platform and payment gateway recommendation, store policies, launch plan"
    }
   },
   {
    "c": "CI-04",
    "p": 5000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "مراجعة أساسيات الأمن السيبراني",
     "inc": "مراجعة كلمات المرور والصلاحيات، النسخ الاحتياطي، حماية الأجهزة والبريد، الشبكة وشبكة الواي فاي، التوعية، خطة معالجة",
     "about": "مراجعة عملية لأساسيات الحماية في المنشآت الصغيرة والمتوسطة استرشاداً بإرشادات الوكالة الوطنية للأمن السيبراني.",
     "docs": [
      "قائمة الأجهزة والأنظمة",
      "طريقة النسخ الاحتياطي الحالية",
      "إتاحة الوصول للموقع"
     ],
     "time": "1 إلى 2 أسبوع",
     "out": "تقرير المراجعة، قائمة المخاطر حسب الأولوية، سياسة استخدام تقنية المعلومات"
    },
    "en": {
     "n": "Cybersecurity Basics Review",
     "inc": "Passwords and access rights, backups, device and email protection, network and Wi-Fi, awareness, remediation plan",
     "about": "A practical review of basic protection for small and medium businesses, guided by National Cyber Security Agency recommendations.",
     "docs": [
      "List of devices and systems",
      "Current backup method",
      "Site access"
     ],
     "time": "1 to 2 weeks",
     "out": "Review report, prioritized risk list, IT acceptable use policy"
    }
   },
   {
    "c": "CI-05",
    "p": 5500,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "أتمتة العمليات",
     "inc": "تحديد العمليات القابلة للأتمتة، اختيار الأدوات المناسبة، تصميم سير العمل، النماذج الإلكترونية، تجربة وتشغيل، تدريب المستخدمين",
     "about": "نحول العمليات الورقية والمتكررة إلى سير عمل إلكتروني يوفر الوقت ويقلل الأخطاء.",
     "docs": [
      "وصف العمليات المستهدفة",
      "الأنظمة الحالية",
      "منسق من طرف المنشأة"
     ],
     "time": "2 إلى 4 أسابيع",
     "out": "تصميم سير العمل، النماذج الإلكترونية، دليل الاستخدام"
    },
    "en": {
     "n": "Process Automation",
     "inc": "Identification of automatable processes, tool selection, workflow design, electronic forms, testing and go-live, user training",
     "about": "We turn paper-based and repetitive processes into electronic workflows that save time and reduce errors.",
     "docs": [
      "Description of target processes",
      "Current systems",
      "A coordinator from your side"
     ],
     "time": "2 to 4 weeks",
     "out": "Workflow design, electronic forms, user guide"
    }
   },
   {
    "c": "CI-06",
    "p": 4500,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "موقع شركة ثنائي اللغة بقائمة الخدمات والأسعار",
     "inc": "موقع عربي وإنجليزي بهوية الشركة، قائمة خدمات وأسعار بمجموعات، تفاصيل كل خدمة، حاسبة تكلفة، نموذج عرض سعر على ترويسة الشركة وختمها يُرسل واتساب أو بريد، سياسة الخصوصية، تهيئة الظهور في Google، استضافة مجانية",
     "about": "موقع احترافي يعرض خدماتك وأسعارك بوضوح ويحوّل الزائر إلى طلب عرض سعر مباشرة على واتساب أو البريد.",
     "docs": [
      "الاسم التجاري وبيانات التواصل",
      "قائمة الخدمات والأسعار",
      "الشعار والألوان إن وجدت"
     ],
     "time": "من 5 إلى 10 أيام عمل",
     "out": "موقع منشور على رابط خاص بالشركة، ودليل تحديث الأسعار"
    },
    "en": {
     "n": "Bilingual company website with services and prices",
     "inc": "Arabic and English site in your brand, grouped service and price list, service details, cost estimator, quote form on your letterhead and stamp sent by WhatsApp or email, privacy policy, Google visibility setup, free hosting",
     "about": "A professional website that shows your services and prices clearly and turns visitors into quote requests on WhatsApp or email.",
     "docs": [
      "Trade name and contact details",
      "Services and prices list",
      "Logo and colours if available"
     ],
     "time": "5 to 10 working days",
     "out": "Live website on your company link, and a price-update guide"
    }
   },
   {
    "c": "CI-07",
    "p": 9500,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "موقع مع بوابة عملاء ولوحة إدارة",
     "inc": "كل ما في الموقع، مع حسابات للعملاء يطلبون منها ويتابعون طلباتهم وينزلون ملفاتهم ويراسلونكم، ولوحة إدارة للعملاء والطلبات والمعاملات والمراسلات والملفات، وقاعدة بيانات Google Sheets في حسابكم، وبريد تأكيد وإشعارات وتقرير يومي",
     "about": "يجمع عملاءك وطلباتهم وملفاتهم في نظام واحد تملكه بالكامل، بلا خادم مدفوع.",
     "docs": [
      "بيانات الموقع",
      "حساب Gmail للشركة",
      "حالات الطلب المعتمدة عندكم"
     ],
     "time": "من 2 إلى 3 أسابيع",
     "out": "موقع وبوابة عملاء ولوحة إدارة تعمل، ودليل تشغيل بالعربية"
    },
    "en": {
     "n": "Website with client portal and admin panel",
     "inc": "Everything in the website, plus client accounts to order, track requests, download files and message you, an admin panel for clients, requests, jobs, messages and files, a Google Sheets database in your own account, confirmation emails, alerts and a daily report",
     "about": "Brings your clients, their requests and files into one system you fully own, with no paid server.",
     "docs": [
      "Website details",
      "Company Gmail account",
      "Your request statuses"
     ],
     "time": "2 to 3 weeks",
     "out": "Working website, client portal and admin panel, with an Arabic operating guide"
    }
   },
   {
    "c": "CI-08",
    "p": 15000,
    "from": true,
    "unit_ar": "للمشروع",
    "unit_en": "per project",
    "ar": {
     "n": "نظام إدارة متكامل للشركة",
     "inc": "كل ما في الموقع والبوابة، مع حسابات الموظفين وصلاحيات مختارة لكل موظف، تسجيل الحضور والتأخير، سجل كل إجراء، تقارير أداء تُرسل بالبريد، حماية من محاولات الاختراق وتنبيهات أمنية فورية، مسودة المستندات القانونية (اتفاقية الخدمة، التفويض، الخصوصية)، ولوحة إدارة بالعربية والإنجليزية",
     "about": "نظام تشغيل كامل لشركتك: عملاء وموظفون وصلاحيات وتقارير وأمان، بعربي وإنجليزي.",
     "docs": [
      "بيانات الموقع",
      "حساب Gmail للشركة",
      "قائمة الموظفين وأدوارهم"
     ],
     "time": "من 3 إلى 5 أسابيع",
     "out": "نظام كامل يعمل، وتدريب عن بعد للمدير، ودليل تشغيل"
    },
    "en": {
     "n": "Complete company management system",
     "inc": "Everything in the portal, plus staff accounts with per-employee permissions, attendance and lateness, a log of every action, emailed performance reports, intrusion protection with instant security alerts, draft legal documents (service agreement, authorization, privacy), and a bilingual admin panel",
     "about": "A full operating system for your company: clients, staff, permissions, reports and security, in Arabic and English.",
     "docs": [
      "Website details",
      "Company Gmail account",
      "Staff list and roles"
     ],
     "time": "3 to 5 weeks",
     "out": "Working system, remote training for the manager, and an operating guide"
    }
   },
   {
    "c": "CI-09",
    "p": 350,
    "from": true,
    "unit_ar": "شهرياً",
    "unit_en": "per month",
    "ar": {
     "n": "الدعم والتحديث الشهري للموقع والنظام",
     "inc": "تحديث الأسعار والخدمات، إصلاح الأعطال، تحديثات الأمان، نسخة احتياطية شهرية، مراجعة سجل الأمان. السعر حسب الحجم: 350 للموقع، 750 للموقع مع البوابة، 1,200 للنظام المتكامل",
     "about": "يبقى موقعك ونظامك محدثاً وآمناً دون أن تحتاج فريقاً تقنياً.",
     "docs": [
      "رابط الموقع وحساب الإدارة"
     ],
     "time": "اشتراك شهري، والحد الأدنى 3 أشهر",
     "out": "تحديثات شهرية وتقرير مختصر"
    },
    "en": {
     "n": "Monthly support and updates for your website and system",
     "inc": "Price and service updates, bug fixes, security updates, monthly backup, security log review. Price by size: 350 for the website, 750 with the portal, 1,200 for the full system",
     "about": "Keeps your website and system current and secure without an in-house tech team.",
     "docs": [
      "Website link and admin account"
     ],
     "time": "Monthly subscription, minimum 3 months",
     "out": "Monthly updates and a short report"
    }
   },
   {
    "c": "CI-10",
    "p": 750,
    "from": true,
    "unit_ar": "للميزة",
    "unit_en": "per feature",
    "ar": {
     "n": "إضافة قسم أو ميزة جديدة لموقع أو نظام قائم",
     "inc": "دراسة الطلب، التنفيذ، الاختبار، النشر",
     "about": "نضيف ما تحتاجه شركتك مع نموها، بسعر معروف قبل البدء.",
     "docs": [
      "وصف الميزة المطلوبة"
     ],
     "time": "من 2 إلى 7 أيام عمل",
     "out": "الميزة منشورة ومختبرة"
    },
    "en": {
     "n": "Add a section or feature to an existing website or system",
     "inc": "Request review, build, testing, publishing",
     "about": "We add what your company needs as it grows, at a price agreed before we start.",
     "docs": [
      "Description of the feature"
     ],
     "time": "2 to 7 working days",
     "out": "Feature live and tested"
    }
   }
  ]
 },
 {
  "code": "CL",
  "ar": "الاستشارات القانونية (بالتعاون مع مكاتب محاماة مرخصة)",
  "en": "Legal Consulting (with Licensed Law Firms)",
  "about_ar": "تقدم هذه الخدمات عبر مكاتب محاماة مرخصة في قطر نتعاون معها، ويتولى المحامي المرخص الرأي القانوني والصياغة النهائية، بينما ننسق الملف ونتابعه معك.",
  "about_en": "These services are delivered through licensed Qatari law firms we partner with; the licensed lawyer provides the legal opinion and final drafting while we coordinate and follow up the file with you.",
  "items": [
   {
    "c": "CL-01",
    "p": 2500,
    "from": true,
    "unit_ar": "للعقد",
    "unit_en": "per contract",
    "ar": {
     "n": "صياغة عقد تجاري",
     "inc": "فهم الاتفاق، صياغة البنود الأساسية، الضمانات والجزاءات، تسوية النزاعات، مراجعة نهائية من محامٍ مرخص",
     "about": "صياغة عقود البيع والتوريد والخدمات والإيجار وغيرها بواسطة محامٍ مرخص من شركائنا.",
     "docs": [
      "بيانات الأطراف",
      "ملخص الاتفاق والشروط",
      "أي مسودات أو مراسلات سابقة"
     ],
     "time": "3 إلى 7 أيام عمل",
     "out": "مسودة عقد نهائية بالعربية أو بالعربية والإنجليزية"
    },
    "en": {
     "n": "Contract Drafting",
     "inc": "Understanding the deal, drafting key clauses, guarantees and penalties, dispute resolution, final review by a licensed lawyer",
     "about": "Drafting of sale, supply, service, lease and other contracts by a licensed lawyer from our partner firms.",
     "docs": [
      "Party details",
      "Summary of terms",
      "Any previous drafts or correspondence"
     ],
     "time": "3 to 7 working days",
     "out": "Final contract draft in Arabic or bilingual Arabic and English"
    }
   },
   {
    "c": "CL-02",
    "p": 1500,
    "from": true,
    "unit_ar": "للعقد",
    "unit_en": "per contract",
    "ar": {
     "n": "مراجعة عقد",
     "inc": "مراجعة البنود، تحديد المخاطر والالتزامات، اقتراح التعديلات، مذكرة ملاحظات من محامٍ مرخص",
     "about": "مراجعة عقد مقدم إليك قبل التوقيع لحماية مصالحك وتوضيح المخاطر.",
     "docs": [
      "نسخة العقد",
      "ملاحظاتك أو مخاوفك"
     ],
     "time": "2 إلى 4 أيام عمل",
     "out": "مذكرة مراجعة، عقد بتعديلات مقترحة"
    },
    "en": {
     "n": "Contract Review",
     "inc": "Clause review, risks and obligations, suggested amendments, review memo from a licensed lawyer",
     "about": "Review of a contract offered to you before signing, to protect your interests and clarify the risks.",
     "docs": [
      "Copy of the contract",
      "Your notes or concerns"
     ],
     "time": "2 to 4 working days",
     "out": "Review memo, contract with suggested amendments"
    }
   },
   {
    "c": "CL-03",
    "p": 4000,
    "from": true,
    "unit_ar": "للعقد",
    "unit_en": "per contract",
    "ar": {
     "n": "اتفاقية الشراكة وعقد تأسيس الشركة",
     "inc": "اختيار الشكل القانوني، توزيع الحصص والأرباح، الإدارة والصلاحيات، دخول وخروج الشركاء، تسوية الخلافات، الصياغة بواسطة محامٍ مرخص",
     "about": "نصيغ اتفاقية الشركاء أو عقد التأسيس بما يحمي حقوق كل شريك وينظم الإدارة ويمنع الخلافات.",
     "docs": [
      "بيانات الشركاء ونسبهم",
      "النشاط ورأس المال",
      "الاتفاقات الشفهية بين الشركاء"
     ],
     "time": "1 إلى 2 أسبوع",
     "out": "اتفاقية الشراكة أو عقد التأسيس جاهز للتوثيق"
    },
    "en": {
     "n": "Partnership & Company Agreement",
     "inc": "Choice of legal form, shares and profit split, management and authority, partner entry and exit, dispute resolution, drafting by a licensed lawyer",
     "about": "We draft the partners' agreement or memorandum of association to protect each partner's rights, organize management and prevent disputes.",
     "docs": [
      "Partner details and shares",
      "Activity and capital",
      "Verbal understandings between partners"
     ],
     "time": "1 to 2 weeks",
     "out": "Partnership agreement or memorandum of association ready for notarization"
    }
   },
   {
    "c": "CL-04",
    "p": 4500,
    "from": true,
    "unit_ar": "للعقد",
    "unit_en": "per contract",
    "ar": {
     "n": "عقد الوكالة التجارية وتسجيلها",
     "inc": "صياغة أو مراجعة عقد الوكالة، الحصرية والنطاق الجغرافي، الالتزامات والإنهاء، متطلبات القيد في سجل الوكلاء التجاريين وفق القانون رقم 8 لسنة 2002",
     "about": "نساعد الوكلاء المحليين والشركات الأجنبية على تنظيم الوكالة التجارية وقيدها لدى وزارة التجارة والصناعة.",
     "docs": [
      "بيانات الموكل الأجنبي",
      "السجل التجاري للوكيل",
      "مسودة الاتفاق إن وجدت"
     ],
     "time": "2 إلى 3 أسابيع",
     "out": "عقد الوكالة، قائمة مستندات القيد، متابعة التسجيل"
    },
    "en": {
     "n": "Commercial Agency Agreement & Registration",
     "inc": "Drafting or review of the agency agreement, exclusivity and territory, obligations and termination, registration in the commercial agents register under Law No. 8 of 2002",
     "about": "We help local agents and foreign companies set up a commercial agency and register it with the Ministry of Commerce and Industry.",
     "docs": [
      "Foreign principal details",
      "Agent's commercial registration",
      "Draft agreement if any"
     ],
     "time": "2 to 3 weeks",
     "out": "Agency agreement, registration document list, registration follow-up"
    }
   },
   {
    "c": "CL-05",
    "p": 2000,
    "from": true,
    "unit_ar": "للملف",
    "unit_en": "per file",
    "ar": {
     "n": "استشارة تحصيل الديون التجارية",
     "inc": "دراسة المستندات والفواتير، تقييم الموقف القانوني، الإنذار الرسمي، خيارات التسوية أو التقاضي، تقدير التكلفة والمدة",
     "about": "نراجع مع المحامي المرخص ملف المديونية ونحدد أنسب الطرق لاسترداد مستحقاتك.",
     "docs": [
      "العقود والفواتير",
      "المراسلات مع المدين",
      "كشف حساب المديونية",
      "الشيكات إن وجدت"
     ],
     "time": "3 إلى 5 أيام عمل",
     "out": "مذكرة رأي، مسودة إنذار رسمي، خطة التحصيل المقترحة"
    },
    "en": {
     "n": "Debt Collection Advisory",
     "inc": "Review of documents and invoices, legal position assessment, formal notice, settlement or litigation options, cost and time estimate",
     "about": "Together with a licensed lawyer we review the debt file and set the best route to recover what you are owed.",
     "docs": [
      "Contracts and invoices",
      "Correspondence with the debtor",
      "Statement of account",
      "Cheques if any"
     ],
     "time": "3 to 5 working days",
     "out": "Opinion memo, draft formal notice, proposed collection plan"
    }
   },
   {
    "c": "CL-06",
    "p": 3000,
    "from": true,
    "unit_ar": "للرأي",
    "unit_en": "per opinion",
    "ar": {
     "n": "رأي قانوني مكتوب",
     "inc": "دراسة الوقائع والمستندات، البحث في التشريعات القطرية ذات العلاقة، الرأي القانوني المسبب، التوصيات العملية",
     "about": "رأي قانوني مكتوب وموقع من محامٍ مرخص حول مسألة تجارية أو عمالية أو تنظيمية محددة.",
     "docs": [
      "وصف المسألة",
      "المستندات ذات العلاقة"
     ],
     "time": "5 إلى 7 أيام عمل",
     "out": "مذكرة رأي قانوني موقعة"
    },
    "en": {
     "n": "Written Legal Opinion",
     "inc": "Review of facts and documents, research of relevant Qatari legislation, reasoned legal opinion, practical recommendations",
     "about": "A written legal opinion signed by a licensed lawyer on a specific commercial, labour or regulatory question.",
     "docs": [
      "Description of the question",
      "Related documents"
     ],
     "time": "5 to 7 working days",
     "out": "Signed legal opinion memo"
    }
   }
  ]
 },
 {
  "code": "CP",
  "ar": "الاستشارات بالساعة والدعم المستمر",
  "en": "Hourly Consulting & Ongoing Support",
  "about_ar": "خيارات مرنة للحصول على المشورة عند الحاجة أو دعم استشاري مستمر بتكلفة ثابتة.",
  "about_en": "Flexible options for advice when you need it, or ongoing advisory support at a fixed cost.",
  "items": [
   {
    "c": "CP-01",
    "p": 500,
    "from": false,
    "unit_ar": "للساعة",
    "unit_en": "per hour",
    "ar": {
     "n": "ساعة استشارية",
     "inc": "جلسة حضورية أو عن بعد مع مستشار مختص، مناقشة المسألة، توصيات عملية، ملخص مكتوب مختصر",
     "about": "مشورة مباشرة في أي موضوع إداري أو مالي أو فني أو تنظيمي دون الحاجة إلى مشروع كامل.",
     "docs": [
      "وصف موجز للموضوع قبل الجلسة",
      "المستندات ذات العلاقة"
     ],
     "time": "ساعة واحدة، ويحجز الموعد خلال يومي عمل",
     "out": "ملخص مكتوب بالتوصيات"
    },
    "en": {
     "n": "Consulting Hour",
     "inc": "In-person or remote session with a specialist consultant, discussion of the issue, practical recommendations, short written summary",
     "about": "Direct advice on any management, financial, technical or regulatory matter without a full project.",
     "docs": [
      "Short description of the topic before the session",
      "Related documents"
     ],
     "time": "One hour, booked within two working days",
     "out": "Written summary of recommendations"
    }
   },
   {
    "c": "CP-02",
    "p": 4500,
    "from": false,
    "unit_ar": "للباقة",
    "unit_en": "per package",
    "ar": {
     "n": "باقة 10 ساعات استشارية",
     "inc": "10 ساعات استشارية تستخدم خلال 3 أشهر، في مواضيع متعددة، حضورياً أو عن بعد",
     "about": "باقة موفرة لمن يحتاج دعماً متقطعاً على مدى عدة أسابيع.",
     "docs": [
      "تحديد المواضيع المتوقعة"
     ],
     "time": "صالحة لمدة 3 أشهر",
     "out": "ملخصات مكتوبة لكل جلسة"
    },
    "en": {
     "n": "10-Hour Consulting Package",
     "inc": "10 consulting hours to use within 3 months, across several topics, in person or remote",
     "about": "A cost-saving package for those who need occasional support over several weeks.",
     "docs": [
      "Expected topics"
     ],
     "time": "Valid for 3 months",
     "out": "Written summary for each session"
    }
   },
   {
    "c": "CP-03",
    "p": 3500,
    "from": true,
    "unit_ar": "للورشة",
    "unit_en": "per workshop",
    "ar": {
     "n": "ورشة عمل نصف يوم",
     "inc": "إعداد محتوى الورشة، تيسير الجلسة لمدة 4 ساعات، تمارين تطبيقية، مخرجات موثقة",
     "about": "ورشة مركزة لفريقك حول موضوع محدد مثل التخطيط أو حل المشكلات أو مراجعة العمليات.",
     "docs": [
      "الموضوع والأهداف",
      "عدد المشاركين",
      "مكان الورشة"
     ],
     "time": "4 ساعات، ويلزم إشعار مسبق بأسبوع",
     "out": "مادة الورشة، تقرير المخرجات والتوصيات"
    },
    "en": {
     "n": "Half-Day Workshop",
     "inc": "Workshop content preparation, 4-hour facilitated session, practical exercises, documented outputs",
     "about": "A focused workshop for your team on a specific topic such as planning, problem solving or process review.",
     "docs": [
      "Topic and objectives",
      "Number of participants",
      "Workshop venue"
     ],
     "time": "4 hours, one week's notice required",
     "out": "Workshop material, outputs and recommendations report"
    }
   },
   {
    "c": "CP-04",
    "p": 6000,
    "from": true,
    "unit_ar": "للدورة",
    "unit_en": "per course",
    "ar": {
     "n": "دورة تدريبية",
     "inc": "تصميم المحتوى، تدريب لمدة يومين حتى 15 متدرباً، الحقائب التدريبية، تقييم المتدربين، شهادات حضور",
     "about": "دورات تدريبية مخصصة في الإدارة والموارد البشرية والمالية والجودة والامتثال وخدمة العملاء.",
     "docs": [
      "موضوع الدورة",
      "عدد المتدربين ومستواهم",
      "مكان التدريب"
     ],
     "time": "يومان تدريبيان، ويلزم إشعار مسبق بأسبوعين",
     "out": "حقيبة تدريبية، تقرير التقييم، شهادات حضور"
    },
    "en": {
     "n": "Training Course",
     "inc": "Content design, two-day training for up to 15 trainees, training kits, trainee assessment, attendance certificates",
     "about": "Tailored training courses in management, HR, finance, quality, compliance and customer service.",
     "docs": [
      "Course topic",
      "Number and level of trainees",
      "Training venue"
     ],
     "time": "Two training days, two weeks' notice required",
     "out": "Training kit, assessment report, attendance certificates"
    }
   },
   {
    "c": "CP-05",
    "p": 4000,
    "from": true,
    "unit_ar": "شهرياً",
    "unit_en": "per month",
    "ar": {
     "n": "الدعم الاستشاري الشهري",
     "inc": "حتى 10 ساعات استشارية شهرياً، زيارة شهرية، رد على الاستفسارات خلال يوم عمل، مراجعة المستندات، تقرير شهري",
     "about": "مستشار دائم لمنشأتك بتكلفة ثابتة، يناسب المنشآت الصغيرة والمتوسطة التي لا تحتاج مستشاراً متفرغاً.",
     "docs": [
      "تحديد مجالات الدعم",
      "منسق من طرف المنشأة"
     ],
     "time": "اشتراك شهري بحد أدنى 3 أشهر",
     "out": "تقرير شهري بالأعمال والتوصيات"
    },
    "en": {
     "n": "Monthly Advisory Retainer",
     "inc": "Up to 10 consulting hours per month, monthly visit, replies to queries within one working day, document review, monthly report",
     "about": "A standing advisor for your business at a fixed cost, suited to SMEs that do not need a full-time consultant.",
     "docs": [
      "Areas of support",
      "A coordinator from your side"
     ],
     "time": "Monthly subscription, minimum 3 months",
     "out": "Monthly report of work done and recommendations"
    }
   },
   {
    "c": "CP-06",
    "p": 1500,
    "from": true,
    "unit_ar": "للاجتماع",
    "unit_en": "per meeting",
    "ar": {
     "n": "حضور اجتماعات مجلس الإدارة أو الإدارة",
     "inc": "مراجعة جدول الأعمال والمستندات مسبقاً، حضور الاجتماع بصفة استشارية، إعداد المحضر عند الطلب، متابعة القرارات",
     "about": "نحضر اجتماعاتكم بصفة مستشار لتقديم الرأي المهني ودعم اتخاذ القرار.",
     "docs": [
      "جدول الأعمال",
      "المستندات المرفقة بالاجتماع"
     ],
     "time": "حتى 3 ساعات للاجتماع",
     "out": "ملاحظات استشارية مكتوبة، محضر الاجتماع عند الطلب"
    },
    "en": {
     "n": "Board or Management Meeting Attendance",
     "inc": "Advance review of agenda and papers, attendance in an advisory capacity, minutes on request, follow-up of decisions",
     "about": "We attend your meetings as an advisor to give professional input and support decision making.",
     "docs": [
      "Meeting agenda",
      "Meeting papers"
     ],
     "time": "Up to 3 hours per meeting",
     "out": "Written advisory notes, meeting minutes on request"
    }
   }
  ]
 }
];
