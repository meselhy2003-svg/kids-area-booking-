import React, { useState, useMemo } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Award, 
  Wallet, 
  Receipt, 
  TrendingUp, 
  Ticket, 
  Utensils, 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock4, 
  Truck, 
  XCircle, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Baby, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  ExternalLink,
  DollarSign,
  Package,
  Layers,
  MapPin,
  FileText
} from 'lucide-react';
import './GuestActivityDashboard.css';

// Default Comprehensive Sample API Response Payload
export const SAMPLE_GUEST_API_RESPONSE = {
  success: true,
  message: 'تم جلب ملف الضيف الشامل وسجل المعاملات بنجاح',
  data: {
    guest: {
      _id: '6ac7f3f2a6e9e1dde4cdead1',
      name: 'أحمد محمود',
      phone: '01012345678',
      email: 'user.test@americandrea.eg',
      age: '28',
      gender: 'male',
      role: 'guest',
      points: 0,
      children: [],
      isRegistered: true,
      createdAt: '2026-10-08T19:50:10.613Z',
      updatedAt: '2026-10-08T20:44:46.839Z'
    },
    summary: {
      totalSpent: 15468,
      totalTransactionsCount: 12,
      purchases: {
        count: 6,
        totalAmount: 2807.8
      },
      trips: {
        count: 1,
        totalAmount: 11400
      },
      events: {
        count: 0,
        totalAmount: 0
      },
      tableReservations: {
        count: 0
      },
      restaurantOrders: {
        count: 5,
        totalAmount: 1260.2
      },
      pointsBalance: 0,
      firstActivityDate: '2026-10-08T05:04:36.496Z',
      lastActivityDate: '2026-10-09T18:20:58.322Z'
    },
    timeline: [
      {
        id: '6ac9308a0c494105f1a2159e',
        category: 'restaurant',
        categoryAr: 'طلب وجبات مطعم ودليفري',
        categoryEn: 'Restaurant Food & Delivery Order',
        code: 'AD-DLV-6896',
        date: '2026-10-09T18:20:58.322Z',
        amount: 205.2,
        currency: 'EGP',
        status: 'pending',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        title: 'توصيل للمنزل: كلاسيك جورميه سماشد برجر (x1)',
        description: 'العنوان: حي الشيخ زايد، الإسماعيلية | الإجمالي: 205.2 ج.م',
        raw: {
          _id: '6ac9308a0c494105f1a2159e',
          orderCode: 'AD-DLV-6896',
          customerName: 'أحمد محمود',
          customerPhone: '01012345678',
          deliveryAddress: 'حي الشيخ زايد، الإسماعيلية',
          deliveryNotes: 'الدور الثالث شقة 6',
          orderType: 'delivery',
          items: [
            {
              nameEn: 'Classic Gourmet Smashed Burger',
              nameAr: 'كلاسيك جورميه سماشد برجر',
              price: 180,
              quantity: 1,
              lineTotal: 180
            }
          ],
          subtotal: 180,
          deliveryFee: 0,
          vatAmount: 25.2,
          totalAmount: 205.2,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          status: 'pending',
          createdAt: '2026-10-09T18:20:58.322Z',
          updatedAt: '2026-10-09T18:20:58.322Z'
        }
      },
      {
        id: '6ac91fbd2bb23d00f3965d88',
        category: 'trips',
        categoryAr: 'حجز رحلة مدرسية / مجموعة',
        categoryEn: 'School & Group Trip Booking',
        code: 'AD-TRIP-7906',
        date: '2026-10-09T17:09:17.762Z',
        tripDate: '2026-10-25T00:00:00.000Z',
        amount: 11400,
        currency: 'EGP',
        status: 'confirmed',
        paymentMethod: 'Bank Transfer',
        paymentStatus: 'paid',
        title: 'Modern School — FULL DREAM DAY',
        description: '30 طالب + 2 مشرفين | تاريخ الرحلة: ٢٥/١٠/٢٠٢٦',
        raw: {
          _id: '6ac91fbd2bb23d00f3965d88',
          bookingCode: 'AD-TRIP-7906',
          guest: '6ac7f3f2a6e9e1dde4cdead1',
          orgName: 'Modern School',
          orgType: 'School',
          contactName: 'Omar',
          phone: '01012345678',
          offerId: 'full-dream',
          offerTitle: 'FULL DREAM DAY',
          pricePerStudent: 380,
          studentsCount: 30,
          supervisorsCount: 2,
          isSupervisorsManual: false,
          ageGroups: ['6-9', '10-12'],
          tripDate: '2026-10-25T00:00:00.000Z',
          shift: 'morning',
          arrivalTime: '09:30 AM',
          totalPrice: 11400,
          currency: 'EGP',
          status: 'confirmed',
          createdAt: '2026-10-09T17:09:17.762Z',
          updatedAt: '2026-10-09T18:40:31.251Z'
        }
      },
      {
        id: '6ac8f1204e9e72da3e3f4934',
        category: 'passes',
        categoryAr: 'شراء باقات وتذاكر PlayZone',
        categoryEn: 'PlayZone Passes & Packages',
        code: 'PZ-212048',
        date: '2026-10-09T13:50:24.667Z',
        amount: 100,
        currency: 'EGP',
        status: 'confirmed',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        title: 'تذكرة فردية منتصف الأسبوع (x1)',
        description: 'طلب تذاكر وباقات برقم PZ-212048 بمبلغ 100 ج.م',
        raw: {
          _id: '6ac8f1204e9e72da3e3f4934',
          orderCode: 'PZ-212048',
          guestName: 'أحمد محمود',
          guestPhone: '01012345678',
          tickets: [
            {
              title: 'تذكرة فردية منتصف الأسبوع',
              quantity: 1,
              unitPrice: 100,
              totalPrice: 100,
              pointsGets: 10
            }
          ],
          packages: [],
          totalPrice: 100,
          totalPoints: 10,
          paymentMethod: 'cash',
          paymentStatus: 'pending',
          status: 'confirmed',
          createdAt: '2026-10-09T13:50:24.667Z',
          updatedAt: '2026-10-09T13:50:24.667Z'
        }
      },
      {
        id: '6ac8f10b4e9e72da3e3f4933',
        category: 'passes',
        categoryAr: 'شراء باقات وتذاكر PlayZone',
        categoryEn: 'PlayZone Passes & Packages',
        code: 'PZ-721037',
        date: '2026-10-09T13:50:03.046Z',
        amount: 200,
        currency: 'EGP',
        status: 'confirmed',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        title: 'تذكرة فردية منتصف الأسبوع (x2)',
        description: 'طلب تذاكر وباقات برقم PZ-721037 بمبلغ 200 ج.م',
        raw: {
          _id: '6ac8f10b4e9e72da3e3f4933',
          orderCode: 'PZ-721037',
          guestName: 'أحمد محمود',
          guestPhone: '01012345678',
          tickets: [
            {
              title: 'تذكرة فردية منتصف الأسبوع',
              quantity: 2,
              unitPrice: 100,
              totalPrice: 200,
              pointsGets: 20
            }
          ],
          packages: [],
          totalPrice: 200,
          totalPoints: 20,
          paymentMethod: 'cash',
          paymentStatus: 'pending',
          status: 'confirmed',
          notes: 'حجز تذاكر نقداً عند الوصول (الدفع عند الوصول)',
          createdAt: '2026-10-09T13:50:03.046Z',
          updatedAt: '2026-10-09T13:50:03.046Z'
        }
      },
      {
        id: '6ac8edf73e3b57115c73b361',
        category: 'passes',
        categoryAr: 'شراء باقات وتذاكر PlayZone',
        categoryEn: 'PlayZone Passes & Packages',
        code: 'PZ-542519',
        date: '2026-10-09T13:36:55.730Z',
        amount: 100,
        currency: 'EGP',
        status: 'confirmed',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        title: 'باقة التحدي (x1)',
        description: 'طلب تذاكر وباقات برقم PZ-542519 بمبلغ 100 ج.م',
        raw: {
          _id: '6ac8edf73e3b57115c73b361',
          orderCode: 'PZ-542519',
          guestName: 'أحمد تجربة',
          guestPhone: '01012345678',
          packages: [
            {
              title: 'باقة التحدي',
              quantity: 1,
              unitPrice: 100,
              totalPrice: 100,
              pointsGets: 10
            }
          ],
          totalPrice: 100,
          totalPoints: 10,
          paymentMethod: 'cash',
          status: 'confirmed',
          createdAt: '2026-10-09T13:36:55.730Z'
        }
      },
      {
        id: '6ac8ede93e3b57115c73b360',
        category: 'passes',
        categoryAr: 'شراء باقات وتذاكر PlayZone',
        categoryEn: 'PlayZone Passes & Packages',
        code: 'PZ-486754',
        date: '2026-10-09T13:36:41.039Z',
        amount: 200,
        currency: 'EGP',
        status: 'confirmed',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        title: 'تذكرة فردية منتصف الأسبوع (x2)',
        description: 'طلب تذاكر وباقات برقم PZ-486754 بمبلغ 200 ج.م',
        raw: {
          _id: '6ac8ede93e3b57115c73b360',
          orderCode: 'PZ-486754',
          totalPrice: 200,
          status: 'confirmed',
          createdAt: '2026-10-09T13:36:41.039Z'
        }
      },
      {
        id: '6ac8729e40d1f4fcb32a91bc',
        category: 'restaurant',
        categoryAr: 'طلب وجبات مطعم ودليفري',
        categoryEn: 'Restaurant Food & Delivery Order',
        code: 'AD-DLV-5490',
        date: '2026-10-09T04:50:38.121Z',
        amount: 385,
        currency: 'EGP',
        status: 'out_for_delivery',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        title: 'توصيل للمنزل: كلاسيك جورميه سماشد برجر (x2)',
        description: 'العنوان: شارع شبين الكوم، الإسماعيلية | الإجمالي: 385 ج.م',
        raw: {
          _id: '6ac8729e40d1f4fcb32a91bc',
          orderCode: 'AD-DLV-5490',
          deliveryAddress: 'شارع شبين الكوم، الإسماعيلية',
          deliveryNotes: 'الدور الثالث شقة 6',
          totalAmount: 385,
          status: 'out_for_delivery',
          createdAt: '2026-10-09T04:50:38.121Z'
        }
      },
      {
        id: '6ac79e91d3d141a80808b879',
        category: 'restaurant',
        categoryAr: 'طلب وجبات مطعم ودليفري',
        categoryEn: 'Restaurant Food & Delivery Order',
        code: 'AD-DLV-6577',
        date: '2026-10-08T13:45:53.614Z',
        amount: 0,
        currency: 'EGP',
        status: 'pending',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        title: 'توصيل للمنزل: صنف من القائمة (x1)، صنف من القائمة (x1)',
        description: 'العنوان: حي النزهة - طريق البلاجات - الإسماعيلية | الإجمالي: 0 ج.م',
        raw: {
          _id: '6ac79e91d3d141a80808b879',
          orderCode: 'AD-DLV-6577',
          status: 'pending',
          createdAt: '2026-10-08T13:45:53.614Z'
        }
      },
      {
        id: '6ac79ddfd3d141a80808b878',
        category: 'restaurant',
        categoryAr: 'طلب وجبات مطعم ودليفري',
        categoryEn: 'Restaurant Food & Delivery Order',
        code: 'AD-DLV-4678',
        date: '2026-10-08T13:42:55.173Z',
        amount: 460,
        currency: 'EGP',
        status: 'pending',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        title: 'توصيل للمنزل: وجبة برجر البريوش بالجبنة الفاخرة (x2)، سموذي المانجو (x1)',
        description: 'العنوان: حي النزهة - طريق البلاجات - الإسماعيلية | الإجمالي: 460 ج.م',
        raw: {
          _id: '6ac79ddfd3d141a80808b878',
          orderCode: 'AD-DLV-4678',
          deliveryAddress: 'حي النزهة - طريق البلاجات - الإسماعيلية',
          deliveryNotes: 'يرجى توفير أدوات مائدة وصوص إضافي',
          totalAmount: 460,
          status: 'pending',
          createdAt: '2026-10-08T13:42:55.173Z'
        }
      },
      {
        id: '6ac7792b81fea5134e453442',
        category: 'restaurant',
        categoryAr: 'طلب وجبات مطعم ودليفري',
        categoryEn: 'Restaurant Food & Delivery Order',
        code: 'AD-DLV-6568',
        date: '2026-10-08T11:06:19.367Z',
        amount: 210,
        currency: 'EGP',
        status: 'pending',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        title: 'توصيل للمنزل: Artisanal Brioche Cheeseburger Meal (x1)',
        description: 'العنوان: طريق البلاجات | الإجمالي: 210 ج.م',
        raw: {
          _id: '6ac7792b81fea5134e453442',
          orderCode: 'AD-DLV-6568',
          deliveryAddress: 'طريق البلاجات',
          totalAmount: 210,
          status: 'pending',
          createdAt: '2026-10-08T11:06:19.367Z'
        }
      },
      {
        id: '6ac724d04772946a67fa6dfb',
        category: 'passes',
        categoryAr: 'شراء باقات وتذاكر PlayZone',
        categoryEn: 'PlayZone Passes & Packages',
        code: 'PZ-103066',
        date: '2026-10-08T05:06:24.756Z',
        amount: 1103.9,
        currency: 'EGP',
        status: 'completed',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        title: 'تذكرة ممتدة (x2) + باقة يوم العطلة المجمعة (x1)',
        description: 'طلب تذاكر وباقات برقم PZ-103066 بمبلغ 1103.9 ج.م',
        raw: {
          _id: '6ac724d04772946a67fa6dfb',
          orderCode: 'PZ-103066',
          totalPrice: 1103.9,
          totalPoints: 50,
          status: 'completed',
          used: true,
          createdAt: '2026-10-08T05:06:24.756Z'
        }
      },
      {
        id: '6ac72464ff1c5f7207b3d87e',
        category: 'passes',
        categoryAr: 'شراء باقات وتذاكر PlayZone',
        categoryEn: 'PlayZone Passes & Packages',
        code: 'PZ-543967',
        date: '2026-10-08T05:04:36.496Z',
        amount: 1103.9,
        currency: 'EGP',
        status: 'confirmed',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        title: 'تذكرة ممتدة (x2) + باقة العطلة المجمعة (x1)',
        description: 'طلب تذاكر وباقات برقم PZ-543967 بمبلغ 1103.9 ج.م',
        raw: {
          _id: '6ac72464ff1c5f7207b3d87e',
          orderCode: 'PZ-543967',
          totalPrice: 1103.9,
          totalPoints: 50,
          status: 'confirmed',
          createdAt: '2026-10-08T05:04:36.496Z'
        }
      }
    ]
  }
};

