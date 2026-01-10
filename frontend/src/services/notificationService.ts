/**
 * Notification Service
 * API calls for notification management
 */

import apiClient from '../lib/axios';
import { Notification, NotificationFilters, PaginatedResponse, UnreadCountResponse } from '../types';

const BASE_URL = '/notifications';

/**
 * Get all notifications for current user
 */
export const getNotifications = async (
    page: number = 1, 
    limit: number = 20, 
    filters?: NotificationFilters
): Promise<PaginatedResponse<Notification>> => {
    const params = { page, limit, ...filters };
    const response = await apiClient.get(BASE_URL, { params });
    return response.data;
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<number> => {
    const response = await apiClient.get<UnreadCountResponse>(`${BASE_URL}/unread-count`);
    return response.data.count;
};

/**
 * Mark notification as read
 */
export const markAsRead = async (id: number): Promise<void> => {
    await apiClient.patch(`${BASE_URL}/${id}/read`);
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<void> => {
    await apiClient.patch(`${BASE_URL}/read-all`);
};

/**
 * Delete notification
 */
export const deleteNotification = async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
};

/**
 * Delete all read notifications
 */
export const deleteAllRead = async (): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/read`);
};

export default {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
};
