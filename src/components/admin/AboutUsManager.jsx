import React, { useState, useEffect } from 'react';
import { 
  Info, 
  Save, 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  Globe, 
  Instagram, 
  Facebook, 
  Sparkles, 
  Check, 
  RotateCcw,
  Building2,
  ShieldCheck,
  Award,
  Users
} from 'lucide-react';
import './AboutUsManager.css';

const DEFAULT_ABOUT_DATA = {
  heroTitleEn: 'AMERICAN DREAM RESORT',
  heroTitleAr: 'منتجع أمريكان دريم الترفيهي',
  taglineEn: 'The Ultimate Family Fun & Adventure Destination in Ismailia',
  taglineAr: 'الوجهة الأولى للمرح والمغامرة العائلية في الإسماعيلية',
  storyEn: 'Founded with a passion for unforgettable moments, American Dream Ismailia brings together world-class family attractions, interactive arcade and VR zones, and gourmet dining right on the shores of Lake Timsah.',
  storyAr: 'تأسس منتجع أمريكان دريم بالإسماعيلية ليجمع بين أروع الألعاب الترفيهية العائلية، ومناطق الواقع الافتراضي والآركيد المبتكرة، والمطاعم الفاخرة على ضفاف بحيرة التمساح الساحرة.',
  visionEn: 'To be Egypt’s premier lakeside entertainment destination, creating joyful lifelong memories for children and families with top safety and hospitality.',
  visionAr: 'أن نكون الوجهة الترفيهية الشاطئية الرائدة في مصر، ونصنع ذكريات سعيدة تدوم للعائلات والأطفال بأعلى معايير الأمان والضيافة.',
  addressEn: 'Al Balagh Beach Road, Lake Timsah Coast, Ismailia, Egypt',
  addressAr: 'طريق شاطئ البلاغ، كورنيش بحيرة التمساح، الإسماعيلية، مصر',
  phone: '+20 100 000 0000',
  hotline: '19876',
  email: 'info@americandream.eg',
  openingHoursEn: 'Open Daily: 10:00 AM – 11:30 PM (Weekends until 1:00 AM)',
  openingHoursAr: 'يومياً: 10:00 صباحاً – 11:30 مساءً (العطلات حتى 1:00 صباحاً)',
  facebookUrl: 'https://facebook.com/americandreamismailia',
  instagramUrl: 'https://instagram.com/americandreamismailia',
  whatsappNumber: '+20 100 000 0000',
  stats: [
    { labelEn: 'Interactive Play Zones', labelAr: 'مناطق لعب تفاعلية', value: '4' },
    { labelEn: 'Games & Rides', labelAr: 'لعبة وتجربة ترفيهية', value: '50+' },
    { labelEn: 'Happy Families Hosted', labelAr: 'عائلة سعيدة تم استقبالها', value: '15,000+' },
    { labelEn: 'Safety & Hygiene Standard', labelAr: 'معيار أمان ونظافة معتمد', value: '100%' }
  ]
};

