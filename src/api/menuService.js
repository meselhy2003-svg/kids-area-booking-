/**
 * Food & Beverage Menu & Delivery Orders API Service
 */

import { apiClient } from './apiClient';
import { mockMenuItems } from '../data/mock/menu.mock';

export const menuService = {
  /**
   * Get all menu items or filter by category
   */
  async getMenuItems(category = 'all') {
    try {
      const endpoint = category && category !== 'all' 
        ? `/api/menu?category=${encodeURIComponent(category)}&limit=100` 
        : '/api/menu?limit=100';
      const res = await apiClient.get(endpoint);
      if (res && res.success && res.data) {
        const items = Array.isArray(res.data.data) 
          ? res.data.data 
          : (Array.isArray(res.data) ? res.data : []);
        if (items.length > 0) {
          return items.map(item => ({
            ...item,
            id: item._id || item.id,
            // Ensure numeric price
            price: Number(item.price) || 0,
            priceAfterDiscount: item.priceAfterDiscount ? Number(item.priceAfterDiscount) : undefined
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to fetch menu from server, using fallback', e);
    }
    // Fallback to local mock data if server is unreachable
    if (!category || category === 'all') {
      return mockMenuItems;
    }
    return mockMenuItems.filter(item => item.category === category);
  },

  /**
   * Get distinct categories
   */
  async getCategories() {
    try {
      const res = await apiClient.get('/api/menu/categories');
      if (res && res.success && res.data) {
        return res.data.data || res.data;
      }
    } catch (e) {
      console.warn('Failed to fetch categories:', e);
    }
    return [];
  },

  /**
   * Submit an order for delivery/dine-in
   * Supports both JSON and FormData (with payment proof image)
   */
  async placeOrder(orderData) {
    try {
      const res = await apiClient.post('/api/menu/order', orderData);
      if (res && res.success && res.data) {
        return res.data;
      }
      if (res && res.data && res.data.message) {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      throw err;
    }
    throw new Error('Failed to submit order to server');
  },

  /**
   * Get order by orderCode or ID
   */
  async getOrder(idOrCode) {
    try {
      const res = await apiClient.get(`/api/menu/orders/${idOrCode}`);
      if (res && res.success && res.data) {
        return res.data.data || res.data;
      }
    } catch (err) {
      console.error('Error fetching order:', err);
    }
    return null;
  }
};
