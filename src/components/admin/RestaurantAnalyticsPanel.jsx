import React, { useState, useMemo } from 'react';
import { 
  Utensils, 
  Coffee, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Bike, 
  Calendar, 
  ChefHat, 
  PackageCheck, 
  XCircle, 
  Activity, 
  GitBranch, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Layers,
  ChevronRight,
  Users
} from 'lucide-react';
import './RestaurantAnalyticsPanel.css';

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

export default function RestaurantAnalyticsPanel({
  orders = [],
  isAr = true,
  activeStatusFilter = 'All',
  onSelectStatusFilter = () => {}
}) {
  // Graph metric toggle: 'revenue' | 'orders'
  const [graphMetric, setGraphMetric] = useState('revenue');
  // Hovered data point in timeline graph
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Compute Live Metrics from restaurant orders data
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let confirmedCount = 0;
    let cookingCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let tableReservations = 0;
    let deliveryOrders = 0;
    let totalGuestsSeated = 0;

    orders.forEach(ord => {
      const price = Number(ord.totalPrice || ord.total || ord.price || 0);
      const st = String(ord.status || 'pending').toLowerCase();
      const isTable = ord.type === 'table' || !!ord.bookingCode || !!ord.numberOfPerson;

      if (isTable) {
        tableReservations += 1;
        totalGuestsSeated += Number(ord.numberOfPerson || ord.guests || 2);
      } else {
        deliveryOrders += 1;
      }

      if (st === 'cancelled') {
        cancelledCount += 1;
      } else {
        totalRevenue += price;
        if (st === 'confirmed') confirmedCount += 1;
        else if (st === 'processing' || st === 'pending' || st === 'cooking' || st === 'in-prep') cookingCount += 1;
        else if (st === 'completed' || st === 'delivered') completedCount += 1;
      }
    });

    const activeOrdersTotal = orders.length;
    const completedRate = activeOrdersTotal > 0 
      ? Math.round(((completedCount + confirmedCount) / activeOrdersTotal) * 100) 
      : 96;

    const avgOrderValue = (deliveryOrders + tableReservations) > 0 
      ? Math.round(totalRevenue / Math.max(1, deliveryOrders + tableReservations))
      : 240;

    return {
      totalRevenue,
      confirmedCount,
      cookingCount,
      completedCount,
      cancelledCount,
      tableReservations,
      deliveryOrders,
      totalGuestsSeated,
      completedRate,
      avgOrderValue,
      totalCount: orders.length
    };
  }, [orders]);



  // Sparkline data
  const sparklineData = useMemo(() => {
    return createSmoothSvgPaths([40, 65, 80, 72, 95, 110, 140, 130, 160], 110, 36, 4);
  }, []);

  return (
    <div className={`rest-panel-root ${isAr ? 'lang-ar' : ''}`}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP HEADER & VIEW MODE SWITCHER                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="rest-header-row">
        <div className="rest-title-group">
          <div className="rest-badge-pill">
            <span className="rest-live-dot" />
            <ChefHat size={13} />
            <span>{isAr ? 'تحليلات المطبخ والمطعم المباشرة' : 'Live Kitchen & Dining Operations'}</span>
          </div>
          <h3 className="rest-heading">
            {isAr ? 'مؤشرات أداء المطعم والكافيه وحجوزات الطاولات' : 'Restaurant & Dining Performance Matrix'}
          </h3>
          <p className="rest-subheading">
            {isAr 
              ? 'متابعة حية للطلبات الواردة، سرعة الإعداد بالمطبخ، طاولات الضيافة ومبيعات الوجبات' 
              : 'Real-time overview of incoming orders, kitchen prep pipeline, table reservations, and culinary sales.'}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. TOP METRIC CARDS                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="rest-stats-grid">
        {/* Card 1: Total Revenue */}
        <div className="rest-stat-card">
          <div className="rest-stat-header">
            <span className="rest-stat-label">{isAr ? 'إجمالي مبيعات المطعم' : 'Total Dining Revenue'}</span>
            <div className="rest-stat-icon-wrap cyan">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="rest-stat-body">
            <div className="rest-stat-value">
              {metrics.totalRevenue.toLocaleString()} <span className="rest-stat-curr">{isAr ? 'ج.م' : 'EGP'}</span>
            </div>
            <div className="rest-stat-sub">
              <span className="trend-up">
                <TrendingUp size={12} /> +19.4%
              </span>
              <span>{isAr ? 'مقارنة بالأسبوع الماضي' : 'vs last week'}</span>
            </div>
          </div>
          <div className="rest-stat-spark">
            <svg width="110" height="36" viewBox="0 0 110 36">
              <path d={sparklineData.area} fill="rgba(0, 210, 255, 0.15)" />
              <path d={sparklineData.path} fill="none" stroke="#00d2ff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Kitchen Prepping / In Progress */}
        <div 
          className={`rest-stat-card clickable ${activeStatusFilter.toLowerCase() === 'processing' ? 'active-filter' : ''}`}
          onClick={() => onSelectStatusFilter(activeStatusFilter.toLowerCase() === 'processing' ? 'All' : 'Processing')}
          title={isAr ? 'انقر لتصفية طلبات المطبخ' : 'Click to filter kitchen orders'}
        >
          <div className="rest-stat-header">
            <span className="rest-stat-label">{isAr ? 'قيد التحضير في المطبخ' : 'Active Kitchen Cooking'}</span>
            <div className="rest-stat-icon-wrap amber">
              <ChefHat size={16} />
            </div>
          </div>
          <div className="rest-stat-body">
            <div className="rest-stat-value amber">
              {metrics.cookingCount} <span className="rest-stat-curr">{isAr ? 'طلب' : 'Orders'}</span>
            </div>
            <div className="rest-stat-sub">
              <span className="badge-pulse amber-dot" />
              <span>{isAr ? 'متوسط وقت التحضير: 18 دقيقة' : 'Avg prep time: 18 mins'}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Table Bookings & Seated Guests */}
        <div className="rest-stat-card">
          <div className="rest-stat-header">
            <span className="rest-stat-label">{isAr ? 'حجوزات الطاولات والضيوف' : 'Table Reservations'}</span>
            <div className="rest-stat-icon-wrap purple">
              <Utensils size={16} />
            </div>
          </div>
          <div className="rest-stat-body">
            <div className="rest-stat-value purple">
              {metrics.tableReservations} <span className="rest-stat-curr">{isAr ? 'طاولة' : 'Tables'}</span>
            </div>
            <div className="rest-stat-sub">
              <Users size={12} color="#a855f7" />
              <span>{metrics.totalGuestsSeated} {isAr ? 'ضيفاً جالساً ومحجوزاً' : 'Total guests reserved'}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Completed Deliveries */}
        <div 
          className={`rest-stat-card clickable ${activeStatusFilter.toLowerCase() === 'completed' ? 'active-filter' : ''}`}
          onClick={() => onSelectStatusFilter(activeStatusFilter.toLowerCase() === 'completed' ? 'All' : 'Completed')}
          title={isAr ? 'انقر لتصفية الطلبات المسلمة' : 'Click to filter completed'}
        >
          <div className="rest-stat-header">
            <span className="rest-stat-label">{isAr ? 'طلبات تم تسليمها بنجاح' : 'Delivered & Completed'}</span>
            <div className="rest-stat-icon-wrap green">
              <PackageCheck size={16} />
            </div>
          </div>
          <div className="rest-stat-body">
            <div className="rest-stat-value green">
              {metrics.completedCount} <span className="rest-stat-curr">({metrics.completedRate}%)</span>
            </div>
            <div className="rest-stat-sub">
              <CheckCircle2 size={12} color="#10b981" />
              <span>{isAr ? 'تسليم دقيق في الموعد المحدد' : 'On-time delivery record'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
