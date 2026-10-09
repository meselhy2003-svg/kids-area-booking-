/**
 * Menu & Food Delivery API Service
 * American Dream - Restaurant & Delivery Module (ADOS)
 * Base URL: https://backend-ados.vercel.app
 */

import { apiClient } from './apiClient';

/**
 * Helper to extract human-readable error messages from responses/exceptions
 */
export function extractErrorMessage(errOrRes, fallbackMsg = 'Failed to process request') {
  if (!errOrRes) return fallbackMsg;
  if (typeof errOrRes === 'string') return errOrRes;

  const data = errOrRes.data || errOrRes.response?.data || errOrRes;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (typeof data?.error === 'string') return data.error;

  return errOrRes.message || fallbackMsg;
}

// =========================================================================
// MENU ITEMS ENDPOINTS
// =========================================================================

/**
 * 1. Seed Restaurant Menu
 * POST /api/menu/seed?force=true
 * Pre-populates the database with dishes and items matching the client website
 * @param {boolean} force - Reset and re-seed all default dishes
 */
export async function seedMenu(force = false) {
  try {
    const endpoint = force ? '/api/menu/seed?force=true' : '/api/menu/seed';
    const res = await apiClient.post(endpoint, {});
    if (res && res.success) {
      return res.data;
    }
    throw new Error(extractErrorMessage(res, 'Failed to seed restaurant menu'));
  } catch (error) {
    console.error('Error seeding menu:', error);
    throw new Error(extractErrorMessage(error, 'تعذر تهيئة قائمة الطعام من الخادم'));
  }
}

/**
 * 2. Get All Menu Items (with optional category and search filters)
 * GET /api/menu?category=burgers&search=beef
 * @param {Object|string} params - Query params { category, search, limit, page } or category string
 */
