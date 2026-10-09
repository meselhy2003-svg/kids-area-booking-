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
  Clock
} from 'lucide-react';
import './GuestsManager.css';

// Initial Guests data matching mongoose schema:
// { name, phone, age, gender, children: [{ name, age, gender }] }
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  }
];

export default function GuestsManager({ lang = 'ar' }) {
  const isAr = lang === 'ar';

  const [guests, setGuests] = useState(() => {
    try {
      const saved = localStorage.getItem('ados_guests_directory');
      if (saved) return JSON.parse(saved);
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
    return { totalGuests, totalChildren, maleGuests, femaleGuests };
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

    // Filter out completely empty child rows
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
        createdAt: new Date().toISOString()
      };
      setGuests(prev => [newGuest, ...prev]);
      showToast(isAr ? 'تم تسجيل الضيف بنجاح' : 'Guest registered successfully');
    }

    setIsModalOpen(false);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Guest Name', 'Phone', 'Age', 'Gender', 'Children Count', 'Children Details', 'Registered Date'];
    const rows = guests.map(g => [
      `"${g.name}"`,
      `"${g.phone}"`,
      g.age,
      g.gender,
      g.children?.length || 0,
      `"${g.children?.map(c => `${c.name} (${c.age}y, ${c.gender})`).join('; ') || 'None'}"`,
      `"${new Date(g.createdAt || Date.now()).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `american_dream_guests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(isAr ? 'تم تصدير ملف الضيوف بنجاح' : 'Guests exported to CSV');
  };

  return (
    <div className={`gm-container ${isAr ? 'lang-ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="gm-toast">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="gm-header-row">
        <div>
          <h2 className="gm-title">{isAr ? 'إدارة الضيوف والعائلات' : 'Guests & Families Directory'}</h2>
          <p className="gm-subtitle">
            {isAr 
              ? 'سجل حسابات ضيوف المنتجع، بيانات التواصل، وبيانات الأطفال المسجلين في البلاي زون.' 
              : 'Manage registered resort guests, contact information, and family children directory.'}
          </p>
        </div>

        <div className="gm-actions-row">
          <button 
            type="button" 
            className="gm-export-btn" 
            onClick={handleExportCSV}
            title={isAr ? 'تصدير التقرير' : 'Export CSV'}
          >
            <Download size={15} />
            <span>{isAr ? 'تصدير CSV' : 'Export CSV'}</span>
          </button>

          <button 
            type="button" 
            className="gm-add-btn" 
            onClick={handleOpenAdd}
          >
            <UserPlus size={16} />
            <span>{isAr ? 'إضافة ضيف جديد' : 'Add New Guest'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="gm-stats-grid">
        <div className="gm-stat-card">
          <div className="gm-stat-icon-wrap" style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7' }}>
            <Users size={22} />
          </div>
          <div className="gm-stat-info">
            <span className="gm-stat-label">{isAr ? 'إجمالي الضيوف' : 'Total Guests'}</span>
            <span className="gm-stat-value">{stats.totalGuests}</span>
          </div>
        </div>

        <div className="gm-stat-card">
          <div className="gm-stat-icon-wrap" style={{ background: 'rgba(234, 88, 12, 0.12)', color: '#ea580c' }}>
            <Baby size={22} />
          </div>
          <div className="gm-stat-info">
            <span className="gm-stat-label">{isAr ? 'الأطفال المسجلين' : 'Registered Children'}</span>
            <span className="gm-stat-value">{stats.totalChildren}</span>
          </div>
        </div>

        <div className="gm-stat-card">
          <div className="gm-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
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
                          onClick={() => setViewingGuest(guest)}
                          title={isAr ? 'عرض تفاصيل الضيف والأسرة' : 'View Guest & Family Profile'}
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

      {/* Modal: View Guest & Family Details */}
      {viewingGuest && (
        <div className="gm-modal-overlay" onClick={() => setViewingGuest(null)}>
          <div className="gm-modal-card gm-view-modal-card" onClick={e => e.stopPropagation()}>
            <div className="gm-modal-header" style={{ borderBottom: '1px solid #e2e8f0', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div 
                  className="gm-avatar" 
                  style={{ 
                    width: '42px', 
                    height: '42px', 
                    fontSize: '15px', 
                    background: viewingGuest.gender === 'female' ? '#ec4899' : '#0284c7' 
                  }}
                >
                  {viewingGuest.name
                    .split(' ')
                    .filter(Boolean)
                    .map(w => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase() || 'G'}
                </div>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#003844' }}>
                    {viewingGuest.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>#{viewingGuest._id}</span>
                    <span className={`gm-gender-badge ${viewingGuest.gender}`}>
                      {viewingGuest.gender === 'male' ? (isAr ? 'ذكر' : 'Male') : (isAr ? 'أنثى' : 'Female')}
                    </span>
                  </div>
                </div>
              </div>
              <button type="button" className="gm-modal-close" onClick={() => setViewingGuest(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="gm-view-modal-body">
              {/* Info Stats Cards */}
              <div className="gm-view-info-grid">
                <div className="gm-view-info-item">
                  <div className="gm-view-info-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="gm-view-info-label">{isAr ? 'رقم الهاتف' : 'Phone Number'}</div>
                    <a href={`tel:${viewingGuest.phone}`} className="gm-view-info-value" style={{ color: '#0284c7', textDecoration: 'none' }}>
                      {viewingGuest.phone}
                    </a>
                  </div>
                </div>

                <div className="gm-view-info-item">
                  <div className="gm-view-info-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div className="gm-view-info-label">{isAr ? 'العمر' : 'Age'}</div>
                    <div className="gm-view-info-value">{viewingGuest.age} {isAr ? 'سنة' : 'Years old'}</div>
                  </div>
                </div>

                <div className="gm-view-info-item">
                  <div className="gm-view-info-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                    <Baby size={16} />
                  </div>
                  <div>
                    <div className="gm-view-info-label">{isAr ? 'الأطفال المسجلين' : 'Children Count'}</div>
                    <div className="gm-view-info-value">
                      {viewingGuest.children?.length || 0} {isAr ? 'أطفال' : 'Children'}
                    </div>
                  </div>
                </div>

                <div className="gm-view-info-item">
                  <div className="gm-view-info-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="gm-view-info-label">{isAr ? 'تاريخ التسجيل' : 'Registration Date'}</div>
                    <div className="gm-view-info-value">
                      {new Date(viewingGuest.createdAt || Date.now()).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Children List */}
              <div className="gm-view-section">
                <h4 className="gm-view-section-title">
                  <Baby size={16} color="#00a8cc" />
                  <span>{isAr ? 'الأطفال المسجلين في الملف العائلي' : 'Registered Family Children'}</span>
                  <span className="gm-view-badge-count">{viewingGuest.children?.length || 0}</span>
                </h4>

                {viewingGuest.children && viewingGuest.children.length > 0 ? (
                  <div className="gm-view-children-grid">
                    {viewingGuest.children.map((child, cIdx) => (
                      <div key={cIdx} className="gm-view-child-card">
                        <div className="gm-view-child-avatar">
                          {child.gender === 'female' ? '👧' : '👦'}
                        </div>
                        <div className="gm-view-child-info">
                          <div className="gm-view-child-name">{child.name}</div>
                          <div className="gm-view-child-meta">
                            <span>{child.age} {isAr ? 'سنوات' : 'years'}</span>
                            <span className="gm-dot-sep">•</span>
                            <span style={{ color: child.gender === 'female' ? '#db2777' : '#0284c7', fontWeight: 600 }}>
                              {child.gender === 'female' ? (isAr ? 'بنت' : 'Girl') : (isAr ? 'ولد' : 'Boy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="gm-view-no-kids">
                    <p>{isAr ? 'لا يوجد أطفال مسجلين لهذا الضيف حالياً.' : 'No registered children for this guest profile.'}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="gm-modal-footer" style={{ borderTop: '1px solid #f1f5f9', background: '#f8fafc', padding: '14px 20px' }}>
              <button 
                type="button" 
                className="gm-btn-cancel" 
                onClick={() => setViewingGuest(null)}
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
              <button 
                type="button" 
                className="gm-btn-submit"
                onClick={() => {
                  const toEdit = viewingGuest;
                  setViewingGuest(null);
                  handleOpenEdit(toEdit);
                }}
              >
                <Edit3 size={14} style={{ marginInlineEnd: 6 }} />
                <span>{isAr ? 'تعديل بيانات الضيف' : 'Edit Guest Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