export default function GuestActivityDashboard({
  apiData = SAMPLE_GUEST_API_RESPONSE,
  lang = 'ar',
  onClose,
  onEditProfile
}) {
  const isAr = lang === 'ar';

  // Safe destructuring with solid defaults
  const guest = apiData?.data?.guest || {};
  const summary = apiData?.data?.summary || {};
  const timeline = useMemo(() => apiData?.data?.timeline || [], [apiData]);

  // Filtering and Search State for Timeline
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  // Toggle raw item details breakdown
  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Copy code handler
  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  // Initials generator
  const initials = useMemo(() => {
    if (!guest?.name) return 'G';
    return guest.name
      .split(' ')
      .filter(Boolean)
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [guest?.name]);

  // Filtered timeline items
  const filteredTimeline = useMemo(() => {
    return timeline.filter(item => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchStatus = activeStatus === 'all' || item.status === activeStatus;
      
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCategory && matchStatus;

      const matchSearch = 
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.categoryAr && item.categoryAr.toLowerCase().includes(q)) ||
        (item.categoryEn && item.categoryEn.toLowerCase().includes(q));

      return matchCategory && matchStatus && matchSearch;
    });
  }, [timeline, activeCategory, activeStatus, searchQuery]);

  // Helper for Status Badge styling
  const renderStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'confirmed':
      case 'completed':
      case 'paid':
        return (
          <span className="gpd-status-badge gpd-status-confirmed">
            <span className="gpd-status-dot"></span>
            <CheckCircle2 size={12} />
            <span>{isAr ? 'مؤكد ومكتمل' : 'Confirmed'}</span>
          </span>
        );
      case 'out_for_delivery':
      case 'delivering':
        return (
          <span className="gpd-status-badge gpd-status-delivering">
            <span className="gpd-status-dot"></span>
            <Truck size={12} />
            <span>{isAr ? 'جاري التوصيل' : 'Out for Delivery'}</span>
          </span>
        );
      case 'pending':
      case 'processing':
        return (
          <span className="gpd-status-badge gpd-status-pending">
            <span className="gpd-status-dot"></span>
            <Clock4 size={12} />
            <span>{isAr ? 'قيد المعالجة' : 'Pending'}</span>
          </span>
        );
      case 'cancelled':
      case 'rejected':
        return (
          <span className="gpd-status-badge gpd-status-cancelled">
            <span className="gpd-status-dot"></span>
            <XCircle size={12} />
            <span>{isAr ? 'ملغي' : 'Cancelled'}</span>
          </span>
        );
      default:
        return (
          <span className="gpd-status-badge gpd-status-neutral">
            <span className="gpd-status-dot"></span>
            <span>{status || 'Unknown'}</span>
          </span>
        );
    }
  };

  // Category Icon & Color Helper
  const getCategoryTheme = (category) => {
    switch (category) {
      case 'restaurant':
        return {
          icon: <Utensils size={15} />,
          labelEn: 'Restaurant & Delivery',
          labelAr: 'المطعم والدليفري',
          className: 'cat-restaurant'
        };
      case 'trips':
        return {
          icon: <Award size={15} />,
          labelEn: 'School & Group Trip',
          labelAr: 'رحلة مدرسية / مجموعة',
          className: 'cat-trips'
        };
      case 'passes':
      case 'playzone':
        return {
          icon: <Ticket size={15} />,
          labelEn: 'PlayZone Pass / Ticket',
          labelAr: 'تذاكر وباقات PlayZone',
          className: 'cat-playzone'
        };
      case 'events':
        return {
          icon: <Building2 size={15} />,
          labelEn: 'Event & Hall Booking',
          labelAr: 'حفلات وقاعات',
          className: 'cat-events'
        };
      default:
        return {
          icon: <Receipt size={15} />,
          labelEn: 'General Activity',
          labelAr: 'معاملة عامة',
          className: 'cat-general'
        };
    }
  };

  // Format Date Helper
  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`gpd-dashboard-wrapper ${isAr ? 'lang-ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* ========================================================================= */}
      {/* 1. GUEST IDENTITY CARD                                                    */}
      {/* ========================================================================= */}
      <section className="gpd-identity-card">
        <div className="gpd-identity-main">
          {/* Avatar with Initials & Online Status */}
          <div className="gpd-avatar-wrap">
            <div className={`gpd-avatar-circle ${guest.gender === 'female' ? 'female' : 'male'}`}>
              {initials}
            </div>
            <div className="gpd-avatar-badge" title={isAr ? 'حساب معتمد ومسجل' : 'Verified Registered Guest'}>
              <ShieldCheck size={14} />
            </div>
          </div>

          {/* Guest Identity Details */}
          <div className="gpd-identity-info">
            <div className="gpd-name-row">
              <h2 className="gpd-guest-name">{guest.name || (isAr ? 'ضيف غير مسمى' : 'Unnamed Guest')}</h2>
              <span className="gpd-tier-pill">
                <Sparkles size={13} />
                <span>{(summary.totalSpent || 0) >= 2000 ? (isAr ? 'عضوية VIP ماسية' : 'VIP Diamond Member') : (isAr ? 'ضيف معتمد' : 'Verified Guest')}</span>
              </span>
              <span className="gpd-id-tag">#{guest._id || 'N/A'}</span>
            </div>

            <div className="gpd-meta-chips-row">
              {guest.phone && (
                <a href={`tel:${guest.phone}`} className="gpd-meta-chip" title={isAr ? 'اتصال بالهاتف' : 'Call Phone'}>
                  <Phone size={13} />
                  <span>{guest.phone}</span>
                </a>
              )}

              {guest.email && (
                <a href={`mailto:${guest.email}`} className="gpd-meta-chip" title={isAr ? 'إرسال بريد إلكتروني' : 'Send Email'}>
                  <Mail size={13} />
                  <span>{guest.email}</span>
                </a>
              )}

              <div className="gpd-meta-chip neutral">
                <User size={13} />
                <span>
                  {guest.age ? `${guest.age} ${isAr ? 'سنة' : 'yrs'}` : (isAr ? 'العمر غير محدد' : 'Age N/A')} •{' '}
                  {guest.gender === 'female' ? (isAr ? 'أنثى' : 'Female') : (isAr ? 'ذكر' : 'Male')}
                </span>
              </div>

              <div className="gpd-meta-chip points">
                <Award size={13} />
                <span>{guest.points || summary.pointsBalance || 0} {isAr ? 'نقطة ولاء' : 'Points'}</span>
              </div>

              <div className="gpd-meta-chip date">
                <Calendar size={13} />
                <span>{isAr ? 'عضو منذ:' : 'Member since:'} {formatDateTime(guest.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Actions: Close / Edit / Export */}
        <div className="gpd-identity-actions">
          {onEditProfile && (
            <button type="button" className="gpd-btn-secondary" onClick={() => onEditProfile(guest)}>
              <FileText size={14} />
              <span>{isAr ? 'تعديل الملف' : 'Edit Profile'}</span>
            </button>
          )}

          {onClose && (
            <button type="button" className="gpd-close-btn" onClick={onClose} title={isAr ? 'إغلاق' : 'Close'}>
              <XCircle size={20} />
            </button>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FINANCIAL SUMMARY GRID (METRIC CARDS)                                   */}
      {/* ========================================================================= */}
      <section className="gpd-metrics-grid">
        {/* Metric 1: Total Spent (Main Highlight) */}
        <div className="gpd-metric-card highlight-emerald">
          <div className="gpd-metric-header">
            <div className="gpd-metric-icon emerald">
              <Wallet size={20} />
            </div>
            <span className="gpd-metric-badge emerald">
              <TrendingUp size={12} />
              <span>{isAr ? 'القيمة التراكمية' : 'Lifetime Value'}</span>
            </span>
          </div>
          <div className="gpd-metric-content">
            <span className="gpd-metric-label">{isAr ? 'إجمالي الإنفاق التراكمي' : 'Total Spent'}</span>
            <div className="gpd-metric-value emerald">
              {(summary.totalSpent || 0).toLocaleString()} <span className="gpd-currency">EGP</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Transactions */}
        <div className="gpd-metric-card">
          <div className="gpd-metric-header">
            <div className="gpd-metric-icon blue">
              <Receipt size={20} />
            </div>
            <span className="gpd-metric-badge blue">
              {summary.totalTransactionsCount || timeline.length} {isAr ? 'عملية' : 'txs'}
            </span>
          </div>
          <div className="gpd-metric-content">
            <span className="gpd-metric-label">{isAr ? 'إجمالي المعاملات والطلبات' : 'Total Transactions'}</span>
            <div className="gpd-metric-value">
              {summary.totalTransactionsCount || timeline.length}
            </div>
          </div>
        </div>

        {/* Metric 3: PlayZone Passes Breakdown */}
        <div className="gpd-metric-card">
          <div className="gpd-metric-header">
            <div className="gpd-metric-icon cyan">
              <Ticket size={20} />
            </div>
            <span className="gpd-metric-badge cyan">
              {summary.purchases?.count || 0} {isAr ? 'باقة' : 'passes'}
            </span>
          </div>
          <div className="gpd-metric-content">
            <span className="gpd-metric-label">{isAr ? 'تذاكر وباقات PlayZone' : 'PlayZone Purchases'}</span>
            <div className="gpd-metric-value">
              {(summary.purchases?.totalAmount || 0).toLocaleString()} <span className="gpd-currency">EGP</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Group & School Trips Breakdown */}
        <div className="gpd-metric-card">
          <div className="gpd-metric-header">
            <div className="gpd-metric-icon amber">
              <Award size={20} />
            </div>
            <span className="gpd-metric-badge amber">
              {summary.trips?.count || 0} {isAr ? 'رحلة' : 'trips'}
            </span>
          </div>
          <div className="gpd-metric-content">
            <span className="gpd-metric-label">{isAr ? 'الرحلات المدرسية والمجموعات' : 'Group & School Trips'}</span>
            <div className="gpd-metric-value">
              {(summary.trips?.totalAmount || 0).toLocaleString()} <span className="gpd-currency">EGP</span>
            </div>
          </div>
        </div>

        {/* Metric 5: Restaurant & Delivery Breakdown */}
        <div className="gpd-metric-card">
          <div className="gpd-metric-header">
            <div className="gpd-metric-icon orange">
              <Utensils size={20} />
            </div>
            <span className="gpd-metric-badge orange">
              {summary.restaurantOrders?.count || 0} {isAr ? 'طلب' : 'orders'}
            </span>
          </div>
          <div className="gpd-metric-content">
            <span className="gpd-metric-label">{isAr ? 'طلبات المطعم والدليفري' : 'Restaurant Orders'}</span>
            <div className="gpd-metric-value">
              {(summary.restaurantOrders?.totalAmount || 0).toLocaleString()} <span className="gpd-currency">EGP</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ACTIVITY TIMELINE (MAIN CONTENT)                                        */}
      {/* ========================================================================= */}
      <section className="gpd-timeline-section">
        {/* Section Header & Filters Bar */}
        <div className="gpd-timeline-header-bar">
          <div className="gpd-timeline-title-wrap">
            <div className="gpd-section-icon-wrap">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="gpd-timeline-title">{isAr ? 'سجل النشاط والمعاملات الموحد' : 'Unified Activity Timeline'}</h3>
              <p className="gpd-timeline-subtitle">
                {isAr ? `عرض ${filteredTimeline.length} من أصل ${timeline.length} معاملة مسجلة للضيف` : `Showing ${filteredTimeline.length} of ${timeline.length} recorded activities`}
              </p>
            </div>
          </div>

          {/* Search & Category Pills */}
          <div className="gpd-timeline-controls">
            {/* Search Input */}
            <div className="gpd-search-box">
              <Search size={14} className="gpd-search-icon" />
              <input 
                type="text"
                placeholder={isAr ? 'بحث بالكود، الصنف، العنوان...' : 'Search by code, item, title...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" className="gpd-clear-search" onClick={() => setSearchQuery('')}>
                  <XCircle size={13} />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="gpd-category-pills">
              <button 
                type="button" 
                className={`gpd-cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                {isAr ? 'الكل' : 'All'} ({timeline.length})
              </button>
              <button 
                type="button" 
                className={`gpd-cat-pill ${activeCategory === 'restaurant' ? 'active' : ''}`}
                onClick={() => setActiveCategory('restaurant')}
              >
                <Utensils size={13} />
                <span>{isAr ? 'المطعم' : 'Restaurant'} ({summary.restaurantOrders?.count || 0})</span>
              </button>
              <button 
                type="button" 
                className={`gpd-cat-pill ${activeCategory === 'passes' ? 'active' : ''}`}
                onClick={() => setActiveCategory('passes')}
              >
                <Ticket size={13} />
                <span>{isAr ? 'PlayZone' : 'Passes'} ({summary.purchases?.count || 0})</span>
              </button>
              <button 
                type="button" 
                className={`gpd-cat-pill ${activeCategory === 'trips' ? 'active' : ''}`}
                onClick={() => setActiveCategory('trips')}
              >
                <Award size={13} />
                <span>{isAr ? 'الرحلات' : 'Trips'} ({summary.trips?.count || 0})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vertical Timeline Container */}
        <div className="gpd-timeline-container">
          {filteredTimeline.length === 0 ? (
            <div className="gpd-empty-timeline">
              <Package size={40} className="gpd-empty-icon" />
              <h4>{isAr ? 'لا توجد معاملات مطابقة للبحث' : 'No matching activities found'}</h4>
              <p>{isAr ? 'جرب تغيير معايير البحث أو التصفية لعرض المزيد من البيانات.' : 'Try changing search keywords or category filters.'}</p>
            </div>
          ) : (
            <div className="gpd-timeline-track">
              {filteredTimeline.map((item, index) => {
                const theme = getCategoryTheme(item.category);
                const isExpanded = !!expandedItems[item.id];

                return (
                  <div key={item.id || index} className={`gpd-timeline-node ${theme.className}`}>
                    {/* Visual Milestone Node */}
                    <div className="gpd-node-marker">
                      <div className="gpd-node-icon">
                        {theme.icon}
                      </div>
                      <div className="gpd-node-line"></div>
                    </div>

                    {/* Timeline Item Card */}
                    <div className="gpd-timeline-card">
                      {/* Top Bar: Category, Order Code & Date */}
                      <div className="gpd-card-topbar">
                        <div className="gpd-card-left-tags">
                          <span className={`gpd-cat-badge ${theme.className}`}>
                            {isAr ? item.categoryAr || theme.labelAr : item.categoryEn || theme.labelEn}
                          </span>

                          <div className="gpd-code-wrap" title={isAr ? 'نسخ رقم المعاملة' : 'Copy Order Code'}>
                            <span className="gpd-code-text">{item.code}</span>
                            <button 
                              type="button" 
                              className="gpd-copy-btn" 
                              onClick={(e) => handleCopyCode(item.code, e)}
                            >
                              {copiedCode === item.code ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>

                        <div className="gpd-card-right-meta">
                          <span className="gpd-time-stamp">
                            <Clock size={12} />
                            <span>{formatDateTime(item.date)}</span>
                          </span>

                          {renderStatusBadge(item.status)}
                        </div>
                      </div>

                      {/* Main Content Body */}
                      <div className="gpd-card-body">
                        <div className="gpd-card-title-block">
                          <h4 className="gpd-item-title">{item.title}</h4>
                          {item.description && (
                            <p className="gpd-item-desc">{item.description}</p>
                          )}
                        </div>

                        {/* Amount & Price Tag */}
                        <div className="gpd-card-amount-block">
                          <span className="gpd-amount-label">{isAr ? 'القيمة الإجمالية' : 'Total Amount'}</span>
                          <span className="gpd-amount-value">
                            +{(item.amount || 0).toLocaleString()}{' '}
                            <span className="gpd-amount-currency">{item.currency || 'EGP'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Payment & Breakdown Footer */}
                      <div className="gpd-card-footer">
                        <div className="gpd-footer-chips">
                          {item.paymentMethod && (
                            <span className="gpd-footer-chip">
                              <Wallet size={12} />
                              <span>{isAr ? 'الدفع:' : 'Payment:'} {item.paymentMethod}</span>
                            </span>
                          )}

                          {item.paymentStatus && (
                            <span className={`gpd-footer-chip ${item.paymentStatus === 'paid' ? 'chip-paid' : 'chip-pending'}`}>
                              <CheckCircle2 size={12} />
                              <span>{isAr ? 'حالة السداد:' : 'Status:'} {item.paymentStatus}</span>
                            </span>
                          )}
                        </div>

                        {/* Expandable Breakdown Toggle */}
                        {item.raw && (
                          <button 
                            type="button" 
                            className="gpd-expand-btn"
                            onClick={() => toggleExpand(item.id)}
                          >
                            <span>{isExpanded ? (isAr ? 'إخفاء التفاصيل' : 'Hide Details') : (isAr ? 'تفاصيل الطلب' : 'View Breakdown')}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                      </div>

                      {/* Collapsible Raw / Itemized Breakdown */}
                      {isExpanded && item.raw && (
                        <div className="gpd-expanded-drawer">
                          {/* 1. If Restaurant Items */}
                          {item.raw.items && item.raw.items.length > 0 && (
                            <div className="gpd-drawer-section">
                              <h5 className="gpd-drawer-heading">
                                <Utensils size={13} />
                                <span>{isAr ? 'أصناف الوجبات والمشروبات المطلوبة:' : 'Ordered Food & Drink Items:'}</span>
                              </h5>
                              <div className="gpd-drawer-items-list">
                                {item.raw.items.map((it, itIdx) => (
                                  <div key={itIdx} className="gpd-drawer-item-row">
                                    <span className="gpd-drawer-item-name">
                                      {isAr ? (it.nameAr || it.nameEn) : (it.nameEn || it.nameAr)}{' '}
                                      <span className="gpd-drawer-qty">x{it.quantity}</span>
                                    </span>
                                    <span className="gpd-drawer-item-price">
                                      {(it.lineTotal || (it.price * it.quantity) || 0).toLocaleString()} EGP
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 2. If PlayZone Tickets / Packages */}
                          {item.raw.tickets && item.raw.tickets.length > 0 && (
                            <div className="gpd-drawer-section">
                              <h5 className="gpd-drawer-heading">
                                <Ticket size={13} />
                                <span>{isAr ? 'تذاكر الألعاب المحجوزة:' : 'Booked PlayZone Tickets:'}</span>
                              </h5>
                              <div className="gpd-drawer-items-list">
                                {item.raw.tickets.map((tkt, tIdx) => (
                                  <div key={tIdx} className="gpd-drawer-item-row">
                                    <span className="gpd-drawer-item-name">
                                      {tkt.title || tkt.ticket?.titleAr || tkt.ticket?.titleEn}{' '}
                                      <span className="gpd-drawer-qty">x{tkt.quantity}</span>
                                    </span>
                                    <span className="gpd-drawer-item-price">
                                      {(tkt.totalPrice || (tkt.unitPrice * tkt.quantity) || 0).toLocaleString()} EGP
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 3. If Group Trip Details */}
                          {item.raw.orgName && (
                            <div className="gpd-drawer-section">
                              <h5 className="gpd-drawer-heading">
                                <Award size={13} />
                                <span>{isAr ? 'بيانات الرحلة المدرسية:' : 'Group Trip Reservation Specs:'}</span>
                              </h5>
                              <div className="gpd-drawer-grid-2">
                                <div><strong>{isAr ? 'الجهة:' : 'Organization:'}</strong> {item.raw.orgName} ({item.raw.orgType})</div>
                                <div><strong>{isAr ? 'المسؤول:' : 'Contact:'}</strong> {item.raw.contactName} ({item.raw.phone})</div>
                                <div><strong>{isAr ? 'الطلاب:' : 'Students:'}</strong> {item.raw.studentsCount} {isAr ? 'طالب' : 'students'} ({item.raw.pricePerStudent} EGP/student)</div>
                                <div><strong>{isAr ? 'المشرفين:' : 'Supervisors:'}</strong> {item.raw.supervisorsCount}</div>
                              </div>
                            </div>
                          )}

                          {/* Delivery Address & Notes if any */}
                          {item.raw.deliveryAddress && (
                            <div className="gpd-drawer-meta-line">
                              <MapPin size={13} />
                              <span><strong>{isAr ? 'عنوان التوصيل:' : 'Delivery Address:'}</strong> {item.raw.deliveryAddress} {item.raw.deliveryNotes ? `(${item.raw.deliveryNotes})` : ''}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
