import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  RotateCw, 
  Download, 
  Search, 
  CheckCircle2, 
  X, 
  Printer, 
  CalendarClock, 
  Ban, 
  SlidersHorizontal,
  CreditCard,
  Phone,
  User,
  Check
} from 'lucide-react';
import './PlayZoneOrders.css';

// Initial realistic bookings matching media_1791458846720
const INITIAL_PZ_ORDERS = [
  {
    id: '#PZ-8942',
    rawId: 'PZ-8942',
    name: 'Ahmed Mohamed',
    phone: '+20 101 234 5678',
    avatarInitials: 'AM',
    avatarColor: 'cyan',
    ticketsCount: 4,
    amount: 650,
    amountFormatted: '650 EGP',
    status: 'Confirmed',
    date: 'Fri, Oct 24, 2026',
    timeSlot: '03:30 PM – 07:30 PM',
    duration: '4-Hour Unlimited Pass',
    zone: 'Fun Park & Playground',
    points: '1,350 Dream Points accumulated',
    paymentMethod: 'Visa Debit • Trans ID #TXN-99412',
    items: [
      {
        qty: '2x',
        type: 'cyan',
        title: 'Fun Park All-Access Pass (Adult)',
        desc: 'Includes Arcade credits & Waterfront Bumper Cars',
        price: '400 EGP'
      },
      {
        qty: '2x',
        type: 'peach',
        title: 'Kids Sensory Playground & Trampoline (Child)',
        desc: 'Includes non-slip socks & VR simulation simulator add-on',
        price: '250 EGP'
      }
    ]
  },
  {
    id: '#PZ-8941',
    rawId: 'PZ-8941',
    name: 'Mahmoud El-Sayed',
    phone: '+20 114 882 1902',
    avatarInitials: 'ME',
    avatarColor: 'peach',
    ticketsCount: 3,
    amount: 450,
    amountFormatted: '450 EGP',
    status: 'Processing',
    date: 'Fri, Oct 24, 2026',
    timeSlot: '04:00 PM – 08:00 PM',
    duration: '4-Hour Unlimited Pass',
    zone: 'Challenge Zone',
    points: '920 Dream Points accumulated',
    paymentMethod: 'Vodafone Cash • Trans ID #VF-77123',
    items: [
      {
        qty: '3x',
        type: 'cyan',
        title: 'Challenge Zone All-Access Pass',
        desc: 'Includes VR Headsets & Arcade Pass',
        price: '450 EGP'
      }
    ]
  },
  {
    id: '#PZ-8936',
    rawId: 'PZ-8936',
    name: 'Kareem Fawzy',
    phone: '+20 128 765 4321',
    avatarInitials: 'KF',
    avatarColor: 'peach',
    ticketsCount: 6,
    amount: 1100,
    amountFormatted: '1,100 EGP',
    status: 'Confirmed',
    date: 'Fri, Oct 24, 2026',
    timeSlot: '02:00 PM – 06:00 PM',
    duration: '4-Hour Unlimited Pass',
    zone: 'Kids Area + Fun Park',
    points: '2,400 Dream Points accumulated',
    paymentMethod: 'Mastercard • Trans ID #TXN-55210',
    items: [
      {
        qty: '4x',
        type: 'cyan',
        title: 'Kids Unlimited All-Day Wristband',
        desc: 'Ball pit, high ropes, slides and coloring session',
        price: '700 EGP'
      },
      {
        qty: '2x',
        type: 'peach',
        title: 'Parent Seaside Lounge & Refreshment Pass',
        desc: 'Includes unlimited premium hot beverages',
        price: '400 EGP'
      }
    ]
  },
  {
    id: '#PZ-8930',
    rawId: 'PZ-8930',
    name: 'Sara Nabil',
    phone: '+20 100 554 9912',
    avatarInitials: 'SN',
    avatarColor: 'cyan',
    ticketsCount: 2,
    amount: 300,
    amountFormatted: '300 EGP',
    status: 'Processing',
    date: 'Fri, Oct 24, 2026',
    timeSlot: '05:00 PM – 09:00 PM',
    duration: '4-Hour Unlimited Pass',
    zone: 'Kids Area',
    points: '450 Dream Points accumulated',
    paymentMethod: 'InstaPay • Trans ID #IP-19042',
    items: [
      {
        qty: '2x',
        type: 'peach',
        title: 'Sisters Midweek Adventure Pass',
        desc: 'Includes coloring workshop and gyro slides',
        price: '300 EGP'
      }
    ]
  },
  {
    id: '#PZ-8928',
    rawId: 'PZ-8928',
    name: 'Omar Abdelrahman',
    phone: '+20 109 432 1199',
    avatarInitials: 'OA',
    avatarColor: 'cyan',
    ticketsCount: 5,
    amount: 850,
    amountFormatted: '850 EGP',
    status: 'Completed',
    date: 'Fri, Oct 24, 2026',
    timeSlot: '11:00 AM – 03:00 PM',
    duration: '4-Hour Unlimited Pass',
    zone: 'Adventure Zone',
    points: '1,800 Dream Points accumulated',
    paymentMethod: 'Visa Debit • Trans ID #TXN-88123',
    items: [
      {
        qty: '5x',
        type: 'cyan',
        title: 'High Ropes & Zip Line Pass',
        desc: 'Safety harness and climbing certified instructor',
        price: '850 EGP'
      }
    ]
  },
  {
    id: '#PZ-8924',
    rawId: 'PZ-8924',
    name: 'Nour El-Din',
    phone: '+20 115 677 8822',
    avatarInitials: 'NE',
    avatarColor: 'peach',
    ticketsCount: 4,
    amount: 600,
    amountFormatted: '600 EGP',
    status: 'Confirmed',
    date: 'Fri, Oct 24, 2026',
    timeSlot: '01:00 PM – 05:00 PM',
    duration: '4-Hour Unlimited Pass',
    zone: 'Fun Park',
    points: '1,120 Dream Points accumulated',
    paymentMethod: 'Cash at Reception',
    items: [
      {
        qty: '4x',
        type: 'cyan',
        title: 'Carousel & Bumper Car Combo',
        desc: 'Unlimited rides in kinetic fun zone',
        price: '600 EGP'
      }
    ]
  },
  {
    id: '#PZ-8919',
    rawId: 'PZ-8919',
    name: 'Hossam Ali',
    phone: '+20 102 334 5566',
    avatarInitials: 'HA',
    avatarColor: 'peach',
    ticketsCount: 1,
    amount: 150,
    amountFormatted: '150 EGP',
    status: 'Cancelled',
    date: 'Fri, Oct 24, 2026',
    timeSlot: '06:00 PM – 10:00 PM',
    duration: '4-Hour Unlimited Pass',
    zone: 'Challenge Zone',
    points: '310 Dream Points accumulated',
    paymentMethod: 'Cancelled / Refunded',
    items: [
      {
        qty: '1x',
        type: 'cyan',
        title: 'Laser & Tactical Arena Pass',
        desc: 'Single tactical match pass',
        price: '150 EGP'
      }
    ]
  }
];

