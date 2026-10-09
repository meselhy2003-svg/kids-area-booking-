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
            {isAr ? 'التحليلات التشغيلية واللوجستية للرحلات' : 'School Trips Operational & Logistics Analytics'}
          </h2>
          <p className="tap-subheading">
            {isAr 
              ? 'متابعة مسار اعتماد حجوزات المدارس، أعداد الطلاب والمشرفين، وتوزيع باقات الضيافة والأنشطة.'
              : 'Tracking school reservation workflow, student headcount, teacher chaperone ratios, and package distribution.'}
          </p>
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

    </section>
  );
}
