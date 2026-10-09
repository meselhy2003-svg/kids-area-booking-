import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Package as PackageIcon, 
  User, 
  Phone, 
  Calendar, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RotateCcw, 
  Copy, 
  Check, 
  X, 
  Layers,
  FileText,
  Clock
} from 'lucide-react';
import { buyingService } from '../../api/buyingService';
import './OrderDetailsUpdateForm.css';

/**
 * OrderDetailsUpdateForm Component
 * 
 * Production-ready Order Details & Update Form for Play Zone Orders in the Admin Dashboard.
 * Supports full bilingual Arabic (ar) & English (en) modes with RTL support.
 * 
 * @param {object} props
 * @param {object} props.order - The purchase order object (or API response { data: { ... } })
 * @param {function} [props.onSave] - Custom save handler: async (formData, orderId) => void
 * @param {function} [props.onClose] - Close/dismiss callback
 * @param {function} [props.onSuccess] - Callback executed on successful update
 * @param {string} [props.className] - Optional custom container class
 * @param {string} [props.lang] - Current language: 'ar' | 'en'
 */
export default function OrderDetailsUpdateForm({
  order,
  onSave,
  onClose,
  onSuccess,
  className = '',
  lang = 'ar'
}) {
  const isAr = lang === 'ar';

  // Extract normalized order document from API response structure
  const orderData = order?.data || order?.buying || order || {};

  // Target Order ID and identifiers
  const orderId = orderData._id || orderData.id || '';
  const orderCode = orderData.orderCode || orderData.code || 'N/A';
  const guestName = orderData.guestName || orderData.guest?.name || (isAr ? 'عميل زائر' : 'Guest Customer');
  const guestPhone = orderData.guestPhone || orderData.guest?.phone || (isAr ? 'لا يوجد هاتف' : 'No phone provided');
  const totalPrice = Number(orderData.totalPrice || 0);
  const totalPoints = Number(orderData.totalPoints || orderData.guest?.points || 0);
  const createdAt = orderData.createdAt;

  // Extract purchased tickets & packages arrays
  const ticketsList = Array.isArray(orderData.tickets) ? orderData.tickets : [];
  const packagesList = Array.isArray(orderData.packages) ? orderData.packages : [];

  // Form State for mutable fields
  const [formData, setFormData] = useState({
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    status: 'confirmed',
    used: false,
    notes: ''
  });

  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Synchronize form state when the order prop updates
  useEffect(() => {
    if (orderData && Object.keys(orderData).length > 0) {
      setFormData({
        paymentMethod: orderData.paymentMethod || 'cash',
        paymentStatus: orderData.paymentStatus || 'pending',
        status: orderData.status || 'confirmed',
        used: Boolean(orderData.used),
        notes: orderData.notes || ''
      });
      setSuccessMessage('');
      setErrorMessage('');
    }
  }, [orderData._id, orderData.orderCode]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMessage) setErrorMessage('');
  };

  // Toggle 'used' boolean
  const handleToggleUsed = () => {
    setFormData(prev => ({
      ...prev,
      used: !prev.used
    }));
  };

  // Reset form back to original order state
  const handleReset = () => {
    setFormData({
      paymentMethod: orderData.paymentMethod || 'cash',
      paymentStatus: orderData.paymentStatus || 'pending',
      status: orderData.status || 'confirmed',
      used: Boolean(orderData.used),
      notes: orderData.notes || ''
    });
    setErrorMessage('');
    setSuccessMessage(isAr ? 'تمت إعادة ضبط النموذج إلى بيانات الطلب الأصلية.' : 'Form reset to original order data.');
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  // Copy Order Code Helper
  const handleCopyCode = async () => {
    if (!orderCode || orderCode === 'N/A') return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(orderCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        status: formData.status,
        used: formData.used,
        notes: formData.notes
      };

      if (typeof onSave === 'function') {
        // Execute parent-provided handler
        await onSave(payload, orderId);
      } else {
        // Default: directly update purchase status via buyingService
        if (orderId) {
          await buyingService.updatePurchaseStatus(orderId, {
            paymentStatus: payload.paymentStatus,
            status: payload.status,
            notes: payload.notes
          });

          // If marked as used and was previously unused, trigger gate redemption
          if (payload.used && !orderData.used) {
            try {
              await buyingService.redeemPassById(orderId);
            } catch (redeemErr) {
              console.warn('[OrderDetailsUpdateForm] Redeem pass notice:', redeemErr.message);
            }
          }
        }
      }

      setSuccessMessage(isAr ? 'تم تحديث بيانات الطلب وحفظها بنجاح.' : 'Order details updated and saved successfully.');
      if (typeof onSuccess === 'function') {
        onSuccess(payload);
      }
    } catch (err) {
      console.error('[OrderDetailsUpdateForm] Save error:', err);
      setErrorMessage(
        err.message || (isAr ? 'فشل حفظ تعديلات الطلب. يرجى المحاولة مرة أخرى.' : 'Failed to save order updates. Please try again.')
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Format creation date nicely
  const formattedDate = createdAt ? (() => {
    try {
      const d = new Date(createdAt);
      return d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return String(createdAt);
    }
  })() : 'N/A';

  // Label helpers
  const getStatusLabel = (status) => {
    const s = String(status || '').toLowerCase();
    if (isAr) {
      if (s === 'confirmed') return 'مؤكد';
      if (s === 'pending') return 'قيد الانتظار';
      if (s === 'completed') return 'مكتمل';
      if (s === 'cancelled') return 'ملغي';
      return status;
    }
    return status;
  };

  const getPaymentStatusLabel = (status) => {
    const s = String(status || '').toLowerCase();
    if (isAr) {
      if (s === 'paid') return 'مدفوع ومؤكد';
      if (s === 'pending') return 'في انتظار الدفع';
      if (s === 'failed') return 'فشل الدفع';
      if (s === 'refunded') return 'مسترد';
      return status;
    }
    return status;
  };

  const getPaymentMethodLabel = (method) => {
    const m = String(method || '').toLowerCase();
    if (isAr) {
      if (m === 'cash') return 'نقداً';
      if (m === 'card') return 'بطاقة بنكية';
      if (m === 'instapay') return 'إنستاباي InstaPay';
      if (m === 'vodafone_cash') return 'فودافون كاش';
      if (m === 'points') return 'نقاط دريم';
      return method;
    }
    return method;
  };

  return (
    <div 
      className={`order-details-panel ${isAr ? 'lang-ar' : ''} ${className}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* ========================================================================= */}
      {/* 1. PANEL HEADER */}
      {/* ========================================================================= */}
      <div className="order-panel-header">
        <div className="order-header-left">
          <div className="order-badge-icon">
            <Layers size={24} />
          </div>
          <div className="order-header-title-wrap">
            <span className="order-header-subtitle">
              {isAr ? 'منطقة الألعاب • إدارة الطلبات' : 'Play Zone • Order Management'}
            </span>
            <h2 className="order-header-title">
              <span>{isAr ? 'تفاصيل الطلب' : 'Order Details'}</span>
              <button 
                type="button" 
                className="order-code-pill" 
                onClick={handleCopyCode}
                title={isAr ? 'انقر لنسخ كود الطلب' : 'Click to copy order code'}
                style={{ direction: 'ltr' }}
              >
                <span>{orderCode}</span>
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </h2>
          </div>
        </div>

        <div className="order-header-badges">
          <span className={`status-pill status-${(formData.status || 'confirmed').toLowerCase()}`}>
            <Clock size={13} />
            <span>{getStatusLabel(formData.status)}</span>
          </span>
          <span className={`status-pill status-${(formData.paymentStatus || 'pending').toLowerCase()}`}>
            <CreditCard size={13} />
            <span>{getPaymentStatusLabel(formData.paymentStatus)}</span>
          </span>
          <span className={`status-pill status-used-${formData.used}`}>
            <CheckCircle2 size={13} />
            <span>
              {isAr ? (formData.used ? 'تم الدخول' : 'غير مستخدم') : (formData.used ? 'Redeemed' : 'Unredeemed')}
            </span>
          </span>
          {onClose && (
            <button 
              type="button" 
              className="close-panel-btn" 
              onClick={onClose}
              aria-label={isAr ? 'إغلاق اللوحة' : 'Close panel'}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="order-panel-body">
        {/* Alerts / Feedback Banners */}
        {successMessage && (
          <div className="order-alert order-alert-success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="order-alert order-alert-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. READ-ONLY ORDER SUMMARY (CARDS GRID) */}
        {/* ========================================================================= */}
        <div className="order-summary-grid">
          {/* Customer Card */}
          <div className="summary-card">
            <div className="summary-card-icon customer">
              <User size={20} />
            </div>
            <div className="summary-card-content">
              <span className="summary-card-label">{isAr ? 'بيانات العميل' : 'Guest Customer'}</span>
              <span className="summary-card-value">{guestName}</span>
              <span className="summary-card-sub" style={{ direction: 'ltr', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={12} />
                <span>{guestPhone}</span>
              </span>
            </div>
          </div>

          {/* Total Price Card */}
          <div className="summary-card">
            <div className="summary-card-icon price">
              <CreditCard size={20} />
            </div>
            <div className="summary-card-content">
              <span className="summary-card-label">{isAr ? 'المبلغ الإجمالي' : 'Total Amount'}</span>
              <span className="summary-card-value">
                {totalPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
              </span>
              <span className="summary-card-sub">
                {isAr ? 'طريقة الدفع: ' : 'Method: '}
                <strong>{getPaymentMethodLabel(orderData.paymentMethod || 'cash')}</strong>
              </span>
            </div>
          </div>

          {/* Loyalty Points Card */}
          <div className="summary-card">
            <div className="summary-card-icon points">
              <Sparkles size={20} />
            </div>
            <div className="summary-card-content">
              <span className="summary-card-label">{isAr ? 'نقاط دريم' : 'Dream Points'}</span>
              <span className="summary-card-value">
                +{totalPoints.toLocaleString()} {isAr ? 'نقطة' : 'Pts'}
              </span>
              <span className="summary-card-sub">
                {isAr 
                  ? (formData.used ? 'الحالة: أضيفت للعميل' : 'الحالة: في انتظار المسح بالبوابة')
                  : (formData.used ? 'Status: Credited to Guest' : 'Status: Pending Gate Scan')}
              </span>
            </div>
          </div>

          {/* Creation Date Card */}
          <div className="summary-card">
            <div className="summary-card-icon calendar">
              <Calendar size={20} />
            </div>
            <div className="summary-card-content">
              <span className="summary-card-label">{isAr ? 'تاريخ الحجز' : 'Order Date'}</span>
              <span className="summary-card-value">{formattedDate}</span>
              <span className="summary-card-sub" style={{ direction: 'ltr', display: 'inline-block' }}>
                Ref ID: {orderId ? `#${orderId.slice(-6).toUpperCase()}` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PURCHASED TICKETS & PACKAGES TABLE */}
        {/* ========================================================================= */}
        <div className="order-items-section">
          <div className="order-items-header">
            <h3 className="order-items-title">
              <Ticket size={18} />
              <span>{isAr ? 'التذاكر والباقات المشتراة' : 'Purchased Passes & Packages'}</span>
            </h3>
            <span className="order-items-count-badge">
              {ticketsList.length + packagesList.length} {isAr ? 'عنصر' : 'Item(s)'}
            </span>
          </div>

          <div className="order-items-table-wrap">
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>{isAr ? 'النوع' : 'Type'}</th>
                  <th>{isAr ? 'اسم العنصر' : 'Item Title'}</th>
                  <th>{isAr ? 'الكمية' : 'Quantity'}</th>
                  <th>{isAr ? 'سعر الوحدة' : 'Unit Price'}</th>
                  <th>{isAr ? 'الإجمالي' : 'Subtotal'}</th>
                  <th>{isAr ? 'النقاط' : 'Points'}</th>
                </tr>
              </thead>
              <tbody>
                {/* Tickets Rows */}
                {ticketsList.map((item, idx) => {
                  const title = item.ticket?.titleAr && isAr 
                    ? item.ticket.titleAr 
                    : (item.ticket?.title || item.title || (isAr ? 'تذكرة ألعاب' : 'Play Zone Ticket'));
                  const qty = item.quantity || 1;
                  const unitPrice = item.unitPrice || item.ticket?.price || 0;
                  const itemTotal = item.totalPrice || (unitPrice * qty);
                  const points = item.pointsGets || item.ticket?.pointsGets || 0;

                  return (
                    <tr key={`ticket-${item.ticket?._id || idx}`}>
                      <td>
                        <span className="item-type-tag ticket">
                          <Ticket size={12} />
                          <span>{isAr ? 'تذكرة' : 'Ticket'}</span>
                        </span>
                      </td>
                      <td className="item-title-cell" title={title}>
                        {title}
                      </td>
                      <td><strong>{qty}x</strong></td>
                      <td>{Number(unitPrice).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</td>
                      <td><strong>{Number(itemTotal).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</strong></td>
                      <td>
                        <span className="item-points-tag">
                          <Sparkles size={11} />
                          +{points} {isAr ? 'نقطة' : 'pts'}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* Packages Rows */}
                {packagesList.map((pkg, idx) => {
                  const title = pkg.package?.titleAr && isAr 
                    ? pkg.package.titleAr 
                    : (pkg.title || pkg.package?.title || (isAr ? 'باقة مميزة' : 'Special Package'));
                  const qty = pkg.quantity || 1;
                  const unitPrice = pkg.unitPrice || pkg.package?.priceAfterDiscount || pkg.package?.price || 0;
                  const itemTotal = pkg.totalPrice || (unitPrice * qty);
                  const points = pkg.pointsGets || pkg.package?.pointsGets || 0;

                  return (
                    <tr key={`package-${pkg.package?._id || idx}`}>
                      <td>
                        <span className="item-type-tag package">
                          <PackageIcon size={12} />
                          <span>{isAr ? 'باقة' : 'Package'}</span>
                        </span>
                      </td>
                      <td className="item-title-cell" title={title}>
                        {title}
                      </td>
                      <td><strong>{qty}x</strong></td>
                      <td>{Number(unitPrice).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</td>
                      <td><strong>{Number(itemTotal).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</strong></td>
                      <td>
                        <span className="item-points-tag">
                          <Sparkles size={11} />
                          +{points} {isAr ? 'نقطة' : 'pts'}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* Empty State Fallback */}
                {ticketsList.length === 0 && packagesList.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                      {isAr 
                        ? 'لا توجد تذاكر أو باقات فردية مسجلة في هذا الطلب.' 
                        : 'No individual tickets or packages recorded in this order.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. EDITABLE UPDATE FORM */}
        {/* ========================================================================= */}
        <form className="order-form-card" onSubmit={handleSubmit}>
          <h3 className="order-form-title">
            <FileText size={18} />
            <span>{isAr ? 'تحديث حالة الطلب والدفع' : 'Update Order Status & Payment'}</span>
          </h3>

          <div className="order-form-grid">
            {/* Payment Method Select */}
            <div className="form-group">
              <label htmlFor="paymentMethod">
                <CreditCard size={14} />
                <span>{isAr ? 'طريقة الدفع' : 'Payment Method'}</span>
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                className="form-select"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="cash">{isAr ? 'نقداً (عند البوابة / الكاشير)' : 'Cash (On Counter / Gate)'}</option>
                <option value="card">{isAr ? 'بطاقة بنكية / فيزا / ماستركارد' : 'Credit / Debit Card'}</option>
                <option value="instapay">{isAr ? 'تحويل إنستاباي InstaPay' : 'InstaPay Transfer'}</option>
                <option value="vodafone_cash">{isAr ? 'فودافون كاش Vodafone Cash' : 'Vodafone Cash'}</option>
                <option value="points">{isAr ? 'استبدال نقاط دريم' : 'Dream Points'}</option>
              </select>
            </div>

            {/* Payment Status Select */}
            <div className="form-group">
              <label htmlFor="paymentStatus">
                <CheckCircle2 size={14} />
                <span>{isAr ? 'حالة الدفع' : 'Payment Status'}</span>
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                className="form-select"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                <option value="pending">{isAr ? 'في انتظار الدفع' : 'Pending Payment'}</option>
                <option value="paid">{isAr ? 'مدفوع ومؤكد' : 'Paid & Verified'}</option>
                <option value="failed">{isAr ? 'فشلت عملية الدفع' : 'Payment Failed'}</option>
                <option value="refunded">{isAr ? 'تم استرداد المبلغ' : 'Refunded'}</option>
              </select>
            </div>

            {/* Order Status Select */}
            <div className="form-group">
              <label htmlFor="status">
                <Clock size={14} />
                <span>{isAr ? 'حالة الطلب' : 'Order Status'}</span>
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                <option value="confirmed">{isAr ? 'مؤكد' : 'Confirmed'}</option>
                <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
                <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
              </select>
            </div>

            {/* Pass Used / Redeemed Toggle */}
            <div className="form-group">
              <label>{isAr ? 'تسجيل الدخول عند البوابة (الاستخدام)' : 'Gate Check-In (Redemption)'}</label>
              <div 
                className="toggle-field-wrap"
                onClick={handleToggleUsed}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') handleToggleUsed(); }}
              >
                <span className="toggle-label-text">
                  {isAr 
                    ? (formData.used ? 'تم استخدام التذكرة والدخول' : 'صالح وغير مستخدم (البوابة مفتوحة)')
                    : (formData.used ? 'Pass Redeemed (Used)' : 'Unused (Gate Open)')}
                </span>
                <div className={`toggle-switch-track ${formData.used ? 'active' : ''}`}>
                  <div className="toggle-switch-thumb" />
                </div>
              </div>
            </div>
          </div>

          {/* Notes Textarea */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="notes">
              <FileText size={14} />
              <span>{isAr ? 'ملاحظات الإدارة الداخلية / طلبات العميل' : 'Internal Admin Notes / Customer Requests'}</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-textarea"
              rows={3}
              placeholder={isAr 
                ? 'مثال: عميل VIP، تم التأكيد عند الكاشير، إيصال التحويل معتمد...' 
                : 'e.g. VIP guest, verified via cashier counter, payment receipt verified...'}
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Form Action Buttons */}
          <div className="order-form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              disabled={isSaving}
            >
              <RotateCcw size={15} />
              <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RotateCcw size={15} className="spin-icon" />
                  <span>{isAr ? 'جارٍ حفظ التعديلات...' : 'Saving Updates...'}</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>{isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Named alias export
export { OrderDetailsUpdateForm };
