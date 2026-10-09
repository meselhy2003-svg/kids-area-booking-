import React, { useState, useMemo, useEffect, useRef } from 'react';
import EventsAnalyticsPanel from './EventsAnalyticsPanel';
import '../../pages/desktop/PlayZoneOrdersManager.css';
import './OrderDetailsUpdateForm.css';
import { 
  Sparkles, 
  PartyPopper, 
  Cake, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Search, 
  RefreshCw, 
  Download, 
  Printer, 
  RotateCcw, 
  X, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  SlidersHorizontal, 
  Building2, 
  Users, 
  Music, 
  CheckCircle2, 
  Clock4, 
  AlertCircle, 
  ChevronDown,
  CreditCard,
  ShieldCheck,
  Award
} from 'lucide-react';

// Initial Mock Events & Halls Bookings
const INITIAL_EVENTS_ORDERS = [
  {
    id: '#EV-4091',
    orderId: '#EV-4091',
    rawId: 'EV-4091',
    host: 'Sarah Al-Kady',
    phone: '01123456781',
    avatar: 'SK',
    avatarBg: '#a855f7',
    occasion: 'birthday',
    occasionAr: 'حفلة عيد ميلاد 10 سنوات 🎂',
    occasionEn: '10th Birthday Party Celebration 🎂',
    hall: 'Grand Celebration Ballroom',
    hallAr: 'قاعة الاحتفالات الكبرى',
    hallEn: 'Grand Celebration Ballroom',
    package: 'Super Adventure Birthday Pass',
    packageAr: 'باقة مغامرات عيد الميلاد السوبر',
    packageEn: 'Super Adventure Birthday Pass',
    attendeesCount: 35,
    childrenCount: 25,
    parentsCount: 10,
    date: '2026-11-13',
    timeWindow: '04:00 PM – 08:00 PM',
    totalPrice: 4850,
    depositPaid: 2000,
    remainingAmount: 2850,
    paymentMethod: 'InstaPay',
    paymentStatus: 'deposit_paid',
    status: 'Confirmed',
    animators: '2 Clowns, Magic Show & Balloon Artists',
    animatorsAr: '2 مهرجين، فقرة الساحر، وتشكيل البالونات',
    catering: '25 Kids Meal Boxes + 2-Tier Birthday Cake',
    cateringAr: '25 وجبة أطفال كيدز بوكس + تورتة دورين خاصة',
    coordinator: 'Captain Mohamed Taha',
    coordinatorAr: 'كابتن محمد طه',
    notes: 'ثيم الحفلة: أبطال خارقين (سبايدرمان) مع تشغيل أغاني ديزني المفضلة عند تقطيع التورتة',
    createdAt: new Date().toISOString()
  },
  {
    id: '#EV-4092',
    orderId: '#EV-4092',
    rawId: 'EV-4092',
    host: 'Eng. Tarek Mansour',
    phone: '01012233445',
    avatar: 'TM',
    avatarBg: '#0284c7',
    occasion: 'hall_rental',
    occasionAr: 'تجمع عائلي وحفل خطوبة خاص 🏛️',
    occasionEn: 'Private Family Banquet & Engagement 🏛️',
    hall: 'Sunset Canal Terrace',
    hallAr: 'تراس الغروب بالقناة',
    hallEn: 'Sunset Canal Terrace',
    package: 'Private Terrace Buffet & Lounge',
    packageAr: 'باقة بوفيه التراس المفتوح واللاونج',
    packageEn: 'Private Terrace Buffet & Lounge',
    attendeesCount: 50,
    childrenCount: 15,
    parentsCount: 35,
    date: '2026-11-20',
    timeWindow: '06:00 PM – 10:00 PM',
    totalPrice: 7500,
    depositPaid: 3500,
    remainingAmount: 4000,
    paymentMethod: 'card',
    paymentStatus: 'deposit_paid',
    status: 'Confirmed',
    animators: 'Soft Acoustic Live Music & Sound System',
    animatorsAr: 'نظام صوتي كامل وموسيقى هادئة حية',
    catering: 'Open BBQ Dinner Buffet + Fresh Juices Bar',
    cateringAr: 'بوفيه مشويات مفتوح + بار عصائر طبيعية منعشة',
    coordinator: 'Eng. Karim Rashed',
    coordinatorAr: 'م. كريم راشد',
    notes: 'تنسيق الإضاءة الدافئة على امتداد التراس وترتيب طاولات كبار السن',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: '#EV-4093',
    orderId: '#EV-4093',
    rawId: 'EV-4093',
    host: 'Dr. Hany Farid',
    phone: '01201122334',
    avatar: 'HF',
    avatarBg: '#f59e0b',
    occasion: 'vip_lounge',
    occasionAr: 'احتفال عائلي فاخر VIP ✨',
    occasionEn: 'Royal VIP Family Celebration ✨',
    hall: 'Royal VIP Lounge',
    hallAr: 'صالة كبار الزوار VIP',
    hallEn: 'Royal VIP Lounge',
    package: 'Royal VIP All-Inclusive Experience',
    packageAr: 'باقة التجربة الملكية الشاملة VIP',
    packageEn: 'Royal VIP All-Inclusive Experience',
    attendeesCount: 20,
    childrenCount: 12,
    parentsCount: 8,
    date: '2026-11-27',
    timeWindow: '05:00 PM – 09:00 PM',
    totalPrice: 3600,
    depositPaid: 1500,
    remainingAmount: 2100,
    paymentMethod: 'instapay',
    paymentStatus: 'pending',
    status: 'Processing',
    animators: 'Private VR Access & Play Zone VIP Escort',
    animatorsAr: 'دخول حر للواقع الافتراضي ومرافق شخصي للأطفال',
    catering: 'Chef Signature Platters & French Pastries',
    cateringAr: 'أطباق خاصة من الشيف وحلويات فرنسية فاخرة',
    coordinator: 'Staff Member In-Review',
    coordinatorAr: 'قيد التعيين',
    notes: 'يرجى مراجعة تفاصيل قائمة التذوق مع العميل هاتفياً',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: '#EV-4094',
    orderId: '#EV-4094',
    rawId: 'EV-4094',
    host: 'Modern Language Academy',
    phone: '01555667788',
    avatar: 'ML',
    avatarBg: '#10b981',
    occasion: 'school',
    occasionAr: 'حفل تكريم وتفوق مدرسي 🎓',
    occasionEn: 'Annual School Honors & Science Fair 🎓',
    hall: 'Kids Theme Stage & Arena',
    hallAr: 'مسرح الفعاليات وصالة المرح',
    hallEn: 'Kids Theme Stage & Arena',
    package: 'School Honor Gala & Fun Park Access',
    packageAr: 'باقة الحفل المدرسي ولعب حر في الفن بارك',
    packageEn: 'School Honor Gala & Fun Park Access',
    attendeesCount: 90,
    childrenCount: 75,
    parentsCount: 15,
    date: '2026-12-05',
    timeWindow: '10:00 AM – 03:00 PM',
    totalPrice: 9800,
    depositPaid: 5000,
    remainingAmount: 4800,
    paymentMethod: 'card',
    paymentStatus: 'deposit_paid',
    status: 'Confirmed',
    animators: 'Master of Ceremonies (MC), DJ & Awards Presenter',
    animatorsAr: 'مقدم حفلات محترف (MC)، دي جي وشهادات تقدير',
    catering: '75 Student Meal Boxes + Teacher Hospitality',
    cateringAr: '75 وجبة طلابية + بوفيه ضيافة للمعلمين والمشرفين',
    coordinator: 'Captain Hisham Nour',
    coordinatorAr: 'كابتن هشام نور',
    notes: 'تجهيز المنصة الرئيسية لتكريم الطلاب المتفوقين وشاشات العرض',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: '#EV-4095',
    orderId: '#EV-4095',
    rawId: 'EV-4095',
    host: 'Mahmoud El-Sayed',
    phone: '01148821902',
    avatar: 'ME',
    avatarBg: '#06b6d4',
    occasion: 'birthday',
    occasionAr: 'عيد ميلاد توأم 8 سنوات 🎂',
    occasionEn: 'Twin 8th Birthday Party 🎂',
    hall: 'Grand Celebration Ballroom',
    hallAr: 'قاعة الاحتفالات الكبرى',
    hallEn: 'Grand Celebration Ballroom',
    package: 'Deluxe Double Fun Birthday Pass',
    packageAr: 'باقة المرح المضاعف ديلوكس',
    packageEn: 'Deluxe Double Fun Birthday Pass',
    attendeesCount: 40,
    childrenCount: 30,
    parentsCount: 10,
    date: '2026-10-22',
    timeWindow: '04:30 PM – 08:30 PM',
    totalPrice: 4200,
    depositPaid: 4200,
    remainingAmount: 0,
    paymentMethod: 'vodafone_cash',
    paymentStatus: 'fully_paid',
    status: 'Completed',
    animators: 'Cartoon Mascots & Party Animators',
    animatorsAr: 'شخصيات كرتونية محبوبة وفقرات تفاعلية',
    catering: 'Burger Boxes + Customized Twin Cake',
    cateringAr: 'بوكسات برجر + تورتة توأم مخصصة',
    coordinator: 'Captain Mohamed Taha',
    coordinatorAr: 'كابتن محمد طه',
    notes: 'تمت إقامة الحفل بنجاح وتقييم العميل 5 نجوم',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    id: '#EV-4096',
    orderId: '#EV-4096',
    rawId: 'EV-4096',
    host: 'Reham Nour',
    phone: '01234455667',
    avatar: 'RN',
    avatarBg: '#ef4444',
    occasion: 'birthday',
    occasionAr: 'حفلة عيد ميلاد',
    occasionEn: 'Birthday Party',
    hall: 'Royal VIP Lounge',
    hallAr: 'صالة VIP',
    hallEn: 'Royal VIP Lounge',
    package: 'Mini Fun Birthday',
    packageAr: 'باقة ميني عيد ميلاد',
    packageEn: 'Mini Fun Birthday',
    attendeesCount: 15,
    childrenCount: 10,
    parentsCount: 5,
    date: '2026-10-18',
    timeWindow: '03:00 PM – 06:00 PM',
    totalPrice: 2800,
    depositPaid: 500,
    remainingAmount: 2300,
    paymentMethod: 'cash',
    paymentStatus: 'refunded',
    status: 'Cancelled',
    animators: 'Solo Animator',
    animatorsAr: 'أنيماتور شخصي',
    catering: 'Snack platters',
    cateringAr: 'سناكس وعصائر',
    coordinator: 'None',
    coordinatorAr: 'لا يوجد',
    notes: 'تم إلغاء الحجز لظروف عائلية واسترداد العربون',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString()
  }
];

