import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { 
  getAllBookings, 
  updateBookingStatus, 
  updateBookingDetails 
} from '../../api/bookingTableService';
import RestaurantAnalyticsPanel from './RestaurantAnalyticsPanel';
import '../../pages/desktop/PlayZoneOrdersManager.css';
import './OrderDetailsUpdateForm.css';
import './RestaurantOrdersManager.css';
import { 
  Utensils, 
  Coffee, 
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
  ChefHat, 
  Bike, 
  Sparkles, 
  CheckCircle2, 
  Clock4, 
  AlertCircle, 
  ChevronDown,
  ShoppingBag,
  MapPin,
  CreditCard
} from 'lucide-react';

// Initial Mock Restaurant Data (Delivery + Dine-in Table Reservations)
const INITIAL_RESTAURANT_ORDERS = [
  {
    id: '#FD-84920',
    orderId: '#FD-84920',
    rawId: 'FD-84920',
    type: 'delivery',
    customer: 'Khaled Omar',
    phone: '01098765432',
    avatar: 'KO',
    avatarBg: '#0284c7',
    address: 'شارع شبين الكوم، برج الأطباء، الدور 4، الإسماعيلية',
    addressEn: 'Shebin El-Kom St, Doctors Tower, 4th Floor, Ismailia',
    items: [
      { name: 'Double Angus Cheeseburger', nameAr: 'دبل أنجوس تشيز برجر', qty: 2, price: 185 },
      { name: 'Truffle Shoestring Fries', nameAr: 'بطاطس مقلية بالكمأة', qty: 1, price: 65 },
      { name: 'Classic Mojito Cooler', nameAr: 'موهيتو كلاسيك منعش', qty: 2, price: 55 }
    ],
    itemsSummary: '2x Double Angus Burger, 1x Truffle Fries, 2x Mojito',
    itemsSummaryAr: '2 دبل أنجوس برجر، 1 بطاطس كمأة، 2 موهيتو',
    subtotal: 545,
    deliveryFee: 25,
    totalPrice: 570,
    paymentMethod: 'InstaPay',
    paymentStatus: 'paid',
    status: 'Processing',
    notes: 'يرجى وضع الصوص جانباً وكاتشب إضافي من فضلك',
    createdAt: new Date().toISOString(),
    serviceType: 'delivery',
    serviceTypeAr: 'توصيل منازل 🛵'
  },
  {
    id: '#TB-10294',
    orderId: '#TB-10294',
    rawId: 'TB-10294',
    bookingCode: 'TB-10294',
    type: 'table',
    customer: 'Mona Youssef',
    phone: '01223456789',
    avatar: 'MY',
    avatarBg: '#a855f7',
    area: 'terrace',
    areaAr: 'تراس القناة المفتوح (طاولة #4)',
    areaEn: 'Open Canal Terrace (Table #4)',
    numberOfPerson: 4,
    date: '2026-10-24',
    time: '07:30 PM',
    items: [
      { name: 'Table Reservation (4 Guests)', nameAr: 'حجز طاولة عائلية (4 أفراد)', qty: 1, price: 200 },
      { name: 'Welcome Hospitality & Appetizers', nameAr: 'ضيافة ومقبلات ترحيبية', qty: 1, price: 250 }
    ],
    itemsSummary: 'Canal View Table #4 • 4 Guests',
    itemsSummaryAr: 'طاولة مطلة على القناة • 4 أفراد',
    subtotal: 450,
    deliveryFee: 0,
    totalPrice: 450,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'Confirmed',
    notes: 'طاولة هادئة مع كراسي أطفال بجوار النافذة',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    serviceType: 'table',
    serviceTypeAr: 'حجز طاولة مطعم 🍽️'
  },
  {
    id: '#FD-84921',
    orderId: '#FD-84921',
    rawId: 'FD-84921',
    type: 'delivery',
    customer: 'Sherif Adel',
    phone: '01145551234',
    avatar: 'SA',
    avatarBg: '#ea580c',
    address: 'حي الفيروز، فيلا 18، طريق البلاجات، الإسماعيلية',
    addressEn: 'Fairouz District, Villa 18, Balajat Road, Ismailia',
    items: [
      { name: 'BBQ Smoked Beef Pizza', nameAr: 'بيتزا لحم مدخن بالباربيكيو', qty: 1, price: 210 },
      { name: 'Crispy Chicken Tenders Bucket', nameAr: 'تشيكن تندرز كرسبي عائلي', qty: 1, price: 160 },
      { name: 'Soft Drinks (Coca Cola)', nameAr: 'مشروبات غازية', qty: 3, price: 25 }
    ],
    itemsSummary: '1x BBQ Beef Pizza, 1x Chicken Tenders Bucket, 3x Drinks',
    itemsSummaryAr: '1 بيتزا باربيكيو، 1 تندرز كرسبي، 3 كانز',
    subtotal: 445,
    deliveryFee: 25,
    totalPrice: 470,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    status: 'Confirmed',
    notes: 'الدفع عند الاستلام - كاش',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    serviceType: 'delivery',
    serviceTypeAr: 'توصيل منازل 🛵'
  },
  {
    id: '#TB-10295',
    orderId: '#TB-10295',
    rawId: 'TB-10295',
    bookingCode: 'TB-10295',
    type: 'table',
    customer: 'Eng. Tarek Mansour',
    phone: '01012233445',
    avatar: 'TM',
    avatarBg: '#10b981',
    area: 'indoor',
    areaAr: 'الصالة الداخلية المكيفة (طاولة #12)',
    areaEn: 'Indoor AC Dining Hall (Table #12)',
    numberOfPerson: 6,
    date: '2026-10-24',
    time: '08:30 PM',
    items: [
      { name: 'Dine-In Family Dinner Platter', nameAr: 'وجبة عشاء عائلية مشكلة', qty: 1, price: 680 }
    ],
    itemsSummary: 'Indoor AC Table #12 • 6 Guests',
    itemsSummaryAr: 'طاولة داخلية مكيفة • 6 أفراد',
    subtotal: 680,
    deliveryFee: 0,
    totalPrice: 680,
    paymentMethod: 'instapay',
    paymentStatus: 'paid',
    status: 'Completed',
    notes: 'تم تقديم الوجبات واستلام الفاتورة بنجاح',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    serviceType: 'table',
    serviceTypeAr: 'حجز طاولة مطعم 🍽️'
  },
  {
    id: '#FD-84922',
    orderId: '#FD-84922',
    rawId: 'FD-84922',
    type: 'delivery',
    customer: 'Yasmine Kamal',
    phone: '01023344556',
    avatar: 'YK',
    avatarBg: '#06b6d4',
    address: 'عمارات هيئة قناة السويس، عمارة 5، شقة 12',
    addressEn: 'Suez Canal Buildings, Bldg 5, Apt 12',
    items: [
      { name: 'Kids Fun Burger Meal + Toy', nameAr: 'وجبة أطفال كيدز برجر + لعبة', qty: 2, price: 120 },
      { name: 'Artisanal Margherita Pizza', nameAr: 'بيتزا مارجريتا إيطالية', qty: 1, price: 160 }
    ],
    itemsSummary: '2x Kids Meals, 1x Margherita Pizza',
    itemsSummaryAr: '2 وجبة أطفال، 1 بيتزا مارجريتا',
    subtotal: 400,
    deliveryFee: 25,
    totalPrice: 425,
    paymentMethod: 'vodafone_cash',
    paymentStatus: 'paid',
    status: 'Completed',
    notes: 'توصيل سريع للأطفال',
    createdAt: new Date(Date.now() - 28800000).toISOString(),
    serviceType: 'delivery',
    serviceTypeAr: 'توصيل منازل 🛵'
  },
  {
    id: '#TB-10296',
    orderId: '#TB-10296',
    rawId: 'TB-10296',
    bookingCode: 'TB-10296',
    type: 'table',
    customer: 'Dr. Hany Farid',
    phone: '01201122334',
    avatar: 'HF',
    avatarBg: '#8b5cf6',
    area: 'vip',
    areaAr: 'صالة كبار الزوار VIP الخاصة',
    areaEn: 'Private VIP Dining Lounge',
    numberOfPerson: 8,
    date: '2026-10-25',
    time: '09:00 PM',
    items: [
      { name: 'VIP Chef Table Tasting Menu', nameAr: 'قائمة تذوق الشيف VIP الخاصة', qty: 8, price: 160 }
    ],
    itemsSummary: 'VIP Lounge • 8 Persons',
    itemsSummaryAr: 'صالة VIP خاصة • 8 أفراد',
    subtotal: 1280,
    deliveryFee: 0,
    totalPrice: 1280,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'Confirmed',
    notes: 'استضافة خاصة لاجتماع عائلي',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    serviceType: 'table',
    serviceTypeAr: 'حجز طاولة مطعم 🍽️'
  },
  {
    id: '#FD-84923',
    orderId: '#FD-84923',
    rawId: 'FD-84923',
    type: 'delivery',
    customer: 'Amr Mostafa',
    phone: '01118899001',
    avatar: 'AM',
    avatarBg: '#ef4444',
    address: 'شارع الثلاثيني، ميدان الممر، الإسماعيلية',
    addressEn: 'Thalathini St, El-Mamar, Ismailia',
    items: [
      { name: 'Smash Burger Supreme', nameAr: 'سماش برجر سوبريم', qty: 1, price: 175 },
      { name: 'Buffalo Hot Wings', nameAr: 'أجنحة دجاج بافلو حارة', qty: 1, price: 110 }
    ],
    itemsSummary: '1x Smash Burger, 1x Buffalo Wings',
    itemsSummaryAr: '1 سماش برجر، 1 أجنحة بافلو',
    subtotal: 285,
    deliveryFee: 25,
    totalPrice: 310,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    status: 'Cancelled',
    notes: 'تم الإلغاء بناء على طلب العميل',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    serviceType: 'delivery',
    serviceTypeAr: 'توصيل منازل 🛵'
  }
];

