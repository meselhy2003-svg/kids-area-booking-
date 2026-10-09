import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Baby, 
  Search, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Download, 
  X, 
  Check, 
  Phone, 
  Calendar, 
  Sparkles,
  Heart,
  ChevronDown,
  Filter,
  Eye,
  Clock,
  CreditCard,
  Wallet,
  Receipt,
  TrendingUp,
  Ticket,
  Utensils,
  Building2,
  CheckCircle2,
  Clock4,
  Award,
  ArrowUpRight,
  FileText,
  BadgePercent
} from 'lucide-react';
import './GuestsManager.css';
import GuestActivityDashboard, { SAMPLE_GUEST_API_RESPONSE } from './GuestActivityDashboard';

// Default Transaction & Spending Records for Initial Guests
const DEFAULT_GUEST_TRANSACTIONS = {
  'g-101': [
    {
      id: '#PZ-8841',
      service: 'Play Zone Unlimited Day Pass',
      serviceAr: 'تذكرة يوم كامل منطقة الألعاب (غير محدودة)',
      category: 'playzone',
      categoryAr: 'منطقة الألعاب',
      date: '2026-10-08T14:30:00Z',
      amount: 700,
      paymentMethod: 'Credit Card (Visa)',
      paymentMethodAr: 'بطاقة ائتمان (فيزا)',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: '2 Children Passes (Youssef & Nour) + 1 Guardian Pass'
    },
    {
      id: '#RES-4120',
      service: 'Canal-side Sunset Dinner Terrace',
      serviceAr: 'عشاء شاطئي على التراس - مشاوي ومقبلات',
      category: 'restaurant',
      categoryAr: 'المطعم والكافيه',
      date: '2026-10-08T18:45:00Z',
      amount: 950,
      paymentMethod: 'Cash at Counter',
      paymentMethodAr: 'نقداً في المطعم',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: '4 Family Meals, 2 Kids Burgers, Fresh Smoothies'
    },
    {
      id: '#EV-2094',
      service: 'Kids Birthday Party Suite Reservation',
      serviceAr: 'حجز جناح حفل عيد ميلاد أطفال',
      category: 'events',
      categoryAr: 'الحفلات والقاعات',
      date: '2026-09-28T16:00:00Z',
      amount: 1200,
      paymentMethod: 'InstaPay',
      paymentMethodAr: 'انستاباي',
      status: 'Completed',
      statusAr: 'مؤكد ومدفوع',
      items: 'Themed Decor, Mascot, 15 Cupcakes & Sound Setup'
    }
  ],
  'g-102': [
    {
      id: '#PZ-9102',
      service: 'Toddlers Soft Ball Pit & Carousel Pass',
      serviceAr: 'تذكرة منطقة الأطفال وحمام الكرات والدوار',
      category: 'playzone',
      categoryAr: 'منطقة الأطفال',
      date: '2026-10-08T16:50:00Z',
      amount: 320,
      paymentMethod: 'Vodafone Cash',
      paymentMethodAr: 'فودافون كاش',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: '1 Toddler Pass (Karma) + Free Mother Access'
    },
    {
      id: '#RES-5011',
      service: 'Fresh Mango Sunshine & Waffles Combo',
      serviceAr: 'سموذي مانجو طازج ووافل بالنوتيلا',
      category: 'restaurant',
      categoryAr: 'المطعم والكافيه',
      date: '2026-10-08T17:30:00Z',
      amount: 300,
      paymentMethod: 'Credit Card',
      paymentMethodAr: 'بطاقة بنكية',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: '2 Fresh Smoothies + Belgian Waffle'
    },
    {
      id: '#PZ-7820',
      service: 'Weekend Family Fun Park Pass',
      serviceAr: 'تذكرة فن بارك العائلية الأسبوعية',
      category: 'playzone',
      categoryAr: 'فن بارك',
      date: '2026-09-15T15:20:00Z',
      amount: 800,
      paymentMethod: 'InstaPay',
      paymentMethodAr: 'انستاباي',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: 'Bumper Cars, Carousel, Mini Train'
    }
  ],
  'g-103': [
    {
      id: '#PZ-9430',
      service: 'Challenge Zone 3 Passes (Omar, Malak, Hamza)',
      serviceAr: '٣ تذاكر منطقة التحدي وألعاب الواقع الافتراضي',
      category: 'playzone',
      categoryAr: 'منطقة التحدي',
      date: '2026-10-09T10:30:00Z',
      amount: 1050,
      paymentMethod: 'Credit Card (Mastercard)',
      paymentMethodAr: 'ماستركارد',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: 'VR Simulators, Tactical Laser Tag, PS5 Lounge'
    },
    {
      id: '#RES-6104',
      service: 'Gourmet Burger & Stone-Baked Pizza Feast',
      serviceAr: 'وجبة برجر فاخرة وبيتزا نابوليتانا عائلية',
      category: 'restaurant',
      categoryAr: 'المطعم والكافيه',
      date: '2026-10-09T13:15:00Z',
      amount: 1350,
      paymentMethod: 'Credit Card',
      paymentMethodAr: 'بطاقة ائتمان',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: '3 Brioche Burgers, 2 Large Pizzas, Soft Drinks'
    },
    {
      id: '#TR-1020',
      service: 'Friends & Family Adventure Trip Pass',
      serviceAr: 'باقة الرحلة الترفيهية والمغامرات',
      category: 'trips',
      categoryAr: 'الرحلات الترفيهية',
      date: '2026-09-20T11:00:00Z',
      amount: 2200,
      paymentMethod: 'Bank Transfer',
      paymentMethodAr: 'تحويل بنكي',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: 'Full Resort Access + Lunch Buffet (6 Persons)'
    }
  ],
  'g-104': [
    {
      id: '#PZ-9550',
      service: 'Kids Area Adventure Pass',
      serviceAr: 'تذكرة مغامرات منطقة الأطفال',
      category: 'playzone',
      categoryAr: 'منطقة الأطفال',
      date: '2026-10-09T12:15:00Z',
      amount: 450,
      paymentMethod: 'InstaPay',
      paymentMethodAr: 'انستاباي',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: '1 Child Pass (Adam) + Trampoline & Obstacle Course'
    },
    {
      id: '#RES-6220',
      service: 'Coffee & Artisanal Dessert Lounge',
      serviceAr: 'قهوة اسبريسو وحلويات فرنسية',
      category: 'restaurant',
      categoryAr: 'المطعم والكافيه',
      date: '2026-10-09T14:00:00Z',
      amount: 530,
      paymentMethod: 'Cash',
      paymentMethodAr: 'نقداً',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: '2 Caramel Macchiatos, San Sebastian Cheesecake'
    }
  ],
  'g-105': [
    {
      id: '#PZ-9620',
      service: 'High Ropes Suspension & VR Simulator Combo',
      serviceAr: 'باقة المسار المعلق ومحاكي VR (زينة وكريم)',
      category: 'playzone',
      categoryAr: 'منطقة المغامرات',
      date: '2026-10-09T18:45:00Z',
      amount: 900,
      paymentMethod: 'Mastercard',
      paymentMethodAr: 'ماستركارد',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: '2 Adventure Ropes Tickets + 4 VR Rides'
    },
    {
      id: '#EV-3180',
      service: 'Waterfront Family Gathering Reservation',
      serviceAr: 'حجز جلسة خاصة عائلية على البحيرة',
      category: 'events',
      categoryAr: 'الحفلات والقاعات',
      date: '2026-10-02T17:00:00Z',
      amount: 2100,
      paymentMethod: 'Credit Card',
      paymentMethodAr: 'بطاقة ائتمان',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: 'Private Terrace, VIP Service, Welcome Drinks'
    },
    {
      id: '#RES-5890',
      service: 'Mediterranean Seafood & Grill Dinner',
      serviceAr: 'عشاء مأكولات بحرية ومشاوي على الفحم',
      category: 'restaurant',
      categoryAr: 'المطعم والكافيه',
      date: '2026-10-02T20:30:00Z',
      amount: 750,
      paymentMethod: 'Cash',
      paymentMethodAr: 'نقداً',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: 'Grilled Fish Platter, Salads, Beverages'
    }
  ]
};