export async function getMenuItems(params = {}) {
  try {
    let queryParams = {};
    if (typeof params === 'string') {
      if (params && params !== 'all') {
        queryParams.category = params;
      }
    } else if (params && typeof params === 'object') {
      queryParams = { ...params };
      if (queryParams.category === 'all') {
        delete queryParams.category;
      }
    }

    const res = await apiClient.get('/api/menu', queryParams);
    if (res && res.success && res.data) {
      const items = Array.isArray(res.data.data) 
        ? res.data.data 
        : (Array.isArray(res.data) ? res.data : []);
      
      return items.map(item => ({
        ...item,
        id: item._id || item.id,
        price: Number(item.price) || 0,
        priceAfterDiscount: item.priceAfterDiscount ? Number(item.priceAfterDiscount) : undefined
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

/**
 * 3. Get Categories Breakdown
 * GET /api/menu/categories
 * Returns aggregated list of categories with item counts
 */
export async function getCategoriesBreakdown() {
  try {
    const res = await apiClient.get('/api/menu/categories');
    if (res && res.success && res.data) {
      return res.data.data || res.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories breakdown:', error);
    return [];
  }
}

/**
 * 4. Create Menu Item
 * POST /api/menu
 * @param {Object} itemData - { nameEn, nameAr, descEn, descAr, price, priceAfterDiscount, category, rating, image, isChefSpecial, available }
 */
export async function createMenuItem(itemData) {
  try {
    const res = await apiClient.post('/api/menu', itemData);
    if (res && res.success) {
      return res.data.data || res.data;
    }
    throw new Error(extractErrorMessage(res, 'Failed to create menu item'));
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw new Error(extractErrorMessage(error, 'تعذر إضافة الصنف إلى قائمة الطعام'));
  }
}

/**
 * 5. Get Menu Item By ID
 * GET /api/menu/:id
 * @param {string} id - MongoDB ObjectId of the dish
 */
export async function getMenuItemById(id) {
  try {
    const res = await apiClient.get(`/api/menu/${id}`);
    if (res && res.success && res.data) {
      return res.data.data || res.data;
    }
    throw new Error(extractErrorMessage(res, 'Menu item not found'));
  } catch (error) {
    console.error(`Error fetching menu item ${id}:`, error);
    throw new Error(extractErrorMessage(error, 'لم يتم العثور على الصنف'));
  }
}

/**
 * 6. Update Menu Item
 * PUT /api/menu/:id
 * @param {string} id - MongoDB ObjectId of the dish
 * @param {Object} itemData - Fields to update (e.g. price, priceAfterDiscount, isChefSpecial, available, etc.)
 */
export async function updateMenuItem(id, itemData) {
  try {
    const res = await apiClient.put(`/api/menu/${id}`, itemData);
    if (res && res.success) {
      return res.data.data || res.data;
    }
    throw new Error(extractErrorMessage(res, 'Failed to update menu item'));
  } catch (error) {
    console.error(`Error updating menu item ${id}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر تحديث بيانات الصنف'));
  }
}

/**
 * 7. Delete Menu Item
 * DELETE /api/menu/:id
 * @param {string} id - MongoDB ObjectId of the dish
 */
export async function deleteMenuItem(id) {
  try {
    const res = await apiClient.delete(`/api/menu/${id}`);
    if (res && res.success) {
      return res.data.data || res.data;
    }
    throw new Error(extractErrorMessage(res, 'Failed to delete menu item'));
  } catch (error) {
    console.error(`Error deleting menu item ${id}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر حذف الصنف'));
  }
}

// =========================================================================
// FOOD ORDERS & DELIVERY ENDPOINTS
// =========================================================================

/**
 * 8. Place Food / Delivery Order
 * POST /api/menu/order
 * @param {Object} orderData - { customerName, customerPhone, deliveryAddress, deliveryNotes, orderType, items, paymentMethod }
 */
export async function placeOrder(orderData) {
  try {
    const res = await apiClient.post('/api/menu/order', orderData);
    if (res && res.success && res.data) {
      return res.data.data || res.data;
    }
    throw new Error(extractErrorMessage(res, 'Failed to submit food order'));
  } catch (error) {
    console.error('Error placing food order:', error);
    throw new Error(extractErrorMessage(error, 'تعذر إرسال طلب الوجبات والدليفري'));
  }
}

/**
 * 9. Get All Food Orders (with pagination)
 * GET /api/menu/orders?page=1&limit=20
 * @param {Object} params - { page: 1, limit: 20, status, search }
 */
export async function getAllOrders(params = { page: 1, limit: 20 }) {
  try {
    const res = await apiClient.get('/api/menu/orders', params);
    if (res && res.success && res.data) {
      return res.data.data || res.data;
    }
    return { orders: [], total: 0, page: 1, pages: 1 };
  } catch (error) {
    console.error('Error fetching all food orders:', error);
    return { orders: [], total: 0, page: 1, pages: 1 };
  }
}

/**
 * 10. Get Order By ID or Tracking Code
 * GET /api/menu/orders/:id
 * @param {string} idOrCode - MongoDB ObjectId or Tracking Order Code (e.g. AD-DLV-6896)
 */
export async function getOrderByIdOrCode(idOrCode) {
  try {
    const res = await apiClient.get(`/api/menu/orders/${idOrCode}`);
    if (res && res.success && res.data) {
      return res.data.data || res.data;
    }
    throw new Error(extractErrorMessage(res, 'Order not found'));
  } catch (error) {
    console.error(`Error fetching order ${idOrCode}:`, error);
    throw new Error(extractErrorMessage(error, 'لم يتم العثور على الطلب'));
  }
}

/**
 * 11. Update Order Status
 * PUT /api/menu/orders/:id/status
 * @param {string} idOrCode - MongoDB ObjectId or Order Code
 * @param {string} status - 'pending' | 'preparing' | 'out_for_delivery' | 'completed' | 'cancelled'
 */
export async function updateOrderStatus(idOrCode, status) {
  try {
    const res = await apiClient.put(`/api/menu/orders/${idOrCode}/status`, { status });
    if (res && res.success) {
      return res.data.data || res.data;
    }
    throw new Error(extractErrorMessage(res, 'Failed to update order status'));
  } catch (error) {
    console.error(`Error updating status for order ${idOrCode}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر تحديث حالة الطلب'));
  }
}

// =========================================================================
// DEFAULT SERVICE OBJECT EXPORT
// =========================================================================

export const menuService = {
  // Menu Items
  seedMenu,
  getMenuItems,
  getCategories: getCategoriesBreakdown,
  getCategoriesBreakdown,
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,

  // Orders
  placeOrder,
  getAllOrders,
  getOrder: getOrderByIdOrCode,
  getOrderByIdOrCode,
  updateOrderStatus
};

export default menuService;