export default function PlayZoneOrdersView({ onSwitchToTrips }) {
  const [orders, setOrders] = useState(INITIAL_PZ_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'processing' | 'completed' | 'cancelled'
  const [zoneFilter, setZoneFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [syncStatus, setSyncStatus] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Load any user bookings from localStorage to make live sync real
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kids_area_reservations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped = parsed.map(item => ({
            id: `#${item.id || item.refNumber || 'PZ-9999'}`,
            rawId: item.id || item.refNumber || 'PZ-9999',
            name: item.childName ? `${item.childName} (${item.parentName || 'Guest'})` : (item.parentName || 'Guest'),
            phone: item.parentPhone || '+20 100 000 0000',
            avatarInitials: (item.childName || item.parentName || 'G').slice(0, 2).toUpperCase(),
            avatarColor: 'cyan',
            ticketsCount: item.guests || item.kids || 4,
            amount: item.totalPrice || item.basePrice || 650,
            amountFormatted: `${(item.totalPrice || item.basePrice || 650).toLocaleString()} EGP`,
            status: item.status || 'Confirmed',
            date: item.dateFormatted || item.date || 'Fri, Oct 24, 2026',
            timeSlot: item.timeSlot || '04:00 PM – 07:30 PM',
            duration: 'Celebration & Play Zone Pass',
            zone: item.venue || 'Events & Play Zone',
            points: '2,250 Dream Points accumulated',
            paymentMethod: item.paymentMethod === 'card' ? 'Visa Debit • Online' : 'Cash at Venue',
            items: [
              {
                qty: `${item.guests || 4}x`,
                type: 'cyan',
                title: item.packageName || 'Birthday & Play Zone Experience',
                desc: `${item.venue || 'Indoor'} • ${item.theme || 'Special Theme'}`,
                price: `${(item.basePrice || 650).toLocaleString()} EGP`
              }
            ]
          }));
          
          setOrders(prev => {
            const combined = [...mapped, ...INITIAL_PZ_ORDERS];
            // Deduplicate by ID
            const seen = new Set();
            return combined.filter(o => {
              if (seen.has(o.id)) return false;
              seen.add(o.id);
              return true;
            });
          });
        }
      }
    } catch {}
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSyncStatus('Just now');
    }, 500);
  };

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Tickets', 'Total Amount', 'Status', 'Date', 'Time Slot', 'Zone'];
    const rows = orders.map(o => [
      o.id,
      `"${o.name}"`,
      `"${o.phone}"`,
      o.ticketsCount,
      o.amount,
      o.status,
      `"${o.date}"`,
      `"${o.timeSlot}"`,
      `"${o.zone}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PlayZone_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredOrders = orders.filter(order => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      order.name.toLowerCase().includes(q) ||
      order.phone.includes(q) ||
      order.id.toLowerCase().includes(q);

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'processing' && order.status === 'Processing') ||
      (statusFilter === 'completed' && order.status === 'Completed') ||
      (statusFilter === 'cancelled' && order.status === 'Cancelled');

    const matchesZone = zoneFilter === 'All' || order.zone.toLowerCase().includes(zoneFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesZone;
  });

  // Status Counts
  const countProcessing = orders.filter(o => o.status === 'Processing').length;
  const countCompleted = orders.filter(o => o.status === 'Completed').length;
  const countCancelled = orders.filter(o => o.status === 'Cancelled').length;

  // Print voucher handler
  const handlePrint = () => {
    window.print();
  };

  // Reschedule handler
  const handleReschedule = (orderId) => {
    const newDate = prompt('Enter new scheduled date (e.g. Saturday, Oct 25, 2026):');
    if (newDate) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, date: newDate } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, date: newDate }));
      }
      alert('Order successfully rescheduled to ' + newDate);
    }
  };

  // Cancel order handler
  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: 'Cancelled' }));
      }
    }
  };

  return (
    <div className="pzo-page-container">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. Page Header & Actions                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="pzo-header-row">
        <div className="pzo-title-group">
          <h1 className="pzo-page-title">Play Zone Orders</h1>
          <p className="pzo-page-subtitle">
            Monitor, review, and manage real-time guest ticket bookings and family activity admissions across all experiential zones.
          </p>
        </div>

        <div className="pzo-top-actions">
          <div className="pzo-sync-pill">
            <span className="pzo-live-dot"></span>
            <span>Live Sync: {syncStatus}</span>
          </div>

          <button type="button" className="pzo-btn-refresh" onClick={handleRefresh}>
            <RotateCw size={15} className={isRefreshing ? 'spin-anim' : ''} />
            <span>Refresh Data</span>
          </button>

          <button type="button" className="pzo-btn-export" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Export CSV / Report</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. 4 KPI Stat Cards (Matching media_1791458846720)                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="pzo-kpi-grid">
        
        {/* Card 1: Total Bookings */}
        <div className="pzo-kpi-card">
          <div className="pzo-kpi-top-row">
            <div className="pzo-kpi-icon-wrap">
              <Ticket size={18} />
            </div>
            <div className="pzo-kpi-badge">↗ +12.4%</div>
          </div>
          <div className="pzo-kpi-label">TOTAL BOOKINGS</div>
          <div className="pzo-kpi-val-row">
            <span className="pzo-kpi-val">1,428</span>
            <span className="pzo-kpi-val-sub">vs last week</span>
          </div>
          <div className="pzo-kpi-footer">
            <span className="pzo-kpi-dot"></span>
            <span>Total verified guest bookings</span>
          </div>
        </div>

        {/* Card 2: Today's Bookings */}
        <div className="pzo-kpi-card">
          <div className="pzo-kpi-top-row">
            <div className="pzo-kpi-icon-wrap">
              <Calendar size={18} />
            </div>
            <div className="pzo-kpi-badge">↗ +18 today</div>
          </div>
          <div className="pzo-kpi-label">TODAY'S BOOKINGS</div>
          <div className="pzo-kpi-val-row">
            <span className="pzo-kpi-val">86</span>
            <span className="pzo-kpi-val-sub">sessions queued</span>
          </div>
          <div className="pzo-kpi-footer">
            <span className="pzo-kpi-dot"></span>
            <span>Bookings scheduled for today</span>
          </div>
        </div>

        {/* Card 3: Total Tickets Booked */}
        <div className="pzo-kpi-card">
          <div className="pzo-kpi-top-row">
            <div className="pzo-kpi-icon-wrap">
              <Ticket size={18} />
            </div>
            <div className="pzo-kpi-badge">Avg 3.6 / booking</div>
          </div>
          <div className="pzo-kpi-label">TOTAL TICKETS BOOKED</div>
          <div className="pzo-kpi-val-row">
            <span className="pzo-kpi-val">312</span>
            <span className="pzo-kpi-val-sub">wristbands</span>
          </div>
          <div className="pzo-kpi-footer">
            <span className="pzo-kpi-dot"></span>
            <span>Total tickets booked today</span>
          </div>
        </div>

        {/* Card 4: Today's Revenue */}
        <div className="pzo-kpi-card">
          <div className="pzo-kpi-top-row">
            <div className="pzo-kpi-icon-wrap">
              <CreditCard size={18} />
            </div>
            <div className="pzo-kpi-badge">↗ +15.2% vs target</div>
          </div>
          <div className="pzo-kpi-label">TODAY'S REVENUE</div>
          <div className="pzo-kpi-val-row">
            <span className="pzo-kpi-val">48,650</span>
            <span className="pzo-kpi-val-sub">EGP</span>
          </div>
          <div className="pzo-kpi-footer">
            <span className="pzo-kpi-dot"></span>
            <span>Total booking value today</span>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. Dark Navy Filter Bar (Matching media_1791458846720)              */}
      {/* ------------------------------------------------------------------ */}
      <div className="pzo-filter-card">
        
        {/* Top Row: Search + Date Filter + Portal Filter */}
        <div className="pzo-filter-top-row">
          <div className="pzo-search-input-wrap">
            <Search size={16} className="pzo-search-icon" />
            <input 
              type="text"
              placeholder="Search by customer name, phone, or order ID (e.g. #PZ-8921)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pzo-search-input"
            />
          </div>

          <div className="pzo-filter-select-btn">
            <span>Today (Oct 24, 2026)</span>
            <Calendar size={15} />
          </div>

          <div className="pzo-filter-select-btn" onClick={() => setZoneFilter(prev => prev === 'All' ? 'Fun' : prev === 'Fun' ? 'Challenge' : 'All')}>
            <span>{zoneFilter === 'All' ? 'All Zones (All 4 Portals)' : `${zoneFilter} Zone`}</span>
            <SlidersHorizontal size={15} />
          </div>
        </div>

        {/* Bottom Row: Status Tabs + Count Hint */}
        <div className="pzo-filter-bottom-row">
          <div className="pzo-status-pills">
            <button 
              type="button" 
              className={`pzo-status-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Statuses ({orders.length})
            </button>
            
            <button 
              type="button" 
              className={`pzo-status-tab ${statusFilter === 'processing' ? 'active' : ''}`}
              onClick={() => setStatusFilter('processing')}
            >
              Processing ({countProcessing || 62})
            </button>

            <button 
              type="button" 
              className={`pzo-status-tab ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Completed ({countCompleted || 18})
            </button>

            <button 
              type="button" 
              className={`pzo-status-tab cancel ${statusFilter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setStatusFilter('cancelled')}
            >
              Cancelled ({countCancelled || 6})
            </button>
          </div>

          <div className="pzo-filter-count-hint">
            Showing {filteredOrders.length} bookings for today
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Orders Table (Matching media_1791458846720)                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="pzo-table-card">
        <table className="pzo-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>CUSTOMER &amp; PROFILE</th>
              <th>TICKETS BOOKED</th>
              <th>TOTAL AMOUNT</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  No bookings found matching your search or filter.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isConfirmed = order.status === 'Confirmed' || order.status === 'Completed';
                const isProcessing = order.status === 'Processing';
                const isCancelled = order.status === 'Cancelled';

                return (
                  <tr key={order.id}>
                    {/* Order ID */}
                    <td>
                      <div className="pzo-order-id-cell">
                        <span className="pzo-hash-icon">#</span>
                        <span>{order.id}</span>
                      </div>
                    </td>

                    {/* Customer & Profile */}
                    <td>
                      <div className="pzo-profile-cell">
                        <div className={`pzo-avatar ${order.avatarColor}`}>
                          {order.avatarInitials}
                        </div>
                        <div className="pzo-profile-info">
                          <span className="pzo-profile-name">{order.name}</span>
                          <span className="pzo-profile-phone">
                            <Phone size={11} />
                            {order.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tickets Booked */}
                    <td>
                      <div className="pzo-tickets-cell">
                        <Ticket size={15} color="#00a8cc" />
                        <span>{order.ticketsCount} Tickets</span>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td>
                      <div className="pzo-amount-cell">
                        {order.amount.toLocaleString()} <small>EGP</small>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`pzo-status-pill ${
                        isConfirmed ? 'confirmed' : isProcessing ? 'processing' : 'cancelled'
                      }`}>
                        ● {order.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td>
                      <button 
                        type="button" 
                        className="pzo-view-btn"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <span>VIEW</span>
                        <span>&gt;</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div className="pzo-pagination-bar">
          <div className="pzo-pagination-info">
            Showing 1 - {Math.min(7, filteredOrders.length)} of {orders.length} bookings recorded today
          </div>

          <div className="pzo-pagination-controls">
            <button 
              type="button" 
              className="pzo-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              &lt;
            </button>
            <button type="button" className={`pzo-page-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
            <button type="button" className={`pzo-page-btn ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>2</button>
            <button type="button" className={`pzo-page-btn ${currentPage === 3 ? 'active' : ''}`} onClick={() => setCurrentPage(3)}>3</button>
            <span style={{ color: '#94a3b8', padding: '0 4px' }}>...</span>
            <button type="button" className="pzo-page-btn" onClick={() => setCurrentPage(13)}>13</button>
            <button 
              type="button" 
              className="pzo-page-btn"
              disabled={currentPage === 13}
              onClick={() => setCurrentPage(prev => Math.min(13, prev + 1))}
            >
              &gt;
            </button>
          </div>
        </div>

      </div>

      {/* ================================================================== */}
      {/* 5. BOOKING DETAILS MODAL (Exact match to media_1791458846728)      */}
      {/* ================================================================== */}
      {selectedOrder && (
        <div className="pzo-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="pzo-modal-window" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="pzo-modal-header">
              <div className="pzo-modal-header-left">
                <div className="pzo-modal-header-icon">
                  <Ticket size={22} />
                </div>
                <div>
                  <h3 className="pzo-modal-title">
                    Booking Details <span>{selectedOrder.id}</span>
                  </h3>
                  <div className="pzo-modal-subtitle">
                    GATE ACCESS PASS • ISMAILIA LAGOON HUB
                  </div>
                </div>
              </div>

              <div className="pzo-modal-header-right">
                <span className={`pzo-status-pill ${
                  selectedOrder.status === 'Confirmed' || selectedOrder.status === 'Completed'
                    ? 'confirmed'
                    : selectedOrder.status === 'Processing'
                    ? 'processing'
                    : 'cancelled'
                }`}>
                  ● {selectedOrder.status}
                </span>

                <button 
                  type="button" 
                  className="pzo-modal-close-btn"
                  onClick={() => setSelectedOrder(null)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="pzo-modal-content">
              
              {/* SECTION: GUEST PROFILE */}
              <div>
                <div className="pzo-modal-section-title">GUEST PROFILE</div>
                <div className="pzo-guest-profile-grid">
                  <div>
                    <div className="pzo-guest-field-label">Full Name</div>
                    <div className="pzo-guest-field-val">{selectedOrder.name}</div>
                  </div>

                  <div>
                    <div className="pzo-guest-field-label">Phone Contact</div>
                    <div className="pzo-guest-field-val">
                      <span>{selectedOrder.phone}</span>
                      <CheckCircle2 size={16} className="pzo-verified-badge" />
                    </div>
                  </div>
                </div>

                <div className="pzo-loyalty-row">
                  <div className="pzo-guest-field-label">Loyalty Rewards</div>
                  <div className="pzo-loyalty-text">
                    {selectedOrder.points || '1,350 Dream Points accumulated'}
                  </div>
                </div>
              </div>

              {/* SECTION: TIME & ADMISSION GATEWAY */}
              <div>
                <div className="pzo-modal-section-title">TIME &amp; ADMISSION GATEWAY</div>
                <div className="pzo-admission-grid">
                  
                  <div className="pzo-admission-box">
                    <div className="pzo-admission-icon-box">
                      <Calendar size={18} />
                    </div>
                    <div className="pzo-admission-details">
                      <span className="pzo-admission-label">Scheduled Date</span>
                      <span className="pzo-admission-val">{selectedOrder.date}</span>
                    </div>
                  </div>

                  <div className="pzo-admission-box">
                    <div className="pzo-admission-icon-box">
                      <Clock size={18} />
                    </div>
                    <div className="pzo-admission-details">
                      <span className="pzo-admission-label">Arrival Window</span>
                      <span className="pzo-admission-val">{selectedOrder.timeSlot}</span>
                      <span className="pzo-admission-sub">{selectedOrder.duration}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION: BOOKED ITEMS & ADD-ONS */}
              <div>
                <div className="pzo-modal-section-title">BOOKED ITEMS &amp; ADD-ONS</div>
                <div className="pzo-booked-items-list">
                  {selectedOrder.items && selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="pzo-booked-item-card">
                      <div className="pzo-item-left">
                        <div className={`pzo-item-qty-pill ${it.type || (idx % 2 === 0 ? 'cyan' : 'peach')}`}>
                          {it.qty}
                        </div>
                        <div>
                          <div className="pzo-item-title">{it.title}</div>
                          <div className="pzo-item-sub">{it.desc}</div>
                        </div>
                      </div>
                      <div className="pzo-item-price">{it.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: FINANCIAL BREAKDOWN */}
              <div className="pzo-pricing-box">
                <div className="pzo-modal-price-line">
                  <span>Subtotal ({selectedOrder.ticketsCount} items)</span>
                  <span>{selectedOrder.amountFormatted}</span>
                </div>

                <div className="pzo-modal-price-line">
                  <span>Loyalty Points Discount</span>
                  <span>-0 EGP</span>
                </div>

                <div className="pzo-modal-price-line waived">
                  <span>Online Processing / Service Fee</span>
                  <span>Waived (Promotional)</span>
                </div>

                <div className="pzo-modal-total-line">
                  <div>
                    <span className="pzo-modal-total-label">Total Paid</span>
                    <div className="pzo-modal-pay-meta">
                      {selectedOrder.paymentMethod}
                    </div>
                  </div>
                  <span className="pzo-modal-total-val">{selectedOrder.amountFormatted}</span>
                </div>
              </div>

            </div>

            {/* Modal Actions Footer Bar (media_1791458846728) */}
            <div className="pzo-modal-actions-bar">
              <button 
                type="button" 
                className="pzo-btn-teal"
                onClick={() => handleReschedule(selectedOrder.id)}
              >
                <CalendarClock size={16} />
                <span>Reschedule</span>
              </button>

              <button 
                type="button" 
                className="pzo-btn-teal"
                onClick={handlePrint}
              >
                <Printer size={16} />
                <span>Print</span>
              </button>

              <button 
                type="button" 
                className="pzo-btn-cancel-outline"
                onClick={() => handleCancelOrder(selectedOrder.id)}
              >
                <Ban size={16} />
                <span>Cancel</span>
              </button>

              <button 
                type="button" 
                className="pzo-btn-done"
                onClick={() => setSelectedOrder(null)}
              >
                DONE
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
