import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Ticket, 
  Coins, 
  Grid, 
  Compass, 
  Headphones, 
  HelpCircle, 
  Camera, 
  Edit3, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  QrCode,
  Gift,
  ArrowRight,
  ShieldCheck,
  Users
} from 'lucide-react';
import './DesktopProfilePage.css';

export default function DesktopProfilePage({ 
  setActiveTab, 
  openModal, 
  lang = 'ar',
  initialView = 'overview'
}) {
  const isAr = lang === 'ar';
  const fileInputRef = useRef(null);

  // Active view: 'overview' (Image 2) | 'edit' (Image 3)
  const [currentView, setCurrentView] = useState(initialView);

  // Profile Data State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('american_dream_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Ahmed Mohamed',
      phone: '+20 101 234 5678',
      address: 'Canal Waterfront Road, Ferdan District, Ismailia',
      gender: 'male', // 'male' | 'female'
      passId: '#AD-84920',
      memberSince: 'March 2027',
      points: 1350,
      storeCredit: 135.00,
      avatar: '/photo/profile/ahmed-avatar-overview.png',
      avatarEdit: '/photo/profile/ahmed-avatar-edit.png'
    };
  });

  // Edit Form Temp State
  const [formData, setFormData] = useState({
    name: profile.name,
    phone: profile.phone,
    address: profile.address,
    gender: profile.gender
  });

  // Children State
  const [childrenList, setChildrenList] = useState(() => {
    const savedChildren = localStorage.getItem('american_dream_user_children');
    if (savedChildren) {
      try { return JSON.parse(savedChildren); } catch (e) {}
    }
    return [
      {
        id: 'child-1',
        name: 'Leila Ahmed',
        gender: 'female',
        age: 7,
        wristband: '#KW-01'
      }
    ];
  });

  // Modals state for sub-flows
  const [activeSubModal, setActiveSubModal] = useState(null); // 'booking' | 'rewards' | 'history' | 'support' | 'contact' | 'addChild' | 'editChild'
  const [editingChild, setEditingChild] = useState(null);
  const [newChildForm, setNewChildForm] = useState({ name: '', gender: 'female', age: 6 });
  const [toastMessage, setToastMessage] = useState('');

  // Persist Profile changes
  useEffect(() => {
    localStorage.setItem('american_dream_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('american_dream_user_children', JSON.stringify(childrenList));
  }, [childrenList]);

  // Show quick toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Avatar Upload Handler
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile(prev => ({
          ...prev,
          avatar: reader.result,
          avatarEdit: reader.result
        }));
        showToast(isAr ? 'تم تحديث الصورة الشخصية بنجاح!' : 'Profile avatar updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Personal Information Handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert(isAr ? 'يرجى كتابة الاسم الكامل' : 'Please enter your full name');
      return;
    }
    setProfile(prev => ({
      ...prev,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      gender: formData.gender
    }));

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    showToast(isAr ? 'تم حفظ التعديلات بنجاح!' : 'Profile updated successfully!');
    setCurrentView('overview');
  };

  // Add Child Handler
  const handleAddChildSubmit = (e) => {
    e.preventDefault();
    if (!newChildForm.name.trim()) {
      alert(isAr ? 'يرجى كتابة اسم الطفل' : 'Please enter child name');
      return;
    }
    const newId = `child-${Date.now()}`;
    const newWristband = `#KW-0${childrenList.length + 1}`;
    const newEntry = {
      id: newId,
      name: newChildForm.name.trim(),
      gender: newChildForm.gender,
      age: parseInt(newChildForm.age, 10) || 5,
      wristband: newWristband
    };
    setChildrenList(prev => [...prev, newEntry]);
    setActiveSubModal(null);
    setNewChildForm({ name: '', gender: 'female', age: 6 });
    showToast(isAr ? `تمت إضافة الطفل ${newEntry.name} وسوار الدخول ${newWristband}` : `Child ${newEntry.name} added with wristband ${newWristband}`);
  };

  // Edit Child Handler
  const handleEditChildSubmit = (e) => {
    e.preventDefault();
    if (!editingChild.name.trim()) return;
    setChildrenList(prev => prev.map(c => c.id === editingChild.id ? editingChild : c));
    setActiveSubModal(null);
    setEditingChild(null);
    showToast(isAr ? 'تم تحديث بيانات الطفل بنجاح!' : 'Child details updated!');
  };

  // Delete Child Handler
  const handleDeleteChild = (id, name) => {
    if (window.confirm(isAr ? `هل أنت متأكد من حذف بيانات ${name}؟` : `Are you sure you want to remove ${name}?`)) {
      setChildrenList(prev => prev.filter(c => c.id !== id));
      showToast(isAr ? 'تم الحذف بنجاح' : 'Child removed successfully');
    }
  };

  // Redeem Reward Handler
  const handleRedeemReward = (cost, title) => {
    if (profile.points < cost) {
      alert(isAr ? 'عذراً، رصيد نقاطك غير كافٍ لاسترداد هذه المكافأة' : 'Sorry, you do not have enough points for this reward');
      return;
    }
    setProfile(prev => ({
      ...prev,
      points: prev.points - cost,
      storeCredit: Math.max(0, ((prev.points - cost) * 0.1).toFixed(2))
    }));
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    showToast(isAr ? `تم استرداد قسيمة: ${title} بنجاح!` : `Voucher redeemed: ${title}!`);
  };

  return (
    <div className="profile-page-container" dir={isAr ? 'rtl' : 'ltr'}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#012b32',
          color: '#fde047',
          padding: '12px 24px',
          borderRadius: '999px',
          fontWeight: 800,
          fontSize: '0.9rem',
          zIndex: 99999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #f59e0b'
        }}>
          <Check size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="profile-page-inner">

        {/* ========================================================================= */}
        {/* VIEW 1: MAIN PROFILE OVERVIEW (Matching Image 2) */}
        {/* ========================================================================= */}
        {currentView === 'overview' && (
          <>
            {/* Header: Title + Subtitle + 'More Fun Ahmed!' Badge */}
            <div className="profile-main-header">
              <div className="profile-title-group">
                <h1>{isAr ? 'ملفي الشخصي' : 'My Profile'}</h1>
                <p>{isAr ? 'كل ما تحتاجه ليوم رائع وممتع في المنتزه' : 'Everything you need for an amazing day'}</p>
              </div>

              <div className="profile-fun-badge-wrap">
                <img 
                  src="/photo/profile/more-fun-badge-transparent.png" 
                  alt="More Fun Ahmed!" 
                  className="profile-fun-badge-img"
                  onError={(e) => {
                    // Fallback to stylized text if image missing
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement.querySelector('.profile-fun-script');
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <div className="profile-fun-script" style={{ display: 'none' }}>
                  <span className="script-top">More Fun</span>
                  <span className="script-bot">{profile.name.split(' ')[0]}!</span>
                </div>
              </div>
            </div>

            {/* Top User Card (Ahmed Mohamed + Welcome + Edit Info Button + Stats) */}
            <div className="profile-user-card">
              <div className="profile-user-left">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="profile-avatar-circle"
                  onError={(e) => { e.currentTarget.src = '/photo/kid area pic/icon/Symbol.png'; }}
                />
                <div className="profile-user-meta">
                  <h2 className="profile-user-name">{profile.name}</h2>
                  <p className="profile-welcome-text">
                    {isAr ? 'مرحباً بعودتك! Welcome back!' : 'Welcome back! مرحباً بعودتك!'}
                  </p>
                  <button 
                    className="profile-edit-btn"
                    onClick={() => {
                      setFormData({
                        name: profile.name,
                        phone: profile.phone,
                        address: profile.address,
                        gender: profile.gender
                      });
                      setCurrentView('edit');
                    }}
                  >
                    <span>{isAr ? 'تعديل بياناتك' : 'Edit your information'}</span>
                  </button>
                </div>
              </div>

              <div className="profile-user-stats">
                {/* Points Stat */}
                <div 
                  className="profile-stat-item"
                  onClick={() => setActiveSubModal('rewards')}
                  title={isAr ? 'عرض رصيد النقاط والمكافآت' : 'View Points & Rewards'}
                >
                  <div className="profile-stat-icon-wrap icon-green">
                    <Coins size={20} />
                  </div>
                  <div className="profile-stat-text-wrap">
                    <span className="profile-stat-value">{profile.points.toLocaleString()}</span>
                    <span className="profile-stat-label">{isAr ? 'نقطة Points' : 'Points نقطة'}</span>
                  </div>
                  <ChevronRight size={16} className="profile-stat-arrow" />
                </div>

                {/* Active Tickets Stat */}
                <div 
                  className="profile-stat-item"
                  onClick={() => setActiveSubModal('booking')}
                  title={isAr ? 'عرض التذاكر المفعلة' : 'View Active Tickets'}
                >
                  <div className="profile-stat-icon-wrap icon-cyan">
                    <Ticket size={20} />
                  </div>
                  <div className="profile-stat-text-wrap">
                    <span className="profile-stat-value">3</span>
                    <span className="profile-stat-label">{isAr ? 'تذاكر مفعلة Active Tickets' : 'Active Tickets تذاكر مفعلة'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Grid: Today's Booking & Points / Cashback */}
            <div className="profile-grid-2cols">
              {/* Card 1: Today's Booking */}
              <div className="profile-card">
                <div>
                  <div className="profile-card-header">
                    <div className="profile-card-icon-box box-blue">
                      <Calendar size={20} />
                    </div>
                    <div className="profile-card-titles">
                      <h3>{isAr ? 'حجزي اليوم' : "Today's Booking"}</h3>
                      <p>{isAr ? "Today's Booking" : 'حجزي اليوم'}</p>
                    </div>
                  </div>

                  <div className="profile-card-content-row" style={{ marginTop: '16px' }}>
                    <div>
                      <div className="profile-activity-value">
                        {isAr ? '٢ نشاط وفعالية' : '2 Activities'}
                      </div>
                      <div className="profile-activity-sub">
                        {isAr ? 'تبدأ من ٣:٠٠ مساءً' : 'from 3:00 PM'}
                      </div>
                    </div>
                    <button 
                      className="profile-row-arrow-btn"
                      onClick={() => setActiveSubModal('booking')}
                      aria-label="View Booking Arrow"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <button 
                  className="profile-action-btn-gold"
                  onClick={() => setActiveSubModal('booking')}
                >
                  <span>{isAr ? 'عرض الحجز' : 'View Booking'}</span>
                  <span style={{ opacity: 0.8, fontSize: '0.8rem' }}>
                    {isAr ? 'View Booking' : 'عرض الحجز'}
                  </span>
                </button>
              </div>

              {/* Card 2: Points / Cashback */}
              <div className="profile-card">
                <div>
                  <div className="profile-card-header">
                    <div className="profile-card-icon-box box-cyan">
                      <Coins size={20} />
                    </div>
                    <div className="profile-card-titles">
                      <h3>{isAr ? 'نقاط / استرداد نقدي' : 'Points / Cashback'}</h3>
                      <p>{isAr ? 'Points / Cashback' : 'نقاط / استرداد نقدي'}</p>
                    </div>
                  </div>

                  <div className="profile-card-content-row" style={{ marginTop: '16px' }}>
                    <div>
                      <div className="profile-activity-value">
                        {profile.points.toLocaleString()} {isAr ? 'نقطة' : 'Points'}
                      </div>
                      <div className="profile-activity-sub">
                        = EGP {profile.storeCredit.toFixed(0)}
                      </div>
                    </div>
                    <button 
                      className="profile-row-arrow-btn"
                      onClick={() => setActiveSubModal('rewards')}
                      aria-label="View Rewards Arrow"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <button 
                  className="profile-action-btn-gold"
                  onClick={() => setActiveSubModal('rewards')}
                >
                  <span>{isAr ? 'عرض المكافآت' : 'View Rewards'}</span>
                  <span style={{ opacity: 0.8, fontSize: '0.8rem' }}>
                    {isAr ? 'View Rewards' : 'عرض المكافآت'}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Grid: Booking History & Quick Actions */}
            <div className="profile-grid-2cols">
              {/* Card 3: Booking History */}
              <div className="profile-card">
                <div>
                  <div className="profile-card-header">
                    <div className="profile-card-icon-box box-teal">
                      <Clock size={20} />
                    </div>
                    <div className="profile-card-titles">
                      <h3>{isAr ? 'سجل الحجوزات' : 'Booking History'} <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.85rem' }}>{isAr ? 'Booking History' : 'سجل الحجوزات'}</span></h3>
                      <p>{isAr ? 'عرض وإدارة زياراتك السابقة' : 'View and manage your past visits'}</p>
                    </div>
                  </div>

                  {/* 3 Past Visits */}
                  <div className="profile-history-list" style={{ marginTop: '16px' }}>
                    {/* Item 1 */}
                    <div 
                      className="profile-history-item"
                      onClick={() => setActiveSubModal('history')}
                    >
                      <div className="profile-history-left">
                        <img 
                          src="/photo/profile/thumb-funpark.png" 
                          alt="Fun Park" 
                          className="profile-history-thumb"
                          onError={(e) => { e.currentTarget.src = '/photo/kid area pic/Image (1).png'; }}
                        />
                        <div className="profile-history-details">
                          <h4>Fun Park – Family Pack</h4>
                          <p>12 Sep 2026 • 3 Tickets</p>
                        </div>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </div>

                    {/* Item 2 */}
                    <div 
                      className="profile-history-item"
                      onClick={() => setActiveSubModal('history')}
                    >
                      <div className="profile-history-left">
                        <img 
                          src="/photo/profile/thumb-adventure.png" 
                          alt="Adventure Zone" 
                          className="profile-history-thumb"
                          onError={(e) => { e.currentTarget.src = '/photo/kid area pic/Image (2).png'; }}
                        />
                        <div className="profile-history-details">
                          <h4>Adventure Zone – Single</h4>
                          <p>05 Sep 2026 • 2 Tickets</p>
                        </div>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </div>

                    {/* Item 3 */}
                    <div 
                      className="profile-history-item"
                      onClick={() => setActiveSubModal('history')}
                    >
                      <div className="profile-history-left">
                        <img 
                          src="/photo/profile/thumb-kidsarea.png" 
                          alt="Kids Area" 
                          className="profile-history-thumb"
                          onError={(e) => { e.currentTarget.src = '/photo/kid area pic/Image (3).png'; }}
                        />
                        <div className="profile-history-details">
                          <h4>Kids Area – Single</h4>
                          <p>28 Aug 2026 • 1 Ticket</p>
                        </div>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </div>
                  </div>
                </div>

                <button 
                  className="profile-see-all-link"
                  onClick={() => setActiveSubModal('history')}
                >
                  <span>{isAr ? 'عرض كل الحجوزات See All Bookings' : 'See All Bookings عرض كل الحجوزات'}</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Card 4: Quick Actions */}
              <div className="profile-card">
                <div>
                  <div className="profile-card-header">
                    <div className="profile-card-icon-box box-teal">
                      <Grid size={20} />
                    </div>
                    <div className="profile-card-titles">
                      <h3>{isAr ? 'إجراءات سريعة' : 'Quick Actions'} <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.85rem' }}>{isAr ? 'Quick Actions' : 'إجراءات سريعة'}</span></h3>
                      <p>{isAr ? 'خدمات الحجز والدعم المباشر' : 'Instant booking & support access'}</p>
                    </div>
                  </div>

                  <div className="profile-quick-actions-grid" style={{ marginTop: '16px' }}>
                    {/* Buy Tickets */}
                    <div 
                      className="profile-quick-action-card"
                      onClick={() => setActiveTab('kids-area')}
                    >
                      <div className="profile-quick-action-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                        <Ticket size={20} />
                      </div>
                      <h4 className="action-title">{isAr ? 'شراء التذاكر' : 'Buy Tickets'}</h4>
                      <p className="action-sub">{isAr ? 'Buy Tickets' : 'شراء التذاكر'}</p>
                    </div>

                    {/* Explore Zones */}
                    <div 
                      className="profile-quick-action-card"
                      onClick={() => setActiveTab('home')}
                    >
                      <div className="profile-quick-action-icon-wrap" style={{ background: '#ccfbf1', color: '#0d9488' }}>
                        <Compass size={20} />
                      </div>
                      <h4 className="action-title">{isAr ? 'استكشف المناطق' : 'Explore Zones'}</h4>
                      <p className="action-sub">{isAr ? 'Explore Zones' : 'استكشف المناطق'}</p>
                    </div>

                    {/* Contact Us */}
                    <div 
                      className="profile-quick-action-card"
                      onClick={() => setActiveSubModal('contact')}
                    >
                      <div className="profile-quick-action-icon-wrap" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                        <Headphones size={20} />
                      </div>
                      <h4 className="action-title">{isAr ? 'تواصل معنا' : 'Contact Us'}</h4>
                      <p className="action-sub">{isAr ? 'Contact Us' : 'تواصل معنا'}</p>
                    </div>

                    {/* Help & Support */}
                    <div 
                      className="profile-quick-action-card"
                      onClick={() => setActiveSubModal('support')}
                    >
                      <div className="profile-quick-action-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                        <HelpCircle size={20} />
                      </div>
                      <h4 className="action-title">{isAr ? 'المساعدة والدعم' : 'Help & Support'}</h4>
                      <p className="action-sub">{isAr ? 'Help & Support' : 'المساعدة والدعم'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotional Banner: Thank You */}
            <div className="profile-thankyou-banner">
              <div className="profile-thankyou-left">
                <span className="profile-thankyou-script">Thank You</span>
                <h3 className="profile-thankyou-title">
                  for being part of the American Dream Family!
                </h3>
                <p className="profile-thankyou-arabic">
                  !شكراً لكونك جزءاً من عائلة أمريكان دريم
                </p>
              </div>

              <div className="profile-thankyou-badges">
                <div className="profile-badge-pill badge-teal">GOOD FRIENDS</div>
                <div className="profile-badge-pill badge-orange">BIGGER THRILLS</div>
                <div className="profile-badge-pill badge-cyan">BRIGHTER SMILES</div>
              </div>

              <img 
                src="/photo/logo/logo nav bar and footer.png" 
                alt="American Dream" 
                className="profile-thankyou-logo" 
                onError={(e) => { e.currentTarget.src = '/photo/logo nav bar and footer.png'; }}
              />
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: EDIT PROFILE / PERSONAL INFORMATION (Matching Image 3) */}
        {/* ========================================================================= */}
        {currentView === 'edit' && (
          <>
            {/* Top Profile Header Card with Avatar + Camera Icon + Dream Points Badge */}
            <div className="profile-edit-header-card">
              <div className="profile-edit-user-wrap">
                <div 
                  className="profile-avatar-upload-wrap"
                  onClick={() => fileInputRef.current?.click()}
                  title={isAr ? 'تغيير الصورة الشخصية' : 'Change profile photo'}
                >
                  <img 
                    src={profile.avatarEdit || profile.avatar} 
                    alt={profile.name} 
                    className="profile-avatar-large"
                    onError={(e) => { e.currentTarget.src = '/photo/profile/ahmed-avatar-overview.png'; }}
                  />
                  <div className="profile-camera-badge">
                    <Camera size={15} />
                  </div>
                </div>

                <div className="profile-edit-meta">
                  <h2>{profile.name}</h2>
                  <div className="profile-meta-sub">
                    <Calendar size={14} color="#64748b" />
                    <span>Member since {profile.memberSince} • Pass ID: {profile.passId}</span>
                  </div>
                  <div className="profile-meta-tag">
                    <Users size={14} />
                    <span>{childrenList.length} {isAr ? 'أطفال مسجلين' : 'Registered Children'}</span>
                  </div>
                </div>
              </div>

              {/* Dream Points Box on Right */}
              <div className="profile-points-card-beige">
                <div className="dream-points-badge">
                  <span>$</span>
                  <span>DREAM POINTS</span>
                </div>
                <div className="dream-points-value">
                  {profile.points.toLocaleString()} <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Pts</span>
                </div>
                <div className="dream-points-credit">
                  Store Credit Equivalent: <strong>EGP {profile.storeCredit.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Two Columns: Personal Information & Children */}
            <div className="profile-grid-2cols">
              {/* Left Column: Personal Information Form */}
              <div className="profile-card">
                <div>
                  <div className="profile-card-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="profile-card-icon-box box-teal">
                        <User size={20} />
                      </div>
                      <div className="profile-card-titles">
                        <h3>{isAr ? 'المعلومات الشخصية' : 'Personal Information'}</h3>
                        <p>{isAr ? 'تحديث بيانات حسابك وعنوان إقامتك بالقناة' : 'Update your account credentials and Suez Canal residence address'}</p>
                      </div>
                    </div>
                    <div className="profile-verified-badge">
                      VERIFIED
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} style={{ marginTop: '20px' }}>
                    {/* Full Name */}
                    <div className="profile-form-group">
                      <label className="profile-form-label">
                        {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                      </label>
                      <div className="profile-input-wrap">
                        <User size={18} className="profile-input-icon" />
                        <input 
                          type="text" 
                          className="profile-input-field"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                          placeholder={isAr ? 'الاسم الكامل' : 'Full Name'}
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="profile-form-group">
                      <label className="profile-form-label">
                        {isAr ? 'رقم الهاتف *' : 'Phone Number *'}
                      </label>
                      <div className="profile-input-wrap">
                        <Phone size={18} className="profile-input-icon" />
                        <input 
                          type="tel" 
                          className="profile-input-field"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                          placeholder="+20 101 234 5678"
                        />
                        <div className="profile-sms-badge">
                          <Check size={12} />
                          <span>SMS Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Address / City District */}
                    <div className="profile-form-group">
                      <label className="profile-form-label">
                        {isAr ? 'العنوان / الحي والمدينة' : 'Address / City District'}
                      </label>
                      <div className="profile-input-wrap">
                        <MapPin size={18} className="profile-input-icon" />
                        <input 
                          type="text" 
                          className="profile-input-field"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder={isAr ? 'العنوان' : 'Address'}
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="profile-form-group">
                      <label className="profile-form-label">
                        {isAr ? 'النوع / الجنس' : 'Gender'}
                      </label>
                      <div className="profile-gender-toggles">
                        <button
                          type="button"
                          className={`profile-gender-btn ${formData.gender === 'male' ? 'active' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, gender: 'male' }))}
                        >
                          <span>♂</span>
                          <span>{isAr ? 'ذكر' : 'Male'}</span>
                        </button>
                        <button
                          type="button"
                          className={`profile-gender-btn ${formData.gender === 'female' ? 'active' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, gender: 'female' }))}
                        >
                          <span>♀</span>
                          <span>{isAr ? 'أنثى' : 'Female'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Form Action Buttons */}
                    <div className="profile-form-actions">
                      <button 
                        type="button"
                        className="profile-btn-cancel"
                        onClick={() => setCurrentView('overview')}
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button 
                        type="submit"
                        className="profile-btn-save"
                      >
                        <Check size={16} />
                        <span>{isAr ? 'حفظ التغييرات' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Children Management Card */}
              <div className="profile-card">
                <div>
                  <div className="profile-card-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="profile-card-icon-box box-teal">
                        <Users size={20} />
                      </div>
                      <div className="profile-card-titles">
                        <h3>{isAr ? 'الأطفال المسجلين' : 'Children'}</h3>
                      </div>
                    </div>

                    <button 
                      className="profile-add-child-btn"
                      onClick={() => setActiveSubModal('addChild')}
                    >
                      <Plus size={14} />
                      <span>{isAr ? 'إضافة طفل' : '+ Add Child'}</span>
                    </button>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '8px 0 16px 0', lineHeight: 1.5 }}>
                    {isAr 
                      ? 'إدارة أفراد العائلة للحصول على تجارب مخصصة في المنتزه، والتحقق من أطوال الألعاب، ومزايا أعياد الميلاد.'
                      : 'Manage your family members for personalized park experiences, attraction height clearances, and birthday perks.'}
                  </p>

                  {/* Children List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {childrenList.map((child) => (
                      <div key={child.id} className="profile-child-card">
                        <div className="profile-child-top">
                          <div className="profile-child-info-wrap">
                            <div className="profile-child-avatar-circle">
                              <span>👶</span>
                            </div>
                            <div>
                              <div className="profile-child-name-row">
                                <h4 className="profile-child-name">{child.name}</h4>
                                <span className={`profile-child-gender-tag ${child.gender === 'male' ? 'boy' : ''}`}>
                                  {child.gender === 'female' ? '♀ Female' : '♂ Male'}
                                </span>
                              </div>
                              <p className="profile-child-age">
                                <span>🎂</span>
                                <span>{child.age} {isAr ? 'سنوات' : 'Years old'}</span>
                              </p>
                            </div>
                          </div>

                          <div className="profile-child-actions">
                            <button 
                              className="profile-child-icon-btn"
                              onClick={() => {
                                setEditingChild(child);
                                setActiveSubModal('editChild');
                              }}
                              title={isAr ? 'تعديل' : 'Edit'}
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              className="profile-child-icon-btn delete"
                              onClick={() => handleDeleteChild(child.id, child.name)}
                              title={isAr ? 'حذف' : 'Delete'}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="profile-wristband-pill">
                          <span>Wristband: {child.wristband}</span>
                        </div>
                      </div>
                    ))}

                    {childrenList.length === 0 && (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px' }}>
                        {isAr ? 'لم تتم إضافة أطفال بعد. انقر على "إضافة طفل" بالأعلى.' : 'No registered children yet. Click "+ Add Child" above.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE SUB-MODALS */}
      {/* ========================================================================= */}

      {/* 1. TODAY'S BOOKING MODAL */}
      {activeSubModal === 'booking' && (
        <div className="profile-modal-backdrop" onClick={() => setActiveSubModal(null)}>
          <div className="profile-modal-card" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={20} color="#f59e0b" />
                <h3>{isAr ? 'تفاصيل حجز اليوم' : "Today's Active Booking"}</h3>
              </div>
              <button className="profile-modal-close-btn" onClick={() => setActiveSubModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="profile-modal-body">
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Booking ID: #AD-94821</span>
                  <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>ACTIVE TODAY</span>
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#0f172a' }}>2 Activities Reserved</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Gates open at 3:00 PM • FastTrack Entry included</p>
              </div>

              {/* Activity 1 */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                  <Ticket size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Fun Park & Bumper Bay</h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>3:00 PM – 5:30 PM • Wristbands #KW-01 & Parent</p>
                </div>
              </div>

              {/* Activity 2 */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d9488' }}>
                  <Compass size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Kids Area Ball Pit & Soft Play</h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>6:00 PM – 8:00 PM • Zone B</p>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                <QrCode size={120} style={{ margin: '0 auto', color: '#012b32' }} />
                <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Show this barcode at the entrance turnstiles</p>
              </div>

              <button 
                className="profile-action-btn-gold"
                onClick={() => {
                  showToast(isAr ? 'تم حفظ الحجز بالتقويم!' : 'Saved to your device calendar!');
                  setActiveSubModal(null);
                }}
              >
                {isAr ? 'إضافة إلى التقويم' : 'Add to Calendar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. POINTS & REWARDS MODAL */}
      {activeSubModal === 'rewards' && (
        <div className="profile-modal-backdrop" onClick={() => setActiveSubModal(null)}>
          <div className="profile-modal-card" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Coins size={20} color="#f59e0b" />
                <h3>{isAr ? 'نقاط المكافآت والاسترداد' : 'Dream Points & Rewards'}</h3>
              </div>
              <button className="profile-modal-close-btn" onClick={() => setActiveSubModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="profile-modal-body">
              <div style={{ background: 'linear-gradient(135deg, #012b32, #004655)', color: '#ffffff', padding: '18px', borderRadius: '14px' }}>
                <span style={{ fontSize: '0.8rem', color: '#99f6e4' }}>CURRENT AVAILABLE BALANCE</span>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fde047', margin: '4px 0' }}>
                  {profile.points.toLocaleString()} <span style={{ fontSize: '1.1rem' }}>Pts</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#e0f2fe' }}>
                  Store Credit Equivalent: <strong>EGP {profile.storeCredit.toFixed(2)}</strong>
                </div>
              </div>

              <h4 style={{ margin: '8px 0 0 0', fontSize: '0.95rem' }}>{isAr ? 'المكافآت المتاحة للاسترداد فوراً:' : 'Available Rewards to Redeem:'}</h4>

              {/* Reward 1 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.9rem' }}>🍦 Free Gelato Ice Cream Scoop</h5>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Cost: 300 Points • Restaurant & Cafe</p>
                </div>
                <button 
                  className="profile-edit-btn" 
                  style={{ alignSelf: 'center', margin: 0 }}
                  onClick={() => handleRedeemReward(300, 'Free Gelato Ice Cream Scoop')}
                >
                  {isAr ? 'استرداد' : 'Redeem'}
                </button>
              </div>

              {/* Reward 2 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.9rem' }}>🎮 50 EGP Arcade Game Card Balance</h5>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Cost: 500 Points • Challenge Zone</p>
                </div>
                <button 
                  className="profile-edit-btn" 
                  style={{ alignSelf: 'center', margin: 0 }}
                  onClick={() => handleRedeemReward(500, '50 EGP Arcade Game Card Balance')}
                >
                  {isAr ? 'استرداد' : 'Redeem'}
                </button>
              </div>

              {/* Reward 3 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.9rem' }}>⏰ +1 Free Extra Hour in Kids Area</h5>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Cost: 750 Points • Kids Soft Play</p>
                </div>
                <button 
                  className="profile-edit-btn" 
                  style={{ alignSelf: 'center', margin: 0 }}
                  onClick={() => handleRedeemReward(750, '+1 Free Extra Hour in Kids Area')}
                >
                  {isAr ? 'استرداد' : 'Redeem'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BOOKING HISTORY MODAL */}
      {activeSubModal === 'history' && (
        <div className="profile-modal-backdrop" onClick={() => setActiveSubModal(null)}>
          <div className="profile-modal-card" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} color="#f59e0b" />
                <h3>{isAr ? 'سجل الحجوزات السابقة' : 'Past Booking History'}</h3>
              </div>
              <button className="profile-modal-close-btn" onClick={() => setActiveSubModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="profile-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Fun Park – Family Pack</strong>
                    <span style={{ color: '#059669', fontWeight: 800 }}>Completed</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    12 Sep 2026 • 3 Tickets • Paid: 380 EGP • Receipt #INV-8491
                  </div>
                </div>

                <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Adventure Zone – Single Pass</strong>
                    <span style={{ color: '#059669', fontWeight: 800 }}>Completed</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    05 Sep 2026 • 2 Tickets • Paid: 240 EGP • Receipt #INV-7910
                  </div>
                </div>

                <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Kids Area – Single Pass</strong>
                    <span style={{ color: '#059669', fontWeight: 800 }}>Completed</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    28 Aug 2026 • 1 Ticket • Paid: 120 EGP • Receipt #INV-6542
                  </div>
                </div>
              </div>

              <button 
                className="profile-action-btn-gold"
                onClick={() => {
                  setActiveSubModal(null);
                  setActiveTab('kids-area');
                }}
              >
                {isAr ? 'حجز باقة جديدة الآن' : 'Book a New Pass Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONTACT MODAL */}
      {activeSubModal === 'contact' && (
        <div className="profile-modal-backdrop" onClick={() => setActiveSubModal(null)}>
          <div className="profile-modal-card" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Headphones size={20} color="#f59e0b" />
                <h3>{isAr ? 'تواصل مع فريق أمريكان دريم' : 'Contact American Dream Concierge'}</h3>
              </div>
              <button className="profile-modal-close-btn" onClick={() => setActiveSubModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="profile-modal-body">
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                {isAr ? 'فريق خدمة العملاء متاح يومياً من ٩:٠٠ صباحاً حتى ١١:٠٠ مساءً' : 'Our guest experience team is available daily from 9:00 AM to 11:00 PM.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a 
                  href="https://wa.me/201012345678" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#ecfdf5', borderRadius: '12px', textDecoration: 'none', color: '#059669', fontWeight: 800 }}
                >
                  <span>💬</span>
                  <span>WhatsApp VIP Concierge (+20 101 234 5678)</span>
                </a>

                <a 
                  href="tel:+201012345678"
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#f0f9ff', borderRadius: '12px', textDecoration: 'none', color: '#0284c7', fontWeight: 800 }}
                >
                  <Phone size={18} />
                  <span>Call Reception Hotline (19876)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. HELP & SUPPORT MODAL */}
      {activeSubModal === 'support' && (
        <div className="profile-modal-backdrop" onClick={() => setActiveSubModal(null)}>
          <div className="profile-modal-card" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HelpCircle size={20} color="#f59e0b" />
                <h3>{isAr ? 'المساعدة والأسئلة الشائعة' : 'Help & Support FAQ'}</h3>
              </div>
              <button className="profile-modal-close-btn" onClick={() => setActiveSubModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="profile-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a' }}>{isAr ? 'كيف يتم تفعيل الأساور الإلكترونية للأطفال؟' : 'How are children wristbands activated?'}</h5>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    {isAr ? 'عند شباك الاستقبال الرئيسي ببوابة الدخول، يتم ربط السوار برقم حسابك وبطاقتك فوريًا.' : 'Wristbands are automatically synced and handed over at the VIP reception desk upon scanning your profile code.'}
                  </p>
                </div>

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a' }}>{isAr ? 'هل النقاط تنتهي صلاحيتها؟' : 'Do Dream Points expire?'}</h5>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    {isAr ? 'نقاط أمريكان دريم صالحة لمدة عام كامل من تاريخ الحصول عليها.' : 'Dream Points remain valid for a full calendar year from the date earned.'}
                  </p>
                </div>

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a' }}>{isAr ? 'هل يمكن تعديل تاريخ الحجز؟' : 'Can I reschedule my booking?'}</h5>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    {isAr ? 'نعم، يمكنك تغيير الموعد حتى ساعتين قبل توقيت الحجز مجاناً عبر التواصل معنا.' : 'Yes, you can reschedule free of charge up to 2 hours before your scheduled arrival time.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. ADD CHILD MODAL */}
      {activeSubModal === 'addChild' && (
        <div className="profile-modal-backdrop" onClick={() => setActiveSubModal(null)}>
          <div className="profile-modal-card" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={20} color="#f59e0b" />
                <h3>{isAr ? 'إضافة طفل جديد' : 'Add New Child'}</h3>
              </div>
              <button className="profile-modal-close-btn" onClick={() => setActiveSubModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="profile-modal-body">
              <form onSubmit={handleAddChildSubmit}>
                <div className="profile-form-group">
                  <label className="profile-form-label">{isAr ? 'اسم الطفل *' : 'Child Full Name *'}</label>
                  <input 
                    type="text" 
                    className="profile-input-field" 
                    value={newChildForm.name} 
                    onChange={e => setNewChildForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={isAr ? 'مثال: ليلى أحمد' : 'e.g. Leila Ahmed'} 
                    required 
                  />
                </div>

                <div className="profile-form-group">
                  <label className="profile-form-label">{isAr ? 'العمر (بالسنوات) *' : 'Age (Years) *'}</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="16" 
                    className="profile-input-field" 
                    value={newChildForm.age} 
                    onChange={e => setNewChildForm(prev => ({ ...prev, age: e.target.value }))}
                    required 
                  />
                </div>

                <div className="profile-form-group">
                  <label className="profile-form-label">{isAr ? 'النوع' : 'Gender'}</label>
                  <div className="profile-gender-toggles">
                    <button 
                      type="button" 
                      className={`profile-gender-btn ${newChildForm.gender === 'female' ? 'active' : ''}`}
                      onClick={() => setNewChildForm(prev => ({ ...prev, gender: 'female' }))}
                    >
                      ♀ {isAr ? 'أنثى' : 'Female'}
                    </button>
                    <button 
                      type="button" 
                      className={`profile-gender-btn ${newChildForm.gender === 'male' ? 'active' : ''}`}
                      onClick={() => setNewChildForm(prev => ({ ...prev, gender: 'male' }))}
                    >
                      ♂ {isAr ? 'ذكر' : 'Male'}
                    </button>
                  </div>
                </div>

                <div className="profile-form-actions">
                  <button type="button" className="profile-btn-cancel" onClick={() => setActiveSubModal(null)}>
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button type="submit" className="profile-btn-save">
                    <Check size={16} />
                    <span>{isAr ? 'حفظ الطفل' : 'Save Child'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 7. EDIT CHILD MODAL */}
      {activeSubModal === 'editChild' && editingChild && (
        <div className="profile-modal-backdrop" onClick={() => setActiveSubModal(null)}>
          <div className="profile-modal-card" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit3 size={20} color="#f59e0b" />
                <h3>{isAr ? 'تعديل بيانات الطفل' : 'Edit Child Information'}</h3>
              </div>
              <button className="profile-modal-close-btn" onClick={() => setActiveSubModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="profile-modal-body">
              <form onSubmit={handleEditChildSubmit}>
                <div className="profile-form-group">
                  <label className="profile-form-label">{isAr ? 'اسم الطفل *' : 'Child Full Name *'}</label>
                  <input 
                    type="text" 
                    className="profile-input-field" 
                    value={editingChild.name} 
                    onChange={e => setEditingChild(prev => ({ ...prev, name: e.target.value }))}
                    required 
                  />
                </div>

                <div className="profile-form-group">
                  <label className="profile-form-label">{isAr ? 'العمر (بالسنوات) *' : 'Age (Years) *'}</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="16" 
                    className="profile-input-field" 
                    value={editingChild.age} 
                    onChange={e => setEditingChild(prev => ({ ...prev, age: parseInt(e.target.value, 10) || 5 }))}
                    required 
                  />
                </div>

                <div className="profile-form-group">
                  <label className="profile-form-label">{isAr ? 'النوع' : 'Gender'}</label>
                  <div className="profile-gender-toggles">
                    <button 
                      type="button" 
                      className={`profile-gender-btn ${editingChild.gender === 'female' ? 'active' : ''}`}
                      onClick={() => setEditingChild(prev => ({ ...prev, gender: 'female' }))}
                    >
                      ♀ {isAr ? 'أنثى' : 'Female'}
                    </button>
                    <button 
                      type="button" 
                      className={`profile-gender-btn ${editingChild.gender === 'male' ? 'active' : ''}`}
                      onClick={() => setEditingChild(prev => ({ ...prev, gender: 'male' }))}
                    >
                      ♂ {isAr ? 'ذكر' : 'Male'}
                    </button>
                  </div>
                </div>

                <div className="profile-form-actions">
                  <button type="button" className="profile-btn-cancel" onClick={() => setActiveSubModal(null)}>
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button type="submit" className="profile-btn-save">
                    <Check size={16} />
                    <span>{isAr ? 'تحديث البيانات' : 'Update Child'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
