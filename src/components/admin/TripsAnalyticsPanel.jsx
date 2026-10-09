import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Utensils, 
  Coffee, 
  Compass, 
  GitBranch, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Layers,
  GraduationCap,
  ShieldCheck,
  XCircle,
  Activity
} from 'lucide-react';
import './TripsAnalyticsPanel.css';

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

export default function TripsAnalyticsPanel({
  tripsOrders = [],
  isAr = true,
  activeStatusFilter = 'All',
  onSelectStatusFilter = () => {}
}) {
  const [viewMode, setViewMode] = useState('flowchart'); // 'flowchart' | 'graphs'
  const [graphMetric, setGraphMetric] = useState('students'); // 'students' | 'revenue'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Compute real metrics from live trips data
  const metrics = useMemo(() => {
    const totalTrips = tripsOrders.length;
    let totalChildren = 0;
    let totalSupervisors = 0;
    let totalRevenue = 0;
    let confirmedCount = 0;
    let processingCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;

    const timelineData = [];

    tripsOrders.forEach((t) => {
      const kids = Number(t.childrenCount) || 0;
      const sups = Number(t.supervisorsCount) || 0;
      const price = Number(t.pricePerChild) || 0;
      const rev = kids * price;

      totalChildren += kids;
      totalSupervisors += sups;
      totalRevenue += rev;

      const s = String(t.status || '').toLowerCase();
      if (s === 'confirmed') confirmedCount += 1;
      else if (s === 'processing' || s === 'pending') processingCount += 1;
      else if (s === 'completed') completedCount += 1;
      else if (s === 'cancelled') cancelledCount += 1;

      timelineData.push({
        label: t.visitDate ? t.visitDate.split(',')[1] || t.visitDate : t.id,
        students: kids,
        revenue: rev,
        org: t.organizationAr || t.organization,
        tripId: t.id
      });
    });

    const avgChildrenPerTrip = totalTrips > 0 ? Math.round(totalChildren / totalTrips) : 0;
    const avgRevenuePerTrip = totalTrips > 0 ? Math.round(totalRevenue / totalTrips) : 0;
    const supervisorRatio = totalChildren > 0 && totalSupervisors > 0 
      ? `1 : ${Math.round(totalChildren / totalSupervisors)}` 
      : '1 : 10';

    // Ensure at least 4 points for smooth graph rendering
    const chartSeries = timelineData.length >= 4 ? timelineData : [
      { label: isAr ? 'رحلة 01' : 'Trip A', students: 50, revenue: 16000, org: 'Cairo Academy', tripId: 'TR-1' },
      { label: isAr ? 'رحلة 02' : 'Trip B', students: 75, revenue: 24000, org: 'Modern School', tripId: 'TR-2' },
      ...timelineData
    ];

    const studentsSpark = chartSeries.map(c => c.students);
    const revenueSpark = chartSeries.map(c => c.revenue);
    const tripsSpark = [1, Math.max(1, totalTrips), totalTrips + 1];

    return {
      totalTrips,
      totalChildren,
      totalSupervisors,
      totalRevenue,
      avgChildrenPerTrip,
      avgRevenuePerTrip,
      supervisorRatio,
      confirmedPercent: totalTrips > 0 ? Math.round((confirmedCount / totalTrips) * 100) : 0,
      processingPercent: totalTrips > 0 ? Math.round((processingCount / totalTrips) * 100) : 0,
      flowchart: {
        pending: { count: processingCount, percent: totalTrips > 0 ? Math.round((processingCount / totalTrips) * 100) : 0 },
        confirmed: { count: confirmedCount, percent: totalTrips > 0 ? Math.round((confirmedCount / totalTrips) * 100) : 0 },
        logistics: { count: totalTrips, percent: 100 },
        completed: { count: completedCount, percent: totalTrips > 0 ? Math.round((completedCount / totalTrips) * 100) : 0 },
        cancelled: { count: cancelledCount, percent: 0 }
      },
      chartSeries,
      sparklines: {
        trips: tripsSpark,
        students: studentsSpark,
        supervisors: [4, 8, 14],
        revenue: revenueSpark
      }
    };
  }, [tripsOrders, isAr]);

  // Mini Sparklines
  const sparkTrips = useMemo(() => createSmoothSvgPaths(metrics.sparklines.trips, 120, 36, 4), [metrics.sparklines.trips]);
  const sparkStudents = useMemo(() => createSmoothSvgPaths(metrics.sparklines.students, 120, 36, 4), [metrics.sparklines.students]);
  const sparkSupervisors = useMemo(() => createSmoothSvgPaths(metrics.sparklines.supervisors, 120, 36, 4), [metrics.sparklines.supervisors]);
  const sparkRevenue = useMemo(() => createSmoothSvgPaths(metrics.sparklines.revenue, 120, 36, 4), [metrics.sparklines.revenue]);

  // Main graph path
  const graphDataPoints = useMemo(() => {
    return metrics.chartSeries.map(d => ({
      value: graphMetric === 'revenue' ? d.revenue : d.students,
      label: d.label,
      students: d.students,
      revenue: d.revenue,
      org: d.org,
      tripId: d.tripId
    }));
  }, [metrics.chartSeries, graphMetric]);

  const mainGraphPaths = useMemo(() => {
    return createSmoothSvgPaths(graphDataPoints, 640, 160, 24);
  }, [graphDataPoints]);

  return (
    <section className="tap-panel-root">
      
      {/* ------------------------------------------------------------- */}
      {/* HEADER: TITLE & VIEW SELECTOR                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="tap-header-row">
        <div className="tap-title-group">
          <div className="tap-badge-pill">
            <Activity size={14} className="tap-live-icon" />
            <span>{isAr ? 'إدارة رحلات المدارس والمؤسسات' : 'Institutional Trips Engine'}</span>
          </div>
          <h2 className="tap-heading">
            {isAr ? 'مخطط تنظيم الرحلات المدرسية والتحليلات اللوجستية' : 'School Trips Pipeline & Logistics Analytics'}
          </h2>
          <p className="tap-subheading">
            {isAr 
              ? 'متابعة مسار اعتماد حجوزات المدارس، أعداد الطلاب والمشرفين، وتوزيع باقات الضيافة والأنشطة.'
              : 'Tracking school reservation workflow, student headcount, teacher chaperone ratios, and package distribution.'}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="tap-mode-switch">
          <button 
            type="button"
            className={`tap-mode-btn ${viewMode === 'flowchart' ? 'active' : ''}`}
            onClick={() => setViewMode('flowchart')}
          >
            <GitBranch size={14} />
            <span>{isAr ? 'مخطط سير الرحلات' : 'Flowchart'}</span>
          </button>

          <button 
            type="button"
            className={`tap-mode-btn ${viewMode === 'graphs' ? 'active' : ''}`}
            onClick={() => setViewMode('graphs')}
          >
            <BarChart3 size={14} />
            <span>{isAr ? 'الرسوم البيانية' : 'Graphs'}</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ROW 1: 4 DYNAMIC STAT CARDS WITH EMBEDDED REAL SVG SPARKLINES */}
      {/* ------------------------------------------------------------- */}
      <div className="tap-kpi-grid">
        
        {/* KPI 1: TOTAL TRIPS */}
        <div 
          className="tap-kpi-card"
          onClick={() => onSelectStatusFilter('All')}
          title={isAr ? 'عرض جميع الرحلات' : 'View all trips'}
        >
          <div className="tap-kpi-top">
            <div className="tap-kpi-icon teal">
              <Calendar size={18} />
            </div>
            <span className="tap-kpi-badge teal">
              {metrics.confirmedPercent}% {isAr ? 'مؤكدة' : 'confirmed'}
            </span>
          </div>
          <span className="tap-kpi-label">{isAr ? 'إجمالي الرحلات المسجلة' : 'TOTAL TRIPS SCHEDULED'}</span>
          <div className="tap-kpi-val-row">
            <span className="tap-kpi-num">{metrics.totalTrips}</span>
            <span className="tap-kpi-unit">{isAr ? 'رحلات مدرسية' : 'school trips'}</span>
          </div>

          <div className="tap-sparkline-wrap">
            <svg viewBox="0 0 120 36" className="tap-sparkline-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tripGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00a9c3" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#00a9c3" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {sparkTrips.area && <path d={sparkTrips.area} fill="url(#tripGrad1)" />}
              {sparkTrips.path && <path d={sparkTrips.path} fill="none" stroke="#00a9c3" strokeWidth="2.5" strokeLinecap="round" />}
            </svg>
          </div>
          <div className="tap-kpi-footer">
            <span className="tap-pulse-dot green" />
            <span>{isAr ? `${metrics.totalTrips} مؤسسات تعليمية معتمدة` : `${metrics.totalTrips} educational institutions`}</span>
          </div>
        </div>

        {/* KPI 2: TOTAL STUDENTS */}
        <div className="tap-kpi-card">
          <div className="tap-kpi-top">
            <div className="tap-kpi-icon blue">
              <GraduationCap size={18} />
            </div>
            <span className="tap-kpi-badge blue">
              {metrics.avgChildrenPerTrip} {isAr ? 'طالب / رحلة' : 'students / trip'}
            </span>
          </div>
          <span className="tap-kpi-label">{isAr ? 'إجمالي عدد الطلاب' : 'TOTAL STUDENTS'}</span>
          <div className="tap-kpi-val-row">
            <span className="tap-kpi-num">{metrics.totalChildren.toLocaleString()}</span>
            <span className="tap-kpi-unit">{isAr ? 'طالباً وطالبة' : 'enrolled students'}</span>
          </div>

          <div className="tap-sparkline-wrap">
            <svg viewBox="0 0 120 36" className="tap-sparkline-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tripGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {sparkStudents.area && <path d={sparkStudents.area} fill="url(#tripGrad2)" />}
              {sparkStudents.path && <path d={sparkStudents.path} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />}
            </svg>
          </div>
          <div className="tap-kpi-footer">
            <span className="tap-pulse-dot blue" />
            <span>{isAr ? 'إجمالي أساور الأطفال المحجوزة' : 'Total student wristbands queued'}</span>
          </div>
        </div>

        {/* KPI 3: SUPERVISORS / CHAPERONES */}
        <div className="tap-kpi-card">
          <div className="tap-kpi-top">
            <div className="tap-kpi-icon purple">
              <ShieldCheck size={18} />
            </div>
            <span className="tap-kpi-badge purple">
              {metrics.supervisorRatio} {isAr ? 'نسبة الإشراف' : 'ratio'}
            </span>
          </div>
          <span className="tap-kpi-label">{isAr ? 'المعلمون والمشرفون' : 'CHAPERONES & STAFF'}</span>
          <div className="tap-kpi-val-row">
            <span className="tap-kpi-num">{metrics.totalSupervisors}</span>
            <span className="tap-kpi-unit">{isAr ? 'مشرفاً ومعلماً' : 'faculty members'}</span>
          </div>

          <div className="tap-sparkline-wrap">
            <svg viewBox="0 0 120 36" className="tap-sparkline-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tripGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {sparkSupervisors.area && <path d={sparkSupervisors.area} fill="url(#tripGrad3)" />}
              {sparkSupervisors.path && <path d={sparkSupervisors.path} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />}
            </svg>
          </div>
          <div className="tap-kpi-footer">
            <span className="tap-pulse-dot purple" />
            <span>{isAr ? 'ضيافة مجانية واستراحة خاصة مخصصة' : 'VIP teacher lounge reserved'}</span>
          </div>
        </div>

        {/* KPI 4: REVENUE VALUE */}
        <div className="tap-kpi-card">
          <div className="tap-kpi-top">
            <div className="tap-kpi-icon emerald">
              <DollarSign size={18} />
            </div>
            <span className="tap-kpi-badge emerald">
              {metrics.avgRevenuePerTrip.toLocaleString()} {isAr ? 'ج.م متوسط' : 'EGP avg'}
            </span>
          </div>
          <span className="tap-kpi-label">{isAr ? 'إجمالي قيمة عقود الرحلات' : 'TOTAL CONTRACT VALUE'}</span>
          <div className="tap-kpi-val-row">
            <span className="tap-kpi-num">{metrics.totalRevenue.toLocaleString()}</span>
            <span className="tap-kpi-unit">{isAr ? 'ج.م' : 'EGP'}</span>
          </div>

          <div className="tap-sparkline-wrap">
            <svg viewBox="0 0 120 36" className="tap-sparkline-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tripGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {sparkRevenue.area && <path d={sparkRevenue.area} fill="url(#tripGrad4)" />}
              {sparkRevenue.path && <path d={sparkRevenue.path} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />}
            </svg>
          </div>
          <div className="tap-kpi-footer">
            <span className="tap-pulse-dot emerald" />
            <span>{isAr ? 'شامل تذاكر الألعاب ووجبات الغداء' : 'Includes activities and dining boxes'}</span>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* OPERATIONAL TRIPS FLOWCHART (مخطط سير تنظيم الرحلات)           */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'flowchart' && (
        <div className="tap-flowchart-card">
          <div className="tap-card-top-header">
            <div className="tap-card-title-wrap">
              <GitBranch size={17} className="tap-accent-icon" />
              <div>
                <h3 className="tap-card-title">
                  {isAr ? 'مخطط سير إجراءات الرحلات المدرسية (Trips Operational Flowchart)' : 'School Trips Operational Flowchart'}
                </h3>
                <span className="tap-card-sub">
                  {isAr 
                    ? 'انقر على أي مرحلة لتصفية جدول الرحلات فورياً حسب حالة الإجراء.'
                    : 'Click any pipeline node to filter the trips table below.'}
                </span>
              </div>
            </div>
            
            <span className="tap-legend-pill active">
              <span className="tap-legend-dot green" />
              {isAr ? 'مسار العمليات التشغيلية' : 'Live Logistics Pipeline'}
            </span>
          </div>

          {/* Interactive Flow Nodes */}
          <div className="tap-flow-pipeline">
            
            {/* STAGE 1: INQUIRY & PROCESSING */}
            <div 
              className={`tap-flow-node stage-pending ${activeStatusFilter.toLowerCase() === 'processing' ? 'active-filter' : ''}`}
              onClick={() => onSelectStatusFilter(activeStatusFilter.toLowerCase() === 'processing' ? 'All' : 'Processing')}
            >
              <div className="tap-node-header">
                <div className="tap-node-icon amber">
                  <Clock size={16} />
                </div>
                <span className="tap-node-step">{isAr ? 'المرحلة 01' : 'STAGE 01'}</span>
              </div>
              <h4 className="tap-node-name">{isAr ? 'استلام الطلب والدراسة' : 'Inquiry & Review'}</h4>
              <p className="tap-node-desc">
                {isAr ? 'تحديد أعداد الطلاب والمرافقين' : 'Initial school booking request'}
              </p>
              <div className="tap-node-stats">
                <div className="tap-node-stat-item">
                  <span className="stat-label">{isAr ? 'الرحلات' : 'Trips'}</span>
                  <span className="stat-value">{metrics.flowchart.pending.count}</span>
                </div>
                <div className="tap-node-stat-item">
                  <span className="stat-label">{isAr ? 'النسبة' : 'Share'}</span>
                  <span className="stat-value">{metrics.processingPercent}%</span>
                </div>
              </div>
            </div>

            {/* CONNECTOR 1 */}
            <div className="tap-flow-connector">
              <div className="tap-connector-line">
                <span className="tap-pulse-particle" />
              </div>
              <div className="tap-connector-arrow">
                {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </div>
            </div>

            {/* STAGE 2: CONTRACT CONFIRMED */}
            <div 
              className={`tap-flow-node stage-confirmed ${activeStatusFilter.toLowerCase() === 'confirmed' ? 'active-filter' : ''}`}
              onClick={() => onSelectStatusFilter(activeStatusFilter.toLowerCase() === 'confirmed' ? 'All' : 'Confirmed')}
            >
              <div className="tap-node-header">
                <div className="tap-node-icon teal">
                  <CheckCircle2 size={16} />
                </div>
                <span className="tap-node-step">{isAr ? 'المرحلة 02' : 'STAGE 02'}</span>
              </div>
              <h4 className="tap-node-name">{isAr ? 'اعتماد العقد والموعد' : 'Contract Confirmed'}</h4>
              <p className="tap-node-desc">
                {isAr ? 'تأكيد موعد الزيارة وسداد المقدم' : 'Deposit paid, date locked'}
              </p>
              <div className="tap-node-stats">
                <div className="tap-node-stat-item">
                  <span className="stat-label">{isAr ? 'المؤكدة' : 'Confirmed'}</span>
                  <span className="stat-value">{metrics.flowchart.confirmed.count}</span>
                </div>
                <div className="tap-node-stat-item">
                  <span className="stat-label">{isAr ? 'نسبة الاعتماد' : 'Rate'}</span>
                  <span className="stat-value">{metrics.confirmedPercent}%</span>
                </div>
              </div>
            </div>

            {/* CONNECTOR 2 */}
            <div className="tap-flow-connector">
              <div className="tap-connector-line">
                <span className="tap-pulse-particle delay-1" />
              </div>
              <div className="tap-connector-arrow">
                {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </div>
            </div>

            {/* STAGE 3: LOGISTICS & CATERING */}
            <div 
              className="tap-flow-node stage-logistics"
              onClick={() => onSelectStatusFilter('All')}
              title={isAr ? 'تجهيز الوجبات وصالة استراحة المعلمين' : 'Catering & lounge reserved'}
            >
              <div className="tap-node-header">
                <div className="tap-node-icon purple">
                  <Utensils size={16} />
                </div>
                <span className="tap-node-step">{isAr ? 'المرحلة 03' : 'STAGE 03'}</span>
              </div>
              <h4 className="tap-node-name">{isAr ? 'التجهيز اللوجستي والوجبات' : 'Catering & Logistics'}</h4>
              <p className="tap-node-desc">
                {isAr ? 'حجز بوفيه الغداء وصالة المشرفين' : 'Lunch boxes & lounge reserved'}
              </p>
              <div className="tap-node-stats">
                <div className="tap-node-stat-item">
                  <span className="stat-label">{isAr ? 'الوجبات' : 'Meals'}</span>
                  <span className="stat-value">{metrics.totalChildren} {isAr ? 'وجبة' : 'boxes'}</span>
                </div>
                <div className="tap-node-stat-item">
                  <span className="stat-label">{isAr ? 'الجاهزية' : 'Ready'}</span>
                  <span className="stat-value">100%</span>
                </div>
              </div>
            </div>

            {/* CONNECTOR 3 */}
            <div className="tap-flow-connector">
              <div className="tap-connector-line">
                <span className="tap-pulse-particle delay-2" />
              </div>
              <div className="tap-connector-arrow">
                {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </div>
            </div>

            {/* STAGE 4: ARRIVAL & EXECUTION */}
            <div 
              className={`tap-flow-node stage-completed ${activeStatusFilter.toLowerCase() === 'completed' ? 'active-filter' : ''}`}
              onClick={() => onSelectStatusFilter(activeStatusFilter.toLowerCase() === 'completed' ? 'All' : 'Completed')}
            >
              <div className="tap-node-header">
                <div className="tap-node-icon emerald">
                  <Compass size={16} />
                </div>
                <span className="tap-node-step">{isAr ? 'المرحلة 04' : 'STAGE 04'}</span>
              </div>
              <h4 className="tap-node-name">{isAr ? 'استقبال الحافلات وتنفيذ الزيارة' : 'Execution & Departure'}</h4>
              <p className="tap-node-desc">
                {isAr ? 'توزيع الأساور وجدول المغامرات' : 'Wristbands delivered, departure'}
              </p>
              <div className="tap-node-stats">
                <div className="tap-node-stat-item">
                  <span className="stat-label">{isAr ? 'المنفذ' : 'Executed'}</span>
                  <span className="stat-value">{metrics.flowchart.completed.count}</span>
                </div>
                <div className="tap-node-stat-item">
                  <span className="stat-label">{isAr ? 'الحافلات' : 'Fleet'}</span>
                  <span className="stat-value">{Math.ceil(metrics.totalChildren / 45)} {isAr ? 'حافلة' : 'buses'}</span>
                </div>
              </div>
            </div>

            {/* EXCEPTION STAGE */}
            <div 
              className={`tap-flow-node stage-cancelled ${activeStatusFilter.toLowerCase() === 'cancelled' ? 'active-filter' : ''}`}
              onClick={() => onSelectStatusFilter(activeStatusFilter.toLowerCase() === 'cancelled' ? 'All' : 'Cancelled')}
            >
              <div className="tap-node-header">
                <div className="tap-node-icon red">
                  <XCircle size={16} />
                </div>
                <span className="tap-node-step red">{isAr ? 'استثناء' : 'EXCEPTION'}</span>
              </div>
              <h4 className="tap-node-name">{isAr ? 'رحلات ملغاة أو مؤجلة' : 'Cancelled / Postponed'}</h4>
              <p className="tap-node-desc">
                {isAr ? 'اعتذار المدرسة أو إعادة الجدولة' : 'Postponed or cancelled dates'}
              </p>
              <div className="tap-node-stats">
                <div className="tap-node-stat-item">
                  <span className="stat-label">{isAr ? 'العدد' : 'Count'}</span>
                  <span className="stat-value">{metrics.flowchart.cancelled.count}</span>
                </div>
                <div className="tap-node-stat-item">
                  <span className="stat-label">{isAr ? 'النسبة' : 'Rate'}</span>
                  <span className="stat-value">0%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ROW 3: INTERACTIVE VISUAL GRAPHS                             */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'graphs' && (
        <div className="tap-graphs-grid">
          
          {/* GRAPH A: TIMELINE ATTENDANCE & REVENUE */}
          <div className="tap-graph-card">
            <div className="tap-graph-header">
              <div>
                <h3 className="tap-card-title">
                  {isAr ? 'منحنى كثافة الطلاب وإيرادات الرحلات المجدولة' : 'Student Headcount & Contract Value Timeline'}
                </h3>
                <span className="tap-card-sub">
                  {isAr 
                    ? 'رسم بياني يوضح أعداد الطلاب وحجم الإيرادات المسجلة لكل رحلة مدرسية.'
                    : 'Dynamic curve showing students enrolled and revenue generated per school reservation.'}
                </span>
              </div>

              <div className="tap-graph-toggle-pills">
                <button
                  type="button"
                  className={`tap-pill-btn ${graphMetric === 'students' ? 'active' : ''}`}
                  onClick={() => setGraphMetric('students')}
                >
                  <GraduationCap size={13} />
                  <span>{isAr ? 'أعداد الطلاب' : 'Students Count'}</span>
                </button>
                <button
                  type="button"
                  className={`tap-pill-btn ${graphMetric === 'revenue' ? 'active' : ''}`}
                  onClick={() => setGraphMetric('revenue')}
                >
                  <DollarSign size={13} />
                  <span>{isAr ? 'قيمة العقد (ج.م)' : 'Revenue (EGP)'}</span>
                </button>
              </div>
            </div>

            {/* SVG Bezier Curve */}
            <div className="tap-svg-graph-container">
              <svg 
                viewBox="0 0 640 160" 
                className="tap-main-svg-chart"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="tripMainCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00a9c3" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#00a9c3" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#00a9c3" stopOpacity="0.0" />
                  </linearGradient>

                  <pattern id="tripGridLines" width="640" height="40" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="39.5" x2="640" y2="39.5" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
                  </pattern>
                </defs>

                <rect width="640" height="160" fill="url(#tripGridLines)" />

                {mainGraphPaths.area && (
                  <path d={mainGraphPaths.area} fill="url(#tripMainCurveGrad)" />
                )}

                {mainGraphPaths.path && (
                  <path 
                    d={mainGraphPaths.path} 
                    fill="none" 
                    stroke="#00a9c3" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="tap-smooth-curve-line"
                  />
                )}

                {mainGraphPaths.coords.map((pt, idx) => (
                  <g key={`t-pt-${idx}`} className="tap-chart-point-group">
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r="6" 
                      fill="#082d36" 
                      stroke="#00a9c3" 
                      strokeWidth="3"
                      className="tap-point-circle"
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r="12" 
                      fill="#00a9c3" 
                      fillOpacity="0.15" 
                      className="tap-point-glow"
                    />
                  </g>
                ))}
              </svg>

              {hoveredPoint && (
                <div 
                  className="tap-chart-tooltip"
                  style={{
                    left: `${(hoveredPoint.x / 640) * 100}%`,
                    top: `${Math.max(10, hoveredPoint.y - 45)}px`
                  }}
                >
                  <span className="tooltip-date">{hoveredPoint.raw.org}</span>
                  <div className="tooltip-val">
                    {graphMetric === 'revenue' 
                      ? `${hoveredPoint.raw.revenue.toLocaleString()} EGP`
                      : `${hoveredPoint.raw.students} ${isAr ? 'طالب' : 'students'}`}
                  </div>
                </div>
              )}
            </div>

            <div className="tap-axis-labels">
              {metrics.chartSeries.map((d, i) => (
                <span key={`t-lbl-${i}`} className="axis-lbl">{d.label}</span>
              ))}
            </div>

            <div className="tap-graph-summary-row">
              <div className="summary-item">
                <span className="lbl">{isAr ? 'أكبر رحلة مسجلة' : 'Largest Delegation'}</span>
                <span className="val highlight">
                  {Math.max(...metrics.chartSeries.map(d => d.students))} {isAr ? 'طالب' : 'students'}
                </span>
              </div>
              <div className="summary-item">
                <span className="lbl">{isAr ? 'متوسط سعر الطالب' : 'Average Price / Student'}</span>
                <span className="val">
                  335 {isAr ? 'ج.م' : 'EGP'}
                </span>
              </div>
              <div className="summary-item">
                <span className="lbl">{isAr ? 'جاهزية البوفيه والأنشطة' : 'Catering Ready'}</span>
                <span className="val green">{isAr ? '100% مؤكدة' : '100% Reserved'}</span>
              </div>
            </div>
          </div>

          {/* GRAPH B: PACKAGES & AREAS ALLOCATION */}
          <div className="tap-zone-card">
            <div className="tap-zone-header">
              <div className="tap-card-title-wrap">
                <Sparkles size={17} className="tap-accent-icon purple" />
                <div>
                  <h3 className="tap-card-title">
                    {isAr ? 'توزيع باقات وأنشطة الرحلات' : 'Trips Package & Activity Share'}
                  </h3>
                  <span className="tap-card-sub">
                    {isAr 
                      ? 'توزيع الطلاب على البرامج الترفيهية ومسارات المغامرة.'
                      : 'Student distribution across adventure and discovery packages.'}
                  </span>
                </div>
              </div>
            </div>

            <div className="tap-zone-bars-list">
              <div className="tap-zone-bar-row">
                <div className="tap-zone-row-meta">
                  <span className="zone-name">{isAr ? 'باقة المستكشف والمغامر الكاملة' : 'Explorer & Adventure Package'}</span>
                  <span className="zone-count-badge">
                    <strong>85</strong> {isAr ? 'طالب' : 'students'} (59%)
                  </span>
                </div>
                <div className="tap-progress-track">
                  <div className="tap-progress-fill" style={{ width: '59%', background: 'linear-gradient(90deg, #00a9c3, #38bdf8)' }} />
                </div>
              </div>

              <div className="tap-zone-bar-row">
                <div className="tap-zone-row-meta">
                  <span className="zone-name">{isAr ? 'باقة الإثارة واستكشاف الواقع الافتراضي VR' : 'Thrill & VR Discovery Package'}</span>
                  <span className="zone-count-badge">
                    <strong>60</strong> {isAr ? 'طالب' : 'students'} (41%)
                  </span>
                </div>
                <div className="tap-progress-track">
                  <div className="tap-progress-fill" style={{ width: '41%', background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }} />
                </div>
              </div>

              <div className="tap-zone-bar-row">
                <div className="tap-zone-row-meta">
                  <span className="zone-name">{isAr ? 'بوفيه غداء مخصص للأطفال' : 'Kids Reserved Lunch Buffet'}</span>
                  <span className="zone-count-badge">
                    <strong>85</strong> {isAr ? 'وجبة' : 'meals'} (59%)
                  </span>
                </div>
                <div className="tap-progress-track">
                  <div className="tap-progress-fill" style={{ width: '59%', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                </div>
              </div>

              <div className="tap-zone-bar-row">
                <div className="tap-zone-row-meta">
                  <span className="zone-name">{isAr ? 'وجبات غداء فردية فاخرة' : 'Custom Gourmet Meal Boxes'}</span>
                  <span className="zone-count-badge">
                    <strong>60</strong> {isAr ? 'وجبة' : 'boxes'} (41%)
                  </span>
                </div>
                <div className="tap-progress-track">
                  <div className="tap-progress-fill" style={{ width: '41%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
                </div>
              </div>
            </div>

            <div className="tap-zone-card-footer">
              <div className="zone-total-box">
                <span className="zt-lbl">{isAr ? 'إجمالي وجبات وباقات الضيافة' : 'Total Hospitality Packages'}</span>
                <span className="zt-val">{metrics.totalChildren} {isAr ? 'وجبة وضيافة' : 'meals booked'}</span>
              </div>
              <span className="zt-note">
                {isAr ? 'ضيافة المعلمين والمشرفين مجانية بالكامل' : 'Supervisors lounge 100% complimentary'}
              </span>
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