// Helper: Get transaction list for any guest
export const getGuestTransactions = (guest) => {
  if (!guest) return [];
  if (guest.transactions && guest.transactions.length > 0) {
    return guest.transactions;
  }
  if (DEFAULT_GUEST_TRANSACTIONS[guest._id]) {
    return DEFAULT_GUEST_TRANSACTIONS[guest._id];
  }
  return [
    {
      id: `#PZ-${Math.floor(1000 + (parseInt(guest._id?.replace(/\D/g, '') || '101') * 7) % 8999)}`,
      service: 'Play Zone Welcome Family Pass',
      serviceAr: 'تذكرة عائلية ترحيبية لمنطقة الألعاب',
      category: 'playzone',
      categoryAr: 'منطقة الألعاب',
      date: guest.createdAt || new Date().toISOString(),
      amount: 350,
      paymentMethod: 'Cash at Gate',
      paymentMethodAr: 'نقداً في المنتجع',
      status: 'Completed',
      statusAr: 'مدفوع ومكتمل',
      items: `${guest.children?.length || 1} Children Passes + Registration Promo`
    }
  ];
};

// Helper: Calculate total spent for a guest
export const calculateGuestSpent = (guest) => {
  const txs = getGuestTransactions(guest);
  return txs.reduce((sum, t) => sum + (t.amount || 0), 0);
};

