import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { getAllPurchases } from '../../api/buyingService';
import OrderDetailsUpdateForm from '../../components/admin/OrderDetailsUpdateForm';
import RealTimeAnalyticsPanel from '../../components/admin/RealTimeAnalyticsPanel';
import TripsAnalyticsPanel from '../../components/admin/TripsAnalyticsPanel';
import { 
  Ticket, 
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
  Utensils, 
  Coffee, 
  Layers, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock4,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import './PlayZoneOrdersManager.css';

// Initial Mock Trips Data matching Screen 3 & Screen 4
const INITIAL_TRIPS_ORDERS = [
  {
    id: '#TR-10482',
    orderId: '#PZ-8942',
    rawId: 'TR-10482',
    customer: 'Ahmed Mohamed',
    phone: '+20 101 234 5678',
    avatar: 'AM',
    avatarBg: '#0284c7',
    organization: 'Future School',
    organizationAr: 'مدرسة المستقبل للغات',
    orgType: 'School',
    orgTypeAr: 'مدرسة خاصة',
    status: 'Confirmed',
    childrenCount: 85,
    supervisorsCount: 8,
    supervisorsRole: 'Teachers / Chaperones',
    supervisorsRoleAr: 'معلمون ومرافقون',
    ageGroup: '8 - 11 Years (Primary Stage)',
    ageGroupAr: '8 - 11 سنة (المرحلة الابتدائية)',
    tripPackage: 'Full Day Explorer & Adventure Package',
    tripPackageAr: 'باقة المستكشف والمغامر الكاملة',
    pricePerChild: 350,
    selectedAreas: [
      'Kids Adventure Area',
      'Challenge Zone & VR Simulators',
      'Kinetic Fun Park'
    ],
    selectedAreasAr: [
      'منطقة مغامرات الأطفال',
      'منطقة التحدي ومحاكي VR',
      'فن بارك كيدز'
    ],
    dining: 'Reserved Lunch Buffet',
    diningAr: 'بوفيه غداء مخصص للأطفال',
    diningDesc: 'Kids Meals + Supervisor Dining, 1:00 PM',
    diningDescAr: 'وجبات أطفال + استراحة المشرفين 1:00 ظهراً',
    hospitality: 'Complimentary Welcome Coffee & Refreshments Bar',
    hospitalityAr: 'ضيافة ترحيبية وقهوة ومشروبات منعشة',
    hospitalityDesc: 'Reserved for School Supervisors & Chaperones',
    hospitalityDescAr: 'مخصصة لمشرفي المدرسة والمرافقين',
    visitDate: 'Thursday, November 12, 2026',
    visitDateAr: 'الخميس، 12 نوفمبر 2026',
    arrivalTime: '09:30 AM',
    totalDuration: '5.5 Hours',
    totalDurationAr: '5.5 ساعات',
    operatingWindow: '09:30 AM – 03:00 PM (Scheduled Departure)',
    operatingWindowAr: '09:30 صباحاً – 03:00 عصراً (موعد المغادرة)'
  },
  {
    id: '#TR-10481',
    orderId: '#PZ-8941',
    rawId: 'TR-10481',
    customer: 'Mahmoud El-Sayed',
    phone: '+20 114 882 1902',
    avatar: 'ME',
    avatarBg: '#ea580c',
    organization: 'Modern Language Academy',
    organizationAr: 'أكاديمية مودرن للغات',
    orgType: 'Private Academy',
    orgTypeAr: 'أكاديمية تعليمية خاصة',
    status: 'Processing',
    childrenCount: 60,
    supervisorsCount: 6,
    supervisorsRole: 'Faculty Members',
    supervisorsRoleAr: 'أعضاء هيئة التدريس',
    ageGroup: '11 - 14 Years (Prep Stage)',
    ageGroupAr: '11 - 14 سنة (المرحلة الإعدادية)',
    tripPackage: 'Thrill & VR Discovery Package',
    tripPackageAr: 'باقة الإثارة واستكشاف الواقع الافتراضي',
    pricePerChild: 320,
    selectedAreas: [
      'Challenge Zone & VR Simulators',
      'High Ropes Suspension Course',
      'Arcade Arena'
    ],
    selectedAreasAr: [
      'منطقة التحدي ومحاكي VR',
      'مسار الحبال المعلقة والمغامرة',
      'صالة ألعاب الآركيد'
    ],
    dining: 'Custom Gourmet Meal Boxes',
    diningAr: 'وجبات غداء فردية فاخرة',
    diningDesc: 'Delivered to Seaside Lounge, 1:30 PM',
    diningDescAr: 'تقدم في استراحة المنتجع، 1:30 ظهراً',
    hospitality: 'Unlimited Hot Drinks & Mineral Water',
    hospitalityAr: 'مشروبات ساخنة ومياه معدنية مجانية',
    hospitalityDesc: 'Dedicated Lounge for Teachers',
    hospitalityDescAr: 'في استراحة المعلمين المخصصة',
    visitDate: 'Monday, November 16, 2026',
    visitDateAr: 'الإثنين، 16 نوفمبر 2026',
    arrivalTime: '10:00 AM',
    totalDuration: '5 Hours',
    totalDurationAr: '5 ساعات',
    operatingWindow: '10:00 AM – 03:00 PM (Scheduled Departure)',
    operatingWindowAr: '10:00 صباحاً – 03:00 عصراً (موعد المغادرة)'
  }
];

export default function PlayZoneOrdersManager({ 
  onBackToDashboard, 
  onGoHome,
  lang = 'ar',
  setLang
}) {
  const isAr = lang === 'ar';

  // Navigation View State: 'playzone-orders' | 'trips-orders' | 'trip-detail'
  const [currentView, setCurrentView] = useState('playzone-orders');
  
  // Live Purchases Data States (ADOS Buying API)
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tripsOrders, setTripsOrders] = useState(INITIAL_TRIPS_ORDERS);

  // Filters State for Play Zone Orders
  const [pzSearch, setPzSearch] = useState('');
  const [pzStatusFilter, setPzStatusFilter] = useState('All');
  const [pzDateFilter, setPzDateFilter] = useState('all'); // 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom'
  const [pzCustomDate, setPzCustomDate] = useState('');
  const [pzZoneFilter, setPzZoneFilter] = useState('all'); // 'all' | 'kids-area' | 'fun-park' | 'challenge' | 'adventure'
  
  // Dropdown states
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);
  const zoneDropdownRef = useRef(null);

  // Pagination State for Play Zone Orders
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Trips Orders Filters & Pagination
  const [tripSearch, setTripSearch] = useState('');
  const [tripStatusFilter, setTripStatusFilter] = useState('All');
  const [tripDateFilter, setTripDateFilter] = useState('all'); // 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom'
  const [tripCustomDate, setTripCustomDate] = useState('');
  const [isTripDateDropdownOpen, setIsTripDateDropdownOpen] = useState(false);
  const tripDateDropdownRef = useRef(null);
  const [tripCurrentPage, setTripCurrentPage] = useState(1);
  const tripItemsPerPage = 7;

  // Active Modals & Selected Objects
  const [selectedPlayzoneOrder, setSelectedPlayzoneOrder] = useState(null);
  const [activeTripDetail, setActiveTripDetail] = useState(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('2026-10-25');
  const [rescheduleTime, setRescheduleTime] = useState('04:00 PM');
  const [toastMessage, setToastMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) {
        setIsDateDropdownOpen(false);
      }
      if (zoneDropdownRef.current && !zoneDropdownRef.current.contains(e.target)) {
        setIsZoneDropdownOpen(false);
      }
      if (tripDateDropdownRef.current && !tripDateDropdownRef.current.contains(e.target)) {
        setIsTripDateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [pzSearch, pzStatusFilter, pzZoneFilter, pzDateFilter, pzCustomDate]);

  useEffect(() => {
    setTripCurrentPage(1);
  }, [tripSearch, tripStatusFilter, tripDateFilter, tripCustomDate]);

  // Fetch real purchases from backend API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllPurchases({ limit: 50 });
      if (res && res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (Array.isArray(res)) {
        setOrders(res);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('[PlayZoneOrdersManager] Error fetching purchases:', err);
      setError(
        err.message || (isAr ? 'فشل تحميل بيانات الطلبات من الخادم الرئيسي.' : 'Failed to fetch live orders from backend.')
      );
    } finally {
      setLoading(false);
    }
  }, [isAr]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Toast Notification Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Live Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
    showToast(isAr ? 'تمت مزامنة الحجوزات المباشرة بنجاح.' : 'Live bookings synchronized successfully.');
  };

  // Export CSV handler
  const handleExportCSV = (type) => {
    try {
      const data = type === 'trips' ? tripsOrders : orders;
      const headers = type === 'trips' 
        ? (isAr 
            ? ['كود الرحلة', 'كود الطلب', 'العميل', 'الهاتف', 'المؤسسة', 'الطلاب', 'تاريخ الزيارة', 'الحالة']
            : ['Trip ID', 'Order ID', 'Customer', 'Phone', 'Organization', 'Students', 'Date', 'Status'])
        : (isAr
            ? ['كود الطلب', 'اسم العميل', 'رقم الهاتف', 'عدد التذاكر', 'المبلغ (ج.م)', 'الحالة']
            : ['Order ID', 'Customer', 'Phone', 'Tickets', 'Amount (EGP)', 'Status']);
      
      const rows = data.map(o => {
        if (type === 'trips') {
          return [o.id, o.orderId, o.customer, o.phone, o.organization, o.childrenCount, o.visitDate, o.status];
        } else {
          const code = o.orderCode || o._id || o.id;
          const name = o.guestName || o.guest?.name || o.customer || '';
          const phone = o.guestPhone || o.guest?.phone || o.phone || '';
          const total = o.totalPrice || o.totalAmount || 0;
          const count = (o.tickets || []).reduce((a, t) => a + (t.quantity || 1), 0) +
                        (o.packages || []).reduce((a, p) => a + (p.quantity || 1), 0) || 1;
          return [code, name, phone, count, total, o.status || 'Confirmed'];
        }
      });

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${type}_orders_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(isAr ? 'تم تصدير ملف التقرير بنجاح.' : 'Report CSV exported successfully.');
    } catch {
      showToast(isAr ? 'حدث خطأ أثناء تصدير التقرير.' : 'Error generating export file.');
    }
  };

  // Print Voucher handler
  const handlePrintVoucher = (title) => {
    try {
      window.print();
    } catch {
      showToast(isAr ? `جارٍ تجهيز طباعة سند ${title}...` : `Printing voucher for ${title}...`);
    }
  };

  // Cancel Order handler
  const handleCancelOrder = (orderId, type = 'pz') => {
    const confirmPrompt = isAr 
      ? `هل أنت متأكد من رغبتك في إلغاء الطلب ${orderId}؟` 
      : `Are you sure you want to cancel ${orderId}?`;
    if (window.confirm(confirmPrompt)) {
      if (type === 'pz') {
        setOrders(prev => prev.map(o => (o.orderCode === orderId || o._id === orderId) ? { ...o, status: 'Cancelled' } : o));
        if (selectedPlayzoneOrder && (selectedPlayzoneOrder.orderCode === orderId || selectedPlayzoneOrder._id === orderId)) {
          setSelectedPlayzoneOrder(prev => ({ ...prev, status: 'Cancelled' }));
        }
      } else {
        setTripsOrders(prev => prev.map(t => t.id === orderId ? { ...t, status: 'Cancelled' } : t));
        if (activeTripDetail && activeTripDetail.id === orderId) {
          setActiveTripDetail(prev => ({ ...prev, status: 'Cancelled' }));
        }
      }
      showToast(isAr ? `تم تعيين الطلب ${orderId} كملغي.` : `${orderId} marked as Cancelled.`);
    }
  };

  // Reschedule Save handler
  const handleSaveReschedule = () => {
    if (selectedPlayzoneOrder) {
      const updated = {
        ...selectedPlayzoneOrder,
        date: rescheduleDate,
        timeSlot: `${rescheduleTime} – 08:00 PM`
      };
      setSelectedPlayzoneOrder(updated);
      setOrders(prev => prev.map(o => (o._id === updated._id || o.orderCode === updated.orderCode) ? updated : o));
    } else if (activeTripDetail) {
      const updated = {
        ...activeTripDetail,
        visitDate: rescheduleDate,
        visitDateAr: rescheduleDate,
        arrivalTime: rescheduleTime
      };
      setActiveTripDetail(updated);
      setTripsOrders(prev => prev.map(t => t.id === updated.id ? updated : t));
    }
    setIsRescheduleOpen(false);
    showToast(isAr ? 'تمت إعادة جدولة موعد الحجز بنجاح.' : 'Reservation rescheduled successfully.');
  };

  // Status Counts for Tabs and Metrics
  const statusCounts = useMemo(() => {
    const total = orders.length;
    const processing = orders.filter(o => {
      const s = String(o.status || '').toLowerCase();
      return s === 'processing' || s === 'pending';
    }).length;
    const confirmed = orders.filter(o => String(o.status || '').toLowerCase() === 'confirmed').length;
    const completed = orders.filter(o => String(o.status || '').toLowerCase() === 'completed').length;
    const cancelled = orders.filter(o => String(o.status || '').toLowerCase() === 'cancelled').length;
    return { total, processing, confirmed, completed, cancelled };
  }, [orders]);

  // Labels for interactive filter pills
  const getDateFilterLabel = () => {
    if (pzDateFilter === 'all') {
      return isAr ? 'جميع التواريخ' : 'All Dates';
    }
    if (pzDateFilter === 'today') {
      return isAr ? 'اليوم (24 أكتوبر 2026)' : 'Today (Oct 24, 2026)';
    }
    if (pzDateFilter === 'yesterday') {
      return isAr ? 'أمس' : 'Yesterday';
    }
    if (pzDateFilter === 'week') {
      return isAr ? 'آخر 7 أيام' : 'Last 7 Days';
    }
    if (pzDateFilter === 'month') {
      return isAr ? 'هذا الشهر' : 'This Month';
    }
    if (pzDateFilter === 'custom' && pzCustomDate) {
      return pzCustomDate;
    }
    return isAr ? 'تاريخ الحجز' : 'Filter Date';
  };

  const getTripDateFilterLabel = () => {
    if (tripDateFilter === 'all') {
      return isAr ? 'جميع التواريخ' : 'All Dates';
    }
    if (tripDateFilter === 'today') {
      return isAr ? 'اليوم (24 أكتوبر 2026)' : 'Today (Oct 24, 2026)';
    }
    if (tripDateFilter === 'yesterday') {
      return isAr ? 'أمس' : 'Yesterday';
    }
    if (tripDateFilter === 'week') {
      return isAr ? 'آخر 7 أيام' : 'Last 7 Days';
    }
    if (tripDateFilter === 'month') {
      return isAr ? 'هذا الشهر (نوفمبر / أكتوبر)' : 'This Month (Nov / Oct)';
    }
    if (tripDateFilter === 'custom' && tripCustomDate) {
      return tripCustomDate;
    }
    return isAr ? 'اليوم (24 أكتوبر 2026)' : 'Today (Oct 24, 2026)';
  };

  const getZoneFilterLabel = () => {
    if (pzZoneFilter === 'all') {
      return isAr ? 'جميع المناطق (المناطق الأربعة)' : 'All Zones (All 4 Portals)';
    }
    if (pzZoneFilter === 'kids-area') {
      return isAr ? 'منطقة الأطفال' : 'Kids Area';
    }
    if (pzZoneFilter === 'fun-park') {
      return isAr ? 'فن بارك' : 'Fun Park';
    }
    if (pzZoneFilter === 'challenge') {
      return isAr ? 'منطقة التحدي' : 'Challenge Zone';
    }
    if (pzZoneFilter === 'adventure') {
      return isAr ? 'منطقة المغامرات' : 'Adventure Zone';
    }
    return isAr ? 'المناطق' : 'Filter Zone';
  };

  // Filtered Play Zone Orders with Functional Search, Status, Zone, and Date
  const filteredPlayzoneOrders = useMemo(() => {
    return orders.filter(ord => {
      const code = String(ord.orderCode || ord._id || ord.id || '').toLowerCase();
      const customer = String(ord.guestName || ord.guest?.name || ord.customer || '').toLowerCase();
      const phone = String(ord.guestPhone || ord.guest?.phone || ord.phone || '');
      const status = String(ord.status || 'confirmed').toLowerCase();

      // 1. Search Query
      const matchesSearch = 
        !pzSearch || 
        customer.includes(pzSearch.toLowerCase()) ||
        phone.includes(pzSearch) ||
        code.includes(pzSearch.toLowerCase());

      // 2. Status Filter
      const matchesStatus = 
        pzStatusFilter === 'All' || 
        status === pzStatusFilter.toLowerCase() ||
        (pzStatusFilter.toLowerCase() === 'processing' && status === 'pending');

      // 3. Zone Filter
      let matchesZone = true;
      if (pzZoneFilter && pzZoneFilter !== 'all') {
        const z = pzZoneFilter.toLowerCase().replace(/[-_ ]/g, '');
        const directZone = String(ord.zone || '').toLowerCase().replace(/[-_ ]/g, '');
        const inDirect = directZone.includes(z) || z.includes(directZone);

        const inTickets = (ord.tickets || []).some(t => {
          const tZ = String(t.ticket?.zone || t.zone || '').toLowerCase().replace(/[-_ ]/g, '');
          const tT = String(t.ticket?.title || t.title || '').toLowerCase().replace(/[-_ ]/g, '');
          return tZ.includes(z) || tT.includes(z);
        });

        const inPackages = (ord.packages || []).some(p => {
          const pZ = String(p.package?.zone || p.zone || '').toLowerCase().replace(/[-_ ]/g, '');
          const pT = String(p.package?.title || p.title || '').toLowerCase().replace(/[-_ ]/g, '');
          return pZ.includes(z) || pT.includes(z);
        });

        const inItemStr = String(ord.item || '').toLowerCase().replace(/[-_ ]/g, '').includes(z);

        matchesZone = inDirect || inTickets || inPackages || inItemStr;
      }

      // 4. Date Filter
      let matchesDate = true;
      if (pzDateFilter && pzDateFilter !== 'all') {
        const orderDateStr = ord.createdAt || ord.date;
        if (orderDateStr) {
          const orderDate = new Date(orderDateStr);
          const now = new Date();

          if (!isNaN(orderDate.getTime())) {
            const isSameDay = (d1, d2) => 
              d1.getFullYear() === d2.getFullYear() &&
              d1.getMonth() === d2.getMonth() &&
              d1.getDate() === d2.getDate();

            if (pzDateFilter === 'today') {
              const isRecent = Math.abs(now.getTime() - orderDate.getTime()) <= 48 * 60 * 60 * 1000;
              matchesDate = isSameDay(orderDate, now) || isRecent || String(orderDateStr).toLowerCase().includes('today') || String(orderDateStr).includes('اليوم') || String(orderDateStr).includes('24') || String(orderDateStr).toLowerCase().includes('oct');
            } else if (pzDateFilter === 'yesterday') {
              const yesterday = new Date(now);
              yesterday.setDate(now.getDate() - 1);
              matchesDate = isSameDay(orderDate, yesterday);
            } else if (pzDateFilter === 'week') {
              const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              matchesDate = orderDate >= sevenDaysAgo && orderDate <= now;
            } else if (pzDateFilter === 'month') {
              const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              matchesDate = orderDate >= thirtyDaysAgo && orderDate <= now;
            } else if (pzDateFilter === 'custom' && pzCustomDate) {
              const target = new Date(pzCustomDate);
              matchesDate = isSameDay(orderDate, target);
            }
          } else {
            if (pzDateFilter === 'today') {
              matchesDate = String(orderDateStr).toLowerCase().includes('today') || String(orderDateStr).includes('اليوم') || String(orderDateStr).includes('24');
            }
          }
        }
      }

      return matchesSearch && matchesStatus && matchesZone && matchesDate;
    });
  }, [orders, pzSearch, pzStatusFilter, pzZoneFilter, pzDateFilter, pzCustomDate]);

  // Paginated Slices for Play Zone Orders
  const totalPages = Math.max(1, Math.ceil(filteredPlayzoneOrders.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedPlayzoneOrders = useMemo(() => {
    return filteredPlayzoneOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPlayzoneOrders, startIndex, itemsPerPage]);

  // Filtered Trips Orders
  const filteredTripsOrders = useMemo(() => {
    return tripsOrders.filter(trip => {
      const matchesSearch = trip.customer.toLowerCase().includes(tripSearch.toLowerCase()) ||
                            trip.phone.includes(tripSearch) ||
                            trip.organization.toLowerCase().includes(tripSearch.toLowerCase()) ||
                            trip.id.toLowerCase().includes(tripSearch.toLowerCase());
      const matchesStatus = tripStatusFilter === 'All' || trip.status.toLowerCase() === tripStatusFilter.toLowerCase();
      
      let matchesDate = true;
      if (tripDateFilter && tripDateFilter !== 'all') {
        const tripDateStr = trip.visitDate || trip.date;
        if (tripDateStr) {
          const tripDate = new Date(tripDateStr);
          const now = new Date();
          if (!isNaN(tripDate.getTime())) {
            const isSameDay = (d1, d2) => 
              d1.getFullYear() === d2.getFullYear() &&
              d1.getMonth() === d2.getMonth() &&
              d1.getDate() === d2.getDate();

            if (tripDateFilter === 'today') {
              matchesDate = isSameDay(tripDate, now) || String(tripDateStr).toLowerCase().includes('today') || String(tripDateStr).includes('24') || String(tripDateStr).toLowerCase().includes('november') || String(tripDateStr).toLowerCase().includes('october');
            } else if (tripDateFilter === 'yesterday') {
              const yesterday = new Date(now);
              yesterday.setDate(now.getDate() - 1);
              matchesDate = isSameDay(tripDate, yesterday);
            } else if (tripDateFilter === 'week') {
              matchesDate = true;
            } else if (tripDateFilter === 'month') {
              matchesDate = true;
            } else if (tripDateFilter === 'custom' && tripCustomDate) {
              const target = new Date(tripCustomDate);
              matchesDate = isSameDay(tripDate, target);
            }
          } else {
            if (tripDateFilter === 'today') {
              matchesDate = true;
            }
          }
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [tripsOrders, tripSearch, tripStatusFilter, tripDateFilter, tripCustomDate]);

  // Paginated Slices for Trips Orders
  const tripTotalPages = Math.max(1, Math.ceil(filteredTripsOrders.length / tripItemsPerPage));
  const validTripCurrentPage = Math.min(tripCurrentPage, tripTotalPages);
  const tripStartIndex = (validTripCurrentPage - 1) * tripItemsPerPage;
  const paginatedTripsOrders = useMemo(() => {
    return filteredTripsOrders.slice(tripStartIndex, tripStartIndex + tripItemsPerPage);
  }, [filteredTripsOrders, tripStartIndex, tripItemsPerPage]);

  // Dynamic Page Numbers Generator
  const getPageNumbers = (current, total) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    }
    if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const getStatusText = (status) => {
    const s = String(status || '').toLowerCase();
    if (isAr) {
      if (s === 'confirmed') return 'مؤكد';
      if (s === 'processing' || s === 'pending') return 'قيد المعالجة';
      if (s === 'completed') return 'مكتمل';
      if (s === 'cancelled') return 'ملغي';
      return status;
    }
    return status;
  };

  return (
    <div className={`pz-orders-manager-root ${isAr ? 'lang-ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* ========================================================================= */}
      {/* TOP HEADER: BRANDING, SUBVIEW TOGGLES, SYNC BUTTONS */}
      {/* ========================================================================= */}
      <header className="pz-orders-topbar">
        <div className="pz-topbar-left">
          <img 
            src="/photo/logo/logo nav bar and footer.png" 
            alt="American Dream Logo" 
            className="pz-topbar-brand-logo" 
            onClick={onGoHome || onBackToDashboard}
            title={isAr ? 'موقع أمريكان دريم بالإسماعيلية' : 'American Dream Ismailia Website'}
          />
          <button 
            type="button" 
            className="pz-back-to-editor-btn"
            onClick={onBackToDashboard}
            title={isAr ? 'العودة إلى لوحة تحكم المحتوى' : 'Return to ADOS Content Editor'}
          >
            {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            <span>{isAr ? 'لوحة تحكم المحتوى' : 'Web Admin Dashboard'}</span>
          </button>
        </div>

        <div className="pz-topbar-center">
          <div className="pz-topbar-heading">
            <h1 className="pz-topbar-title">
              {isAr ? 'لوحة تحكم إدارة أمريكان دريم' : 'ADOS Management Dashboard'}
            </h1>
            <p className="pz-topbar-subtitle">
              {isAr ? 'مرح أكثر • قيمة أعلى • ذكريات تدوم' : 'More Fun. More Value. More Memories.'}
            </p>
          </div>
        </div>

        {/* Top Right Subview Switchers & Language Toggle */}
        <div className="pz-topbar-right">
          {/* Language Toggle */}
          <div className="pz-lang-toggle-wrap">
            <button 
              type="button" 
              className={`pz-lang-btn ${isAr ? 'active' : ''}`}
              onClick={() => setLang && setLang('ar')}
              title="عربي"
            >
              عربي
            </button>
            <button 
              type="button" 
              className={`pz-lang-btn ${!isAr ? 'active' : ''}`}
              onClick={() => setLang && setLang('en')}
              title="English"
            >
              EN
            </button>
          </div>

          <button 
            type="button"
            className={`pz-header-view-btn ${currentView === 'playzone-orders' ? 'active' : ''}`}
            onClick={() => setCurrentView('playzone-orders')}
          >
            <Ticket size={15} />
            <span>{isAr ? 'طلبات البلاي زون' : 'PLAY ZONE ORDERS'}</span>
          </button>

          <button 
            type="button"
            className={`pz-header-view-btn ${currentView === 'trips-orders' || currentView === 'trip-detail' ? 'active' : ''}`}
            onClick={() => setCurrentView('trips-orders')}
          >
            <Building2 size={15} />
            <span>{isAr ? 'طلبات الرحلات' : 'TRIPS ORDERS'}</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="pz-toast-banner">
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: PLAY ZONE ORDERS LIST (SCREEN 1) */}
      {/* ========================================================================= */}
      {currentView === 'playzone-orders' && (
        <main className="pz-view-container">
          
          {/* Header Row: Title, Subtitle, Sync & Export */}
          <div className="pz-page-header-row">
            <div className="pz-page-title-group">
              <h2 className="pz-page-title">{isAr ? 'طلبات البلاي زون' : 'Play Zone Orders'}</h2>
              <p className="pz-page-subtitle">
                {isAr 
                  ? 'متابعة ومراجعة وإدارة حجوزات التذاكر والأنشطة العائلية عبر جميع مناطق اللعب في الوقت الفعلي.' 
                  : 'Monitor, review, and manage real-time guest ticket bookings and family activity admissions across all experiential zones.'}
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
                onClick={() => handleExportCSV('playzone')}
              >
                <Download size={14} />
                <span>{isAr ? 'تصدير تقرير CSV' : 'Export CSV / Report'}</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC FLOWCHART & LIVE GRAPH ANALYTICS PANEL (REPRESENTING REAL NUMBERS) */}
          <RealTimeAnalyticsPanel 
            orders={orders}
            isAr={isAr}
            activeStatusFilter={pzStatusFilter}
            onSelectStatusFilter={(status) => {
              setPzStatusFilter(status);
              setCurrentPage(1);
            }}
          />


          {/* SEARCH & FILTERS BAR */}
          <div className="pz-filter-card">
            <div className="pz-filter-inputs-row">
              {/* Search Field */}
              <div className="pz-search-box">
                <Search size={16} className="pz-search-icon" />
                <input 
                  type="text"
                  placeholder={isAr 
                    ? 'البحث باسم العميل، رقم الهاتف، أو كود الطلب (مثل PZ-103066)...' 
                    : 'Search by customer name, phone, or order ID (e.g. #PZ-8921)...'}
                  className="pz-search-input"
                  value={pzSearch}
                  onChange={(e) => setPzSearch(e.target.value)}
                />
              </div>

              {/* Functional Date Filter Pill */}
              <div className="pz-filter-dropdown-wrap" ref={dateDropdownRef}>
                <button 
                  type="button" 
                  className={`pz-filter-pill-btn ${isDateDropdownOpen ? 'active' : ''}`}
                  onClick={() => {
                    setIsDateDropdownOpen(prev => !prev);
                    setIsZoneDropdownOpen(false);
                  }}
                >
                  <Calendar size={14} />
                  <span>{getDateFilterLabel()}</span>
                  <ChevronDown size={14} className={`filter-chevron ${isDateDropdownOpen ? 'rotate' : ''}`} />
                </button>

                {isDateDropdownOpen && (
                  <div className="pz-filter-menu date-menu">
                    <button 
                      type="button"
                      className={`filter-menu-item ${pzDateFilter === 'all' ? 'selected' : ''}`}
                      onClick={() => { setPzDateFilter('all'); setIsDateDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'جميع التواريخ' : 'All Dates'}</span>
                      {pzDateFilter === 'all' && <Check size={14} />}
                    </button>

                    <button 
                      type="button"
                      className={`filter-menu-item ${pzDateFilter === 'today' ? 'selected' : ''}`}
                      onClick={() => { setPzDateFilter('today'); setIsDateDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'اليوم (حجوزات اليوم)' : 'Today (Current Bookings)'}</span>
                      {pzDateFilter === 'today' && <Check size={14} />}
                    </button>

                    <button 
                      type="button"
                      className={`filter-menu-item ${pzDateFilter === 'yesterday' ? 'selected' : ''}`}
                      onClick={() => { setPzDateFilter('yesterday'); setIsDateDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'أمس' : 'Yesterday'}</span>
                      {pzDateFilter === 'yesterday' && <Check size={14} />}
                    </button>

                    <button 
                      type="button"
                      className={`filter-menu-item ${pzDateFilter === 'week' ? 'selected' : ''}`}
                      onClick={() => { setPzDateFilter('week'); setIsDateDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'آخر 7 أيام' : 'Last 7 Days'}</span>
                      {pzDateFilter === 'week' && <Check size={14} />}
                    </button>

                    <button 
                      type="button"
                      className={`filter-menu-item ${pzDateFilter === 'month' ? 'selected' : ''}`}
                      onClick={() => { setPzDateFilter('month'); setIsDateDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'هذا الشهر' : 'This Month'}</span>
                      {pzDateFilter === 'month' && <Check size={14} />}
                    </button>

                    <div className="filter-menu-divider" />
                    
                    <div className="filter-menu-custom-date">
                      <label>{isAr ? 'أو اختر تاريخاً محدداً:' : 'Or pick specific date:'}</label>
                      <input 
                        type="date"
                        value={pzCustomDate}
                        onChange={(e) => {
                          setPzCustomDate(e.target.value);
                          setPzDateFilter('custom');
                        }}
                        className="custom-date-picker"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Functional Zone Filter Pill */}
              <div className="pz-filter-dropdown-wrap" ref={zoneDropdownRef}>
                <button 
                  type="button" 
                  className={`pz-filter-pill-btn ${isZoneDropdownOpen ? 'active' : ''}`}
                  onClick={() => {
                    setIsZoneDropdownOpen(prev => !prev);
                    setIsDateDropdownOpen(false);
                  }}
                >
                  <SlidersHorizontal size={14} />
                  <span>{getZoneFilterLabel()}</span>
                  <ChevronDown size={14} className={`filter-chevron ${isZoneDropdownOpen ? 'rotate' : ''}`} />
                </button>

                {isZoneDropdownOpen && (
                  <div className="pz-filter-menu zone-menu">
                    <button 
                      type="button"
                      className={`filter-menu-item ${pzZoneFilter === 'all' ? 'selected' : ''}`}
                      onClick={() => { setPzZoneFilter('all'); setIsZoneDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'جميع المناطق (المناطق الأربعة)' : 'All Zones (All 4 Portals)'}</span>
                      {pzZoneFilter === 'all' && <Check size={14} />}
                    </button>

                    <button 
                      type="button"
                      className={`filter-menu-item ${pzZoneFilter === 'kids-area' ? 'selected' : ''}`}
                      onClick={() => { setPzZoneFilter('kids-area'); setIsZoneDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'منطقة الأطفال (Kids Area)' : 'Kids Area'}</span>
                      {pzZoneFilter === 'kids-area' && <Check size={14} />}
                    </button>

                    <button 
                      type="button"
                      className={`filter-menu-item ${pzZoneFilter === 'fun-park' ? 'selected' : ''}`}
                      onClick={() => { setPzZoneFilter('fun-park'); setIsZoneDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'فن بارك (Fun Park)' : 'Fun Park'}</span>
                      {pzZoneFilter === 'fun-park' && <Check size={14} />}
                    </button>

                    <button 
                      type="button"
                      className={`filter-menu-item ${pzZoneFilter === 'challenge' ? 'selected' : ''}`}
                      onClick={() => { setPzZoneFilter('challenge'); setIsZoneDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'منطقة التحدي (Challenge Zone)' : 'Challenge Zone'}</span>
                      {pzZoneFilter === 'challenge' && <Check size={14} />}
                    </button>

                    <button 
                      type="button"
                      className={`filter-menu-item ${pzZoneFilter === 'adventure' ? 'selected' : ''}`}
                      onClick={() => { setPzZoneFilter('adventure'); setIsZoneDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'منطقة المغامرات (Adventure Zone)' : 'Adventure Zone'}</span>
                      {pzZoneFilter === 'adventure' && <Check size={14} />}
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
                  className={`status-tab ${pzStatusFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setPzStatusFilter('All')}
                >
                  {isAr ? 'جميع الحالات' : 'All Statuses'} <span className="tab-count">({statusCounts.total})</span>
                </button>
                <button 
                  type="button" 
                  className={`status-tab ${pzStatusFilter === 'Processing' ? 'active' : ''}`}
                  onClick={() => setPzStatusFilter('Processing')}
                >
                  {isAr ? 'قيد المعالجة' : 'Processing'} <span className="tab-count-blue">({statusCounts.processing})</span>
                </button>
                <button 
                  type="button" 
                  className={`status-tab ${pzStatusFilter === 'Completed' ? 'active' : ''}`}
                  onClick={() => setPzStatusFilter('Completed')}
                >
                  {isAr ? 'مكتملة' : 'Completed'} <span className="tab-count-neutral">({statusCounts.completed})</span>
                </button>
                <button 
                  type="button" 
                  className={`status-tab ${pzStatusFilter === 'Cancelled' ? 'active' : ''}`}
                  onClick={() => setPzStatusFilter('Cancelled')}
                >
                  {isAr ? 'ملغاة' : 'Cancelled'} <span className="tab-count-red">({statusCounts.cancelled})</span>
                </button>
              </div>

              <span className="pz-records-count">
                {isAr 
                  ? `عرض ${filteredPlayzoneOrders.length} من أصل ${orders.length} حجز مسجل`
                  : `Showing ${filteredPlayzoneOrders.length} of ${orders.length} bookings recorded`}
              </span>
            </div>
          </div>

          {/* ORDERS TABLE */}
          <div className="pz-table-card">
            <div className="pz-table-responsive">
              <table className="pz-orders-table">
                <thead>
                  <tr>
                    <th>{isAr ? 'كود الطلب' : 'ORDER ID'}</th>
                    <th>{isAr ? 'العميل والملف' : 'CUSTOMER & PROFILE'}</th>
                    <th>{isAr ? 'التذاكر المحجوزة' : 'TICKETS BOOKED'}</th>
                    <th>{isAr ? 'المبلغ الإجمالي' : 'TOTAL AMOUNT'}</th>
                    <th>{isAr ? 'الحالة' : 'STATUS'}</th>
                    <th>{isAr ? 'الإجراء' : 'ACTION'}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                          <RefreshCw size={24} className="spin-icon" color="#00a9c3" />
                          <span style={{ fontWeight: 600, color: '#64748b' }}>
                            {isAr ? 'جارٍ تحميل الحجوزات المباشرة من الخادم...' : 'Loading live orders from backend...'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#ef4444' }}>
                          <AlertCircle size={24} />
                          <span style={{ fontWeight: 700 }}>{error}</span>
                          <button 
                            type="button" 
                            className="pz-action-btn" 
                            onClick={fetchOrders} 
                            style={{ marginTop: '8px' }}
                          >
                            {isAr ? 'إعادة المحاولة' : 'Retry Fetch'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedPlayzoneOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        {isAr ? 'لا توجد طلبات بلاي زون تطابق الفلتر المحدد.' : 'No Play Zone orders found matching your filter.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedPlayzoneOrders.map((ord) => {
                      const orderId = ord._id || ord.id;
                      const orderCode = ord.orderCode || (ord.id ? String(ord.id).replace('#', '') : 'N/A');
                      const guestName = ord.guestName || ord.guest?.name || ord.customer || (isAr ? 'عميل زائر' : 'Guest Customer');
                      const guestPhone = ord.guestPhone || ord.guest?.phone || ord.phone || (isAr ? 'لا يوجد هاتف' : 'No phone');
                      const totalPrice = Number(ord.totalPrice || ord.totalAmount || 0);
                      const status = ord.status || 'Confirmed';
                      
                      // Calculate total tickets and packages quantity
                      const totalTickets = (ord.tickets || []).reduce((acc, t) => acc + (t.quantity || 1), 0) +
                                           (ord.packages || []).reduce((acc, p) => acc + (p.quantity || 1), 0) || (ord.ticketsCount || 1);

                      const avatarInitials = guestName.split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'GU';
                      const avatarColors = ['#0284c7', '#ea580c', '#d97706', '#10b981', '#7c3aed'];
                      const avatarBg = avatarColors[orderCode.length % avatarColors.length];

                      return (
                        <tr key={orderId || orderCode} className="pz-table-row">
                          {/* ORDER ID */}
                          <td className="col-order-id">
                            <span className="order-id-code" style={{ direction: 'ltr' }}>{orderCode}</span>
                          </td>

                          {/* CUSTOMER & PROFILE */}
                          <td className="col-customer">
                            <div className="customer-cell">
                              <div className="customer-avatar" style={{ backgroundColor: avatarBg }}>
                                {avatarInitials}
                              </div>
                              <div className="customer-info">
                                <span className="customer-name">{guestName}</span>
                                <span className="customer-phone" style={{ direction: 'ltr' }}>
                                  <Phone size={12} /> {guestPhone}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* TICKETS BOOKED */}
                          <td className="col-tickets">
                            <span className="tickets-badge">
                              <Ticket size={14} />
                              <span>{isAr ? `${totalTickets} تذاكر` : `Tickets ${totalTickets}`}</span>
                            </span>
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
                              onClick={() => setSelectedPlayzoneOrder(ord)}
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

            {/* Functional Pagination Bar */}
            <div className="pz-pagination-bar">
              <span className="pagination-text">
                {isAr 
                  ? `عرض ${filteredPlayzoneOrders.length === 0 ? 0 : startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredPlayzoneOrders.length)} من أصل ${filteredPlayzoneOrders.length} حجز مسجل`
                  : `Showing ${filteredPlayzoneOrders.length === 0 ? 0 : startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredPlayzoneOrders.length)} of ${filteredPlayzoneOrders.length} bookings recorded`}
              </span>
              <div className="pagination-pills" style={{ direction: 'ltr' }}>
                <button 
                  type="button" 
                  className="pag-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={validCurrentPage <= 1}
                  title={isAr ? 'الصفحة السابقة' : 'Previous Page'}
                >
                  &lt;
                </button>

                {getPageNumbers(validCurrentPage, totalPages).map((p, idx) => (
                  p === '...' ? (
                    <span key={`ell-${idx}`} className="pag-ellipsis">...</span>
                  ) : (
                    <button 
                      key={`page-${p}`}
                      type="button" 
                      className={`pag-btn ${validCurrentPage === p ? 'active' : ''}`}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </button>
                  )
                ))}

                <button 
                  type="button" 
                  className="pag-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={validCurrentPage >= totalPages}
                  title={isAr ? 'الصفحة التالية' : 'Next Page'}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: TRIPS ORDERS LIST (SCREEN 3) */}
      {/* ========================================================================= */}
      {currentView === 'trips-orders' && (
        <main className="pz-view-container">
          
          {/* Header Row */}
          <div className="pz-page-header-row">
            <div className="pz-page-title-group">
              <h2 className="pz-page-title">{isAr ? 'طلبات الرحلات المدرسية' : 'Trips Orders'}</h2>
              <p className="pz-page-subtitle">
                {isAr 
                  ? 'مراجعة وتنظيم حجوزات المدارس والمجموعات والمؤسسات في منتجع أمريكان دريم بالإسماعيلية.'
                  : 'Review formal school and institutional group reservations for American Dream Ismailia.'}
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
                onClick={() => handleExportCSV('trips')}
              >
                <Download size={14} />
                <span>{isAr ? 'تصدير تقرير CSV' : 'Export CSV / Report'}</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC SCHOOL TRIPS ANALYTICS PANEL & OPERATIONAL FLOWCHART */}
          <TripsAnalyticsPanel 
            tripsOrders={tripsOrders}
            isAr={isAr}
            activeStatusFilter={tripStatusFilter}
            onSelectStatusFilter={(status) => {
              setTripStatusFilter(status);
              setTripCurrentPage(1);
            }}
          />


          {/* Search & Filters */}
          <div className="pz-filter-card">
            <div className="pz-filter-inputs-row">
              <div className="pz-search-box">
                <Search size={16} className="pz-search-icon" />
                <input 
                  type="text"
                  placeholder={isAr 
                    ? 'البحث باسم المؤسسة، العميل، أو كود الرحلة...' 
                    : 'Search by customer name, phone, or order ID (e.g. #PZ-8921)...'}
                  className="pz-search-input"
                  value={tripSearch}
                  onChange={(e) => setTripSearch(e.target.value)}
                />
              </div>

              {/* Functional Date Filter Pill in Trips View */}
              <div className="pz-filter-dropdown-wrap" ref={tripDateDropdownRef}>
                <button 
                  type="button" 
                  className={`pz-filter-pill-btn ${isTripDateDropdownOpen ? 'active' : ''}`}
                  onClick={() => setIsTripDateDropdownOpen(prev => !prev)}
                >
                  <Calendar size={14} />
                  <span>{getTripDateFilterLabel()}</span>
                  <ChevronDown size={14} className={`filter-chevron ${isTripDateDropdownOpen ? 'rotate' : ''}`} />
                </button>

                {isTripDateDropdownOpen && (
                  <div className="pz-filter-menu date-menu">
                    <button 
                      type="button"
                      className={`filter-menu-item ${tripDateFilter === 'all' ? 'selected' : ''}`}
                      onClick={() => { setTripDateFilter('all'); setIsTripDateDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'جميع التواريخ' : 'All Dates'}</span>
                      {tripDateFilter === 'all' && <Check size={14} />}
                    </button>

                    <button 
                      type="button"
                      className={`filter-menu-item ${tripDateFilter === 'today' ? 'selected' : ''}`}
                      onClick={() => { setTripDateFilter('today'); setIsTripDateDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'اليوم (24 أكتوبر 2026)' : 'Today (Oct 24, 2026)'}</span>
                      {tripDateFilter === 'today' && <Check size={14} />}
                    </button>

                    <button 
                      type="button"
                      className={`filter-menu-item ${tripDateFilter === 'yesterday' ? 'selected' : ''}`}
                      onClick={() => { setTripDateFilter('yesterday'); setIsTripDateDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'أمس' : 'Yesterday'}</span>
                      {tripDateFilter === 'yesterday' && <Check size={14} />}
                    </button>

                    <button 
                      type="button"
                      className={`filter-menu-item ${tripDateFilter === 'week' ? 'selected' : ''}`}
                      onClick={() => { setTripDateFilter('week'); setIsTripDateDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'آخر 7 أيام' : 'Last 7 Days'}</span>
                      {tripDateFilter === 'week' && <Check size={14} />}
                    </button>

                    <button 
                      type="button"
                      className={`filter-menu-item ${tripDateFilter === 'month' ? 'selected' : ''}`}
                      onClick={() => { setTripDateFilter('month'); setIsTripDateDropdownOpen(false); }}
                    >
                      <span>{isAr ? 'هذا الشهر (نوفمبر / أكتوبر)' : 'This Month (Nov / Oct)'}</span>
                      {tripDateFilter === 'month' && <Check size={14} />}
                    </button>

                    <div className="filter-menu-custom-date">
                      <label>{isAr ? 'تاريخ مخصص بالتقويم:' : 'Pick Custom Date:'}</label>
                      <input 
                        type="date"
                        className="custom-date-picker"
                        value={tripCustomDate}
                        onChange={(e) => {
                          setTripCustomDate(e.target.value);
                          setTripDateFilter('custom');
                          setIsTripDateDropdownOpen(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pz-filter-status-row">
              <div className="pz-status-tabs">
                <button 
                  type="button" 
                  className={`status-tab ${tripStatusFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setTripStatusFilter('All')}
                >
                  {isAr ? 'جميع الحالات' : 'All Statuses'} <span className="tab-count">({tripsOrders.length})</span>
                </button>
                <button 
                  type="button" 
                  className={`status-tab ${tripStatusFilter === 'Processing' ? 'active' : ''}`}
                  onClick={() => setTripStatusFilter('Processing')}
                >
                  {isAr ? 'قيد المعالجة' : 'Processing'} <span className="tab-count-blue">(1)</span>
                </button>
                <button 
                  type="button" 
                  className={`status-tab ${tripStatusFilter === 'Completed' ? 'active' : ''}`}
                  onClick={() => setTripStatusFilter('Completed')}
                >
                  {isAr ? 'مكتملة' : 'Completed'} <span className="tab-count-neutral">(1)</span>
                </button>
              </div>

              <span className="pz-records-count">
                {isAr ? `عرض ${filteredTripsOrders.length} رحلات مسجلة` : `Showing ${filteredTripsOrders.length} bookings`}
              </span>
            </div>
          </div>

          {/* TRIPS TABLE */}
          <div className="pz-table-card">
            <div className="pz-table-responsive">
              <table className="pz-orders-table">
                <thead>
                  <tr>
                    <th>{isAr ? 'كود الطلب' : 'ORDER ID'}</th>
                    <th>{isAr ? 'العميل والملف' : 'CUSTOMER & PROFILE'}</th>
                    <th>{isAr ? 'المؤسسة / المدرسة' : 'ORGANIZATION'}</th>
                    <th>{isAr ? 'الحالة' : 'STATUS'}</th>
                    <th>{isAr ? 'الإجراء' : 'ACTION'}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTripsOrders.map((trip) => (
                    <tr key={trip.id} className="pz-table-row">
                      <td className="col-order-id">
                        <span className="hash-symbol">#</span>
                        <span className="order-id-code" style={{ direction: 'ltr' }}>{trip.orderId}</span>
                      </td>

                      <td className="col-customer">
                        <div className="customer-cell">
                          <div className="customer-avatar" style={{ backgroundColor: trip.avatarBg }}>
                            {trip.avatar}
                          </div>
                          <div className="customer-info">
                            <span className="customer-name">{trip.customer}</span>
                            <span className="customer-phone" style={{ direction: 'ltr' }}>
                              <Phone size={12} /> {trip.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="col-organization">
                        <span className="org-name">{isAr ? (trip.organizationAr || trip.organization) : trip.organization}</span>
                      </td>

                      <td className="col-status">
                        <span className={`status-pill status-${trip.status.toLowerCase()}`}>
                          <span className="status-dot" />
                          <span>{getStatusText(trip.status)}</span>
                        </span>
                      </td>

                      <td className="col-action">
                        <button 
                          type="button" 
                          className="pz-view-btn"
                          onClick={() => {
                            setActiveTripDetail(trip);
                            setCurrentView('trip-detail');
                          }}
                        >
                          <span>{isAr ? 'عرض' : 'VIEW'}</span>
                          {isAr ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination for Trips */}
            <div className="pz-pagination-bar">
              <span className="pagination-text">
                {isAr 
                  ? `عرض ${filteredTripsOrders.length === 0 ? 0 : tripStartIndex + 1} - ${Math.min(tripStartIndex + tripItemsPerPage, filteredTripsOrders.length)} من أصل ${filteredTripsOrders.length} رحلة`
                  : `Showing ${filteredTripsOrders.length === 0 ? 0 : tripStartIndex + 1} - ${Math.min(tripStartIndex + tripItemsPerPage, filteredTripsOrders.length)} of ${filteredTripsOrders.length} trips`}
              </span>
              <div className="pagination-pills" style={{ direction: 'ltr' }}>
                <button 
                  type="button" 
                  className="pag-btn"
                  onClick={() => setTripCurrentPage(p => Math.max(1, p - 1))}
                  disabled={validTripCurrentPage <= 1}
                  title={isAr ? 'الصفحة السابقة' : 'Previous Page'}
                >
                  &lt;
                </button>

                {getPageNumbers(validTripCurrentPage, tripTotalPages).map((p, idx) => (
                  p === '...' ? (
                    <span key={`trips-ell-${idx}`} className="pag-ellipsis">...</span>
                  ) : (
                    <button 
                      key={`trips-page-${p}`}
                      type="button" 
                      className={`pag-btn ${validTripCurrentPage === p ? 'active' : ''}`}
                      onClick={() => setTripCurrentPage(p)}
                    >
                      {p}
                    </button>
                  )
                ))}

                <button 
                  type="button" 
                  className="pag-btn"
                  onClick={() => setTripCurrentPage(p => Math.min(tripTotalPages, p + 1))}
                  disabled={validTripCurrentPage >= tripTotalPages}
                  title={isAr ? 'الصفحة التالية' : 'Next Page'}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: TRIP ORDER DETAILS (SCREEN 4) */}
      {/* ========================================================================= */}
      {currentView === 'trip-detail' && activeTripDetail && (
        <main className="pz-view-container trip-detail-view">
          
          {/* Back link */}
          <button 
            type="button" 
            className="pz-back-link"
            onClick={() => setCurrentView('trips-orders')}
          >
            {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            <span>{isAr ? 'رجوع إلى قائمة الرحلات' : 'Back to Trips List'}</span>
          </button>

          {/* Detail Header */}
          <div className="trip-detail-header-row">
            <div>
              <div className="trip-title-badge-row">
                <h2 className="trip-detail-title">
                  {isAr ? `تفاصيل طلب الرحلة ${activeTripDetail.id}` : `Trip Order ${activeTripDetail.id}`}
                </h2>
                <span className="confirmed-pill">
                  <span className="status-dot" />
                  <span>{isAr ? 'حجز مؤكد' : 'CONFIRMED BOOKING'}</span>
                </span>
              </div>
              <p className="trip-detail-sub">
                {isAr 
                  ? `مراجعة تفاصيل الحجز المدرسي لمؤسسة ${activeTripDetail.organizationAr || activeTripDetail.organization}.`
                  : `Review institutional reservation details for ${activeTripDetail.organization}.`}
              </p>
            </div>

            <button 
              type="button" 
              className="print-voucher-btn"
              onClick={() => handlePrintVoucher(activeTripDetail.id)}
            >
              <Printer size={15} />
              <span>{isAr ? 'طباعة السند' : 'Print Voucher'}</span>
            </button>
          </div>

          {/* 5 Structured Sections Grid */}
          <div className="trip-sections-grid">
            
            {/* COLUMN 1: Section 01, Section 03, Section 05 */}
            <div className="trip-sections-col">
              
              {/* SECTION 01: Organization Details */}
              <div className="trip-sec-card">
                <div className="sec-card-header">
                  <Building2 size={18} className="sec-header-icon" />
                  <div>
                    <span className="sec-badge">{isAr ? 'القسم 01' : 'SECTION 01'}</span>
                    <h3 className="sec-title">{isAr ? 'بيانات المؤسسة' : 'Organization Details'}</h3>
                  </div>
                </div>

                <div className="sec-body-fields">
                  <div className="sec-field">
                    <span className="field-lbl">{isAr ? 'اسم المؤسسة' : 'ORGANIZATION NAME'}</span>
                    <span className="field-val large">
                      {isAr ? (activeTripDetail.organizationAr || activeTripDetail.organization) : activeTripDetail.organization}
                    </span>
                  </div>

                  <div className="sec-field">
                    <span className="field-lbl">{isAr ? 'نوع المؤسسة' : 'ORGANIZATION TYPE'}</span>
                    <span className="field-val">
                      {isAr ? (activeTripDetail.orgTypeAr || activeTripDetail.orgType) : activeTripDetail.orgType}
                    </span>
                  </div>

                  <div className="sec-grid-2">
                    <div className="sec-field">
                      <span className="field-lbl">{isAr ? 'المسؤول للتواصل' : 'CONTACT PERSON'}</span>
                      <span className="field-val flex-val">
                        <User size={14} /> {activeTripDetail.customer}
                      </span>
                    </div>

                    <div className="sec-field">
                      <span className="field-lbl">{isAr ? 'رقم الهاتف' : 'PHONE NUMBER'}</span>
                      <span className="field-val flex-val" style={{ direction: 'ltr' }}>
                        <Phone size={14} /> {activeTripDetail.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 03: Trip Package */}
              <div className="trip-sec-card">
                <div className="sec-card-header">
                  <Ticket size={18} className="sec-header-icon" />
                  <div>
                    <span className="sec-badge">{isAr ? 'القسم 03' : 'SECTION 03'}</span>
                    <h3 className="sec-title">{isAr ? 'باقة الرحلة' : 'Trip Package'}</h3>
                  </div>
                </div>

                <div className="sec-body-fields">
                  <div className="sec-field">
                    <span className="field-lbl">{isAr ? 'باقة الرحلة المختارة' : 'SELECTED TRIP PACKAGE'}</span>
                    <span className="field-val large">
                      {isAr ? (activeTripDetail.tripPackageAr || activeTripDetail.tripPackage) : activeTripDetail.tripPackage}
                    </span>
                  </div>

                  <div className="price-per-child-box">
                    <span className="field-lbl">{isAr ? 'سعر الطفل' : 'PRICE PER CHILD'}</span>
                    <div className="child-price-val">
                      <span className="price-big">{activeTripDetail.pricePerChild} {isAr ? 'ج.م' : 'EGP'}</span>
                      <span className="price-unit">{isAr ? '/ طفل' : '/ Child'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 05: Trip Schedule */}
              <div className="trip-sec-card">
                <div className="sec-card-header">
                  <Calendar size={18} className="sec-header-icon" />
                  <div>
                    <span className="sec-badge">{isAr ? 'القسم 05' : 'SECTION 05'}</span>
                    <h3 className="sec-title">{isAr ? 'جدول مواعيد الرحلة' : 'Trip Schedule'}</h3>
                  </div>
                </div>

                <div className="sec-body-fields">
                  <div className="sec-field">
                    <span className="field-lbl">{isAr ? 'تاريخ الزيارة' : 'VISIT DATE'}</span>
                    <span className="field-val flex-val large">
                      <Calendar size={16} /> 
                      <span>{isAr ? (activeTripDetail.visitDateAr || activeTripDetail.visitDate) : activeTripDetail.visitDate}</span>
                    </span>
                  </div>

                  <div className="sec-grid-2">
                    <div className="schedule-mini-box">
                      <span className="field-lbl">{isAr ? 'وقت الوصول' : 'ARRIVAL TIME'}</span>
                      <span className="mini-box-val" style={{ direction: 'ltr' }}>
                        <Clock size={15} /> {activeTripDetail.arrivalTime}
                      </span>
                    </div>

                    <div className="schedule-mini-box">
                      <span className="field-lbl">{isAr ? 'المدة الإجمالية' : 'TOTAL DURATION'}</span>
                      <span className="mini-box-val">
                        <Clock4 size={15} /> {isAr ? (activeTripDetail.totalDurationAr || activeTripDetail.totalDuration) : activeTripDetail.totalDuration}
                      </span>
                    </div>
                  </div>

                  <div className="operating-window-box">
                    <span className="field-lbl">{isAr ? 'فترة التشغيل' : 'OPERATING WINDOW'}</span>
                    <div className="op-window-val">
                      <span className="op-dot" />
                      <span>{isAr ? (activeTripDetail.operatingWindowAr || activeTripDetail.operatingWindow) : activeTripDetail.operatingWindow}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* COLUMN 2: Section 02, Section 04 */}
            <div className="trip-sections-col">
              
              {/* SECTION 02: Group Information */}
              <div className="trip-sec-card">
                <div className="sec-card-header">
                  <Users size={18} className="sec-header-icon" />
                  <div>
                    <span className="sec-badge">{isAr ? 'القسم 02' : 'SECTION 02'}</span>
                    <h3 className="sec-title">{isAr ? 'معلومات المجموعة' : 'Group Information'}</h3>
                  </div>
                </div>

                <div className="sec-body-fields">
                  <div className="sec-grid-2">
                    <div className="group-stat-box">
                      <span className="field-lbl">{isAr ? 'عدد الأطفال والطلاب' : 'NUMBER OF CHILDREN'}</span>
                      <div className="group-val-row">
                        <span className="group-num">{activeTripDetail.childrenCount}</span>
                        <span className="group-unit">{isAr ? 'طالب' : 'Students'}</span>
                      </div>
                    </div>

                    <div className="group-stat-box">
                      <span className="field-lbl">{isAr ? 'المشرفون' : 'SUPERVISORS'}</span>
                      <div className="group-val-row">
                        <span className="group-num">{activeTripDetail.supervisorsCount}</span>
                        <span className="group-unit">{isAr ? (activeTripDetail.supervisorsRoleAr || activeTripDetail.supervisorsRole) : activeTripDetail.supervisorsRole}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sec-field">
                    <span className="field-lbl">{isAr ? 'الفئة العمرية' : 'AVERAGE AGE GROUP'}</span>
                    <div className="age-group-pill">
                      <span>{isAr ? (activeTripDetail.ageGroupAr || activeTripDetail.ageGroup) : activeTripDetail.ageGroup}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 04: Services */}
              <div className="trip-sec-card">
                <div className="sec-card-header">
                  <Layers size={18} className="sec-header-icon" />
                  <div>
                    <span className="sec-badge">{isAr ? 'القسم 04' : 'SECTION 04'}</span>
                    <h3 className="sec-title">{isAr ? 'الخدمات والأنشطة' : 'Services'}</h3>
                  </div>
                </div>

                <div className="sec-body-fields">
                  
                  {/* Play Zone Selection */}
                  <div className="services-subcard">
                    <span className="field-lbl">{isAr ? 'مناطق اللعب المختارة' : 'PLAY ZONE SELECTION'}</span>
                    <div className="selected-areas-header">
                      <span className="areas-dot" />
                      <span>{isAr ? `المناطق المختارة: ${activeTripDetail.selectedAreas.length} مناطق` : `Selected Areas: ${activeTripDetail.selectedAreas.length} Areas`}</span>
                    </div>
                    <div className="services-pills-row">
                      {(isAr && activeTripDetail.selectedAreasAr ? activeTripDetail.selectedAreasAr : activeTripDetail.selectedAreas).map((area, idx) => (
                        <span key={idx} className="service-area-pill">{area}</span>
                      ))}
                    </div>
                  </div>

                  {/* Restaurant & Dining */}
                  <div className="services-subcard">
                    <span className="field-lbl">{isAr ? 'المطعم ووجبات الغداء' : 'RESTAURANT & DINING'}</span>
                    <div className="service-item-row">
                      <Utensils size={18} className="service-icon" />
                      <div>
                        <span className="service-main-name">
                          {isAr ? (activeTripDetail.diningAr || activeTripDetail.dining) : activeTripDetail.dining}
                        </span>
                        <span className="service-sub-desc">
                          {isAr ? (activeTripDetail.diningDescAr || activeTripDetail.diningDesc) : activeTripDetail.diningDesc}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Café & Hospitality */}
                  <div className="services-subcard">
                    <span className="field-lbl">{isAr ? 'الكافيه والضيافة' : 'CAFÉ & HOSPITALITY'}</span>
                    <div className="service-item-row">
                      <Coffee size={18} className="service-icon" />
                      <div>
                        <span className="service-main-name">
                          {isAr ? (activeTripDetail.hospitalityAr || activeTripDetail.hospitality) : activeTripDetail.hospitality}
                        </span>
                        <span className="service-sub-desc">
                          {isAr ? (activeTripDetail.hospitalityDescAr || activeTripDetail.hospitalityDesc) : activeTripDetail.hospitalityDesc}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* Bottom Action Buttons Bar */}
          <div className="detail-bottom-actions-bar">
            <button 
              type="button" 
              className="action-btn-reschedule"
              onClick={() => setIsRescheduleOpen(true)}
            >
              <Calendar size={15} />
              <span>{isAr ? 'إعادة جدولة' : 'Reschedule'}</span>
            </button>

            <button 
              type="button" 
              className="action-btn-print"
              onClick={() => handlePrintVoucher(activeTripDetail.id)}
            >
              <Printer size={15} />
              <span>{isAr ? 'طباعة' : 'Print'}</span>
            </button>

            <button 
              type="button" 
              className="action-btn-cancel"
              onClick={() => handleCancelOrder(activeTripDetail.id, 'trip')}
            >
              <X size={15} />
              <span>{isAr ? 'إلغاء الحجز' : 'Cancel'}</span>
            </button>

            <button 
              type="button" 
              className="action-btn-done"
              onClick={() => setCurrentView('trips-orders')}
            >
              <span>{isAr ? 'تم' : 'DONE'}</span>
            </button>
          </div>

        </main>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: ORDER DETAILS & UPDATE FORM MODAL */}
      {/* ========================================================================= */}
      {selectedPlayzoneOrder && (
        <div className="pz-modal-backdrop" onClick={() => setSelectedPlayzoneOrder(null)}>
          <div 
            className="pz-order-details-modal-wrapper" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: '980px', width: '95%', maxHeight: '92vh', overflowY: 'auto', borderRadius: '18px' }}
          >
            <OrderDetailsUpdateForm 
              order={selectedPlayzoneOrder}
              onClose={() => setSelectedPlayzoneOrder(null)}
              lang={lang}
              onSuccess={(updatedFields) => {
                const code = selectedPlayzoneOrder.orderCode || selectedPlayzoneOrder._id || '';
                showToast(isAr ? `تم تحديث الطلب ${code} بنجاح.` : `Order ${code} updated successfully.`);
                setOrders(prev => prev.map(o => {
                  const oId = o._id || o.id;
                  const selId = selectedPlayzoneOrder._id || selectedPlayzoneOrder.id;
                  if (oId === selId) {
                    return { ...o, ...updatedFields };
                  }
                  return o;
                }));
                fetchOrders();
              }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESCHEDULE MODAL */}
      {/* ========================================================================= */}
      {isRescheduleOpen && (
        <div className="reschedule-modal-backdrop" onClick={() => setIsRescheduleOpen(false)}>
          <div className="reschedule-modal-card" onClick={e => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="reschedule-header">
              <Calendar size={20} color="#0284c7" />
              <h3>{isAr ? 'إعادة جدولة موعد الحجز' : 'Reschedule Reservation'}</h3>
            </div>

            <div className="reschedule-fields">
              <label>{isAr ? 'تحديد التاريخ الجديد:' : 'Select New Date:'}</label>
              <input 
                type="date" 
                className="reschedule-input"
                value={rescheduleDate}
                onChange={e => setRescheduleDate(e.target.value)}
              />

              <label>{isAr ? 'تحديد الفترة الزمنية:' : 'Select Time Window:'}</label>
              <select 
                className="reschedule-input"
                value={rescheduleTime}
                onChange={e => setRescheduleTime(e.target.value)}
              >
                <option value="10:00 AM">10:00 AM – 02:00 PM</option>
                <option value="01:00 PM">01:00 PM – 05:00 PM</option>
                <option value="03:30 PM">03:30 PM – 07:30 PM</option>
                <option value="05:00 PM">05:00 PM – 09:00 PM</option>
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
                onClick={handleSaveReschedule}
              >
                {isAr ? 'تأكيد الموعد الجديد' : 'Save New Date & Time'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
