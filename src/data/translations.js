/**
 * Comprehensive Bilingual Translations Dictionary
 * Primary Language: Egyptian Arabic ('ar')
 * Secondary Language: English ('en')
 * 
 * Guarantees 100% Arabic when 'ar' is selected (no English mixed in)
 * Guarantees 100% English when 'en' is selected (no Arabic mixed in)
 */

export const translations = {
  ar: {
    // 1. General & Brand
    brand: {
      name: 'أمريكان دريم',
      sub: 'عالم المرح العائلي بالإسماعيلية',
      tagline: 'العب . استمتع . احتفل'
    },
    common: {
      currency: 'ج.م',
      points: 'نقطة',
      pts: 'نقطة',
      ptsValue: '٢,٢٥٠ نقطة',
      save: 'وفر',
      perStudent: 'لكل طالب',
      perChild: 'لكل طفل',
      bookNow: 'احجز الآن',
      bookThis: 'احجز هذه التجربة',
      addToCart: 'أضف إلى السلة',
      viewCart: 'عرض السلة',
      explore: 'استكشف',
      exploreMore: 'استكشف المزيد',
      close: 'إغلاق',
      confirm: 'تأكيد الحجز',
      cancel: 'إلغاء',
      submit: 'إرسال',
      loading: 'جاري التحميل...',
      search: 'بحث...',
      searchPlaceholder: 'ابحث عن الألعاب، الباقات، والعروض...',
      allAges: 'لكل الأعمار',
      ages: 'الأعمار',
      today: 'اليوم',
      tomorrow: 'غداً',
      weekend: 'نهاية الأسبوع',
      morning: 'صباحي',
      evening: 'مسائي',
      copied: 'تم النسخ!',
      copy: 'نسخ'
    },

    // 2. Navigation & Headers
    nav: {
      home: 'الرئيسية',
      playZone: 'منطقة الألعاب',
      kidsArea: 'منطقة الأطفال',
      funPark: 'فن بارك',
      challenge: 'منطقة التحدي',
      adventure: 'منطقة المغامرات',
      packages: 'الباقات',
      vibes: 'أجواء المرح',
      restaurant: 'المطعم والكافيه',
      events: 'الحفلات والقاعات',
      trips: 'رحلات المدارس والمجموعات',
      tripsShort: 'الرحلات',
      about: 'من نحن',
      cart: 'السلة',
      profileName: 'أحمد',
      switchLangText: 'English'
    },

    // 3. SubNav
    subnav: {
      home: 'الرئيسية',
      kidsArea: 'منطقة الأطفال',
      funPark: 'فن بارك',
      challenge: 'منطقة التحدي',
      adventure: 'منطقة المغامرات',
      packages: 'الباقات',
      restaurant: 'المطعم والكافيه',
      vibes: 'أجواء المرح'
    },

    // 4. Mobile Bottom Nav
    bottomNav: {
      home: 'الرئيسية',
      kidsArea: 'الأطفال',
      funPark: 'فن بارك',
      challenge: 'التحدي',
      adventure: 'المغامرات',
      package: 'الباقات'
    },

    // 5. Drawer (Mobile Menu)
    drawer: {
      brand: 'أمريكان دريم',
      sub: 'منطقة الألعاب والمرح',
      home: 'الرئيسية',
      kidsArea: 'منطقة الأطفال (سوفت بلاي)',
      funPark: 'فن بارك (ألعاب الدوامة والسيارات)',
      challenge: 'منطقة التحدي (الواقع الافتراضي والآركيد)',
      adventure: 'منطقة المغامرات (الحبال والتسلق)',
      packages: 'باقات الألعاب والتوفير',
      events: 'الحفلات والقاعات والمناسبات',
      restaurant: 'المطعم والكافيه',
      trips: 'رحلات المدارس والمجموعات',
      cart: 'سلة التذاكر والمشتريات',
      about: 'عن المكان والآراء',
      quickInfoTitle: 'معلومات سريعة',
      address: 'الإسماعيلية - طريق البلاجات على ضفاف قناة السويس',
      hours: 'يومياً: ١٠:٠٠ صباحاً - ١١:٠٠ مساءً',
      phone: 'خدمة العملاء: ٠١٠١٢٣٤٥٦٧٨'
    },

    // 6. Footer
    footer: {
      about: 'من نحن',
      contact: 'تواصل معنا',
      safety: 'إرشادات الأمان والسلامة',
      privacy: 'سياسة الخصوصية',
      rights: '© ٢٠٢٦ أمريكان دريم الإسماعيلية. جميع الحقوق محفوظة.'
    },

    // 7. About Page
    about: {
      heroTitle1: 'العب',
      heroTitle2: 'استمتع',
      heroTitle3: 'احتفل',
      heroSubtitle: 'الوجهة العائلية الأولى على ضفاف قناة السويس بالإسماعيلية حيث تلتقي الألعاب التفاعلية بأشهى المأكولات وأجمل الاحتفالات.',
      exploreBtn: 'استكشف التجارب',
      contactBtn: 'تواصل معنا',
      stats: {
        zones: '٤ مناطق ألعاب رئيسية',
        rides: 'أكثر من ٥٠ لعبة آمنة ومجهزة',
        capacity: 'سعة ٤٥٠ فرد للقاعات والمناسبات',
        views: 'إطلالة بحرية بانورامية على القناة'
      },
      whatWeOfferTitle: 'ماذا نقدم في أمريكان دريم',
      whatWeOfferSub: 'مساحات ترفيهية مصممة بعناية فائقة لتناسب كل فرد في العائلة على ضفاف قناة السويس.',
      cards: {
        playZoneTitle: 'منطقة الألعاب',
        playZoneDesc: 'منطقة الأطفال • فن بارك • منطقة التحدي • منطقة المغامرات',
        restaurantTitle: 'مطعم وكافيه دريم',
        restaurantDesc: 'وجبات عائلية طازجة، بيتزا وسندوتشات ومشروبات منعشة أمام البحر مباشرة.',
        eventsTitle: 'القاعات والمناسبات',
        eventsDesc: 'حفلات أعياد ميلاد، خطوبات، لقاءات عائلية وتكريمات بتجهيزات صوت وإضاءة عالمية.',
        tripsTitle: 'رحلات المدارس والشركات',
        tripsDesc: 'برامج يوم كامل ممتعة ومخصصة للمدارس والحضانات مع مشرفين ووجبات طازجة.'
      },
      reviewsTitle: 'آراء وتجارب الزوار',
      reviewsSub: 'سعادتكم وسعادة أطفالكم هي هدفنا الدائم وشهادتكم وسام على صدورنا.',
      contactTitle: 'تواصل معنا واحجز موعدك',
      contactSub: 'فريقنا جاهز للرد على استفساراتكم وترتيب زيارتكم القادمة.',
      form: {
        nameLabel: 'الاسم بالكامل',
        namePlaceholder: 'اكتب اسمك هنا',
        phoneLabel: 'رقم الهاتف / الواتساب',
        phonePlaceholder: '010XXXXXXXX',
        msgLabel: 'رسالتك أو استفسارك',
        msgPlaceholder: 'اكتب تفاصيل طلبك أو استفسارك هنا...',
        submitBtn: 'إرسال الرسالة الآن',
        successMsg: 'شكراً لتواصلك معنا! سنرد عليك في أقرب وقت عبر الواتساب أو الهاتف.'
      }
    },

    // 8. Trips Page
    trips: {
      topPill: 'الحد الأدنى للمجموعة: ٣٠ طفلاً',
      heroTitleLine1: 'خطط ليومك المثالي في',
      heroTitleLine2: 'أمريكان دريم',
      heroSubtitle: 'اجمع مدرستك أو حضانتك أو مجموعتك ليوم حافل بالألعاب الحركية، والوجبات اللذيذة، والإطلالة البحرية، وذكريات تدوم للأبد.',
      features: {
        guide: 'مشرف مرافق لكل مجموعة',
        meals: 'باقات وجبات طازجة مخصصة',
        lounges: 'استراحات خاصة محجوزة'
      },
      exploreBtn: 'استكشف باقات الرحلات',
      offersSectionTitle: 'اختر باقة رحلتك',
      offersSectionSub: 'باقات متكاملة تضمن أعلى درجات المتعة والتنظيم بأفضل تكلفة مدروسة.',
      inclusionsLabel: 'مشتملات الباقة:',
      startingFrom: 'تبدأ من',
      packages: {
        fullDream: {
          title: 'يوم الحلم الكامل',
          desc: 'تجربة شاملة طوال اليوم عبر جميع مناطق الألعاب مع وجبة غداء كاملة ومرشد مخصص للمجموعة.',
          badge: 'الأكثر طلباً'
        },
        playDine: {
          title: 'لعب ووجبة لذيذة',
          desc: 'باقة متوازنة تجمع بين ألعاب مختارة ووجبة شهية، مثالية للرحلات الصباحية أو المسائية.',
          badge: 'أفضل قيمة'
        },
        playZone: {
          title: 'تجربة الألعاب الترفيهية',
          desc: 'طاقة وحماس بدون توقف! دخول كامل ومفتوح لمناطق الألعاب والأنشطة بدون وجبات.',
          badge: 'اقتصادية وممتعة'
        }
      },
      builderTitle: 'حاسبة ومصمم الرحلات المخصصة',
      builderSub: 'حدد بيانات مدرستك، وأعداد الطلاب والمشرفين، والموعد المناسب لحساب التكلفة وعرض السعر فوراً.',
      steps: {
        step1: '١. بيانات المدرسة أو المنظمة',
        step2: '٢. أعداد الطلاب والمشرفين والفئات العمرية',
        step3: '٣. الموعد والفترة المختارة'
      },
      labels: {
        orgName: 'اسم المدرسة / الحضانة / الهيئة',
        orgType: 'نوع الجهة',
        contactName: 'اسم منسق الرحلة المسؤول',
        phone: 'رقم الهاتف للتواصل',
        studentsCount: 'عدد الطلاب الإجمالي',
        supervisorsCount: 'عدد المشرفين المرافقين (مجاناً: ١ لكل ١٥ طالباً)',
        ageGroups: 'الفئات العمرية للطلاب:',
        tripDate: 'تاريخ الرحلة المطلوب',
        shift: 'الفترة المفضلة',
        shiftMorning: 'فترة صباحية (٩:٣٠ ص - ٢:٣٠ م)',
        shiftEvening: 'فترة مسائية (٣:٣٠ م - ٨:٣٠ م)',
        arrivalTime: 'وقت الوصول المتوقع'
      },
      summary: {
        title: 'ملخص الحجز وعرض السعر',
        packageLabel: 'الباقة المختارة:',
        studentsTotal: 'إجمالي الطلاب:',
        pricePerStudent: 'سعر الطالب:',
        supervisorsFree: 'مشرفين مرافقين:',
        totalEstimate: 'التكلفة الإجمالية التقديرية:',
        proceedBtn: 'مراجعة وتأكيد الحجز الآن',
        includedPill: 'وجبات وألعاب وإشراف مشمولة'
      },
      modal: {
        reviewTitle: 'مراجعة بيانات حجز الرحلة',
        quotationTitle: 'عرض السعر الرسمي المعتمد',
        downloadScreenshot: 'تحميل لقطة الشاشة كصورة',
        copyImage: 'نسخ صورة عرض السعر',
        sendWhatsApp: 'تأكيد الحجز عبر واتساب مع صورة العرض',
        officialNotice: 'هذا العرض رسمي وصادر من إدارة أمريكان دريم الإسماعيلية.'
      }
    },

    // 9. Events & Halls Page
    events: {
      heroTitle: 'الحفلات والقاعات',
      heroSubtitle: 'مناسبتك. مساحتك الخاصة. لحظات تدوم.',
      heroDesc: 'اختر المساحة المثالية لاحتفالك. من اللقاءات العائلية الدافئة إلى أضخم المناسبات، قاعاتنا على ضفاف قناة السويس تقدم أرقى بوفيهات الطعام والإضاءة والإشراف المتكامل.',
      tourBtn: 'جولة افتراضية ٣٦٠° في القاعات',
      occasionCardsTitle: 'مناسبات مميزة نبتكرها لأجلك',
      vibesTitle: 'أجواء الفعاليات والحفلات',
      vibesSub: 'عش اللحظة. اشعر بالأجواء الساحرة. كل احتفال يصنع ذكرى لا تُنسى.',
      bookExp: 'احجز هذه التجربة',
      capacityPrefix: 'تستوعب حتى'
    },

    // 10. Cart Page
    cart: {
      title: 'سلة الحجز والتذاكر',
      subtitle: 'راجع تذاكرك وباقاتك وأكمل الدفع وتأكيد الحجز بسهولة وسرعة.',
      emptyTitle: 'سلة الحجز فارغة حالياً',
      emptyDesc: 'لم تقم بإضافة أي تذاكر أو باقات بعد. توجه إلى مناطق الألعاب واختر ما يناسبك!',
      exploreBtn: 'استكشف مناطق الألعاب',
      itemCol: 'التذكرة / الباقة',
      zoneCol: 'المنطقة',
      qtyCol: 'العدد',
      priceCol: 'السعر',
      actionCol: 'حذف',
      totalSummary: 'ملخص الدفع',
      subtotal: 'المجموع الفرعي:',
      discount: 'الخصم الترويجي:',
      tax: 'رسوم الخدمة:',
      free: 'مجاناً',
      totalToPay: 'الإجمالي المطلوب دفعه:',
      pointsEquiv: 'أو بالنقاط:',
      choosePaymentMethod: 'اختر طريقة الدفع المناسبة',
      payMethods: {
        cashCard: 'الدفع عند الوصول / كاش',
        instapay: 'تحويل عبر إنستاباي (InstaPay)',
        vodafone: 'تحويل فودافون كاش (Vodafone Cash)',
        points: 'الدفع برصيد النقاط'
      },
      instapayInfo: 'حول الإجمالي إلى حساب إنستاباي: americandream@instapay ثم ارفع صورة الإيصال.',
      vodafoneInfo: 'حول الإجمالي إلى محفظة فودافون كاش: 01012345678 ثم ارفع صورة الإيصال.',
      pointsInfo: 'سيتم خصم النقاط من رصيد حسابك المسجل فور تأكيد الطلب.',
      checkoutBtn: 'تأكيد الحجز والدفع الآن',
      popup: {
        title: 'تأكيد الدفع وإرفاق صورة الإيصال',
        desc: 'يرجى إرفاق لقطة شاشة واضحة لإيصال التحويل لإتمام تأكيد الحجز وإصدار التذاكر.',
        selectFile: 'اضغط لاختيار صورة الإيصال',
        fileSelected: 'تم اختيار صورة الإيصال بنجاح',
        confirmWithImage: 'تأكيد الحجز مع إرسال الإيصال',
        cancel: 'رجوع'
      },
      success: {
        title: 'تم تأكيد طلبك بنجاح! 🎉',
        desc: 'تم تسجيل حجزك وإصدار الأكواد. يمكنك الآن التوجه للكاونتر واستلام إسورة الدخول.',
        orderRef: 'رقم مرجع الحجز:',
        backHome: 'العودة للرئيسية'
      }
    },

    // 11. Home Page
    home: {
      heroPlay: 'العب.',
      heroChallenge: 'تحدى.',
      heroAdventure: 'انطلق.',
      heroTagline: 'العب . تحدى . انطلق في المغامرة',
      heroSub: 'اختر منطقتك المفضلة وابدأ مغامرتك دلوقتي.',
      exploreBtn: 'استكشف كل المناطق',
      videoBtn: 'شاهد فيديو الجولة',
      stat1Title: '٤ مناطق ترفيهية',
      stat1Desc: 'من الصغار للأبطال',
      stat2Title: 'أكثر من ٥٠ لعبة',
      stat2Desc: 'ألعاب حديثة وحركية',
      stat3Title: 'متعة عائلية',
      stat3Desc: 'أمان معتمد لكل الأعمار',
      chooseTag: 'اكتشف الإثارة والمرح',
      chooseTitle: 'اختر تجربة ألعابك',
      chooseSub: 'أربع مناطق مجهزة ومصممة لتناسب مختلف الأعمار ومستويات الطاقة.',
      safetyPill: 'جميع التذاكر تشمل نظام مراقبة كامل وخزائن أمانات',
      kidsCard: {
        tag: 'ألعاب آمنة وإسفنجية',
        age: 'الأعمار: ١ - ٣ سنوات',
        name: 'منطقة الأطفال',
        quote: '"عالم مليان فرح، ضحك، وابتسامات متخلصش."',
        desc: 'ألعاب إسفنجية ناعمة، أحواض كور، ألعاب حسية وبصرية مصممة خصيصاً لأبطالنا الصغار.',
        time: '١٠:٠٠ ص - ١١:٣٠ م',
        btn: 'استكشف منطقة الأطفال'
      },
      funParkCard: {
        tag: 'ملاهي وألعاب كلاسيكية',
        age: 'الأعمار: ٤ - ١٢ سنة',
        name: 'فان بارك',
        quote: '"مكان الضحكة اللي ترن والخيال اللي يطير."',
        desc: 'إثارة متواصلة مع سيارات التصادم، قطار المرح، ترامبولين ضخم، جدران تسلق وزحاليق عملاقة.',
        time: 'طوال أيام الأسبوع: ١٠ ص - ١١ م',
        btn: 'استكشف فان بارك'
      },
      challengeCard: {
        tag: 'مهارة ومنافسة قوية',
        age: 'لكل الأعمار والكبار',
        name: 'منطقة التحدي',
        quote: '"اتحدى أصحابك في الرياضة، السباقات، وأقوى VR!"',
        desc: 'ادخل في منافسات آركيد حماسية، معارك الليزر، هوكي الطاولة، وأحدث أجهزة الواقع الافتراضي.',
        time: 'مفتوح حتى ١١:٣٠ م',
        btn: 'استكشف منطقة التحدي'
      },
      adventureCard: {
        tag: 'حماس ومسارات مغامرة',
        age: 'الأعمار: ٦+ سنوات والشباب',
        name: 'منطقة المغامرات',
        quote: '"اكتشف روح المغامرة جواك على الجسور المعلقة والتحديات!"',
        desc: 'حبال معلقة، جسور عقبات مرتفعة، تحديات تسلق ومسارات نينجا مجهزة لأعلى درجات الأمان والإثارة.',
        time: 'يلزم حزام الأمان وحذاء رياضي',
        btn: 'استكشف منطقة المغامرات'
      },
      destinationTag: 'وجهتكم الأولى للترفيه',
      destinationTitle: 'مكان واحد.. وأربع طرق للمتعة والمرح',
      destinationSub: 'من مغامرات الصغار لتحديات الكبار.. كل فرد في العيلة هيلاقي متعة مفيش زيها.',
      vibesTag: 'لحظات تفضل في البال',
      vibesTitle: 'أجواء وبسمات الزوار',
      vibesDesc: 'ضحكات حقيقية، أرقام قياسية، وذكريات عائلية مبهجة ملتقطة في اللحظة.',
      ctaTag: 'جاهز للتحدي؟',
      ctaTitle: 'مستعد تبدأ اللعب؟',
      ctaDesc: 'مغامرتك الجاية بتبدأ هنا. احجز تذاكرك أونلاين دلوقتي وادخل بدون أي انتظار.',
      ctaBtn: 'تصفح الباقات والعروض',
      feat1: 'استلام فوري للتذكرة الرقمية',
      feat2: 'مرونة كاملة في تعديل الموعد',
      feat3: 'ضمان أفضل سعر وخصومات حصرية'
    },

    // 12. Zones & Play
    zones: {
      badge: {
        play: 'العب',
        explore: 'اكتشف',
        learn: 'تعلم',
        together: 'معنا!'
      },
      seeAll: 'عرض الكل',
      getOffer: 'احجز العرض',
      getThisOffer: 'احجز هذه الباقة',
      playNow: 'العب الآن',
      explore360: 'جولة افتراضية ٣٦٠°',
      packagesTab: 'الباقات',
      ticketsTab: 'التذاكر',
      kidsArea: {
        title: 'منطقة الأطفال',
        subtitle: 'مغامرات صغيرة وسعادة كبيرة للأطفال من سن سنة وحتى ٦ سنوات!',
        offersTitle: 'عروض وتذاكر منطقة الأطفال',
        exploreTitle: 'استكشف ألعاب ومرافق منطقة الأطفال',
        ageFilter: 'الأعمار: ١ – ٣ سنوات'
      },
      funPark: {
        title: 'فن بارك',
        subtitle: 'عالم من المرح والضحك والابتسامات العائلية التي لا تنتهي!',
        offersTitle: 'عروض وتذاكر فن بارك',
        exploreTitle: 'استكشف ألعاب ومرافق فن بارك',
        ageFilter: 'الأعمار: ٤ – ١٢ سنة'
      },
      challenge: {
        title: 'منطقة التحدي',
        subtitle: 'تحدى نفسك، حطم رقمك القياسي، واستمتع باللعب!',
        offersTitle: 'عروض باقات منطقة التحدي',
        ticketsTitle: 'تذاكر ألعاب منطقة التحدي',
        exploreTitle: 'استكشف ألعاب التحدي والآركيد',
        ageFilter: 'لكل الأعمار'
      },
      adventure: {
        title: 'منطقة المغامرات',
        subtitle: 'حيث تلتقي الطاقة والحماس بابتسامات عائلية لا تنتهي!',
        offersTitle: 'عروض باقات منطقة المغامرات',
        ticketsTitle: 'تذاكر ألعاب منطقة المغامرات',
        exploreTitle: 'استكشف مسارات المغامرة والتسلق',
        ageFilter: 'لكل الأعمار'
      },
      packages: {
        heroTitle: 'يوم كامل من المرح',
        heroSub: 'ألعاب أكتر.. متعة أكتر.. ذكريات لا تُنسى',
        heroDesc: 'بوابتك لعالم الترفيه الداخلي الأول بالإسماعيلية. تذكرة واحدة تفتح لك أحدث ألعاب الواقع الافتراضي، ألعاب السوفت بلاي، والسباقات الحماسية.',
        dreamTag: 'متعة صممت خصيصاً لك',
        dreamTitle: 'اختر باقة أحلامك',
        dreamSub: 'باقات متدرجة ومدروسة لتناسب عشاق الآركيد، الأطفال الصغار، والعائلات.',
        tabs: {
          adventure: 'المغامرة',
          challenge: 'التحدي',
          midWeek: 'منتصف الأسبوع',
          weekend: 'نهاية الأسبوع'
        }
      },

      restaurantPage: {
        badge: 'المطعم والكافيه',
        heroTitle1: 'طعام رائع.',
        heroTitle2: 'لحظات لا تُنسى.',
        heroDesc: 'استمتع بأشهى المأكولات، ومشروباتك المفضلة، وأجواء الواجهة المائية الهادئة في أمريكان دريم الإسماعيلية',
        exploreBtn: 'استكشف خيارات الطعام ↓',
        bookTableBtn: 'احجز طاولة',
        tagAmbiance: 'إطلالة ساحرة على الواجهة المائية',
        tagFamily: 'مناسب للعائلات والمجموعات',
        sectionTag: 'تجارب تناول الطعام',
        sectionTitle1: 'اختر الطريقة',
        sectionTitle2: 'التي تفضلها للاستمتاع',
        sectionDesc: 'سواء كنت تسترخي على طول الممشى الكبير أو تتذوق الأطباق الطازجة في أي مكان على ضفاف القناة.',
        delivery: {
          badge: 'توصيل / سفري',
          tag: 'راحة وسرعة',
          title: 'خدمة التوصيل',
          desc: 'اطلب طعامك المفضل واستمتع به أينما كنت على طول واجهة الإسماعيلية المائية أو في منزلك مباشرة.',
          btn: 'اطلب الآن ←'
        },
        inPark: {
          badge: 'تناول الطعام بالحديقة',
          tag: 'جلسات عائلية',
          title: 'الطلب داخل أمريكان دريم',
          desc: 'اطلب أثناء تواجدك في أمريكان دريم واستمتع بوجبتك بسلاسة وبدون انتظار أثناء زيارتك.',
          btn: 'تصفح المنيو / اطلب هنا'
        },
        bookTable: {
          badge: 'جلسات VIP',
          tag: 'تراس الواجهة المائية',
          title: 'حجز طاولة',
          desc: 'احجز طاولتك بجوار القناة مباشرة لمشاهدة السفن العابرة وعيش تجربة استثنائية لا تُنسى.',
          btn: 'احجز طاولة الآن'
        },
        vibesTitle: 'VIBES',
        vibesDesc: 'طعام رائع، صحبة جميلة، ولحظات لا تُنسى.',
        hashtag: '#AmericanDreamIsmailia',
        modal: {
          bookTitle: 'حجز طاولة في المطعم',
          bookSub: 'اختر موعدك واستمتع بأجمل إطلالة على قناة السويس',
          nameLabel: 'الاسم بالكامل',
          phoneLabel: 'رقم الهاتف / واتساب',
          dateLabel: 'تاريخ الحجز',
          timeLabel: 'الموعد المفضل',
          guestsLabel: 'عدد الأفراد',
          zoneLabel: 'منطقة الجلوس المفضلة',
          zoneTerrace: 'تراس الواجهة المائية (VIP)',
          zonePromenade: 'الممشى الخارجي المفتوح',
          zoneIndoor: 'الصالة الداخلية المكيفة',
          zonePergola: 'برجولة الغروب العائلية',
          occasionLabel: 'المناسبة (اختياري)',
          occasionBirthday: 'عيد ميلاد',
          occasionAnniversary: 'ذكرى سنوية',
          occasionFamily: 'تجمع عائلي',
          occasionGeneral: 'عشاء عادي',
          confirmBtn: 'تأكيد الحجز الآن',
          successTitle: 'تم تأكيد حجزك بنجاح!',
          successSub: 'يسعدنا استقبالكم في أمريكان دريم الإسماعيلية',
          refCode: 'رقم مرجع الحجز:',
          whatsappBtn: 'إرسال تفاصيل الحجز عبر واتساب',
          deliveryTitle: 'طلب توصيل الوجبات',
          deliverySub: 'طعام طازج يصلك بسرعة أينما كنت',
          addressLabel: 'عنوان التوصيل في الإسماعيلية',
          notesLabel: 'ملاحظات إضافية',
          orderBtn: 'تأكيد وإرسال الطلب',
          menuTitle: 'قائمة طعام وكافيه أمريكان دريم',
          all: 'الكل',
          burgers: 'البرجر والسندوتشات',
          pizza: 'البيتزا الإيطالية',
          grills: 'المشاوي الفاخرة',
          drinks: 'المشروبات والعصائر',
          coffee: 'القهوة والحلويات',
          addToCart: 'أضف للطلب'
        }
      }
    }
  },

  en: {
    // 1. General & Brand
    brand: {
      name: 'American Dream',
      sub: 'Ismailia Premier Family Entertainment',
      tagline: 'Play . Dine . Celebrate'
    },
    common: {
      currency: 'EGP',
      points: 'pts',
      pts: 'pts',
      ptsValue: '2,250 pts',
      save: 'Save',
      perStudent: 'per student',
      perChild: 'per child',
      bookNow: 'Book Now',
      bookThis: 'Book This Experience',
      addToCart: 'Add to Cart',
      viewCart: 'View Cart',
      explore: 'Explore',
      exploreMore: 'Explore More',
      close: 'Close',
      confirm: 'Confirm Booking',
      cancel: 'Cancel',
      submit: 'Submit',
      loading: 'Loading...',
      search: 'Search...',
      searchPlaceholder: 'Search for rides, offers, and more...',
      allAges: 'All Ages',
      ages: 'Ages',
      today: 'Today',
      tomorrow: 'Tomorrow',
      weekend: 'Weekend',
      morning: 'Morning',
      evening: 'Evening',
      copied: 'Copied!',
      copy: 'Copy'
    },

    // 2. Navigation & Headers
    nav: {
      home: 'Home',
      playZone: 'Play Zone',
      kidsArea: 'Kids Area',
      funPark: 'Fun Park',
      challenge: 'Challenge Zone',
      adventure: 'Adventure Zone',
      packages: 'Packages',
      vibes: 'Vibes',
      restaurant: 'Restaurant & Cafe',
      events: 'Events & Halls',
      trips: 'School & Group Trips',
      tripsShort: 'Trips',
      about: 'About Us',
      cart: 'My Cart',
      profileName: 'Ahmed',
      switchLangText: 'العربية'
    },

    // 3. SubNav
    subnav: {
      home: 'Home',
      kidsArea: 'Kids Area',
      funPark: 'Fun Park',
      challenge: 'Challenge Zone',
      adventure: 'Adventure Zone',
      packages: 'Packages',
      restaurant: 'Restaurant & Cafe',
      vibes: 'Vibes'
    },

    // 4. Mobile Bottom Nav
    bottomNav: {
      home: 'Home',
      kidsArea: 'Kids Area',
      funPark: 'Fun Park',
      challenge: 'Challenge',
      adventure: 'Adventure',
      package: 'Packages'
    },

    // 5. Drawer (Mobile Menu)
    drawer: {
      brand: 'American Dream',
      sub: 'Play Zone & Park',
      home: 'Home',
      kidsArea: 'Kids Area (Soft Play & Ball Pit)',
      funPark: 'Fun Park (Carousel & Bumper Cars)',
      challenge: 'Challenge Zone (VR & Arcade Arena)',
      adventure: 'Adventure Zone (High Ropes & Karting)',
      packages: 'Party & Play Packages',
      events: 'Events & Waterfront Halls',
      restaurant: 'Restaurant & Seaside Cafe',
      trips: 'School & Group Trips',
      cart: 'My Cart & Passes',
      about: 'About Us & Reviews',
      quickInfoTitle: 'Quick Info',
      address: 'Ismailia - Waterfront Canal Promenade',
      hours: 'Daily: 10:00 AM - 11:00 PM',
      phone: 'Customer Support: +20 101 234 5678'
    },

    // 6. Footer
    footer: {
      about: 'About Us',
      contact: 'Contact Us',
      safety: 'Safety Rules & Guidelines',
      privacy: 'Privacy Policy',
      rights: '© 2026 American Dream Ismailia. All rights reserved.'
    },

    // 7. About Page
    about: {
      heroTitle1: 'Play',
      heroTitle2: 'Dine',
      heroTitle3: 'Celebrate',
      heroSubtitle: 'A premier canal-side destination where families and friends come together for kinetic fun, world-class culinary crafts, celebrations, and unforgettable memories.',
      exploreBtn: 'Explore Experiences',
      contactBtn: 'Get In Touch',
      stats: {
        zones: '4 Premier Play Zones',
        rides: '50+ Safe Attractions',
        capacity: '450 Guests Banquet Capacity',
        views: 'Panoramic Suez Canal Waterfront'
      },
      whatWeOfferTitle: 'What We Offer',
      whatWeOfferSub: 'Carefully curated spaces crafted for thrills, culinary joy, and milestone gatherings in an upscale waterfront setting overlooking the Suez Canal.',
      cards: {
        playZoneTitle: 'Play Zone',
        playZoneDesc: 'Kids Area • Fun Park • Challenge Zone • Adventure Zone',
        restaurantTitle: 'Dream Restaurant & Cafe',
        restaurantDesc: 'Fresh artisanal pizzas, handcrafted burgers, kids combos, and refreshing mocktails.',
        eventsTitle: 'Events & Waterfront Halls',
        eventsDesc: 'Waterfront birthday galas, private milestone banquets, corporate retreats, and state-of-the-art audio/visual setups.',
        tripsTitle: 'School & Group Trips',
        tripsDesc: 'All-inclusive full-day excursions with dedicated group hosts, chef-crafted meals, and safety supervision.'
      },
      reviewsTitle: 'What Families Say',
      reviewsSub: 'Your joy and your children smiles are our greatest inspiration.',
      contactTitle: 'Get In Touch With Us',
      contactSub: 'Our dedicated guest services team is eager to assist you with inquiries, private hall bookings, or school trip scheduling.',
      form: {
        nameLabel: 'Full Name',
        namePlaceholder: 'Enter your name',
        phoneLabel: 'Phone / WhatsApp',
        phonePlaceholder: '+20 10X XXX XXXX',
        msgLabel: 'Your Message or Inquiry',
        msgPlaceholder: 'How can we help make your visit extraordinary?',
        submitBtn: 'Send Message Now',
        successMsg: 'Thank you! We have received your inquiry and our team will get back to you shortly.'
      }
    },

    // 8. Trips Page
    trips: {
      topPill: 'MINIMUM GROUP: 30 CHILDREN',
      heroTitleLine1: 'PLAN YOUR PERFECT DAY AT',
      heroTitleLine2: 'AMERICAN DREAM',
      heroSubtitle: 'Bring your school, nursery, or company group for an exhilarating day of active games, chef-crafted meals, water-view thrills, and unforgettable childhood moments.',
      features: {
        guide: 'Supervisor Guide Included',
        meals: 'Custom Meal Packages',
        lounges: 'Private Reserved Lounges'
      },
      exploreBtn: 'Explore Trip Offers',
      offersSectionTitle: 'CHOOSE YOUR TRIP OFFERS',
      offersSectionSub: 'Choose from our curated trip packages, each crafted to provide the best combination of fun, food, and hassle-free coordination.',
      inclusionsLabel: 'PACKAGE INCLUSIONS:',
      startingFrom: 'Starting From',
      packages: {
        fullDream: {
          title: 'FULL DREAM DAY',
          desc: 'Comprehensive all-day experience across all 4 zones with lunch and dedicated group host.',
          badge: 'Most Popular'
        },
        playDine: {
          title: 'PLAY & DINE',
          desc: 'A balanced package with exciting play and a delicious meal, perfect for morning or afternoon trips.',
          badge: 'Best Value'
        },
        playZone: {
          title: 'PLAY ZONE EXPERIENCE',
          desc: 'Pure play and energy burn! Full access to games and activities without catering.',
          badge: 'Budget Friendly'
        }
      },
      builderTitle: 'CUSTOMIZE YOUR GROUP EXPERIENCE',
      builderSub: 'Fill in your school or organization details to calculate accurate pricing and export an official quotation.',
      steps: {
        step1: '1. Organization & Contact Details',
        step2: '2. Group Size & Age Groups',
        step3: '3. Schedule & Timing'
      },
      labels: {
        orgName: 'School / Nursery / Company Name',
        orgType: 'Organization Type',
        contactName: 'Coordinator Name',
        phone: 'Contact Phone Number',
        studentsCount: 'Total Number of Students',
        supervisorsCount: 'Accompanying Supervisors (1 complimentary per 15 students)',
        ageGroups: 'Student Age Groups:',
        tripDate: 'Requested Trip Date',
        shift: 'Preferred Shift',
        shiftMorning: 'Morning Shift (09:30 AM - 02:30 PM)',
        shiftEvening: 'Evening Shift (03:30 PM - 08:30 PM)',
        arrivalTime: 'Expected Arrival Time'
      },
      summary: {
        title: 'Booking Summary & Quotation',
        packageLabel: 'Selected Package:',
        studentsTotal: 'Total Students:',
        pricePerStudent: 'Price per Student:',
        supervisorsFree: 'Supervisors (Complimentary):',
        totalEstimate: 'Estimated Total Cost:',
        proceedBtn: 'Review & Confirm Reservation',
        includedPill: 'Meals & Activities Included'
      },
      modal: {
        reviewTitle: 'Review Group Reservation',
        quotationTitle: 'Official Trip Quotation',
        downloadScreenshot: 'Download Quotation Screenshot',
        copyImage: 'Copy Screenshot to Clipboard',
        sendWhatsApp: 'Send Booking via WhatsApp with Screenshot',
        officialNotice: 'This is an official quotation from American Dream Ismailia.'
      }
    },

    // 9. Events & Halls Page
    events: {
      heroTitle: 'EVENTS & HALLS',
      heroSubtitle: 'Your event. Your space. Your moment.',
      heroDesc: 'Find the perfect space for your celebration. From intimate gatherings to grand milestones, our waterfront venue brings world-class catering, ambient lighting, and personalized event management.',
      tourBtn: '360° Hall Tour',
      occasionCardsTitle: 'Bespoke Celebrations & Halls',
      vibesTitle: 'VIBES OF EVENTS',
      vibesSub: 'See the moments. Feel the atmosphere. Every celebration is tailored to perfection.',
      bookExp: 'Book This Experience',
      capacityPrefix: 'Accommodates up to'
    },

    // 10. Cart Page
    cart: {
      title: 'My Cart & Checkout',
      subtitle: 'Review your passes, bundles, and checkout securely.',
      emptyTitle: 'Your cart is currently empty',
      emptyDesc: 'You have not added any passes or tickets yet. Head to the play zones to select your passes!',
      exploreBtn: 'Explore Play Zones',
      itemCol: 'Pass / Item',
      zoneCol: 'Zone',
      qtyCol: 'Qty',
      priceCol: 'Price',
      actionCol: 'Remove',
      totalSummary: 'Order Summary',
      subtotal: 'Subtotal:',
      discount: 'Promotional Discount:',
      tax: 'Service Fee:',
      free: 'Free',
      totalToPay: 'Total to Pay:',
      pointsEquiv: 'Or with Points:',
      choosePaymentMethod: 'Select Payment Method',
      payMethods: {
        cashCard: 'Pay on Arrival / Cash',
        instapay: 'InstaPay Electronic Transfer',
        vodafone: 'Vodafone Cash Mobile Wallet',
        points: 'Pay with Reward Points'
      },
      instapayInfo: 'Transfer the total to InstaPay handle: americandream@instapay then upload your receipt screenshot.',
      vodafoneInfo: 'Transfer the total to Vodafone Cash number: 01012345678 then upload your receipt screenshot.',
      pointsInfo: 'Points will be deducted directly from your registered balance upon order confirmation.',
      checkoutBtn: 'Complete Booking & Pay Now',
      popup: {
        title: 'Confirm Payment & Attach Receipt Screenshot',
        desc: 'Please upload a clear screenshot of your payment transfer receipt to complete your booking confirmation.',
        selectFile: 'Click to select receipt screenshot',
        fileSelected: 'Receipt screenshot selected successfully',
        confirmWithImage: 'Confirm Order with Screenshot',
        cancel: 'Cancel'
      },
      success: {
        title: 'Your Booking is Confirmed! 🎉',
        desc: 'Your reservation has been processed. Show your booking reference at the reception counter to collect your wristbands.',
        orderRef: 'Booking Reference:',
        backHome: 'Back to Home'
      }
    },

    // 11. Home Page
    home: {
      heroPlay: 'PLAY.',
      heroChallenge: 'CHALLENGE.',
      heroAdventure: 'ADVENTURE.',
      heroTagline: 'PLAY . CHALLENGE . ADVENTURE',
      heroSub: 'Choose your zone and start your unforgettable family experience.',
      exploreBtn: 'EXPLORE ALL ZONES',
      videoBtn: 'WATCH VIRTUAL TOUR',
      stat1Title: '4 Distinct Zones',
      stat1Desc: 'From toddlers to daredevils',
      stat2Title: '50+ Games',
      stat2Desc: 'Modern arcades & kinetic thrill',
      stat3Title: 'Family Fun',
      stat3Desc: 'Safe certified for all ages',
      chooseTag: 'DISCOVER THE THRILLS',
      chooseTitle: 'CHOOSE YOUR EXPERIENCE',
      chooseSub: 'Four distinct zones designed for every age group and energy level.',
      safetyPill: 'All tickets include full safety surveillance & lockers',
      kidsCard: {
        tag: 'SAFE & SOFT PLAY',
        age: 'AGES 1 - 3',
        name: 'KIDS AREA',
        quote: '"A world of fun, laughter, and endless smiles."',
        desc: 'Soft play structures, ball pits, sensory games, and visual discovery designed especially for our youngest adventurers.',
        time: '10:00 AM - 11:30 PM',
        btn: 'EXPLORE KIDS AREA'
      },
      funParkCard: {
        tag: 'CLASSIC AMUSEMENT & RIDES',
        age: 'AGES 4 - 12',
        name: 'FUN PARK',
        quote: '"Where laughter echoes and imaginations take flight."',
        desc: 'Non-stop excitement with bumper cars, mini carousels, mega trampolines, climbing walls, and thrilling slides.',
        time: 'Open All Week 10am-11pm',
        btn: 'EXPLORE FUN PARK'
      },
      challengeCard: {
        tag: 'SKILL & COMPETITION',
        age: 'ALL AGES & ADULTS',
        name: 'CHALLENGE ZONE',
        quote: '"Challenge your friends to sports, racing, and VR!"',
        desc: 'Step into high-stakes arcade battles, laser shooting arenas, air hockey showdowns, and immersive VR simulators.',
        time: 'Open Until 11:30 PM',
        btn: 'EXPLORE CHALLENGE ZONE'
      },
      adventureCard: {
        tag: 'HIGH ENERGY & COURSES',
        age: 'AGES 6+ & TEENS',
        name: 'ADVENTURE ZONE',
        quote: '"Unleash your inner explorer on suspended challenges!"',
        desc: 'High rope courses, suspended obstacle bridges, climbing challenges, and ninja courses tested for maximum thrills.',
        time: 'Harness & Shoes Required',
        btn: 'EXPLORE ADVENTURE ZONE'
      },
      destinationTag: 'THE ULTIMATE DESTINATION',
      destinationTitle: 'ONE PLACE. FOUR WAYS TO HAVE FUN.',
      destinationSub: "From little adventures to exciting challenges, there's something for everyone.",
      vibesTag: 'MOMENTS THAT MATTER',
      vibesTitle: 'PLAY ZONE VIBES',
      vibesDesc: 'Authentic smiles and memorable milestones across American Dream.',
      ctaTag: 'ARE YOU READY?',
      ctaTitle: 'READY TO PLAY?',
      ctaDesc: 'Your next adventure starts here. Secure your passes online and skip the line.',
      ctaBtn: 'View Packages & Offers',
      feat1: 'Instant digital pass delivery',
      feat2: 'Flexible rescheduling',
      feat3: 'Best price guarantee'
    },

    // 12. Zones & Play
    zones: {
      badge: {
        play: 'PLAY',
        explore: 'EXPLORE',
        learn: 'LEARN',
        together: 'TOGETHER!'
      },
      seeAll: 'See All >',
      getOffer: 'Get Offer',
      getThisOffer: 'Get This Offer',
      playNow: 'Play Now',
      explore360: 'EXPLORE 360°',
      packagesTab: 'Packages',
      ticketsTab: 'Tickets',
      kidsArea: {
        title: 'Kids Area',
        subtitle: 'Little Adventurers Big Smiles!',
        offersTitle: 'Kids Area Offers & Passes',
        exploreTitle: 'Explore Kids Area Attractions',
        ageFilter: 'Ages 1 – 3'
      },
      funPark: {
        title: 'Fun Park',
        subtitle: 'A world of fun, laughter, and endless smiles',
        offersTitle: 'Fun Park Area Offers',
        exploreTitle: 'Explore Fun Park Attractions',
        ageFilter: 'Ages 4 – 12'
      },
      challenge: {
        title: 'CHALLENGE ZONE',
        subtitle: 'Challenge yourself, beat your score, and have fun',
        offersTitle: 'Challenge Zone Area Offers',
        ticketsTitle: 'Challenge Zone Area Tickets',
        exploreTitle: 'Explore Challenge Zone',
        ageFilter: 'All Ages'
      },
      adventure: {
        title: 'ADVENTURE ZONE',
        subtitle: "Where boundless energy meets endless family smiles",
        offersTitle: 'Adventure Zone Area Offers',
        ticketsTitle: 'Adventure Zone Area Tickets',
        exploreTitle: 'Explore Adventure Zone',
        ageFilter: 'All Ages'
      },
      packages: {
        heroTitle: 'MAKE A DAY OF IT',
        heroSub: 'More games. More fun. More memories.',
        heroDesc: "Choose your gateway into Egypt's premier indoor entertainment wonderland. One contactless wristband unlocks cutting-edge VR arcades, giant Scandinavian soft play, and high-octane racing.",
        dreamTag: 'PURE JOY, TAILORED FOR YOU',
        dreamTitle: 'Select Your Dream Experience',
        dreamSub: 'Simple tiered entry packages designed for solo gaming champions, energetic toddlers, and whole families celebrating milestone days.',
        tabs: {
          adventure: 'Adventure',
          challenge: 'Challenge',
          midWeek: 'Mid-Week',
          weekend: 'Weekend'
        }
      },

      restaurantPage: {
        badge: 'RESTAURANT & CAFE',
        heroTitle1: 'Good food.',
        heroTitle2: 'Great moments.',
        heroDesc: 'Enjoy delicious food, your favorite drinks, and a relaxing waterfront atmosphere at American Dream Ismailia',
        exploreBtn: 'Explore Dining Options ↓',
        bookTableBtn: 'Book a Table',
        tagAmbiance: 'Ambiance Waterfront View',
        tagFamily: 'Family & Group Friendly',
        sectionTag: 'DINING EXPERIENCES',
        sectionTitle1: 'Choose How You',
        sectionTitle2: 'Want to Enjoy',
        sectionDesc: 'Whether relaxing along the grand promenade or savoring fresh cuisine anywhere along the canal.',
        delivery: {
          badge: 'DELIVERY/TAKEAWAY',
          tag: 'CONVENIENCE',
          title: 'DELIVERY',
          desc: 'Order your favorite food and enjoy it wherever you are along the Ismailia waterfront or right at home.',
          btn: 'ORDER NOW →'
        },
        inPark: {
          badge: 'IN-PARK DINE',
          tag: 'PARK DINING',
          title: 'ORDER AT AMERICAN DREAM',
          desc: "Order while you're at American Dream and enjoy your meal seamlessly during your visit without waiting.",
          btn: 'ORDER HERE / VIEW MENU'
        },
        bookTable: {
          badge: 'VIP Seating',
          tag: 'WATERFRONT TERRACE',
          title: 'BOOK A TABLE',
          desc: 'Reserve your seaside table overlooking passing canal ships and indulge in an unforgettable culinary experience.',
          btn: 'BOOK A TABLE'
        },
        vibesTitle: 'VIBES',
        vibesDesc: 'Good food, good company, good moments.',
        hashtag: '#AmericanDreamIsmailia',
        modal: {
          bookTitle: 'Reserve a Restaurant Table',
          bookSub: 'Select your preferred time & experience the scenic Suez Canal waterfront',
          nameLabel: 'Full Name',
          phoneLabel: 'Phone / WhatsApp Number',
          dateLabel: 'Reservation Date',
          timeLabel: 'Preferred Time Slot',
          guestsLabel: 'Number of Guests',
          zoneLabel: 'Preferred Seating Area',
          zoneTerrace: 'Waterfront Terrace (VIP)',
          zonePromenade: 'Grand Promenade Open-Air',
          zoneIndoor: 'Indoor Climate-Controlled Hall',
          zonePergola: 'Sunset Family Pergola',
          occasionLabel: 'Occasion (Optional)',
          occasionBirthday: 'Birthday Party',
          occasionAnniversary: 'Anniversary',
          occasionFamily: 'Family Gathering',
          occasionGeneral: 'Casual Dining',
          confirmBtn: 'Confirm Reservation',
          successTitle: 'Reservation Confirmed!',
          successSub: "We're excited to welcome you to American Dream Ismailia",
          refCode: 'Booking Reference:',
          whatsappBtn: 'Send Booking to WhatsApp',
          deliveryTitle: 'Food Delivery Order',
          deliverySub: 'Hot & fresh food delivered anywhere along the waterfront or home',
          addressLabel: 'Delivery Address in Ismailia',
          notesLabel: 'Special Notes',
          orderBtn: 'Confirm & Send Order',
          menuTitle: 'American Dream Food & Drinks Menu',
          all: 'All',
          burgers: 'Burgers & Sandwiches',
          pizza: 'Artisan Pizzas',
          grills: 'Seaside Grills',
          drinks: 'Mocktails & Shakes',
          coffee: 'Specialty Coffee',
          addToCart: 'Add to Order'
        }
      }
    }
  }
};

/**
 * Helper to retrieve translations safely
 */
export function getTranslations(lang = 'ar') {
  return translations[lang] || translations.ar;
}
