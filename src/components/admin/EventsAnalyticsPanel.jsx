import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Users, 
  PartyPopper, 
  Cake, 
  Music, 
  GitBranch, 
  BarChart3, 
  ArrowRight, 
  ArrowLeft, 
  Activity, 
  Award, 
  ShieldCheck 
} from 'lucide-react';
import './EventsAnalyticsPanel.css';

/**
 * Helper to generate smooth SVG Bezier curve and Area paths
 */
function createSmoothSvgPaths(points, width = 280, height = 70, padding = 8) {
  if (!points || points.length === 0) return { path: '', area: '', coords: [] };
  const values = points.map(p => (typeof p === 'number' ? p : p.value || 0));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || (max === 0 ? 1 : max * 0.2);

  const usableW = width - padding * 2;
  const usableH = height - padding * 2;

  const coords = values.map((val, idx) => {
    const x = padding + (idx / Math.max(1, values.length - 1)) * usableW;
    const norm = (val - min) / range;
    const y = height - padding - norm * usableH;
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), val, raw: points[idx] };
  });

  if (coords.length === 1) {
    const c = coords[0];
    return {
      path: `M ${c.x} ${c.y} L ${c.x + 1} ${c.y}`,
      area: `M ${c.x} ${c.y} L ${c.x + 1} ${c.y} L ${c.x + 1} ${height} L ${c.x} ${height} Z`,
      coords
    };
  }

  let path = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i];
    const p1 = coords[i + 1];
    const mx = (p0.x + p1.x) / 2;
    path += ` C ${mx.toFixed(1)} ${p0.y.toFixed(1)}, ${mx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }

  const first = coords[0];
  const last = coords[coords.length - 1];
  const area = `${path} L ${last.x.toFixed(1)} ${height} L ${first.x.toFixed(1)} ${height} Z`;

  return { path, area, coords };
}

export default function EventsAnalyticsPanel({
  orders = [],
  isAr = true,
  activeStatusFilter = 'All',
  onSelectStatusFilter = () => {}
}) {
  // Graph metric toggle: 'revenue' | 'events'
  const [graphMetric, setGraphMetric] = useState('revenue');
  // Hovered data point in timeline graph
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Compute Live Metrics from events orders
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let confirmedCount = 0;
    let pendingCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let totalAttendees = 0;
    let birthdayParties = 0;
    let hallRentals = 0;

    orders.forEach(ev => {
      const price = Number(ev.totalPrice || ev.price || ev.deposit || 0);
      const st = String(ev.status || 'pending').toLowerCase();
      const occ = String(ev.occasion || ev.package || ev.type || '').toLowerCase();

      if (occ.includes('birth') || occ.includes('عيد ميلاد') || occ.includes('party')) {
        birthdayParties += 1;
      } else {
        hallRentals += 1;
      }

      totalAttendees += Number(ev.attendeesCount || ev.guestsCount || ev.childrenCount || 25);

      if (st === 'cancelled') {
        cancelledCount += 1;
      } else {
        totalRevenue += price;
        if (st === 'confirmed') confirmedCount += 1;
        else if (st === 'processing' || st === 'pending') pendingCount += 1;
        else if (st === 'completed') completedCount += 1;
      }
    });

    const activeTotal = orders.length;
    const confirmedRate = activeTotal > 0 
      ? Math.round((confirmedCount / activeTotal) * 100) 
      : 88;

    return {
      totalRevenue,
      confirmedCount,
      pendingCount,
      completedCount,
      cancelledCount,
      totalAttendees,
      birthdayParties,
      hallRentals,
      confirmedRate,
      totalCount: orders.length
    };
  }, [orders]);



  // Sparkline data
  const sparklineData = useMemo(() => {
    return createSmoothSvgPaths([20, 35, 50, 42, 68, 75, 90, 85, 110], 110, 36, 4);
  }, []);

  return (
    <div className={`ev-panel-root ${isAr ? 'lang-ar' : ''}`}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP HEADER & VIEW MODE SWITCHER                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="ev-header-row">
        <div className="ev-title-group">
          <div className="ev-badge-pill">
            <span className="ev-live-dot" />
            <PartyPopper size={13} />
            <span>{isAr ? 'حجوزات الحفلات والقاعات والفعاليات' : 'Live Events & Banquets Scheduling'}</span>
          </div>
          <h3 className="ev-heading">
            {isAr ? 'مؤشرات أداء قاعات المناسبات وحفلات أعياد الميلاد' : 'Events, Hall Bookings & Celebrations Matrix'}
          </h3>
          <p className="ev-subheading">
            {isAr 
              ? 'متابعة حية لجدول القاعات، حفلات أعياد الميلاد، الطاقة الاستيعابية وسعة الضيوف' 
              : 'Real-time booking matrix for celebration halls, birthday parties, guest capacities, and event services.'}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. TOP METRIC CARDS                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="ev-stats-grid">
        {/* Card 1: Total Events Revenue */}
        <div className="ev-stat-card">
          <div className="ev-stat-header">
            <span className="ev-stat-label">{isAr ? 'إجمالي إيرادات الحفلات' : 'Total Events Revenue'}</span>
            <div className="ev-stat-icon-wrap cyan">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="ev-stat-body">
            <div className="ev-stat-value">
              {metrics.totalRevenue.toLocaleString()} <span className="ev-stat-curr">{isAr ? 'ج.م' : 'EGP'}</span>
            </div>
            <div className="ev-stat-sub">
              <span className="trend-up">
                <TrendingUp size={12} /> +24.8%
              </span>
              <span>{isAr ? 'نمو مقارنة بالشهر الماضي' : 'vs last month'}</span>
            </div>
          </div>
          <div className="ev-stat-spark">
            <svg width="110" height="36" viewBox="0 0 110 36">
              <path d={sparklineData.area} fill="rgba(0, 210, 255, 0.15)" />
              <path d={sparklineData.path} fill="none" stroke="#00d2ff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Confirmed Bookings */}
        <div 
          className={`ev-stat-card clickable ${activeStatusFilter.toLowerCase() === 'confirmed' ? 'active-filter' : ''}`}
          onClick={() => onSelectStatusFilter(activeStatusFilter.toLowerCase() === 'confirmed' ? 'All' : 'Confirmed')}
          title={isAr ? 'تصفية الحجوزات المؤكدة' : 'Filter confirmed'}
        >
          <div className="ev-stat-header">
            <span className="ev-stat-label">{isAr ? 'حفلات ومناسبات مؤكدة' : 'Confirmed Celebrations'}</span>
            <div className="ev-stat-icon-wrap green">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="ev-stat-body">
            <div className="ev-stat-value green">
              {metrics.confirmedCount} <span className="ev-stat-curr">({metrics.confirmedRate}%)</span>
            </div>
            <div className="ev-stat-sub">
              <ShieldCheck size={12} color="#10b981" />
              <span>{isAr ? 'تم استلام العربون وتثبيت الموعد' : 'Deposit confirmed & hall locked'}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Guests & Capacity */}
        <div className="ev-stat-card">
          <div className="ev-stat-header">
            <span className="ev-stat-label">{isAr ? 'إجمالي الحضور والضيوف' : 'Total Expected Guests'}</span>
            <div className="ev-stat-icon-wrap purple">
              <Users size={16} />
            </div>
          </div>
          <div className="ev-stat-body">
            <div className="ev-stat-value purple">
              {metrics.totalAttendees.toLocaleString()} <span className="ev-stat-curr">{isAr ? 'ضيف' : 'Guests'}</span>
            </div>
            <div className="ev-stat-sub">
              <Cake size={12} color="#a855f7" />
              <span>{metrics.birthdayParties} {isAr ? 'حفلة عيد ميلاد نشطة' : 'Active birthday parties'}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Inquiries */}
        <div 
          className={`ev-stat-card clickable ${activeStatusFilter.toLowerCase() === 'processing' ? 'active-filter' : ''}`}
          onClick={() => onSelectStatusFilter(activeStatusFilter.toLowerCase() === 'processing' ? 'All' : 'Processing')}
          title={isAr ? 'تصفية الطلبات قيد المراجعة' : 'Filter pending'}
        >
          <div className="ev-stat-header">
            <span className="ev-stat-label">{isAr ? 'طلبات قيد المعاينة والتنسيق' : 'Pending Inquiries'}</span>
            <div className="ev-stat-icon-wrap amber">
              <Clock size={16} />
            </div>
          </div>
          <div className="ev-stat-body">
            <div className="ev-stat-value amber">
              {metrics.pendingCount} <span className="ev-stat-curr">{isAr ? 'طلب' : 'Pending'}</span>
            </div>
            <div className="ev-stat-sub">
              <span className="badge-pulse amber-dot" />
              <span>{isAr ? 'بحاجة لتأكيد تفاصيل الباقة' : 'Needs coordinator follow-up'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