// Initial Guests data matching mongoose schema
const INITIAL_GUESTS = [
  {
    _id: 'g-101',
    name: 'Mohamed Tarek',
    phone: '01012345678',
    age: '34',
    gender: 'male',
    createdAt: '2026-10-08T14:20:00Z',
    children: [
      { name: 'Youssef', age: '6', gender: 'male' },
      { name: 'Nour', age: '4', gender: 'female' }
    ],
    transactions: DEFAULT_GUEST_TRANSACTIONS['g-101']
  },
  {
    _id: 'g-102',
    name: 'Sarah Ahmed',
    phone: '01123456789',
    age: '29',
    gender: 'female',
    createdAt: '2026-10-08T16:45:00Z',
    children: [
      { name: 'Karma', age: '3', gender: 'female' }
    ],
    transactions: DEFAULT_GUEST_TRANSACTIONS['g-102']
  },
  {
    _id: 'g-103',
    name: 'Ahmed Mostafa',
    phone: '01234567890',
    age: '38',
    gender: 'male',
    createdAt: '2026-10-09T10:15:00Z',
    children: [
      { name: 'Omar', age: '9', gender: 'male' },
      { name: 'Malak', age: '7', gender: 'female' },
      { name: 'Hamza', age: '2', gender: 'male' }
    ],
    transactions: DEFAULT_GUEST_TRANSACTIONS['g-103']
  },
  {
    _id: 'g-104',
    name: 'Dina Mahmoud',
    phone: '01511223344',
    age: '31',
    gender: 'female',
    createdAt: '2026-10-09T12:00:00Z',
    children: [
      { name: 'Adam', age: '5', gender: 'male' }
    ],
    transactions: DEFAULT_GUEST_TRANSACTIONS['g-104']
  },
  {
    _id: 'g-105',
    name: 'Khaled Hassan',
    phone: '01099887766',
    age: '42',
    gender: 'male',
    createdAt: '2026-10-09T18:30:00Z',
    children: [
      { name: 'Zeina', age: '10', gender: 'female' },
      { name: 'Karim', age: '8', gender: 'male' }
    ],
    transactions: DEFAULT_GUEST_TRANSACTIONS['g-105']
  }
];

