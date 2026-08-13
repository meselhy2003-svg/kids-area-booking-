import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Ticket, ShieldCheck, MapPin, Phone, Mail, Clock, CheckCircle2, AlertCircle, Heart } from 'lucide-react';

export default function Modals({ modalType, modalData, closeModal, lang }) {
  const [ticketQty, setTicketQty] = useState(1);
  const [booked, setBooked] = useState(false);
  const [formData, setFormData] = useState({ parentName: '', phone: '', date: '' });

  if (!modalType) return null;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      closeModal();
    }, 3000);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal} aria-label="Close">
          <X size={18} />
        </button>

        {/* 1. RECEPTION SERVICES MODAL */}
        {modalType === 'reception' && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#ffd15c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Ticket /> Reception & Guest Services / الاستقبال
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '1.25rem', lineHeight: '1.6' }}>
              Welcome to American Dream Ismailia Reception Desk! Here you can issue RFID play wristbands, inquire about entry prices, register for birthday parties, or request lost & found assistance.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '14px', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#1693b3' }}>Wristband Pricing:</div>
              <ul style={{ paddingLeft: '1.2rem', color: '#e2e8f0', fontSize: '0.9rem' }}>
                <li>Standard 2-Hour Pass: 150 EGP per child</li>
                <li>Full Day Unlimited Play Pass: 250 EGP per child</li>
                <li>Adult Accompaniment: FREE</li>
              </ul>
            </div>
            <button className="btn-accent" style={{ width: '100%', justifyContent: 'center' }} onClick={() => closeModal()}>
              Understood! Let's Play
            </button>
          </div>
        )}

        {/* 2. ENTRY MODAL */}
        {modalType === 'entry' && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck /> Entry Gate & Safety Check / دخول
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '1.25rem', lineHeight: '1.6' }}>
              Please scan your RFID wristband at the entry turnstile. Grip socks are mandatory for all children entering the soft play & trampoline zones.
            </p>
            <div style={{ background: 'rgba(46, 204, 113, 0.1)', border: '1px solid rgba(46, 204, 113, 0.3)', padding: '1rem', borderRadius: '14px', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: '700', color: '#2ecc71', marginBottom: '0.25rem' }}>Current Capacity Status:</div>
              <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Park is open! 42 kids playing right now. No waiting queue.</div>
            </div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeModal}>
              Enter Play Zone
            </button>
          </div>
        )}

        {/* 3. EXIT MODAL */}
        {modalType === 'exit' && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle /> Park Exit & Checkout / خروج
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '1.25rem', lineHeight: '1.6' }}>
              Thank you for playing at American Dream Ismailia! Please return your wristband at the exit gate. Ensure you have collected all personal belongings.
            </p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeModal}>
              Return to Lobby
            </button>
          </div>
        )}

        {/* 4. BUY TICKETS MODAL */}
        {modalType === 'tickets' && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#ffd15c' }}>
              🎟️ Buy Kids Play Wristbands
            </h3>

            {booked ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2 size={48} style={{ color: '#2ecc71', margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Wristband Reserved!</h4>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.5rem' }}>Present your confirmation code <strong>AD-8892</strong> at the reception desk.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem', color: '#cbd5e1' }}>Parent Full Name</label>
                  <input required type="text" placeholder="e.g. Ahmed Mahmoud" style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '10px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem', color: '#cbd5e1' }}>Phone Number</label>
                  <input required type="tel" placeholder="010XXXXXXXX" style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '10px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem', color: '#cbd5e1' }}>Number of Wristbands</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button type="button" onClick={() => setTicketQty(Math.max(1, ticketQty - 1))} style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '800' }}>-</button>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>{ticketQty}</span>
                    <button type="button" onClick={() => setTicketQty(ticketQty + 1)} style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '800' }}>+</button>
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: '800' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: '#ffd15c' }}>{ticketQty * 150} EGP</span>
                </div>

                <button type="submit" className="btn-accent" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                  Confirm Wristband Reservation
                </button>
              </form>
            )}
          </div>
        )}

        {/* 5. NOTIFICATIONS MODAL */}
        {modalType === 'notifications' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#ffd15c' }}>
              📢 Special Announcements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ fontWeight: '700', color: '#1693b3', marginBottom: '0.25rem' }}>🎉 Friday Bubble & Mascot Show!</div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Join us every Friday at 6:00 PM for giant bubble show and photo ops with American Dream characters!</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ fontWeight: '700', color: '#2ecc71', marginBottom: '0.25rem' }}>🍕 20% Discount on Pizza Combos</div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Order any kids meal + smoothie combo on weekdays and get 20% off.</div>
              </div>
            </div>
          </div>
        )}

        {/* 6. PARTY BOOKING MODAL */}
        {modalType === 'partyBooking' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', color: '#ffd15c' }}>
              🎉 Book {modalData?.nameEn || 'Birthday Party'}
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '1rem' }}>Package Price: {modalData?.price}</p>

            {booked ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2 size={48} style={{ color: '#2ecc71', margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Party Booking Requested!</h4>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.5rem' }}>Our Event Manager will call you shortly to customize your theme!</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <input required type="text" placeholder="Parent Name" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.7rem', borderRadius: '8px', color: 'white' }} />
                <input required type="tel" placeholder="Phone Number" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.7rem', borderRadius: '8px', color: 'white' }} />
                <input required type="text" placeholder="Birthday Kid's Name & Age" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.7rem', borderRadius: '8px', color: 'white' }} />
                <input required type="date" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.7rem', borderRadius: '8px', color: 'white' }} />
                <button type="submit" className="btn-accent" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                  Send Party Request
                </button>
              </form>
            )}
          </div>
        )}

        {/* 7. FOOTER MODALS (About, Contact, Safety, Privacy) */}
        {modalType === 'about' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#1693b3' }}>About American Dream Ismailia</h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.9rem' }}>
              American Dream Ismailia is the premier indoor entertainment center designed to spark joy, active play, and imagination in children of all ages. Built with world-class safety standards, interactive soft play areas, trampolines, and celebratory party spaces.
            </p>
          </div>
        )}

        {modalType === 'contact' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#ffd15c' }}>Contact & Location</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin style={{ color: '#ff6b6b' }} /> Ismailia, Egypt</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone style={{ color: '#2ecc71' }} /> +20 100 123 4567</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail style={{ color: '#1693b3' }} /> info@americandream-ismailia.com</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock style={{ color: '#ffd15c' }} /> Daily 10:00 AM - 11:00 PM</div>
            </div>
          </div>
        )}

        {modalType === 'safety' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#2ecc71' }}>Safety & Hygiene Rules</h3>
            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Grip socks must be worn inside all play areas at all times.</li>
              <li>Children under 4 years must be accompanied by a parent/guardian.</li>
              <li>Outside food & beverages are not permitted inside the play park.</li>
              <li>All zones undergo UV sanitization every 3 hours.</li>
            </ul>
          </div>
        )}

        {modalType === 'privacy' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#94a3b8' }}>Privacy Policy</h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.9rem' }}>
              We respect your family's privacy. Information collected during wristband registration or birthday bookings is strictly used for safety verification and reservation management.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