export default function EventsOrdersManager({ 
  isAr = true, 
  lang = 'ar',
  onBackToDashboard = () => {} 
}) {
  const [orders, setOrders] = useState(INITIAL_EVENTS_ORDERS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [occasionFilter, setOccasionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isOccasionDropdownOpen, setIsOccasionDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);
  const occasionDropdownRef = useRef(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Selected Event Modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editStatus, setEditStatus] = useState('Confirmed');
  const [editPaymentStatus, setEditPaymentStatus] = useState('deposit_paid');
  const [editCoordinator, setEditCoordinator] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Reschedule Modal inside Event
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('2026-11-25');
  const [rescheduleTime, setRescheduleTime] = useState('04:00 PM – 08:00 PM');

  // Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) {
        setIsDateDropdownOpen(false);
      }
      if (occasionDropdownRef.current && !occasionDropdownRef.current.contains(e.target)) {
        setIsOccasionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(isAr ? 'تم تحديث بيانات وجداول الحفلات والقاعات بنجاح.' : 'Events & halls bookings refreshed.');
    }, 600);
  };

  // Open modal
  const handleOpenEvent = (ev) => {
    setSelectedEvent(ev);
    setEditStatus(ev.status || 'Confirmed');
    setEditPaymentStatus(ev.paymentStatus || 'deposit_paid');
    setEditCoordinator(ev.coordinator || ev.coordinatorAr || '');
    setEditNotes(ev.notes || '');
    setRescheduleDate(ev.date || '2026-11-25');
    setRescheduleTime(ev.timeWindow || '04:00 PM – 08:00 PM');
  };

  // Save changes
  const handleSaveEvent = () => {
    if (!selectedEvent) return;
    setIsSaving(true);
    setTimeout(() => {
      setOrders(prev => prev.map(o => {
        if (o.id === selectedEvent.id) {
          return {
            ...o,
            status: editStatus,
            paymentStatus: editPaymentStatus,
            coordinator: editCoordinator,
            coordinatorAr: editCoordinator,
            notes: editNotes,
            date: rescheduleDate,
            timeWindow: rescheduleTime
          };
        }
        return o;
      }));

      setIsSaving(false);
      showToast(isAr ? `✓ تم تحديث حجز ${selectedEvent.id} بنجاح.` : `✓ Event ${selectedEvent.id} updated successfully.`);
      setSelectedEvent(null);
    }, 300);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Host', 'Phone', 'Occasion', 'Hall', 'Guests', 'Date', 'Time', 'Total (EGP)', 'Deposit', 'Status'];
    const rows = orders.map(o => [
      o.id,
      o.host,
      o.phone,
      `"${o.occasionAr || o.occasion}"`,
      `"${o.hallAr || o.hall}"`,
      o.attendeesCount,
      o.date,
      `"${o.timeWindow}"`,
      o.totalPrice,
      o.depositPaid,
      o.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `events_halls_bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(isAr ? 'تم تصدير تقرير الحفلات والقاعات إلى CSV.' : 'Exported events bookings CSV.');
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(ev => {
      const code = String(ev.id || '').toLowerCase().replace('#', '');
      const host = String(ev.host || '').toLowerCase();
      const phone = String(ev.phone || '');
      const hall = String(ev.hall || ev.hallAr || '').toLowerCase();
      const occ = String(ev.occasion || ev.occasionAr || '').toLowerCase();
      const st = String(ev.status || 'Confirmed').toLowerCase();

      // Search
      const matchesSearch = 
        !search ||
        code.includes(search.toLowerCase().replace('#', '')) ||
        host.includes(search.toLowerCase()) ||
        phone.includes(search) ||
        hall.includes(search.toLowerCase()) ||
        occ.includes(search.toLowerCase());

      // Status
      const matchesStatus = 
        statusFilter === 'All' ||
        st === statusFilter.toLowerCase() ||
        (statusFilter.toLowerCase() === 'processing' && (st === 'pending' || st === 'in-review'));

      // Occasion
      let matchesOccasion = true;
      if (occasionFilter !== 'all') {
        matchesOccasion = ev.occasion === occasionFilter;
      }

      // Date
      let matchesDate = true;
      if (dateFilter && dateFilter !== 'all') {
        const dStr = ev.date;
        if (dStr) {
          const evDate = new Date(dStr);
          const now = new Date();
          if (!isNaN(evDate.getTime())) {
            const isSameDay = (d1, d2) => 
              d1.getFullYear() === d2.getFullYear() &&
              d1.getMonth() === d2.getMonth() &&
              d1.getDate() === d2.getDate();

            if (dateFilter === 'today') {
              matchesDate = isSameDay(evDate, now);
            } else if (dateFilter === 'yesterday') {
              const y = new Date(now); y.setDate(now.getDate() - 1);
              matchesDate = isSameDay(evDate, y);
            } else if (dateFilter === 'week') {
              matchesDate = true;
            } else if (dateFilter === 'month') {
              matchesDate = true;
            } else if (dateFilter === 'custom' && customDate) {
              matchesDate = isSameDay(evDate, new Date(customDate));
            }
          }
        }
      }

      return matchesSearch && matchesStatus && matchesOccasion && matchesDate;
    });
  }, [orders, search, statusFilter, occasionFilter, dateFilter, customDate]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * itemsPerPage;
  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, startIndex, itemsPerPage]);

  const statusCounts = useMemo(() => {
    return {
      total: orders.length,
      confirmed: orders.filter(o => String(o.status).toLowerCase() === 'confirmed').length,
      processing: orders.filter(o => ['processing', 'pending', 'in-review'].includes(String(o.status).toLowerCase())).length,
      completed: orders.filter(o => String(o.status).toLowerCase() === 'completed').length,
      cancelled: orders.filter(o => String(o.status).toLowerCase() === 'cancelled').length
    };
  }, [orders]);

  const getStatusText = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'confirmed') return isAr ? 'مؤكد' : 'Confirmed';
    if (s === 'processing' || s === 'pending') return isAr ? 'قيد المعالجة' : 'Processing';
    if (s === 'completed') return isAr ? 'مكتمل' : 'Completed';
    if (s === 'cancelled') return isAr ? 'ملغي' : 'Cancelled';
    return status;
  };

  return (
    <main className="pz-view-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="pz-toast-banner">
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Row: Title, Subtitle, Sync & Export */}
      <div className="pz-page-header-row">
        <div className="pz-page-title-group">
          <h2 className="pz-page-title">
            {isAr ? 'حجوزات الحفلات والقاعات' : 'Events & Hall Bookings'}
          </h2>
          <p className="pz-page-subtitle">
            {isAr 
              ? 'متابعة حجوزات حفلات أعياد الميلاد، قاعات المناسبات الكبرى، تراس القناة، وخدمات الضيافة والأنيميشن.' 
              : 'Monitor, review, and manage real-time birthday parties, hall venue bookings, and celebration schedules.'}
          </p>
        </div>

        <div className="pz-header-actions-group">
          <span className="pz-live-sync-pill">
            <span className="pz-live-dot" />
            <span>{isAr ? 'مزامنة حية: الآن' : 'Live Sync: Just now'}</span>
          </span>

          <button 
            type="button" 
            className={`pz-action-btn ${isRefreshing ? 'spinning' : ''}`}
            onClick={handleRefresh}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} />
            <span>{isAr ? 'تحديث البيانات' : 'Refresh Data'}</span>
          </button>

          <button 
            type="button" 
            className="pz-export-btn"
            onClick={handleExportCSV}
          >
            <Download size={14} />
            <span>{isAr ? 'تصدير تقرير CSV' : 'Export CSV / Report'}</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC FLOWCHART & LIVE GRAPH ANALYTICS PANEL */}
      <EventsAnalyticsPanel 
        orders={orders}
        isAr={isAr}
        activeStatusFilter={statusFilter}
        onSelectStatusFilter={(st) => {
          setStatusFilter(st);
          setCurrentPage(1);
        }}
      />

      {/* SEARCH & FILTERS BAR */}
      <div className="pz-filter-card">
        <div className="pz-filter-inputs-row">
          {/* Search Box */}
          <div className="pz-search-box">
            <Search size={16} className="pz-search-icon" />
            <input 
              type="text" 
              placeholder={isAr ? 'بحث باسم صاحب الحفل، الهاتف، أو كود الحجز (مثل #EV-4091)...' : 'Search by host name, phone, or booking ID (e.g. #EV-4091)...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pz-search-input"
            />
            {search && (
              <button type="button" className="clear-search-btn" onClick={() => setSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Date Filter Dropdown */}
          <div className="pz-filter-dropdown-wrap" ref={dateDropdownRef}>
            <button 
              type="button" 
              className={`pz-filter-pill-btn ${isDateDropdownOpen ? 'active' : ''}`}
              onClick={() => {
                setIsDateDropdownOpen(prev => !prev);
                setIsOccasionDropdownOpen(false);
              }}
            >
              <Calendar size={14} />
              <span>
                {dateFilter === 'all' ? (isAr ? 'جميع التواريخ' : 'All Dates')
                  : dateFilter === 'today' ? (isAr ? 'اليوم' : 'Today')
                  : dateFilter === 'yesterday' ? (isAr ? 'أمس' : 'Yesterday')
                  : dateFilter === 'week' ? (isAr ? 'آخر 7 أيام' : 'Last 7 Days')
                  : dateFilter === 'month' ? (isAr ? 'هذا الشهر' : 'This Month')
                  : (customDate || (isAr ? 'تاريخ محدد' : 'Custom Date'))}
              </span>
              <ChevronDown size={14} className={`filter-chevron ${isDateDropdownOpen ? 'rotate' : ''}`} />
            </button>

            {isDateDropdownOpen && (
              <div className="pz-filter-menu">
                <button 
                  type="button"
                  className={`filter-menu-item ${dateFilter === 'all' ? 'selected' : ''}`}
                  onClick={() => { setDateFilter('all'); setIsDateDropdownOpen(false); }}
                >
                  <span>{isAr ? 'جميع التواريخ' : 'All Dates'}</span>
                  {dateFilter === 'all' && <Check size={14} />}
                </button>
                <button 
                  type="button"
                  className={`filter-menu-item ${dateFilter === 'today' ? 'selected' : ''}`}
                  onClick={() => { setDateFilter('today'); setIsDateDropdownOpen(false); }}
                >
                  <span>{isAr ? 'اليوم' : 'Today'}</span>
                  {dateFilter === 'today' && <Check size={14} />}
                </button>
                <button 
                  type="button"
                  className={`filter-menu-item ${dateFilter === 'yesterday' ? 'selected' : ''}`}
                  onClick={() => { setDateFilter('yesterday'); setIsDateDropdownOpen(false); }}
                >
                  <span>{isAr ? 'أمس' : 'Yesterday'}</span>
                  {dateFilter === 'yesterday' && <Check size={14} />}
                </button>
                <button 
                  type="button"
                  className={`filter-menu-item ${dateFilter === 'week' ? 'selected' : ''}`}
                  onClick={() => { setDateFilter('week'); setIsDateDropdownOpen(false); }}
                >
                  <span>{isAr ? 'آخر 7 أيام' : 'Last 7 Days'}</span>
                  {dateFilter === 'week' && <Check size={14} />}
                </button>
                <button 
                  type="button"
                  className={`filter-menu-item ${dateFilter === 'month' ? 'selected' : ''}`}
                  onClick={() => { setDateFilter('month'); setIsDateDropdownOpen(false); }}
                >
                  <span>{isAr ? 'هذا الشهر' : 'This Month'}</span>
                  {dateFilter === 'month' && <Check size={14} />}
                </button>

                <div className="filter-menu-divider" />
                <div className="filter-menu-custom-date">
                  <label>{isAr ? 'اختر تاريخاً محدداً:' : 'Pick a date:'}</label>
                  <input 
                    type="date" 
                    value={customDate}
                    onChange={e => {
                      setCustomDate(e.target.value);
                      setDateFilter('custom');
                    }}
                    className="custom-date-picker"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Occasion Filter Dropdown */}
          <div className="pz-filter-dropdown-wrap" ref={occasionDropdownRef}>
            <button 
              type="button" 
              className={`pz-filter-pill-btn ${isOccasionDropdownOpen ? 'active' : ''}`}
              onClick={() => {
                setIsOccasionDropdownOpen(prev => !prev);
                setIsDateDropdownOpen(false);
              }}
            >
              <SlidersHorizontal size={14} />
              <span>
                {occasionFilter === 'all' ? (isAr ? 'جميع المناسبات' : 'All Occasions')
                  : occasionFilter === 'birthday' ? (isAr ? 'أعياد ميلاد 🎂' : 'Birthdays 🎂')
                  : occasionFilter === 'hall_rental' ? (isAr ? 'إيجار قاعات 🏛️' : 'Hall Rentals 🏛️')
                  : occasionFilter === 'vip_lounge' ? (isAr ? 'صالات VIP ✨' : 'VIP Lounges ✨')
                  : (isAr ? 'حفلات مدارس 🎓' : 'School Events 🎓')}
              </span>
              <ChevronDown size={14} className={`filter-chevron ${isOccasionDropdownOpen ? 'rotate' : ''}`} />
            </button>

            {isOccasionDropdownOpen && (
              <div className="pz-filter-menu">
                <button 
                  type="button"
                  className={`filter-menu-item ${occasionFilter === 'all' ? 'selected' : ''}`}
                  onClick={() => { setOccasionFilter('all'); setIsOccasionDropdownOpen(false); }}
                >
                  <span>{isAr ? 'جميع المناسبات' : 'All Occasions'}</span>
                  {occasionFilter === 'all' && <Check size={14} />}
                </button>
                <button 
                  type="button"
                  className={`filter-menu-item ${occasionFilter === 'birthday' ? 'selected' : ''}`}
                  onClick={() => { setOccasionFilter('birthday'); setIsOccasionDropdownOpen(false); }}
                >
                  <span>{isAr ? 'أعياد ميلاد الأطفال (Birthdays 🎂)' : 'Kids Birthdays 🎂'}</span>
                  {occasionFilter === 'birthday' && <Check size={14} />}
                </button>
                <button 
                  type="button"
                  className={`filter-menu-item ${occasionFilter === 'hall_rental' ? 'selected' : ''}`}
                  onClick={() => { setOccasionFilter('hall_rental'); setIsOccasionDropdownOpen(false); }}
                >
                  <span>{isAr ? 'إيجار قاعات وتراس مفتوح 🏛️' : 'Hall Rentals 🏛️'}</span>
                  {occasionFilter === 'hall_rental' && <Check size={14} />}
                </button>
                <button 
                  type="button"
                  className={`filter-menu-item ${occasionFilter === 'vip_lounge' ? 'selected' : ''}`}
                  onClick={() => { setOccasionFilter('vip_lounge'); setIsOccasionDropdownOpen(false); }}
                >
                  <span>{isAr ? 'صالات VIP الخاصة ✨' : 'VIP Lounges ✨'}</span>
                  {occasionFilter === 'vip_lounge' && <Check size={14} />}
                </button>
                <button 
                  type="button"
                  className={`filter-menu-item ${occasionFilter === 'school' ? 'selected' : ''}`}
                  onClick={() => { setOccasionFilter('school'); setIsOccasionDropdownOpen(false); }}
                >
                  <span>{isAr ? 'حفلات مدارس وتخرج 🎓' : 'School Events 🎓'}</span>
                  {occasionFilter === 'school' && <Check size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Segmented Tabs */}
        <div className="pz-filter-status-row">
          <div className="pz-status-tabs">
            <button 
              type="button" 
              className={`status-tab ${statusFilter === 'All' ? 'active' : ''}`}
              onClick={() => setStatusFilter('All')}
            >
              {isAr ? 'جميع الحالات' : 'All Statuses'} <span className="tab-count">({statusCounts.total})</span>
            </button>
            <button 
              type="button" 
              className={`status-tab ${statusFilter === 'Processing' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Processing')}
            >
              {isAr ? 'قيد المعالجة' : 'Processing'} <span className="tab-count-blue">({statusCounts.processing})</span>
            </button>
            <button 
              type="button" 
              className={`status-tab ${statusFilter === 'Completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Completed')}
            >
              {isAr ? 'مكتملة' : 'Completed'} <span className="tab-count-neutral">({statusCounts.completed})</span>
            </button>
            <button 
              type="button" 
              className={`status-tab ${statusFilter === 'Cancelled' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Cancelled')}
            >
              {isAr ? 'ملغاة' : 'Cancelled'} <span className="tab-count-red">({statusCounts.cancelled})</span>
            </button>
          </div>

          <span className="pz-records-count">
            {isAr 
              ? `عرض ${filteredOrders.length} من أصل ${orders.length} حجز مسجل`
              : `Showing ${filteredOrders.length} of ${orders.length} bookings recorded`}
          </span>
        </div>
      </div>

      {/* EVENTS TABLE - EXACT MATCH TO SCREENSHOT 1 */}
      <div className="pz-table-card">
        <div className="pz-table-responsive">
          <table className="pz-orders-table">
            <thead>
              <tr>
                <th>{isAr ? 'كود الحجز' : 'ORDER ID'}</th>
                <th>{isAr ? 'العميل والملف' : 'CUSTOMER & PROFILE'}</th>
                <th>{isAr ? 'المناسبة والقاعة' : 'EVENT & VENUE'}</th>
                <th>{isAr ? 'المبلغ الإجمالي' : 'TOTAL AMOUNT'}</th>
                <th>{isAr ? 'الحالة' : 'STATUS'}</th>
                <th>{isAr ? 'الإجراء' : 'ACTION'}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    {isAr ? 'لا توجد حجوزات حفلات تطابق الفلتر المحدد.' : 'No event bookings found matching your filter.'}
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ev) => {
                  const bookingCode = String(ev.id || '').replace('#', '');
                  const hostName = ev.host || (isAr ? 'عميل الحفل' : 'Event Host');
                  const hostPhone = ev.phone || (isAr ? 'لا يوجد هاتف' : 'No phone');
                  const totalPrice = Number(ev.totalPrice || 0);
                  const status = ev.status || 'Confirmed';

                  const avatarInitials = hostName.split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'EV';
                  const avatarColors = ['#a855f7', '#0284c7', '#ea580c', '#10b981', '#06b6d4'];
                  const avatarBg = avatarColors[bookingCode.length % avatarColors.length];

                  return (
                    <tr key={ev.id} className="pz-table-row">
                      {/* ORDER ID */}
                      <td className="col-order-id">
                        <span className="order-id-code" style={{ direction: 'ltr' }}>{bookingCode}</span>
                      </td>

                      {/* CUSTOMER & PROFILE */}
                      <td className="col-customer">
                        <div className="customer-cell">
                          <div className="customer-avatar" style={{ backgroundColor: avatarBg }}>
                            {avatarInitials}
                          </div>
                          <div className="customer-info">
                            <span className="customer-name">{hostName}</span>
                            <span className="customer-phone" style={{ direction: 'ltr' }}>
                              <Phone size={12} /> {hostPhone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* EVENT & VENUE */}
                      <td className="col-tickets">
                        <span className="tickets-badge">
                          <Cake size={14} />
                          <span>{isAr ? ev.occasionAr : ev.occasionEn || ev.occasion}</span>
                        </span>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', fontWeight: 600 }}>
                          {isAr ? ev.hallAr : ev.hallEn || ev.hall} • {ev.attendeesCount} {isAr ? 'ضيوف' : 'Guests'}
                        </div>
                      </td>

                      {/* TOTAL AMOUNT */}
                      <td className="col-amount">
                        <span className="amount-num">{totalPrice.toLocaleString()}</span>
                        <span className="amount-cur">{isAr ? 'ج.م' : 'EGP'}</span>
                      </td>

                      {/* STATUS */}
                      <td className="col-status">
                        <span className={`status-pill status-${status.toLowerCase()}`}>
                          <span className="status-dot" />
                          <span>{getStatusText(status)}</span>
                        </span>
                      </td>

                      {/* ACTION (VIEW) */}
                      <td className="col-action">
                        <button 
                          type="button" 
                          className="pz-view-btn"
                          onClick={() => handleOpenEvent(ev)}
                        >
                          <span>{isAr ? 'عرض' : 'VIEW'}</span>
                          {isAr ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="pz-pagination-bar">
          <span className="pagination-text">
            {isAr 
              ? `عرض ${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredOrders.length)} من أصل ${filteredOrders.length} حجز مسجل`
              : `Showing ${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredOrders.length)} of ${filteredOrders.length} bookings recorded`}
          </span>

          <div className="pagination-pills">
            <button 
              type="button" 
              className="pag-btn"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                type="button"
                className={`pag-btn ${validPage === p ? 'active' : ''}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}

            <button 
              type="button" 
              className="pag-btn"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EVENTS & HALL BOOKING DETAILS & UPDATE MODAL                              */}
      {/* ========================================================================= */}
      {selectedEvent && (
        <div className="pz-modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div 
            className="pz-order-details-modal-wrapper" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: '880px', width: '95%', maxHeight: '92vh', overflowY: 'auto', borderRadius: '18px' }}
          >
            <div className="order-details-card">
              {/* Header */}
              <div className="order-details-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                    {isAr ? 'تفاصيل حفل المناسبة وحجز القاعة' : 'Event & Hall Reservation Details'}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#c084fc' }}>
                    {selectedEvent.id} • {isAr ? selectedEvent.occasionAr : selectedEvent.occasionEn || selectedEvent.occasion}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="close-btn"
                  onClick={() => setSelectedEvent(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="order-details-body">
                {/* 1. Summary Card */}
                <div className="summary-section">
                  <h4 className="section-title">
                    <PartyPopper size={16} />
                    <span>{isAr ? 'ملخص بيانات الحفل والتجهيزات' : 'Event & Venue Summary'}</span>
                  </h4>

                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="label">{isAr ? 'اسم صاحب الحفل:' : 'Host Name:'}</span>
                      <span className="value bold">{selectedEvent.host}</span>
                    </div>

                    <div className="summary-item">
                      <span className="label">{isAr ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                      <span className="value bold" dir="ltr">{selectedEvent.phone}</span>
                    </div>

                    <div className="summary-item">
                      <span className="label">{isAr ? 'القاعة المحجوزة:' : 'Reserved Venue:'}</span>
                      <span className="value bold" style={{ color: '#00d2ff' }}>
                        {isAr ? selectedEvent.hallAr : selectedEvent.hallEn || selectedEvent.hall}
                      </span>
                    </div>

                    <div className="summary-item">
                      <span className="label">{isAr ? 'الباقة المختارة:' : 'Package:'}</span>
                      <span className="value bold">
                        {isAr ? selectedEvent.packageAr : selectedEvent.packageEn || selectedEvent.package}
                      </span>
                    </div>

                    <div className="summary-item">
                      <span className="label">{isAr ? 'عدد الضيوف:' : 'Attendees Count:'}</span>
                      <span className="value">
                        {selectedEvent.attendeesCount} {isAr ? 'ضيف' : 'Guests'} ({selectedEvent.childrenCount} {isAr ? 'أطفال' : 'Kids'} + {selectedEvent.parentsCount} {isAr ? 'مرافقين' : 'Parents'})
                      </span>
                    </div>

                    <div className="summary-item">
                      <span className="label">{isAr ? 'تاريخ وموعد الحفل:' : 'Date & Time Slot:'}</span>
                      <span className="value bold" style={{ color: '#f59e0b' }}>
                        {rescheduleDate} ({rescheduleTime})
                      </span>
                    </div>

                    <div className="summary-item">
                      <span className="label">{isAr ? 'إجمالي الحجز:' : 'Total Cost:'}</span>
                      <span className="value price-highlight">
                        {selectedEvent.totalPrice} {isAr ? 'ج.م' : 'EGP'}
                      </span>
                    </div>

                    <div className="summary-item">
                      <span className="label">{isAr ? 'العربون والمسدد:' : 'Deposit Paid:'}</span>
                      <span className="value" style={{ color: '#10b981', fontWeight: 800 }}>
                        {selectedEvent.depositPaid} {isAr ? 'ج.م' : 'EGP'} ({isAr ? `المتبقي: ${selectedEvent.remainingAmount} ج.م` : `Remaining: ${selectedEvent.remainingAmount} EGP`})
                      </span>
                    </div>
                  </div>

                  {/* Catering and animators breakdown */}
                  <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px' }}>
                      <span style={{ fontSize: '0.74rem', color: '#c084fc', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                        🎭 {isAr ? 'الأنيميشن والفقرات الترفيهية:' : 'Entertainment & Shows:'}
                      </span>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>
                        {isAr ? selectedEvent.animatorsAr : selectedEvent.animators}
                      </p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px' }}>
                      <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                        🎂 {isAr ? 'البوفيه والتورتة المعتمدة:' : 'Catering & Cake:'}
                      </span>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>
                        {isAr ? selectedEvent.cateringAr : selectedEvent.catering}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Editable Update Form */}
                <div className="update-form-section">
                  <h4 className="section-title">
                    <Award size={16} />
                    <span>{isAr ? 'إدارة حالة الحفل وتعيين المشرف' : 'Booking Status & Hall Management'}</span>
                  </h4>

                  <div className="form-grid">
                    {/* Status */}
                    <div className="form-group">
                      <label>{isAr ? 'حالة الحجز:' : 'Booking Status:'}</label>
                      <select 
                        value={editStatus} 
                        onChange={e => setEditStatus(e.target.value)}
                        className="form-select"
                      >
                        <option value="Confirmed">{isAr ? 'مؤكد ومعتمد (Confirmed)' : 'Confirmed'}</option>
                        <option value="Processing">{isAr ? 'قيد المعالجة والمراجعة (Processing)' : 'Processing'}</option>
                        <option value="Completed">{isAr ? 'مكتمل بنجاح (Completed)' : 'Completed'}</option>
                        <option value="Cancelled">{isAr ? 'ملغي (Cancelled)' : 'Cancelled'}</option>
                      </select>
                    </div>

                    {/* Payment Status */}
                    <div className="form-group">
                      <label>{isAr ? 'حالة سداد الحساب:' : 'Payment Status:'}</label>
                      <select 
                        value={editPaymentStatus} 
                        onChange={e => setEditPaymentStatus(e.target.value)}
                        className="form-select"
                      >
                        <option value="deposit_paid">{isAr ? 'تم سداد العربون (Deposit Paid)' : 'Deposit Paid'}</option>
                        <option value="fully_paid">{isAr ? 'مسدد بالكامل 100% (Fully Paid)' : 'Fully Paid'}</option>
                        <option value="pending">{isAr ? 'معلق / في انتظار التحويل (Pending)' : 'Pending'}</option>
                        <option value="refunded">{isAr ? 'عربون مسترجع (Refunded)' : 'Refunded'}</option>
                      </select>
                    </div>

                    {/* Coordinator Assigned */}
                    <div className="form-group">
                      <label>{isAr ? 'المشرف المسؤول عن القاعة:' : 'Assigned Coordinator:'}</label>
                      <input 
                        type="text" 
                        value={editCoordinator}
                        onChange={e => setEditCoordinator(e.target.value)}
                        className="form-select"
                        placeholder={isAr ? 'اسم المشرف المسؤول...' : 'Coordinator name...'}
                      />
                    </div>

                    {/* Reschedule Date Trigger */}
                    <div className="form-group">
                      <label>{isAr ? 'تعديل موعد الحفل:' : 'Reschedule Date:'}</label>
                      <button 
                        type="button"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.18)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          padding: '10px 14px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%'
                        }}
                        onClick={() => setIsRescheduleOpen(true)}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="#a855f7" />
                          {rescheduleDate}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#c084fc' }}>
                          {isAr ? 'تغيير الموعد' : 'Change Slot'}
                        </span>
                      </button>
                    </div>

                    {/* Notes */}
                    <div className="form-group full-width">
                      <label>{isAr ? 'ملاحظات خاصة، الأغاني وثيم الحفلة:' : 'Event Special Notes & Music Requests:'}</label>
                      <textarea 
                        rows="3"
                        value={editNotes}
                        onChange={e => setEditNotes(e.target.value)}
                        className="form-textarea"
                        placeholder={isAr ? 'أضف أي تفاصيل خاصة بالدي جي، ألوان البالونات، أوقات فقرة الساحر...' : 'Add DJ playlist, balloon themes, magic show timing...'}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="form-actions-row">
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={() => setSelectedEvent(null)}
                    >
                      {isAr ? 'إغلاق' : 'Cancel'}
                    </button>

                    <button 
                      type="button" 
                      className="btn-save"
                      disabled={isSaving}
                      onClick={handleSaveEvent}
                    >
                      <Check size={16} />
                      <span>{isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MINI MODAL */}
      {isRescheduleOpen && (
        <div className="reschedule-modal-backdrop" onClick={() => setIsRescheduleOpen(false)}>
          <div className="reschedule-modal-card" onClick={e => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="reschedule-header">
              <Calendar size={20} color="#a855f7" />
              <h3>{isAr ? 'تعديل تاريخ وموعد الحفلة والقاعة' : 'Reschedule Event Slot'}</h3>
            </div>

            <div className="reschedule-fields">
              <label>{isAr ? 'تحديد تاريخ الحفل الجديد:' : 'Select New Event Date:'}</label>
              <input 
                type="date" 
                className="reschedule-input"
                value={rescheduleDate}
                onChange={e => setRescheduleDate(e.target.value)}
              />

              <label>{isAr ? 'تحديد الفترة الزمنية المعتمدة:' : 'Select Venue Time Window:'}</label>
              <select 
                className="reschedule-input"
                value={rescheduleTime}
                onChange={e => setRescheduleTime(e.target.value)}
              >
                <option value="10:00 AM – 02:00 PM">10:00 AM – 02:00 PM (صباحي)</option>
                <option value="02:00 PM – 06:00 PM">02:00 PM – 06:00 PM (بعد الظهر)</option>
                <option value="04:00 PM – 08:00 PM">04:00 PM – 08:00 PM (عصراً - ذهبي)</option>
                <option value="06:00 PM – 10:00 PM">06:00 PM – 10:00 PM (سهرة مسائية)</option>
              </select>
            </div>

            <div className="reschedule-actions">
              <button 
                type="button" 
                className="reschedule-cancel-btn"
                onClick={() => setIsRescheduleOpen(false)}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                type="button" 
                className="reschedule-confirm-btn"
                style={{ background: '#a855f7' }}
                onClick={() => {
                  setIsRescheduleOpen(false);
                  showToast(isAr ? 'تم ضبط الموعد الجديد بنجاح.' : 'New time window set.');
                }}
              >
                {isAr ? 'تأكيد الموعد' : 'Apply New Slot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
