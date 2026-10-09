/**
 * Food & Beverage Menu API Service
 */

import { apiClient } from './apiClient';
import { mockMenuItems } from '../data/mock/menu.mock';

export const menuService = {
  /**
   * Get all menu items or filter by category
   */
  async getMenuItems(category = 'all') {
    try {
      const res = await apiClient.get(`/api/menu?category=${category}`);
      if (res && res.data) {
        return res.data;
      }
    } catch {
      // Fallback to local mock data if server is unreachable
    }
    if (!category || category === 'all') {
      return mockMenuItems;
    }
    return mockMenuItems.filter(item => item.category === category);
  },

  /**
   * Submit an order for snacks/meals/delivery
   */
  async placeOrder(orderData) {
    try {
      const payload = Array.isArray(orderData) ? { items: orderData } : orderData;
      const res = await apiClient.post('/api/menu/order', payload);
      if (res) return res;
    } catch {
      // Fallback
    }
    const cartItems = Array.isArray(orderData) ? orderData : (orderData.items || []);
    return {
      success: true,
      orderId: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      items: cartItems
    };
  }
};
