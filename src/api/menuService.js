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
    await apiClient.get(`/api/menu?category=${category}`);
    if (!category || category === 'all') {
      return mockMenuItems;
    }
    return mockMenuItems.filter(item => item.category === category);
  },

  /**
   * Submit an order for snacks/meals
   */
  async placeOrder(cartItems) {
    await apiClient.post('/api/menu/order', { items: cartItems });
    return {
      success: true,
      orderId: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      items: cartItems
    };
  }
};
