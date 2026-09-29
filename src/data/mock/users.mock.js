/**
 * Mock Users & Auth Seed Data
 * Simulates authenticated user records, wristbands, loyalty points, and active passes.
 */

export const mockUsers = [
  {
    id: 'user-001',
    name: 'Ahmed Hassan',
    phone: '01012345678',
    email: 'ahmed.hassan@americandream.com',
    password: 'password123',
    membership: 'VIP Member • Gold Club',
    points: 340,
    zoneVisits: 4,
    avatar: '/photo/kid-area-pic/icon/user-icon.png',
    activePasses: [
      {
        code: 'PZ-849201',
        zone: 'Kids Area + VR Arcade',
        name: 'Super Star Weekend Pass',
        quantity: 2,
        date: 'Valid Today',
        price: '200 EGP',
        status: 'Active',
        createdAt: '2026-09-28T14:30:00.000Z'
      },
      {
        code: 'PZ-392104',
        zone: 'Fun Park Adventure',
        name: 'Family Weekend Duo',
        quantity: 1,
        date: 'Valid Tomorrow',
        price: '190 EGP',
        status: 'Active',
        createdAt: '2026-09-29T10:15:00.000Z'
      }
    ]
  },
  {
    id: 'user-002',
    name: 'Mariam Mahmoud',
    phone: '01123456789',
    email: 'mariam@americandream.com',
    password: 'password123',
    membership: 'Silver Explorer',
    points: 120,
    zoneVisits: 2,
    avatar: '/photo/kid-area-pic/icon/user-icon.png',
    activePasses: []
  }
];

export const defaultGuestUser = {
  id: 'guest',
  name: 'American Dream Guest',
  phone: '',
  email: '',
  membership: 'Guest Explorer',
  points: 0,
  zoneVisits: 0,
  avatar: '/photo/kid-area-pic/icon/user-icon.png',
  activePasses: []
};