export default function RestaurantOrdersManager({ 
  isAr = true, 
  lang = 'ar',
  onBackToDashboard = () => {} 
}) {
  const [orders, setOrders] = useState(INITIAL_RESTAURANT_ORDERS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'delivery' | 'table'
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editStatus, setEditStatus] = useState('Processing');
  const [editPaymentStatus, setEditPaymentStatus] = useState('paid');
  const [editPaymentMethod, setEditPaymentMethod] = useState('instapay');
  const [editNotes, setEditNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Fetch real table bookings from backend API
  const fetchTableBookings = useCallback(async () => {
    try {
      const res = await getAllBookings({ limit: 30 });
      if (res && res.success && Array.isArray(res.data)) {
        const mappedBackend = res.data.map(b => ({
          id: b.bookingCode || `TB-${String(b._id).slice(-6)}`,
          orderId: b.bookingCode || `TB-${String(b._id).slice(-6)}`,
          rawId: b._id,
          bookingCode: b.bookingCode,
          type: 'table',
          customer: b.guestName || b.guest?.name || 'ضيف المطعم',
          phone: b.guestPhone || b.guest?.phone || '01012345678',
          avatar: String(b.guestName || 'G').slice(0, 2).toUpperCase(),
          avatarBg: '#0284c7',
          area: b.area || 'indoor',
          areaAr: b.area === 'terrace' ? 'تراس القناة' : b.area === 'vip' ? 'صالة VIP' : 'الصالة الداخلية',
          areaEn: b.area === 'terrace' ? 'Canal Terrace' : b.area === 'vip' ? 'VIP Lounge' : 'Indoor Dining',
          numberOfPerson: b.numberOfPerson || 2,
          date: b.date || '2026-10-24',
          time: b.time || '07:00 PM',
          items: [
            { name: `Table Booking (${b.numberOfPerson || 2} Persons)`, nameAr: `حجز طاولة (${b.numberOfPerson || 2} أفراد)`, qty: 1, price: 150 }
          ],
          itemsSummary: `${b.area || 'Dining'} Table • ${b.numberOfPerson || 2} Guests`,
          itemsSummaryAr: `طاولة ${b.area === 'terrace' ? 'تراس' : 'داخلية'} • ${b.numberOfPerson || 2} أفراد`,
          subtotal: 150,
          deliveryFee: 0,
          totalPrice: 150,
          paymentMethod: 'card',
          paymentStatus: 'paid',
          status: b.status === 'confirmed' ? 'Confirmed' : b.status === 'completed' ? 'Completed' : 'Processing',
          notes: b.notes || '',
          createdAt: b.createdAt || new Date().toISOString(),
          serviceType: 'table',
          serviceTypeAr: 'حجز طاولة 🍽️'
        }));

        setOrders(prev => {
          const existingIds = new Set(prev.map(o => o.bookingCode || o.id));
          const newOnes = mappedBackend.filter(b => !existingIds.has(b.bookingCode || b.id));
          return [...newOnes, ...prev];
        });
      }
    } catch {
      // Offline fallback
    }
  }, []);

  useEffect(() => {
    fetchTableBookings();
  }, [fetchTableBookings]);

  // Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTableBookings();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(isAr ? 'تم تحديث بيانات المطعم والكافيه بنجاح.' : 'Restaurant & Dining orders refreshed.');
    }, 600);
  };

  // Open modal
  const handleOpenOrder = (ord) => {
    setSelectedOrder(ord);
    setEditStatus(ord.status || 'Processing');
    setEditPaymentStatus(ord.paymentStatus || 'paid');
    setEditPaymentMethod(ord.paymentMethod || 'instapay');
    setEditNotes(ord.notes || '');
  };

  // Save changes
  const handleSaveOrder = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      if (selectedOrder.type === 'table' && selectedOrder.rawId) {
        await updateBookingStatus(selectedOrder.rawId, editStatus.toLowerCase()).catch(() => {});
      }

      setOrders(prev => prev.map(o => {
        if (o.id === selectedOrder.id || o.rawId === selectedOrder.rawId) {
          return {
            ...o,
            status: editStatus,
            paymentStatus: editPaymentStatus,
            paymentMethod: editPaymentMethod,
            notes: editNotes
          };
        }
        return o;
      }));

      showToast(isAr ? `✓ تم حفظ تعديلات الطلب ${selectedOrder.id} بنجاح.` : `✓ Order ${selectedOrder.id} updated successfully.`);
      setSelectedOrder(null);
    } catch {
      showToast(isAr ? 'حدث خطأ أثناء حفظ التعديلات.' : 'Error saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Type', 'Customer', 'Phone', 'Items', 'Total (EGP)', 'Payment Method', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.id,
      o.type,
      o.customer,
      o.phone,
      `"${o.itemsSummary || ''}"`,
      o.totalPrice,
      o.paymentMethod,
      o.status,
      o.date || o.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `restaurant_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(isAr ? 'تم تصدير تقرير الطلبات إلى CSV بنجاح.' : 'Exported restaurant orders CSV.');
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      const code = String(ord.id || ord.orderId || '').toLowerCase().replace('#', '');
      const cust = String(ord.customer || '').toLowerCase();
      const phone = String(ord.phone || '');
      const addr = String(ord.address || ord.area || '').toLowerCase();
      const itemsStr = String(ord.itemsSummary || ord.itemsSummaryAr || '').toLowerCase();
      const st = String(ord.status || 'Pending').toLowerCase();

      // Search
      const matchesSearch = 
        !search ||
        code.includes(search.toLowerCase().replace('#', '')) ||
        cust.includes(search.toLowerCase()) ||
        phone.includes(search) ||
        addr.includes(search.toLowerCase()) ||
        itemsStr.includes(search.toLowerCase());

      // Status
      const matchesStatus = 
        statusFilter === 'All' ||
        st === statusFilter.toLowerCase() ||
        (statusFilter.toLowerCase() === 'processing' && (st === 'cooking' || st === 'in-prep' || st === 'pending'));

      // Service Type
      let matchesType = true;
      if (typeFilter !== 'all') {
        matchesType = ord.type === typeFilter;
      }

      // Date
      let matchesDate = true;
      if (dateFilter && dateFilter !== 'all') {
        const orderDateStr = ord.createdAt || ord.date;
        if (orderDateStr) {
          const orderDate = new Date(orderDateStr);
          const now = new Date();
          if (!isNaN(orderDate.getTime())) {
            const isSameDay = (d1, d2) => 
              d1.getFullYear() === d2.getFullYear() &&
              d1.getMonth() === d2.getMonth() &&
              d1.getDate() === d2.getDate();

            if (dateFilter === 'today') {
              matchesDate = isSameDay(orderDate, now) || String(orderDateStr).includes('2026-10-24');
            } else if (dateFilter === 'yesterday') {
              const y = new Date(now); y.setDate(now.getDate() - 1);
              matchesDate = isSameDay(orderDate, y);
            } else if (dateFilter === 'week') {
              matchesDate = true;
            } else if (dateFilter === 'month') {
              matchesDate = true;
            } else if (dateFilter === 'custom' && customDate) {
              matchesDate = isSameDay(orderDate, new Date(customDate));
            }
          }
        }
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [orders, search, statusFilter, typeFilter, dateFilter, customDate]);

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
      processing: orders.filter(o => ['processing', 'cooking', 'in-prep', 'pending'].includes(String(o.status).toLowerCase())).length,
      confirmed: orders.filter(o => String(o.status).toLowerCase() === 'confirmed').length,
      completed: orders.filter(o => String(o.status).toLowerCase() === 'completed').length,
      cancelled: orders.filter(o => String(o.status).toLowerCase() === 'cancelled').length
    };
  }, [orders]);

  const getStatusText = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'confirmed') return isAr ? 'مؤكد' : 'Confirmed';
    if (s === 'processing' || s === 'cooking' || s === 'pending') return isAr ? 'قيد التحضير' : 'Processing';
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
            {isAr ? 'طلبات المطعم والكافيه' : 'Restaurant & Cafe Orders'}
          </h2>
          <p className="pz-page-subtitle">
            {isAr 
              ? 'متابعة وإدارة طلبات التوصيل السريعة، طاولات الصالة والتراس، ومبيعات المطبخ في الوقت الفعلي.' 
              : 'Monitor, review, and manage real-time culinary orders, table reservations, and delivery dispatch.'}
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
      <RestaurantAnalyticsPanel 
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
              placeholder={isAr ? 'بحث باسم العميل، الهاتف، أو كود الطلب (مثل #FD-84920)...' : 'Search by customer name, phone, or order ID (e.g. #FD-84920)...'}
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
                setIsTypeDropdownOpen(false);
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

          {/* Service Channel Filter Dropdown */}
          <div className="pz-filter-dropdown-wrap" ref={typeDropdownRef}>
            <button 
              type="button" 
              className={`pz-filter-pill-btn ${isTypeDropdownOpen ? 'active' : ''}`}
              onClick={() => {
                setIsTypeDropdownOpen(prev => !prev);
                setIsDateDropdownOpen(false);
              }}
            >
              <SlidersHorizontal size={14} />
              <span>
                {typeFilter === 'all' 
                  ? (isAr ? 'جميع القنوات (توصيل وطاولات)' : 'All Channels (Delivery & Tables)')
                  : typeFilter === 'delivery' 
                  ? (isAr ? 'توصيل منازل 🛵' : 'Home Delivery 🛵') 
                  : (isAr ? 'حجز طاولات 🍽️' : 'Table Reservations 🍽️')}
              </span>
              <ChevronDown size={14} className={`filter-chevron ${isTypeDropdownOpen ? 'rotate' : ''}`} />
            </button>

            {isTypeDropdownOpen && (
              <div className="pz-filter-menu">
                <button 
                  type="button"
                  className={`filter-menu-item ${typeFilter === 'all' ? 'selected' : ''}`}
                  onClick={() => { setTypeFilter('all'); setIsTypeDropdownOpen(false); }}
                >
                  <span>{isAr ? 'جميع القنوات' : 'All Channels'}</span>
                  {typeFilter === 'all' && <Check size={14} />}
                </button>
                <button 
                  type="button"
                  className={`filter-menu-item ${typeFilter === 'delivery' ? 'selected' : ''}`}
                  onClick={() => { setTypeFilter('delivery'); setIsTypeDropdownOpen(false); }}
                >
                  <span>{isAr ? 'توصيل منازل (Delivery 🛵)' : 'Home Delivery 🛵'}</span>
                  {typeFilter === 'delivery' && <Check size={14} />}
                </button>
                <button 
                  type="button"
                  className={`filter-menu-item ${typeFilter === 'table' ? 'selected' : ''}`}
                  onClick={() => { setTypeFilter('table'); setIsTypeDropdownOpen(false); }}
                >
                  <span>{isAr ? 'حجز طاولات مطعم (Dine-In 🍽️)' : 'Table Reservations 🍽️'}</span>
                  {typeFilter === 'table' && <Check size={14} />}
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
              ? `عرض ${filteredOrders.length} من أصل ${orders.length} طلب مسجل`
              : `Showing ${filteredOrders.length} of ${orders.length} bookings recorded`}
          </span>
        </div>
      </div>

      {/* ORDERS TABLE - EXACT MATCH TO SCREENSHOT 1 */}
      <div className="pz-table-card">
        <div className="pz-table-responsive">
          <table className="pz-orders-table">
            <thead>
              <tr>
                <th>{isAr ? 'كود الطلب' : 'ORDER ID'}</th>
                <th>{isAr ? 'العميل والملف' : 'CUSTOMER & PROFILE'}</th>
                <th>{isAr ? 'نوع الخدمة والطلب' : 'ORDER & ITEMS'}</th>
                <th>{isAr ? 'المبلغ الإجمالي' : 'TOTAL AMOUNT'}</th>
                <th>{isAr ? 'الحالة' : 'STATUS'}</th>
                <th>{isAr ? 'الإجراء' : 'ACTION'}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    {isAr ? 'لا توجد طلبات مطعم تطابق الفلتر المحدد.' : 'No restaurant orders found matching your filter.'}
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => {
                  const orderCode = String(ord.id || ord.orderId || '').replace('#', '');
                  const customerName = ord.customer || (isAr ? 'عميل زائر' : 'Guest Customer');
                  const customerPhone = ord.phone || (isAr ? 'لا يوجد هاتف' : 'No phone');
                  const totalPrice = Number(ord.totalPrice || 0);
                  const status = ord.status || 'Confirmed';

                  const avatarInitials = customerName.split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'AM';
                  const avatarColors = ['#0284c7', '#ea580c', '#d97706', '#10b981', '#7c3aed'];
                  const avatarBg = avatarColors[orderCode.length % avatarColors.length];

                  return (
                    <tr key={ord.id} className="pz-table-row">
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
                            <span className="customer-name">{customerName}</span>
                            <span className="customer-phone" style={{ direction: 'ltr' }}>
                              <Phone size={12} /> {customerPhone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ORDER ITEMS & SERVICE */}
                      <td className="col-tickets">
                        <span className="tickets-badge">
                          {ord.type === 'delivery' ? <Bike size={14} /> : <Utensils size={14} />}
                          <span>{isAr ? ord.serviceTypeAr : (ord.type === 'delivery' ? 'Home Delivery' : 'Table Reservation')}</span>
                        </span>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', fontWeight: 600 }}>
                          {isAr ? (ord.itemsSummaryAr || ord.itemsSummary) : ord.itemsSummary}
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
                          onClick={() => handleOpenOrder(ord)}
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
              ? `عرض ${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredOrders.length)} من أصل ${filteredOrders.length} طلب مسجل`
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
      {/* RESTAURANT ORDER DETAILS & UPDATE MODAL (CENTERED WHITE CARD)             */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="pz-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div 
            className="pz-order-details-modal-wrapper" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: '840px', width: '95%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px' }}
          >
            <div className="order-details-card">
              {/* Header */}
              <div className="order-details-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                    {isAr ? 'تفاصيل طلب المطعم وتحديث الحالة' : 'Dining Order Details & Fulfillment'}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {selectedOrder.id} • {selectedOrder.type === 'delivery' ? (isAr ? 'طلب دليفري' : 'Delivery') : (isAr ? 'حجز طاولة' : 'Table Reservation')}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="close-btn"
                  onClick={() => setSelectedOrder(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="order-details-body">
                {/* 1. Summary Card */}
                <div className="summary-section">
                  <h4 className="section-title">
                    <ShoppingBag size={16} />
                    <span>{isAr ? 'ملخص بيانات الطلب والعميل' : 'Order & Customer Summary'}</span>
                  </h4>

                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="label">{isAr ? 'اسم العميل:' : 'Guest Name:'}</span>
                      <span className="value bold">{selectedOrder.customer}</span>
                    </div>

                    <div className="summary-item">
                      <span className="label">{isAr ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                      <span className="value bold" dir="ltr">{selectedOrder.phone}</span>
                    </div>

                    <div className="summary-item">
                      <span className="label">
                        {selectedOrder.type === 'delivery' ? (isAr ? 'عنوان التوصيل:' : 'Delivery Address:') : (isAr ? 'مكان الطاولة:' : 'Table Area:')}
                      </span>
                      <span className="value">
                        {selectedOrder.type === 'delivery' 
                          ? (isAr ? selectedOrder.address : selectedOrder.addressEn || selectedOrder.address)
                          : (isAr ? selectedOrder.areaAr : selectedOrder.areaEn || selectedOrder.area)}
                      </span>
                    </div>

                    <div className="summary-item">
                      <span className="label">{isAr ? 'إجمالي الحساب:' : 'Total Amount:'}</span>
                      <span className="value price-highlight">
                        {selectedOrder.totalPrice} {isAr ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="order-items-list-wrapper">
                    <span className="order-items-list-label">
                      {isAr ? 'قائمة الأصناف المحجوزة:' : 'Ordered Items / Reservation:'}
                    </span>
                    <div className="order-items-box">
                      {(selectedOrder.items || []).map((it, i) => (
                        <div key={i} className="order-item-row">
                          <span className="item-name-qty">{it.qty}x {isAr ? (it.nameAr || it.name) : it.name}</span>
                          <strong className="item-price-val">{it.price * it.qty} {isAr ? 'ج.م' : 'EGP'}</strong>
                        </div>
                      ))}
                      {selectedOrder.deliveryFee > 0 && (
                        <div className="order-item-row delivery-fee-row">
                          <span>{isAr ? 'خدمة التوصيل السريع (Delivery Fee)' : 'Delivery Service Fee'}</span>
                          <span>{selectedOrder.deliveryFee} {isAr ? 'ج.م' : 'EGP'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Editable Update Form */}
                <div className="update-form-section">
                  <h4 className="section-title">
                    <ChefHat size={16} />
                    <span>{isAr ? 'تعديل حالة الطلب ومسار التحضير' : 'Order Status & Kitchen Management'}</span>
                  </h4>

                  <div className="form-grid">
                    {/* Status */}
                    <div className="form-group">
                      <label>{isAr ? 'حالة الطلب:' : 'Order Status:'}</label>
                      <select 
                        value={editStatus} 
                        onChange={e => setEditStatus(e.target.value)}
                        className="form-select"
                      >
                        <option value="Confirmed">{isAr ? 'مؤكد (Confirmed)' : 'Confirmed'}</option>
                        <option value="Processing">{isAr ? 'قيد التحضير في المطبخ (Processing / In Kitchen)' : 'Processing / In Kitchen'}</option>
                        <option value="Completed">{isAr ? 'تم التسليم والدفع (Completed)' : 'Completed'}</option>
                        <option value="Cancelled">{isAr ? 'ملغي (Cancelled)' : 'Cancelled'}</option>
                      </select>
                    </div>

                    {/* Payment Status */}
                    <div className="form-group">
                      <label>{isAr ? 'حالة الدفع:' : 'Payment Status:'}</label>
                      <select 
                        value={editPaymentStatus} 
                        onChange={e => setEditPaymentStatus(e.target.value)}
                        className="form-select"
                      >
                        <option value="paid">{isAr ? 'تم الدفع (Paid)' : 'Paid'}</option>
                        <option value="pending">{isAr ? 'معلق / عند الاستلام (Pending)' : 'Pending / COD'}</option>
                        <option value="refunded">{isAr ? 'مسترجع (Refunded)' : 'Refunded'}</option>
                      </select>
                    </div>

                    {/* Payment Method */}
                    <div className="form-group">
                      <label>{isAr ? 'طريقة الدفع:' : 'Payment Method:'}</label>
                      <select 
                        value={editPaymentMethod} 
                        onChange={e => setEditPaymentMethod(e.target.value)}
                        className="form-select"
                      >
                        <option value="instapay">InstaPay (إنستاباي)</option>
                        <option value="cash">{isAr ? 'الدفع نقداً كاش (Cash on Delivery)' : 'Cash on Delivery'}</option>
                        <option value="card">{isAr ? 'بطاقة بنكية / فيزا (Credit Card)' : 'Credit Card'}</option>
                        <option value="vodafone_cash">Vodafone Cash (فودافون كاش)</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div className="form-group full-width">
                      <label>{isAr ? 'ملاحظات وتوجيهات الشيف / الطيار:' : 'Kitchen / Driver Notes:'}</label>
                      <textarea 
                        rows="3"
                        value={editNotes}
                        onChange={e => setEditNotes(e.target.value)}
                        className="form-textarea"
                        placeholder={isAr ? 'أضف أي تعليمات خاصة بالتسليم، نوع الخبز، درجة الشواء...' : 'Add special delivery or kitchen prep notes...'}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="form-actions-row">
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={() => setSelectedOrder(null)}
                    >
                      {isAr ? 'إغلاق' : 'Cancel'}
                    </button>

                    <button 
                      type="button" 
                      className="btn-save"
                      disabled={isSaving}
                      onClick={handleSaveOrder}
                    >
                      <Check size={16} />
                      <span>{isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
