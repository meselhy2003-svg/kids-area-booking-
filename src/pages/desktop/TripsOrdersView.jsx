import React, { useState } from 'react';
import { 
  Calendar, 
  RotateCw, 
  Download, 
  Search, 
  Phone, 
  Printer, 
  ArrowLeft, 
  Building2, 
  Users, 
  Package, 
  Sparkles, 
  Utensils, 
  Coffee, 
  Clock, 
  CalendarClock, 
  Ban, 
  Check 
} from 'lucide-react';
import './PlayZoneOrders.css';

const INITIAL_TRIP_ORDERS = [
  {
    id: '#PZ-8942',
    tripRef: '#TR-10482',
    name: 'Ahmed Mohamed',
    phone: '+20 101 234 5678',
    avatarInitials: 'AM',
    avatarColor: 'cyan',
    organization: 'Future School',
    orgType: 'School',
    childrenCount: 85,
    supervisorsCount: 8,
    ageGroup: '8 – 11 Years (Primary Stage)',
    packageName: 'Full Day Explorer & Adventure Package',
    pricePerChild: '350 EGP',
    selectedAreas: ['Kids Adventure Area', 'Challenge Zone & VR Simulators', 'Kinetic Fun Park'],
    buffetDetails: 'Reserved Lunch Buffet (Kids Meals + Supervisor Dining, 1:00 PM)',
    hospitalityDetails: 'Complimentary Welcome Coffee & Refreshments Bar (Reserved for School Supervisors & Chaperones)',
    visitDate: 'Thursday, November 12, 2026',
    arrivalTime: '09:30 AM',
    duration: '5.5 Hours',
    operatingWindow: '09:30 AM – 03:00 PM (Scheduled Departure)',
    status: 'Confirmed'
  },
  {
    id: '#PZ-8941',
    tripRef: '#TR-10481',
    name: 'Mahmoud El-Sayed',
    phone: '+20 114 882 1902',
    avatarInitials: 'ME',
    avatarColor: 'peach',
    organization: 'Modern Language Academy',
    orgType: 'Academy',
    childrenCount: 65,
    supervisorsCount: 6,
    ageGroup: '6 – 9 Years (Early Primary)',
    packageName: 'Half Day Adventure & Play Package',
    pricePerChild: '280 EGP',
    selectedAreas: ['Kids Adventure Area', 'Kinetic Fun Park'],
    buffetDetails: 'Kids Snack Box + Unlimited Juices (12:30 PM)',
    hospitalityDetails: 'Espresso & Tea Bar for Supervisors',
    visitDate: 'Sunday, November 15, 2026',
    arrivalTime: '10:00 AM',
    duration: '4.0 Hours',
    operatingWindow: '10:00 AM – 02:00 PM (Scheduled Departure)',
    status: 'Processing'
  },
  {
    id: '#PZ-8936',
    tripRef: '#TR-10479',
    name: 'Kareem Fawzy',
    phone: '+20 128 765 4321',
    avatarInitials: 'KF',
    avatarColor: 'peach',
    organization: 'El-Rowad International Academy',
    orgType: 'International School',
    childrenCount: 120,
    supervisorsCount: 12,
    ageGroup: '10 – 14 Years (Middle School)',
    packageName: 'VIP Full Resort Takeover Trip',
    pricePerChild: '450 EGP',
    selectedAreas: ['Kids Adventure Area', 'Challenge Zone & VR Simulators', 'Kinetic Fun Park', 'Laser Arena'],
    buffetDetails: 'Premium Grilled Feast Buffet + Dessert Station (1:30 PM)',
    hospitalityDetails: 'VIP Lounge Access + Barista Coffee Bar',
    visitDate: 'Wednesday, November 18, 2026',
    arrivalTime: '09:00 AM',
    duration: '6.0 Hours',
    operatingWindow: '09:00 AM – 03:00 PM (Scheduled Departure)',
    status: 'Confirmed'
  },
  {
    id: '#PZ-8930',
    tripRef: '#TR-10475',
    name: 'Sara Nabil',
    phone: '+20 100 554 9912',
    avatarInitials: 'SN',
    avatarColor: 'cyan',
    organization: 'Al-Bashaer Language School',
    orgType: 'School',
    childrenCount: 45,
    supervisorsCount: 5,
    ageGroup: '7 – 10 Years',
    packageName: 'Kinetic Fun & Trampoline Expedition',
    pricePerChild: '260 EGP',
    selectedAreas: ['Kinetic Fun Park', 'Trampoline Zone'],
    buffetDetails: 'Burger Box & Fresh Fruit Cup (12:00 PM)',
    hospitalityDetails: 'Hot Beverages Station',
    visitDate: 'Tuesday, November 24, 2026',
    arrivalTime: '10:30 AM',
    duration: '3.5 Hours',
    operatingWindow: '10:30 AM – 02:00 PM (Scheduled Departure)',
    status: 'Processing'
  },
  {
    id: '#PZ-8928',
    tripRef: '#TR-10470',
    name: 'Omar Abdelrahman',
    phone: '+20 109 432 1199',
    avatarInitials: 'OA',
    avatarColor: 'cyan',
    organization: 'Port Said STEM Academy',
    orgType: 'Academy',
    childrenCount: 50,
    supervisorsCount: 5,
    ageGroup: '12 – 15 Years',
    packageName: 'VR Simulators & Robotics Challenge',
    pricePerChild: '320 EGP',
    selectedAreas: ['Challenge Zone & VR Simulators', 'High Ropes'],
    buffetDetails: 'Pizza Feast Buffet (1:00 PM)',
    hospitalityDetails: 'Unlimited Tea & Filter Coffee',
    visitDate: 'Saturday, October 24, 2026',
    arrivalTime: '10:00 AM',
    duration: '4.5 Hours',
    operatingWindow: '10:00 AM – 02:30 PM',
    status: 'Completed'
  },
  {
    id: '#PZ-8919',
    tripRef: '#TR-10462',
    name: 'Hossam Ali',
    phone: '+20 102 334 5566',
    avatarInitials: 'HA',
    avatarColor: 'peach',
    organization: 'Suez Canal Sports Club Academy',
    orgType: 'Club',
    childrenCount: 30,
    supervisorsCount: 3,
    ageGroup: '8 – 12 Years',
    packageName: 'Sports & Active Games Day',
    pricePerChild: '220 EGP',
    selectedAreas: ['Adventure High Ropes', 'Kinetic Fun Park'],
    buffetDetails: 'Sandwich Platter + Fresh Juices',
    hospitalityDetails: 'Mineral Water & Coffee',
    visitDate: 'Thursday, October 15, 2026',
    arrivalTime: '09:00 AM',
    duration: '3.0 Hours',
    operatingWindow: '09:00 AM – 12:00 PM',
    status: 'Cancelled'
  }
];