export default function AboutUsManager({ lang = 'ar' }) {
  const isAr = lang === 'ar';

  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('ados_about_us_content');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read about us from storage:', e);
    }
    return DEFAULT_ABOUT_DATA;
  });

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('ados_about_us_content', JSON.stringify(data));
      showToast(isAr ? 'تم حفظ التعديلات بنجاح!' : 'About Us details saved successfully!');
    } catch (e) {
      alert(isAr ? 'فشل حفظ البيانات' : 'Failed to save data');
    }
  };

  const handleReset = () => {
    if (window.confirm(isAr ? 'هل تريد استعادة البيانات الافتراضية؟' : 'Reset to default information?')) {
      setData(DEFAULT_ABOUT_DATA);
      localStorage.setItem('ados_about_us_content', JSON.stringify(DEFAULT_ABOUT_DATA));
      showToast(isAr ? 'تمت استعادة البيانات الافتراضية' : 'Default data restored');
    }
  };

  const handleStatChange = (index, field, value) => {
    setData(prev => {
      const updated = [...prev.stats];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, stats: updated };
    });
  };

  return (
    <div className={`aum-container ${isAr ? 'lang-ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="aum-toast">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="aum-header-row">
        <div>
          <h2 className="aum-title">{isAr ? 'إدارة محتوى (من نحن)' : 'About Us Content Management'}</h2>
          <p className="aum-subtitle">
            {isAr 
              ? 'تعديل رؤية المنتجع، القصة الرسمية، أرقام التواصل، ساعات العمل، ومواقع التواصل الاجتماعي.' 
              : 'Edit resort story, vision, contact details, operating hours, and social media presence.'}
          </p>
        </div>

        <div className="aum-actions-row">
          <button type="button" className="aum-reset-btn" onClick={handleReset}>
            <RotateCcw size={15} />
            <span>{isAr ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
          </button>
          <button type="button" className="aum-save-btn" onClick={handleSave}>
            <Save size={16} />
            <span>{isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="aum-form-layout">
        {/* Section 1: Hero Titles */}
        <div className="aum-card">
          <div className="aum-card-header">
            <Sparkles size={18} color="#efa31d" />
            <h3>{isAr ? 'العناوين والشعار الترويجي' : 'Resort Hero Titles & Slogan'}</h3>
          </div>
          <div className="aum-grid-2">
            <div className="aum-field">
              <label>{isAr ? 'اسم المنتجع الرئيسي (إنجليزي)' : 'Main Title (EN)'}</label>
              <input 
                type="text" 
                value={data.heroTitleEn} 
                onChange={e => setData({ ...data, heroTitleEn: e.target.value })} 
              />
            </div>
            <div className="aum-field">
              <label>{isAr ? 'اسم المنتجع الرئيسي (عربي)' : 'Main Title (AR)'}</label>
              <input 
                type="text" 
                value={data.heroTitleAr} 
                onChange={e => setData({ ...data, heroTitleAr: e.target.value })} 
              />
            </div>
            <div className="aum-field">
              <label>{isAr ? 'الشعار الترويجي (إنجليزي)' : 'Resort Tagline (EN)'}</label>
              <input 
                type="text" 
                value={data.taglineEn} 
                onChange={e => setData({ ...data, taglineEn: e.target.value })} 
              />
            </div>
            <div className="aum-field">
              <label>{isAr ? 'الشعار الترويجي (عربي)' : 'Resort Tagline (AR)'}</label>
              <input 
                type="text" 
                value={data.taglineAr} 
                onChange={e => setData({ ...data, taglineAr: e.target.value })} 
              />
            </div>
          </div>
        </div>

        {/* Section 2: Story & Vision */}
        <div className="aum-card">
          <div className="aum-card-header">
            <Info size={18} color="#0284c7" />
            <h3>{isAr ? 'القصة والرؤية' : 'Resort Story & Vision'}</h3>
          </div>
          <div className="aum-grid-2">
            <div className="aum-field">
              <label>{isAr ? 'قصة أمريكان دريم (إنجليزي)' : 'Our Story (EN)'}</label>
              <textarea 
                rows="4" 
                value={data.storyEn} 
                onChange={e => setData({ ...data, storyEn: e.target.value })} 
              />
            </div>
            <div className="aum-field">
              <label>{isAr ? 'قصة أمريكان دريم (عربي)' : 'Our Story (AR)'}</label>
              <textarea 
                rows="4" 
                value={data.storyAr} 
                onChange={e => setData({ ...data, storyAr: e.target.value })} 
              />
            </div>
            <div className="aum-field">
              <label>{isAr ? 'رؤيتنا ورسالتنا (إنجليزي)' : 'Our Vision (EN)'}</label>
              <textarea 
                rows="3" 
                value={data.visionEn} 
                onChange={e => setData({ ...data, visionEn: e.target.value })} 
              />
            </div>
            <div className="aum-field">
              <label>{isAr ? 'رؤيتنا ورسالتنا (عربي)' : 'Our Vision (AR)'}</label>
              <textarea 
                rows="3" 
                value={data.visionAr} 
                onChange={e => setData({ ...data, visionAr: e.target.value })} 
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Operating Hours */}
        <div className="aum-card">
          <div className="aum-card-header">
            <Clock size={18} color="#10b981" />
            <h3>{isAr ? 'بيانات التواصل وساعات العمل' : 'Contact Details & Operating Hours'}</h3>
          </div>
          <div className="aum-grid-2">
            <div className="aum-field">
              <label>{isAr ? 'العنوان (إنجليزي)' : 'Address (EN)'}</label>
              <input 
                type="text" 
                value={data.addressEn} 
                onChange={e => setData({ ...data, addressEn: e.target.value })} 
              />
            </div>
            <div className="aum-field">
              <label>{isAr ? 'العنوان (عربي)' : 'Address (AR)'}</label>
              <input 
                type="text" 
                value={data.addressAr} 
                onChange={e => setData({ ...data, addressAr: e.target.value })} 
              />
            </div>
            <div className="aum-field">
              <label>{isAr ? 'الخط الساخن' : 'Hotline'}</label>
              <input 
                type="text" 
                value={data.hotline} 
                onChange={e => setData({ ...data, hotline: e.target.value })} 
              />
            </div>
            <div className="aum-field">
              <label>{isAr ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}</label>
              <input 
                type="text" 
                value={data.phone} 
                onChange={e => setData({ ...data, phone: e.target.value })} 
              />
            </div>
            <div className="aum-field">
              <label>{isAr ? 'مواعيد العمل (إنجليزي)' : 'Operating Hours (EN)'}</label>
              <input 
                type="text" 
                value={data.openingHoursEn} 
                onChange={e => setData({ ...data, openingHoursEn: e.target.value })} 
              />
            </div>
            <div className="aum-field">
              <label>{isAr ? 'مواعيد العمل (عربي)' : 'Operating Hours (AR)'}</label>
              <input 
                type="text" 
                value={data.openingHoursAr} 
                onChange={e => setData({ ...data, openingHoursAr: e.target.value })} 
              />
            </div>
          </div>
        </div>

        {/* Section 4: Key Numerical Stats */}
        <div className="aum-card">
          <div className="aum-card-header">
            <Award size={18} color="#ec4899" />
            <h3>{isAr ? 'أرقام وإحصائيات المنتجع' : 'Resort Highlights & Key Figures'}</h3>
          </div>
          <div className="aum-stats-editor-grid">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="aum-stat-edit-box">
                <div className="aum-field">
                  <label>{isAr ? 'القيمة' : 'Value'}</label>
                  <input 
                    type="text" 
                    value={stat.value} 
                    onChange={e => handleStatChange(idx, 'value', e.target.value)} 
                    style={{ fontWeight: 800, color: '#003844' }}
                  />
                </div>
                <div className="aum-field">
                  <label>{isAr ? 'الوصف (عربي)' : 'Label (AR)'}</label>
                  <input 
                    type="text" 
                    value={stat.labelAr} 
                    onChange={e => handleStatChange(idx, 'labelAr', e.target.value)} 
                  />
                </div>
                <div className="aum-field">
                  <label>{isAr ? 'الوصف (إنجليزي)' : 'Label (EN)'}</label>
                  <input 
                    type="text" 
                    value={stat.labelEn} 
                    onChange={e => handleStatChange(idx, 'labelEn', e.target.value)} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="aum-bottom-bar">
          <button type="submit" className="aum-save-btn large">
            <Save size={18} />
            <span>{isAr ? 'حفظ ونشر التعديلات' : 'Save & Publish Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