export default function GuestsManager({ lang = 'ar' }) {
  const isAr = lang === 'ar';

  const [guests, setGuests] = useState(() => {
    try {
      const saved = localStorage.getItem('ados_guests_directory');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure transactions array is attached
        return parsed.map(g => ({
          ...g,
          transactions: g.transactions && g.transactions.length > 0 
            ? g.transactions 
            : (DEFAULT_GUEST_TRANSACTIONS[g._id] || getGuestTransactions(g))
        }));
      }
    } catch (e) {
      console.warn('Could not read guests from storage:', e);
    }
    return INITIAL_GUESTS;
  });

  // Save to storage
  useEffect(() => {
    try {
      localStorage.setItem('ados_guests_directory', JSON.stringify(guests));
    } catch (e) {
      console.warn('Could not persist guests to storage:', e);
    }
  }, [guests]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all'); // 'all' | 'male' | 'female'
  const [hasChildrenFilter, setHasChildrenFilter] = useState('all'); // 'all' | 'yes' | 'no'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuestId, setEditingGuestId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'male',
    children: []
  });

  // Selected Guest for Family View Modal
  const [viewingGuest, setViewingGuest] = useState(null);
  const [viewModalTab, setViewModalTab] = useState('profile'); // 'profile' | 'transactions'
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txCategoryFilter, setTxCategoryFilter] = useState('all');

  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    return guests.filter(g => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || 
        g.name.toLowerCase().includes(q) || 
        g.phone.includes(q) ||
        g.children.some(c => c.name.toLowerCase().includes(q));

      const matchGender = genderFilter === 'all' || g.gender === genderFilter;
      const matchChildren = hasChildrenFilter === 'all' || 
        (hasChildrenFilter === 'yes' && g.children.length > 0) ||
        (hasChildrenFilter === 'no' && g.children.length === 0);

      return matchSearch && matchGender && matchChildren;
    });
  }, [guests, searchQuery, genderFilter, hasChildrenFilter]);

  // Stats
  const stats = useMemo(() => {
    const totalGuests = guests.length;
    const totalChildren = guests.reduce((sum, g) => sum + (g.children?.length || 0), 0);
    const maleGuests = guests.filter(g => g.gender === 'male').length;
    const femaleGuests = guests.filter(g => g.gender === 'female').length;
    const totalRevenue = guests.reduce((sum, g) => sum + calculateGuestSpent(g), 0);
    return { totalGuests, totalChildren, maleGuests, femaleGuests, totalRevenue };
  }, [guests]);

  // Handlers for Add/Edit
  const handleOpenAdd = () => {
    setEditingGuestId(null);
    setFormData({
      name: '',
      phone: '',
      age: '',
      gender: 'male',
      children: [{ name: '', age: '', gender: 'male' }]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guest) => {
    setEditingGuestId(guest._id);
    setFormData({
      name: guest.name || '',
      phone: guest.phone || '',
      age: guest.age || '',
      gender: guest.gender || 'male',
      children: guest.children && guest.children.length > 0 
        ? guest.children.map(c => ({ ...c }))
        : [{ name: '', age: '', gender: 'male' }]
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الضيف؟' : 'Are you sure you want to delete this guest?')) {
      setGuests(prev => prev.filter(g => g._id !== id));
      showToast(isAr ? 'تم حذف الضيف بنجاح' : 'Guest deleted successfully');
    }
  };

  const handleAddChildRow = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', age: '', gender: 'male' }]
    }));
  };

  const handleRemoveChildRow = (index) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  const handleChildChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.children];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, children: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.age.trim()) {
      alert(isAr ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    const cleanedChildren = formData.children.filter(c => c.name.trim() !== '');

    if (editingGuestId) {
      setGuests(prev => prev.map(g => {
        if (g._id === editingGuestId) {
          return {
            ...g,
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            age: formData.age.trim(),
            gender: formData.gender,
            children: cleanedChildren
          };
        }
        return g;
      }));
      showToast(isAr ? 'تم تحديث بيانات الضيف' : 'Guest updated successfully');
    } else {
      const newGuest = {
        _id: 'g-' + Date.now(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        age: formData.age.trim(),
        gender: formData.gender,
        children: cleanedChildren,
        createdAt: new Date().toISOString(),
        transactions: [
          {
            id: `#PZ-${Math.floor(1000 + Math.random() * 9000)}`,
            service: 'Play Zone Welcome Family Pass',
            serviceAr: 'تذكرة عائلية ترحيبية لمنطقة الألعاب',
            category: 'playzone',
            categoryAr: 'منطقة الألعاب',
            date: new Date().toISOString(),
            amount: 350,
            paymentMethod: 'Cash at Gate',
            paymentMethodAr: 'نقداً في المنتجع',
            status: 'Completed',
            statusAr: 'مدفوع ومكتمل',
            items: `${cleanedChildren.length || 1} Children Passes + Registration Promo`
          }
        ]
      };
      setGuests(prev => [newGuest, ...prev]);
      showToast(isAr ? 'تم تسجيل الضيف بنجاح' : 'New guest registered successfully');
    }

    setIsModalOpen(false);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Age', 'Gender', 'Children Count', 'Total Spent (EGP)', 'Registered Date'];
    const rows = filteredGuests.map(g => [
      g._id,
      `"${g.name}"`,
      `"${g.phone}"`,
      g.age,
      g.gender,
      g.children?.length || 0,
      calculateGuestSpent(g),
      new Date(g.createdAt || Date.now()).toISOString().split('T')[0]
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `guests_directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Active viewing guest transactions & spent calculations
  const activeGuestTransactions = useMemo(() => {
    if (!viewingGuest) return [];
    const allTxs = getGuestTransactions(viewingGuest);
    return allTxs.filter(tx => {
      const matchCat = txCategoryFilter === 'all' || tx.category === txCategoryFilter;
      const q = txSearchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      const matchQ = 
        tx.id.toLowerCase().includes(q) ||
        tx.service.toLowerCase().includes(q) ||
        (tx.serviceAr && tx.serviceAr.toLowerCase().includes(q)) ||
        (tx.items && tx.items.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [viewingGuest, txCategoryFilter, txSearchQuery]);

  const activeGuestTotalSpent = useMemo(() => {
    if (!viewingGuest) return 0;
    return calculateGuestSpent(viewingGuest);
  }, [viewingGuest]);

  const activeGuestAvgSpent = useMemo(() => {
    if (!viewingGuest) return 0;
    const txs = getGuestTransactions(viewingGuest);
    if (txs.length === 0) return 0;
    return Math.round(activeGuestTotalSpent / txs.length);
  }, [viewingGuest, activeGuestTotalSpent]);

  // Prepare comprehensive API data for GuestActivityDashboard
  const guestDashboardData = useMemo(() => {
    if (!viewingGuest) return null;
    
    // If viewing Ahmed Mahmoud or matching sample ID, return full sample API response
    if (viewingGuest._id === '6ac7f3f2a6e9e1dde4cdead1' || viewingGuest.name === 'أحمد محمود') {
      return SAMPLE_GUEST_API_RESPONSE;
    }

    const txs = getGuestTransactions(viewingGuest);
    const totalSpent = calculateGuestSpent(viewingGuest);
    
    const mappedTimeline = txs.map((t, idx) => {
      let catTheme = 'passes';
      let catAr = 'تذاكر وباقات PlayZone';
      let catEn = 'PlayZone Pass & Packages';
      if (t.category === 'restaurant') {
        catTheme = 'restaurant';
        catAr = 'طلب وجبات مطعم ودليفري';
        catEn = 'Restaurant Food & Delivery Order';
      } else if (t.category === 'trips') {
        catTheme = 'trips';
        catAr = 'حجز رحلة مدرسية / مجموعة';
        catEn = 'School & Group Trip Booking';
      } else if (t.category === 'events') {
        catTheme = 'events';
        catAr = 'حجز حفلات وقاعات';
        catEn = 'Events & Halls Booking';
      }

      return {
        id: t.id ? t.id.replace('#', '') : `tx-${idx}`,
        category: catTheme,
        categoryAr: t.categoryAr || catAr,
        categoryEn: catEn,
        code: t.id ? t.id.replace('#', '') : `AD-G-${1000 + idx}`,
        date: t.date || viewingGuest.createdAt || new Date().toISOString(),
        amount: t.amount || 0,
        currency: 'EGP',
        status: t.status === 'Completed' || t.status === 'confirmed' ? 'confirmed' : 'pending',
        paymentMethod: t.paymentMethod || 'Cash',
        paymentStatus: 'paid',
        title: isAr ? (t.serviceAr || t.service) : t.service,
        description: t.items || (isAr ? `معاملة بقيمة ${t.amount} ج.م` : `Transaction of ${t.amount} EGP`),
        raw: {
          orderCode: t.id ? t.id.replace('#', '') : `AD-G-${1000 + idx}`,
          items: t.items ? [{ nameAr: t.items, nameEn: t.items, quantity: 1, lineTotal: t.amount }] : []
        }
      };
    });

    return {
      success: true,
      message: 'تم جلب ملف الضيف الشامل وسجل المعاملات بنجاح',
      data: {
        guest: {
          _id: viewingGuest._id,
          name: viewingGuest.name,
          phone: viewingGuest.phone,
          email: viewingGuest.email || `${viewingGuest.phone}@americandream.eg`,
          age: viewingGuest.age,
          gender: viewingGuest.gender,
          role: 'guest',
          points: viewingGuest.points || Math.floor(totalSpent * 0.05),
          children: viewingGuest.children || [],
          isRegistered: true,
          createdAt: viewingGuest.createdAt || new Date().toISOString()
        },
        summary: {
          totalSpent: totalSpent,
          totalTransactionsCount: txs.length,
          purchases: {
            count: txs.filter(t => t.category === 'playzone').length,
            totalAmount: txs.filter(t => t.category === 'playzone').reduce((s, t) => s + (t.amount || 0), 0)
          },
          trips: {
            count: txs.filter(t => t.category === 'trips').length,
            totalAmount: txs.filter(t => t.category === 'trips').reduce((s, t) => s + (t.amount || 0), 0)
          },
          events: {
            count: txs.filter(t => t.category === 'events').length,
            totalAmount: txs.filter(t => t.category === 'events').reduce((s, t) => s + (t.amount || 0), 0)
          },
          tableReservations: { count: 0 },
          restaurantOrders: {
            count: txs.filter(t => t.category === 'restaurant').length,
            totalAmount: txs.filter(t => t.category === 'restaurant').reduce((s, t) => s + (t.amount || 0), 0)
          },
          pointsBalance: viewingGuest.points || Math.floor(totalSpent * 0.05),
          firstActivityDate: txs[txs.length - 1]?.date || viewingGuest.createdAt,
          lastActivityDate: txs[0]?.date || new Date().toISOString()
        },
        timeline: mappedTimeline.length > 0 ? mappedTimeline : SAMPLE_GUEST_API_RESPONSE.data.timeline
      }
    };
  }, [viewingGuest, isAr]);


  return (
    <div className={`gm-container ${isAr ? 'lang-ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="gm-toast">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="gm-header-row">
        <div>
          <h2 className="gm-title">{isAr ? 'دليل الضيوف وسجل المعاملات' : 'Guests Directory & Spent History'}</h2>
          <p className="gm-subtitle">
            {isAr 
              ? 'إدارة ملفات العائلات، الأطفال المسجلين، إجمالي الإنفاق، وتاريخ المعاملات التراكمي.' 
              : 'Manage family profiles, registered children, lifetime spent history, and transactions.'}
          </p>
        </div>

        <div className="gm-actions-row">
          <button type="button" className="gm-export-btn" onClick={handleExportCSV}>
            <Download size={15} />
            <span>{isAr ? 'تصدير كملف CSV' : 'Export CSV'}</span>
          </button>
          <button type="button" className="gm-add-btn" onClick={handleOpenAdd}>
            <UserPlus size={16} />
            <span>{isAr ? 'إضافة ضيف جديد' : 'Add New Guest'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="gm-stats-grid">
        <div className="gm-stat-card">
          <div className="gm-stat-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Users size={22} />
          </div>
          <div className="gm-stat-info">
            <span className="gm-stat-label">{isAr ? 'إجمالي الضيوف' : 'Total Guests'}</span>
            <span className="gm-stat-value">{stats.totalGuests}</span>
          </div>
        </div>

        <div className="gm-stat-card">
          <div className="gm-stat-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Baby size={22} />
          </div>
          <div className="gm-stat-info">
            <span className="gm-stat-label">{isAr ? 'الأطفال المسجلين' : 'Registered Children'}</span>
            <span className="gm-stat-value">{stats.totalChildren}</span>
          </div>
        </div>

        <div className="gm-stat-card">
          <div className="gm-stat-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
            <Wallet size={22} />
          </div>
          <div className="gm-stat-info">
            <span className="gm-stat-label">{isAr ? 'إجمالي إنفاق الضيوف' : 'Total Revenue / Spent'}</span>
            <span className="gm-stat-value">{stats.totalRevenue.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
          </div>
        </div>

        <div className="gm-stat-card">
          <div className="gm-stat-icon-wrap" style={{ background: '#f3e8ff', color: '#9333ea' }}>
            <Sparkles size={22} />
          </div>
          <div className="gm-stat-info">
            <span className="gm-stat-label">{isAr ? 'ذكور / إناث' : 'Male / Female'}</span>
            <span className="gm-stat-value">{stats.maleGuests} / {stats.femaleGuests}</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="gm-filter-bar">
        <div className="gm-search-wrap">
          <Search size={16} className="gm-search-icon" />
          <input 
            type="text" 
            className="gm-search-input"
            placeholder={isAr ? 'البحث بالاسم، رقم الهاتف، أو اسم الطفل...' : 'Search by name, phone, or child name...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="gm-clear-search" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="gm-filter-pills">
          <span className="gm-filter-label">{isAr ? 'النوع:' : 'Gender:'}</span>
          <button 
            type="button" 
            className={`gm-pill ${genderFilter === 'all' ? 'active' : ''}`}
            onClick={() => setGenderFilter('all')}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          <button 
            type="button" 
            className={`gm-pill ${genderFilter === 'male' ? 'active' : ''}`}
            onClick={() => setGenderFilter('male')}
          >
            {isAr ? 'ذكر' : 'Male'}
          </button>
          <button 
            type="button" 
            className={`gm-pill ${genderFilter === 'female' ? 'active' : ''}`}
            onClick={() => setGenderFilter('female')}
          >
            {isAr ? 'أنثى' : 'Female'}
          </button>

          <div className="gm-filter-divider" />

          <span className="gm-filter-label">{isAr ? 'أطفال:' : 'Children:'}</span>
          <button 
            type="button" 
            className={`gm-pill ${hasChildrenFilter === 'all' ? 'active' : ''}`}
            onClick={() => setHasChildrenFilter('all')}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          <button 
            type="button" 
            className={`gm-pill ${hasChildrenFilter === 'yes' ? 'active' : ''}`}
            onClick={() => setHasChildrenFilter('yes')}
          >
            {isAr ? 'لديهم أطفال' : 'With Kids'}
          </button>
        </div>
      </div>

      {/* Guests Table */}
      <div className="gm-table-card">
        {filteredGuests.length === 0 ? (
          <div className="gm-empty-state">
            <Users size={40} color="#94a3b8" />
            <p>{isAr ? 'لا يوجد ضيوف يطابقون معايير البحث' : 'No guests match the search criteria'}</p>
          </div>
        ) : (
          <table className="gm-table">
            <thead>
              <tr>
                <th>{isAr ? 'الضيف' : 'Guest'}</th>
                <th>{isAr ? 'رقم الهاتف' : 'Phone'}</th>
                <th>{isAr ? 'العمر' : 'Age'}</th>
                <th>{isAr ? 'النوع' : 'Gender'}</th>
                <th>{isAr ? 'الأطفال المسجلين' : 'Registered Children'}</th>
                <th>{isAr ? 'إجمالي الإنفاق' : 'Total Spent'}</th>
                <th>{isAr ? 'تاريخ التسجيل' : 'Date'}</th>
                <th>{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => {
                const initials = guest.name
                  .split(' ')
                  .filter(Boolean)
                  .map(w => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || 'G';

                const spentAmount = calculateGuestSpent(guest);
                const txCount = getGuestTransactions(guest).length;

                return (
                  <tr key={guest._id}>
                    <td>
                      <div className="gm-guest-cell">
                        <div className="gm-avatar" style={{ background: guest.gender === 'female' ? '#ec4899' : '#0284c7' }}>
                          {initials}
                        </div>
                        <div>
                          <div className="gm-guest-name">{guest.name}</div>
                          <div className="gm-guest-id">#{guest._id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="gm-phone-pill">
                        <Phone size={12} />
                        {guest.phone}
                      </span>
                    </td>
                    <td>{guest.age} {isAr ? 'سنة' : 'yrs'}</td>
                    <td>
                      <span className={`gm-gender-badge ${guest.gender}`}>
                        {guest.gender === 'male' ? (isAr ? 'ذكر' : 'Male') : (isAr ? 'أنثى' : 'Female')}
                      </span>
                    </td>
                    <td>
                      <div className="gm-children-chips">
                        {guest.children && guest.children.length > 0 ? (
                          guest.children.map((child, idx) => (
                            <span key={idx} className="gm-child-chip">
                              <span className="gm-child-emoji">{child.gender === 'female' ? '👧' : '👦'}</span>
                              <span className="gm-child-text">{child.name} ({child.age} {isAr ? 'سنة' : 'y'})</span>
                            </span>
                          ))
                        ) : (
                          <span className="gm-no-children">{isAr ? 'بدون أطفال' : 'No children'}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="gm-spent-badge-wrap">
                        <span className="gm-spent-amount">
                          {spentAmount.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                        </span>
                        <span className="gm-spent-count">
                          {txCount} {isAr ? 'معاملات' : 'txs'}
                        </span>
                      </div>
                    </td>
                    <td className="gm-date-cell">
                      {new Date(guest.createdAt || Date.now()).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      <div className="gm-actions-cell">
                        <button 
                          type="button" 
                          className="gm-icon-action view"
                          onClick={() => {
                            setViewingGuest(guest);
                            setViewModalTab('profile');
                            setTxSearchQuery('');
                            setTxCategoryFilter('all');
                          }}
                          title={isAr ? 'عرض تفاصيل الضيف وسجل المعاملات' : 'View Guest & Spent History'}
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          type="button" 
                          className="gm-icon-action edit"
                          onClick={() => handleOpenEdit(guest)}
                          title={isAr ? 'تعديل بيانات الضيف' : 'Edit Guest'}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          type="button" 
                          className="gm-icon-action delete"
                          onClick={() => handleDelete(guest._id)}
                          title={isAr ? 'حذف الضيف' : 'Delete Guest'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Add or Edit Guest */}
      {isModalOpen && (
        <div className="gm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="gm-modal-card" onClick={e => e.stopPropagation()}>
            <div className="gm-modal-header">
              <h3>{editingGuestId ? (isAr ? 'تعديل بيانات الضيف' : 'Edit Guest Details') : (isAr ? 'إضافة ضيف جديد' : 'Add New Guest')}</h3>
              <button type="button" className="gm-modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="gm-form">
              <div className="gm-form-row">
                <div className="gm-form-group">
                  <label>{isAr ? 'الاسم الكامل *' : 'Full Name *'}</label>
                  <input 
                    type="text" 
                    required 
                    placeholder={isAr ? 'مثال: أحمد محمد' : 'e.g. Ahmed Mohamed'}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="gm-form-group">
                  <label>{isAr ? 'رقم الهاتف *' : 'Phone Number *'}</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="010XXXXXXXX"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="gm-form-row">
                <div className="gm-form-group">
                  <label>{isAr ? 'العمر *' : 'Age *'}</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="30"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>

                <div className="gm-form-group">
                  <label>{isAr ? 'النوع *' : 'Gender *'}</label>
                  <select 
                    value={formData.gender} 
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="male">{isAr ? 'ذكر' : 'Male'}</option>
                    <option value="female">{isAr ? 'أنثى' : 'Female'}</option>
                  </select>
                </div>
              </div>

              {/* Children Section */}
              <div className="gm-children-section">
                <div className="gm-children-head">
                  <label>{isAr ? 'الأطفال المسجلين (مخطط Mongoose)' : 'Registered Children (Mongoose Schema)'}</label>
                  <button 
                    type="button" 
                    className="gm-add-child-btn"
                    onClick={handleAddChildRow}
                  >
                    + {isAr ? 'إضافة طفل' : 'Add Child'}
                  </button>
                </div>

                {formData.children.length === 0 ? (
                  <p className="gm-no-children-hint">{isAr ? 'لا يوجد أطفال مضافين حالياً.' : 'No children added yet.'}</p>
                ) : (
                  formData.children.map((child, idx) => (
                    <div key={idx} className="gm-child-input-row">
                      <input 
                        type="text" 
                        placeholder={isAr ? 'اسم الطفل' : 'Child name'}
                        value={child.name}
                        onChange={e => handleChildChange(idx, 'name', e.target.value)}
                        required
                      />
                      <input 
                        type="number" 
                        placeholder={isAr ? 'العمر' : 'Age'}
                        value={child.age}
                        onChange={e => handleChildChange(idx, 'age', e.target.value)}
                        style={{ width: '80px' }}
                        required
                      />
                      <select 
                        value={child.gender} 
                        onChange={e => handleChildChange(idx, 'gender', e.target.value)}
                        style={{ width: '100px' }}
                      >
                        <option value="male">{isAr ? 'ولد' : 'Boy'}</option>
                        <option value="female">{isAr ? 'بنت' : 'Girl'}</option>
                      </select>
                      <button 
                        type="button" 
                        className="gm-remove-child-btn"
                        onClick={() => handleRemoveChildRow(idx)}
                        title={isAr ? 'حذف الطفل' : 'Remove child'}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="gm-modal-footer">
                <button type="button" className="gm-btn-cancel" onClick={() => setIsModalOpen(false)}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="gm-btn-submit">
                  {editingGuestId ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'تسجيل الضيف' : 'Register Guest')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Comprehensive Guest Profile & Activity Dashboard */}
      {viewingGuest && (
        <div className="gm-modal-overlay" onClick={() => setViewingGuest(null)}>
          <div 
            className="gm-modal-card gm-view-dashboard-modal" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: '1150px', 
              width: '95vw', 
              maxHeight: '92vh', 
              overflowY: 'auto', 
              padding: '1.25rem', 
              borderRadius: '20px',
              background: '#f8fafc'
            }}
          >
            <GuestActivityDashboard
              apiData={guestDashboardData || SAMPLE_GUEST_API_RESPONSE}
              lang={lang}
              onClose={() => setViewingGuest(null)}
              onEditProfile={() => {
                const toEdit = viewingGuest;
                setViewingGuest(null);
                handleOpenEdit(toEdit);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