export default function TripsOrdersView() {
  const [trips, setTrips] = useState(INITIAL_TRIP_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [syncStatus, setSyncStatus] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null); // When set, renders media_1791459032900 view!
  const [currentPage, setCurrentPage] = useState(1);

  // Refresh data handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSyncStatus('Just now');
    }, 450);
  };

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Trip Ref', 'Customer', 'Phone', 'Organization', 'Students', 'Package', 'Visit Date', 'Status'];
    const rows = trips.map(t => [
      t.id,
      t.tripRef,
      `"${t.name}"`,
      `"${t.phone}"`,
      `"${t.organization}"`,
      t.childrenCount,
      `"${t.packageName}"`,
      `"${t.visitDate}"`,
      t.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Trips_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered trips
  const filteredTrips = trips.filter(trip => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      trip.name.toLowerCase().includes(q) ||
      trip.organization.toLowerCase().includes(q) ||
      trip.phone.includes(q) ||
      trip.id.toLowerCase().includes(q) ||
      trip.tripRef.toLowerCase().includes(q);

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'processing' && trip.status === 'Processing') ||
      (statusFilter === 'completed' && trip.status === 'Completed') ||
      (statusFilter === 'cancelled' && trip.status === 'Cancelled');

    return matchesSearch && matchesStatus;
  });

  const countProcessing = trips.filter(t => t.status === 'Processing').length;
  const countCompleted = trips.filter(t => t.status === 'Completed').length;
  const countCancelled = trips.filter(t => t.status === 'Cancelled').length;

  // Print voucher handler
  const handlePrint = () => {
    window.print();
  };

  // Reschedule handler
  const handleReschedule = (tripId) => {
    const newDate = prompt('Enter new trip scheduled date:');
    if (newDate) {
      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, visitDate: newDate } : t));
      if (selectedTrip && selectedTrip.id === tripId) {
        setSelectedTrip(prev => ({ ...prev, visitDate: newDate }));
      }
      alert('Trip schedule updated to ' + newDate);
    }
  };

  // Cancel handler
  const handleCancel = (tripId) => {
    if (window.confirm('Cancel this institutional trip reservation?')) {
      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'Cancelled' } : t));
      if (selectedTrip && selectedTrip.id === tripId) {
        setSelectedTrip(prev => ({ ...prev, status: 'Cancelled' }));
      }
    }
  };

  // =========================================================================
  // VIEW 2: TRIP ORDER DETAILS (media_1791459032900)
  // =========================================================================
  if (selectedTrip) {
    return (
      <div className="trip-details-wrapper">
        
        {/* Back Button */}
        <button 
          type="button" 
          className="trip-back-btn"
          onClick={() => setSelectedTrip(null)}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Page Header */}
        <div className="trip-page-header">
          <div className="trip-header-left">
            <div className="trip-title-row">
              <h1 className="trip-order-title">
                Trip Order {selectedTrip.tripRef}
              </h1>
              <span className="trip-status-badge">
                ● {selectedTrip.status === 'Confirmed' ? 'CONFIRMED BOOKING' : selectedTrip.status.toUpperCase()}
              </span>
            </div>
            <p className="trip-order-subtitle">
              Review institutional reservation details for {selectedTrip.organization}.
            </p>
          </div>

          <button type="button" className="trip-btn-print-voucher" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Voucher</span>
          </button>
        </div>

        {/* 5 Dark Section Cards (2 Columns) */}
        <div className="trip-sections-grid">
          
          {/* Left Column Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* SECTION 01: Organization Details */}
            <div className="trip-section-card">
              <div className="trip-section-header">
                <Building2 size={18} className="trip-section-header-icon" />
                <span className="trip-section-tag">SECTION 01 • Organization Details</span>
              </div>

              <div>
                <div className="trip-section-field-label">ORGANIZATION NAME</div>
                <h3 className="trip-org-name">{selectedTrip.organization}</h3>
                <div className="trip-org-type">{selectedTrip.orgType}</div>
              </div>

              <div className="trip-contacts-row">
                <div>
                  <div className="trip-section-field-label">CONTACT PERSON</div>
                  <div className="trip-contact-val">👤 {selectedTrip.name}</div>
                </div>

                <div>
                  <div className="trip-section-field-label">PHONE NUMBER</div>
                  <div className="trip-contact-val">📞 {selectedTrip.phone}</div>
                </div>
              </div>
            </div>

            {/* SECTION 03: Trip Package */}
            <div className="trip-section-card">
              <div className="trip-section-header">
                <Package size={18} className="trip-section-header-icon" />
                <span className="trip-section-tag">SECTION 03 • Trip Package</span>
              </div>

              <div>
                <div className="trip-section-field-label">SELECTED TRIP PACKAGE</div>
                <h4 className="trip-pkg-name">{selectedTrip.packageName}</h4>
              </div>

              <div className="trip-price-banner">
                <div className="trip-section-field-label">PRICE PER CHILD</div>
                <div className="trip-price-banner-val">
                  {selectedTrip.pricePerChild} <small>/ Child</small>
                </div>
              </div>
            </div>

            {/* SECTION 05: Trip Schedule */}
            <div className="trip-section-card">
              <div className="trip-section-header">
                <Calendar size={18} className="trip-section-header-icon" />
                <span className="trip-section-tag">SECTION 05 • Trip Schedule</span>
              </div>

              <div>
                <div className="trip-section-field-label">VISIT DATE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                  📅 {selectedTrip.visitDate}
                </div>
              </div>

              <div className="trip-schedule-grid">
                <div className="trip-metric-box">
                  <span className="trip-metric-label">ARRIVAL TIME</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8' }}>
                    🕒 {selectedTrip.arrivalTime}
                  </span>
                </div>

                <div className="trip-metric-box">
                  <span className="trip-metric-label">TOTAL DURATION</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8' }}>
                    ⏱️ {selectedTrip.duration}
                  </span>
                </div>
              </div>

              <div className="trip-metric-box" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <span className="trip-metric-label">OPERATING WINDOW</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  ● {selectedTrip.operatingWindow}
                </span>
              </div>
            </div>

          </div>

          {/* Right Column Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* SECTION 02: Group Information */}
            <div className="trip-section-card">
              <div className="trip-section-header">
                <Users size={18} className="trip-section-header-icon" />
                <span className="trip-section-tag">SECTION 02 • Group Information</span>
              </div>

              <div className="trip-group-boxes">
                <div className="trip-metric-box">
                  <span className="trip-metric-label">NUMBER OF CHILDREN</span>
                  <div className="trip-metric-num">
                    {selectedTrip.childrenCount} <small>Students</small>
                  </div>
                </div>

                <div className="trip-metric-box">
                  <span className="trip-metric-label">SUPERVISORS</span>
                  <div className="trip-metric-num">
                    {selectedTrip.supervisorsCount} <small>Teachers / Chaperones</small>
                  </div>
                </div>
              </div>

              <div>
                <div className="trip-section-field-label">AVERAGE AGE GROUP</div>
                <div className="trip-age-pill">{selectedTrip.ageGroup}</div>
              </div>
            </div>

            {/* SECTION 04: Services */}
            <div className="trip-section-card">
              <div className="trip-section-header">
                <Sparkles size={18} className="trip-section-header-icon" />
                <span className="trip-section-tag">SECTION 04 • Services</span>
              </div>

              <div className="trip-services-list">
                
                {/* Play Zone Selection */}
                <div>
                  <div className="trip-section-field-label">PLAY ZONE SELECTION</div>
                  <div className="trip-service-box">
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>
                      ● Selected Areas: {selectedTrip.selectedAreas.length} Areas
                    </span>
                    <div className="trip-service-pills-row">
                      {selectedTrip.selectedAreas.map((area, aIdx) => (
                        <span key={aIdx} className="trip-zone-pill">{area}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Restaurant & Dining */}
                <div>
                  <div className="trip-section-field-label">RESTAURANT &amp; DINING</div>
                  <div className="trip-service-box">
                    <div className="trip-service-item-row">
                      <Utensils size={16} color="#38bdf8" />
                      <span>Reserved Lunch Buffet</span>
                    </div>
                    <span className="trip-service-item-sub">
                      {selectedTrip.buffetDetails}
                    </span>
                  </div>
                </div>

                {/* Cafe & Hospitality */}
                <div>
                  <div className="trip-section-field-label">CAFÉ &amp; HOSPITALITY</div>
                  <div className="trip-service-box">
                    <div className="trip-service-item-row">
                      <Coffee size={16} color="#38bdf8" />
                      <span>Complimentary Welcome Coffee &amp; Refreshments Bar</span>
                    </div>
                    <span className="trip-service-item-sub">
                      {selectedTrip.hospitalityDetails}
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Bottom Actions Bar (media_1791459032900) */}
        <div className="pzo-modal-actions-bar" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
          <button 
            type="button" 
            className="pzo-btn-teal"
            onClick={() => handleReschedule(selectedTrip.id)}
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
            onClick={() => handleCancel(selectedTrip.id)}
          >
            <Ban size={16} />
            <span>Cancel</span>
          </button>

          <button 
            type="button" 
            className="pzo-btn-done"
            onClick={() => setSelectedTrip(null)}
          >
            DONE
          </button>
        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 1: TRIPS ORDERS LIST (media_1791459026814)
  // =========================================================================
  return (
    <div className="pzo-page-container">
      
      {/* 1. Header & Actions */}
      <div className="pzo-header-row">
        <div className="pzo-title-group">
          <h1 className="pzo-page-title">Trips Orders</h1>
          <p className="pzo-page-subtitle">
            Review formal school and institutional group reservations for American Dream Ismailia.
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

      {/* 2. Number of Trip Stat Card */}
      <div style={{ maxWidth: 220 }}>
        <div className="pzo-kpi-card" style={{ padding: '16px 20px' }}>
          <div className="pzo-kpi-top-row" style={{ marginBottom: 8 }}>
            <div className="pzo-kpi-icon-wrap" style={{ width: 32, height: 32 }}>
              <Calendar size={16} />
            </div>
          </div>
          <div className="pzo-kpi-label" style={{ fontSize: '0.7rem' }}>NUMBER OF TRIP</div>
          <div className="pzo-kpi-val" style={{ fontSize: '1.8rem' }}>86</div>
        </div>
      </div>

      {/* 3. Dark Navy Filter Bar */}
      <div className="pzo-filter-card">
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
        </div>

        <div className="pzo-filter-bottom-row">
          <div className="pzo-status-pills">
            <button 
              type="button" 
              className={`pzo-status-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Statuses ({trips.length})
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
            Showing {filteredTrips.length} bookings for today
          </div>
        </div>
      </div>

      {/* 4. Trips Table */}
      <div className="pzo-table-card">
        <table className="pzo-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>CUSTOMER &amp; PROFILE</th>
              <th>ORGANIZATION</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  No institutional trips found matching your filter.
                </td>
              </tr>
            ) : (
              filteredTrips.map((trip) => {
                const isConfirmed = trip.status === 'Confirmed' || trip.status === 'Completed';
                const isProcessing = trip.status === 'Processing';
                const isCancelled = trip.status === 'Cancelled';

                return (
                  <tr key={trip.id}>
                    <td>
                      <div className="pzo-order-id-cell">
                        <span className="pzo-hash-icon">#</span>
                        <span>{trip.id}</span>
                      </div>
                    </td>

                    <td>
                      <div className="pzo-profile-cell">
                        <div className={`pzo-avatar ${trip.avatarColor}`}>
                          {trip.avatarInitials}
                        </div>
                        <div className="pzo-profile-info">
                          <span className="pzo-profile-name">{trip.name}</span>
                          <span className="pzo-profile-phone">
                            <Phone size={11} />
                            {trip.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, color: '#334155' }}>
                        {trip.organization}
                      </span>
                    </td>

                    <td>
                      <span className={`pzo-status-pill ${
                        isConfirmed ? 'confirmed' : isProcessing ? 'processing' : 'cancelled'
                      }`}>
                        ● {trip.status}
                      </span>
                    </td>

                    <td>
                      <button 
                        type="button" 
                        className="pzo-view-btn"
                        onClick={() => setSelectedTrip(trip)}
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
            Showing 1 - {Math.min(7, filteredTrips.length)} of {trips.length} bookings recorded today
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

    </div>
  );
}
