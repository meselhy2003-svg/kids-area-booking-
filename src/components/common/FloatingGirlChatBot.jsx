import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Ticket, 
  PartyPopper, 
  Bus, 
  Utensils, 
  MapPin, 
  Phone,
  MessageCircle,
  HelpCircle,
  Clock,
  Compass,
  Smile
} from 'lucide-react';
import './FloatingGirlChatBot.css';

// Pleasant synthesized Web Audio chime
function playChime(isMuted) {
  if (isMuted) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Audio context may be restricted by autoplay policy
  }
}

export default function FloatingGirlChatBot({
  setActiveTab = () => {},
  openModal = () => {},
  lang = 'ar'
}) {
  const isAr = lang === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState(true);
  const messagesEndRef = useRef(null);
  const girlImgSrc = '/photo/landingpagegirl/frame 3.png';
  const girlImgFallback = '/photo/landingpagegirl/frame-3.png';

  // Initial Conversation Messages
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome-1',
      sender: 'sally',
      time: 'الآن',
      text: isAr
        ? 'أهلاً بك يا بطل في أمريكان دريم كيدز إريا! 🌟 أنا سالي، مرشدتك السحرية في كل مناطق وألعاب البارك. كيف أقدر أساعدك اليوم؟'
        : 'Welcome to American Dream Kids Area! 🌟 I’m Sally, your magical guide across all our fun zones. How can I help you have an unforgettable day?',
      options: [
        { id: 'opt-zones', label: isAr ? '🎡 استكشاف مناطق الألعاب الأربعة' : '🎡 Explore 4 Fun Zones', action: 'zones' },
        { id: 'opt-tickets', label: isAr ? '🎟️ أسعار التذاكر والباقات المتاحة' : '🎟️ Ticket Prices & Deals', action: 'tickets' },
        { id: 'opt-birthday', label: isAr ? '🎂 تنظيم حفلة عيد ميلاد أسطورية' : '🎂 Plan a Birthday Party', action: 'birthday' },
        { id: 'opt-trips', label: isAr ? '🚌 حجز رحلة مدرسية أو جماعية' : '🚌 School & Group Trips', action: 'trips' },
        { id: 'opt-restaurant', label: isAr ? '🍔 وجبات الأطفال وقائمة المطعم' : '🍔 Kids Meals & Dining', action: 'restaurant' },
        { id: 'opt-location', label: isAr ? '📍 العنوان ومواعيد العمل' : '📍 Location & Opening Hours', action: 'location' }
      ]
    }
  ]);

  // Hide the floating greeting bubble after 10 seconds or when opened
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreetingBubble(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Handle opening chat
  const handleToggleChat = () => {
    setIsOpen(prev => {
      const next = !prev;
      if (next) {
        setUnreadCount(0);
        setShowGreetingBubble(false);
        playChime(isMuted);
      }
      return next;
    });
  };

  // Bot Knowledge-Base Answering Engine
  const generateBotReply = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // 1. Tickets & Pricing
    if (q.includes('تذكر') || q.includes('تذاكر') || q.includes('سعر') || q.includes('اسعار') || q.includes('باق') || q.includes('ticket') || q.includes('price') || q.includes('pass') || q.includes('cost')) {
      return {
        text: isAr
          ? '🎟️ تذاكر كيدز إريا مرنة ومناسبة لكل الأعمار:\n\n• تذكرة ساعة مرح: تبدأ من 150 ج.م\n• تذكرة يوم كامل غير محدودة: 350 ج.م\n• باقات عائلية VIP: توفير يصل إلى 25% مع هدايا ونقاط ولاء!\n\nكل تذكرة تشمل سوار دخول إلكتروني آمن للأطفال.'
          : '🎟️ We offer flexible passes for all ages:\n\n• 1-Hour Fun Pass: from 150 EGP\n• All-Day Unlimited Access: 350 EGP\n• Family VIP Packages: up to 25% off with cashback points!\n\nAll tickets include an electronic smart wristband for child safety.',
        navAction: { tab: 'kids-area', label: isAr ? 'عرض وحجز التذاكر الآن' : 'View & Book Tickets' }
      };
    }

    // 2. The 4 Fun Zones
    if (q.includes('منطق') || q.includes('العاب') || q.includes('ألعاب') || q.includes('بارك') || q.includes('zone') || q.includes('game') || q.includes('play') || q.includes('park')) {
      return {
        text: isAr
          ? '🎡 البارك يضم 4 بوابات ترفيهية متكاملة:\n\n1. منطقة الأطفال (Kids Area): مسبح كرات عملاق، ترامبولين، ألعاب حركية آمنة (1 - 7 سنوات).\n2. فن بارك (Fun Park): سيارات تصادمية، قطار المغامرة، وألعاب آركيد.\n3. منطقة التحدي (Challenge Zone): ألعاب واقع افتراضي VR ومسارات تسلق ونينجا.\n4. منطقة المغامرات (Adventure Zone): مسار الحبال المعلقة وحبل الانزلاق Zipline!'
          : '🎡 Our resort features 4 themed adventure portals:\n\n1. Kids Area: Giant ball pits, trampolines, and safe toddler soft play (Ages 1 - 7).\n2. Fun Park: Bumper cars, adventure train, and interactive arcade games.\n3. Challenge Zone: Immersive VR simulators, ninja courses, and climbing walls.\n4. Adventure Zone: Sky rope bridges and thrilling Ziplines!',
        navAction: { tab: 'fun-park', label: isAr ? 'استكشاف الألعاب بالتفصيل' : 'Explore All Zones' }
      };
    }

    // 3. Birthday Parties
    if (q.includes('عيد') || q.includes('ميلاد') || q.includes('حفل') || q.includes('عيد ميلاد') || q.includes('birthday') || q.includes('party') || q.includes('event')) {
      return {
        text: isAr
          ? '🎂 حفلات أعياد الميلاد في كيدز إريا ذكريات لا تُنسى!\n\nنقدم قاعة احتفالات خاصة VIP، عروض شخصيات كرتونية ومسابقات، تورتة فاخرة، وجبات للأطفال، وضيافة مشروبات ساخنة لأولياء الأمور مع تصوير فوتوغرافي كامل.'
          : '🎂 Celebrate an unforgettable birthday with us!\n\nIncludes a private VIP party lounge, mascot characters, kids meal boxes, custom cake, parent refreshments bar, and professional photography.',
        navAction: { tab: 'birthday', label: isAr ? 'تصميم باقة عيد الميلاد' : 'Build Birthday Package' }
      };
    }

    // 4. School / Group Trips
    if (q.includes('رحل') || q.includes('مدرس') || q.includes('مجموع') || q.includes('trip') || q.includes('school') || q.includes('group')) {
      return {
        text: isAr
          ? '🚌 رحلات المدارس والحضانات بخصومات مخصصة للمجموعات تبدأ من 30 طالباً:\n\n• أسعار خاصة للطلاب تبدأ من 320 ج.م شاملة الألعاب ووجبة الغداء الفاخرة.\n• استراحة وضيافة مجانية 100% لمشرفي المدرسة والمعلمين.\n• تأمين وإشراف طبي كامل داخل البارك.'
          : '🚌 School & nursery trips feature exclusive group packages (starting from 30 students):\n\n• Special rates from 320 EGP/student including games and lunch meal boxes.\n• Complimentary dedicated lounge and refreshments for supervisors & teachers.\n• Full security and medical supervision throughout the stay.',
        navAction: { tab: 'trips', label: isAr ? 'حجز رحلة مدرسية' : 'Book School Trip' }
      };
    }

    // 5. Restaurant & Dining
    if (q.includes('مطعم') || q.includes('اكل') || q.includes('طعام') || q.includes('وجب') || q.includes('غدا') || q.includes('food') || q.includes('restaurant') || q.includes('eat') || q.includes('lunch') || q.includes('meal')) {
      return {
        text: isAr
          ? '🍔 مطعم كيدز إريا الفاخر يقدم وجبات صحية ولذيذة للأطفال والعائلات:\n\nبرجر لحم ودجاج طازج، ناغتس مقرمش، مكرونة إيطالية، بيتزا، وعصائر فريش، بالإضافة إلى منطقة كافيه متكاملة للآباء مع إطلالة بحرية ساحرة.'
          : '🍔 Our on-site resort restaurant serves delicious healthy meals:\n\nFresh beef/chicken burgers, crispy nuggets, Italian pastas, artisanal pizzas, and fresh smoothies, plus a premium seaside espresso lounge for parents.',
        navAction: { tab: 'restaurant', label: isAr ? 'استعراض قائمة المطعم' : 'View Restaurant Menu' }
      };
    }

    // 6. Location & Working Hours
    if (q.includes('مكان') || q.includes('عنو') || q.includes('موقع') || q.includes('فين') || q.includes('مواعيد') || q.includes('وقت') || q.includes('ساع') || q.includes('location') || q.includes('where') || q.includes('hour') || q.includes('time') || q.includes('address')) {
      return {
        text: isAr
          ? '📍 عنواننا:\nمنتجع أمريكان دريم الترفيهي – طريق الإسماعيلية الساحلي.\n\n⏰ مواعيد العمل:\nنستقبلكم يومياً طوال الأسبوع من الساعة 10:00 صباحاً وحتى 11:00 مساءً (ويومي الخميس والجمعة حتى 12:00 منتصف الليل).'
          : '📍 Our Location:\nAmerican Dream Resort – Ismailia Waterfront Corniche.\n\n⏰ Opening Hours:\nOpen daily from 10:00 AM to 11:00 PM (Thursdays & Fridays until 12:00 Midnight).',
        navAction: { tab: 'about', label: isAr ? 'معلومات الوصول والخريطة' : 'Map & Directions' }
      };
    }

    // 7. Safety & Age Groups
    if (q.includes('سن') || q.includes('عمر') || q.includes('امان') || q.includes('أمان') || q.includes('age') || q.includes('safe') || q.includes('safety') || q.includes('baby') || q.includes('toddler')) {
      return {
        text: isAr
          ? '🛡️ الأمان هو أولويتنا الأولى في كيدز إريا:\n\n• جميع الألعاب مصنوعة من خامات أوروبية مبطنة ومضادة للصدمات.\n• فِرق إنقاذ وإشراف مدربة بمعدل مشرف لكل 6 أطفال.\n• منطقة مخصصة للرضع والأطفال دون 3 سنوات مع مرافق لأولياء الأمور.'
          : '🛡️ Safety is our highest priority:\n\n• All play equipment uses certified padded impact-absorbing materials.\n• Certified supervisory staff at a 1:6 chaperone ratio.\n• Dedicated toddler sanctuary for under-3s with parent viewing lounges.'
      };
    }

    // 8. Contact & Customer Support
    if (q.includes('تواصل') || q.includes('رقم') || q.includes('تليفون') || q.includes('واتس') || q.includes('خدم') || q.includes('call') || q.includes('phone') || q.includes('contact') || q.includes('support') || q.includes('whatsapp')) {
      return {
        text: isAr
          ? '📞 يمكنك التواصل المباشر مع فريق خدمة العملاء على مدار الساعة:\n\n• الخط الساخن: 19850\n• هاتف الحجوزات: +20 101 234 5678\n• واتساب مباشر: متوفر للحجوزات الفورية والتأكيد السريع.'
          : '📞 Connect with our friendly customer care team anytime:\n\n• Hotline: 19850\n• Direct Line: +20 101 234 5678\n• WhatsApp Support: available for instant ticket confirmations.'
      };
    }

    // Default Friendly Fallback
    return {
      text: isAr
        ? `يسعدني جداً سؤالك يا بطل! بخصوص "${userQuery}"، فريقنا يضمن لك تجربة ترفيهية متكاملة وسعيدة. يمكنك اختيار أحد الموضوعات السريعة أدناه لتصفح التذاكر أو حجز الرحلات فوراً! ✨`
        : `That’s a great question! Regarding "${userQuery}", our team is dedicated to giving your kids the best memories. You can pick any of the quick shortcuts below to book tickets or school trips right away! ✨`,
      options: [
        { id: 'opt-tickets', label: isAr ? '🎟️ أسعار التذاكر' : '🎟️ Ticket Prices', action: 'tickets' },
        { id: 'opt-birthday', label: isAr ? '🎂 حفلات أعياد الميلاد' : '🎂 Birthday Parties', action: 'birthday' },
        { id: 'opt-trips', label: isAr ? '🚌 حجز رحلة مدرسية' : '🚌 School Trips', action: 'trips' },
        { id: 'opt-restaurant', label: isAr ? '🍔 وجبات المطعم' : '🍔 Restaurant', action: 'restaurant' }
      ]
    };
  };

  // Dispatch Bot Reply with natural typing delay
  const handleUserMessage = (text) => {
    if (!text || !text.trim()) return;
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const replyData = generateBotReply(text);
      const botMsg = {
        id: `sally-${Date.now()}`,
        sender: 'sally',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replyData.text,
        navAction: replyData.navAction,
        options: replyData.options
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
      playChime(isMuted);
    }, 750);
  };

  // Submit via Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUserMessage(inputText);
    }
  };

  // Reset / Clear Conversation
  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'sally',
        time: 'الآن',
        text: isAr
          ? 'تم بدء محادثة جديدة! 🎈 أنا سالي، جاهزة لمساعدتك في أي استفسار عن التذاكر، الألعاب، وحفلات أعياد الميلاد.'
          : 'Started a fresh chat! 🎈 I’m Sally, ready to help with tickets, game zones, or birthday bookings.',
        options: [
          { id: 'opt-zones', label: isAr ? '🎡 استكشاف الألعاب' : '🎡 Explore Zones', action: 'zones' },
          { id: 'opt-tickets', label: isAr ? '🎟️ أسعار التذاكر' : '🎟️ Ticket Prices', action: 'tickets' },
          { id: 'opt-birthday', label: isAr ? '🎂 حفلات أعياد الميلاد' : '🎂 Birthday Parties', action: 'birthday' }
        ]
      }
    ]);
  };

  return (
    <div className={`fg-chatbot-root ${isAr ? 'lang-ar' : 'lang-en'}`}>
      
      {/* ------------------------------------------------------------- */}
      {/* FLOATING ACTION LAUNCHER (CUTE GIRL ICON + SPEECH BUBBLE)     */}
      {/* ------------------------------------------------------------- */}
      <div className="fg-launcher-container">
        
        {/* Floating Greeting Bubble (shows initially to invite user) */}
        {!isOpen && showGreetingBubble && (
          <div 
            className="fg-speech-bubble" 
            onClick={handleToggleChat}
          >
            <div className="fg-bubble-text">
              <span className="fg-bubble-title">
                {isAr ? 'مرحباً! أنا سالي 👋' : "Hi! I'm Sally 👋"}
              </span>
              <p className="fg-bubble-sub">
                {isAr 
                  ? 'محتاج مساعدة في حجز التذاكر أو باقات الألعاب؟ اسألني هنا!' 
                  : 'Need help choosing tickets or planning a party? Chat with me!'}
              </p>
            </div>
            <button 
              type="button" 
              className="fg-bubble-close"
              onClick={(e) => {
                e.stopPropagation();
                setShowGreetingBubble(false);
              }}
              title={isAr ? 'إغلاق' : 'Close'}
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* The Animated Floating Girl Button */}
        <button
          type="button"
          className={`fg-launcher-btn ${isOpen ? 'active-open' : ''}`}
          onClick={handleToggleChat}
          title={isAr ? 'تحدث مع سالي - المساعد الذكي' : 'Chat with Sally - AI Assistant'}
        >
          {/* Pulsing energy halos */}
          <span className="fg-halo-pulse" />
          <span className="fg-halo-pulse delay" />

          {/* Girl Avatar Image */}
          <div className="fg-girl-avatar-circle">
            <img 
              src={girlImgSrc}
              onError={(e) => {
                e.currentTarget.src = girlImgFallback;
              }}
              alt="Sally Kids Area Mascot"
              className="fg-girl-img"
            />
          </div>

          {/* Green Online Status Dot */}
          <span className="fg-online-dot" />

          {/* Unread Message Badge */}
          {unreadCount > 0 && !isOpen && (
            <span className="fg-unread-badge">{unreadCount}</span>
          )}

          {/* Close X icon visible when chat is open */}
          {isOpen && (
            <div className="fg-close-overlay">
              <X size={20} />
            </div>
          )}
        </button>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* INTERACTIVE CHATBOT WINDOW DIALOG                             */}
      {/* ------------------------------------------------------------- */}
      {isOpen && (
        <div className="fg-chat-window animate-popup">
          
          {/* WINDOW HEADER */}
          <div className="fg-chat-header">
            <div className="fg-header-left">
              <div className="fg-header-avatar-wrap">
                <img 
                  src={girlImgSrc}
                  onError={(e) => { e.currentTarget.src = girlImgFallback; }}
                  alt="Sally"
                  className="fg-header-avatar"
                />
                <span className="fg-status-pill-dot" />
              </div>
              
              <div className="fg-header-info">
                <div className="fg-header-title-row">
                  <h3 className="fg-header-name">
                    {isAr ? 'سالي — مرشدة المرح' : 'Sally — Fun Guide'}
                  </h3>
                  <span className="fg-ai-badge">AI Assistant</span>
                </div>
                <span className="fg-header-status">
                  {isAr ? 'متصلة الآن • جاهزة للمساعدة الفورية' : 'Online • Ready to assist'}
                </span>
              </div>
            </div>

            {/* Header Action Tools */}
            <div className="fg-header-actions">
              <button 
                type="button" 
                className="fg-action-btn"
                onClick={() => setIsMuted(m => !m)}
                title={isMuted ? (isAr ? 'تشغيل الصوت' : 'Unmute') : (isAr ? 'كتم الصوت' : 'Mute')}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              <button 
                type="button" 
                className="fg-action-btn"
                onClick={handleResetChat}
                title={isAr ? 'بدء محادثة جديدة' : 'Restart conversation'}
              >
                <RotateCcw size={15} />
              </button>

              <button 
                type="button" 
                className="fg-action-btn close-btn"
                onClick={() => setIsOpen(false)}
                title={isAr ? 'تصغير المحادثة' : 'Minimize'}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* MESSAGES BODY */}
          <div className="fg-chat-messages">
            
            {/* Security / Info Pill */}
            <div className="fg-chat-date-divider">
              <span>{isAr ? 'محادثة آمنة ومشفرة • منتجع أمريكان دريم' : 'Secure & Live • American Dream Resort'}</span>
            </div>

            {/* Messages Loop */}
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`fg-message-row ${msg.sender === 'user' ? 'from-user' : 'from-sally'}`}
              >
                {msg.sender === 'sally' && (
                  <img 
                    src={girlImgSrc}
                    onError={(e) => { e.currentTarget.src = girlImgFallback; }}
                    alt="Sally"
                    className="fg-msg-avatar"
                  />
                )}

                <div className="fg-msg-bubble-wrap">
                  <div className="fg-msg-bubble">
                    <p className="fg-msg-text">{msg.text}</p>
                    <span className="fg-msg-time">{msg.time}</span>
                  </div>

                  {/* Direct Navigation Button inside Bot Response */}
                  {msg.navAction && (
                    <button 
                      type="button" 
                      className="fg-msg-nav-btn"
                      onClick={() => {
                        setActiveTab(msg.navAction.tab);
                        setIsOpen(false);
                      }}
                    >
                      <span>{msg.navAction.label}</span>
                      {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                    </button>
                  )}

                  {/* Quick Shortcut Option Buttons */}
                  {msg.options && (
                    <div className="fg-msg-options-grid">
                      {msg.options.map((opt) => (
                        <button 
                          key={opt.id}
                          type="button" 
                          className="fg-msg-option-chip"
                          onClick={() => handleUserMessage(opt.label)}
                        >
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Real-time Typing Indicator */}
            {isTyping && (
              <div className="fg-message-row from-sally">
                <img 
                  src={girlImgSrc}
                  onError={(e) => { e.currentTarget.src = girlImgFallback; }}
                  alt="Sally"
                  className="fg-msg-avatar"
                />
                <div className="fg-typing-indicator">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK SUGGESTIONS BOTTOM DOCK */}
          <div className="fg-quick-shortcuts-dock">
            <button 
              type="button" 
              className="fg-shortcut-btn"
              onClick={() => handleUserMessage(isAr ? 'ما هي أسعار التذاكر والباقات؟' : 'What are the ticket prices?')}
            >
              <Ticket size={13} />
              <span>{isAr ? 'أسعار التذاكر' : 'Tickets'}</span>
            </button>

            <button 
              type="button" 
              className="fg-shortcut-btn"
              onClick={() => handleUserMessage(isAr ? 'عايز تفاصيل حفلات أعياد الميلاد' : 'Tell me about birthday parties')}
            >
              <PartyPopper size={13} />
              <span>{isAr ? 'أعياد الميلاد' : 'Birthdays'}</span>
            </button>

            <button 
              type="button" 
              className="fg-shortcut-btn"
              onClick={() => handleUserMessage(isAr ? 'ما هي تفاصيل وأسعار رحلات المدارس؟' : 'School trips details & rates')}
            >
              <Bus size={13} />
              <span>{isAr ? 'رحلات المدارس' : 'Trips'}</span>
            </button>

            <button 
              type="button" 
              className="fg-shortcut-btn"
              onClick={() => handleUserMessage(isAr ? 'ما هي مواعيد العمل والعنوان بالتفصيل؟' : 'Location and opening hours')}
            >
              <MapPin size={13} />
              <span>{isAr ? 'الموقع والمواعيد' : 'Location'}</span>
            </button>
          </div>

          {/* TEXT INPUT FOOTER */}
          <div className="fg-chat-input-bar">
            <input 
              type="text" 
              className="fg-chat-input"
              placeholder={isAr ? 'اسأل سالي أي سؤال عن الألعاب والتذاكر...' : 'Ask Sally anything about fun zones or bookings...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              type="button" 
              className={`fg-send-btn ${inputText.trim() ? 'active' : ''}`}
              onClick={() => handleUserMessage(inputText)}
              disabled={!inputText.trim()}
              title={isAr ? 'إرسال الرسالة' : 'Send message'}
            >
              <Send size={15} className={isAr ? 'rotate-180' : ''} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
